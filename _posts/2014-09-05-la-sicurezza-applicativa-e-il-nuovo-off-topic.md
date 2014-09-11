---
layout: post
title: "La sicurezza applicativa è il nuovo off-topic?"
modified:
category: [Chiacchiere da bar]
tags: [conferenze, itaGLia, sviluppatori, off-topic, awareness]
image:
  feature: offtopic.png
  credit: Chris Devers
  creditlink: https://flic.kr/p/81JzLb
comments: true
share: true
---

Il mondo delle conferenze dedicate allo sviluppo software, qui in Italia[^1] è
piccolo ed auto referenziale. Io ho seguito, quest'anno un po' defilato,
l'organizzazione del [Ruby Day](http://www.rubyday.it) e trovare ad esempio
degli sponsor è come trovare il casello di Melegnano vuoto a fine agosto,
un'impresa. Parlare del ticket di ingresso? Eresia, le conferenze devono essere
gratis perché l'italiano non vuole pagare. E poi c'è la crisi.

Poi guardi gli eventi in Europa, Asia, America sia nord che sud e dici:

> evidentemente la crisi lì non c'è se i ticket costano 200-300$ e la gente
> viaggia mezzo mondo per andarci.

Al di là della bellezza degli eventi, di come vengono organizzati con cura, mi
sorprende un fatto: la security spesso in ItaGLia è off topic nelle conferenze
piene zeppe di sviluppatori.

## WTF?

Già. Esiste la convinzione comune che il buon sviluppatore scriva codice scevro
da bug, a maggior ragione bug di security.
Purtroppo questo parte da un concetto sbagliato, ovvero quello secondo il quale
se io sono bravo a fare una cosa la farò sempre nel modo ottimale possibile
senza se e senza ma.

Secondo me questa convinzione assurda è figlia anche del fatto che una società
che subisce una violazione non è tenuta a dichiararla _post mortem_. Si hanno
quindi battaglioni di sviluppatori che si autoconvincono che il loro codice sia
l'essere perfettissimo, creatore e signore di tutte le cose digitali e che mai
e poi mai possono aver fatto un errore.

> E poi che vuoi che sia se uso quel parametro direttamente in una query,
> scusa? Preparared Statement? No, io di prepared _ciò_ solo la pasta. Risa.
> Applausi

Vivendo in questo mondo, con questi schemi mentali, si capisce facilmente
perché chi organizza una conferenza di sviluppatori qui in Italia tenda a
considerare l'application security _off topic_.

Poi quando le web application vengono bucate, perché **sì**, vengono bucate,
cadono tutti dal pero. Sgranano gli occhioni da bambi e tra un _come è stato
possibile?_, _ma come ha fatto?_, aggiungono spesso un _e come lo metto a
posto?_.

## Rosico?

Ho portato per la prima volta il talk _Usare ruby in un penetration test
applicativo_ l'anno scorso a [railsberry](http://www.railsberry.com). Dalla
submission alle prime domande per capire di più sul mio talk sarà passato...
toh, un mese. E se andate a guardare il roaster della conferenza non è che ci
va il primo scappato di casa a parlare. Che vuol dire, che sono figo? No, vuol
dire che chi organizzava, tra tanti talk interessanti e nella zona di comfort
per uno sviluppatore, aveva interesse anche a qualcosa di diverso. Che poi
scopri in realtà che il livello medio degli sviluppatori che lavorano
all'estero (ci butto dentro anche i miei connazionali che non hanno niente da
invidiare a) è **decisamente** più alto.

Ho proposto un talk di security l'anno scorso a [better
software](http://www.bettersoftware.it)[^2] e quest'anno a [code
motion](http://milano.codemotionworld.com/), tra l'altro per quest'ultimo
evento ho proposto sia il talk tenuto da railsberry sia un talk specifico su
come evitare i rischi della Top 10 Owasp facendo sviluppo sicuro in Ruby.

O sono stato rimbalzato o le mie proposte sono state 2 mesi in uno stato di
_waiting for approval_, senza alcun feedback, mentre venivano annunciati sul
sito della conferenza già i primi 30 relatori.

Il mio primo pensiero? Avranno scartato i miei talk e non avranno aggiornato la
web app. Rimuovo le mie risposte e scrivo un
[tweet](https://twitter.com/thesp0nge/status/507433542381764611), dicendo
appunto che avevo appena rimosso le mie due proposte dopo 2 mesi di silenzio.
Ah, i poteri dei social. Parte subito il
[tweet](https://twitter.com/CodemotionIT/status/507434658712526848) _mani
avanti_ che dice "eh, ma noi avevamo tempo fino al 16 Settembre per
decidere"[^3]. E subito un altro
[tweet](https://twitter.com/CodemotionIT/status/507435826360635392) _volemose
bene_, "rimanda le tue risposte, saremmo lieti di prenderle in considerazione".

Per carità, lecito. Però questo vuol dire che:

* in due mesi le proposte dei miei talk non le hai neanche prese in
  considerazione. Mi domando come questo possa cambiare in 2 settimane. Forse
  perché ho scritto su twitter e tutti leggono, si forse per questo.
* in questi due mesi le mie proposte le hai valutate, quindi anche ora che nn
  ci sono più, tu comunque hai un Excel o un foglio di carta o memoria storica
  anche solo per dire _"no guarda, facevano schifo"_.

La mia opinione? Un mix tra queste due. Secondo me appena hanno letto
_penetration test_ o _sviluppo sicuro_, è scattato un firewall mentale.

> Non parla delle API di facebook, né di come essere più produttivi quando
> lavori alla tua startup. Non c'è social media nel titolo e non parla di
> comunicazione 2.0. Non è un maker, non parla di arduino. Boh...

Perché se non fossero stati interessanti, uno li avrebbe potuti anche cassare
subito, come successe ad esempio a BetterSoftware. Al netto che non avevo
salvato le mie risposte... ed immagino che di quei dati nel backend non ci
fosse un backup.

## Si ma, rosico?

Non è la prima volta che rispondo ad un call for paper e non è la prima volta
che vado a generare entropia con un talk.

Quindi no, non rosico.

Solamente, mi spiace.

Mi spiace perché a me piace fare _awareness_ e parlare agli sviluppatori. Mi
spiace perché a me piace confrontarmi con gente che fa cose diverse e che ne sa
più di me su alcuni aspetti.

Mi spiace perché di solito all'estero si pensa un po' più in grande quando si
sviluppa software e non per compartimenti stagni.

Mi spiace perché ci tenevo ad andare in particolare in quelle due conferenze
perché dicono tutti essere veramente fiche.

Parlo già fin troppo, quindi non è che rosico se salta un talk, anzi.

Se volete venire a sentire il mio talk _"La sicurezza ai tempi dell'ASAP"_,
probabilmente sarà proposto in un evento #isaca a Roma a Dicembre e se viene
accettato ad una conf (_di sviluppatori_), sarà in prima visione a Milano a
Novembre.

C'è molto più bisogno di security nel codice delle vostre applicazioni web che
di vedere un quadcopter volare con una riga di node.js. Anche se quest'ultimo è
molto più divertente.

_Indeed_.

## UPDATE

Hanno accettato il mio talk al [Festival
ICT](http://www.festivalict.com/il-programma-2014/), a Novembre quindi si
parlerà de "La sicurezza ai tempi dell'ASAP".

[^1]: già ti vedo caro lettore, mentre pensi _ecco un altro post contro
      l'Italia_. Bhé, io amo il mio paese e proprio per questo letteralmente mi
      incazzo nel vedere che si ostina a non voler abbandonare la sua zona di
      comfort in certi campi. Uscire dalla zona di comfort porta a migliorare.
      Rimanerci porta a litigarsi le briciole coi soliti compagni di merende.

[^2]: era un talk divulgativo sulla Top 10 e sui rischi si security. Forse non
      originale ma, vedendo le porcherie che ci sono in giro secondo me qualcuno che
      doveva interessarsi all'argomento c'era.

[^3]: ho controllato più volte, io quella data mica l'ho vista prima. Mi sarà
      sfuggita? Forse, di sicuro non deve essere molto pubblicizzata.
