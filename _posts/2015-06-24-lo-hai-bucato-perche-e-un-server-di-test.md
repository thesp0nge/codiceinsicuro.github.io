---
layout: post
author: thesp0nge
title: "Lo hai bucato perché è un server di test"
promotion: "Hai bucato quel server solo perché è di test. Se è online è un obiettivo, sei d'accordo?"
modified: 
featured: false
category: [Chiacchiere da bar]
tags: [digital agency, agenzia digitale, pubblicità, marketing, server di test, ignoranti digitali, internet, social, yo yo]
image:
  feature: dummies.jpg
comments: true
share: true
---

Sito pubblicitario. Gli utenti riempiono la form, lasciano i loro dati,
partecipano ad una riffa ed intanto entrano nelle meccaniche di ingaggio
pubblicitario. Dobbiamo testare quel sito, lo buchiamo e carichiamo sopra una
web shell.

> Lo hai bucato solo perché è un sito di test non con le configurazioni della
> produzione.

Questo mi sento dire dal ragazzino che gioca a fare l'account manager in
un'improbabile web agency con un nome ridicolo.

Dopo aver raccolto le braccia cadute per terra, decido di rispondere
spiegando...

## Qualche mito da sfatare

### Il server è quello di test

Se una cosa è su Internet, test o no, è alla mercé di tutti. Traffico lecito o
trafico illecito. E controllare un server di test può essermi tanto utile
quanto controllare un server in esercizio.

Quando si pubblica una macchina sul web, la macchina deve essere configurata in
maniera opportuna. I server colabrodo, dove tutto è aperto li lasciamo alle
virtual machine che tutti noi possiamo avere.

### Il database è quello di test

Una volta caricata sopra la shell, navigare un po' nei db non è stato
particolarmente difficile. Quando presenti un dump o uno screenshot preso in
un'attività simile a questa, parte la grande menzogna: _"i dati sono dati di
test, perché questo è il db di test"_.

Tuttavia, sappiamo tutti che i dati usati per il test, visto che devono
mantenere una consistenza semantica, al 90% dei casi sono dati che erano in
produzione una settimana fa (e che probabilmente saranno ancora in produzione).
Di società con una procedura di scrambling dei dati per preparare un db di test
che sia completamente fasullo ma semanticamente corretto, io nella mia vita ne
avrò viste non più di un paio.

### Nessuno conosce la url

Se il tuo sito si chiama ```www.pippo.it```, io che voglio bucarti non mi devo
ingegnare molto per vedere se online c'è anche ```test.pippo.it``` o
```coll.pippo.it```.

L'attaccante quindi conosce la url, tu hai lasciato la tua bella pagina dove
permetti l'upload di file perché ti viene comodo fare i deploy così al venerdì
sera, sei un caciottaro e dovresti fare un altro lavoro e meriti di essere
bucato.

> Purtroppo i tuoi clienti non meritano di dare i dati in mano proprio a te,
> ecco perché mi girano le lame boomerang.

### Off by one

Questa è una delle tante, piccole, storie dell'orrore che quotidianamente vivo.
Mi preme dire che ci sono tante web agency che invece lavorano dignitosamente,
ma purtroppo ci sono certi scappati di casa in giro.

Signori, il web è un postaccio e voi non vi potete permettere di essere
ignoranti. Se il vostro meccanico vi dicesse _"ma sì, l'airbag non l'ho
montato, tanto è solo un'utilitaria"_, voi che fareste?

Siete proprio sicuri che vorrete mettere online un altro sito di test
configurato a caso?

Spero di no.

Enjoy!
