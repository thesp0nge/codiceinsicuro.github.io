---
layout: page
author: thesp0nge
permalink: /news/
title: "Notizie dal mondo"
image:
  feature: news_cover.jpg
---

{% assign notizie = site.news | sort: "date" %}

<ul>
{% for n in notizie %}
  <li><a href="{{n.url}}">{{n.date | date: "%d/%m/%Y"}}: {{n.title}}</a></li>
{% endfor %}
</ul>
