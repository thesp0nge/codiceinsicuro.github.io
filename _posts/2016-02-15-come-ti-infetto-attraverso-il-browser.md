---
layout: post
author: thesp0nge
title: "Come ti infetto attraverso il browser"
promotion: "Non solo un allegato malevolo. Anche un sito web compromesso può essere un vettore di diffusione di malware. Vediamo come."
modified: 
featured: false
category: [Spinaci]
tags: [malware, ransomware, browser, javascript, js, sicurezza applicativa]
image:
  feature: js_moleskine.jpg
comments: true
share: true
---

Metti un venerdì sera in un pub. Si parla un po' anche di ICT, del mercato,
delle disillusioni e delle nuove tendenze in fatto di attacchi informatici.

> Ho capito che se clicco sull'allegato mi infetto perché decido io di lanciare
> il vettore d'attacco, ma attraverso il browser e la sua sandbox, come fa un
> javascript ad infettarmi?

Dai tante cose per scontate che, a conti fatti, hai sempre messo l'infezione
via javascript nella casella _"ehi, c'è anche questa"_, ma non ti sei mai posto
il perché può succedere.

Vista la scena muta fatta venerdì, vediamo di rimediare.

## I pazienti 0. Qualcuno ha detto WordPress?

Prima di vedere, come tecnologicamente sia possibile infettare una macchina
attraverso un javascript, parliamo anche degli untori.

Quando raccomando di curare la sicurezza di un sito web, non tralasciando la
parte sistemistica, vengo spesso ignorato. In realtà, qualsiasi sito web può
essere appetibile per un attaccante che vuole lanciare una campagna di malware.

L'idea è semplice. Buco un sito e ne modifico il codice, affinché includa un
javascript, solitamente ospitato in forma minimizzata ed offuscata, in qualche
server bucato in precedenza. Questo javascript verrà utilizzato per portare
avanti un'infezione di massa e forzare, innocui utenti dell'Internet quotidiana
a scaricarsi codice malevolo nella speranza non sia presente un antivirus
aggiornato o un utente smaliziato.

Perché ho parlato di [WordPress](https://wordpress.org) nel titolo? Semplice.
E' il CMS più diffuso al mondo. Milioni di siti web girano su versioni, a volte
drammaticamente poco aggiornate di WordPress. Il problema principale, non è
tanto il CMS utilizzato o [PHP](http://www.php.org), che sembra essere
diventato il _nuovo W1nz0z_ sulle bocche di tante _wannabe[^1]_
Il problema di WordPress sono i plugin e temi, scritti senza il minimo concetto
di sicurezza applicativa.

## L'ombra dello Scriptone

Lo scorso novembre, sucuri pubblicò un
[post](https://blog.sucuri.net/2015/11/jquery-min-php-malware-affects-thousands-of-websites.html)
sull'uso di una versione fake di jquery per distribuire malware. In un dominio
che richiamava, quello di jQuery, era stato messo un codice javascript
malevolo.

Questo codice, dopo una 10 di secondi di timeout, caricava dinamicamente un
altro codice javascript in hosting su un sito sotto il controllo
dell'attaccante.

Partendo dalla violazione di uno o più siti, basati in questo caso o su
WordPress o su Joomla, altro popolare CMS, sempre scritto in PHP, veniva
distribuito codice malevolo per caricare il payload dell'attacco da un sito
terzo.

> Perché non iniettare direttamente il codice del malware nei siti compromessi?

Buona domanda. Da una parte, perché di solito il loader non include solamente
un sito da cui scaricare il malware. Partendo dal presupposto che prima o poi i
siti verranno messi in blacklist, l'attaccante vuole poter avere un po' di
flessibilità e quindi scorporare il loader da uno o più codici malevoli diversi
che ha depositato in giro per Internet.

In generale, disaccoppiare queste due fasi, mi da comunque un po' di
flessibilità anche per gestire eventuali update al codice del malware vero e
proprio.

Ovviamente, un javascript caricato ed eseguito nel mio browser può fare tante
cose cattive. Ad esempio può inviare le mie credenziali via HTTP ad un sito
controllato dall'attaccante o, meglio ancora, può scaricare cose sul mio
laptop.

Ad esempio, nel malware descritto da questo [post su Spiderlabs](https://www.trustwave.com/Resources/SpiderLabs-Blog/3-in-1-Malware-Infection-through-Spammed-JavaScript-Attachments/), il javascript che fungeva da loader, scaricava tre eseguibili:

* un eseguibile rendeva il client vittima della botnet
  [Fareit](http://malware.dontneedcoffee.com/2012/06/inside-pony-17.html) il cui
  scopo era il furto di credenziali di siti ftp, email, portafogli bitcoin.
* un codice che rubava i contatti dalla rubrica di Outlook per inviarli al sito
  _spamhausgandon[.]com_
* in ultim'analisi il codice di Cryptolocker, per non farsi mancare nulla.

In questo caso, i malware erano eseguiti attraverso [Windows Script Host
(WSH)](https://support.microsoft.com/it-it/kb/188135). Target erano quindi
utenti di casa Microsoft, che possono proteggersi iniziando a [disabilitare
WSH](https://technet.microsoft.com/en-us/library/ee198684.aspx)

## Off by one

Ok, niente panico. Non serve più quindi evitare di cliccare PDF e allegati a
caso. Bisogna stare attenti anche a dove si naviga... il problema è come
riconoscere un sito compromesso da uno integro?

Ad esempio possiamo usare estensioni come [WOT](https://chrome.google.com/webstore/detail/wot-web-of-trust-website/bhmmomiinigofkjcapegjjndpbikblnp) che aggiunge un'informazione reputazionale sul sito web. Possiamo usare l'estensione di [VirusTotal](https://www.virustotal.com/en/documentation/browser-extensions/) e ricordarci di installare e mantenere aggiornato il nostro Antivirus.

Io, ad esempio, sul Mac uso [Avast](https://www.avast.com/it-it/mac). Ho
configurato il firewall interno. Cerco di usare sempre un po' di raziocinio ma
so di non essere sicuro al 100%.

L'importante, come sempre... è esserne consapevoli.

Navigate sicuri ed... enjoy it!

**UPDATE**

Per proteggere il vostro browser, vi consiglio caldamente di andare sul sito [MalwareBytes](https://www.malwarebytes.org/antiexploit/) ed installare il loro kit di [anti exploit](https://www.malwarebytes.org/antiexploit/)

[^1]: un wannabe potremmo definirlo un banfone tecnologico. Un personaggio che
      vorrebbe essere un hacker di tutto rispetto, travisando ovviamente il
      significato del termine stesso, ma non ha né le competenze tecnologiche,
      né la voglia di mettersi in gioco ed imparare.
