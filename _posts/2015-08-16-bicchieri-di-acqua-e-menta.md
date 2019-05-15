---
layout: post
author: thesp0nge
title: "Bicchieri di acqua e menta"
promotion: "E' stato un anno fin qui molto ricco. Godiamoci questo weekend di Agosto con qualche highlight"
modified: 
featured: false
category: [Chiacchiere da bar]
tags: [blog, agosto, estate]
image:
  feature: mare.jpg
comments: true
share: true
---

E' passato ferragosto e da poco si sono spenti gli echi dei falò sulla
spiaggia. Fiochi risuonano gli accordi di qualche canzone di Battisti e mentre
le ultime _cyber_ coppiette si baciano sulla spiaggia, facciamo un'altra
carrellata di post interessanti che mi è capitato di scrivere in questa prima
metà dell'anno.

## Cyber sporcaccioni

Nel pieno di un torrido Luglio, mentre [Hacking
Team](https://www.hackingteam.com) subiva un attacco importante e con pochi
precedenti, almeno qui in Italia e almeno tra quello che "si sa e si può dire",
l'armata forcaiola si batteva sul fatto che il sistema di sorveglianza remota
RCS facesse _evidence planting_, ovvero andasse a contaminare con prove fasulle
i terminali sorvegliati.

Chiaro, dal punto di vista della fiction era un'illazione ghiottissima da
prendere, poi in alcuni pezzi di codice c'era la parola _pedo pornografia_,
vuoi mettere?

Il succo è che, dopo una code review di alcune porzioni di codice trafugato,
non c'è alcuna istruzione che lascia intendere la possibilità di creare filmati
con contenuto pedo pornografico o similiare. Certo, tra le email ci sono
clienti che pagavano per avere la funzionalità di file upload, ma su quale
fosse il contenuto del file nessuno ha bit di informazione più accurati.
Eppure, il giornalettaio medio italiano ha deciso che HT impiantava porno.

Vabbé, c'è chi chiama una mulattiera strada, chi si stupisce più?

<figure>
  <a href="{{site.url}}/blog/asphyxia-number-1-ma-rcs-installa-immagini-pedopornografiche/"><img src="/assets/images/hacked-team.png"></a>
  <figcaption>Asphyxia #1: ma RCS installa immagini pedopornografiche?</figcaption>
</figure>

## Stima questo

Quest'anno abbiamo anche parlato della figura mitologica del _project manager_.
I suoi poteri spaziano dal fare slide bellissime con colori sgargianti, fino a
fare stime accurate su cose che ignora. Appunto perché non ne è in grado, il
_project manager_, figura alla quale tutti i banfa ambiscono a diventare,
chiede alle persone tecniche di dare una mano e, poiché i numeri sono troppo
realisti e non fanno bene al C/R e poi il cliente si lamenterebbe, il
fantastico _project manager_ decide di aggiustare qua e là.

Il risultato è che le stime sono completamente cannate, il progetto va lungo di
un paio di mesi ed il cliente è incazzato nero, ma, purtroppo, ormai ha pagato
quindi si tiene l'esercito di banfa in doppiopetto in grado solo di produrre
numeri (sbagliati) e disegnini.

Il nocciolo della questione è che bisogna sempre considerare i test di security
al termine delle attività di sviluppo e che, fatto salvo non sparare a caso con
le giornate, il _project manager_ fa bene ad ascoltare le stime delle persone
che ne sanno qualcosa...

<figure>
  <a href="{{site.url}}/blog/chi-li-paga-poi-i-danni/"><img src="/assets/images/cocci.jpg"></a>
  <figcaption>Chi li paga poi i danni?</figcaption>
</figure>

## Automatizziamo

Quest'anno l'ho preso come mio mantra personale: automatizzare,
l'automatizzabile. In particolare, una delle cose più importanti da testare è
la bontà delle credenziali di accesso degli utenti ai nostri sistemi.

Spesso le persone nell'IT sottovalutano la possibilità di attacchi dall'interno
delle reti, appunto perché un attaccante prima deve _entrare_. Riflettiamo, se
la password di accesso di un utente è _Marzo2015_, entrare è davvero un
problema?

Rispondo io, no non lo è. Il problema è testare tante password in automatico.
Abbiamo visto che con poche righe di Ruby è possibile mettere in piedi un
sistema per automatizzare il test delle password degli utenti di dominio,
almeno per quelle combinazioni semplici _mese-anno_ e le parole presenti nel
dizionario.

<figure>
  <a href="{{site.url}}/blog/testiamo-in-automatico-le-password-dei-nostri-utenti/"><img src="/assets/images/pwd_incorrect.jpg"></a>
  <figcaption>Testiamo in automatico le password dei nostri utenti</figcaption>
</figure>

## Warden e sistemi di autenticazione

La prima mini serie di post prodotta nel 2015, è stata dedicata a come usare
Ruby e Warden per creare un sistema di autenticazione. Spesso inventiamo i modi
più strani e poco sicuri per fare quello che fa benissimo una chiamata singola
LDAP al nostro repository delle utenze. Ho una username ed una password? Senza
bisogno di altro, provo a fare una bind con quelle credenziali. Se ci riesco,
le credenziali sono corrette altrimenti no.

Questo con buona pace dei sistemi caserecci e di password salvate in chiaro sul
database. E' costato tanto mettere in piedi un dominio, perché non usarlo anche
per le nostre applicazioni Intranet? Così i nostri utenti non dovranno tenere a
mente molte credenziali di accesso e si scongiurerà, forse, il rischio di avere
i famigerati post-it attaccati ai monitor.

<figure>
  <a href="{{site.url}}/blog/costruiamo-un-sistema-di-autenticazione-con-sinatra-e-warden-parte-1/"><img src="/assets/images/warden-1.jpg"></a>
  <figcaption>Costruiamo un sistema di autenticazione con Sinatra e Warden. Parte 1</figcaption>
</figure>

<figure>
  <a href="{{site.url}}/blog/costruiamo-un-sistema-di-autenticazione-con-sinatra-e-warden-parte-2/"><img src="/assets/images/warden-2.jpg"></a>
  <figcaption>Costruiamo un sistema di autenticazione con Sinatra e Warden. Parte 2</figcaption>
</figure>


<figure>
  <a href="{{site.url}}/blog/costruiamo-un-sistema-di-autenticazione-con-sinatra-e-warden-parte-3/"><img src="/assets/images/warden-3.jpg"></a>
  <figcaption>Costruiamo un sistema di autenticazione con Sinatra e Warden. Parte 3</figcaption>
</figure>

## Off by one

La [scorsa settimana]({{site.url}}/blog/domenica-dagosto-che-caldo-fa/) avevamo
dato la prima tranche dei 5 post più succosi di questo 2015, questa settimana è
stata solamente una _pick 4_ ma solo perché l'ultimo spezzone, quello su
Warden, è composto da ben 3 post.

La prossima settimana ci vediamo con l'ultimo di questi appuntamenti estivi
tappa buchi. Nel frattempo, non date retta ai boss di Oracle, una EULA non
fermi la ricerca, soprattutto per software scritto male e patchato ancora
peggio.

Enjoy it!

