---
layout: post
title: "Il mio amico robots.txt"
modified:
category: [Pick'n'chic]
tags: [superficie d'attacco, robots.txt, link, crawling]
image:
  feature:
  credit:
  creditlink:
comments: true
share: true
---

[Qualche mese
fa](https://codiceinsicuro.it/blog/scopriamo-insieme-la-superficie-dattacco/)
abbiamo iniziato a parlare di superficie d'attacco.

A volte investiamo un sacco di tempo sulla pagina di login e non cerchiamo
subito la porta di servizio.

## Allow: /

I webmaster hanno bisogno che il loro sito sia indicizzato dai crawler dei
motori di ricerca e, per fare in modo che questa indicizzazione sia fatta ad
uso e consumo del webmaster stesso, creano un file
[robots.txt](http://en.wikipedia.org/wiki/Robots_exclusion_standard) che indica
al crawler cosa deve e cosa non deve indicizzare.

Prendiamo ad esempio il file [robots.txt di
codiceinsicuro](https://codiceinsicuro.it/robots.txt). Dice a qualsiasi crawler
in Internet che può indicizzare tutto.

Questo è un blog statico, generato con [Jekyll](http://jekyllrb.com). Non ho
backend di amministrazione o segreti che non voglio rendere disponibili tra i
risultati di ricerca di Google. Tuttavia ho tutto l'interesse a rendere
presenti i miei post, ecco perché lascio spalancata la porta di Codice
Insicuro.

{% highlight text %}
User-agent: *
Allow: /
{% endhighlight %}

Se avessi avuto un backend di amministrazione o se, come accadrà in futuro,
avrò delle risorse protette il cui download dovrà essere in qualche modo
regolamentato, dovrò

## Rock'n'roll robots
