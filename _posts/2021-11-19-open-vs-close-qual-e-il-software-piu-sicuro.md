---
layout: post
title: "open vs close: qual è il software più sicuro?"
author: thesp0nge
featured: false
category: [post]
tags: [opensource, closedsource, open, close, linux, apple, microsoft, ssdlc]
image:
   feature: morse.jpg
   author_id: chriscurry92
   author_name: Chris Curry
   author_link: https://unsplash.com/@chriscurry92
   link: https://unsplash.com/photos/j5s_uLajP2o
comments: true
share: true
---

[Una settimana fa su
LinkedIN](https://www.linkedin.com/posts/paolo-perego_ho-avuto-un-interessante-confronto-in-un-activity-6864936392217137152-AjFq),
chiedevo quale dei due modelli, open vs closed, desse il software più sicuro.

La domanda è assolutamente mal posta e serve solo per far nascere un
brainstorming che, se non controllato, può degenerare nel più classico dei
flame.

L'idea nasce dall'ennesima difesa a spada tratta fatta da una persona in un
thread dove ho commentato, al grido di "l'opensource è più sicuro perché il
codice è aperto". Vero un paio di ciufoli.

Mi sono lanciato quindi in questa domanda acchiappaclick, 1300 views in realtà,
neanche tante e 13 commenti, decisamente pochi per un wannabe-influencer de
noartri, con lo scopo di far ragionare su una cosa tanto basilare quanto spesso
ignorata: se il codice è a disposizione, ma nessuno ne fa una review, allora
quel codice potrebbe avere problemi di sicurezza.

Da qui poi nasce il corollario: perché nessuno (o meglio, statisticamente in
pochi) fa review di codice open?
1. costa
2. è time consuming
3. molti sedicenti security experts non hanno mai visto codice in vita loro

Dal thread che ne è seguito, sono saltati fuori spunti interessanti.

Secondo [Giordano](https://www.linkedin.com/in/sassaroli/) si deve, per prima
cosa chiarire cosa si intende per "sicuro". Assolutamente d'accordo. Diciamo
che nella discussione, col termine "sicuro" indichiamo un software con "poche"
vulnerabilità degne di nota usate in attacchi reali. Giordano poi conclude con
un'opinione che condivido pienamente: ["la mia opinione è che uno non sia
migliore
dell’altro"](https://www.linkedin.com/feed/update/urn:li:activity:6864936392217137152?commentUrn=urn%3Ali%3Acomment%3A%28activity%3A6864936392217137152%2C6864960846334828545%29&replyUrn=urn%3Ali%3Acomment%3A%28activity%3A6864936392217137152%2C6864965138009624577%29)

Di questa stessa opinione, ovvero che i due modelli di sviluppo producono
software di qualità equivalente dal punto di vista della security, se
implementati in maniera egualmente rigorosa e soprattutto, una volta sul campo,
amministrati in maniera competente, è anche
[Christian](https://www.linkedin.com/in/christianparmigiani/).

_Disclaimer:_ Christian e Giordano sono miei amici di lunga data ed il primo è
da sempre legato al mondo del software di casa Microsoft.

[Antonio](https://www.linkedin.com/in/antonio-piovesan-5670049/) ha invece le
idee molto chiare: ["Open... tutti possono contribuire a trovare/fissare
vulns..."](https://www.linkedin.com/feed/update/urn:li:activity:6864936392217137152?commentUrn=urn%3Ali%3Acomment%3A%28activity%3A6864936392217137152%2C6864939006300323840%29).
La mia seguente domanda è tuttavia rimasta senza risposta: è vero che tutti
possono contribuire, ma quanti realmente lo fanno? In percentuale chi
proattivamente fa code review sui tanti progetti opensource? Statisticamente
pochi e la mancanza di risorse è il driver principale.

Non è economicamente, né professionalmente sostenibile un modello _best effort_
dove faccio una code review quando capita a tempo perso.

Il mondo closed ha invece dei processi aziendali, con un proprio budget, per
allocare risorse per affrontare il problema della sicurezza del codice. Non a
caso, molto del materiale su threat modeling e ssdlc, nasce proprio dalla casa
di Redmond.

> Ma allora perché anche il codice proprietario, pur avendo risorse adeguate ha delle vulnerabilità?

Provo a buttarla lì: perché non è il modello di licenza quello che garantisce
che il software sia sicuro o meno.

Secondo me quindi, ha davvero poco senso chiedersi se a priori un modello sia
vincente sull'altro. Ha veramente tanto senso, mettersi a supportare i progetti
upstream su Github o Gitlab e cercare e riportare issue di sicurezza, magari
contribuendo con una patch. Allora sì che il modello open, assume un ruolo
fondamentale.

Quando poi implementiamo il nostro software, assicuriamoci sempre di seguire
linee guida di hardening: passo fondamentale per la messa in sicurezza di
qualsiasi servizio.

## Cosa faccio io di lavoro?

Da marzo 2021 lavoro in [SUSE](https://www.suse.com), come _product security
engineer_. Al di là di avermi cambiato completamente la vita in meglio, mi ha
permesso finalmente di arrivare in una società di prodotto, dove la security
gioca un ruolo fondamentale.

Quello che faccio, insieme ai miei colleghi, è prendere il codice che sta per
andare nella distribuzione, farne una revisione ed eventualmente entrare in
contatto con gli sviluppatori nel caso alcune vulnerabilità vengano rilevate.

Parte quindi il processo di responsible disclosure che si conclude con la patch
e con l'integrazione di quel particolare pacchetto nei repositori.

L'ho un po' semplificata ma a grandi linee realizziamo sul supporto sul mondo
open che permette di alzare un po' l'asticella. Come noi anche le altre
distribuzioni hanno team analoghi ma così come noi, anche i vendor di software
con licenze proprietarie fanno esattamente la stessa cosa.

Di quello che succede nel mio mondo, spero di ricominciare presto con dei
contenuti video.

## Off by one

Quindi, la mia personale risposta alla domanda del flame del secolo è che non è
il LICENSE.md del caso a rendere un software più sicuro di un altro e che, vero
che il codice è lì, però bisogna anche guardarci e guardarci con competenza.

Voglio lanciare un'iniziativa per tutti i miei lettori. Prendete un progetto
opensource a piacere, non serve sia enorme, anche una libreria che usate nel
vostro lavoro.

Dedicate a questo progetto il 10% del vostro tempo settimanale, contribuendone
alla sicurezza.

Scrivete poi un report su come è andata, condividetelo coi social usando
l'hastag #takecarefoross, spargete la voce e cerchiamo di far crescere il
numero di persone che contribuisce a tutto questo codice aperto che c'è nel
mondo.

Vogliamo il codice sicuro? Allora collaboriamo!

Enjoy it.
