---
layout: post
title: "Cosa ho imparato costruendo processi di patch management"
author: thesp0nge
featured: false
category: [post]
tags: [vulnerability assessment, patch management, security, nexpose, nessus, vita da ciso]
image:
  feature: big-p.jpg
comments: true
share: true
---

Una delle cose che come Security Manager, sono stato chiamato a fare nel corso
degli anni e nelle varie realtà dove ho operato, è stato quello di costruire un
processo di patch management.

Bhé, spesso ho fallito ma ne ho tratto un po' di insegnamenti che voglio
condividere con te:

1. capisci il tuo mercato
2. disegna un processo come fossi tu a doverlo seguire
3. misura le performance e reitera

## Capisci il tuo mercato

La prima cosa da fare, prima di sedersi alla scrivania e disegnare il nostro
processo di patch management, è quello di capire la maturità della propria
azienda e la sensibilità su questo tema.

Creare un nuovo processo, forzando le persone al cambiamento, è qualcosa che
necessita di un'esigenza da parte della tua azienda. Se a nessuno importa di
applicare le patch, non puoi far calare dall'alto un nuovo processo senza poi
vederlo fallire miseramente.

Ricorda che un nuovo processo implica imbrigliare un po' l'azienda, dobbiamo
quindi metterci nelle giuste condizioni affinché i nostri colleghi accettino di
lavorare un po' di più.

Se parlando con le persone percepiamo che il tema del patching non è
particolarmente sentito, occorre far nascere in loro l'esigenza? Come? Con
delle sessioni di awareness. 

Quello che posso consigliarti è di non partire con una presentazione fiume sui
benefici del patching o cosa dicono normative e _best practices_. Fai vedere
uno dei video di
[ippsec](https://www.youtube.com/channel/UCa6eh7gCkpPo5XXUDfygQQA) ad esempio,
mostra come un sistema vulnerabile può essere facilmente vittima di una
compromissione. In questo modo il messaggio arriverà più chiaramente.

> Presto i post della serie
> [getting-root](https://codiceinsicuro.it/categories#getting-root), dove
> mostro come risolvo una boot2root, avranno anche loro un video associato.
> Così potrai usare quello pe ril tuo awareness.

Una volta volta che avrai delle persone che sentono il bisogno di avere un
processo formalizzato perché hanno **capito** i rischi a cui vanno incontro,
allora puoi passare al passo successivo.
Anche se sei fortunato e nella tua società il livello di awareness è già buono,
ti consiglio di tenere comunque delle sessioni di awareness il più _pratiche_
possibile. 

Non interessa a nessuno il numero del documento ISO che dice che bisogna
mettere le patch. Interessa capire come può essere attaccato un sistema non
aggiornato e quale il modo più veloce per ottenere un accesso privilegiato.

## Disegna un processo come fossi tu a doverlo seguire

Spesso nelle grandi società vediamo gruppetti di consulenti in giacca e
cravatta che scrivono, scrivono e scrivono. Novelli amanuensi che disegnano
processi e regolamenti che nessuno alla fine seguirà mai. 

Perché? 

Perché chi ha scritto le regole poi non le deve applicare, quindi ha disegnato
qualcosa di completamente fuori dalla realtà.

Quello che ho capito nel corso degli anni è che devo scrivere un processo che
io stesso devo seguire senza sbuffare o senza sentirmi imbrigliato. Se io, che
sono una persona abbastanza restia alle cose ripetitive fatte per tradizione e
che ti fanno perdere tempo, riesco a seguire un processo che ho scritto, allora
sono certo di aver scritto qualcosa di _leggero_ e _funzionale_.

Ottimo, e come si fa?

Ti suggerisco di lavorare _by-example_, quindi ti suggerisco di prendere degli
advisory reali, analizzarli e valutarli secondo dei KPI che ti sei dato e di
procedere all'installazione della patch. Nel caso di una rigida separazione tra
Security ed Operation, la parte di applicazione è quella che, anche in uno
scenario di "doing-by-example", puoi demandare.

In linea di massima un processo di patch management deve comprendere il
patching ordinario ed il patching straordinario. Ti consiglio di impiegare la
maggior parte del tempo a normare il patching **straordinario**, quello che
devi chiedere come CISO in caso di pericolo reale ed imminente, quello che
dovrai fare di fretta.

Il patching ordinario deve essere il più fluido possibile e seguire il ciclo di
vita dell'advisory del vendor, il passaggio su server e workstation di test e
poi il deploy massivo su tutto il parco macchine.


## Misura le performance e reitera

L'idea alla base di tutto il processo è che deve essere di breve attuazione. Ad
esempio, nel caso di Microsoft, il patching non può superare un mese per essere
completato, altrimenti si corre il rischio di rimanere indietro con gli
advisory. Se la tua infrastruttura ha tempi di patching maggiori e non stiamo
parlando di macchine **mission critical**, allora potrebbe esserci un problema
che ti consiglio di affrontare prima di pensare al patching.

E' chiaro che questi sono consigli generali, ma una macchina dovrebbe ricevere
le patch di security almeno ogni trimestre. **Almeno.**

Un secondo fattore di successo, oltre al tempo tra un patching e l'altro è la %
di asset che sono stati coperti.

Supponiamo per esempio che il server principale del tuo core business non possa
essere fermato  per il patching se non una volta all'anno, la vigilia di Natale
mentre tutti guardano "Una poltrona per due". Come fare?

In questo caso, avere sotto controllo il numero di asset che sono
un'**eccezione** per il nostro processo, ci permette di operare del virtual
patching, ovvero di mettere in campo azioni contenitive che limitano la
possibilità per un attaccante di sfruttare un particolare vettore d'attacco.

Esempi di virtual patching possono essere, ad esempio:

* implementare stringenti regole firewall
* mantieni aggiornato il tuo antivirus
* adotta una rigida policy di controllo acceessi alla macchina

## Off by one

Spero che questi 3 punti che ho imparato sul campo, mentre mi sono trovato a
preparare procesis di patch management ti sia piaciuto. Sono cose sulle quali
ci sto lavorando anche oggi e credo siano una quindi quelle cose che non
finiranno mai.

Se ti va, mi farebbe piacere sapere come tu approcci il problema del patch
management o se hai esperienze nettamente diverse dalla mia sulla quale
possiamo confrontarci. Perché non lasci un commento qui sotto?

Ah, sto preparando un mini e-book sul patch management, se sei iscritto alla
[newsletter](https://codiceinsicuro.it/newsletter/) avrai direttamente nella
tua mailbox qualche spunto più pratico, basato sulla mia esperienza. Mi farebbe
piacere non lo perdessi.
