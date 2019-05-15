---
layout: post
author: thesp0nge
title: "Wordstress: penetration testing whitebox per wordpress"
promotion: "Wordstress è un tool di penetration test whitebox #opensource per #wordpress scritto in #ruby"
modified:
category: [Pick'n'chic]
tags: [wapt, wordpress, whitebox, penetration test, plugin, blog, temi, ruby]
image:
  feature: worpress_art.png
comments: true
share: true
---

Se avete mai usato un tool automatico per fare un penetration test di un vostro
blog basato su [wordpress](https://wordpress.org) sapete di cosa sto parlando:
avere risultati attendibili e non zeppi di falsi positivi è un panico.

## Blackbox, whitebox, tanti scatole = tanti cappelli?

Quando stiamo per iniziare un penetration test applicativo, possiamo condurre
il test secondo due grosse scuole di pensiero:

* test senza credenziali, **blackbox** in quanto per il chi conduce il test,
  l'applicazione è come una scatola nera. Zero informazioni. Spesso il cliente
  ci chiede questo tipo di test per avere un test realistico di come agirebbe
  un attaccante, che appunto non ha troppe informazioni.
* test con credenziali, **whitebox** in quanto abbiamo le informazioni per
  testare l'applicazione dall'interno, forse ci hanno dato anche il codice
  sorgente. Questo test è sicuramente più completo rispetto al precedente, ma
  meno realistico... o meglio presuppone che l'attaccante sia entrato in possesso
  di una coppia di credenziali valide.

L'approccio migliore secondo me, se il tempo lo permette, è di presentare al
nostro cliente entrambi i risultati.

Se però il nostro scopo non è appaltare un test a qualcuno ma tenere sotto
controllo le vulnerabilità di uno o più siti, in questo caso basati su
[wordpress](https://wordpress.org), dobbiamo cercare di avere risultati il più
attendibili possibili.

## Limiti del blackbox e wordpress

Come piattaforma di _content management system_, veramente niente da dire;
[wordpress](https://wordpress.org) è il top. Certo, io per il mio piccolo
preferisco usare [jekyll](https://jekyllrb.com) per i miei blog, però la
modularità che wordpress ti mette a disposizione è notevole.

Un sacco di plugin. Un sacco di temi. Un florido ecosistema di sviluppatori. Un
sacco di vulnerabilità. No, seriamente, ne escono **almeno** un paio al giorno.

Non tanto nel core del CMS quanto nel lavoro di, a volte, improvvisati
sviluppatori che arricchiscono wordpress con funzionalità senza curarsi
minimamente degli impatti della sicurezza che il proprio codice avrà su
centinaia di migliaia di siti che utilizzeranno quel codice.

L'assunto è comunque che il sistema di plugin e temi di worpress ha la capacità
di attirare issue di security seconda solo al ciucciotto di mia figlia.

La necessità è che l'incauto sviluppatore, che magari per il suo cliente cura
una decina di siti basati su questo CMS, sia in grado di tenere sotto controllo
la security degli stessi ed evitare di farsi bucare[^1].

L'incauto sviluppatore non sa, non ha tempo e forse non ha voglia di perdersi
nei findings di [wpscan](https://wpscan.org), di webinspect, di appscan, di
nikto e del sacco di falsi positivi che danno come risultato.

L'approccio blackbox, in questo caso specifico, ha un grande limite. Se la
versione 3.2.1 del plugin _foobar_ è vulnerabile ad una SQL Injection, il tool
deve:

* rilevare il plugin _foobar_
* rilevare la versione installata

[wpscan](https://wpscan.org) è il migliore nel rilevare i plugin installati...
semplicemente usa un attacco di forza bruta, enumerando tutti i plugin
esistenti ed osservando la risposta del browser. Codice 404, il plugin non c'è;
qualsiasi altro codice, il plugin è installato. Rilevare la versione? Non
pervenuto.
Lo stesso dicasi dei temi.

Abbiamo alcuni problemi:

* un WAF potrebbe limitare le azioni di wpscan e di sicuro non voglio
  disabilitare i miei WAF solo per fare i test
* faccio un sacco di richieste per enumerare plugin e temi, con il rischio che
  il sito non sia più disponibile ai miei clienti
* non so quale versione del plugin o del tema è installata

A questo punto il tool enumererà tutte le vulnerabilità che conosce per il
plugin _foobar_, ovviamente anche quelle vecchie che non affliggono la versione
installata sul nostro sito.

Avremmo quindi un elevato rumore portato da falsi positivi che nulla
aggiungono, anzi rendono il nostro compito iù difficile. Quello che manca,
infatti, è il tempo per rivedere tutti i findings per escludere quelli reali da
quelli _fake_.

## Dimmi chi sei e ti dirò che vulnerabilità hai

Ho rilasciato [wordstress](https://rubygems.org/gems/wordstress) per fornire
uno strumento di analisi whitebox che andasse a trovare le vulnerabilità di un
sito usando il [database di wpscan](https://wpvulndb.com), che è rilasciato
opensource. Tutto questo partendo da una lista di plugin e temi installati,
ognuno con la propria versione.

Per avere questa lista ho costruito un [plugin per
wordpress](https://wordpress.org/plugins/wordstress) che crea una pagina
virtuale sul sito sul quale è installato. Questa pagina virtuale, la cui url
sarà _http://mioblog/wordstress_, conterrà:

* la versione di wordpress installata
* tutti i plugin installati ed attivi e la loro versione
* tutti i temi installati e la loro versione

Lo scanner quindi non deve tempestare di richieste il mio sito per sapere che
il plugin _foobar_ è installato nella sua versione 3.2.1, userà le informazioni
fornite alla pagina ```/wordstress``` ed andrà a ricercare tutte le
vulnerabilità di _foobar_, se installato e della versione corretta.

Ok, so cosa state pensando. Siete spaventati dal fatto di dare tutte queste
informazioni ad un possibile attaccante. Io sono per la filosofia, se aggiorni
tutto non devi temere, comunque state tranquilli, per poter accedere ai
contenuti della pagina ```/wordstress``` occorre specificare una chiave nella
query string. Questa chiave viene generata facendo l'hash di un po' di
informazioni e memorizzata lato backend nelle impostazioni di wordpress.

L'owner del sito, quindi, gestisce la chiave. La passa a chi lancerà lo
scanner se non è lui stesso a farlo ed avrà sulla scrivania un report di
vulnerabilità 0% false positive free[^2].

[^1]: Seguirà a breve un post sull'ennesima idiozia commessa dal legislatore
      italiano che, alla ricerca della semplificazione, ha depenalizzato un bel po'
      di reati tra i quali la violazione di domicilio informatico e l'accesso non
      autorizzato a sistemi. Signori, 90 minuti di applausi per queste capre.

[^2]: Al netto ovviamente di errori nel database di [wpvulndb.com](https://wpvulndb.com)
