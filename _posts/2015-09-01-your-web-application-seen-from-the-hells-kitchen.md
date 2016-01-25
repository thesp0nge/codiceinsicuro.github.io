---
layout: post
title: "Your web application seen from the hell's kitchen"
promotion: "Al prossimo RubyDay, a Torino a Novembre, terrò un talk che mostra le fasi di progettazione e costruzione di una web app dagli occhi dell'attaccante."
modified: 
featured: true
category: [Chiacchiere da bar]
tags: [rubyday, talk, sicurezza applicativa, gente losca, awareness]
image:
  feature: vicolo.jpg
  credit: Giorgio Minguzzi
  creditlink: https://flic.kr/p/oVvZdC
comments: true
share: true
---

Quando ho risposto al _call for paper_ per il [RubyDay](http://www.rubyday.it)
ho voluto che il mio intervento avesse un titolo interessante. _"Almeno il
titolo"_, mi sono detto.

Il prossimo Novembre, a Torino, mentre ci saranno molti brillanti sviluppatori
amanti di [Ruby](http://ruby-lang.org/en), terrò un workshop di un'ora e mezza,
stabilendo per me un record in durata, sulle fondamenta della sicurezza
applicativa, vista da un attaccante.

Agli sviluppatori voglio tanto bene, ma quando guardando il loro codice, e
succede anche a me con [dawnscanner](https://github.com/thesp0nge/dawnscanner)
ad esempio, lo guardano con gli occhi dell'innamorato. L'applicazione web è,
per il suo creatore, una sorta di obelisco che si staglia lucente nel deserto
baciato dalla luce del primo Sole.

Riflessi color oro e brezza delicata sulla sommità della punta dove, come un
baluardo dei regni di _tolkeniana_ ispirazione, si staglia il vessillo di un
regno fatato. Vessillo simbolo di forza, potenza e robustezza.

Tutti guardano a quest'applicazione web come ad un simbolo e ne hanno
riverenza. Nessuno osa criticare o anche solo buttare una cartaccia o una
foglia confezione del _pan di via_ nei pressi di tale magnifica torre.

La realtà non è così. Internet è un postaccio. Sembra più un sobborgo di
qualche città metropolitana dipinta in un romanzo _sci-fy_. Senza scomodare il
_deep web_, la Rete che conosciamo è piena zeppa di individui che vogliono
usare il codice online per le peggio cose.

_Perché lo fanno / Perché dovrebbero farlo ?_ è la prima domanda che smonto
durante gli incontri di awareness che tengo periodicamente. E' un po' come
quando un bimbo innocente ti chiede _perché c'è la guerra_ o _perché le persone
rubano_. Motivazioni ce ne sono talmente tante e con fattori talmente complessi
che, forse, la risposta più completa è una non risposta: _"perché succede da
sempre, e sempre succederà"_.

## Dalle fondamenta

Non si parte dall'hosting, dal server fisico o virtuale che fa girare il nostro
codice. Si parte da prima. Si parte dal disegno dell'architettura, dalla
progettazione.

La sicurezza è qualcosa che la si ottiene un pezzetto alla volta, immaginando
la disposizione delle nostre componenti in campo, documentando i flussi dati,
stabilendo quali le API esposte, quali le funzionalità offerte e descrivendo
cosa mi aspetto in input e in output, a livello macro.

> La documentazione, tutti la odiano, in pochi la fanno come dio comanda, ma è
> proprio la cosa dalla quale partire.

## Agli strumenti

Una volta disegnato tutto su carta, ci possiamo divertire. Dobbiamo realizzare
la nostra infrastruttura, scegliere i sistemi operativi, configurarli in modo
sicuro, scegliere il web server, il framework applicativo, il dbms.

Poi possiamo iniziare gli sviluppi. Poi.

Se salti anche solo un punto, è come se tu stessi assemblando un'auto alla
rinfusa, senza scegliere in modo armonico le varie componenti in relazione alla
potenza del motore o alle prestazioni che vuoi ottenere. Il risultato sarà
l'incapacità della tua applicazione a scalare e comunque la costruzione di un
codice che non sarà resistente e che verrà giù al primo attacco. Che ci sarà,
prima o poi.

## Off by one

Questo sarà il mio talk in soldoni. Una camminata nella realizzazione di
un'applicazione molto semplice come un portalino per _todo_ list dove andremo a
soffermarci volta per volta per capire cosa può fare un attaccante.

Speriamo bene. Vi aspetto al [RubyDay](http://www.rubyday.it).

Ah, bentornati dalle vacanze.

Enjoy it!
