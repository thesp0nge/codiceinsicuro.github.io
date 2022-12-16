---
layout: post
author: thesp0nge
title: "Propositi e previsioni per la sicurezza applicativa nel 2016"
promotion: "Come sarà il 2016 per l'#appsec? #IoT, #OWASP, #Malware, #cybercrime e molto altro. Leggi qui."
modified:
featured: false
category: [Chiacchiere da bar]
tags: [propositi, anno nuovo, sicurezza applicativa, previsioni, duemilaquindici]
image:
  feature: palle_2016.jpg
comments: true
share: true
---

Manca poco ormai alla fine del 2015 e, [come l'anno
scorso]({{site.url}}/blog/propositi-e-previsioni-per-la-sicurezza-applicativa-nel-2015/),
è arrivato il momento di fare qualche bilancio sull'anno passato e qualche
previsione su quello che verrà.

Il 2015 è stato senza ombra di dubbio, l'anno del breach italiano del decennio:
[l'attacco ad
HackingTeam]({{site.url}}/blog/hackingteam-e-la-storia-del-figlio-del-calzolaio/).
Da una parte molti hanno scoperto il segreto di pulcinella, ovvero che
HackingTeam sviluppasse software di offensive security dedicati ad
intercettazioni telematiche[^1].

> Dall'altra parte l'Italia, per ben una settimana, ha scoperto il problema
> della sicurezza informatica. Salvo poi dimenticarsene, ma questa è un'altra
> storia.

L'_affaire_ di HackingTeam, ha poi messo in luce l'aspetto pià triste dei
social network: l'attitudine a sfogare la propria frustrazione con [attacchi e
crociate senza capo né
coda]({{site.url}}/blog/lattacco-ad-hacking-team-e-la-scena-forcaiola-italiana/).

[Bettercap]({{site.url}}/blog/bettercap-rimettiamo-al-centro-lattaccante/) è
stato, secondo me, il tool opensource più interessante per quest'anno. Il buon
[@evilsocket](https://twitter.com/evilsocket) ha tirato fuori dal cilindro un
framework, scritto in Ruby, per realizzare attacchi di tipo _man in the middle_

Il 2015 è stato l'anno di [Mr. Robot]({{site.url}}/blog/mr-dot-robot/). Dai
tempi del primo Matrix, è la prima serie TV che c'entra in pieno il tema _cyber
thriller_ senza cadere in tristezze sia italiche...

{% include youtube.html id="s5ocXFgowZA" %}
Che di oltreoceano fattura

{% include youtube.html id="plcIQgX-kbo" %}

Attendo con ansia la [seconda stagione (attenzione link con video spoiler
sull'ultimo episodio della prima
stagione)](http://www.slashfilm.com/mr-robot-season-2/), la prossima estate.

Il [mondo del lavoro]({{site.url}}/blog/game-set-e-partita/) continua ad essere
stranissimo. All'estero sembra esserci una maturità che da noi stenta a
prendere piede. Il mondo della sicurezza informatica è ancora ancorato al pezzo
di ferro, con un firewall il cliente italico medio si sente al sicuro e poco
importa l'awareness agli sviluppatori, i test del codice... tanto c'è il
firewall che blocca i _locakers_.

Un anno fa, dicevo sarebbe stato l'anno dell'Internet delle cose. In effetti,
abbiamo iniziato a vedere i primi giocattoli connessi ai _socialcosi_ bucati in
malo modo. E' successo [alle
Barbie](http://www.pcworld.com/article/3012220/security/internet-connected-hello-barbie-doll-can-be-hacked.html)
ed è successo, pochi giorni prima, ad un [gioco
cinese](http://motherboard.vice.com/read/one-of-the-largest-hacks-yet-exposes-data-on-hundreds-of-thousands-of-kids)
il cui _breach_ ha messo alla berlina identità di milioni di famiglie illuse
dal miracolo dell'Internet delle cose.

> Finché i product manager non si cacciano in quelle dannate zucche piene di
> stime e previsioni, che connettere dei device implica averli progettati in
> maniera tale da salvaguardare la privacy dei propri clienti, tutte le
> chiacchiere sulla Rete saranno appunto... chiacchiere, fuffa, roba da
> _storyteller_.

Ah, [non succede solo con i giochi per i bambini](http://www.wired.com/2015/07/hackers-remotely-kill-jeep-highway/).

Il 2015 è stato un anno dove ho fallito in una cosa in cui credevo, [le mie
idee per dare nuova linfa al capitolo Owasp
Italy]({{site.url}}/blog/io-sono-molto-preoccupato-owasp-italia-ha-bisogno-di-te/).
Purtroppo... bhé purtroppo le energie sono poche in giro e molte persone amano
più fare un bell'aperitivo che anche solo scrivere due righe in un Wiki. Sia
chiaro, io credo ancora a quello che ho scritto lo scorso Febbraio. Owasp
Italia, ha bisogno di energie fresche.

Nel 2016, cosa succederà?

Truffe, scam, malware, attacchi da Top 10 Owasp... ne vedremo sempre, ed in
numero crescente. Il [business del
cybercrime](http://channels.theinnovationgroup.it/cybersecurity/impatto-economico-del-cybercrime-sulle-aziende-e-sulle-nazioni/)
tira e non vedo ragione alcuna per sperare in una redenzione, o in una
inversione di rotta.

Continueremo, purtroppo, a sottovalutare il problema ed esporre noi stessi, ed
i nostri dati, ad accessi non autorizzati. La tendenza alla condivisione, alla
scelta di password banali perché deve essere di rapida fruizione, al non
cambiare mai le proprie credenziali assieme al fatto che tendiamo a credere che
la Rete sia un luogo bucolico, pieno di risorse e cose belle, faranno sì che
anche nel 2016 chi si occupa come me di sicurezza applicativa, avrà un gran da
fare.

Il 2016, sarà l'anno della versione 2.0 di
[dawnscanner](http://dawnscanner.org) ed è soprattutto per questo motivo per
cui ci sono stati pochi post nell'ultimo mese. E' uscita una versione 1.5.0,
alla quale seguirà una 1.5.5 con l'aggiunta di security check e qualche bug fix
soprattutto per quanto riguarda l'applicazione dei CVE ad applicazioni scritte
in Rails 3.x.

E [wordstress](http://wordstress.org)? Purtroppo pago un po' il fatto che in
PHP arranco un po', però è nella mia ToDO list. La nuova versione avrà come
maggiore miglioramento il non dover dipendere da un tool esterno per la
scansione, o meglio questa sarà una funzionalità opzionale. Di base, la
scansione _whitebox_ sarà fruibile nella console di amministrazione del sito.
Un po' come avviene per le altre soluzioni di security per WordPress.

Il 2016 sarà anche l'anno del rilancio del progetto
[armoredcode](http://armoredcode.com). Dati alla mano, il mio Inglese
maccheronico aveva un audience **decisamente** maggiore rispetto a quella dei
posti qui su [Codice Insicuro]({{site.url}}).

Sia chiaro, io **amo** il progetto [Codice Insicuro]({{site.url}}) e continuerò
a portarlo avanti. Sento però anche l'esigenza di lavorare ad un progetto più
grosso. E' chiaro che mi piacerebbe molto che tutti gli sviluppatori, gli IT
Manager o i Security Manager venissero a leggere sia [Codice
Insicuro]({{site.url}}) che [Armored Code](http://armoredcode.com).

Il mio capo lo fa già, dì anche al tuo di farlo!

Nel 2016, l'Italia ospiterà l'[Owasp APPSEC EU](http://2016.appsec.eu), uno
degli eventi più importanti organizzati da Owasp su tutti i temi della
sicurezza applicativa. Basterà questo a smuovere un po' le coscienze
sonnacchiose dei nostri #seniormanagers? Faremo meno chiacchiere e più fatti?
Staremo dietro ad un tavolo a pontificare di strategia o finalmente andremo sul
campo a parlare di tattica e la strategie la applicheremo invece di lasciarla
alla macchinetta del caffé?

Bhé, dal canto mio, ci spero proprio.

Buon 2016 ed... enjoy!

[^1]: perdonatemi ma come per "sicurezza cibernetica", non riesco a pronunciare
      correttamente "captatore informatico". Proprio no.
