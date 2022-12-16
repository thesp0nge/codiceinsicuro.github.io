---
id: 436
title: 'E se la soluzione al problema dell&#8217;antivirus fosse avere il codice open?'
date: '2022-04-04T12:57:20+02:00'
author: thesp0nge
excerpt: 'Il modello opensource, può rispondere all''esigenza di avere controllo da parte del governo e dei privati, per quanto riguarda una componente critica come l''antivirus? Secondo me sì. Leggi perché.'
layout: post
guid: 'https://codiceinsicuro.it/?p=436'
permalink: /2022/04/04/e-se-il-problema-dell-antivirus-fosse-avere-il-codice-open/
image: /wp-content/uploads/2022/04/1c5f88af9zu.jpg
categories:
    - Riflessioni
tags:
    - clamav
    - governo
    - kaspersky
    - opensource
    - virus
---

Sul mio profilo [LinkedIN](https://www.linkedin.com/in/paolo-perego) ho lanciato una provocazione, non fine a sé stessa: [supportare ClamAV come antivirus](https://www.linkedin.com/posts/paolo-perego_github-cisco-talosclamav-clamav-documentation-activity-6916672325501259776-6MFf?utm_source=linkedin_share&utm_medium=member_desktop_web).

Da quando è scoppiato il conflitto tra Russia ed Ucraina, [si parla spesso](https://codiceinsicuro.it/2022/03/23/di-antivirus-etica-e-rischi-pindaric/) del potenziale rischio che Kaspersky rappresenti per i paesi ostili a Mosca.

Non voglio tornare alla domanda “è veramente un rischio?” perché la risposta non è così netta, non è così facile da dare e perché non ho la sfera di cristallo. Va detto, che l’azienda russa, da anni consente ad università, governi e partner di [visionare il codice nella sua sede](https://www.kaspersky.com/transparency-center-offices) in Svizzera.

Se questo non ha rassicurato i Governi, tanto che quello Italiano ne ha annunciato la dismissione, mi domando: ha veramente senso affidarsi ancora a qualcosa di commerciale, il cui codice è chiuso?

Certo, scegliere un antivirus europeo, o comunque alleato, o magari italiano, potrebbe essere una soluzione. Tuttavia il codice è sempre chiuso, non sai quello che può fare, quindi di fatto le stesse critiche che sono state mosse finora a Kaspersky possono essere replicate.

## Modello opensource: problemi e soluzioni

### Il codice aperto

Problema numero uno: il codice dell’antivirus, che gira con privilegi elevati sui nostri sistemi, è chiuso e non sappiamo quello che fa. Benissimo, apriamo il codice quindi.

Il codice liberamente disponibile permette a ricercatori, auditor indipendenti e agenzie governative, di verificare che non siano presenti backdoor, killswitch o meccanismi che possano consentire la compromissione dell’endpoint.

### Mancanza di supporto

Effettivamente, le licenze opensource sono molto chiare: il codice lo prendi così com’è, non c’è un supporto o un helpdesk dietro. Non c’è chi fa dei servizi di post-vendita.

C’è solo la community. Questo vuol dire da una parte avere gente con passione che ci dedica del tempo e delle competenze, dall’altra però il tempo può mancare, le risorse possono mancare e quindi anche il supporto in termini di aggiornamenti. Questo però ci porta a…

### Le sponsorizzazioni

I progetti opensource più importanti, penso a Firefox, al kernel di Linux, a LibreOffice, non sono abbandonati a loro stessi ma ci sono realtà private che ne sponsorizzano lo sviluppo.

Prendiamo anche le principali di distribuzioni Linux: accanto a versioni destinate al mondo enterprise, dove il codice del pacchetto opensource è lo stesso, ma vengono cambiate configurazioni e vengono forniti servizi a valore aggiunto, previo pagamento di una fee, ci sono versioni completamente prive di un supporto ufficiale ma praticamente gestite di fatto dalla community, spesso con l’aiuto di dipendenti di queste società che partecipano attivamente alle versioni open.

In particolare [ClamAV](https://www.clamav.net/), il principale antivirus opensource, ha alle spalle il gruppo [Talos Intelligence](https://talosintelligence.com/), parte di Cisco.

### Ok, ma quindi… nel concreto?

La PA sta sostituendo un antivirus e sta suggerendo alle PMI, alle accademie e ai privati di fare lo stesso. Perché non investire i fondi destinati a comprare un altro software chiudo e supportare un progetto come ClamAV? Nulla vieterebbe poi a società di consulenza o ad esempio all’agenzia che governa la sicurezza informatica in Italia, di offrire supporto, essendo parte attiva dello sviluppo stesso.

Investire quindi soldi in un progetto come questo, porterebbe a:

- avere un antivirus dal codice open, su cui si possa fare audit e su cui si possano fare build riproducibili del software
- creare lavoro in termini di team di specialisti dedicati allo sviluppo o alla gestione delle firme ad esempio
- aiutare la comunità opensource ed in generale la comunità internazionale, rendendo bene comune un software così critico

### Off by one

Mi rendo conto che la mia riflessione sia migliorabile e prenda di petto il problema. Mi piacerebbe si alimentasse un’accesa discussione sui punti e soprattutto su come i soldi pubblici possano essere utilizzati, finanziando un progetto che porta benefici a tutti, sia come utilizzatori che come persone che si affacciano al mondo del lavoro che quindi possano venir pagate per contribuire a questo antivirus.

Lasciami un commento per dirmi cosa ne pensi e cosa secondo te potrebbe essere migliorato.

Non vedo l’ora di leggere la tua opinione.

Enjoy it!
