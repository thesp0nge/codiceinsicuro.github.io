---
layout: post
title: "WordPress 4.2 rilasciato e vulnerabile a stored XSS"
promotion: "WordPress 4.2 e precedenti vulnerabili a stored XSS. Leggi qui come correre ai ripari"
modified: 
featured: true
category: [Under attack]
tags: [xss, wordpress, blog, php, cross site scripting, input validation, wordstress]
image:
  feature: stored_xss.jpg
  credit: Jekyll283
  creditlink: https://flic.kr/p/8L3GwN
comments: true
share: true
---

L'ultima versione stabile di WordPress, la 4.2 [è
disponibile](https://wordpress.org/download/) da pochi giorni ed è già
vulnerabile ad un cross site scripting di tipo _stored_.

Un cross site scripting è di tipo _stored_ quando il pattern di attacco viene
salvato nel database e l'exploit dello stesso avviene in una fase successiva.
L'impatto in questo caso può essere molto pericoloso se l'exploit avviene in un
pannello di amministrazione della nostra applicazione, quindi possono essere
sfruttate le permission di un utente privilegiato.

Questo è proprio il caso dell'exploit descritto da [Jouko
Pynnönen](http://klikki.fi/adv/wordpress2.html) che ha scoperto la
vulnerabilità.

Un commento molto lungo viene troncato prima essere inserito nel database
essendo, il tipo di dato _TEXT_ di MySQL, dimensionato a 64K.

Il testo del commento, quando verrà visualizzato, porterà con se dell'HTML
malformato dentro al quale l'attaccante può quindi completare a piacere i tag
per inserire il codice javascript che più gradisce.

In questo filmato si vede l'exploit di questa vulnerabilità con l'inserimento
di un javascript e l'introduzione di una backdoor nel blog.

{% youtube OCqQZJZ1Ie4%}

In questo caso non c'è ancora una patch e disabilitare i commenti può essere
troppo drastico.

Quello che vi consiglio, mentre aspettiamo tutti la version 4.2.1 è quella di
installare [mod_security](https://www.modsecurity.org/) a protezione dei vostri
blog e di installare il [plugin wordstress](http://wordstress.org) per fare
sempre una scansione whitebox delle vulnerabilità delle versioni installate di
WordPress, plugin e temi di terze parti.

Se il buon giorno si vede dal mattino, sarà una lunga settimana.

Enjoy it!
