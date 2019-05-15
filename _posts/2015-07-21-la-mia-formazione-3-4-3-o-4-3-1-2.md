---
layout: post
author: thesp0nge
title: "La mia formazione: 3-4-3 o 4-3-1-2"
promotion: "Il mio percorso da ventenne curioso a specialista di sicurezza applicativa"
modified: 
featured: false
category: [Chiacchiere da bar]
tags: [università, certificazioni, spippolare, owasp, formazione, studio]
image:
  feature: strada.jpg
comments: true
share: true
---

Può sembrare autocelebrativo e, avendo una ego _decisamente importante_,
potrebbe anche esserlo, però alla seconda email dove mi viene chiesto quale sia
stato il mio percorso formativo mi sono detto che, forse, poteva essere utile
scrivere cos'ho fatto per arrivare qui.

Come in molti ho amato il mio Commodore 64 giocando e modificando l'esempio
della mongolfiera a zonzo sullo schermo. Poi venne il Pascal alle superiori e
giochi immortali come Monkey Island, Day of the Tentacle e Indiana Jones and
the fate of Atlantis.

Spippolavo anche a 18 anni? No.

## L'Università e quei due corsi che cambiarono tutto

La svolta ci fu il terzo anno di studi universitari. All'epoca dei fatti, 1997,
l'Università Statale di Milano per il suo corso di Laurea in Informatica
prevedeva un triennio comune ed un biennio di specializzazione. Nel 1997 ebbi
la fortuna di incontrare due professori che mi cambiarono completamente la
vita.

Il primo fu il professor Gianfranco Prini con il suo corso di Sistemi
Operativi. Ricordo il consiglio a comprare il Tanembaum, [Modern Operating System](http://www.amazon.it/gp/product/0136006639/ref=as_li_ss_tl?ie=UTF8&camp=3370&creative=24114&creativeASIN=0136006639&linkCode=as2&tag=codicinsic-21) in lingua originale.
Ricordo il box di 6 CD della Walnut Creek con un paio di distribuzioni Linux ed
un po' di pacchetti extra. Ricordo che la versione del kernel era 2.0 e che il
mio vecchio 386 con 4 MB di RAM e 80 MB di harddisk non riusciva a far partire
X. Così feci di necessità virtù e iniziari il mio matrimonio con la linea di
comando.

Il secondo professore al quale devo molto è stato Giampaolo Rossi ed il suo
corso di Architetture 2. Lì comprai il secondo volume che tutti devono avere
sul comodino, [The TCP/IP Illustrated, vol
1](http://www.amazon.it/gp/product/B00I8YFP1Y/ref=as_li_ss_tl?ie=UTF8&camp=3370&creative=24114&creativeASIN=B00I8YFP1Y&linkCode=as2&tag=codicinsic-21)
dello Stevens. Il prof. Rossi ci parlò di Internet o di quello che era
all'epoca, ci parlò del networking, ci parlò di socket. Feci la conoscenza
delle chiamate di sistema per iniziare una comunicazione tra processi e quando
scrissi il mio primo server con il client che lo interrogava, mi sentii
potente.

Alla fine del 1997 capii che amavo vim, unix ed il C. Poi venne il professor
Danilo Bruschi e mi fece capire che amavo anche la security e con lui feci una
tesi _leggermente ambiziosa_. Sviluppai, insieme ad Aldo, mio compagno di studi
che si occupò della parte networking, un modulo per il kernel di linux per
impedire che una macchina diventasse un host malevolo in una rete. Una specie
di IPS in kernel land.

Il 2000 fu l'anno del laboratorio. Leggevo [phrack](http://www.phrack.org),
[BFi](http://www.s0ftpj.org/bfi/),
[Ondaquadra](http://www.autistici.org/hacking_e-zines/), scrivevo tanto codice
C e ne leggevo ancora di più.

Arrivò la laurea e poi il grande mondo del lavoro

## It's showtime

Una delle cose che ho trovato più utile fare, è stato quello di iniziare a
tenere talk. Raccontare le cose che facevo era un modo per affinare
ulteriormente la parte tecnica, perché affrontare il botta e risposta col
pubblico, se non si è preparati è un suicidio.

Di talk ne ho fatti tanti, ho iniziato a WebbIT nel 2003, sono passato per
Smau, per il [Festival ICT](http://www.festivalict.com), il Security Summit e
gli eventi Owasp.

Sono andato a parlare anche a [Railsberry](http://www.railsberry.com) nel 2013,
per la prima volta in una conferenza dedicata agli sviluppatori.

## Certificazioni?

**No, grazie!**

La certificazione è il pezzetto di carta che si ottiene dopo un corso. Non dice
come lavoro, non dice la mia forma mentis, non dice nulla di me se non che ho
studiato per un esame. Mi dispiace, so che ci sono tanti innamorati delle
certificazioni e che non vedono l'ora di aggiungerne una nuova su LinkedIN.
Questa però è la mia opinione, così come una laurea non vuol dire che io sappia
scrivere in Italiano, e tanti giornalisti coi loro congiuntivi sbagliati ce lo
confermano, una certificazione non significa che io sappia condurre un
penetration test, che sappia fare una code review, che sappia mettere in piedi
un processo di ciclo di vita sicuro del codice.

Il tempo che avrei investito per certificarmi CISP, CISA, CISLP, CIDR, CI$%,
l'ho impiegato in maniera più proficua leggendo blog, sviluppando, viaggiando e
vedendo fuori nel mondo come affrontano il problema della sicurezza
applicativa.

## Off by one

Questa è la strada che ho fatto io. Non è detto che funzioni per tutti e non è
detto che tutti ci si ritrovano. Qualche chicca però mi sento di consigliare al
lettore che passa di qui:

* studiate. Non è vero che l'Università non serve ad un cazzo. Anche un corso
  come Informatica Teorica che può sembrare inutile porta qualcosa di utile. Se
  un giorno dovrete confutare ad un vendor che un tool di code review non è in
  grado di esaminare con assoluta certezza un codice, lo potete fare grazie a
  [questo](https://it.wikipedia.org/wiki/Soddisfacibilità_booleana).
* scrivete codice. Tanto. Altrimenti non saprete mai dire ad uno sviluppatore
  come aggiustare il suo. E farete la figura dei cioccolattai.
* leggete. Anche cose che non c'entrano nulla con l'informatica. Leggete di
  matematica, di filosofia, di fisica, di astronomia. Aprite la vostra mente, vi
  aiuterà quando sarete di fronte ad un problema.
* viaggiate. Andate a vedere come lavorano fuori dall'Italia, partecipate a
  conferenze e create un network. Vi tornerà utile.
* non aspirate a diventare manager in qualche blasonata società di consulenza.
  A meno ovviamente di barattare l'anima tecnica che è in voi.
* condividete. Scrivete un blog, parlate delle vostre idee, fatevele smontare.
  E' la chiave per capire se sono vincenti o no. E poi più ne parlate più le
  migliorate.
* siate curiosi. Ma questo vale sempre nella vita.

Enjoy it!

