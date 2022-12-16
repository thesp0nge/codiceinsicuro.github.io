---
layout: post
author: thesp0nge
title: "Forum di bittorrent compromesso: credenziali in pericolo"
promotion: "Forum di bittorrent compromesso: credenziali in pericolo"
modified:
featured: false
category: [Under attack, News]
tags: [bittorrent, forum, credenziali, attacco, troy hunt]
image:
  feature: torrent.jpg
comments: true
share: true
---

Il ricercatore [Troy Hunt](https://www.troyhunt.com) ha rilanciato nel
pomeriggio di oggi, la notizia che il forum di BitTorrent è stato compromesso e
numerose credenziali di utenti sono state trafugate e sono da considerarsi
compromesse.


In [questo
advisory](https://forum.utorrent.com/announcement/1-important-security-advisory/),
viene data anche una raccomandazione importante. Gli utenti che usano le stesse
password su più servizi, tra cui BitTorrent, sono incoraggiati **seriamente** a
cambiarle.

La vulnerabilità, come scrive il team di uTorrent (parte di BitTorrent Inc),
sembra debba essere ricercata in uno dei tanti client di BitTorrent, se ho
interpretato bene visto che l'advisory non brilla per cristallinità.

[Motherboard](http://motherboard.vice.com/en_uk/read/another-day-another-hack-user-accounts-for-bittorrents-forum-hacking),
nel suo articolo parla di 34.000 record di utenti contenenti username,
indirizzo email, indirizzo IP (presumibilmente dell'ultima login) e la password
offuscata con SHA1.

L'articolo sottolinea come sia stato usato un salt per perturbare la password,
rendendo così vana la ricerca del valore in chiaro con le rainbow tables. Non
sapendo Motherboard come faccia ad avere questa informazione, prendiamola per
ora con le pinze.

Sembre
[Motherboard](http://motherboard.vice.com/en_uk/read/another-day-another-hack-user-accounts-for-bittorrents-forum-hacking),
indica come il software IP.Board sia da mettere sul banco degli imputati.
Sembrerebbe che IP.Board, sul quale si basa il forum di BitTorrent, abbia già
[sofferto in passato](https://motherboard.vice.com/read/rosebuttboard-ip-board)
di numerose vulnerabilità.

Sarebbe interessante sapere, se la versione utilizzata sul forum compromesso,
fosse vulnerabile o siamo di fronte a qualcosa di nuovo.

## Cosa devo fare

* Vai su [Have I Been Pwned](https://haveibeenpwned.com/) e controlla se la tua
  login è presente;
* Se usavi la stessa password che usavi su BitTorrent anche per altri siti,
  cambiala. Considerala compromessa;
* Cambia la password anche su BitTorrent, ovviamente.

## 2 regole d'oro per vivere sereni

* Cambia spesso le tue password. Lo so, è un reale **sbattimento**, sopratutto
  perché i servizi online sono in costante aumento e spesso lasciamo credenziali
  in ogni dove;
* Usa password diverse, semplici da memorizzare e regola la complessità in
  funzione della criticità del sito;

## 4 regole d'oro per scrivere software sereno

* Applica sempre le patch di security alle librerie e al software di terze
  parti che usi per sviluppare;
* Usa accorgimenti per scrivere software robusto e sicuro;
* Fai un penetration test applicativo ogni tanto;
* Non usare SHA1 per offuscare le password. Usa BCrypt, SHA512 o SHA256 come
  strumenti alternativi per offuscare le password in maniera robusta.

## Parlano di questa compromissione

* [Torrentfreak.com](https://torrentfreak.com/utorrent-forums-hacked-passwords-compromised-160608/)
* [Motherboard](http://motherboard.vice.com/en_uk/read/another-day-another-hack-user-accounts-for-bittorrents-forum-hacking)
* [The Hacker News](http://thehackernews.com/2016/06/utorrent-hacked.html)
