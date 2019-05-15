---
layout: post
author: thesp0nge
title: "3 cose che devi avere per partire con una application security pipeline"
promotion: "Per iniziare la costruzione di una pipeline di sicurezza applicativa devi partire da queste 3 cose."
modified: 
featured: true
category: [Chiacchiere da bar]
tags: [appsec pipe, tools, api, processi]
image:
  feature: pipeline.jpg
comments: true
share: true
---

Non so se vi siete accorti che quella della sicurezza applicativa è una
battaglia persa in partenza se continuiamo ad approcciarla come stiamo facendo
negli ultimi anni.

Facciamo un penetration test al rilascio, quando va bene e diamo a noi stessi e
ai nostri clienti, la percezione, sbagliata, che vada tutto bene così.

Spesso il prodotto finale, in un mercato immateriale come quello del web, è una
beta perpetua con rilasci quotidiani. Come la affronti dal punto di vista della
security? Negli anni ho notato 2 approcci, sbagliati in egual misura.

Il primo è quello di ignorare il problema. Inutile girarci attorno. Molte
persone, ignorano il problema della sicurezza del proprio prodotto web.
Immagina di essere uno sviluppatore, impieghi tempo per cercarti una commessa,
tempo per sviluppare il prodotto, tempo per farne il deploy e dopo un po'
qualcuno lo viola. Certo, puoi dare la colpa all'_hacker_ cattivo, come mi è
capitato di leggere in una discussione in nella pagina Facebook dei [Veteran
Unix Admins](https://www.facebook.com/groups/VeteranUnixAdmins/). In realtà, la
colpa è tua e tua solamente. Viviamo in un mondo dove la gente vuol sentirsi
dire solo cose belle, quindi ho già perso 20 lettori con l'affermazione
precedente, ma è la realtà dei fatti: se ti bucano, perché non hai testato il
tuo codice o perché non hai applicato delle patch di security, al netto che chi
lo fa compie un reato, è colpa tua.

Il secondo è quello di limitarsi ad un test con un tool automatico di
scansione, sostanzialmente per contenere i costi, ed accontentarsi del report
in PDF che viene generato in automatico. Questo approccio al problema, da solo
un falso senso di sicurezza. Quello strumento, in quanto tale, rileva alcune
cose mentre tutta la parte legata alla logica applicativa ad esempio, non è in
grado di verificarla.

Personalmente, mi sono avvicinato all'approccio della pipeline, proprio per
superare il modello fin qui usato per introdurre la sicurezza nel ciclo di vita
del software. E quando sono partito, l'ho fatto da questi 3 punti principali.

## Un processo condiviso

Senza regole non si va da nessuna parte. Avendo girato un po', nel corso degli
anni, ne ho visti di team e di situazioni al limite del surreale. Quando hai,
ad esempio, una ventina di sviluppatori, che portano avanti il loro lavoro
quotidiano senza una linea guida, senza una metodologia, è letteralmente
**impossibile** introdurre la sicurezza.

Bisogna partire quindi dal definire le regole del gioco. Lo si fa partendo dal
conoscere i giocatori, che nel nostro caso sono sviluppatori, sistemisti o
devops se le due figure coincidono. Come lavorano? Come sono strutturati? Dove
sono i sorgenti? Come sono creati i server? Quale il processo di gestione delle
macchine? Quanto spesso vengono patchate?

> se ti bucano, perché non hai testato il tuo codice o perché non hai applicato
> delle patch di security, al netto che chi lo fa compie un reato, è colpa tua.

Questo è quello che ho fatto io ad esempio. Sono sempre partito dalle
interviste, quando ho dovuto creare un competence centre di sicurezza
applicativa. Una volta che hai in mano il tuo contesto, è _relativamente_
facile introdurre la sicurezza.

Ricorda che sei tu che vuoi introdurti nel loro modo di lavorare, quindi sei tu
che devi il più possibile adattarti a loro, non viceversa. Andare a muso duro,
pretendendo che facciano la security perfetta sbattendo i pugni sul tavolo, ti
porta solo grande frustrazione e ti fa perdere a partita.

Una volta che hai costruito il tuo processo di application security, che
comprende hardening delle macchine, dei database, degli application server e
del codice, fai in modo che sia avallato da tutti gli attori in gioco.
Portare casi di insuccesso, come qualche recente violazione di siti famosi, di
solito fa capire che stai cercando di migliorare il loro modo di lavorare e,
soprattutto, di evitare che siano loro i prossimi a finire derisi sul web.

## Un ecosistema di strumenti

Se la vostra speranza cade in un tool che faccia tutto, allora state guardando
il problema dal punto di vista sbagliato. Vi servono tanti strumenti, spesso
simili tra di loro. Pescate nel mare dell'opensource, non affidatevi solo al
blasone commerciale.

Su questo punto c'è da scrivere un papiro. Ci saranno post su post
sull'ecosistema degli strumenti, su cosa uso io e su cosa consiglio. La cosa
più importante è che questi strumenti abbiano API o comunque possano produrre
degli output che siano consumabili da un software che funga da direttore
d'orchestra, che aggreghi i risultati e ve li presenti. Può essere un SIEM, può
essere Splunk o può essere una cosa custom sviluppata in casa. La cosa
importante è che abbiate una dashboard unica che vi permetta di monitorare
tutti gli aspetti del vostro processo di application security.

## Un team

Per mettere in piedi una pipeline di application security, servono un paio di
figure con una discreta seniority in grado di governare l'output degli
strumenti ed integrarlo con dei test, che mi piace definire _boutique_.

Dico da sempre che un tool non può fare tutto da solo, e vale anche all'interno
della pipeline. Lo strumento deve essere integrato da persone competenti che ne
sappiano integrare i risultati e, **soprattutto** che li sappiano esporre.

Il saper esporre, il saper scrivere un buon report è qualcosa di dannatamente
sottovalutato. Ci esaltiamo tutti per una SQL Injection, ma il verò successo è
quando la sappiamo raccontare ad un non adetto ai lavori, mostrando i pericoli
che nasconde. Questo è il successo del nostro lavoro.

## Off by one

Questo è quello che ho sempre cercato quando sono stato chiamato a costurire
una pipeline o comunque un competence centre di sicurezza applicativa. Da
questi tre pilastri si può iniziare a costurire qualcosa di sensato. Provateci
e ditemi cosa ne pensate.

I prossimi 3 talk che farò questo autunno saranno tutti dedicati alla pipeline.
A breve sul blog metterò le date, così potremo confrontarci dal vivo su questo
tema.
Nel frattempo, buone vacanze!

Enjoy it!
