---
layout: post
title: "log4shell: la catastrofe informatica corre sui log"
author: thesp0nge
featured: true
category: [post]
tags: [log4j, librerie di terze parti, governance, log4shell, cve-2021-44228]
image:
   feature: good_vibes.jpg
   author_id: markadriane
   author_name: MARK ADRIANE
   author_link: https://unsplash.com/@markadriane
   link: https://unsplash.com/collections/569583
comments: true
share: true
---

Mettere un titolo sensazionalistico e _clickbait_ è una sensazione abbastanza
gratificante. Ok, smettiamola, torniamo seri.

Buongiorno Insicuri, a meno che voi non siate in un settore professionale
diverso dall'IT, da venerdì state prendendo confidenza con tre paroline: log4j,
RCE e [CVE-2021-44228](https://cve.mitre.org/cgi-bin/cvename.cgi?name=2021-44228).
Non abbiamo un sito o un logo fichissimo come per shellshock o poodle o
heartbleed, ma questa promette di essere **veramente** la grana di sicurezza
più grossa da un po' di tempo a questa parte.

[log4j](https://logging.apache.org/log4j/2.x/) è una libreria opensource che
offre una API per implementare funzionalità di logging per applicazioni Java.
Essendo lo standard _de facto_, se hai un'applicazione j2ee probabilmente log4j
si sta prendendo cura di stampare messaggi di log su file, syslog o db.

La vulnerabilità può essere sfruttata se l'attaccante è in grado di controllare
cosa viene stampato nei log. Passando come parametro, ad un'applicazione web
vulnerabile, una espressione JNDI, il codice della libreria interpreterà la
stessa come codice da eseguire e non come stringa da stampare.

Al netto quindi della vulnerabilità di log4j, se la vostra applicazione web,
scrive dei log solo stringhe statiche o stringhe che vedono i parametri della
querystring (o degli header) sanitizzati, allora un attaccante potrebbe non
essere in grado di sfruttarla.

Se la versione di log4j che utilizzate è superiore o uguale alla 2.15, allora
siete salvi. Questa chiamata automatica JNDI è disabilitata per default, così
come, nelle versioni vulnerabili, potete **mitigare** la vulnerabilità con
questa impostazione nei _settings_:

``` java
log4j2.formatMsgNoLookups=true
```

Potete anche cambiare la linea di comando della vostra applicazione Java,
passando questa impostazione come parametro all'interprete:

``` sh
java -Dlog4j2.formatMsgNoLookups=true -jar myapp.jar
```

Il consiglio comunque che raccomandano tutti e al quale mi associo è quello di
aggiornare la libreria. Questo è un consiglio che vale però sempre, a
prescindere dal problema di questi giorni.

Vi lascio un interessante
[post](https://news.sophos.com/en-us/2021/12/12/log4shell-hell-anatomy-of-an-exploit-outbreak/)
di Sophos che vale la pena leggere circa la spiegazione tecnica di come viene
portato l'attacco.

## Cosa possiamo imparare da log4j?

Dunque, sia che noi siamo sviluppatori, capi progetto, security manager o gente
che fa application security per campare, dobbiamo ricordarci che installare un
JAR e abbandonarlo alla sua morte lenta perché "tanto l'applicazione funziona"
è un boomerang che ci torna indietro prima o poi.

Fare application security significa andare a lavorare a stretto contatto con i
team di sviluppo, significa essere nel loro team, partecipare ai meeting,
creare una relazione di fiducia con loro, fare un censimento delle tecnologie
utilizzate ed aiutare gli sviluppatori a tenere le librerie aggiornate.

Significa che il codice noi lo dobbiamo capire e ci dobbiamo lavorare sopra,
cari lettori insicuri. Fare la "saiber" dalla nostra scrivania o dal palco di
una conferenza è troppo comodo ed anche parecchio inutile. Più siamo vicini a
quello che dobbiamo proteggere, meglio lo faremo.

Spero poi che questo esempio dia il colpo di grazia a tutti quelli che ripetono
a pappagallo "è opensource, quindi è sicuro" e magari non hanno mai fatto una
piccola code review in vita loro.

A te, fanboy della GPL, se riesci a trasformare la frase in "Essendo
opensource, ho potuto fare una code review e quindi secondo me è sicuro",
allora finalmente dirai qualcosa di sensato e soprattutto avrai colto la vera
essenza sia della GPL che dell'opensource.

log4shell quindi è una catastrofe informatica? Bhé sì, è un vaso di Pandora che
si è scoperchiato a fronte della mancanza di governance sui processi di
sviluppo del software. Ci vorrà del tempo per correggere tutte le applicazioni,
magari quelle più interne o dimenticate.

Spero però che tutti possiamo imparare qualcosa in più su come dovremmo
proteggere il nostro fortino.

Enjoy it!
