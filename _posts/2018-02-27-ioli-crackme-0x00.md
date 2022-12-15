---
layout: post
author: thesp0nge
title: "IOLI Crackme 0x00"
promotion: "Si inizia l'avventura in preparazione alla certificazione OSCE, con questi semplici esercizi introduttori al binary patching"
modified:
featured: false
category: [post]
tags: [osce, binary exploitation, crackme, ioli, radare, binary patching]
image:
  feature: binary_patch.jpg
comments: true
share: true
---

Smaltita la sbornia della certificazione e ricevuto il tanto agoniato _"pezzo
di carta"_, è tempo di pensare al prossimo passo. Il prossimo passo si chiama
[OSCE](https://www.offensive-security.com/information-security-certifications/osce-offensive-security-certified-expert/),
è ancora più tosta ed è incentrata sulla scrittura di exploit.

Per partire, ho deciso di iniziare questo viaggio dalla binary exploitation,
con degli esercizi base, per prendere confidenza con l'assembly ed il patching
di file binari.

I primi esercizi che ho scelto sono gli [IOLI
Crackme](https://github.com/Maijin/Workshop2015/tree/master/IOLI-crackme), una
serie di file binari pensati per essere patchati per accettare qualsiasi
password in ingresso.

## crackme0x00

La prima cosa che ho fatto, analizzando l'eseguibile crackme0x00, è stato
quello di stampare tutte le stringhe attraverso il comando _strings_. Tra il
testo all'interno dell'eseguibile, una stringa _250382_, poteva essere una
password. Provandola, otteniamo il messaggio che ci conferma che è la password
corretta.

{% asciicast 165681 %}

Tuttavia, lo scopo dell'esercizio è quello di modificare il binario affinché
accetti qualsiasi password in ingresso. Per fare questo, usiamo radare2, uno
strumento che aiuta nel debugging e nel disassembly, incluso in Kali Linux e
disponibile per qualsiasi sistema operativo.

Lanciando radare coi parametri -A e -w, diciamo al tool di iniziare a fare
delle analisi sul binario (-A) aprendo il file in scrittura (-w) per farne il
patching.

Osservando il codice della funzione main, è immediato vedere il punto dove
viene caricato il valore costante "250382", della password, dove viene fatto il
compare con quanto letto dall'utente e il jump nel caso di successo.

Tutto quello che dobbiamo fare, quindi, è modificare l'istruzione di jump, da
condizionato ad una situazione di uguaglianza, ad un jump non condizionato. Per
fare questo, ci posizioniamo sull'istruzione di jump, attraverso il comando 's'
specificando l'indirizzo dell'istruzione interessata e con il comando 'wa',
scriviamo il codice assembly corrispondente ad un salto non condizionato.

In questo modo, qualsiasi sia la stringa inserita dall'utente, verrà preso il
branch che porta ad un messaggio di password accettata.

{% asciicast 165683 %}

## Off by one

Questo esercizio era veramente molto semplice e mostra un utilizzo molto
semplice di radare per disassemblare un binario, farne del reverse, capire dove
e cosa modificare e modificare il codice per cambiare il comportamento del
binario stesso.

Una volta finita questa serie, penso di passare agli esercizi di Stack Overflow
di [Protostar](https://exploit-exercises.com/protostar/).

La linea guida che sto seguendo, per iniziare la preparazione all'OSCE è quella
descritta in questo [post](https://tulpa-security.com/2017/07/18/288/). Il
viaggio sembra lungo, ma ormai... fatta la prima tappa bisogna per forza
continuare.

Enjoy it!
