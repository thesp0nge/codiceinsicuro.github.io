---
layout: post
title: "Tool di code review e minority report"
promotion: "Gli strumenti di analisi del codice: tra una dashboard alla minority report e la promessa di 0% falsi positivi"
modified: 
featured: false
category: [post]
tags: [owasp, owasp orizon, dawnscanner, tool, code review, minority report, dinis cruz, ricordi]
image:
  feature: minority.jpg
  credit: youflavio
  creditlink: https://flic.kr/p/eR5fWS
comments: true
share: true
---

Ricordo che eravamo in [Algarve](https://it.wikipedia.org/wiki/Algarve), per l'[Owasp Summit del 2008](https://www.owasp.org/index.php/OWASP_EU_Summit_2008). Ricordo
che, parlando di [Owasp
Orizon](http://www.owasp.org/index.php/Category:OWASP_Orizon_Project), [Dinis
Cruz](http://blog.diniscruz.com/) fece un'analogia tra l'output dei tool dei nostri arsenali e quello
schermo tattile che Tom Cruise usa in [Minority Report](https://it.wikipedia.org/wiki/Minority_Report).

Lo strumento ideale deve indizi; deve permettermi di fare dei collegamenti, di
vedere dove si nasconde la vulnerabilità.

Sono passati 8 anni e nessuno strumento, che conosco, che utilizzo e che
sviluppo, è andato verso quella direzione. **Anzi**. I grossi player di
mercato, non hanno ancora inserito nei loro team qualcuno che si occupi di
design e di usabilità.

Quando [WebInspect](http://www8.hp.com/it/it/software-solutions/webinspect-dynamic-analysis-dast/) finisce il suo lavoro, sinceramente penso di essere
ancora nel 2001. Lo stesso dicasi per [Fortify](http://www8.hp.com/it/it/software-solutions/static-code-analysis-sast/index.html) ad esempio. Nel caso del
tool di code review è ancora peggio, perché in un prodotto **stabile**, è stato
mischiato un pezzo di UI nuova ad un pezzo di UI vecchia, con la sensazione per
l'utente di essere nel mezzo di un beta testing.

Idem con patate il mio caro [Nexpose](https://www.rapid7.com/products/nexpose/). La parte di interfaccia dei report,
per un anno almeno, è stata non coerente con il resto dello strumento.

> L'analista non deve avere risposte assolute dallo strumento, deve avere
> **indicatori**.

Al netto poi dell'usabilità, i tool di code review partono con l'assunto
presuntuoso di volermi dare la soluzione **esatta** al mio problema.

All'ipotetica domanda _"voglio uno strumento che mi aiuti nel fare (code review
|| pentest || antani)"_, la risposta di chi fa vendita è _"prova il mio, è 0%
false positive free"_.

Quando gli chiedi una comparazione con gli altri, difficile avere qualcosa di
usabile. Gli altri fanno tutti schifo.

Ora, per me che hpo un po' di esperienza e qualche nome, l'ho provato in questi
anni, magari è semplice scegliere, ma per la persona che si occupa di #appsec
per caso nella propria azienda? Come riesce, non solo a scegliere, ma poi a
fruire dei risultati dello strumento se sono ancora troppo legati al risultato
tecnico?

Che poi, l'infallibilità di un software nel rilevare difetti di un altro
software, non solo è poco probabile, ma anche [impossibile](https://it.wikipedia.org/wiki/Teorema_di_Cook-Levin).

L'interfaccia grafica e la mancanza di comunicazione tra strumenti non rendono
facile il lavoro di analisi. Io devo essere libero di scegliere il tool che
preferisco, perché un vendor sarà più bravo a fare una cosa rispetto ad un
altro e viceversa. I tool, in un mondo ideale, dovrebbero poter condividere
risultati che mi rendano semplice intersecare i dati.

Mettiamo ad esempio che io voglia usare [Burp](https://portswigger.net/burp/) e [Fortify](http://www8.hp.com/it/it/software-solutions/static-code-analysis-sast/index.html) su un
progetto. Io devo avere una dashboard unica, che mi mostra il flusso dei dati
rilevato durante l'analisi dinamica associato al codice sorfente che viene
attraversato. L'analista non deve avere risposte assolute dallo strumento, deve
avere **indicatori**. Gli strumenti devono dargli dei sospetti circa la
presenza di una vulnerabilità o di un problema più complesso.

Durante anni di analisi, partendo da un finding di severità alta sono arrivato
a ricondurre il tutto ad un input non filtrato che però non era sfruttabile,
mentre vulnerabilità di severità medio o bassa che sono diventate delle
_session fixation_. Perché questo? Perché l'esperienza di chi analizza non è un
qualcosa che può essere sostituito, mentre il tool dovrebbe limitarsi ad
evidenziare sospetti o punti che poi devono essere approfonditi.

Ho sinceramente visto troppi report generati in automatico pieni di _Null
pointer dereference_, marchiati come _High severity_. Lì mi accorgo se il
fornitore mi ha rubato i soldi e quanto il grado di competenza. Anche perché,
quando poi chiedi in quale condizioni si attiva quella dereferenziazione, le
risposte sono imbarazzanti, quando arrivano.

Poi è chiaro, ci sono pattern di sviluppo che non danno troppo spazio
all'immaginazione. Leggi qualcosa dalla richiesta http e lo usi così com'è, il
codice è vulnerabile a [cross site scripting](https://it.wikipedia.org/wiki/Cross-site_scripting). In questo caso che si fa? Il
tool: _"si filtra l'input!"_ E lo sviluppatore ci chiede: _"come?"_ Ed il tool
ci risponde: _"si filtra l'input!"_

Pochi strumenti danno dei suggerimenti per la remediation che possano essere
fruibili. Nessun strumento ad esempio mi da già la regola da applicare in
[mod_security](https://www.modsecurity.org/) per fare virtual patching. Rilevo una SQL Injection in
produzione, non me n'ero mai accorto. Secondo lo strumento cosa dovrei fare?
Metto _offline_ un portale in produzione, che magari è parte del mio business?
Difficilmente accadrebbe. Più semplice tirar su [mod_security](https://www.modsecurity.org/) al volo e
fare virtual patching mentre gli sviluppatori mettono la patch in sviluppo e
collaudo.

Vedo 3 problemi grossi:
* i tool non cooperano tra di loro
* i tool sono focalizzati sul finding e non mi rendono semplice vedere lo
  scenario più grande
* i tool hanno una UI indietro di 20 anni.

Grandi problemi, grandi opportunità.

Enjoy it!
