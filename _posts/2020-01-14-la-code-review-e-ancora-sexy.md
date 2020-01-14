---
layout: post
title: "La code review è ancora sexy?"
author: thesp0nge
featured: false
category: [post]
tags: [defensive security, blue team, code review, software assurance, compliance]
image:
  feature: robot.jpg
comments: true
share: true
---

Viviamo in un mondo del lavoro dove lo skill shortage viene combattuto cercando
malware analyst, threat hunter ed esperti in penetration test. Ma persone che
si occupano anche di sicurezza applicativa ce ne sono ancora? La code review ha
ancora fascino?

Che poi, diciamocelo, nell'immaginario collettivo tutti sono lì a scrivere
exploit con una Kali Linux ed un cappuccio nero in testa. Nella realtà dei
fatti, quello che serve è qualcuno che il software sicuro lo aiuti a creare.

## Fascino senza tempo

Diciamocela tutta: progettare, scrivere e rivedere il codice affinché sia
sicuro e robusto è difficile ma è una cosa affascinante. 

Innanzitutto, creare software è bello. Parti da un'idea e crei qualcosa che
verrà usato da altre persone, possibilmente, rispondendo a delle loro
necessità.

Fare una code review quindi implica tu sappia scrivere del software e questa è
una cosa dalla quale chi si occupa di security non può scappare. Certo, se ti
piace solamente la parte di compliance e quindi sei attento unicamente alle
normative, potresti anche farne a meno ma se operi in qualsiasi altro ambito...
bhé il codice devi saperlo scrivere.

Quindi, lavorare su software altrui, sia esso un collega o uno sviluppatore di
una libreria opensource, trovata su Github, è affascinante.

## Il software giusto

Trovare un software che faccia code review al nostro post è una bella utopia.
Non esiste qualcosa che ragioni al posto nostro, anche se il commerciale del
vendor avrà detto _machine learning_ e _blockchain_, le buzzword che non devono
mai mancare nelle presentazioni del 2020.

Possiamo scegliere qualcosa che ci aiuti ed in questo caso dovremmo decidere se
sposare l'approccio dell'analisi del codice sorgente vero e proprio o del
bytecode compilato, quando possibile ovvero quando non stiamo analizzando
linguaggi interpretati come php o ruby.

L'approccio che a me piace di più è quello di analizzare l'output del
compilatore. In questo modo andrò a verificare quello che **effettivamente** è
in esecuzione in produzione, al netto di ottimizzazioni fatte dal compilatore
stesso.

## Cervello ed esperienza

Quello che poi fa la differenza, in un buon esperto di application security è
il suo cervello e quanta esperienza ha maturato leggendo, studiando e smontando
codice. Dopotutto, fare una code review e fare il reverse di un binario, non è
concettualmente differente. In quest'ottica appare chiaro come l'intervento
manuale è qualcosa di imprescindibile e analizzare un codice alla ricerca di
modi per poterlo bucare è tanto affascinante quanto analizzare un binario per
capire se è malevolo o no.

Come acquisto esperienza nella code review? Github o Gitlab sono pieni di
progetti opensource che non aspettano altro che specialisti e patch :)


Enjoy it!
