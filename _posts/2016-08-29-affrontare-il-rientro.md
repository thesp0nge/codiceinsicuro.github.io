---
layout: post
author: thesp0nge
title: "Affrontare il rientro"
promotion: "Eccoci dopo un'altra estate ad affrontare il rientro, tra progetti e talk da preparare"
modified: 
featured: false
category: [post]
tags: [appsec, pipeline, dawnscanner, talk, conferenze, rientro, estate, vacanze]
image:
  feature: rientro.jpg
comments: true
share: true
---

Estate 2016, archiviata. Dopo un tour di più di 5000 km, tra punta e tacco
d'Italia, con un FAP intasato fino al midollo, una febbre e 0 sport, eccomi
giunto al rientro. Torniamo a proteggere il codice un quarto di byte alla
volta.

Quest'anno, sapendo di rientrare di lunedì, ho puntato tutto sul lasciare la
mia inbox in ordine alla partenza. Ogni tanto davo un'occhiata alle email e già
so che tra qualche ora il mio mal di testa crescerà a dismisura.

Sarà un autunno con un talk al mese. Partiamo a fine Settembre, con
l'[evento](http://www.isaca.org/chapters5/Venice/Events/Pages/Page12.aspx) organizzato da [ISACA](http://www.isaca.org/) a Venezia, passiamo per Ottobre con
_evento figo_ per finire a Novembre con [Codemotion Milano](http://milan2016.codemotionworld.com/). In tutti e 3
gli eventi, parlerò di [_application security pipeline_](https://www.owasp.org/index.php/OWASP_AppSec_Pipeline), toccando più o
meno nel dettaglio aspetti tecnici e cose nerd.

Accanto a [dawnscanner](https://dawnscanner.org) ho deciso di riprendere in
mano il codice di [Owasp Orizon](https://www.owasp.org/index.php/Category:OWASP_Orizon_Project). Ci ho pensato su tanto, nel nostro mondo,
sono pochi i tool di code review per Java che siano opensource, quindi iniziamo
subito col dire che toglierò il supporto a PHP, che pure era in fase molto
embrionale.

Rispetto al me stesso di 6 anni fa, tanti gli anni passati dagli ultimi commit
al repository, che nelle funzionalità è fermo da ben oltre, ho maturato la
convinzione che stessi sbagliando completamente approccio.

Mi sforzavo di voler costruire un parser per java, per analizzare il codice
sorgente e non il bytecode compilato. Avevo la forte convinzione che dovessi
dedicarmi al sorgente, perché non potevo analizzare un bytecode generato "non
sapevo bene come". Tuttavia, in esecuzione, c'è proprio quel bytecode ed è
quello, con le ottimizzazioni random del compilatore, che deve essere testato.
Lo so, a leggerla così è una conclusione banale, ma ero proprio convinto su
quella strada all'epoca.

Cosa più importante, partirò dall'analisi di APK. Devo ancora decidere se
cambiare il nome o lasciare quello originale.

Un rientro quindi tra grandi progetti, tre talk da preparare e questo blog da
ristrutturare a livello di layout. Avrei dovuto farlo in estate, ma me la sono
proprio voluta godere.

Enjoy it!
