---
layout: post
title: "Write-up non serio di una CTF domenicale"
promotion: "Write-up di una CTF andata decisamente male e della mia ruggine unita alla sindrome da NCIS"
modified: 
featured: false
category: [post]
tags: [ctf, hackinbo, wapt, mentalist, hacktive security, paolo stagno]
image:
  feature: NetBSD-old.jpg
  credit: NetBSD 
  creditlink: http://www.netbsd.org
comments: true
share: true
---

Si è conclusa da una manciata di ore la [CTF](http://ctf-hib.thesthack.com), organizzata dai ragazzi di
[Hacktive Security](https://hacktivesecurity.com). In palio per i primi 45 in
classifica, un biglietto per il laboratorio del 7 Maggio di
[HackInBo](https://www.hackinbo.it).

E' andata non male, di più. Si sente che negli ultimi anni mi sono sbilanciato
verso la parte di _difesa_ e sviluppo sicuro. Non che questo sia un male,
certamente, però mi ha arruginito le giunture e ci dovrò lavorare sopra.

Per il write-up completo di tutta la competizione, vi rimando a [questo
post](https://www.shielder.it/blog/soluzione-ctf-hib-ctf-2017-spring-edition/).

## Le prime due flag

A disposizione per ciascun partecipanti, 11 flag disseminate all'interno di un
sito di eCommerce. Ne ho portate a casa solo 2, le prime, le più semplici.
Pessimo risultato a parte, ecco dov'erano nascoste.

La prima flag era nella [home page del sito](http://ctf-hib.thesthack.com), in
un commento in fondo alla pagina. La stringa, codificata in base 64, dava
accesso ai primi punti facili. E questa è andata in maniera molto agevole.

La seconda flag parlava del **ban** minacciato dagli amministratori nel caso
fossero stati usati tool automatici di pentest. Lanciato in precedenza,
[Dirbuster](https://www.owasp.org/index.php/Category:OWASP_DirBuster_Project)
trovava un'interessante pagina chiamata 403.php. Al suo interno la flag. Altri
punti guadagnati, in realtà gli ultimi per me.

## The Mentalist

Da questo punto, mi sono un po' perso. Avevo collezionato i seguenti indizi:

* esisteva un PhpMyAdmin fake, che aveva un javascript che redirigeva il submit
  della form su un filmato di 10 ore che parlava di [Hobbit portati ad
  Isengard](https://www.youtube.com/watch?v=z9Uz1icjwrM)
* nel form dei contatti, veniva inclusa una mappa di Bali
* i due punti di ingresso per passare al livello successivo sembravano essere:
  administrator.php e user.php
* la pagina di ricerca aveva un cross site scripting che non poteva essere
  messo lì per caso
* c'era un'immagine che parlava di [sorgente
  C](http://ctf-hib.thesthack.com/icons/c.gif), come una flag da trovare

Conoscendo un po' [uno degli autori della CTF](https://twitter.com/Void_Sec),
mi sono perso in un dedalo mentale dove, ogni cosa mi sembrava un possibile
indizio.

Era ovvio che, per passare oltre, avrei avuto bisogno di accedere al database
dell'eCommerce. Ho pensato quindi che giocare con il DOM della pagina
/phpmyadmin fosse una cosa intelligente. Ho provato a rinominare la form, a
dare un'altra funzione all'evento onsubmit, sono arrivato ad avere la POST
secca, senza il redirect, **ma**, vicolo cieco. Da lì non si passava.

Bali. Perché mettere una mappa di Bali nella form dei contatti e giù ad
ingrandire la mappa, studiare se le coordinate potessero essere utilizzate in
qualche modo ma, anche in questo caso, non era il posto giusto.

La GIF del sorgente C, bhé questa era piccola da analizzare, nei commenti
dell'immagine non c'era niente.

Decisamente mi sono fatto portare a spasso da questi indizi, convinto che il
passaggio al backend fosse in qualche punto esotico o arzigogolato. Invece no,
era [molto più lineare](https://www.shielder.it/blog/soluzione-ctf-hib-ctf-2017-spring-edition/) di quanto mi aspettassi.

## Off by one

Allora, in breve:

* mai iniziare una CTF con troppo pinot in corpo
* ci sono tool automatici e tool automatici. Mentre un tool che aiuti ad
  ricavare la struttura del sito può aiutare, un tool per la scansione non
  venica sostituito da della sana esperienza
* per quanto sadici possano essere i vostri aguzzini digitali, la soluzione è
  più semplice di quanto possiate pensare. Soprattutto se il tempo ha
  disposizione è limitato.
* nessuno nasconde indizi a Bali o in c.gif

Bene, a volte serve condividere anche l'esperienza negativa, non sempre va
bene, non sempre si esce carichi di bandierine. Vediamo come va al prossimo
giro.

Ah, in molti si domandano ancora quale sia la password di Salvatore Aranzulla.

Enjoy it.
