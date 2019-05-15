---
layout: post
author: thesp0nge
title: "Come la vuole la disclosure? Full o Responsible?"
promotion: "Una riflessione sulla disclosure e sulle difficoltà di ingaggiare il giusto team"
modified: 
category: [Chiacchiere da bar]
tags: [disclosure, vulnerabilità, libertà, censura, responsabilità, flussi aziendali, hacker, hacking, pentest]
image:
  feature: bilancia.png
comments: true
share: true
---

Un vecchio adagio dice che la mia libertà finisce dove inizia la libertà
dell'altro.

Oggi la mia attenzione è stata colta da un post su un blog. Durante un pentest
casalingo su un'applicazione mobile di un brand importante italiano è emerso
che le API del backend usato dall'app, erano vulnerabili a SQL Injection.

Qui la nostra storia è ad un bivio.

## Ma 'ndo vai se la sichiuriti non ce l'hai?

Il brand è noto. I dati sicuramente sensibili. Il gruppo di security in quella
società è presente, almeno a livello di management e prime linee, poi ci
saranno i soliti presidi di consulenti. Nonostante questo, nell'anno di nostro
signore _duemilaequindici_:

* non sono stati fatti penetration test applicativi (o sono stati fatti male)
* non sono state evidentemente seguite linee guida di sviluppo sicuro
* non è in piedi un web application firewall oppure è configurato male

A me suona un po' strano. Sia per la natura della big corporate, sia per le
cose che sono andate storte. Secondo me, con ogni probabilità, trattasi di
rilascio fatto di venerdì sera senza aver avvisato nessuno, security tanto meno
e senza uno straccio di test.

Oppure è stata chiesta l'esclusione per quell'URL dai WAF perché lo vuole il
management, perché rallenta il sito, perché blocca il business (che per
l'inciso... non dorme mai).

Queste cose succedono fin troppo spesso. Manca una sensibilità ai problemi di
sicurezza negli stakeholder che sembra quasi impossibile che ormai le
inferriate alle finestre siano così diffuse.

Il caso Sony dovrebbe far riflettere un po'.

> Un vecchio adagio dice che la mia libertà finisce dove inizia la libertà
> dell'altro.

Comunque ti giri, sia che security non abbia fatto bene i test, sia che manchi
il processo di ingaggio corretto, sia che sia stata fatta una cosa _aumma,
aumma_, sia che il management si sia assunto un rischio che non poteva
assumersi, il big brand ha **toppato alla grande**.

## Disclosure, flussi di comunicazione e problemi di coscienza

E il nostro ricercatore? Sul suo blog[^1], mette come timeline di excalation:

* giorno 1: ho scoperto la vulnerabilità
* giorno 8: ho avvisato il... **servizio clienti**
* giorno 12: ho avvisato il supporto dell'applicazione, con un primo followup
* giorno 13: gli ho dato più dettagli poi il nulla
* giorno 40: faccio disclosure perché non mi hanno dato più feedback

Analizziamo un po'. Hai impiegato il 6 giorni per decidere di avvisare il
portale dell'helpdesk dedicato ai clienti customer. Probabilmente hai parlato
con del personale dislocato a Tirana che conosce 2 parole di Italiano e che
risponde con davanti un flowchart per il troubleshoot di primo livello.
Di sicuro, di fronte a SQL Injection ha pensato alle iniezioni vere.

Escludo questa persona abbia impiegato 6 giorni perché intanto impegnato in un
dump... lo escludo. L'avesse fatto mi incazzerei parecchio fossi utente del
servizio. Prima con lui, poi con il fornitore.

Ha contattato poi gli sviluppatori che, 90 probabilità su 100, erano una web
agency esterna, esperta forse in comunicazione, brand, yoyo, fighetterie social
ma di sicuro non esperta in security.

Potrebbero essere anche sviluppatori interni che hanno capito il problema,
probabilmente persone di società di consulenza incapsulate nei soliti contratti
tipo matrioska. Prima di Natale, ce lo vedi uno sviluppatore stipendiato 1200€
lordi al mese senza straordinari che si vuole mettere lì a fare bug fix a caldo
di una API per una issue di security che non magari non sa come correggere?

Ti aspetti veramente che in 2 settimane questo ti faccia un fix in produzione
sotto Natale?

Sono due le cose: o non hai mai lavorato, o non l'hai mai fatto in una società
grossa.
Con questo non voglio dire che non si debba pretendere un servizio sicuro,
**anzi**. Voglio dire che non puoi pretendere la luna e che invece le pretese
vadano fatte con i tempi e modi opportuni.

Poi tu, ricercatore, non vedendo risposta, prendi e pubblichi sul tuo
blog sentendoti figo probabilmente.

## Ma la responsabilità?

Io mi sono messo a pensare un attimo al team di security di quel brand.

### Caso a): hanno ricevuto tutte le informazioni e non fanno nulla

Immaginiamoci lo scenario nel quale Security ha tutte le informazioni su questa
issue e non fa nulla per via delle ferie, _tanto chi vuoi che la scopra_.
Peracottai, devono andare a zappare la terra. Piuttosto metti un mod\_security
al volo davanti a quell'API.

Probabilità che sia andata così: tra l'1% ed il 2%.

### Caso b): non hanno quelle informazioni

Security **deve** essere il driver a fronte di una vulnerabilità. Nel caso non
sappia che c'è un problema, esporre così il team alla pubblica gogna è da
_poverini_. Non c'è nulla né di etico, né di eroico nel sputtanare
lavorativamente parlando delle persone che non sanno di avere un problema.

Sappiamo più o meno tutti com'è complesso tenere il flusso comunicativo tra 10
persone che giocano al gioco del telefono senza fili; ora estendilo in una
società con più di 1000 dipendenti con competenze e sensibilità ai problemi
differenti.

Se il driver della remediation non sa di avere un problema, non potrà guidare
con successo il patch della vulnerabilità. Certo, a posteriori un esamino di
coscienza sul perché quelle API non siano state protette va fatto. Tuttavia non
sarebbe veramente la prima volta che qualche consulente _fiqo_ butta online
codice senza dirlo a nessuno.

In entrambi i casi, è mancata la responsabilità verso i clienti di quel
servizio, esposti ad un buco reso pubblico.

## Off by one

Mancano molte cose nelle grandi realtà aziendali italiane. Spesso manca un team
interno che si occupi di Information Security e soprattutto manca il modo di
ingaggiarlo.

In un mondo ICT serio, una società con più di 100.000 clienti ha
la responsabilità di avere un team dedicato, che poi si farà supportare da
consulenti, a gestire issue di security.

Società di questo calibro hanno la responsabilità verso i loro clienti di
dotarsi di un _security operation centre_, di firewall perimetrati, di firewall
applicativi, di policy di sviluppo sicuro, di workflow di test applicativo e di
approvazione.

Non si può più pensare alla security come ad un costo inutile quando blog e
profili social possono amplificare una vulnerabilità che può costarmi clienti
paganti.

E non si può neanche pensare che il cliente medio non capisca. Magari il
dettaglio della SQL Injection sarà ostico, ma che è possibile arrivare a tutti
i suoi dati non è un concetto tecnico molto difficile.

Lato ricerca, ben venga chi spippola. Anzi, viste le persone (soprattutto le
nuove leve) che girano nel mercato ICT Security nostrano, forse spippolano
veramente in pochi. La vulnerabilità però deve essere indirizzata
correttamente. Non ad un servizio clienti a Tirana.

Voi come la preferite la disclosure? Full o responsible? E perché?

Enjoy it!

[^1]: l'omissione del link è volontaria. Da un lato la vulnerabilità è ancora
      lì, dall'altro lato queste sono solo mie opinioni. Non credo che il ricercatore
      abbia agito in malafede, solo mi ha fatto venire in mente questa riflessione
      sulla disclosure.
