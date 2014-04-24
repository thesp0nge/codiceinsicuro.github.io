---
layout: post
title: "L'upgrade di Mavericks e il format bug di Safari"
modified: 2014-04-23 18:51:03 +0200
category: [attackers]
tags: [os-x, apple, format-bug, snprintf, anni 90, mavericks, 10.9, safari, cve-2014-1315]
image:
  feature: safari_format_bug.png
  credit: Il mio macbook
  creditlink:
comments: true
share: true
---

## Quello che non conosci potrebbe ucciderti

Ve la ricordate immagino, la critica alla ragion pura fatta appena una decina
di giorni fa in pieno ciclone [heartbleed attack](http://heartbleed.com).

> La polemica su open vs closed nella lotta a chi ce l'ha più sicuro appassiona
> un po' tutti e molti, che non hanno mai scritto una riga di codice vogliono
> metterci la bocca.

Se il codice è _opensource_, oltre a rimetterci la faccia come il simpatico
sviluppatore tedesco che un paio di anni fa si è dimenticato di controllare
quanti caratteri doveva allocare, hai anche una chiara descrizione sia della
vulnerabilità che della fix. Sai qual è il problema, sai cosa rischi e sai come
è stato risolto.

Il codice _proprietario_ bhé... ha gli stessi problemi di quello opensource. Ha
anch'esso bug di security. Può avere anch'esso vulnerabilità che fanno
sorridere se pensiamo che si parlava di _format bug_ prima del cambio di
millennio. La differenza sta nel fatto che non sai se il problema è stato
mitigato correttamente. Non sai a volte neanche quale sia il problema: conosci
il sintomo come in questo caso ma puoi solo intuire la causa.

## Il security update APPLE-2014-002

Oggi il mio macbook mi ha chiesto se volessi aggiornare il sistema operativo
con delle non meglio precisate patch che, tra l'altro, risolvevano alcune issue
di security. Attenzione, Apple ti mette a disposizione le release notes
dell'aggiornamento, tuttavia non sempre si ha tempo e voglia
di andarsele a leggere, soprattutto davanti ad un popup apparso durante una
sessione di lavoro.

Ecco, il [Security Update 2014-002](http://support.apple.com/kb/HT6207) è uno
di quelli da installare. Andando a leggere le release note fornite da Apple,
sono molte le vulnerabilità di severità **alta** che sono state fixate.

![La schermata dell'Update Apple 2014-002]({{site.url}}/images/apple-sw-update-2014-002.png)

Tra di esse è stato chiuso il
[CVE-2014-1315](http://web.nvd.nist.gov/view/vuln/detail?vulnId=CVE-2014-1315)
che mi rimanda ai tempi dell'Università. Eravamo tra 2000 e il 2001 e stavo
lavorando con Aldo alla tesi di laurea, il [progetto
AngeL](http://www.sikurezza.org/angel/). Erano due i modi più in voga per
attaccare _localmente_ una macchina unix:

* i buffer overflow[^1]
* le uncontrolled format string.

## Il CVE-2014-1315 e le uncontrolled format string

La vulnerabilità [uncontrolled format
string](http://en.wikipedia.org/wiki/Uncontrolled_format_string)[^2], di cui il
[CVE-2014-1315](http://web.nvd.nist.gov/view/vuln/detail?vulnId=CVE-2014-1315)
è un esempio, sono introdotte quando nel codice sorgente lo sviluppatore stampa
a video una stringa senza usare le direttive di formattazione che le funzioni
della famiglia _printf()_ mette a disposizione.

Questa famiglia di vulnerabilità può portare al crash del programma vulnerabile
e, in alcune circostanze, all'esecuzione di codice arbitrario.

Ora pensate allo scenario in cui una mail di phishing viene inviata con una url
opportunamente formattata. L'URL viene mascherata dall'HTML della mail[^3].
L'ignaro utente che usa Safari clicca il link che contiene in realtà un payload
che sfrutta questa uncontrolled format string. Il risultato è codice arbitrario
eseguito lato client dove, nel caso di Mac OS X, può succedere che qualche
utente abbia privilegi elevati. Ma anche se non fosse un super user,
sicuramente modo di far danni si trova.

L'errore di programmazione alla base di questo, e di praticamente la
maggioranza delle vulnerabilità più gravi lì fuori, è la mancata validazione
dell'input. In questo caso, un input malformato si aggiunge ad una _leggerezza_
dello sviluppatore.

{% highlight c%}
#include <stdio.h>
#include <string.h>

int main(int argc, char **argv)
{
  char p[1024];
  // We play fairly. We avoid buffer overflow here. (remember the string
  // termination character '\0', that's why only 1023 bytes copied form argument.
  strncpy(p, argv[1], 1023);
  printf("You wrote:\n");
  printf(p);
  printf("\n");

  return 0;
}
{% endhighlight %}

La cosa strana, compilando con gcc questo codice di esempio, è che ci viene
dato un warning che stiamo usando la printf senza dare una direttiva di
formattazione.

{%highlight text %}
format_bug.c:11:10: warning: format string is not a string literal (potentially insecure) [-Wformat-security]
{%endhighlight%}

> Quando compiliamo un software in C, è buona cosa usare la direttiva -Wall in
> modo da avere tutti i _warning_ del caso dal compilatore. In questo modo
> potremmo accorgerci anzitempo di sviste, macroscopiche come nel caso del
> format bug.


![Safari dopo l'upgrade]({{site.url}}/images/safari-after-update.png)

Il solito thread pieno di spunti su [stackoverflow.com](http://stackoverflow.com/questions/7459630/how-can-a-format-string-vulnerability-be-exploited).

[^1]: se non sapete cosa sia un buffer overflow, in attesa che prepari un post apposta qui su codiceinsicuro.it, leggete la bibbia in materia: [Smashing The Stack For Fun And Profit](http://insecure.org/stf/smashstack.html)
[^2]: rimando al link inglese di Wikipedia in quanto, come in molte voci che parlano di IT e di sicurezza informatica, molto più completo della traduzione in italiano.
[^3]: come riporta il bollettino del NVD, la vittima deve interagire volontariamente con il pattern di attacco (cliccare il link). Nel caso di utenti non smaliziati, la cosa è tutto fuorché improbabile, putroppo.
