---
layout: post
title: "Heartbleed - parte 2: chiacchierata da pub ma tecnica questa volta"
modified: 2014-04-15 08:20:28 +0200
category: []
tags: [heartbleed, cve-2014-0160, vulnerabilità, ssl, openssl, opensource, simple-life, chiacchiere-da-pub, exploit]
image:
  feature: heartbleed.jpg
  credit: Jon Åslund
  creditlink: https://www.flickr.com/photos/jooon/
comments: true
share: true
---

Come promesso, questo post va un po' più nel dettaglio tecnico del [bug
heartbleed](http://heartbleed.com) introdotto in OpenSSL da un errore di
programmazione nel Dicembre 2011 e corretto nella versione 1.0.1g di
[OpenSSL](http://www.openssl.org) che ovviamente dovete installare.

Perché nel titolo c'è ancora chiacchierata da pub? Perché le più belle
chiacchierate tecniche le ho fatte col Sassa alla Torrianetta o alle feste post
talk con hacker italiani e non... comun denominatore, la birra.

Andiamo oltre.

## Cos'è l'heartbeat?

Allora, l'heartbeat è un'estensione dei protocolli TLS e DTLS regolamentata
dall'[RFC 6520](https://tools.ietf.org/html/rfc6520). TLS e DTLS sono due layer
che si aggiungono al protocollo di livello trasporto per aggiungere sicurezza
alla comunicazione. La differenza tra TLS e DTLS sta nel fatto che il primo
viene usato con protocolli affidabili (ovvero protocolli che si fanno carico
della conferma della consegna del messaggio) mentre il secondo è disegnato per
essere usati con protocolli di livello trasporto, come UDP ad esempio, dove la
consegna del messaggio non è garantita dal protocollo stesso.

Per il perché dell'esistenza di due famiglie del genere di protocolli a livello
trasporto vi invito a leggere [TCP/IP Illustrated, Vol
1](http://www.amazon.com/TCP-Illustrated-Vol-Addison-Wesley-Professional/dp/0201633469)
che tutti quanti **devono** aver letto o consultato almeno una volta nella vita
se si vuole parlare di pentest applicativo.

L'heartbeat dicevamo, serve per permettere al client di mantenere aperto il
canale cifrato con il server anche in assenza di scambio dei dati. Perché
questo? Ad esempio per poter assumere che il peer remoto sia sempre _live_
evitando che un firewall ad esempio decida di chiudere la connessione a causa
del mancato trasferimento di informazioni. [Questo
thread]([http://security.stackexchange.com/questions/55215/why-does-tls-need-an-explicit-heartbeat-protocolQuesto
thread) su Stackexchange.com spiega molto bene il punto sul perché un
meccanismo simile al keepalive sia stato introdotto in un layer applicativo:
perché SSL non fa alcuna asserzione sul protocollo di livello trasporto
sottostante e sulla sua implementazione, la sua agnosticità quindi rende
necessaria questa estensione.

## La vulnerabilità: CVE-2014-0160

[Questo](https://web.nvd.nist.gov/view/vuln/detail?vulnId=CVE-2014-0160) mi sa
che è destinato a diventare un CVE famoso come il CVE-2008-0064, la remote code
execution in Microsoft SQL Server di qualche anno fa. A mio avviso fa emerge
subito un primo elemento di attenzione. Il [CVSS](http://nvd.nist.gov/cvss.cfm)
di questa vulnerabilità è 5 (in una scala di valori in ordine di pericolosità
che va da 1 a 10. 10 è defcon 0 - moriremo tutti). Il mondo reale invece sta
risolvendo una bella gatta da pelare con zelanti web server che resituiscono
64K del loro spazio di indirizzamento a caso a fronte di un messaggio di
heartbeat opportunamente formattato.

{% blockquote %}
Ecco capiamoci, nell'exploit non potremo dire al server _restituiscimi la
password dell'utente admin_ o _dammi tutta la tabella degli utenti_, come
invece possiamo fare se troviamo una SQL Injection. Possiamo farci dare, in
modo totalmente silente, 64K della memoria a caso dello spazio di
indirizzamento di quel processo. Questo vuol dire che se io ho un httpd che ha
fatto una ventina di figli von una fork(), il sistema operativo ti garantisce
che il processo non possa leggere dalle porzioni di memoria a lui assegnate.
{% endblockquote %}

Questo vu
