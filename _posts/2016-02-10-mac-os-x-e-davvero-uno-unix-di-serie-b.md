---
layout: post
title: "Mac OS X è davvero uno UNIX di serie B?"
promotion: "Mac OS X è considerato un sistema per utenti poco esperti. Ma quello di casa Apple, è veramente uno UNIX di serie B? No. Vediamo perché"
modified: 
featured: true
category: [Chiacchiere da bar]
tags: [kernel, security, appsec, protezione, kernel extension, gatekeep, malware, firma digitale, hackosx]
image:
  feature: bank.jpg
  credit: Carlo Alfredo Clerici
  creditlink: https://flic.kr/p/9MEAuY
comments: true
share: true
---

Tutto è nato un paio di settimane fa, all'inizio dell'ondata di [Ransomware](https://it.wikipedia.org/wiki/Ransomware)
che ha colpito l'Italia. Arriva la mail, o si naviga in un sito compromesso, il
vettore d'attacco viene scaricato sulla postazione di lavoro, l'utente[^1]
clicca sopra e si cifra il disco (o in alternativa mettete voi qualche cosa
brutta, che un malware può fare: installare un keylogger, trasformare la
postazione in uno zombie all'interno di una botnet, ...).

Mi sono chiesto: io uso un Mac, dovrei essere al sicuro, giusto? No, risposta
sbagliata.


## Auto compromissione

Ammettiamolo, i tempi dello sviluppo di [AngeL](http://angel-lsm.sourceforge.net) sono lontani ed il mondo web
ha assorbito tanto di quel tempo da avermi fatto perdere un po' di vista la
programmazione a basso livello, nella landa desolata che prende il nome di
_kernel land_.

Per capire meglio come attaccare il mio Mac, ho deciso di rimettermi a
studiare. Chiedendo a Google di cercare qualcosa su [Malware](https://it.wikipedia.org/wiki/Malware) e [OS X](https://it.wikipedia.org/wiki/OS_X) mi
si è aperto un mondo, devo essere sincero.

Ho scoperto i lavori di [Patrick Wardle](https://twitter.com/patrickwardle), blogger di
[Objective-See](https://objective-see.com) ed esperto nello studio di Malware e
sistemi Apple. Ho scoperto il blog [Reverse engineering Mac OS
X](https://reverse.put.as/) ed un gran numero di talk ai vari [Def CON](https://www.defcon.org),
[Blackhat](https://www.blackhat.com), tutti concentrati sull'analisi dello stato dell'arte di Mac OS X
come sistema target.

## Un sistema bistrattato

Diciamoci la verità, l'utente medio Apple è considerato, da chi si proclama
_smanettone_, un pirla. Di solito è considerato, ancor meno di un utente
Windows. Il fatto di avere davanti una GUI, il fatto di avere sotto il cofano
hardware chiuso e non modificabile (facilmente), il fatto di aver generato orde
di _fanboy_ deliranti che scimmiottano [Steve Jobs](https://it.wikipedia.org/wiki/Steve_Jobs), non depone a favore del
nostro imputato.

Imputato che, occorre ricordarlo, ha parenti di tutto rispetto e si può vantare
di essere, contrariamente a Linux, un vero UNIX che rispetta lo [standard
POSIX](https://it.wikipedia.org/wiki/POSIX).

La _community_ non perdona forse ad Apple, un rapporto poco _hacker oriented_
verso il codice rilasciato sotto licenza BSD. Non perdona l'aver chiuso le
librerie [Aqua](https://it.wikipedia.org/wiki/Steve_Jobs) e altre posizioni più
o meno condivisibili, tipiche delle
guerre di religione che non portano a nulla di buono, soprattutto nella stessa
comunità opensource.

Mac OS X, quindi è uno UNIX a tutti gli effetti. Mac OS X non può essere
definito [opensource](http://store.apple.com/Catalog/US/Images/MacOSX.htm),
nonostante abbia un kernel modulare, il cui codice è
[opensource](https://github.com/opensource-apple/xnu).

> Mi sono chiesto: io uso un Mac, dovrei essere al sicuro, giusto? No, risposta
> sbagliata.

Implementa [TrustedBSD](http://www.trustedbsd.org) per il _mandatory access
control_ e [OpenBSM](http://www.openbsm.org) per le API di audit del sistema.

Tra l'altro, è stata proprio dietro un'iniziativa di Apple, che OpenBSM si è
sviluppato.

Dalla pagina [del progetto](http://www.trustedbsd.org/openbsm.html):

> OpenBSM is derived from the BSM audit implementation found in Apple's open
> source Darwin operating system, generously released by Apple under a BSD
> license. The Darwin BSM implementation was created by McAfee Research under
> contract to Apple Computer, and has since been maintained and extended by the
> volunteer TrustedBSD team. The FreeBSD Foundation sponsored the development
> of auditdistd, a distributed audit trail daemon.

## Gatekeeper

[Gatekeeper](https://support.apple.com/it-it/HT202491) è il meccanismo di
difesa che Mac OS X propone all'utente, per salvaguardarlo dall'eseguire codice
non _trusted_. La politica di Apple è abbstanza paranoica, riguardo le
applicazioni e la loro diffusione.

Gli sviluppatori devono aderire al [loro _developer
program_](https://developer.apple.com/programs/), pagare un'iscrizione annuale
che da accesso a **tonnellate** di documentazione e codice. Gli sviluppatori
del programma ottengono un certificato per firmare le proprie applicazioni che,
prima di essere pubblicate sullo [store
Apple](https://www.apple.com/it/support/mac/app-store/), subiscono un processo
di review da parte di Apple stessa.

Gatekeeper ha il compito di verificare che l'applicazione sia stata scaricata
dallo store e che venga da uno sviluppatore aderente al programma.

Questo meccanismo **non** è inviolabile, ma ci torneremo sopra in altri post.

## Off by one

Quello che voglio iniziare è un viaggio alla scoperta di come violare ed
infettare un Mac con lo scopo di capire come proteggerlo. Ormai si sta
diffondendo sempre di più e quindi inizia ad essere un obiettivo molto
appetibile.

Non sarà tutta farina del mio sacco. Proverò a spiegare nel dettaglio, i lavori
di vari ricercatori in giro per il mondo, sul tema.

Lo scopo è imparare insieme, internals del sistema, come attaccarlo, come
bucarlo e come difenderlo.

Quello che voglio mostrare è che, lo UNIX di Apple, non è uno UNIX di serie B.

Enjoy it!

[^1]: è sempre utile ricordare che la sicurezza di un sistema informatico è
      pari alla sicurezza della sua componente più debolmente protetta. In un
      sistema dove c'è interazione con l'essere umano, ahimé siamo noi l'anello
      più debole.
