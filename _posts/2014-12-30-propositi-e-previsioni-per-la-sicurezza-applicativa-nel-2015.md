---
layout: post
title: "Propositi e previsioni per la sicurezza applicativa nel 2015"
promotion: "Come sarà il 2015 per l'#appsec? Tra #malware e #smartTV leggilo qui."
modified: 
category: [Chiacchiere da bar]
tags: [propositi, anno nuovo, sicurezza applicativa, previsioni, duemilaquindici]
image:
  feature: palle_2015.png
  credit: Doriano J.
  creditlink: https://flic.kr/p/7o6Zn7
comments: true
share: true
---

Oggi è il 29 Dicembre e mancano due giorni alla fine dell'anno. E' il classico
momento dove ci si ferma e si fa il punto di dove si è arrivati, come si è
arrivati e dove andremo l'anno prossimo.

Il 2014 è stato l'anno di lancio di [codiceinsicuro]({{site.url}}), con i post
sul fenomeno
[heartbleed]({{site.url}}/blog/heartbleed-parte-1-la-chiacchiera-da-pub/).
Scrivere regolarmente è decisamente difficile, un po' meno di scrivere in
inglese su [armoredcode.com](http://armoredcode.com) ma neanche poi molto[^1].

Il 2014 è stato un anno pieno di
[ransomware](http://en.wikipedia.org/wiki/Ransomware) con
[cryptolocker](http://it.wikipedia.org/wiki/CryptoLocker), cryptowall e
compagnia cantante. 

Ho visto PC di insospettabili, infettarsi per un click di troppo su di un
innocuo allegato PDF che parlava di una fattura proveniente da lidi esotici. Ho
visto siti di campioni con
[XSS](http://it.wikipedia.org/wiki/Cross-site_scripting) banali sulle pagine di
ricerca o su siti di [blasonati
enti]({{site.url}}/blog/i-cross-site-scripting-non-sono-tornati-sono-sempre-stati-qui/),
a proposito sto aspettando che lo sviluppatore mi dia retta prima di rendere
pubblico un xss su un plugin di wordpress. Il codice sarà pure open ma che
fatica rincorrere lo sviluppatore.

Ho visto siti blasonati cadere per una [SQL
Injection](http://it.wikipedia.org/wiki/SQL_injection) e nulla mi fa pensare
che le cose miglioreranno l'anno prossimo, anzi.

Da una parte il 2015 continuerà ad essere l'anno delle _web porcate_; codice
messo online senza il minimo testing e inesorabilmente bucato. Continueremo a
vedere meccanismi di login e gestione della sessione deboli e mal progettati,
continueranno a rimanere inascoltati i moniti di non reiventare la ruota ed
utilizzare framework ed algoritmi noti e robusti per gestire password, ruoli
delle utenze e reset password.

Dall'altra parte mi immagino il 2015 come l'anno dell'esplosione di malware e
attacchi mirati su Mac e Smart TV. Sinceramente non so spiegarmi perché
sentiamo l'urgenza di connettere una televisione ad Internet aggiungendo
intelligenza anche quando non serve. Ci sono aggeggi come
[roku](https://www.roku.com/),
[chromecast](https://www.google.it/chrome/devices/chromecast/), i decoder del
digitale terreste o del satellite, perché esporre un altro apparato,
difficilmente difendibile, su Internet?

Non lo so, ma secondo me non manca molto ad un articolo catastrofico sulla
carta straccia nazionale che racconta di televisione comandate da legioni di
_hackers malvagi_. Escludendo la scomoda domanda: ma chi ce l'ha messa quella
TV su Internet? Ma chi ha scritto quel software, prima di metterlo sulla TV
alla mercé di un consumatore qualsiasi, l'ha testato?

Il 2015 potrà essere anche l'anno dell'Internet of Things, altro brand
_marchettaro_ che ci vuole convincere che è estremamente figo e popolare essere
completamente connessi anche con dispositivi di domotica avanzata. Questo è
assolutamente vero, sogno una casa in montagna dove posso controllare il mio
riscaldamento con la mia applicazione... ma non se questo vuol dire esporre il
mio termostato con un IP pubblico.

> Il progresso deve andare di pari passo con una robusta progettazione,
> altrimenti significa andare avanti AC/DC[^2]

Spero molto che tutto l'entusiasmo verso startup, [silicon
valley](http://it.wikipedia.org/wiki/Silicon_Valley_\(serie_televisiva\)) e
[campioni digitali](http://digitalchampions.it) sia accompagnato ad una robusta
e sicura progettazione di servizi a valore aggiunto per le persone.

E' inutile buttare online un prodotto frutto di mesi di notti insonni, quando
il primo _script kiddie_, può distruggere il nostro business con uno dei tanti
tool sul web. E' inutile pensare di parlare di innovazione tecnologica di un
paese senza affrontare il tema della sicurezza, senza sensibilizzare gli utenti
sui rischi di condividere tutto sui social network o su cliccare
compulsivamente sulle richieste di gioco di Farmville o su quel bellissimo PDF
che parla di una fattura da pagare.

Il 2015 sarà ancora l'anno della convergenza dei tool di test per le
applicazioni web verso l'analisi ibrida del codice; analisi statica + test
dinamico. I tool che non supportano applicazioni mobile presto scompariranno
per selezione naturale, così come i tool che non offriranno API per integrarsi
con strumenti di altri vendor o per integrarsi con script fatti ad hoc.

Mi auguro di cuore che il 2015 sarà finalmente l'anno dell'awareness. La
security non può essere considerato un peso inutile su un progetto; è un
atteggiamento questo pericolo ed irresponsabile. Gli attacchi informatici
esistono e non interessa a nessuno attaccare una banca... tutti puntano ad
attaccare società generiche che fanno business.

Non ci credete? [Guardate cosa
succede](http://www.idtheftcenter.org/images/breach/ITRCBreachStatsReportSummary2014.pdf)
in America dove le aziende sono obbligate per legge a dichiarare quando
subiscono un'intrusione. Il report è aggiornato al 23 Dicembre e l'1,4% degli
attacchi andati a buon fine era rivolto al settore bancario e finanziario.
Ancora convinti che voi siete al sicuro perché non siete una banca?

Alla fine spero vivamente che il 2015 sia un felice anno per tutti voi
appassionati di sicurezza applicativa, hacker o smanettoni in genere. Spero lo
passiate imparando cose nuove e fiche.

Io surferò il mio nuovo trip l'analisi di malware e lavorerò a
[dawn](https://github.com/thesp0nge/dawn) e
[wordstress](https://github.com/thesp0nge/wordstress).

A tutti quanti, buon 2015... and enjoy!

[^1]: non ho più alibi per i _typo_ :-(
[^2]: A Cazzo di Cane, francesismo per ribadire bene il concetto.
