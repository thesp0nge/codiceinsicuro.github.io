---
layout: page
author: thesp0nge
permalink: /cookie-policy/
title: "Cookie policy"
modified: 2015-05-29 18:32
tags: [cookie policy, cookie, garante della privacy, legge, normativa europea]
image:
  feature: cookie.jpg
share: true
---

Il 2 Giugno 2015, è entrata in vigore la normativa europea sui cookie di
profilazione. In breve, per quanto ne ho capito io, tutti i siti che usano i
cookie per profilare i propri utenti devono chiederne il consenso
all'installazione, prima che essi possano fruire dei contenuti del sito.

Una sorta di _vuoi il contenuto, accetta il cookie; non vuoi il cookie, non
avrai il contenuto_.

Quanti cliccheranno "YES" senza neanche preoccuparsi di cosa sia un cookie di
profilazione? Quanti sanno poi cos'è un cookie? Io credo che questa sia
l'ennesima legge su Internet totalmente inutile, ma non voglio andare nelle
grane perché le multe sono belle salate.

## CodiceInsicuro ed i cookie che ti installa

Sorpresa, **nessuno**. Fino a poco tempo prima dell'entrata in vigore della
cookie policy c'erano solo i cookie di Google Analytics. Sebbene il legislatore
avesse autorizzato all'adozione silente di questi cookie, purché anonimizzati,
io ho deciso di rimuovere i cookie.

Quindi, le vostre informazioni vanno a Google in forma anonima e non vengono
salvate sul vostro PC. Questo farà saltare le mie statistiche? Pazienza, mi
basta il vostro affetto.

> Per CodiceInsicuro, i lettori sono molto più di una statistica.

## Non ci credo

Bhé, [CodiceInsicuro]({{site.url}}) è un sito statico, ci sono solo file HTML, i fogli di stile e qualche Javascript. I commenti sono gestiti con [Disqus](https://www.disqus.com) e non faccio girare codice server-side.

Questo è il codice JS messo per analytics:

{% highlight javascript %}
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-50260618-1', 'auto', {
  'anonymizeIp': true
    , 'storage': 'none'
    , 'clientId': window.localStorage.getItem('ga_clientId')
});
      ga('send', 'pageview');

    </script>


{%endhighlight %}

Anonimizzo l'IP e setto lo storage a none. Se non basta questo...
