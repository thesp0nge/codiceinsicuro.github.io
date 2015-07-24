---
layout: post
title: "Chi li paga poi i danni?"
promotion: "Affrontiamo il tema spinoso della mitigazione alle vulnerabilità emerse dopo un penetration test applicativo"
modified: 
featured: true
category: [Meditazione]
tags: [awareness, sicurezza applicativa, project management, gantt]
image:
  feature: cocci.jpg
  credit: Sara y Tzunki (Cecilia e Francesco)
  creditlink: https://flic.kr/p/5SjWZn
comments: true
share: true
---

Nelle grandi società, in campo IT siamo indietro _almeno_ di una decade (in
media). Poi ci sono soggetti che per la loro _forma mentis_ sono ancora fermi
ancora a come si progettava il software negli anni 60. Potessero perforare una
scheda sarebbe il massimo, darebbe un senso alle loro giornate frustrate
passate in un mondo in continua evoluzione che li ha visti, forse per
disillusione e disincanto, fermi ormai al palo.

Chi ama Project alzi la mano. Va benissimo qualsiasi software che vi permetta
di disegnare stupendi diagrammi temporali che vi daranno l'illusione che avete
il controllo sul vostro progetto e che, _"sì, va tutto dannatamente bene"_.
Quanti gantt avete stracciato nella vostra vita? Quanti progetti si sono
rivelati poi in madornale ritardo? Quanti occhi che guardando altrove si
conterebbero se faceste questa domanda ai vari PM, demand manager e altre
figure epiche del _business_[^1]

## Il Penetration test applicativo

Piano piano con pazienza, leggendo questo blog o facendo awareness nel luogo di
lavoro, stiamo convincendo le altre entità aziendali che, non è una buona idea
mandare online codice scritto coi piedi senza opportuni test di security.
C'è poi una fase che somiglia molto a quegli aperitivi dove impacciati si
aspetta la reazione degli altri per capire chi tirerà fuori il borsellino per
l'ultimo giro di tavolo.

> La stima per rimediare a queste vulnerabilità è di X giornate con un costo di
> Y.

Il solerte Project Manager desideroso di battere cassa, più offeso perché gli
avete sfondato l'applicazione chiaramente, chiede a voi i soldi per rimediare a
codice scritto male da lui (dal suo team).

Un po' come dire, tu porti la macchina dal meccanico per la revisione e lui
trova che la pompa dell'olio è da buttare e la tua reazione è _"bene, ma io non
avevo previsto aver rotto la pompa dell'olio, quindi mi devi dare dei soldi per
aggiustarla"_. Sì, effettivamente nel mondo reale un ragionamento del genere è
chiaramente ridicolo.

Tuttavia per alcuni, che appunto vivono negli anni 60, la sicurezza informatica
è una cosa completamente sconosciuta, una specie di voodoo visto con un misto
di timore, paura e seccatura.

La realtà dei fatti è che più delle volte hai spiegato al PM che avrebbe dovuto
prevedere una fase di remediation alle vulnerabilità che sarebbero emerse dai
test. Tuttavia quando lui ti ha chiesto _"quanti giorni stimo?"_, la tua
risposta _"bhé dipende da quello che viene fuori dai test"_, tanto onesta
quanto vaga, non gli ha permesso di mentenere il controllo. Lui voleva un
numero, tu non gliel'hai dato quindi lui ha messo 0.

Bella cima vero?

## La regola aurea: Il teorema della non-stima

Ho quindi eleaborato un mio personalissimo teorema per venirne a capo. Si badi
bene, questo teorema **non** ha alcun fondamento scientifico e va applicato con
leggerezza e spensieratezza, uniche armi che abbiamo contro cariatidi legate
ancora al modello di sviluppo software a cascata.

Noi sappiamo che, **realmente**, il tempo per sviluppare le patch dipende da
due fattori non noti a priori ed in un caso non misurabili:

* quante vulnerabilità troverò e soprattutto di che natura
* quanto è bravo lo/gli sviluppatori

Cosa sappiamo prima di iniziare? Bhé, possiamo fare un piccolo sondaggio agli
sviluppatori, per saggiarne il livello. Domande come la loro numerosità, il
fatto di usare un sistema come GIT o similiari, l'usare o meno strumenti di
test automatizzato gi possono aiutare a capire quanto allineati con i giorni
nostri sono gli sviluppatori che poi dovranno implementare le nostre
raccomandazioni.

Possiamo anche fare un piccolo _pre-assessment_ sull'applicazione valutando la
sua architettura. C'è un web application firewall davanti? Ci sono policy di
sviluppo sicuro? Come sono segregati i livelli applicativi?

Soprattutto, io devo sapere quando questa applicazione andrà online. E questo è
forse l'unico dato certo, non sotto il controllo del PM perché lo decide il
business... e di solito il business decide una data completamente irrealistica.

Queste attività mi danno un'idea di massima che mi permette di stimare il
valore di _P_.


* P=5. Bagno di sangue. Gente con poca esperienza ha poco tempo per fare
  un'applicazione complessa. Anche una vulnerabilità con severità INFO potrebbe
  essere un problema.
* P=4. La cattedrale nel deserto. Un team, anche strutturato, ha poco tempo per
  fare un'applicazione complessa. Il problema sono i giorni a disposizione e le
  funzionalità da implementare. Almeno il fattore umano è salvo.
* P=3. Rifacciamo Amazon? Il team è competente, le giornate sono stimate in
  maniera adeguata ma c'è veramente tanto lavoro da fare.
* P=2. Riscrivo un blog. Il team è competente, le giornate sono stimate in modo
  adeguato alle funzionalità richieste. Questa è la condizione ideale, quella
  nella quale difficilmente saremo.
* P=1. Il team ha skill nettamente superiori alla media. Questo vince su
  qualsiasi stima di giorni e funzionalità. Difficilmente saremo in questo punto,
  l'ho messo solo perché partire da 2 mi sembrava brutto e fare una scala 2..5
  ancora peggio.

Dato P è tempo di stimare K, il numero di vulnerabilità che noi andremo a
trovare. Questa è la parte magica e dipende molto ovviamente dal pregresso
dei test che avete fatto in azienda o con quel particolare cliente, se siete
freelance ad esempio.

K sarà la media pesata delle vulnerabilità associata al livello della severità.
Il numero di vulneravilità alte, medie e basse dipenderà dal pregresso, dovete
quindi avere uno storico dei risultati dei penetration test precedenti.
Ricordatevi, questa è una non-formula, stimare il numero di giornate è
**impossibile** a priori, serve solo per dare un numero a caso, un numero che
la maggior parte delle volte cadrà nel limbo.

> K= (5 x VH + 3 x VM + 1 x VL)/3

Il numero di giornate sarà quindi dato dalla formula:

> ln e^2 x [rand(5) + (P x K)]

## Off by one

Stimare il numero di giornate che serviranno per la remediation a seguito di un
penetration test non è difficile, è **impossibile**. Su questo mettiamoci una
pietra sopra. Anche stimare quanto impiegherai per fare i test è complesso,
dipende da troppi fattori ma almeno un numero di massima possiamo darlo. State
sempre un po' larghi, suggerimento mio.

Fate anche capire al vostro cliente che l'attività di mitigazione è un'attività
di bug fixing che non può essere caricata a chi ha eseguito i test, che invece
ha fatto per voi un servizio e giustamente deve essere
[pagato]({{site.url}}/blog/se-paghi-noccioline-attirerai-scimmie-storie-job-posting-nellera-delle-startup/)

Qual è la vostra esperienza per il post penetration test? Lasciate un commento
e dite la vostra.


[^1]: il business è quell'entità astratta che all'interno dell'azienda cerca di
      anticipare i desideri dei propri clienti disattendendoli ogni volta. Si
      autoproclama soggetto che non dorme mai, mentre il nostro avviso sarebbe quello
      che un buon sonno ristoratore toglierebbe tante idee malsane.
