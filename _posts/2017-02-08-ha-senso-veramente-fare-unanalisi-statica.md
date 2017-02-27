---
layout: post
title: "Ha senso veramente fare un'analisi statica?"
promotion: "Code review è una buzzword da spendere in prevendita o qualcosa che serve veramente? Vediamolo insieme."
modified: 
featured: false
category: [post]
tags: [dawnscanner, sast, code review, opensource]
image:
  feature: compito.jpg
  credit: Claudio Migliavacca
  creditlink: https://flic.kr/p/4b2H67
comments: true
share: true
---

Ieri ho fatto una call con [Luca Guidi](https://lucaguidi.com). Lo scopo era supportare il suo framework MVC [Hanami](https://hanamirb.com) all'interno di [Dawnscanner](https://dawnscanner.org).

Mentre mettevo a posto gli appunti, ah una cosa importante, se fate un hangout la chat di gruppo sparisce finita la call, quindi conviene sempre segnarsi le cose; dicevo, mentre mettevo a posto gli appunti, pensavo come l'approccio migliore non possa venire da una mera analisi statica del codice.

Il codice sorgente è qualcosa di vivo, di qualcosa che si nutre di dati e che esegue azioni, non è un tema che posso correggere oppure no. Quello lo faccio solo se devo verificare la correttezza sintattica delle keyword del codice.

Pensavo insistentemente alle API che Luca mi ha mostrato, per caricare un progetto Hanami e mi sono convinto di una cosa.

Terminata una prima fase di mera analisi statica, ad esempio delle gemme di terze parti caricate nel progetto, [dawn](https://dawnscanner.org) deve necessariamente comportarsi come il loader del progetto, anzi lo deve invocare.

Caricato il progetto Hanami io ho il codice vivo, pronto per essere sollecitato con payload strani o simili.

Sì lo so, si chiama analisi ibrida del codice ed ha essa stessa i suoi limiti. Tuttavia penso che per il futuro sposterò l'attenzione sia di dawn che di orizon su questo approccio. Per il primo è semplice, mentre per il secondo spero che la reflection di Java venga in mio soccorso.

Enjoy it!
