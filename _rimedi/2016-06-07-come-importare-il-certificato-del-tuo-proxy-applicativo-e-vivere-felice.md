---
layout: tip
title: "Come importare il certificato del tuo proxy applicativo (e vivere felice)"
tags: [ssl, browser, kali, owasp-zap, burp, proxy, certificato]
level: basic
comments: true
share: true
order: 3
---

Alzi la mano, chi là fuori, aggiunge un'eccezione, quando il browser ci
dice che la connessione non è fidata mentre stiamo testando un sito ed in mezzo
c'è il nostro proxy applicativo preferito ([Owasp Zap](#) o [Burp](#)).

Ho aperto, per simulare lo scenario per questo post, due virtual box:

* una Kali Linux, con indirizzo 192.168.56.101, per simulare la postazione
  dell'attaccante
* una Ubuntu Linux, con indirizzo 192.168.56.102, che espone un
  [Redmine](http://www.redmine.org) e che simula l'applicazione da testare.

Andando a puntare contro il nostro target, ```https://192.168.56.102/redmine```
otteniamo un messaggio del browser che ci dice che la connessione non è fidata.
Il certificato esposto dal nostro proxy, non è firmato da una CA per la quale
esiste un _trust_ da parte del nostro browser.

Nelle versioni moderne di Safari ad esempio, il browser si rifiuta di caricare
la pagina, se il certificato non soddisfa determinati parametri.

![La connessione non è fidata]({{site.url}}/assets/images/untrusted_connection.png)

Levarsi dagli impicci, è semplice e la soluzione pulita è quella di esportare
il certificato della root CA di Owasp Zap e di importarlo all'interno del
nostro browser. In questo modo quando nei prossimi test, ci verrà proposto un
certificato firmato da quella CA, lo potremo riconoscere come valido.

Per esportare il certificato, basta andare nella voce "Certificati SSL
dinamici", tra le opzioni dello strumento.

![Esportiamo il certificato di Owasp ZAP]({{site.url}}/assets/images/zap_certificate_export.png)

Salvato il certificato, apriamo le preferenze del browser. Faremo riferimento a
Firefox/Iceweasel nelle prossime schermate. Per gli altri browser, il
procedimento è analogo.

![Menu' dei certificati]({{site.url}}/assets/images/import_ca_1.png)

Aperto il gestore dei certificati delle CA di Firefox, andremo ad importare il
file salvato in precedenza, selezionando il tasto 'Import'.

![Import del certificati dall'elenco dei certificati delle CA]({{site.url}}/assets/images/import_ca_2.png)

Selezioniamo a questo punto, il file contenente il certificato della root CA di Owasp ZAP.

![Selezioniamo il certificato della root CA di Owasp ZAP]({{site.url}}/assets/images/import_ca_3.png)

L'ultimo passo della procedura di import, è quello di dire al browser l'uso che
verrà fatto dei certificati firmati con il certificato che stiamo importanto.
Nel nostro scopo, dobbiamo fidarci di questo certificato per i certificati che
identificheranno siti web. Selezioniamo quindi la spunta come da immagine.

![Useremo questa CA per identificare siti web]({{site.url}}/assets/images/import_ca_4.png)

L'import è terminato. Se proviamo ora a navigare verso il nostro target,
ovviamente passando attraverso Owasp ZAP, il browser ci avviserà che la
connessione è sicura in quanto il certificato generato dinamicamente dal proxy
è firmato da una CA tra quelle marcate come fidate per identificare i siti web.

![Connessione OK]({{site.url}}/assets/images/connection_ok.png)

*Nota:* la porta HTTPS del mio server target, in realtà era chiusa. Questo è il
motivo degli errori di ZAP che vedete nell'ultima immagine. Allo scopo di
questo mini tutorial, in realtà non importava che dietro ci fosse un sito HTTPS
funzionante. L'importante è che ora, quando testate i siti con Owasp ZAP, non
avrete più errori circa la connessione HTTPS.

Consiglio questo come uno dei passi post-installazione della vostra macchina da
pentest, appena configurato il vostro Window Manager preferito.

Enjoy it!
