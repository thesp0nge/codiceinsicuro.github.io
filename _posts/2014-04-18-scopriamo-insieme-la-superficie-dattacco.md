---
layout: post
title: "Scopriamo insieme la superficie d'attacco"
date: 2014-04-22 07:59:20 +0200
modified: 2014-04-22 07:59:20 +0200
category: [awareness]
tags: [awareness, superficie d'attacco, codice]
image:
  feature: moon_surface.jpg
  credit: SantiMB
  creditlink: https://www.flickr.com/photos/smb_flickr/
comments: true
share: true
---

Un _software engineer_ non ha bisogno di troppi rimandi alle cose basilari di
application security. Parlando con alcuni sistemisti di
[heartbleed](http://codiceinsicuro.itblog/heartbleed-parte-2-chiacchierata-da-pub-ma-tecnica-questa-volta),
è spuntato qualche sviluppatore in grado di indirizzare subito il problema
evidenziando come fosse necessario revocare anche tutti i certificati dei
server vulnerabili.

Tuttavia, non tutte le persone che scrivono codice sono _software engineer_ e
ci sono molte persone con sensibilità differenti al problema della sicurezza
delle informazioni.

C'è anche una categoria di persone che, avendo programmato un gestionale in
Visual Basic è convinta di scrivere codice di qualità. Non tratteremo di loro
in questo blog.

Ci ritroviamo, appena dopo i banchetti per la Pasqua con un post leggero e
molto discorsivo che vuole evidenziare un concetto semplice: il vostro software
offre all'attaccante dei punti di attacco dei quali voi, sviluppatori, dovete
essere consapevoli.

## Il Tempo, l'ignoranza e l'incapacità di dire NO

Il tempo è il primo punto d'attacco della vostra nuovissima applicazione web o
funzionalità. Su questo punto la vostra bravura è, purtroppo, un'invariante.

> Il business viene da voi oggi, venerdì prima di Pasqua ed ha deciso che vuole
> lanciare una nuovissima funzionalità per il vostro sito che deve essere
> online martedì mattina. Questa nuova funzionalità è, ovviamente molto
> semplice e non richiederà più di qualche ora di lavoro, quindi siete pregati
> di mettervi subito sotto perché l'account vorrebbe vedere una prima demo
> lunedì nel pomeriggio.

Sappiamo tutti molto bene che lavorerete come matti e nessun account guarderà
il primo pomeriggio del Lunedì di Pasqua il vostro lavoro, che comunque dovrete
produrre in tempo per contratto. Sappiamo tutti molto bene che la semplicità
della funzionalità e la stima del tempo sono considerazioni partorite da una
persona che non ha alcun background informatico e che non saprebbe scrivere
neppure un _Hello world!_ a video. Probabilmente dovrete mettere mano al
sistema di gestione della sessione della vostra applicazione web, rivedere il
carrello e la procedura di pagamento e forse anche la navigazione di alcune
porzioni del sito.

Al primo giro di cronometro siete già drammaticamente in ritardo. Purtroppo non
siamo abituati a dire **NO** ad una richiesta insensata, impossibile da
realizzare. Lo sapevamo fare da bambini ma adesso, nel dorato mondo del lavoro
soprattutto in un periodo di crisi quando _davanti alla porta ce ne sono mille
come te_, siamo impossibilitati a dire **NO**.

Avete rilasciato. La demo, _ovviamente_ è saltata e voi 30 minuti dopo il
rilascio state implementando un paio di altre funzionalità _carinissime_ che
non erano state pianificate.

Avete fatto modifiche importanti e nuovi sviluppi che non sono stati testati a
sufficienza, o che forse non sono stati testati affatto. Figuriamoci se avete
poi pensato alla validazione dell'input o altro... ci si affida al tanto
deprecabile mantra _ma chi vuoi che buchi proprio me_.

## La richiesta HTTP

La richiesta è proprio il primo punto di contatto tra l'attaccante ed il vostro codice. La richiesta HTTP porta con sé due cose fondamentali.

* l'_url_ e tutti i suoi parametri;
* gli header della richiesta stessa, propri del protocollo HTTP.

Prendiamo questa richiesta:

{% highlight text %}
GET http://localhost:4000/purchase/cart/23?lang=en&k=32 HTTP/1.1
Host: localhost:4000
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:26.0) Gecko/20100101 Firefox/26.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: it-IT,it;q=0.8,en-US;q=0.5,en;q=0.3
Referer: http://localhost:4000/
Connection: keep-alive
{% endhighlight %}

Come prima cosa, tutti gli header http (Host, User-Agent, Referer, ...) sono
tutti potenziali punti dove un attaccante vorrà interagire con il vostro
codice.

> Se ad esempio voi usate il campo Referer come unico mezzo per controllare il
> flusso di navigazione dell'utente e quindi per controllare che il vostro
> carrello (in questo esempio) sia stato riempito correttamente e che siete
> pronti al checkout sappiate che vi state fidando di qualcosa che non potete
> controllare, il campo Referer appunto. Se un attaccante lo valorizza
> opportunamente, potrebbe bypassare alcuni controlli da voi piazzati.

Questa URL poi presenta due cose interessanti, lato attaccante. Un numero e due
parametri: lang e k. I parametri sono proprio il primo punto dove fare un po'
di richieste _malformate a piacere_ per vedere come si comporta l'applicazione.
Una cosa a mio avviso fondamentale, è capire cosa fanno i parametri prima di
darsi al tampering[^1] selvaggio così, un po' per distinguersi dallo script
kiddie che lancia il tool con l'opzione --auto-p0wn.

_lang_ sembra suggerire il locale dell'applicazione, verifichiamolo mettendo
codici noti di lingue (it, de, fr, es, ...) e vediamo come si comporta
l'applicazione. Se cambia la localizzazione dell'interfaccia grafica abbiamo
indovinato. Proviamo ora con codici sconosciuti (gg, 99, 3, !): esiste un
linguaggio di default che viene usato come fallback oppure causiamo un'errore
applicativo (magari con qualche informazione interessante come versione delle
librerie utilizzate, path applicativi, chiamate interessanti, ...)?

_k_ magari rappresenta il vostro codice cliente, stiamo stiracchiando l'esempio
potrebbe essere ovviamente un parametro di controllo sulla cui natura non
possiamo dire nulla. Provando a mettere una lettera al posto di un numero cosa
otteniamo? L'eventuale errore applicativo ci dice qualcosa in più sulla natura
del parametro? Riusciamo a causare qualche inconsistenza tra codice del
carrello e codice cliente cambiando questo valore? Sono effettivamente legati
in qualche modo quindi cambia l'anagrafica cliente legata al checkout?

Quel numero, 23, suggerisce poi che quest'applicazione abbia un controller
_purchase_ con un'azione (o un metodo) _cart_ e 23 sia un parametro dinamico
che indica l'id del carrello in questione. Punto ideale per due prove:

* SQL injection
* direct object reference: provo eventualmente ad enumerare i carrelli attivi
in quel momento se il backend non è opportunamente scritto.

Abbiamo quindi almeno una decina di possibili attacchi nati da una singola
richiesta con un paio di parametri. Sarebbe interessante chiedere all'ipotetico
sviluppatore se era a conoscenza e se aveva previsto questo quando ha scritto
quel metodo.

## Il tuo stack applicativo

Sia che tu ti basi su uno stack formato da Linux, PostgresSQL, Apache,
Passenger, Rails 4.0.3, sia che tu abbia un'applicazione basata su Linux,
MySQL, Apache e PHP 5.0.3, la tua applicazione vive all'interno di
un'ecosistema complesso, un po' come gli esseri viventi.

Supponiamo tu abbia scritto un'applicazione veramente robusta e tu abbia speso
tempo e soldi in attività di penetration test applicativo e remediation. Se la
tua applicazione usa una versione di [Rails](http://rubyonrails.org) la cui
componente active\_record soffre di una SQL Injection per come vengono gestiti
i parametri allora anche la tua applicazione erediterà una SQL Injection per
l'uso che viene fatto del framework[^2].

Se quella particolare versione di mod\_php soffre di una vulnerabilità per la
quale il codice sorgente della pagina viene stampato a video se l'url termina
con un particolare carattere, non importa quanto robusto sia il tuo codice:
tutta Internet lo vedrà[^3].

> Non importa quindi solamente scrivere codice sicuro. Occorre aggiornare
> costantemente il software a bordo della macchina, sia quello di sistema che
> le librerie di terze parti che utilizziamo, al fine di non ereditare
> vulnerabilità terze.

## Off by one

Un buon software engineer ha quindi la percezione di essere costantemente sotto
scacco da molti punti di vista. Non basta solo validare l'input per vivere
sereni il proprio business sul web, qualunque esso sia. Significa costruire una
fortezza partendo da solide fondamenta che **implicano** anche una conoscenza
profonda delle stesse. Significa conoscere il proprio sistema operativo, il
proprio application server e le varie opzioni del framework o della libreria
che implementa quella particolare funzionalità.

Ovviamente parte dei compiti sistemistici, possono essere demandati a chi
gestisce per noi l'infrastruttura. Credo tuttavia che avere il polso della
situazione e richiedere un particolare atteggiamento riveli un SW Eng di classe
da uno di fascia media che magari si è accontentato di leggere qualche hint su
questo blog[^4].

L'avevo proposto qualche anno fa su [armoredcode.com](http://armoredcode.com),
ma ne scriverò qui in forma aggiornata. A questo punto occorre vedere un po' di
codice per automatizzare la parte di discovery della superficie d'attacco.

Enjoy it!

[^1]: con tampering si intende la sostituzione di valori leciti con pattern d'attacco o con input malformato allo scopo di vedere come si comporta l'applicazione.
[^2]: [github](https://github.com) soffrì nel Marzo 2012 di una SQL Injection, dovuta proprio ad una vulnerabilità di active\_record e che portò un attaccante a scrivere in repository arbitrari senza ovviamente ne avesse i permessi ([link](http://www.extremetech.com/computing/120981-github-hacked-millions-of-projects-at-risk-of-being-modified-or-deleted)).
[^3]: un paio di anni fa emerse una problematica legata a mod\_php e ad un flag che, se passato come parametro dell'url, veniva interpretato correttamente dall'interprete PHP installato sulla macchina e a video veniva stampato il codice sorgente della pagina ([link](http://www.kb.cert.org/vuls/id/520827)).
[^4]: questo blog ha lo scopo di parlare di application security, qualche cosa magari te la potrà insegnare o ti potrà dare qualche spunto ma è il caso che tu approfondisca la particolare tecnologia che tu utilizzi ogni giorno.
