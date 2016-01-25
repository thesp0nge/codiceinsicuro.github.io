---
layout: post
title: "Il tuo .git su Internet? No, no, no!"
promotion: "Lasciare la directory .git su un server Internet equivale a lasciare il tar.gz dei sorgenti. Vediamo perché."
modified: 
featured: true
category: [Under attack]
tags: [git, google dork, codice sorgente, perdita di informazioni, source code disclosure]
image:
  feature: testing.png
  credit: Lego Corporation
  creditlink:
comments: true
share: true
---

E' venerdì. Un sole pallido scalda una giornata di Novembre. Tu stai pensando a
quel codice di cui devi fare refactoring e di come limare di qualche secondo i
tempi di esecuzione delle ricerche nel _backend_.

Ti viene in mente che non hai ancora configurato
[Capistrano](http://capistranorb.com). Per ora stai spostando le cose sul
server di _staging_ a mano, certo non è il massimo ma per il rilascio di
settimana prossima hai già pianificato di usare un tool per fare deploy e
rollback in automatico.

Stai pensando a tutto questo, quando irrompe il tuo capo.

> _"Dobbiamo andare in produzione oggi. Il cliente ha deciso di anticipare il
> lancio."_

Provi ad obbiettare che sono appena terminati gli UAT e che non hai ancora
configurato Capistrano, ma il tuo capo ha già smesso di ascoltarti. Si è girato
e si sta dirigendo velocemente nella sala riunioni dove c'è il _social media
manager_ del cliente che aspetta solo di vedere il sito _online_ per iniziare
le campagne sui _social media_.

Ti arrendi, lanci un _rsync_ di fretta. Il sito è online. Funziona alla
perfezione. Nei giorni seguenti vedi arrivare il _crawler_ di Google. Vedi
popolarsi il database. Qualche bug, certo, chi non li ha. Niente di serio
tuttavia. Il cliente è contento. Il tuo capo, pensa che tu abbia fatto
solamente il tuo dovere.

Ordinaria amministrazione, pensi.

Passano i mesi. Arriva un giorno di Marzo e qualcuno entra nel database, si fa
un export che qualche ora dopo sarà su [ghostbin](https://ghostbin.com) e fa un
deface del sito, sostituendo alla homepage un'immagine politicizzata
inneggiante alla repubblica della Banana Flambé.

Il tuo capo è una furia. Il cliente ancora di più. Mentre il tuo capo cerca di
rabbonirlo e nel mentre ti urla parole di fuoco, a nulla valgono le tue parole
circa i _penetration test_ che lui stesso ha definito un'inutile perdita di
tempo. Intanto, mentre cerchi di venirne a capo, ti domandi: _ma come diamine
ha fatto?_

## La rivincita dei .gith

Lanciate questa query su Google _inurl:.git "intitle:index.of_ e meravigliatevi
di quanta gente ha deciso di distribuire il codice sorgente delle proprie
applicazioni web, direttamente su Internet, a disposizione di chiunque.

Prendete un risultato a caso, diciamo _http://victim.acme.com/.git_. A questo
punto lanciate il comando:

> $ wget -r --no-parent http://victim.acme.com/.git

Dopo un po', dipende dalla vostra connessione e soprattutto da quanto codice
c'è nel repository, vi ritroverete nella directory corrente, una directory
nascosta _.git_.

Ora, eseguite il comando:

> $ git reset --hard

**BUM** ora avete una directory _victim.acme.com_, contenente il codice server
side del sito web in questione. Avete a disposizione i log degli sviluppatori
per ciascun commit fatto e, ancora più interessante, avete a disposizione le
credenziali applicative per accedere al DB. Se siete fortunati, nella
documentazione o nel codice magari riuscite a trovare altri _segreti_.

Da qui, alla compromissione della macchina, il passo è veramente breve. E le
chiavi, le avete lasciate voi stessi in bella vista.

Enjoy it!
