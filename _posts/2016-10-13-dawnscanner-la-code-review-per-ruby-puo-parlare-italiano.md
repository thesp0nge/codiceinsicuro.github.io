---
layout: post
author: thesp0nge
title: "dawnscanner: la code review per ruby può parlare italiano?"
promotion: 
modified: 
featured: false
category: [post]
tags: [code review, ruby, sinatra, ruby on rails, padrino, hanami, mvc]
image:
  feature: dict.jpg
comments: true
share: true
---

[Eccola
qui](https://www.helpnetsecurity.com/2016/10/12/scan-ruby-based-apps-dawnscanner/)
la mia intervista rilasciata al sito [Helpnet
Security](https://www.helpnetsecurity.com/) su
[dawnscanner](https://dawnscanner.org).

3 anni di lavoro condensato in qualche domanda su questo progetto, che ha
riacceso in me la passione nello sviluppo community driven e nello scrivere
tool di code review.

Dopo l'avventura, ora ricominciata, con [Owasp
Orizon](http://www.owasp.org/index.php/The_Owasp_Orizon_Framework) ero
letteralmente devastato moralmente. Nessun supporto dalla community, nessun
feedback, nessuna idea ma iniziavo a vedere Owasp Orizon in giro per alcune
slide, usate in prevendita. Le trovavo anche in quelle dei competitor. Quando
una persona, ignara di chi fossi, un giorno nel chiacchiericcio da macchina del
caffé affermò, che _"sì, lui contribuiva anche al progetto Owasp Orizon"_, mi
caddero letteralmente le palle.

Ero lo sviluppatore, lì davanti a lui e forse ero l'unico che non ne traeva
beneficio. Sul _personal branding_ devo lavorare ancora sodo. Fu anche questa
brutta aria a farmi fermare allora. Era il 2010 ed ero letteralmente svuotato.

Invece grazie a [Railsberry](http://www.railsberry.com) che tutto si riaccese.
Stavo parlando di alcune gemme che ho scritto per dare il là alla parte di
penetration test applicativo e nell'entusiasmo mi sono detto: _"bhé se lo
attacco, lo posso anche difendere questo codice Ruby"_.

Il primo ostacolo fu proprio [Rails](https://rubyonrails.org), il framework MVC
che ha fatto conoscere [Ruby](http://ruby-lang.org/en) al grande pubblico.
[Brakeman](https://brakemanscanner.org) è il prodotto di analisi statica più
conosciuto e, credo, utilizzato se hai un'applicazione scritta in Rails. Ma se
hai applicazioni scritte in altri MVC?

Dopotutto, io devo proteggere il codice Ruby, non il codice Ruby scritto con un
certo MVC e con un certo strato ORM (semplificando: l'astrazione di come il
_model_ accede ai dati del db).

E quindi iniziai a lavorare ad [uno strumento di analisi statica del codice,
oggi conosciuto come Dawnscanner](https://github.com/thesp0nge/dawnscanner).

Le modifiche si susseguivano, il numero di CVE aggiungi alla knowledge base era
in crescendo ed eccoci qui, 3 anni dopo. 3 anni dopo è appena uscita la
versione [1.6.5](https://rubygems.org/gems/dawnscanner/versions/1.6.5) con più
di 230 bollettini di sicurezza afferenti al mondo Ruby, rilasciati dal 2006in
avanti. Da un rapido confronto è di gran lunga un numero maggiore dei test di
brakeman. Manca la parte di introspezione dei controller e delle viste, per
cercare le issue della Top 10 Owasp, ma per quello ci lavoro piano piano.

La comunità Ruby, dal numero di pull request, dalle issue aperte, si è
dimostrata molto più aperta di quella puramente #appsec. Non vogliatemene.
Forse è più 31337 scrivere un [tool per rilevare
XSS](https://rubygems.org/gems/cross/versions/0.76.0), ma io credo che la
sicurezza del codice debba passare dal codice stesso. E se non hai dei buoni
tool a supporto, non farai molta strada.

Cosa mi aspetto da dawnscanner ora? Bhé... che venga sempre più utilizzato e
quando colmerà il gap ed incorporerà i test della Top 10 Owasp, la code review
per la security delle applicazioni Ruby, parlerà solamente italiano.

Enjoy it!
