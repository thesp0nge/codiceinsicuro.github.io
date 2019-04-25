---
layout: news
author: thesp0nge
title: "Applicazioni iOS e problemi di TLS"
promotion: 
modified: 
featured: false
category: [news]
tags: []
fonte: https://threatpost.com/popular-ios-apps-vulnerable-to-tls-interception-attacks/123610/
comments: true
share: true
---

I ricercatori del Sudo Security Group, hanno analizzato una settantina di
applicazioni iOS appartenente a domini sensibili come il finanziario, il
bancario e il sanitario.

Dalla loro analisi emerge che un buon 30% di esse ha problemi di protezione del
canale trasmissivo. I ricercatori infatti, hanno verificato che le applicazioni
mobile usano TLS ma usano e convalidano certificati self-signed, probabilmente
lasciati dagli sviluppatori per debug o per _pigrizia_ nel setup
dell'architettura.

Questo permetterebbe ad un attaccante di avere una via più facile per portare
un attacco di tipo _man in the middle_ nei confronti di ignari utenti.
