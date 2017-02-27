---
layout: page
permalink: /monday-blues/
title: "Piccole storie dell'orrore di Application Security"
image:
  feature: 
  credit: 
  creditlink: 
---

Nel mondo ci sono storie che meritano di essere raccontate. Storie che
ispirano, che fanno guardare avanti, che rendono persone migliori. Nel mondo
dell'application security ci sono tante storie del genere. 

Ci sono, tuttavia, molte storie dell'orrore. Storie di cose che non vanno,
storie di incomprensioni, storie di crittografia rinnegata e sviluppo di codice
volontariamente insicuro.

Ci sono storie che rendono i lunedì, una giornata veramente dura da superare
per il vostro application security quarterback di quartiere.

In questa serie, ce le racconteremo come faremmo in un fumoso pub con musica
soffusa e melliflua in sottofondo. Ce le racconteremo e diremo come vorremmo
che fossero veramente... i nostri lunedì.

{% assign mbs = site.mb | sort: "order" %}

<ul>
{% for mb in mbs %}
  {% if mb.share %}
  <li>Episodio #{{mb.order}}: <a href="{{mb.url}}">{{mb.title}}</a></li>
  {% endif %}
{% endfor %}
</ul>
