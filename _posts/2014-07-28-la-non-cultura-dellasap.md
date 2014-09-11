---
layout: post
title: "La non cultura dell'ASAP"
modified:
category: [Chiacchiere da bar]
tags: [ASAP, release early release often, startup, big corporate, subito, produzione, bug, dilbert, cubicolo]
image:
  feature: say_no.png
  credit: Keith Chastain
  creditlink: https://flic.kr/p/6LXqbS
comments: true
share: true
---

Esiste un adagio, figlio della disorganizzazione e della mancata pianificazione.

> Il business ha deciso che quella cosa deve andare online ASAP perché è
> strategica.

Quindi l'outsourcer[^1], domanda giustamente "quando di farete avere un GANTT?
quando contate di andare in produzione?" e di solito il marketing, che è
l'unico a conoscere la vera identità del _business_, solitamente guarda
l'outsourcer tra lo schifato e l'incredulo ed afferma "veramente noi vogliamo
andare online, non più tardi di dopodomani".

## ASAP ASAP ASAP ASAP ASAP ASAP e l'incapacità di dire NO

L'affermazione del marketing è sbagliata per due motivi fondamentali. Il primo
motivo è quello di aver stimato l'effort di un'attività sulla quale non si
hanno competenze. Una persona che si occupa di marketing non può avere idea di
quanto serva per implementare una nuova funzionalità in un'applicazione web.

Lavorare con deadline assurde porta una persona, che di solito non è che sia
pagata profumatamente e qui sugli stipendi nell'IT Italiano si può aprire un
tavolo che dura in eterno, a lavorare sotto stress massimizzando la probabilità
di introdurre bug.

Secondo motivo. Probabilmente il marketing ha provato a spiegare al _business_
che se una cosa è strategica occorre pianificarla bene perché il time to market
è sì importante, ma lo è anche l'immagine rovinata da un prodotto non
funzionante. E qui inizia la catena dell'incapacità di dire **no**.

Il business, che forse ignora quanto sia delicato il lancio di una nuova
iniziativa, perché focalizzato su altri aspetti, fa la voce grossa. Il
marketing, che conosce il rischio, però non sa dire NO.

A questo punto, il marketing ignora quanto serva per tradurre in codice quella
funzionalità e inizia a fare la voce grossa con lo sviluppo. Lo sviluppo, a cui
è chiaro che verrà fuori una porcata, non è capace di dire NO e quindi prende
uno sviluppatore, rigorosamente junior (ricordate il [discorso sul pagare
noccioline?](https://codiceinsicuro.it/blog/se-paghi-noccioline-attirerai-scimmie-storie-job-posting-nellera-delle-startup/)
per massimizzare il C/R[^2], e gli fa buttar su un po' di codice a caso.

Il business è contento, ha la sua funzionalità strategica ed ora può gridare
con il marketing perché si è accorta che quella del competitor funziona e la
sua no.

Il marketing è contento, ha strappato una fornitura a basso costo ed ha
raggiunto il suo obiettivo, ora può gridare con l'outsourcer perché il codice è
di infima qualità.

Il sales dell'outsourcer è contento. Lui ha fatto un'attività con un buon
margine e, dopotutto, ha fatto contento il cliente perché ha rispettato le
scadenze e tenuto bassi i costi. Ora potrà urlare con lo sviluppatore perché il
cliente non è contento della qualità. Dopotutto, anche suo nipote è in grado di
fare un sito web, siamo certi che noi che siamo _grande firma della system
integration_ non possiamo fare di meglio.

Lo sviluppatore non può gridare con nessuno. A lungo andare si stuferà e presto
cambierà lidi per non dire cambierà nazione, dove la sua professionalità è più
considerata.

Questo si traduce in un esodo, che è sotto gli occhi di tutti, di brillanti
software engineer che all'estero vanno a lavorare per i giganti o fondano le
loro agenzie. Un esodo che porta il nostro mercato interno ad essere sempre più
povero di qualità. Tuttavia questo non preoccupa il _business_, meno qualità =
meno costi.

## Si ma la sicurezza?

Il marketing da una stima sui tempi tecnici di sviluppo, da anche una
valutazione implicita del rischio, dal punto di vista di sicurezza ICT, nel
rilasciare un certo codice. Questa valutazione implicita si traduce con _"a ma
perché, si può fare una frode con un sito web?"_ o frase analoga detta con
fanciullesco candore.

Il sales dell'outsourcer, ammesso e non concesso che pensi ai temi di ICT
security, non andrà mai ad inserire altri costi nel suo progetto che abbassino
ancora di più il suo margine.

Lo sviluppatore, bhé non ha neppure il tempo materiale di vedere se il suo
codice compila...

## Off by one

La non cultura dell'ASAP è deleteria. Ci fa mettere su applicazioni web
attaccate con lo sputo, che il primo script kiddie è in grado di bucare con lo
sguardo.

Ci fa diminuire la qualità dei prodotti che portiamo sul web e questo
non contribuisce di certo a costruire un'immagine di un paese al passo coi
tempi.

Incentiva un esodo dei più bravi nel campo ICT verso l'estero, dove a parità di
crisi mondiale, ci sono strutture più efficenti, condizioni di lavoro migliori
e una cultura più rivolta alla qualità che a buttare codice a casaccio per
ingraziarsi il livello gerarchico immediatemente superiore.

Lo dice
[lifehack](http://www.lifehack.org/articles/communication/the-gentle-art-of-saying-no.html),
lo scrivono i ragazzi di
[37Signals](https://gettingreal.37signals.com/ch05_Start_With_No.php), dire
_"No"_ di fronte ad una richiesta assurda non è mancanza di rispetto. 

Disegnare una strategia per il proprio business implica la pianificazione se si
vuole avere successo, soprattutto se si vuole un prodotto sicuro e robusto. Non
cadere nella non cultura dell'ASAP. Smetti di scrivere ASAP nelle email o
quando ti rivolgi ad un fornitore. Fatti aiutare a stimare le attività in
maniera ragionevole ed aiuta il business a capire che correre non sempre ti fa
arrivare prima dei competitor.


[^1]: in Italia, purtroppo, è nata anche la prassi di demandare tutto lo
      sviluppo IT ad outsourcer nel nome del cost saving a discapito della qualità
      del prodotto finale. Un po' come i giocattoli _made in china_.

[^2]: rapporto costi su ricavi, che mi dice quanto è _profitable_
      quell'attività. Solitamente permette ai sales di guadagnare variabili
      importanti e girare su belle macchine.
