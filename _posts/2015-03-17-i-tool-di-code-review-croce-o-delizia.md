---
layout: post
title: "I tool di code review: croce o delizia?"
promotion: "I tool di analisi statica soffrono di hype e alcune feature mal progettate. Vediamo quali."
modified: 
featured: true
category: [Sicurina]
tags: [code review, sast, findbugs, /dev/brain]
image:
  feature: lana_colorata.jpg
  credit: Hilke Kurzke
  creditlink: https://flic.kr/p/aUjLoM
comments: true
share: true
---

Esiste un teorema fondamentale nell'informatica teorica che dice che una
funzione polinomiale non può stabilire la correttezza di un'altra funzione
polinomiale. Lo so, l'enunciazione è poco accademica e molto ortodossa, il
concetto però è **fondamentale** e smonta i claim sensazionalistici dei vendor
di tool di code review, [dawnscanner
compreso](https://rubygems.org/gems/dawnscanner).

Un programma non è in grado di dire se un altro programma è formalmente
corretto, quindi i tool di code review non daranno **mai** la soluzione certa
alla domanda _"il mio programma è scritto in maniera sicura?"_.

Quindi quando qualcuno vi dice che il tool di code review X ti da dei risultati
senza falsi positivi, sta facendo solo marketing. Un po' come la crema di toro
che promette faville sotto le lenzuola se applicata con perizia o il beverone
che ti fa avere addominali da urlo senza bisogno di allenarsi.

## Ma servono o no?

Diciamo subito una cosa. Analizzare del codice reale, anche fosse solo di 5
mila linee di codice, quindi una cosa abbastanza piccola, tutto a mano... è
**da pazzi**. Io non lo farei mai, voglio troppo bene al mio unico neurone.

I tool di analisi statica hanno una grande utilità nel disegnare i flussi delle
varie chiamate per fare (o provare a fare) taint propagation e fare un lavoro
_grep++_ like sul codice. La taint propagation è quella tecnica per la quale,
dato il flusso delle variabili all'interno del programma, si cerca di capire se
venga attraversata una routine di sanitizzazione dell'input o se invece il dato
controllato dall'utente viene usato direttamente, da qui cross site scripting,
injection varie e tanto bla bla bla.

Quindi, come tutti gli strumenti, sì servono ma devono essere usati bene e con
solide basi di analisi. Ecco perché, a mio avviso, non si può demandare agli
sviluppatori l'onere di fare security code review con il plugin figoso pere il
loro IDE a fumetti ed aspettarsi che il codice sia questo granché sicuro.

## Non userei mai uno strumento che...

Guardando un po' di tool commerciali ho provato a farmi un'idea delle _peggiori
feature_ fornite. Ecco una Top 3:

* _il tool lavora solo sul compilato, non gli serve il codice sorgente._
  Analisi statica del codice... e il codice non ti serve, bhé curioso come
  vincolo. In realtà questo approccio presuppone che esista nel processo di SDLC
  una building machine e questo quando ci sono tanti gruppi di lavoro che usano
  tool differenti, sotto strutture differenti è **impossibile** da ottenere. Mi
  si dica poi per applicazioni PHP o Ruby che razza di compilato io debba
  avere...
* _il tool non si aggancia a server SVN (o a server di continous build)._ Uno
  dei pillar[^1] della costruzione di un SSDLC che funzioni è **automare**.
  Sappiamo che i nostri team di sicurezza applicativa sono in perenne sofferenza
  numerica sugli sviluppatori e sui progetti. La chiave per fare il proprio
  lavoro in maniera efficente è automatizzare la maggior parte della cose (che
  scoperta, vero?). E' fondamentale poter scriptare il mio strumento di analisi
  statica in modo che un commit o una build inneschi il primo processo di
  verifica. Se questo tool non ha questa feature, chi l'ha sviluppato non ha
  contatto con la realtà.
* non supportiamo il framework X o la versione Y del linguaggio. Di recente ho
  trovato un tool commerciale che non era in grado di fare una scansione su
  codice iOS 8 perché, appoggiandosi pesantemente su ```xcodebuild``` era
  fortemente dipendente dal comportamento del compilatore. "Il tool supporta solo
  iOS 7" mi han detto. iOS 8 però è uscito più di 6 mesi fa e secondo le
  statistiche dell'Apple Store è già diffuso quasi al 90%, **che significa che il
  tuo tool non lo supporta?** In un mondo dinamico, come quello mobile, avere uno
  strumento di analisi statico riduce l'efficacia a 0%... leggasi, hai buttato
  via i tuoi soldi.

Menzione d'onore va a: _il mio tool lavora solo nel cloud._

## Userei uno strumento che...

Un po' come un vestito di sartoria o un qualsiasi gingillo elettronico,
l'utilità delle feature è molto personale. Io, per l'uso che ne faccio, voglio
che il mio strumento di analisi sia:

* libero da GUI pesanti, opprimenti e mal disegnate. Fidatevi, le grandi
  software house di security non hanno ancora capito che hanno bisogno di un bel
  UX designer e di un bravo sviluppatore frontend
* scriptabile, datemi quelle API. Devo poter personalizzare quanto più
  possibile il mio strumento... deve essere creta ed io il vasaio, altrimenti
  ancora una volta si rivela un prodotto utile a metà, forse un quarto.
* sia estendibile. Devo poter aggiungere controlli particolari, magari seguendo
  linee guida interne di sviluppo e devo poterlo fare senza impazzire.

## Findbugs, il belloccio dell'opensource

Quando mi chiedono, ma tu cosa usi per fare l'analisi di codice Java, io vorrei
tanto parlargli di Owasp Orizon ma ripiego spesso e volentieri su
[findbugs](http://findbugs.sourceforge.net) che ho scoperto, ieri, avere un
plugin per aumentare il numero di controlli di sicurezza: [Find Security
Bugs](http://h3xstream.github.io/find-sec-bugs/).

[Find Security Bugs](http://h3xstream.github.io/find-sec-bugs/) è un Jar che si
deve aggiungere a findbugs per avere [56 controlli di security
aggiuntivi](http://h3xstream.github.io/find-sec-bugs/bugs.htm). Fornisce
integrazione con
[Jenkins](https://github.com/h3xstream/find-sec-bugs/wiki/Jenkins-integration)
e [Maven](https://github.com/h3xstream/find-sec-bugs/wiki/Maven-configuration)
ed è [opensource](https://github.com/h3xstream/find-sec-bugs) quindi si può
estendere, si può contribuire al progetto... non resta che provarlo e farci un
bel post.

[^1]: sai che stai diventando vecchio quando usi pillar in una frase.
