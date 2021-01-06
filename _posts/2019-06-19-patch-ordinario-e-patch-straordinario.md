---
layout: post
title: "Patch ordinario e patch straordinario"
author: thesp0nge
featured: false
category: [post]
tags: [vulnerability assessment, patch management, security, nexpose, nessus, vita da security manager]
image:
  feature: patch_sky.jpg
comments: true
share: true
---

Patching, patching, patching: lo stiamo facendo tutti forse un po' male se non
ci stiamo dotando di un processo strutturato.

Il mio martedì è iniziato con un sussulto alla lettura dell'[advisory
emesso](https://github.com/Netflix/security-bulletins/blob/master/advisories/third-party/2019-001.md)
dal security team di [Netflix](https://www.netflix.com).

> Denial of Service remoto per vulnerabilità del kernel di Linux e FreeBSD.

Sono tornato per un attimo con la mente alla fine degli anni '90 quando era
il [Ping of Death](https://it.wikipedia.org/wiki/Ping_of_Death) uno dei
divertimenti dell'epoca. Un pacchetto malformato e _voilà_ il kernel panic era
servito.
E così per [AngeL](http://angel-lsm.sourceforge.net/), il mio progetto di tesi
di laurea che stavo sviluppando insieme ad Aldo in quel di un
[LASER](http://security.di.unimi.it/) agli albori, scrivemmo un controllo per
impedire che un host lanciasse [un ping of
death](https://github.com/thesp0nge/angel/blob/master/src/angel_icmp.c#L37)
agganciandoci al modulo del kernel di netfilter.

A nostro modo, con quello che poteva essere un IPS primordiale, stavamo facendo
del virtual patching al contrario, mettendo una pezza sulle capacità offensive
del nostro attaccante.

Ritorniamo ai nostri giorni. Bollettino di sicurezza in mano, processo di patch
management dall'altra, si parte con il _"cosa facciamo ora?"_.

## Straordinario vs Ordinario

Ho cercato di dividere il patching di un sistema tra ordinario e straordinario
per guidare le azioni mitigative in caso di emergenza, elevando la criticità
delle stesse per avere una risposta più veloce.

Quello di SACK è stato quindi un caso in cui si è attivato il processo di
patching straordinario:

* triage della vulnerabilità
* identificazione degli asset e prioritizzazione della mitigazione a seconda
  dell'esposizione
* individuazione delle attività contenitive (e per fortuna che in questo caso
  erano disponbile dei workaround per gestire eventuali server dove non poteva
  essere fatto un riavvio)
* esecuzione secondo una timeline concordata.

Stessa cosa fatta qualche giorno prima per gestire la [remote code execution di
exim](https://www.exploit-db.com/exploits/46974).

Avere in mano una scaletta di cose che ti dica quando intervenire e cosa fare è
fondamentale se non si vuol lasciare la propria società in balìa degli eventi,
nel mezzo di un possibile attacco.

E' altresì importante distinguere il patching straordinario, dove la
focalizzazione deve essere massima, da quello ordinario. Il patching ordinario
deve essere un'attività scandita dagli advisory del vendor ed effettuato con
una periodicità che, caso per caso, voi come security manager, andrete a
decidere.

Il nostro team che gestisce le macchine, server e client, non deve essere
soffocato dai nostri processi. Come blue team dobbiamo ricordarci sempre che il
business conta sul fatto che l'operatività delle macchine non sia intaccata,
ecco perché dobbiamo studiare un _timing_ efficace per la nostra
infrastruttura. 

Nel patching ordinario, le cose importanti da fare sono:

* collezionare i bollettini dei vendor (sia del sistema operativo, che del
  software principale utilizzato in azienda)
* fare un triage per dare una priorità di cosa deve essere installato
  mandatoriamente prima del prossimo patching ordinario
* trovare eventuali azioni contenitive nel caso non si possa applicare una o
  più patch
* ingaggiare i team coinvolti e presidiare l'attività fungendo da coordinatore.

## Off by one

Tu come dividi le richieste di patching che indirizzi verso i team di sysadmin?
Usi uno schema custom di triage, ti basi solo sul CVSS o altro?

Perché non lasci il tuo commento qui sotto. Ne può nascere una discussione
interessante.

Ti ricordo, che da qualche giorno è disponibile anche il canale telegram di
[Codice Insicuro](https://t.me/codiceinsicuro) dove potrai stare in contatto
con me e con tutta la community che ruota attorno al progetto [Codice
Insicuro]({{site.url}}). 

Enjoy it.
