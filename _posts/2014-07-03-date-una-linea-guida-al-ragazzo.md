---
layout: post
title: "Date una linea guida al ragazzo"
modified: 2014-07-03 07:46:56 +0200
category: [Chiacchiere da bar]
tags: [linee guida, awareness, test, documentazione]
image:
  feature: linea_blu.png
  credit: Dorli Photography
  creditlink: https://flic.kr/p/e6iqJP
comments: true
share: true
---

Una cosa che possiamo dare per scontata, parlando di sviluppatori, è la
seguente:

> lo sviluppatore è pigro e per lui scrivere documentazione è una tortura,
> tuttavia se si tratta di fruire di documentazione ben scritta di sicuro non
> si tira indietro

Quando ho lavorato per un paio d'anni in una web agency di Milano, ho potuto
osservare sviluppatori veramente forti. La costante nelle chiacchiere tra un
test e una linea di codice era rivolta al nuovo speech del guru di turno, al
nuovo blog, al nuovo screencast, al nuovo libro.

Ho potuto osservare che se la documentazione è buona ed aggiunge valore allora
difficilmente sarà ignorata.

Ora, veniamo a noi. Gli sviluppatori, quelli bravi, hanno sensibilità sul tema
security. Se tu che leggi, non ti preoccupi se la tua applicazione ha un cross
site scripting allora è meglio tu riveda le tue priorità.

Dare una linea guida su come scrivere codice sicuro è tuttavia un compendio
necessario. Tuttavia, come in molte cose della vita, c'è linea guida e c'è
linea guida.

## Linee guida: the banfa's way

Il segno distintivo di una linea guida tutta fuffa e distintivo è data
dall'autore. Scrive codice? Non ai tempi dell'università o delle scuole
superiori... oggi, scrive codice? Fa delle code review?

Se hai un dubbio, probabilmente l'autore delle tue linee guida non sa di cosa
sta scrivendo o sta reciclando contenuti scopiazzati qua e là. Il risultato
sarà un documento il cui valore aggiunto rasenterà la nullità.

Secondo segno distintivo. Il documento è pieno zeppo di definizioni di
security. Ti spiega a parole nel dettaglio cos'è un [cross site request
forgery](https://www.owasp.org/index.php/Top_10_2013-A8-Cross-Site_Request_Forgery_(CSRF)),
ti dice che cos'è un buffer overflow anche se la linea guida dovrebbe essere
declinata per Java e fa pochissimi esempi concreti. **Leggasi**: c'è pochissimo
codice lì dentro.
Non ti spiega come creare numeri random sicuri, non ti mostra come gestire la
password dei tuoi utenti, ti lascia con un laconico _"filtra il tuo input se
vuoi eliminare i cross site scripting"_, lasciando allo sviluppatore
l'esperienza di scoprire da solo cosa diamine significhi filtrare l'input.

Terzo segno distintivo. Non ha, o ne ha pochissimi, link di approfondimento a
contenuti anche di terze parti. Fare un'opera omnia per un cliente è
utopistico. Lo vende il sales che vuole piazzare all'ignaro security manager un
po' di K da spendere. In realtà non è umano pretendere che una linea guida
copra **tutto** nel dettaglio, chi sostiene il contrario è in malafede.

E' invece auspicabile che una linea guida spieghi i concetti base, riempiendo
il lettore di link per approfondire.

## Linee guida: the hacker's way

Ok. Abbiamo visto cosa una linea guida non deve avere, ma quindi se un cliente
ci chiede di redigerne una o se stiamo valutando il lavoro di un consulente prima
di darlo ai nostri sviluppatori, come facciamo a distinguere un buon lavoro?

Innanzitutto l'indice. L'indice del documento non deve essere basato né sulla
Top 10, né sulle vulnerabilità o sui rischi. L'indice del documento deve essere
basato sulle caratteristiche dell'applicazione web.

Il meccanismo di autenticazione. Come memorizzare la password. Come
implementare il single sign on con [oauth](http://oauth.net/2/). Il logging,
come gestirlo e quali informazioni mascherare. Questi devono essere tutti
titoli di un capitolo (ovviamente non solo questi) ad hoc. Allo sviluppatore
non importa un fico secco della trattazione accademica di quale algoritmo di
cifratura scali meglio; lui conosce MD5 o al massimo SHA1, una buona linea
guida deve dargli un pool di alternative sane (bcrypt, sha512 o sha256 in
questo ordine di preferenza, no way) dicendo per ciascun algoritmo l'impatto a
livello di dimensione della variabile nel DB[^1].

Se penso a me col cappello da sviluppatore, sento prudere fortemente le mani
quando mi si dice _"filtra l'input"_. Che diamine significa "filtra l'input"?
Metto un setaccio davanti all'application server? Quali caratteri devo
rimuovere? Come gestisco il caso dell'apostrofo che spesso mi serve per
memorizzare indirizzi o cognomi?

Invece di dare una generica raccomandazione tanto inutile quanto pericolosa[^2]
e qui di vede se chi ha scritto quel documento ha un pregresso da sviluppatore,
gli esempi devono essere puntuali e concreti. Lo sviluppatore sa adattarli.
Come sa se gli stai dando solo fumo.

Codice... è presente? Ci sono rimandi ad
[ESAPI](https://www.owasp.org/index.php/Category:OWASP_Enterprise_Security_API)?
Se trovi questi elementi allora hai tra le mani decisamente un buon prodotto.

Una buona linea guida, come abbiamo detto prima, deve avere un sacco di link.
Ben vengano quindi rimandi a [stackoverflow](http://stackoverflow.com/), a talk
in conferenze (al 100% in inglese, quindi preparatevi), libri, screencast.

Delicato il tema del testing del software. Una linea guida degna di tale nome
deve parlare dei test, meglio se automatizzati e meglio se sono loro a guidare
lo sviluppo partendo dalla formalizzazione dei requisiti dell'utente.

## Off by one

Se dovete scrivere una linea guida per i vostri clienti, farcitela di esempi e
di link. A nessuno serve l'ennesima spiegazione di cosa sia un cross site
scripting o una sql injection se poi in pochi sanno scrivere un meccanismo di
autenticazione o password reset robusto o c'è gente che pensa ancora di
memorizzare le password offuscate con MD5.

Il compito di un application security specialist degno di tale nome è creare
consapevolezza, diffondere conoscenza ed aiutare i propri clienti. Non staccare
meramente la fattura.

Enjoy it!

[^1]: per quei linguaggi / framework che non prevedono l'uso di un ORM che ti
      astragga dal dover dichiarare quanti caratteri ha il tuo VARCHAR.

[^2]: una remediation troppo generica da troppa libertà di interpretazione allo
      sviluppatore. Filtrare l'input può vuol dire tutto e niente, con il risultato
      che ciascuno la interpreta a modo proprio e la vulnerabilità è tutto fuorché
      mitigata.
