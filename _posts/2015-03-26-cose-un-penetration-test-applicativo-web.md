---
layout: post
title: "Cos'è un penetration test applicativo web?"
promotion: "Cos'è un web application penetration test? Scoprilo qui."
modified: 
featured: true
category: [Doctor is in]
tags: [wapt, penetration test]
image:
  feature: doctor-who.jpg
  credit: Thorsten Bonsch
  creditlink: https://flic.kr/p/hM8yu2
comments: true
share: true
---

Questo post non è rivolto a chi è nel campo della sicurezza applicativa. Magari
se sei un _pre sales_ dacci comunque una lettura, se ne sentono troppe di
bestiate in giro.

Spesso, quando parlo a sviluppatori o PM di società di consulenza o di agenzie
web, e dico loro che devo fare un _wapt_ sul portale che hanno appena
sviluppato per la società per la quale lavoro, perdo un po' di tempo per
descrivere attività che andrò a fare, quale lo scopo, quali gli impatti e quali
i deliverable.

Essendo fondamentalmente pigro per certe cose, scrivo un post così al massimo
dovrò passare solo un link.

## Cos'è un WAPT?

Un penetration test applicativo per un'applicazione web, d'ora in avanti
_wapt[^1]_, è la simulazione di un attacco informatico diretto verso
un'applicazione web che stiamo per esporre in rete (Intranet o Internet non è
importante).

Il test si può categorizzare grossolanamente in :

* test whitebox: ho dato le credenziali di un utente non privilegiato sul
  sistema. Il tester quindi ha accesso all'applicazione fin da subito.
* test blackbox: non ho dato nulla al tester se non l'URL da testare. Il tester
  deve guadagnare l'accesso all'applicazione, sia sfruttando la tecnologia
  (bruteforce sulle credenziali di accesso, bypass del meccanismo di
  autenticazione, ...) sia sfruttando l'ingegneria sociale, chiamando ad
  esempio l'helpdesk e simulando un utente sbadato che non ricorda più come
  accedere.

Nel caso di un test _whitebox_, le credenziali usate per il test sono di tipo
non amministrativo in quanto si vuole verificare cosa può fare l'utente comune
sulla piattaforma che andremo ad esporre. Si da per scontato che un'utenza
amministrativa abbia più privilegi. Se l'applicazione web ha funzionalità
disponibili a diversi ruoli, quindi gli utenti sono profilati per gruppi,
allora dovrà essere utilizzata un'utenza di test per ciascun gruppo
applicativo.

L'attaccante, durante i test, potrà sfruttare anche falle del sistema
operativo, del web server, del db server utilizzati dall'applicazione. E'
importante capire che l'applicazione web non è una bolla indipendente ma è
calata in un ecosistema che può avere (anzi, ha per certo) delle vulnerabilità
che possono mettere in pericolo anche del codice ben scritto.

## Quando si deve fare?

Non esiste una regola aurea, l'importante è che:

* sia testata la configurazione di base che andrà in esercizio (stesso sistema
  operativo, stesso web server, stesso db server, se in produzione ci sarà un
  WAF[^2] allora va testato con lo stesso WAF davanti configurato come in
  esercizio e così via)
* sia testata la build che andrà in esercizio. Testare un'applicazione web a metà
  del suo ciclo di vita è inutile. Se si sviluppa, statisticamente si possono
  introdurre issue di security. Si possono usare gli UAT[^3] come periodo per i
  test visto che il codice dell'applicazione, a meno di modifiche grafiche, non
  dovrebbe più cambiare.

## Cosa va testato?

Durante un WAPT vengono testate sia le vulnerabilità puntuali descritte
nell'[Owasp Top 10](https://www.owasp.org/index.php/Top_10_2013-Top_10), sia le
vulnerabilità logiche dell'applicazione web. Ad esempio viene testato il
meccanismo di recovery della password, viene testato il flusso logico
dell'applicazione per verificare se posso saltare qualche passaggio nella
navigazione.

Il meccanismo di autenticazione, autorizzazione e gestione della sessione è
ovviamente quello più stressato durante i test. Il tester deve garantire che un
utente non possa accedere a funzionalità e contenuti ai quali il suo ruolo non
deve avere accesso, che non può impersonificare altri utenti nel sistema e che
quindi sia confinato nella matrice di permessi che chi ha disegnato
l'applicazione ha predisposto.

## Perché mi serve?

Fare un test di questo genere serve, perché è importante sapere se i dati dei
nostri utenti, che per le nostre aziende si traducono in profitti, sono al
sicuro da accessi non desiderati.

Pensiamo un secondo... serve testare una nave prima del varo? Serve testare
ogni tanto l'impianto anti incendio? Servono testare le procedure di
evacuazione? Serve testare la macchina (la famosa revisione biennale)? Sì,
vero?!? Allora serve anche testare qualcosa di immateriale come un'applicazione
web. Questo perché, anche se immateriale, ha impatti sulla vita reale di chi
affida a noi i propri dati.

## Mi farai male?

Come nelle punture, il male dipende anche da quanto è bravo chi ha in mano la
siringa, così anche in questo caso i danni sono legati alla capacità ed
esperienza del tester.

Un tester alle prime armi, che usa un tool automatico e che magari non sa bene
come comportarsi e come configurarlo, può rallentare di molto l'applicazione o
causare involontariamente un denial of service.

Un tester un minimo capace saprà dosare l'irruenza. In linea di massima quindi
la risposta è, no l'applicazione starà in piedi ma potrebbe farti male nel
senso che potrebbe evidenziare la presenza di vulnerabilità critiche. Direi che
però è meglio che lo rilevi il tester piuttosto che il primo malintenzionato.

## Alla fine cosa succede?

Alla fine dei test viene redatto un report con le vulnerabilità riscontrate,
degli indicatori di severità e priorità di intervento ed un paragrafo che
spiega come mitigare le stesse.

[^1]: web application penetration test

[^2]: un WAF è un web application firewall ovvero un apparato hardware o un
      modulo software che lavora al livello 7 della pila ISO/OSI e che ha lo
      scopo di filtrare pattern d'attacco noti (pattern per XSS, per SQL
      Injection, ...)

[^3]: gli UAT sono quella fase di test dove viene sottoposta l'applicazione
      agli utenti finali (un campione di utenti) per verificarne il corretto
      funzionamento, per capirne l'usabilità. Solitamente è la fase che precede
      la messa in esercizio.

