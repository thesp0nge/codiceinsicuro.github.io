---
layout: default
permalink: /posts/
title: Tutti i post
tagline: Tutti i post di codice insicuro
tags: [blog]
---

<header class="main-header post-head {% if page.image.feature %}" style="background-image: url(/assets/images/{{ page.image.feature }}) {%else%}no-cover{% endif %}">
    <nav class="main-nav {% if page.image.feature %} overlay {% endif %} clearfix">
        <a class="back-button icon-arrow-left" href="{{ site.baseurl }}">Home</a>

        <a class="subscribe-button icon-feed" href="http://feeds.feedburner.com/CodiceInsicuro">Subscribe</a>
        <a style="margin-right: 0.2em;" class="subscribe-button" href='{{ site.baseurl }}cookie-policy'>Cookie Policy</a>
        <a style="margin-right: 0.2em;" class="subscribe-button" href='{{ site.baseurl }}about'>About</a>
        <a style="margin-right: 0.2em;" class="subscribe-button" href='{{ site.baseurl }}contatti'>Contatti</a>
    </nav>
</header>

<main class="content" role="main">

  <h1 class="post">Tutti i post di Codice Insicuro</h1>

{% for post in site.posts %}
  <article class="post">
        <header class="post-header">
            <h2 class="post-title"><a href="{{ post.url }}">{{ post.title }}</a></h2>
        </header>
        <section class="post-excerpt">
            {{ post.excerpt | strip_html | truncatewords: 100}} <a class="read-more" href="{{ post.url }}">&raquo;</a>
        </section>
        <footer class="post-meta">
            {% if site.author %}
                <img class="author-thumb" src="/assets/images/profile.png" alt="Author's profile picture" nopin="nopin" />
                {{ site.author.name }}
            {% endif %}
            {% if post.categories.size > 0 %} 
                {{ post.categories | array_to_sentence_string | prepend: 'on ' }} 
            {% endif %}
            <time class="post-date" datetime="{{ post.date | date:"%d-%m-%Y" }}">
                {{ post.date | italian_short_date }}
            </time> 
        </footer>
    </article>

{% endfor %}
</main>
