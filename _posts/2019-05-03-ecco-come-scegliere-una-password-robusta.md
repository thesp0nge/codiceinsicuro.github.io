---
layout: post
title: "Ecco come scegliere una password robusta"
author: thesp0nge
featured: false
category: [post]
tags: [password, passphrase, chicchi]
image:
  feature: red_signals.jpg
comments: true
share: true
---

Oggi stavo scegliendo una playlist per il lavoro ed arrivo ad un video dal
titolo molto **bold**: Come creare una password robusta.

Soliti consigli ripetuti più volte:
* 8 caratteri almeno
* maiuscole, minuscole, numeri
* almeno 1 carattere speciale

Veniva poi data "hN75xf" come suggerimento di partenza di password **sicura**
alla quale anteporre o postporre dei caratteri secondo una certa logica che
avrebbe consentito all'utente di ricordarsi la parola chiave. Questo, secondo
l'autore non altererebbe la robustezza di "hN75xf".

Ora, come ho commentato all'interessato, "hN75xf" è una password che è lungi da
essere sicura, così come non è sicura "10hN75xf", così come non lo è
"10@hN75xf" o qualsiasi altra diavoleria simile.

La realtà dei fatti è che noi siamo portati a pensare che una parola che non ha
senso per noi e che quindi riconosciamo difficile, sia automaticamente una
password robusta. Ad un tool di password cracking tuttavia, "10@hN75xf" o
"farfallina78!" hanno lo stesso grado di difficoltà: per lui sono una sequenza
di caratteri a caso che, sulla base della potenza di calcolo e del dizionario a
disposizione romperà in tempo paragonabile.

Sono moltissimi i siti che legano a doppia mandata il concetto di
autenticazione con quello di "scegli una parola, ed una sola parola chiave".
Perché?

Senza bisogno di mettere caratteri strani, senza bisogno di regole particolari
(non puoi ripetere l'ultima lettera più di 3 volte, fai una giravolta dopo la
seconda vocale o castronerie del genere), basta permettere all'utente di
inserire una frase di senso compiuto come "password", una bella passphrase e
passa la paura.

Frasi come "Silvia rimembri ancor" o "il gatto miagola sul tetto" sono
computazionalmente molto più complesse di "29Dsdjdsadife%%%34£!/£$$", questo
per la natura stesso dell'attacco a forza bruta. Se ampliamo lo spazio delle
password includendo anche le frasi, abbiamo che un tool che usa il _bruteforce_
dovrebbe provare un numero infinito di possibili combinazioni mentre,
utilizzando una sola parola (seppure complessa) lega lo spazio delle possibili
combinazioni ad un numero finito, grande a piacere.

Scrivevo cose simili [due anni
fa](https://codiceinsicuro.it/blog/entropia-password-e-passphrase/), da una
parte mi stupisce che siamo ancora qui a suggerire gli 8 caratteri, maiuscole,
minuscole e compagnia cantante. Dall'altra parte mi torna invece che chi
suggerisce agli sviluppatori questo genere di meccanismi, non abbia la benché
minima idea del problema pratico e forse non ha mai progettato un meccanismo di
controllo delle password.

Se ti stai domandando come memorizzare una passhprase, bhé applicando un
algoritmo di hashing a tua scelta avrai che **indipendentemente** dalla
lunghezza dell'input, il tuo output avrà la stessa lunghezza.

Usando quindi SHA256, dovrai dimensionare le tue tabelle sia che tu memorizzi
una password, sia che tu memorizzi una passphrase perché avrai sembre bisogno
di 64 caratteri per rappresentare i 256 bit di output [della
funzione](https://stackoverflow.com/questions/2240973/how-long-is-the-sha256-hash).

Qualche riga di python che mostra come applicare uno sha256 ad una stringa
qualsiasi.

{%highlight python%}
Python 3.6.7 (default, Oct 22 2018, 11:32:17) 
[GCC 8.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import hashlib
>>> m=hashlib.sha256()
>>> m.update(b"leggi codiceinsicuro tutti i giorni")
>>> m.digest()
b'\xce\xc3\x97\xe1\xd6\x8en\xa6\x91\x1f\x86\x90\xf6\xa7\xa2\x1b\xe4\x86\xd8\xb5l\x1d\xd6}\xfbj\xea\xf93!|\xac'
>>> m.hexdigest()
'cec397e1d68e6ea6911f8690f6a7a21be486d8b56c1dd67dfb6aeaf933217cac'
{%endhighlight%}

Quindi piantiamola di dare suggerimenti sulla complessità della password
inventando regole il cui unico effetto è quello di creare parole che nessuno
ricorderà mai. Usiamo le passphrase e concentriamoci su altri aspetti della
protezione della nostra applicazione web.

Enjoy it!
