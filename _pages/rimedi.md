---
layout: page
permalink: /rimedi/
title: "I rimedi veloci del bucaniere"
image:
  feature: first_aid.jpg
  credit: Felix E. Guerrero
  creditlink: https://flic.kr/p/7K7eX7
---

Spesso abbiamo bisogno di una soluzione veloce ad un problema abbastanza
comune. E quando non abbiamo tempo di cercare su Google, cosa possiamo fare?

Cercare in questa pagina, il rimedio di sicurezza applicativa che ogni pirata,
anche in erba, vorrebbe avere sempre con se.

{% assign tips = site.rimedi | sort: "order" %}

<ul>
{% for tip in tips %}
  <li>Rimedio #{{tip.order}}: <a href="{{tip.url}}">{{tip.title}}</a></li>
{% endfor %}
</ul>
