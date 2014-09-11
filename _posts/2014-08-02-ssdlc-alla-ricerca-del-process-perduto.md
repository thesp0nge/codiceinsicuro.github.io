---
layout: post
title: "SSDLC, alla ricerca del processo perduto"
modified: 2014-08-02 08:58:56 +0200
category: [Sicurina]
tags: [ssdl, sviluppo sicuro, sviluppo, processo, programmatore, team, interviste, codice sicuro]
image:
  feature: opificio_crespi.png
  credit: emilius da atlantide
  creditlink: https://flic.kr/p/9xdDjC
comments: true
share: true
---

Scrivere software è un'arte. Su questo non ci sono dubbi. Il software di
qualità è come un quadro d'autore[^1], può essere bello da vedere, può essere
difficile da capire o può essere una _guernica_, confuso ed a tratti
pittoresco.

Quando realizzato in _pollai alla dilbert_ il software perde un po' del suo
fascino e diventa una compilation _fuzzy_ di bit che a volte riescono anche a
soddisfare delle specifiche di progetto.

In entrambi i casi, formalizzato o no, inconscio o meno, la creazione di
software è il risultato di un processo che parte da un requisito e che
attraversa svariate fasi fino ad arrivare ad un prodotto.

Questo processo [purtroppo è vittima della non cultura
dell'ASAP](https://codiceinsicuro.it/blog/la-non-cultura-dellasap/) e come
vittima subisce tante deviazioni che rendono **impossibile** arrivare ad un
prodotto di qualità.

Quando la security entra nel processo di sviluppo del software, si parla di
[SSDLC](http://www.tripwire.com/state-of-security/security-data-protection/want-ssdlc-security-wont-just-happen/)
ovvero di un'evoluzione del ciclo di vita del software in salsa sicura.

## Non per deboli di cuore

Anche parlare con gli sviluppatori è un'arte. Lo sviluppatore è orgoglioso e
diffidente per definizione e lo specialista di sicurezza applicativa deve
toccare i tasti giusti se vuole farsi ascoltare.

> Ora immaginatevi per un secondo di voler andare da dei professionisti e
> cambiare radicalmente il modo in cui loro fanno una cosa, perché **voi** la
> ritenente sbagliata.

![Compilava il tuo Hello World?]({{site.url}}/images/willy_wonka_ssdlc.jpg)

Esatto, se voi pensate di andare a sconvolgere un processo che in _qualche
modo_ funziona, in nome della sicurezza avete completamente sbagliato strada.

La parola d'ordine è: guanti di velluto.

## Scusi, permette una domanda?

Innanzitutto, per iniziare a proporre un SSDLC in un'organizzazione semplice o
complessa che sia, si deve iniziare dalla comprensione di quello che
attualmente c'è già. Appunto perché non possiamo stravolgere il lavoro degli
altri senza scatenare una sterile guerra, dobbiamo capire i punti di forza ed i
punti deboli del processo in essere.

Può succedere che il team di sviluppo abbia ben chiari in testa i punti deboli,
le lacune del proprio lavoro quotidiano. Quindi ben venga qualche
ottimizzazione che permetta di essere più produttivi, magari lavorando meno.
Perché no?!?

Per capire come funziona una cosa, dovete andare a parlare con gli
sviluppatori. Qui armatevi di santa pazienza perché sarete messi alla prova, se
quindi non avete idea di come sia un processo di sviluppo fatevi un favore:
**state in silenzio ed ascoltate**. Se invece ne sapete qualcosa, il consiglio
che vi do è ancora più prezioso: **state zitti, fate qualche domanda ed
ascoltate**.

In questo primo assessment voi dovete uscire con le seguenti informazioni:

* chi sono gli attori coinvolti, dal committente allo sviluppatore;
* quali sono le fasi che il processo attraversa;
* come arrivano le esigenze e quali formalismi sono utilizzati;
* quali strumenti di sviluppo sono utilizzati (editor, compilatori, interpreti,
  debugger, strumenti per il test, strumenti per la build, strumenti per la
  gestione dei ticket e dei bug, ..);
* quali linguaggi sono utilizzati (sì, non esiste solo Java);
* come viene portato in produzione il software.

Il vostro deliverable sarà una serie di appunti fitti fitti. Dovrete, non solo
capire la parte _lavorativa_ ma anche la parte _emotiva_ del processo. Dove
sono le frustrazioni degli sviluppatori? In che modo un nuovo processo può
renderli più produttivi? Come potete aiutarli veramente?

Se li aiutate e se non pretendete di dir loro come scrivere software, allora è
probabile che vi stiano ad ascoltare.

E se vi ascoltano, voi siete sulla buona strada.

## SSDLCS, interessante... ma pensiamoci un po' sopra

![Minosse pensieroso]({{site.url}}/images/pensoso.png){: style="float:left; padding-right: 1.4em;"}

Ora è il momento di non reinventare la ruota. Lo so che voi vorreste proporre
l'ultimo dei plugin di tool di code review commerciali, ma se lo sviluppatore
non usa quegli strumenti? Siete in grado poi di istruire quel plugin per
soddisfare le linee guida interne di sviluppo sicuro? Come raccogliete poi
l'output del plugin? Come indirizzate le remediation? Pensate veramente che lo
sviluppatore tra le mille cose che ha da fare si metta ad eseguirlo e
correggere tutto?

Due parole:

* imparare dai migliori;
* customizzare ed automatizzare.

La prima cosa che vi suggerisco di fare è andare a cercare sul web quali sono
le novità sui temi di sviluppo sicuro e test automatizzato.

Vi suggerisco di guardare questo video. [Stephen de Vries](http://twitter.com/stephendv) è uno specialista
di application security ma è anche uno sviluppatore. In questo talk parla di
come approcciare i temi di sicurezza in un modello _agile_ di sviluppo.

{% youtube JkgrEwko_mY %}

Quando avete spremuto a fondo google, provate ad individuare in quali punti del
processo che avete sentito dagli sviluppatori, voi mettereste i vari controlli
di sicurezza e soprattutto **quali** controlli di sicurezza.

Il vostro scopo è uscire con un nuovo processo che:

* abbia le stesse fasi del processo originale
* permetta agli sviluppatori di usare gli stessi strumenti che usavano prima
* introduca la **minor** latenza possibile ed il **minor** overhead di lavoro
* sia centralizzato, ovvero siate voi security a comandare quali controlli
  debbano essere fatti e contro quali policy e soprattutto abbiate sempre sotto
  controllo i risultati
* sia automatizzato, ovvero lasciate che sia il computer a lavorare per voi

## Ma quindi? Li spendo questi 500K in tool di code review?

Vuoi la mia opinione? **NO**, risparmiali. Spesso il processo si apre e si
chiude in una settimana di lavoro, sempre di più vengono utilizzati processi
agili di sviluppo che portano ad andare sul mercato in maniera aggressiva. Un
tool di code review produce una serie di findings ed una serie di falsi
positivi tali che in una settimana in 2 probabilmente non si è ancora finito di
esaminarli, figuriamoci di far fare i fix agli sviluppatori.

I controlli devono essere:

* pochi
* semplici
* mirati

Ed il processo di retroazione sviluppo->check->fix deve essere rapido ed anche
in questo caso automatizzato. Il risultato delle vostre scansioni deve far
aprire dei ticket sul sistema di bug tracking utilizzato dagli sviluppatori con
notifiche via email. Basta con report di 100 e passa pagine scritti in _banfa
style_.

## Off by one

Oggi abbiamo visto come la costruzione di un processo sicuro di sviluppo
software parta con un assessment di quello che c'è già con lo scopo di
introdurre piccolissimi interventi correttivi allo stesso.

Abbiamo visto come forse buttarsi nell'acquisto di quel tool o di quell'altro
plugin non è detto sia la scelta migliore. Occorre ponderare con calma quello
che serve veramente.

Prossimamente su questo blog, vedremo fase per fase cosa si può fare per
aggiungere security al nostro SDLC aziendale.

Qual è la tua opinione? Tu da dove partiresti per costruire un SSDLC? Fai
sentire la tua opinione e lascia un commento qui sotto.

_L'immagine del Minosse pensante è licenziata CC ed è di [Niccolò
Caranti](https://www.flickr.com/photos/ncaranti/)_

[^1]: per il purista; anche il sottoscritto sa che l'arte sia musicale che
      figurativa ti trasmette emozioni intense, cosa che difficilmente può fare
      una serie finita di uni e di zeri, quindi, per favore leggi tra le righe
      e capisci che è un'iperbole. Si vuole valorizzare un qualcosa che non
      tutti sono in grado di realizzare.
