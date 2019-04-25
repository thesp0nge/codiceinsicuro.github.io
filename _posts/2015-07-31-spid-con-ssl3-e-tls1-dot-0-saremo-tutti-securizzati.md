---
layout: post
author: thesp0nge
title: "SPID: con SSL3 e TLS1.0 saremo tutti securizzati"
promotion: "L'AGID dimostra che la strada è ancora lunga per avere servizi statili sul web disegnati in maniera sicura"
modified: 
featured: false
category: [Chiacchiere da bar]
tags: [ssl 3.0, tls 1.0, spid, agid, governo, banfa, cifratura, poodle, beast]
image:
  feature: stolen_identity.jpg
comments: true
share: true
---

Con fanfare, l'[AGID](http://www.agid.gov.it), l'Agenzia per l'Italia Digitale,
ha annunciato la partenza del progetto
[SPID](http://www.agid.gov.it/agenda-digitale/infrastrutture-architetture/spid),
il Sistema Pubblico per la gestione dell'Identità Digitale.

In pratica una sorta di centralizzazione del modo con cui noi, cittadini
italiani, potremo usare il web per interfacciarci con i servizi offerti dallo
Stato. Bello. In teoria molto bella l'idea. L'execution? Eh, già una FAQ mi
lascia molto perplesso dal punto di vista della security.

> B5: Confidenzialità degli scambi: possiamo assumere SSL 3.0 o TLS 1.0 obbligatorio?
>
> RB5: Il profilo SAML SSO raccomanda l’uso del protocollo TLS 1.0 nei colloqui
> tra Asserting party e le Relying party. Riteniamo in ambito SPID di rendere
> obbligatorio l’uso di un canale securizzato, consigliando l’impiego di
> protocolli TLS nella versione 1.0 o successive.

*NO, NO e ancora NO*

[SSLv3 ed il suo gemello diverso di poco, TLS1.0](http://disablessl3.com),
vanno disabilitati ed evitati come la peste. SSLv3 e TLS1.0 sono obsoleti da 15
anni e vulnerabili tra l'altro a
[Beast](https://kb.radware.com/Questions/SecurityAdvisory/Public/SSLv3-TLS-1-0-BEAST-vulnerability)
e [Poodle](https://www.poodlescan.com). Come si può inserirli in una FAQ
dicendo, quasi con vanto, che il canale _securizzato_ sarà garantito da una
versione di protocollo *obsoleta* e *vulnerabile*?

Questo non è neanche ingannare il cittadino. Questo è palesemente non avere
idea di cosa si sta facendo. Il numerino che porta la versione di TLS da 1.0 a
1.2 non è un vezzo, è la garanzia che almeno dal punto di vista trasmissivo le
cose sono fatte come Dio comanda.

Se manca questa sensibilizzazione nella scelta del protocollo, chissà cosa
succede se parliamo di sviluppo sicuro, linee guida di hardening, code review,
penetration test applicativo. Contando che si vuole gestire l'identità digitale
di 60 milioni di persone, siamo sicuri si possa condurre il progetto in maniera
così poco consapevole dal punto di vista della sicurezza del dato?

Io non credo proprio.

Citando [Mayhem](https://www.linkedin.com/in/mayhem), _"io sono preoccupato"_.
