---
layout: post
title: "Di pipeline, processi ed automazione"
promotion: "Automazione, evoluzione. Per un 2016 dove anche l'appsec diventi agile."
modified: 
featured: true
category: [Chiacchiere da bar]
tags: [pipeline, automazione, processi, sicurezza, sicurezza informatica, sviluppo agile, sviluppo acdc]
image:
  feature: pipes.jpg
  credit: atomicity
  creditlink: https://flic.kr/p/4GGNw
comments: true
share: true
---

In questo mese, sono stato preso da [dawnscanner](http://dawnscanner.org) che
ha raggiunto la versione 1.5.1 con un bel numero di innovazioni e dalle _ultime
cose da fare_ prima delle meritate feste natalizie.

Guardando indietro al 2015, ho potuto osservare una cosa. Il numero di attività
di sicurezza applicativa che ho svolto in azienda sono aumentate, anche a
dispetto che molti non le tollerino o le vedano ancora con un occhio diffidente
e sospettoso.

Questo aumento indica, anche, che si sono fatti più progetti. Più progetti,
nello stesso arco temporale, gestiti a livello di test di security dalle stesse
persone. BUM.

## Approcciare il cambiamento

E' innegabile, il modo di lavorare in azienda è cambiato. Complice la
virtualizzazione o nuovi paradigmi nello sviluppo software, la filiera si è
accorciata. Vuoi un server? Tempo un giorno ed hai pronta la tua immagine
virtuale con tanto di sistema operativo al seguito. Vuoi un sito? Lo fai, o lo
commissioni, usando un approccio agile; qualche iterazione e si va online con
un semi lavorato che sarà raffinato in corso d'opera.

Lato sicurezza applicativa, come si può rispondere a questo? Da una parte i
test di security sono importanti, dall'altra parte non puoi fermare un online
di un progetto sviluppato in una settimana per una dozzina di giorni di
penetration test applicativo.

Se dal nostro punto di vista non cambiamo approccio, è la fine. Perderemo
clienti interni. Siti e server andranno online senza i nostri controlli ed
assisteremo all'inevitabile fila di gente che si presenterà da noi arrabbiata
perché è stata bucata, incurante che nessuno abbia testato i loro siti.

## Pipeline

Se ne inizia a parlare un po'. Qui sul blog, abbiamo visto come [testare le password in
automatico dei nostri
utenti]({{site.url}}/blog/testiamo-in-automatico-le-password-dei-nostri-utenti/),
abbiamo parlato di [testing whitebox per
WordPress]({{site.url}}/blog/wordstress-penetration-testing-whitebox-per-wordpress/)
o di come usare [nmap per fare più di un
portscan]({{site.url}}/blog/come-fare-un-vulnerability-assessment-con-nmap/).

Oltreoceano, [Weaver](https://www.youtube.com/watch?v=1CDSOSl4DQU) e [Matt
Tesauro](https://www.youtube.com/watch?v=gmOCPRD2foo), parlano della loro
esperienza della creazione di una pipeline di application security.

L'approccio naturale, per abbracciare questo cambiamento è appunto,
automatizzare.

Non si può testare tutto manualmente, soprattutto se si vuole coprire tutta la
trafila server, web application, database e codice sorgente. Anche il processo
di security test deve essere automatizzato e paralellizzato il più possibile.

Le regole d'oro per la costruzione di una pipeline sono:

* partire da un sistema per collezionare le richieste. Questa parte, dipende
  molto dalla struttura aziendale nella quale è calata. L'idea di base è
  permettere agli utenti interni di ingaggiarvi, poi idealmente dovrete creare i
  ticket sulle vostre code.
* avere dei tool che sono in grado di parlare con il mondo esterno, via API,
  via batch, via database... non importa come, non devono essere sistemi chiusi.
* scegliere un sistema di orchestrazione che vi aiuti nella gestione del
  workflow dei test che state portando avanti.
* scegliere un sistema che vi aiuti nella classificazione delle vulnerabilità e
  nella gestione della reportistica
* ultimo, ma non meno importante... dovete procurarvi qualcosa che vi permetta
  di gestire il feedback dei vostri clienti interni.

Lo scopo ultimo di questa trafila è, lavorare un sacco per tirare in piedi
tutto il sistema e poi lavorare il meno possibile. I sistemi che saranno
meritevoli di un test approfondito e manuale, saranno già parzialmente coperti
da una serie di controlli automatici che non rallenteranno l'_online tanto
agoniato_, e voi potrete concentrarvi a ridosso del rilascio con i test di
fino.

## Off by one

Evoluzione. Fare application security in azienda non è più avere una
distribuzione Linux su un portatile scrauso e lanciare nmap. Non è neppure fare
il super manager, con quintali di lacca (e di lacché) ed andare a sproloquiare
di saibersichiuriti facendo presentazioni strategiche e poc che non portano a
niente.

Evoluzione. Fare application security in azienda significa capire dove sta
andando il mondo del software, dove sta andando il team di sviluppo della
propria organizzazione e cercare di coprire le issue di security andando in
accordo ed in armonia al loro modo di lavorare.

Evoluzione. Mettersi in gioco e far fare **la parte non creativa** alle
macchine. Le abbiamo inventate apposta.

Enjoy it!
