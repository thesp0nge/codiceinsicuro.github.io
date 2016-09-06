---
layout: chicchi
title: "Automatizzare Owasp ZAP in Mac OS X"
tags: [ruby, owasp, owasp zap, dast, pipeline, appsec pipe]
comments: true
share: true
order: 3
---

[Owasp ZAP](https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project) è uno dei principali strumenti a disposizione di chi fa
application security di mestiere, per eseguire un penetration test dinamico.
ZAP presenta due cose molto utili per chi, come me, vuole automatizzare la fase
di lancio di un penetration test applicativo:

* ha una API
* può essere lanciato come demone

## Installazione e primi passi

Prima di tutto, installiamolo sul nostro Mac. Il motivo per cui ho scelto il
Mac come esempio è molto semplice: è la piattaforma che [uso da una decina
d'anni]({{site.url}}/blog/mac-os-x-e-davvero-uno-unix-di-serie-b/) ormai. Se
per caso, siamo rimasti all'epoca del _"eh ma, non è da hacker usare il mac"_,
ripropongo un [mio
post]({{site.url}}/blog/usare-apple-e-veramente-contrario-alletica/) di qualche
tempo fa.

Per l'installazione di tool su Mac OS X, io di solito mi affido a
[brew](http://brew.sh), un packet manager per il sistema di Cupertino, scritto
in ruby, che lavora sul concetto di formule e che mi tiene ordinato il sistema
mettendo tutto in ```/usr/local/Cellar```.

{% highlight sh %}
$ brew cask install owasp-zap
{%endhighlight%}

Owasp ZAP essendo comunque una applicazione grafica, ha anche il suo spazio
nella directory /Applications, ed è proprio qui che dovremo andare a spippolare
per lanciarlo come demone.

Piccola parentesi, se siete su Kali linux (almeno la versione 2.0, la rolling
devo verificare appena risolvo un dist-upgrade andato male), ha il suo bello
script bash, in un /usr/local/bin che richiama lo script principale, zap.sh.
Tuttavia, questo launcher, non passa i parametri della linea di comando a
zap.sh, quindi senza una piccola modifica non è possibile far partire Owasp ZAP
come demone su una Kali.

Piccola modifica che ho messo a disposizione su
[github](https://gist.github.com/thesp0nge/35255320cff1254fb88bc4da85dd31ad):

{% gist 35255320cff1254fb88bc4da85dd31ad %}

## Lancio la scansione

Lanciare Owasp ZAP come demone è semplice: basta usare il flag ```-daemon```!

{% highlight sh %}
$ /Applications/OWASP\ ZAP.app/Contents/MacOS/OWASP\ ZAP.sh -daemon -config api.key="pippo"
{%endhighlight%}

Se tutto è andato come deve, troverete una scritta simile a questa che indica
che il nostro proxy è partito ed è in ascolto sulla porta 8080 di localhost.

{% highlight sh %}
5954 [ZAP-daemon] INFO org.zaproxy.zap.DaemonBootstrap  - ZAP is now listening on localhost:8080
{%endhighlight%}

Quando abbiamo lanciato il nostro demone, abbiamo specificato una API Key, che
viene utilizzata per autenticare il client, in questo caso il browser ma
potrebbe essere benissimo uno script, nei confronti di Owasp ZAP.

Scegliete qualcosa di più sicuro rispetto a 'pippo', mi raccomando.

Come prima cosa, dovremo far partire il nostro spider per navigare il nostro
sito target. L'API da utilizzare è l'azione scan del componente spider. Notate
che tutto quello che potete fare, lo potete scegliere e configurare da una
comoda interfaccia web che trovate su: http://localhost:8080/UI.

Per lanciare uno spider, abbiamo bisogno della nostra API Key e della URL da
testare. In questo caso, ho preso in prestito [il sito di test in PHP fornito
da acunetix](http://testphp.acunetix.com).

{%highlight sh%}
http://localhost:8080/JSON/spider/action/scan/?zapapiformat=JSON&apikey=pippo&url=http%3A%2F%2Ftestphp.acunetix.com&maxChildren=&recurse=&contextName=&subtreeOnly=
{%endhighlight%}

Il metodo ci ha restituito l'identificativo numerico della scansione in formato
JSON. Nella console del terminale, potete vedere Owasp ZAP che si è messo al
lavoro:

{%highlight sh%}
294699 [Thread-6] INFO org.zaproxy.zap.extension.spider.SpiderThread  - Starting spidering scan on SpiderApi-0 at Mon Sep 05 23:04:50 CEST 2016
294702 [Thread-6] INFO org.zaproxy.zap.spider.Spider  - Spider initializing...
294798 [Thread-6] INFO org.zaproxy.zap.spider.Spider  - Starting spider...
298046 [pool-1-thread-2] INFO org.zaproxy.zap.spider.Spider  - Spidering process is complete. Shutting down...
{%endhighlight%}

Il componente spider, ha anche un'azione status che, dato un identificativo
della scansione, ci permette di monitorare lo stato dello spidering:

{%highlight sh%}
http://localhost:8080/JSON/spider/view/status/?zapapiformat=JSON&scanId=1
{%endhighlight%}

A questo punto, ultimato lo spider del sito, abbiamo la necessità di lanciare
un _active scan_, invocando l'azione scan del componente ascan. I parametri
mandatori sono, l'API Key e l'url da testare.

{%highlight sh%}
http://localhost:8080/JSON/ascan/action/scan/?zapapiformat=JSON&apikey=pippo&url=http%3A%2F%2Ftestphp.acunetix.com&recurse=&inScopeOnly=&scanPolicyName=&method=&postData=
{%endhighlight%}

Anche lo scanner ha un metodo per verficare lo status:

{%highlight sh%}
http://localhost:8080/JSON/ascan/view/status/?zapapiformat=JSON&scanId=0
{%endhighlight%}

L'output durante l'esecuzione della scansione, ci da una percentuale di completamento e uno stato RUNNING della scansione:

{%highlight json%}
{"scans":[{"progress":"29","id":"0","state":"RUNNING"}]}
{%endhighlight%}

Mentre il nostro terminale si riempie dei log che ci danno evidenza dell'attività di Owasp ZAP verso il nostro sito target:

{%highlight sh%}
508075 [Thread-12] INFO org.parosproxy.paros.core.scanner.HostProcess  - completed host/plugin http://testphp.acunetix.com | TestRemoteFileInclude in 13.261s
508075 [Thread-12] INFO org.parosproxy.paros.core.scanner.HostProcess  - start host http://testphp.acunetix.com | TestServerSideInclude strength MEDIUM threshold MEDIUM
514235 [Thread-12] INFO org.parosproxy.paros.core.scanner.HostProcess  - completed host/plugin http://testphp.acunetix.com | TestServerSideInclude in 6.16s
514235 [Thread-12] INFO org.parosproxy.paros.core.scanner.HostProcess  - start host http://testphp.acunetix.com | TestCrossSiteScriptV2 strength MEDIUM threshold MEDIUM
518308 [Thread-12] INFO org.parosproxy.paros.core.scanner.HostProcess  - completed host/plugin http://testphp.acunetix.com | TestCrossSiteScriptV2 in 4.073s
518309 [Thread-12] INFO org.parosproxy.paros.core.scanner.HostProcess  - start host http://testphp.acunetix.com | TestSQLInjection strength MEDIUM threshold MEDIUM
542583 [Thread-12] INFO org.parosproxy.paros.core.scanner.HostProcess  - completed host/plugin http://testphp.acunetix.com | TestSQLInjection in 24.274s
542584 [Thread-12] INFO org.parosproxy.paros.core.scanner.HostProcess  - start host http://testphp.acunetix.com | CodeInjectionPlugin strength MEDIUM threshold MEDIUM
553088 [Thread-12] INFO org.parosproxy.paros.core.scanner.HostProcess  - completed host/plugin http://testphp.acunetix.com | CodeInjectionPlugin in 10.504s
553088 [Thread-12] INFO org.parosproxy.paros.core.scanner.HostProcess  - start host http://testphp.acunetix.com | CommandInjectionPlugin strength MEDIUM threshold MEDIUM
{%endhighlight%}

Al termine della scansione, l'output del metodo status sarà il seguente:

{%highlight json%}
{"scans":[{"progress":"100","id":"0","state":"FINISHED"}]}
{%endhighlight%}

Una volta terminata la scansione attiva, è giunto il momento di recuperare gli alert, i messaggi che ci ha restituito lo strumento. Questo è ottenuto usando l'azione alerts della componente core:

{%highlight sh%}
http://localhost:8080/JSON/core/view/alerts/?zapapiformat=JSON&baseurl=&start=&count=
{%endhighlight%}

## Off by one

Ricapitoliamo cosa è successo:

* abbiamo lanciato Owasp ZAP in modalità demone dalla linea di comando
* abbiamo individuato una URL da testare
* abbiamo utilizzato le API di ZAP, tramite una GET HTTP, per lanciare prima
  uno spider e poi una scansione sulla nostra URL
* sempre attraverso le API di ZAP e sempre attraverso una GET HTTP, siamo stati
  in grado di recuperare tutti i risultati della nostra scansione in formato
  JSON

Questa modalità di ZAP, permette di integrare questo tool alla perfezione in
una pipeline di sicurezza applicativa e permette di automatizzare la fase di
prima scansione di un sito, non appena il cliente interno o comunque il
committente ne faccia richiesta.

Sulla [Wiki](https://github.com/zaproxy/zaproxy/wiki/ApiDetails) del progetto,
c'è per esteso la documentazione di tutte le componenti disponbili attraverso
le API e le azioni che è possibile richiamare su ciascuna componente. Sono
anche disponibili i binding realizzati in vari linguaggi e che permettono di
integrare Owasp ZAP in applicazioni di terze parti, senza ricordarsi il
formalismo della richiesta HTTP da eseguire.

Sicuramente, questo è quello che vorremmo che ciascun tool di sicurezza
applicativa degno di tale nome.

Enjoy it!
