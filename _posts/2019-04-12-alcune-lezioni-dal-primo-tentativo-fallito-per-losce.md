---
layout: post
author: thesp0nge
title: "Alcune lezioni dal primo tentativo fallito per l'OSCE"
promotion: 
modified: 
featured: false
category: [post]
tags: [osce, offensive security, pentest]
image:
  feature: osce_1.jpg
comments: true
share: true
---

Nell'agosto di due anni fa scrivevo un
[post]({{site.url}}/blog/alcune-lezioni-dal-primo-tentativo-fallito-per-loscp/)
dopo il fallimento nel primo tentativo di certificazione per OSCP.

Oggi sono qui a raccontare cosa ho imparato nel fallimento del primo tentativo
di certificazione per
[OSCE](https://www.offensive-security.com/information-security-training/cracking-the-perimeter/).

## L'inferno in una gabbia

Subito l'esito come l'altra volta. Per OSCE ero ben lontano dai 75 punti su 90
necessari per passare; vuoto per pieno avrò totalizzato una 50ina di punti. 

L'esame è duro, sopratutto per le 48 ore + 24 del report che sono concesse.
Accumuli una grossa quantità di stress e caffeina che smaltisci dopo un paio di
giorni ed è difficile pensare di tornare subito in sella al cavallo una volta
disarcionato.

## Io e me

Sono **bocciato** ma **soddisfatto**. Mi ero preparato, avevo curato i miei
script ma non avevo calcolato un paio di imprevisti che mi hanno tolto lucidità
e fatto perdere tempo:

* la VPN è stata down per 12 ore. Ho avuto un extra time di 6 ore (quindi il
  mio esame è durato 42 ore in realtà) ma non è stato abbastanza. Avevo
  impostato tutti gli esercizi, forse avessi avuto più tempo... In realtà
  Offensive Security mi aveva offerto un retake gratis dell'esame, ma ho scelto
  di provarci anche per le difficoltà che avrei causato in famiglia e sul
  lavoro, con un altro impegno di 3 giorni ravvicinato.
* OllyDBG se riavvia un demone (Ctrl+F2) ha un comportamento diverso sullo
  stack, rispetto a quando il demone viene lanciato da linea di comando e
  OllyDBG si aggancia al processo.

## Cosa ho imparato

1. Mai più rilanciare un eseguibile dal debugger ma uscire, rilanciare
   l'eseguibile ed agganciarsi.
2. Scrivere shellcode non è così brutto come molti possano pensare.
3. A scrivere [exploit](https://www.exploit-db.com/?author=9461) divertendomi
4. Che senza gcc devi fare in altro modo

## Off by one

In estate si accavallano 3 esami per me. Il terzo dan di Taekwon-do, l'esame
per la patente A ed il retake di OSCE. A questo punto mi prendo tutto aprile
per raccogliere i pezzi e poi farò approfondimenti sulle parti dove avevo più
lacune.

Forse non andrò mai in TV a parlare di captatori informatici, ma almeno non si
può dire che non mi sia...  _"impegnato di più"_.


Enjoy it!
