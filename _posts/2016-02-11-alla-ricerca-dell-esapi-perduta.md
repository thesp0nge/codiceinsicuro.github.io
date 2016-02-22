---
layout: post
title: "Alla ricerca dell'ESAPI perduta"
promotion: "Agli sviluppatori java manca una libreria di security enforcement che sia realmente usabile. Sei d'accordo? Leggi qui."
modified: 
featured: true
category: [Sicurina]
tags: [java, secure library, ssdlc, sviluppo sicuro, owasp, coverity, esapi, api, owasp esapi]
image:
  feature: libreria.jpg
  credit: Oscar F. Hevia
  creditlink: https://flic.kr/p/jD4vM7
comments: true
share: true
---

Due cose mi accomunano allo sviluppatore Java. La prima è l'amore per il caffè.
I Javisti amano così tanto la sacra bevanda dal chicco marrone, da avergli
dedicato anche il magic type dei file .class[^1].

La seconda cosa, che in realtà interessa solo gli sviluppatori che leggono
regolarmente [Codice Insicuro]({{site.url}}), è lo smarrimento di fronte alla
frase _"dovete usare una libreria di safe coding"_ che chissà quante volte il
solerte penetration tester, che non ha mai toccato una linea di codice in vita
sua, avrà affermato di fronte ad un [Cross Site scripting](https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet).

Certo, c'è il progetto [Owasp ESAPI](https://github.com/ESAPI/esapi-java). Già.
A mio avviso uno grosso rimpianto che deve avere il progetto Owasp nella sua
interezza. Noto analogie con il non troppo compianto dal mondo, progetto [Stand
by WordPress](https://standbywordpress.wordpress.com). Quando si chiede a
qualcuno di security di **sviluppare** del codice, opensource per di più, la
maggior parte si da alla macchia.

Perché? Semplice, è difficile, porta via tempo e non da troppe glorie.

Meglio avventurarsi in qualcosa di _sicuro_, come fare un documento,
organizzare delle call. Sporcarsi le mani con del codice, porta con sé il
rischio, di creare qualcosa che non funziona, qualcosa che ha dei bug. E poi
come lo spieghi quando vai a banfare delle tue fantomatiche competenze?

Il progetto Owasp ESAPI ha tre grandi difetti a mio avviso.

Il primo, ne abbiamo parlato poco sopra, è che non ha creato _traction_. Il
codice è fermo, le issue aperte tantissime e nessuno ci sta lavorando
attivamente.

Il secondo, figlio del primo, è la mancanza di documentazione e di test unit.
Tutti odiamo scrivere documenti ma, se vogliamo attirare qualcuno a lavorare
sopra il nostro codice, soprattutto quando diventa grosso come ESAPI, deve
essere pieno di documentazione, di esempi e di unit test che facciano capire al
_newbie_ come orientarsi.

Il terzo è logistico. Porta dietro con se troppe dipendenze. Se un team vuole
creare un'API leggera, che stia in un WAR contenuto, non può farlo perché
appena installa Owasp ESAPI, questo si porta dietro il mondo intero.

## Buone intenzioni, pessimo design

Una premessa, Owasp ESAPI implementa un concetto che è sacrosanto. La
comunità #appsec, deve fornire degli strumenti "chiavi in mano" agli
sviluppatori per scrivere codice sicuro. **No WAY**

Secondo me bisogna partire dalle radici. Creare qualcosa che rispecchi il
principio del KISS[^2], che sia pieno di documentazione e di esempi. Creare
qualcosa coinvolgendo gli utenti finali; non deve essere qualcosa che piomba
dall'alto come una sacra verità, deve essere qualcosa che ha negli sviluppatori
gli early adopters.

> Una libreria di controlli di security deve piacere agli sviluppatori. Deve
> essere costruita per rispondere alle loro esigenze.

Una libreria di controlli di security deve essere opensource, inutile forse
ribadirlo. Deve essere facilmente estendibile, con la possibilità di creare
regole custom. Deve essere **viva**, avere tanti commit e release frequenti.

## Qualche alternativa

Usate [Owasp
ESAPI](https://github.com/ESAPI/esapi-java-legacy).
No, non sto scherzando. Owasp ESAPI rimane un bel pezzo di codice e resta la
scelta numero 1 se per voi il numero di dipendenze o un progetto un po' poco
attivo non sono dei problemi. L'elevato numero di issue aperte, 145 mentre vi
sto scrivendo, rende però ESAPI più una soluzione amarcord che una scelta
ponderata.

Prima alternativa: [Owasp Java
Encoder](https://github.com/OWASP/owasp-java-encoder). Libreria senza
dipendenze con lo scopo di risolvere il problema del Cross Site Scripting,
attraverso l'output encoding.

Seconda alternativa: [Owasp Java
Validator](https://github.com/OWASP/owasp-java-validator). Questa libreria si
basa sul codice di validazione presente in ESAPI. Quindi possiamo dire che è un
pezzo di ESAPI estratto per fare validazione dell'input.

Terza alternativa: [Coverity Security
Library](https://github.com/coverity/coverity-security-library). Cambiamo
totalmente parrocchia, [Coverity](http://www.coverity.com) è un vendor di
soluzioni di analisi statica del codice e questa è la sua libreria di controlli
custom. Può essere un valido player.

## Off by one

Fino a quando gli sviluppatori e #appsec guys si guarderanno come se gli [uni
fossero di Venere e gli altri di
Marte](http://blog.coverity.com/2012/09/21/developers-are-from-mars-security-experts-from-venus/#.VruzDMe5Yg8),
non andremo proprio da nessuna parte. O meglio, continueremo ad farcire il
[mercato di fuffa]({{site.url}}/blog/lhacking-e-etico-e-riempire-lict-di-fuffa)
senza risolvere il problema reale.

Dobbiamo da una parte fornire strategie per scrivere codice sicuro, ma
dall'altra implementare queste strategie in controlli fruibili dagli
sviluppatori. Sì, signori miei, dobbiamo scendere dalla torre d'avorio e
sporcarci le mani col codice.

Non possiamo limitarci a suggerire di fare encoding o di fare input filtering.
Dobbiamo far vedere alla gente come fare. Se fossero stati già in grado, non
avremmo trovato la vulnerabilità.

Dobbiamo trovare le risposte giuste, fornire quindi controlli contro:

* XSS, CSRF e SQL Injection
* Generazione di token, numeri pseudocasuali
* Attacchi contro il meccanismo di autenticazione
* Attacchi contro il meccanismo di password reset

Dobbiamo insomma fornire alle persone, un framework di controlli che loro
possano inserire nella loro applicazione web ed integrarsi in maniera
**trasparente**.

Dobbiamo fare tutto questo **ORA**, altrimenti perderemo, noi persone
dell'#appsec, l'ennesimo treno.

Enjoy it.

[^1]: I file .class, contenenti il bytecode che sarà interpretato dalla JVM, ha
      come byte di inizio, la stringa ```0xCAFEBABE```. Non è adorabile?

[^2]: Keep It Simple Stupid
