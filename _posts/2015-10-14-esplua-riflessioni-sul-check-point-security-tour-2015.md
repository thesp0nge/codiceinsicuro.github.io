---
layout: post
author: thesp0nge
title: "Esplua': riflessioni sul Check Point security tour 2015"
promotion: "Tra #exploit pronunciato alla francese ed analisi di #malware in #sandbox passando per automazione dell'ssdlc. Considerazioni sparse sulla tappa di Milano del #cpsectour2015"
modified: 
featured: false
category: [Chiacchiere da bar]
tags: [vendor, evento, poca banfa, apt, malware, exploit, threat prevention]
image:
  feature: exploit.png
comments: true
share: true
---

Oggi, sono stato alla prima tappa del [Check Point security tour 2015](http://store.checkpoint.com/events/invitationPage.htm;tenantID=events?method=enterInvitation&eventCode=securitytourmilano2015), un
evento organizzato da [Check Point](https://www.checkpoint.com) per parlare di
prodotti, vision, casi di studio.

Mi porto a casa, stranamente visto che sono parecchio _choosy_ su questi
eventi, delle buone sensazioni. Pragmatico. Poco marketing e quel poco mai
ostentato, mai messo su un piedistallo.

Essendo un evento più dedicato a chi si occupa di _network security_, che ci
azzeccavo lì in mezzo, direte voi? Buona domanda.

## Sandblast e analisi del malware

Oggi si è parlato, tra l'altro, di analisi del malware e di un prodotto,
[SandBlast](http://www.checkpoint.com/products-solutions/zero-day-protection/), recentemente acquisito da Check Point ed integrato nel loro
portafoglio di soluzioni. SandBlast da una risposta al problema, _recepisco dei
file dall'esterno, come mi proteggo da malware o da ATP?_

Lasciando stare i claim sull'essere la soluzione di sandboxing più performante,
anche perché non sono stati forniti dati a riguardo, di sicuro SandBlast ha una
funzionalità carina di rimozione del contenuto dinamico da un file
potenzialmente virato.

Questo permette di fare _delivery_ di mail con attachment ripuliti dal
contenuto che il laboratorio in cloud, o l'appliance, ha rilevato come virato,
o potenzialmente dannoso.

La demo è stata fatta con un documento word, contenente macro che eseguivano
alcuni comandi sul sistema. Il documento è stato passato attraverso un tool che
generava una variante del malware contenuto[^1] per cambiare l'hash del file e
far vedere che [VirusTotal](https://www.virustotal.com) non lo rilevava come
malevolo.

L'appliance di _threat emulation_, ha bloccato la mail con l'allegato che è
stato inviato nel cloud Check Point per l'analisi. Dentro la sandbox, è stato
visto se venivano creati processi, modificati file, create o modificate chiavi
di registro, insomma se erano presenti indicatori di attività potenzialmente
malevole.

Il file virato veniva quindi _ripulito_ dalla parte dinamica e convertito in
PDF per visione da parte dell'utente.

Sicuramente intringante la soluzione di analisi di un malware in sandbox. Uno
dei n mila capitoli che avrei voluto approfondire in questo 2015 che si sta
chiudendo e che, ahimé, non sono riuscito a fare.

Il tema dell'analisi proattiva dei contenuti, file o URL, in sandbox, fatta dal
vendor che più vi piace, è sicuramente qualcosa da affrontare in quest'anno
fiscale. Riscalderà i mesi invernali e vi permetterà di dormire un quarto di
sonni tranquilli. Per il resto, come direbbe [Mayehm](http://it.linkedin.com/in/mayhem), _io sono
preoccupato_.

## Exploit: inglese o francese?

Durante la demo il termine _exploit_ ricorreva prepotentemente ed è sempre
stato pronunciato alla _francese_: espluà. Ecco... diciamocelo, tanto siamo in
pochi. In campo ICT Security, o Cyber Security o Sicurezza Cibernetica,
_exploit_ è una parola inglese e la si pronuncia come tale.

_exploit_ in francese si traduce in _impresa_. _exploit_ in inglese, è un verbo
che si può tradurre _sfruttare_.

Visto che un codice malevolo, _sfrutta_ una vulnerabilità, si dice che dopo la
fase di _discovery_ della stessa viene quella di _exploit_, non l'impresa
sportiva... proprio lo sfruttamento della stessa.

## Discussioni off the record: automatizzare

Nella pausa pranzo ho parlato con Andrea, un amico e collega che lavora in
campo statale e conosciuto ai tempi di quando ero un giovane security
consultant. Si parlava di automazione dell'SSDLC. Ci si è scambiati consigli ed
è bello che in questo campo ci sia mutua contaminazione.

Automatizzare è un mantra che si è presentato anche nella presentazione tenuta
da [Tufin](http://www.tufin.com), nel primo pomeriggio. Durante il talk si è parlato di come il
cloud abbia ridotto drasticamente il _time to market_ e del fatto che la
security, se vuole ottenere il ruolo di facilitatore, deve stare al passo.

Chiaramente, per un penetration test o una code review, non si può sempre
evitare l'attività di test a fondo, fatta a mano e da personale competente.
Visto però che ormai i rilasci sono nel quotidiano, la risposta anche se non
accurata al 100%, deve avere tempi brevi.

Altrimenti, come diceva il relatore, la security continuerà ad essere vista non
come un facilitatore di flusso, ma come un ostacolo al business. E questo
proprio non ce lo possiamo permettere.

## Upcoming events: RubyDay.it - 13 Novembre, Torino

**UPDATE** non so neanche quando vado a parlare in giro. E' il 13 Novembre, non
l'11. Il 13!

A proposito di eventi e talk. Ricordo che il prossimo 13 Novembre, sarò a
Torino, per il [RubyDay.it](https://www.rubyday.it) con un workshop dal titolo:
[Your web applicaiton seen from the Hell's Kitchen](http://www.rubyday.it/schedule/your-web-application-seen-from-the-hell-s-kitchen/). La buona notizia è che
sono a metà delle slide e della preparazione del laboratorio. Quello che
vedremo, senza darvi troppi spoiler, sarà la visione di un attaccante rispetto
ad un'applicazione web. Come si vorrà partire da vulnerabilità di sistema per
arrivare ai dati applicativi, fino ovviamente al penetration test vero e
proprio. Vedremo inoltre, come mettere in sicurezza il nostro server, come
implementare un semplice firewall con gli strumenti del sistema operativo e
qualche chicca di codice sicuro.

Useremo una semplice applicazione sviluppata in
[Sinatra](http://www.sinatrarb.com) e volutamente vulnerabile. Vedremo come
sfruttare un XSS o una SQL Injection, come metterli a porto e come usare i test
per introdurre qualche verifica di security, prima del go live.

## Off by one

Disclaimer doveroso, anche se fatto alla fine. [Questo blog]({{site.url}}) è
vendor independent. Ho raccontato di un evento al quale ho partecipato come
pubblico e che mi è piaciuto. Non è un _endorsement_, non è una review di
prodotto. Se qualcuno ci legge il marcio, tolga le cose avariate dal frigo.

[^1]: non è stato detto quale lo script che inseriva la variante, quindi
      protenzialmente potrebbe avere inserito solamente delle _nop_ o _sleep_,
      all'interno del codice VBA contenuto nel documento virato.
