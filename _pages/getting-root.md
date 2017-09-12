---
layout: page
permalink: /getting-root/
title: "Alla ricerca della shell privilegiata"
image:
  feature: 
  credit: 
  creditlink: 
---

'Getting Root' è una serie di tutorial che mostrano come compromettere macchine
preparate _ad hoc_, per testare la parte di sicurezza offensiva e prepararmi al
secondo tentativo di OSCP.

L'idea è quella di dare dei _walkthrough_ di come queste macchine vengono
compromesse. Io lo faccio per esercitarmi e voi, magari ne potete trarre
spunto.

Se siete ad un livello superiore al mio, nel campo dell'_offensive security_,
questi tutorial non vi saranno utili, però potreste commentare dicendo quale
macchina vorreste io provassi a bucare.

Per chi vuole approfondire la propria preparazione, consiglio di investire
soldi nell'[OSCP](https://www.offensive-security.com). Non è solo un corso di
sicurezza offensiva tecnologicamente avanzato, è anche un corso dove si da un
metodo di analisi.

Se volete provare a risolvere questi esercizi di sicurezza offensiva e ottenere
la vostra shell di root, non cliccate sul post che vedete sotto ma sul link
alla destra di ciascun titolo. Verrete rimandati sul sito dove è disponibile la
virtual machine da bucare in modo che leggiate il mio walkthrough solo dopo
averci provato.

Enjoy it!

{% assign roots = site.getting-root  %}

<ul>
{% for r in roots %}
  <li>{{r.date | date: "%-d %B %Y" }} - <a href="{{r.url}}">{{r.title}}</a> - livello: {{r.level}} - <a href="{{r.exercise}}">(link all'esercizio originale)</a></li>
{% endfor %}
</ul>
