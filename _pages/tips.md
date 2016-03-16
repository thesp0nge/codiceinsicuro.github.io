---
layout: page
permalink: /tips/
title: "I rimedi veloci del bucaniere"
image:
  feature:
  credit:
  creditlink:
---

{% assign tips = site.tips | sort: "order" %}

<ul>
{% for tip in tips %}
  <li>Rimedio #{{tip.order}}: <a href="{{tip.url}}">{{tip.title}}</a></li>
{% endfor %}
</ul>
