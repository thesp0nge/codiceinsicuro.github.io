---
layout: post
title: "La sicurezza applicativa è veramente un facilitatore di flussi?"
promotion: "Proteggiamo veramente le cose nel modo corretto? Siamo sicuri di dare valore aggiunto a chi ci sta accanto? Leggi come esserlo una volta per tutte."
modified: 
featured: true
category: [Chiacchiere da bar]
tags: [protezione, asset, web properties, ssdlc]
image:
  feature: flussi.jpg
  credit: Alessandro Scarcella
  creditlink: https://flic.kr/p/bxbwhF
comments: true
share: true
---

La domanda non è banale. La sicurezza applicativa, per come è fatta spesso,
serve? La risposta a questa domanda, volutamente provocatoria, non è banale.
Ammetto di averci pensato su un sacco, durante lo sviluppo della mia personale
[APPSEC Pipeline](#) sul lavoro. Dopo un paio d'anni di riflessione, complice
la [lettura di questo
post](https://labs.signalsciences.com/infosec-confession-we-protect-the-wrong-things-and-we-slow-everything-down-f90b0344bf0a#.spque2o9l),
non posso che rispondere dicendo:

> No, così come è fatta in molti casi, la sicurezza applicativa non solo non
> serve ma è dannosa.

Cori di disapprovazione, ma è così.

## Il processo di sviluppo

Mamma mia, si parla di SSDLC almeno dagli anni 70 e contate sulla punta delle
mani di una persona, le società in Italia dove esiste:

* linee guida di sviluppo sicuro
* processo di revisione del codice prima del golive.

Ed in questi pochi casi, la revisione del codice serve davvero? Sì, certo che
serve, ma è un processo che è ancorato ad un modo di concepire il prodotto che
è fermo almeno da una decina d'anni.

Oggi, in molti usano metodologie _agili_ e rilasciano più volte durante una
singola settimana[^1]. Come posso dire che ogni rilascio deve essere preceduto
da una code review, da un penetration test applicativo e che mi devono dare il
codice nel suo stato finale, **almeno** una settimana prima per i test. E
quando scrivo una settimana, intendo dire che sono almeno due, nel caso di
applicazioni particolarmente complesse.

Un approccio monolitico come questo, poi costa. Costa un sacco. Le società sono
molto spaventate dall'aprire il borsellino per i costi legati alla sicurezza,
perché di rado riescono a vedere un beneficio negli stessi. Soprattutto, se il
costo di un test di security, mi costa come lo sviluppo di un prodotto, capite
da soli che qualsiasi manager assennato, declinerebbe l'attività.

## Fluidità

La sicurezza applicativa serve solo se è fluida. Serve se è in grado di
adattarsi ad ogni singolo progetto in maniera da minimizzare gli impatti.

Proviamo a fare un'ipotetica lista della spesa delle cose che io, se fossi un
product manager vorrei dalla mia sicurezza applicativa:

* costi: minimi. Se il costo per il test è paragonabile a quello di tutto lo
  sviluppo, il mio prodotto non è più competitivo. Il costo dei test deve
  essere contenuto e questo lo ottengo riutilizzando i componenti tra più
  progetti[^2].
* tempi: ridotti. Il mercato cambia troppo velocemente e reagire in tempi brevi
  è fondamentale affinché un prodotto abbia successo. Aggiungete che ci sono
  prodotti, come le applicazioni mobile, che hanno dei tempi tecnici di
  pubblicazione che non sono dipendenti da noi.
* tasso di errore: minimo. Spendere un sacco di soldi, per un'attività che
  porta via molto tempo può essere dura da digerire. Se a questo si aggiunge
  l'errore umano effettuato in fase di test, appare chiaro come in molti
  decidano di stare alla larga dai temi di sicurezza applicativa[^3].
* vendibilità: tanta. Devo andare dal management a giustificare un'extra budget
  e 5 giorni di ritardo[^4] sul rilascio. Non posso mettere sul piatto aria
  fritta, ho bisogno di rischi reali ai quali il mio prodotto può andare
  incontro.

Adesso, facciamo un esercizio. Cerchiamo la soluzione per il nostro product
manager.

Per i costi minimi, abbiamo già visto come razionalizzare il software già è un
passo. Se il mio portafolio di prodotti, condivide il modulo di autenticazione,
di gestione dei pagmaneti e di logging, non sarà necessario testarli **ogni**
singola volta vengano usati in un nuovo prodotto. Se non cambiano, basta
ripetere i test periodicamente (una volta l'anno ad esempio), per assicurarsi
che non si sia tralasciato niente nei test precedenti. C'è poi la soluzione A.

Per i tempi ridotti, bhé affidarsi ad un team esperto è il primo passo. Quando
mi danno un'applicazione o un codice da rivedere, non parto completamente da 0,
so più o meno dove andare a guardare per vedere le magagne grosse (sicurezza
nella comunicazione, gestione della sessione, gestione degli account, form di
ricerca e inserimento, ...). C'è poi la soluzione A.

Tasso di errore minimo. In questo caso non basta neanche la soluzione A. Gli
errori ci saranno sempre, è l'unica invariante a tutto il bizniz[^5]. Un po'
con la soluzione A, ma soprattutto con l'esperienza di chi fa i test, riusciamo
ad avere un tasso minimo, non nullo, ma minimo. Accontentiamoci.

La vendibilità. L'unico punto dove la soluzione A non ci aiuta è il punto più
importante. Chi è alle prime armi, parte a razzo con i tool e nel giro di poco
tira fuori un'accozzaglia di findings non contestualizzati che vengono smontati
in poco tempo. La cosa da cui bisogna partire è un'attività puramente manuale,
che porta via un giorno o due, a seconda del progetto, e che risponde alla
domanda: _si, ma perché devo investire soldi in test di security?_

Esatto, devo partire con un threat model per capire a quali problemi può andare
incontro la mia applicazione una volta messa sul mercato. Che rischi corre?
Cosa può succedere se una vulnerabilità viene sfruttata? Cosa fanno i miei
competitor? Come sono posizionati? Hanno subito attacchi di ricente? In quali
modi un attaccante trarrebbe vantaggio dai dati gestiti dalla mia applicazione?

Andare dal business dicendo chiaramente quali sono i rischi, soprattutto in
termini di immagine aziendale, così importante nell'epoca del social e del
politicamente corretto, ha un peso rilevante nel dover giustificare un'attività
extra.

Poi c'è la soluziona A. Ne [avevamo già parlato a
Dicembre]({{site.url}}/blog/di-pipeline-processi-ed-automazione/). La sicurezza
applicativa diventa un facilitatore di flussi se è calata in un processo
automatizzato. Attenzione alle parole: processo e automatizzato.

Il processo ci deve essere e deve essere il punto di partenza. Dare linee guida
a sviluppatori e sysadmin, creare un'applicazione che permetta ai vostri
clienti interni di richiedere i test di security, fornire dei deliverable e
curare il feedback per verificare sempre a che punto sono le issue che abbiamo
segnalato.

Questo processo deve essere il più possibile automatizzato. Il tool deve essere
scelto in maniera tale da aiutarmi a prendere delle decisioni e dare priorità
al mio lavoro. Non deve sostituirsi all'istinto di chi lo usa ed alla sua
esperienza. Soprattutto, i tool devono potersi parlare tra di loro, per creare
la pipeline di [cui abbiamo già
parlato]({{site.url}}/blog/di-pipeline-processi-ed-automazione/).

In questo modo, creando e curando la nostra pipeline, adattandola volta per
volta ai cambiamenti nella realtà che viviamo ogni giorno, saremo in grado di
dare una risposta al nostro product manager, diventando per lui un facilitatore
di flussi.

Enjoy it!

[^1]: conosco realtà dove i rilasci sono quotidiani, ma voglio ignorarli per
      semplicità. Anche se capite benissimo, che mettono ancora più in luce la
      farraginosità dell'approccio moderno al test di security.

[^2]: il contenimento dei costi non è una cosa quindi che riguarda solamente la
      security. Contenere i costi significa creare una buona architettura per
      il proprio software. Costruire una buona architettura significa non
      reiventare ogni volta la ruota, costruire dei moduli che implementano
      servizi base e riutilizzarli invece di duplicare sempre tutto.

[^3]: questo è frequente anche nelle grandi realtà, con processi consolidati.
      Per velocizzare, si manda sul mercato software non testato, scelte spesso
      avallate dal business stesso in nome del _time to market_ e del _tanto
      chi vuoi che ci attacchi_.

[^4]: chi ha lavorato in grosse realtà, sa che i ritardi normali si misurano in
      mesi.

[^5]: se qualcuno vi vende la soluzione 100% false positive free o è un
      truffatore o la sua soluzione non trova nulla, ecco perché non ha errori.

