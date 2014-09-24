---
layout: post
title: "L'ASAP parte da solide fondamenta ed una lucente armatura"
modified:
category: [Spinaci]
tags: [asap, owasp core ruleset, owasp, waf, mod_security, apache, nginx, hardening, linux, unix, patch, security advisories, security management]
image:
  feature: sith_armor.png
  credit: pdragon
  creditlink: https://flic.kr/p/6w2N4g
comments: true
share: true
---

[Abbiamo già visto](https://codiceinsicuro/blog/la-non-cultura-dellasap) che
prolifera come la gramigna una cultura, quella dell'ASAP, che ci vuole portare
a buttare online secchi casuali di 1 e 0 in nome della celerità con cui si va
sul mercato, a scapito della sicurezza e della robstezza del prodotto finale.

Debellarla è, come con la gramigna vera, una dura lotta. Mentre cerchiamo di
sensibilizzare il committente che Roma non è stata costruita in un giorno,
vediamo come evitarci qualche mal di testa quando dobbiamo lavorare per chi
vuole tutto e subito.

## Scenario
E' arrivato il nuovo responsabile per il marketing che vuole essere aggressivo
con il prodotto _Scivolina_, la sciolina per l'imbranato, e battere la
concorrenza per il periodo invernale.

Nei primi di agosto convoca l'IT, convoca il Marketing ovviamente e qualche
consulente outsourcer e spiega il suo piano geniale.

> Entro ferragosto deve essere online un portale che permetta agli impianti
> sciistici di ordinare il nuovo prodotto.

"Una decina di giorni dovrebbe bastare per fare il sito, che ci vuole? In
Internet si trova di tutto, figurati se qualcuno non ha fatto qualcosa di
simile da copiare."

A nulla vale far notare che, essendo agosto, la maggior parte delle persone è
in vacanza. Il business non dorme mai.

## Step backward
Come avrete notato, manca un attore nella convocazione iniziale. Non manca
perché non c'è in azienda, ma manca perché nessuno sa che serve: il team di
information security.

Se avete lavorato bene nelle puntate precedenti, IT o almeno chi materialmente
installerà le macchine vi coinvolgerà. Se avete lavorato male, siete inguaiati. 

Facciamo per un attimo l'assunzione che veniate coinvolti a progetto iniziato,
quindi da 14 giorni (sabato e domenica sono sempre compresi nel grande mondo
dell'ASAP) siamo già passati a 10 giorni dalla deadline, non prorogabile.

## Buttate le fondamenta

Probabilmente stiamo parlando di un server web piazzato in una DMZ e protetto
da un firewall. Questo server dovrà avere aperte le porte 80 e 443 per servire
il sito anche su protocollo cifrato. Per l'accesso via SSH, ci sarà una seconda
interfaccia sul server attestata su una rete di management opportunamente
segregata in maniera tale da permette solo il traffico del sysadmin verso la
porta 22.
Supponiamo per semplicità che il database degli ordini per la _Scivolina_
risieda fisicamente su questa macchina.

### Accesso alla macchina

L'accesso SSH di root deve essere disabilitato. Gli amministratori si
collegheranno con le loro utenze nominali e useranno _sudo_ alla bisogna.
La password degli utenti deve avere un minimo di criteri di robustezza.
Password3, Sc1v0l1n4, S0n0R00t non sono password degne di tale nome.
Sinceramente non sono un fan sfegatato di password come Rfd34$$a/dd!, perché
credo che se obblighi i tuoi utenti a password assurde questi se le scriveranno
da qualche parte.

Io sono della scuola di pensiero che una frase, un pezzo di una canzone abbiano
poca entropia dal punto di vista computazionale ma siano molto più robuste di
fronte ad un attacco a forza bruta.

> Questa e' Sparta

Provate con un password cracker a trovare un dizionario che includa anche
questa... Non vi sentite sicuri, la vogliamo perturbare un po'?

> Qu3St4 e' Sp4Rt4

Ma veramente, una semplice frase (occhio alle lettere accentate) è facile da
ricordare e difficile da trovare per un tool automatico.

### Ordinaria amministrazione
Il server deve essere gestito. Questo vuol dire che se installate Apache,
dovete gestirne il ciclo di vita; installare le patch proposte dal vendor,
seguire le linee guida di hardening. Lo stesso vale per il sistema operativo,
va aggiornato e mantenuto... un po' come fate con la vostra auto, almeno una
volta all'anno fate un controllo, no? Ecco, almeno una volta al mese va
lanciato l'equivalente di:

{% highlight text %}
$ sudo apt-get update
$ sudo apt-get upgrade
{% endhighlight %}

**Tutte** le distribuzioni Linux garantiscono la retrocompatibilità nelle API e
nelle funzionalità di un tool quando, all'interno della stessa release ne
propongono l'aggiornamento. Viene personi garantita la retrocompatibilità
quando si cambia minor version della distribuzione. Aggiornare il proprio
software è come fare il tagliando all'auto. **E' una cosa da fare. Punto.**

### Vulnerability management
Un post a parte meriterebbe il processo di gestione delle vulnerabilità, quindi
daremo per scontato che abbiate un tool di scansione automatica, diciamo
[OpenVAS](http://www.openvas.org) così citiamo quello opensource.

Il vostro tool di scansione automatica, regolarmente aggiornato, eseguirà un
vulnerability assessment periodico sulla macchina e sarà vostra cura preparare
un report con le principali azioni di mitigazione per chiudere le issue che
saltano fuori volta per volta.

## Indossiamo la lucente armatura

### Descrizione
Quello che state per installare è un web application firewall, WAF per gli
amici. Un WAF è _qualcosa_ che si mette tra la vostra applicazione web e
l'attaccante, intercetta le richieste che vengono fatte e fa passare solo
quelle che non ricadono nelle regular expression che descrivono vettori di
attacco noti.

### Avvertenze (quelle che tutti saltano)

Installare un WAF non significa smettere di scrivere codice sicuro. Il WAF
lavora applicando delle regular expression alle richieste che vengono fatte
all'applicazione web. Non protegge da vulnerabilità legate alla logica
applicativa, ad esempio. Potreste essere al sicuro dallo _script kiddie_ che
lancia [sqlmap](http://sqlmap.org) ma un attaccante più esperto potrebbe sempre
trovare il vettore d'attacco che non è presente nella knowledge base.

> Installare un WAF non significa smettere di scrivere codice sicuro.

_Ha senso installare il WAF quindi?_ Bhé, fatto 100 tutti gli attacchi, almeno
per un buon 90% ve ne potete dimenticare. Direi che ha senso.

_E le performance? Noi siamo una startup giovane che fa il suo business
innovativo nel cloud lanciando servizi social, per noi le performance sono
tutto._ Almeno il 90% di attacchi bloccati, e il vostro utente non si accorgerà
di quei millisecondi in più che la foto del suo gattino viene sparata sui
social.

### mod_security

Installeremo mod\_security dai sorgenti, quindi vi servono i tool per compilare
codice C e le librerie di apache. Il nome dei pacchetti può variare da
distribuzione a distribuzione, diciamo che vi serve:

* gcc
* make
* libxml2
* libxml2-devel
* httpd-devel
* pcre-devel
* curl-devel

mod\_security è opensource e disponibile su [github.com](https://github.com).
Cloniamo il repository sul nostro server.
E' buona norma mettere tutto il software non pacchettizzato che viene
installato nel sistema, in /usr/local. Creo una directory src nel caso non ci
fosse, dove memorizzare i sorgenti.

Visto che dovete scrivere in /usr/local, dovete modificare la configurazione di
Apache potete diventare root ora.

{% highlight text %}
$ sudo bash
{% endhighlight %}

{% highlight text %}
# mkdir -p /usr/local/src
# cd /usr/local/src
# git clone https://github.com/SpiderLabs/ModSecurity.git
{% endhighlight %}

E ora compiliamo mod\_security.

{% highlight text %}
# cd ModSecurity
# ./configure
# make
# make install
{% endhighlight %}

Abbiamo già, nell'archivio appena scaricato, un file di configurazione base che
possiamo copiare nella directory della configurazione di apache. Va benissimo
per partire.

{% highlight text %}
# cp modsecurity.conf-recommended /etc/httpd/conf.d/modsecurity.conf
{% endhighlight %}

Ora dobbiamo dire ad Apache che mod\_security è installato e che deve caricarlo
come modulo.
{% highlight text %}
# vim /etc/httpd/conf/httpd.conf
{% endhighlight %}

Dobbiamo assicurarci che nel file di configurazione, Apache carichi
mod\_security **dopo** le proprie dipendenze.

{% highlight text %}
## Load dependencies ##
LoadFile /usr/lib/libxml2.so
LoadFile /usr/lib/liblua5.1.so
## Load mod_security ##
LoadModule security2_module modules/mod_security2.so
{% endhighlight %}

Riavviamo Apache ed avremo mod\_security installato e funzionante con un set
base di regole. Va bene per iniziare, ma vedremo subito come migliorare
notevolmente le cose.

{% highlight text %}
# /etc/init.d/httpd restart
{% endhighlight %}

Ora installiamo le [Owasp Modsecurity core
ruleset](https://www.owasp.org/index.php/Category:OWASP_ModSecurity_Core_Rule_Set_Project)
con un processo molto simile a quello usato per mod\_security.

{% highlight text %}
# cd /etc/httpd/
# git clone https://github.com/SpiderLabs/owasp-modsecurity-crs.git
# cd owasp-modsecurity-crs
# cp modsecurity_crs_10_setup.conf.example modsecurity_crs_10_config.conf
{% endhighlight %}

Con l'ultima riga abbiamo preparato il nostro file di configurazione da far
caricare ad Apache. Non serve fare alcuna modifica, solo modificare ancora
l'httpd.conf per istruire il modulo che deve caricare queste extra regole.

{% highlight text %}
# vi /etc/httpd/conf/httpd.conf

...
<IfModule security2_module>
    Include owasp-modsecurity-crs/modsecurity_crs_10_config.conf
    Include owasp-modsecurity-crs/base_rules/*.conf
</IfModule>
...
{% endhighlight %}

Riavviamo Apache ed il nostro WAF è installato e pronto all'uso. Le regole
preparate da [OWASP](http://www.owasp.org) mi garantiscono una buona protezione
di base e di potermi dimenticare di buona parte degli attaccanti casuali là
fuori.

Come abbiamo detto prima, ci sono attaccanti preparati là fuori quindi è
obbligatorio aggiungere anche una parte di sviluppo sicuro ed eseguire un
penetration test applicativo ed una code review prima del deploy in produzione.

{% highlight text %}
# /etc/init.d/httpd restart
{% endhighlight %}

## Off by one

Gli immancabili commenti: _E ma non siamo una banca_; _Figurati, quelle cose
degli hackers cattivi si vedono solo nei film_; _Ma chi vuoi che venga ad
attaccarci_; _Il sito è sicuro, ha l'HTTPS_

Se avete invece un programma di vulnerability management già in essere,
potreste sentire qualcosa di più evoluto che ricalca il concetto assurdo che se
una scansione viene fatta al tempo t0, non serva più farla neanche dopo anni e
dopo innumerevoli modifiche al codice.

_Ma non abbiamo fatto la scansione un anno fa?_

A conti fatti, nessuno vuol fare application security se non dopo aver visto il
proprio database su [pastebin.com](http://pastebin.com). A volte anche dopo
aver subito un data breach, si fa spallucce tanto gli utenti hanno cambiato la
password, un po' come a dire... _si arrangino un po' questi utenti, perché devo
fare lavoro extra?_

No, la sicurezza del tuo business online è compito tuo e tuo solamente.
Prendine atto e dillo anche a chi dice che quel sito doveva essere online
_ASAP_.
