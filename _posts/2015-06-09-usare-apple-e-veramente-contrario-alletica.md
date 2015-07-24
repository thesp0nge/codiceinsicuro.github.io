---
layout: post
title: "Usare Apple è veramente contrario all'etica?"
promotion: "Siamo sicuri che gli strumenti che usiamo misurino la nostra etica in un campo?"
modified: 
featured: true
category: [Chiacchiere da bar]
tags: [etica, baruffe chioggiotte, opensource, linux, compilo il kernel = sono figo]
image:
  feature: anguille.jpg
  credit: Stefano Mortellaro
  creditlink: https://flic.kr/p/aiifP
comments: true
share: true
---

Stavo commentando il post di un amico che presentava a tutti il suo nuovissimo
[MacBook 12 pollici](http://www.tomshw.it/news/macbook-da-12-pollici-le-prime-recensioni-lo-premiano-come-il-notebook-del-futuro-65398). In uno dei commenti ci si chiedeva più o meno se fosse
[etico](http://it.wikipedia.org/wiki/Etica) che ai raduni hacker (???) ci potessero essere così tante macchine _made
in Cupertino_.

Ho chiesto, il perché di tale affermazione. In cuor mio ritengo lontani i tempi
dove in [it.comp.os.dibattiti](https://groups.google.com/forum/#!forum/it.comp.os.dibattiti) ci si misurava sui centrimetri del closed vs
open, io compilo il kernel, tu non puoi vedere i sorgenti del sistema operativo
quindi sei un perdente.

Oggi, nel 2015, la macchina è la base. Apple fa dei laptop belli esteticamente
e che montano uno Unix, [vicino ad essere POSIX
compliant](http://en.wikipedia.org/wiki/Darwin_(operating_system)), con una
bella interfaccia grafica. E' uno strumento, ci si può trovare comodi, come si
può preferire un vecchio Ampex su HP-UX[^1], come si può preferire una macchina
Windows.

Quello che distingue poi la persona che li usa è il contributo alla comunità.
Hai una mentalità opensource? Condividi le tue scoperte? Fai talk? Fai
divulgazione? Scrivi codice open per risolvere problemi di tutti? Se fai tutto
questo, bhé secondo me meriti di stare sul piedistallo al raduno hacker anche
con Visual Studio aperto.

Perché di gente che compila il kernel solo perché fa figo è pieno il mondo... e
dice che gli altri mancano di etica.

## Off by one

Microsoft [recentemente ha rilasciato .NET
opensource](https://github.com/Microsoft/dotnet) e preso posizioni molto
apprezzate in merito alla divulgazione delle informazioni. Il
[Technet](https://technet.microsoft.com) è una miniera d'oro ed il [patching
tuesday](http://it.wikipedia.org/wiki/Patch_Tuesday) un esempio **serio** di
gestione delle vulnerabilità dei propri prodotti. Mi dispiace per i _microsoft
haters_ ma un server 2012R2, a parità di configurazione, è tanto difficile da
sfondare quando un sistema Unix.

> Poi io amo la shell, ma questo è un altro discorso.

Apple, che proprio ieri ha annunciato la [nuova versione di OS X, El
Capitan](http://www.ilsole24ore.com/art/tecnologie/2015-06-08/apple-lancia-nuovo-sistema-operativo-os-x-el-capitan--195256.shtml),
in realtà di chiuso ha Aqua, il suo famoso sottosistema grafico. Per il resto,
le [componenti di sistema](http://www.opensource.apple.com/release/os-x-1010/)
e [darwin](https://developer.apple.com/opensource/) sono opensource.

Secondo me, non è tanto la piattaforma (Linux, Windows, Amiga, Mac, Cray,
Sha7Terminals[^2], Ampex) a rendere un frequentatore dei raduni hacker (???)
etico o no. Se una persona contribuisce a diffondere quello che impara nei
mezzi a lui più congeniali allora sicuramente ha tutta l'etica del mondo, se
uno usa _leeeenux_ solo perché fa figo, bhé allora è un po' un picio.

Vi lascio con una chicca. Ho trovato in rete [questo
script](https://github.com/mathiasbynens/dotfiles/blob/master/.osx) che
permette di configurare da command line molti aspetti della nostra sessione di
lavoro Mac. Usatelo come partenza per imparare i trick della linea di comando
Apple e, mi raccomando... **siate etici.**

Enjoy!

[^1]: Nel 1996 quando mi sono affacciato al mondo del networking, di C e di
      Unix, il mio comitato di accoglienza fu un terminale Ampex collegato ad un
      server HP9000. Girava su VI, non VIM... VI. Li ho amati.

[^2]: Davvero nessuna startup fica ha ancora lanciato
      [Sha7Terminals](https://sha7terminals31337.org)? L'ultima frontiera del banfa
      sicuro in un portatile all'avanguardia che monta sha7os, l'innovativo sistema
      operativo proprietario in grado di dare un solo output, sha7, ad ogni input
      utente? No, dai... mi diludete :-)
