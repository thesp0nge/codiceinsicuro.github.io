---
layout: post
author: thesp0nge
title: "bettercap: rimettiamo al centro l'attaccante"
promotion: "Scopriamo bettercap, un altro tool italiano per il MITM."
modified: 
featured: false
category: [under]
tags: [bettercap, ruby, mitm, parser, credenziali, http, ftp]
image:
  feature: divieto_discarica.jpg
comments: true
share: true
---

Sarà per la nostra vena diplomatica, sarà perché abbiamo una buona dialettica
ma all'italiano piace essere in mezzo alle discussioni.

[Ettercap](https://ettercap.github.io/ettercap/) fino a ieri era il signore,
incontrastato ma decadente, dei tool per il _man in the middle_. Incontrastato
perché di tool che coprissero un ampio spettro di funzionalità come la creatura
di Alor e Naga, ce n'erano pochi. Decadente perché ormai non ci lavorava più
nessuno.

Questo fino a ieri, fino a quando [Simone "evilsocket"
Margaritelli](https://twitter.com/evilsocket) ha annunciato la versione 1.1.1
di [bettercap](http://bettercap.org). Bettercap è un tool, scritto in Ruby, che
realizza un framework modulare ed estensibile per eseguire attacchi di tipo
_man in the middle_.

Il codice, ben scritto, rappresenta sicuramente un punto di svolta per lo
spippolamento quotidiano. Su twitter ieri, spinti forse dall'hype per il nuovo
giocattolo, ci si immaginava già bettercap su un rasperry-pi montato su un
drone. Scenario in realtà che mi aspetto già qualche _matto_ avrà messo in
campo.

Bettercap è una gemma ruby, quindi la potete installare con il classico ```gem
install bettercap```. Attenzione, richiede i privilegi di root per poter andare
a guardarsi i pacchetti in transito. La documentazione ufficiale ricorda di
usare ```sudo``` per lanciare il binario.
Se, come il sottoscritto, avete fatto un gemset con rvm per i vostri tool da
spippolamento, potete usare ```rvmsudo``` ed unirvi al divertimento.

Una volta lanciato, è possibile intercettare il traffico sulla VLAN sulla quale
siamo attestati e lasciare spazio agli sniffer e recuperare credenziali, URL e
tutto quello non protetto dalla crittografia.

bettercap ha anche la funzionalità di proxy trasparente. Possiamo quindi
utilizzarlo per loggare tutte le chiamate HTTP e HTTPS (in questo caso vedremo
solamente l'URL richiesta) che il nostro browser andrà a fare. Utile quando si
vuol capire un po' cosa fa un'applicazione web, soprattutto in maniera
asincrona via AJAX.

## Off by one
Che dire? bettercap sembra proprio un bel tool e non solo perché è scritto in
ruby. Merita sicuramente di entrare nell'arsenale di tutti i giorni.

E voi lo avete già provato? Che ne pensate?

Enjoy it!
