---
layout: page
author: thesp0nge
permalink: /slae/
title: "SecurityTube Linux Assembly Expert certifiation"
image:
  feature: slae.png
---

In order to prepare myself for the [Cracking the
perimeter](https://www.offensive-security.com/information-security-training/cracking-the-perimeter/)
course and certification, I revamped my assembly knowledge with this small
course.

[SLAE
course](http://www.securitytube-training.com/online-courses/securitytube-linux-assembly-expert/index.html)
from SecurityTube is one of the most accurate and well explained journey into
assembler and shellcode writing. You can start with zero knowledge and become
proficient into shellcode writing.

SLAE certification consist in 7 assignments to be solved and to be published
online. In this page, you can find the whole list of those assignments.

## SLAE Exam Statement

This blog post has been created for completing the requirements of the SecurityTube Linux Assembly Expert certification:

[http://securitytube-training.com/online-courses/securitytube-linux-assembly-expert/](http://securitytube-training.com/online-courses/securitytube-linux-assembly-expert/)

Student ID: SLAE-1217

{% assign slaes = site.slae | sort: "order" %}

<ul>
{% for s in slaes %}
  <li><a href="{{s.url}}">{{s.title}}</a></li>
{% endfor %}
</ul>
