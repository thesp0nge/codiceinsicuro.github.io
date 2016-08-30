---
layout: page
permalink: /news/
title: "Notizie dal mondo"
image:
  feature: news_cover.jpg
  credit: lindalino
  creditlink: https://flic.kr/p/9WDc71
---

{% assign notizie = site.news | sort: "date" %}

<ul>
{% for n in notizie %}
  <li><a href="{{n.url}}">{{n.title}}</a></li>
{% endfor %}
</ul>
