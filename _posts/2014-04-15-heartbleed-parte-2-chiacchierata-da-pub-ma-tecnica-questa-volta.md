---
layout: post
title: "Heartbleed - parte 2: chiacchierata da pub ma tecnica questa volta"
modified: 2014-04-18 07:59:28 +0200
category: [attackers]
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
che è destinato a diventare un CVE famoso come il CVE-2008-5416, la remote code
execution in Microsoft SQL Server di qualche anno fa. A mio avviso fa emerge
subito un primo elemento di attenzione. Il [CVSS](http://nvd.nist.gov/cvss.cfm)
di questa vulnerabilità è 5 (in una scala di valori in ordine di pericolosità
che va da 1 a 10. 10 è defcon 0 - moriremo tutti). Il mondo reale invece sta
risolvendo una bella gatta da pelare con zelanti web server che resituiscono
64K del loro spazio di indirizzamento a caso a fronte di un messaggio di
heartbeat opportunamente formattato.

> Ecco capiamoci, nell'exploit non potremo dire al server _restituiscimi la
> password dell'utente admin_ o _dammi tutta la tabella degli utenti_, come
> invece possiamo fare se troviamo una SQL Injection. Possiamo farci dare, in
> modo totalmente silente, 64K della memoria a caso dello spazio di
> indirizzamento di quel processo. Questo vuol dire che se io ho un httpd che ha
> fatto una ventina di figli von una fork(), il sistema operativo ti garantisce
> che il processo non possa leggere dalle porzioni di memoria a lui assegnate.

Questo non vuol dire che la cosa non sia grave, vuol dire che lo scenario
d'attacco e i risultati che puoi ottenere hanno dei confini ben definiti e che
il risultato (ovvero, il _"cosa"_ puoi recuperare da quel dump della memoria è
casuale). Per avere un senso, l'attacco deve essere massivo e costante e anche
in questo caso devi avere la fortuna di trovare un processo httpd nel cui
segmento di memoria dati c'è qualcosa di interessante.

Nel caso [dell'agenzia delle entrate del
Canada](http://www.cra-arc.gc.ca/menu-eng.html) l'attaccante ha avuto fortuna
avendo accesso ai dati di 900 persone fisiche canadesi. Quindi la vulnerabilità
merita tutta l'attenzione del caso, ma l'allarmismo che da qui alla
compromissione della chiave privata del certificato del server target sia
immediata bhé questo è un po' troppo.

Andiamo al perché OpenSSL ha un problema.

Il funzionamento dell'heartbeat è molto semplice. Una delle due parti della
comunicazione manda un payload (solitamente una stringa) assieme alla lunghezza
del payload (un numero intero di 16 bit). L'altro endpoint, ricevuto il
payload, deve da rfc rispondere replicando il payload.

<figure>
  <a href="http://imgs.xkcd.com/comics/heartbleed_explanation.png"><img src="http://imgs.xkcd.com/comics/heartbleed_explanation.png"></a>
  <figcaption><a href="http://xkcd.com/1354" title="Il bug heartbleed in una vignetta">Il bug heartbleed in una vignetta</a></figcaption>
</figure>

Le versioni vulnerabili di OpenSSL allocato una porzione di memoria usando la
lunghezza del payload ricevuta dal peer, invece dell'effettiva lunghezza della
stringa ricevuta. Quindi la risposta che viene data al peer è ottenuta da una
serie di caratteri casuali presenti nella memoria del processo che sta gestendo
la richiesta ed allocata da una versione custom della malloc() implementata dal
team di OpenSSL.

La patch introdotta nella versione 1.0.1f è disponibile qui:
[http://git.openssl.org/gitweb/?p=openssl.git;a=commitdiff;h=96db902](http://git.openssl.org/gitweb/?p=openssl.git;a=commitdiff;h=96db902)

La routine incriminata è la seguente per DTLS e la routine gemella
tls1\_process\_heartbeat per TLS, entrambe disabilitate, come si può notare se
openssl è compilata con il supporto all'heartbeat disabilitato. In questo caso
la vulnerabilità non è presente.

Questo può essere ovvio, ma è bene sottolinearlo:

{% highlight c %}
#ifndef OPENSSL_NO_HEARTBEATS
int
dtls1_process_heartbeat(SSL *s)
{
  unsigned char *p = &s->s3->rrec.data[0], *pl;
  unsigned short hbtype;
  unsigned int payload;
  unsigned int padding = 16; /* Use minimum padding */
  ...

{% endhighlight %}

Il puntatore \*p, punta ad una struttura di tipo SSL3\_RECORD, con un tipo di
record, una lunghezza del record e dei dati. Questa variabile punterà alla
regione di memoria contenente i dati ricevuti dal peer, è qui che la magia
avviene.

Alla riga 1462 del file d1\_both.c (nella versione vulnerabile) viene calcolata
la lunghezza del payload ed il tipo di record SSL che si sta gestendo.

{% highlight c %}
/* Read type and payload length first */
hbtype = *p++;
n2s(p, payload);
pl = p;
{% endhighlight %}

Il primo byte di p, contiene la costante legata alla richiesta di un heartbeat.
La macro n2s invece prende due byte da p e li mette nella variabile payload che
contiene quindi la dimensione dello stesso che è appunto un Integer a 16 bit.
Si noti che a questo punto ci si aspetterebbe un controllo della lunghezza del
payload, che sia effettivamente pari alla lunghezza della stringa ricevuta.
Ecco questo controllo non c'è.

L'attaccante quindi, costruendo una richiesta di heartbeat mettendo ad esempio
_ff_ nel secondo e terzo byte[^1] della richiesta di heartbeat causerà una
malloc di 64K a causa del codice che viene eseguito un po' più in la' nella
routine incriminata:

{% highlight c %}
unsigned char *buffer, *bp;
int r;

/* Allocate memory for the response, size is 1 byte
* message type, plus 2 bytes payload length, plus
* payload, plus padding
*/

buffer = OPENSSL_malloc(1 + 2 + payload + padding);
bp = buffer;
{% endhighlight %}

La variabile padding vale 16 (valorizzata ad inizio della funzione), 1 è per il
tipo di record SSL3, 2 per la dimensione del payload e il valore di payload stesso.

Poi con la macro s2n faccio l'inverso della n2s, prende un intero 16 bit e lo
mette nei byte 2 e 3 di bp che abbiamo appena allocato (il primo byte è il tipo
di pacchetto... una risposta all'hearbeat).

Due cose sono sotto il controllo dell'attaccante (ricordate che entrambe derivano dal buffer \*p):

* payload
* pl

La memcpy quindi copia il payload inviato dall'attaccante (contenuto nella
variabile pl) in testa al buffer allocato con la versione custom della malloc.
La copia è di un numero di byte pari al valore della variabile payload.

> The memcpy() function copies n bytes from memory area src to memory area dst.

{% highlight c %}
/* Enter response type, length and copy payload */
*bp++ = TLS1_HB_RESPONSE;
s2n(payload, bp);
memcpy(bp, pl, payload);
{% endhighlight %}

Essendo la zona di destinazione allocata con una malloc, il contenuto della
stessa non viene inizializzato ma preso dal gestore della memoria del sistema
operativo così com'è e ci viene rilasciato un puntatore.

A questo punto il pacchetto viene inviato.

Qualche considerazione, appunto, circa la natura della vulnerabilità stessa. Le
informazioni che vengono restituite ad un attaccante sono quelle che ottengo
dalle richieste di malloc del sistema operativo. Quando il web server avrà
fatto una fork per darvi una sua copia dedicata a servire l'attaccante, il
segmento di testo della memoria (marcato read-only) sarà lo stesso tra padre e
figlio. Per il segmento dati, Linux (e altri sistemi operativi) adottano la
strategia della [copy on write](http://it.wikipedia.org/wiki/Copy-on-write),
ovvero viene copiato un nuovo spazio di memoria se viene richiesta una
scrittura, in alternativa verrà usato lo stesso segmento dati del processo
padre.

L'attaccante quindi ha accesso a chunk di memoria di 64K del segmento dati del
web server. Cercare di recuperare informazioni da qui equivale a sparare a
caso. Attenzione, non ho detto che non è possibile... ho detto che si deve
andare per tentativi.

## Il fix

[La patch](http://git.openssl.org/gitweb/?p=openssl.git;a=commitdiff;h=96db902)
è di modesta entità. Vengono interessati due file:

* d1_both.c per DTLS
* t1_both.c per TLS

Il succo è l'aggiunta del controllo della lunghezza del payload prima di
allocare il buffer:

{% highlight c %}
+       /* Read type and payload length first */
+       if (1 + 2 + 16 > s->s3->rrec.length)
+               return 0; /* silently discard */
+       hbtype = *p++;
+       n2s(p, payload);
+       if (1 + 2 + payload + 16 > s->s3->rrec.length)
+               return 0; /* silently discard per RFC 6520 sec. 4 */
+       pl = p;
{% endhighlight %}

La magia in effetti è poca ed il bug introdotto è un classico che rimanda ai
[format bug](http://en.wikipedia.org/wiki/Uncontrolled_format_string) dove era
possibile tra le altre cose fare il dump di zone di memoria dello stack del
processo vulnerabile.

## Link

Potete trovare un'analisi dettagliata e precedente alla mia all'indirizzo:
[http://blog.existentialize.com/diagnosis-of-the-openssl-heartbleed-bug.html](http://blog.existentialize.com/diagnosis-of-the-openssl-heartbleed-bug.html)

Un fantastico elenco di POC per provare la vulnerabilità li trovate qui:
[http://blog.bugcrowd.com/heartbleed-exploit-yet/](http://blog.bugcrowd.com/heartbleed-exploit-yet/)

[^1]: attenzione, le richieste sono in Network byte order, quindi se voi volete scrivere _aaff_, dovete mettere al secondo byte _ff_ e al terzo byte _aa_.

## Edit

Ho corretto il CVE della remote code execution in SQL Server. Intendevo il CVE
legato alla [MS09-004](http://support.microsoft.com/kb/959420/it). Grazie a
Gerardo per avermi ricordato che mi ero ripromesso di controllare... stamattina
però.
