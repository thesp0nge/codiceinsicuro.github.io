---
layout: default
author: thesp0nge
permalink: /posts/
title: Tutti i post
tagline: Tutti i post di codice insicuro
tags: [blog]
---


<!-- BEGIN .wrapper -->
<div class="wrapper">

  <!-- BEGIN .portus-main-content-panel -->
  <div class="paragraph-row portus-main-content-panel">
    <div class="column12">
      <div class="portus-main-content-s-block">

        <!-- BEGIN .portus-main-content -->
        <div class="portus-main-content portus-main-content-s-3">
          <div class="theiaStickySidebar">
            <!-- BEGIN .portus-content-block -->
            <div class="portus-content-block">
              <div class="portus-content-title">
                <h2>All Articles</h2>
              </div>
              <div class="article-blog-default">
                {% for post in site.posts %}
                  <div class="item">
                    <div class="item-header item-header-hover">
                      <div class="item-header-hover-buttons">
                        <span data-hover-text-me="Read This Article"><a href="{{post.url}}" class="fa fa-mail-reply"></a></span>
                        {% comment %} <span data-hover-text-me="Add to Read Later"><a href="#" class="fa fa-plus"></a></span> {% endcomment %}
                      </div>
                      <a href="{{post.url}}"><img src="{{site.url}}/assets/images/{{post.image.feature}}" alt="" /></a>
                    </div>
                    <div class="item-content">
                      <h3><a href="{{post.url}}">{{post.title}}</a></h3>
                      <div class="item-meta">
                        <a href="blog.html" class="item-meta-i"><i class="po po-head"></i>{{site.author.name}}</a>
                        <span class="item-meta-i"><i class="po po-clock"></i>{{ post.date | italian_short_date }}</span>
                        <a href="{{post.url}}#disqus_thread" class="item-meta-i"><i class="po po-portus disqus-comment-count" data-disqus-url="{{post.url}}"></i></a>
                      </div>
                      <p>{{ post.excerpt | strip_html | truncatewords: 100}}</p>
                      <div class="item-helper-a">
                        <a href="{{site.url}}" class="button-alt button-alt-frame"><i class="fa fa-reply"></i>Read more</a>
                        {% comment %} <a href="#" class="button-alt"><i class="fa fa-plus-circle"></i>Read later</a> {% endcomment %}
                      </div>
                    </div>
                  </div>
                {%endfor%}
              </div>

              <!-- BEGIN .portus-content-block -->
            </div>

          </div>
        <!-- END .portus-main-content -->
        </div>

        <aside class="sidebar portus-sidebar-small">
          <div class="theiaStickySidebar">

            <!-- BEGIN .widget -->
            <div class="widget">

              <h3>Leggi anche</h3>
              <div class="w-article-list-num">
                {% assign featured_posts = (site.posts|where:"featured","true") %}

                {% for post in featured_posts limit:5 %}
                  <div class="item">
                    <span class="item-num">{{forloop.index}}</span>
                    <div class="item-content">
                      <div class="item-categories">
                        <a href="#" data-ot-css="color: #f3d826;">{{post.category}}</a>
                      </div>
                      <h4><a href="{{post.url}}">{{post.title}}</a><a href="{{post.url}}.html#disqus_thread" class="post-title-comment"><i class="po po-portus" data-disqus-url="{{post.url}}"></i></a></h4>
                      <div class="item-meta">
                        <a href="{{post.url}}"><i class="po po-clock"></i>{{ post.date | italian_short_date }}</a>
                      </div>
                      <p>{{ post.excerpt | strip_html | truncatewords: 30}}</p>
                    </div>
                  </div>
                {%endfor%}

              </div>

            <!-- END .widget -->
            </div>

          </div>
        </aside>

 
      </div>
    </div>
    <!-- ENd .portus-main-content-panel -->
  </div>

  <!-- END .wrapper -->
</div>
