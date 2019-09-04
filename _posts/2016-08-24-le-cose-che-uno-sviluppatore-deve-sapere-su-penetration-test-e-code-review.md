---
layout: post
author: thesp0nge
title: "Le cose che uno sviluppatore deve sapere su penetration test e code review"
promotion: "Spesso chi subisce un penetration test o una code review, commette errori che invalidano i risultati dei test. Vediamo cosa non va mai fatto."
modified: 
featured: false
category: [Post]
tags: [appsec, sviluppatori, penetration test, code review, pipeline]
image:
  feature: review.jpg
comments: true
share: true
---

Ormai i serial come CSI, NCIS o quelli nostrani sul RIS, sono entrati
nell'immaginario collettivo. Fin dai tempi del tenente Colombo, sappiamo che la
scena di un crimine può essere facilmente inquinata se qualcosa viene toccato o
modificato. Una volta inquinata, la scena del crimine non è più in grado di
permetterci di risalire alla dinamica degli accadimenti, non facilmente almeno.

Ecco, nella sicurezza applicativa lo stesso si può dire con penetration test e
code review. Se cambiano alcune cose durante i test, è come se qualcuno avesse
inquinato la scena di un crimine, i test perdono di validità e così i
risultati.

## Code review

Vediamo l'esempio più semplice e che forse è più facilmente comprensibile.
L'analisi del codice, per trovare issue di security, fotografa lo stato di
un'applicazione in un certo istante, quello del checkout dal repository che si
sta analizzando.

Se cambia il codice, perché vengono fatti dei commit, è chiaro come i test
possano perdere di efficacia. Quello che è stato testato, non è più quello nel
repository del codice, quindi i risultati non sono più attendibili.

> Gli sviluppatori poi, di fronte alle sacrosante lamentele, ti guardano con
> gli occhi *alla Bambi* dicendo *"ah ma dovevi testare anche questa?"*.

Quando lo spiego nel quotidiano, mi sento dare, come giustificazione un po'
scocciata, che in fondo è cambiato poco e in altri punti rispetto ai risultati
che ho presentato dopo l'analisi. Quello che non riesco a far capire, o forse
che il team di sviluppo non vuole capire, è che il codice è tutto collegato ed
una modifica in un punto può avere effetti ed impatti anche in altre porzioni
dell'applicazione.

Morale della favola. Durante una code review, il codice deve rimanere fermo. Se
il codice cambia, i test devono essere eseguiti di nuovo.

## Penetration test applicativo

Qui ci si sbizzarisce. L'ambiente di test spesso non esiste e quando esiste
spesso non è allineato con quello di produzione. Catene diverse. I dati non
passano attraverso WAF con la giusta configurazione; non ci sono firewall o
quelli che ci sono sono virtuali invece che fisici; i web server non sono gli
stessi e ci sono modifiche *ad hoc* alla configurazione per gestire i test.

Fare test in questi scenari è inutile, assolutamente **inutile**.

Da una parte appare chiaro come non si possano sporcare i dati della produzione
con test di security, dall'altra parte ci si chiede se e come sono stati fatti
i più banali test funzionali visto che lo scenario è differente da quanto in
esercizio.

Qui la sensibilità di chi fa sviluppo è ai minimi storici. Ogni tanto salta
fuori un particolare controllo fatto solo in un ambiente o qualche pagina di
amministrazione che non esiste in ambiente di test e viceversa. Gli
sviluppatori poi, di fronte alle sacrosante lamentele, ti guardano con gli
occhi *alla Bambi* dicendo *"ah ma dovevi testare anche questa?"*.

> La risposta che un team di sicurezza applicativa deve dare, deve essere il
> più vicino al **realtime** possibile.

Il penetration test applicativo ha lo scopo di simulare l'attività di un
attaccante, umano o software, che trovato un link, lo segue e prova differenti
tecniche di iniezione. Eventuali percorsi non referenziati, non sono al sicuro:
semplicemente l'attaccante dovrà lanciare qualche strumento per il bruteforce
delle directory. Il problema è che lo sviluppatore o il sistemista medio,
sottovaluta **di molto** quelle che possono essere le armi in dotazione di un
attaccante.

Morale della favola. Un penetration test applicativo va fatto in uno scenario
**esattamente uguale** a quello presente in produzione. Dovrebbe essere la
norma per gli UAT, figuriamoci per i test di security.

## Non siamo però sempre dalla parte della ragione

La security però non è sempre dalla parte della ragione, anzi da anni sta dando
una risposta a mio avviso sbagliata, ai problemi dei team di sviluppo e
operation. Se è vero che per la code review serve il codice fermo, è anche vero
che spesso, visti i time to market sempre più pressanti, questa condizione non
accade **MAI** e solitamente il tempo richiesto per una code review, un paio di
settimane, semplicemente **non è accettabile**.

Per i penetration test, il discorso è già diverso. Si può lavorare durante gli
UAT, anche se meglio lavorare in produzione e fornire un output il prima
possibile. Il test dovrebbe poi essere fatto sia con le difese (firewall
tradizionali ed applicativi) alzate, che senza alcuna barriera. Questo permette
al team di test di capire se ci sono della vulnerabilità reali, per le quali
viene fatto _virtual patching_ o se veramente il codice è robusto da un punto
di vista di security.

La risposta che un team di sicurezza applicativa deve dare, deve essere il più
vicino al **realtime** possibile. Un paio di giorni per i test ed un paio per i
risultati, non di più. Questo risultato si può raggiungere solo applicando la
costruzione di una pipeline di security, che spalma i controlli nel tempo,
lungo tutta la filiera di sviluppo.

Approcciare il test come fatto fino ad ora, non porta benefici al cliente. Poi
chiaramente, per il portale che verrà modificato un paio di volte l'anno, ha
senso fare un test alla fine dello sviluppo, ma pensiamo ad un applicazione
mobile o ad un portale che ha un paio di rilasci a settimana... in questo caso,
come vogliamo comportarci? Se non cambiamo il nostro approccio, non potremo mai
dare una risposta a questa tipologia di clientela più dinamica, quindi avremo
sempre fallito il nostro obiettivo: avere un web più sicuro.

Enjoy it!
