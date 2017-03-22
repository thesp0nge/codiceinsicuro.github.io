---
layout: post
title: "Vulnerabilità collaterali"
promotion: "Introdurre un processo di gestione delle vulnerabilità è un passo fondamentale per avere una security posture aziendale sui temi cybsecurity. Vediamo come."
modified: 
featured: false
category: [post]
tags: [vulnerabilità, opensource, librerie, dipendenze, code review]
image:
  feature: legami.jpg
  credit: Daniele
  creditlink: https://flic.kr/p/avxakD
comments: true
share: true
---

Una cosa che noto, parlando con sviluppatori e persone che fanno _AOM_ sulle
macchine, è la mancata percezione del software di terze parti, come un pericolo
per la sicurezza della propria applicazione.

Prendiamo, per esempio, l'ultima vulnerabilità grave legata al framework
[Struts2](https://web.nvd.nist.gov/view/vuln/detail?vulnId=CVE-2017-5638). Tutte le applicazioni J2EE, basate sulla versione vulnerabile di
Struts2, non importa quanto sviluppate in modo sicuro, non importa quanti
penetration test avessero subito, potevano essere bucate.

Mica male, direi.

Il vostro codice vive all'interno di un vero e proprio ecosistema. Se una delle
componenti dell'ecosistema ha un problema, tutto il sistema, compreso il vostro
codice, eredita quel problema.

Il ciclo di vita di un'applicazione, quindi, non può mancare di una corposa
fase di _gestione delle vulnerabilità_. Periodicamente, deve essere fatto un
assessment dei problemi di tutte le parti in gioco, devono essere messe in
ordine di severità e devono essere stabilite delle priorità di intervento.

E' inutile investire in un ciclo di vita sicuro del software, se poi lascio il
mio codice in esecuzione su software obsoleti e vulnerabili. Attenzione, ho
parlato di gestione della vulnerabilità, non gestione degli incidenti.
Nonostante qualche storyteller voglia farci credere che siano la stessa cosa,
sono distanti come il giorno e la notte.

## Un opensource io vorrei

Il più grande problema dell'opensource sono proprio le persone che lo amano
ciecamente. Mi spiego meglio. Diventare un **fanboy** di una tecnologia, anche
se vale per qualsiasi cosa in questo mondo, fa perdere obbiettività. Una
persona non obbiettiva è una persona che non è lucida. Una persona non lucida
parla per stereotipi, aumentando solo il rumore di fondo.

Linux, e più in generale, l'opensource sono **più sicuri**, è una fregnaccia.
Avere il codice di [NginX](https://nginx.org) a disposizione, non implica
automaticamente che:

* sia sicuro
* qualcuno faccia delle code review.

Se io quindi sto gestendo un portale, che usa NginX come web server e io penso
di essere _al sicuro_, perché uso software opensource, posso richiedere una
licenza gold di venditore di caciotte e pere bollite.

Opensource **può** essere più sicuro perché il codice è a disposizione. Diventa
più sicuro se qualcuno da una mano ai maintainer dei vari progetti, per trovare
bug e vulnerabilità.

Proprio ieri guardavo l'andamento dei dati delle vulnerabilità di un sistema
RedHat 6.nontelodico. Se lasciamo che il nostro software diventi obsoleto, ci
portiamo a casa almeno una trentina di issue di security l'anno. Si, ci sono
anche su Linux, vedo che il paraocchi non l'avete ancora tolto, allora...

## Gestione delle vulnerabilità e postura aziendale

Per avere una buona postura aziendale in campo security, o cybersecurity, o
sicurezza cibernetica, il passo obbligato è quello di censire l'elenco delle
vulnerabilità dei vostri asset, dare una priorità di intervento, agire e
mitigare i rischi portati dal software di terze parti, reiterare il processo
all'infinito.

Questo vale anche per le librerie delle nostre applicazioni web.

Il check più corposo che fa, ad esempio, [dawnscanner](https://dawnscanner.org)
è proprio sulle vulnerabilità delle gemme incluse nel bundle di un'applicazione
Rails, Sinatra, Padrino e presto Hanami.

Sto lavorando su [Owasp Orizon](https://www.owasp.org/index.php/Category:OWASP_Orizon_Project), per introdurre lo stesso tipo di controllo
sulle librerie incluse in un Jar, War o Ear.

Avere un report periodico che ci dica le vulnerabilità che la nostra
applicazione web eredita da una libreria che neanche sapevamo di avere, perché
magari è una dipendenza di una dipendenza di una libreria opensource che
utilizziamo, è **vitale** al giorno d'oggi.

Gestire il ciclo di vita del codice, includendo la parte di gestione delle
vulnerabilità, rende migliore la _security posture_ della mia azienda, scopo
ultimo se vogliamo parlare realmente di supporto cybersecurity alla PMI.

## Off by one

Sulla differenza tra gestione dell'incidente e gestione della vulnerabilità, ci
torno con il [Monday Blues]({{site.url}}/monday-blues) di questa settimana.

In pillole, quello che dovete fare **oggi** per migliorare la vostra postura
aziendale sui temi di _cybersecurity_ è:

* creare e mantenere un asset inventory che comprenda server, applicazioni web
  e applicazioni mobile
* scegliere uno strumento per il vulnerability assessment e, periodicamente,
  manutenere un elenco delle vulnerabilità del software installato a bordo dei
  vostri server
* utilizzare periodicamente un software per la code review che controlli la
  vulnerabilità [A9 - Insecure ](#) della Top 10 Owasp
* definite delle priorità di intervento e agite per mettere in sicurezza
  l'ecosistema delle vostre applicazioni
* reiterate all'infinito

Se avete dubbi su quale strumento utilizzare o come mettere in piedi questo
processo di gestione della vulnerabilità, scrivete a
[paolo@codiceinsicuro.it](mailto:paolo@codiceinsicuro.it) o lasciate un
commento.

Enjoy it!
