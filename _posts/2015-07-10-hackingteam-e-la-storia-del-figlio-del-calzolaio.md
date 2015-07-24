---
layout: post
title: "HackingTeam e la storia del figlio del calzolaio"
promotion: "Prologo all'analisi dei codici trafugati da HT. Perché il figlio del calzolaio ha sempre le scarpe rotte?"
modified: 
featured: true
category: [Under attack]
tags: [password banali, spionaggio, rcs, sudan, attacco informatico, apt, anonymous]
image:
  feature: hacked-team.png
  credit: The Internet
  creditlink:
comments: true
share: true
---

Lunedì mattina è scoppiata la bomba. Hanno bucato [Hacking
Team](http://www.hackingteam.com), la società milanese famosa in tutto il mondo
per aver creato una serie di software per l'intercettazione di attività
telematiche da remoto, o come direbbero i pennivendoli _cyber spioni_.

Tralasciamo le considerazioni etiche sul fatto di fare soldi con dittature del
terzo mondo che, sfruttano il controllo per la repressione delle persone con
idee politiche differenti. Tralasciamo le considerazioni legali di fare soldi
con un paese, come il Sudan, che è sotto embargo ONU.

Concentriamoci su un punto. Sei una società che si occupa di _offensive
security_, scrivi software che, dal punto di vista tecnico, è all'avanguardia e
ti fai sbragare rimanendo in braghe di tela?
Le password del tuo sysadmin senior erano veramente _Passw0rd!81_? Chi gli ha
fatto il colloquio era sotto acido? Non hai in campo un processo di verifica
periodica delle password di dominio?

Come sono entrati non lo sapremo mai. Io credo che le password deboli del loro
senior sysadmin non c'entrino e siano state trovate post intrusione. Questa a
me sembra un'azione di guerriglia informatica in piena regola e studiata a
tavolino.

L'attacco arriva infatti a ridosso di 3 eventi mediatici importanti:

* finale di Coppa America
* il voto Greco contro le condizioni economiche dell'UE in merito alla
  restituzione dei soldi prestati agli ellenici
* il viaggio del Papa in Sud America, il primo del suo pontificato

## Chi è stato e come ha fatto?

Io credo che fossero già dentro da un po'. Come ci possono essere entrati? Non
voglio pensare all'_insider_, al dipendente infedele. Voglio pensare ad un APT
scritto ad hoc per loro. Magari volto a colpire una persona vittima, nel
passato più prossimo, di un po' di social engineering. Voglio pensare, visto il
livello della gente lì dentro, se escludiamo il senior sysadmin, che la vittima
sia una persona che non si occupa di IT.

Da dentro magari hanno intercettato qualche password di accesso alla VPN, hanno
studiato la topologia della rete e, coperti da tre eventi, hanno attaccato e ci
siamo trovati lunedì mattina con 400 GB di leak in giro sui torrent.

L'attaccante sapeva dove andare a parare, è andato sui fileserver e si è preso
i contratti e le fatture dei software di controllo, oltre che ad una serie di
report di pentest fatti per loro clienti a cavallo tra il 2007 e il 2008.

Si è preso i codici sorgenti dei software per la sorveglianza. Possiamo farci
tutti il nostro Asfixya in tutta tranquillità.

La verità, come da manuale, non la sapremo mai. Quelle in questo post possono
essere belle supposizioni degne di un romanzo cyber, oppure potrebbero essere
una verità parziale o totale.

## Ma quindi, nessuno è veramente al sicuro?

Bravi. Se fino a domenica potevate avere qualche dubbio, adesso ve lo dovreste
essere tolti del tutto. **Nessuno** sul web è sicuro. Tutti sono potenziali
obbiettivi, tutti abbiamo dati che interessano a qualcuno. Alcuni più di altri.
Alcuni dovrebbero proteggere i propri dati con più paranoia di altri.

Di questa storia non dirò altro sul piano etico. Ognuno si fa la sua idea. Lì
fuori sul web ci sono intere conversazioni via email, screenshot di desktop,
foto rubate dalla cronologia di whatsapp (ci sono anche foto di minori, spero
nessuno faccia cazzate), contratti, fatture, ordini, preventivi, esito di
colloqui[^1].

Della notizia ne hanno parlato mirabilmente:

* [CSOOnline](http://www.csoonline.com/article/2943968/data-breach/hacking-team-hacked-attackers-claim-400gb-in-dumped-data.html)
* [The Hacker News](http://thehackernews.com/2015/07/Italian-hacking-team-software.html)
* [Reddit](https://www.reddit.com/r/technology/comments/3c9ay9/hacking_team_hacked_attackers_claim_400gb_in/)
* [Motherboard](http://motherboard.vice.com/read/spy-tech-company-hacking-team-gets-hacked)
* [The Verge](http://www.theverge.com/2015/7/6/8899861/hacking-team-hacked-security-leak)
* [The Guardian](http://www.theguardian.com/technology/2015/jul/06/hacking-team-hacked-firm-sold-spying-tools-to-repressive-regimes-documents-claim)

In Italiano come non citare:

* [Attivissimo 1](http://attivissimo.blogspot.it/2015/07/hacking-team-e-quei-link-youporn-una.html)
* [Attivissimo 2](http://attivissimo.blogspot.it/2015/07/perche-hacking-team-discuteva-di.html)
* [Attivissimo 3](http://attivissimo.blogspot.it/2015/07/e-finita-wikileaks-pubblica-un-milione.html)
* [LK](http://mgpf.it/2015/07/09/hackingteam-di-cosa-dovete-davvero-aver-paura.html)

I vari quotidiani Italiani stanno ancora cercando di capire cosa sia un leak di
dati e che lavoro facessero quelli di HackingTeam.

## Asphyxia

Voi tutti avete letto la [Trilogia Millennium](https://www.amazon.it/s/ref=as_li_ss_tl?_encoding=UTF8&camp=3370&creative=24114&field-keywords=trilogia%20millenium&linkCode=ur2&sprefix=trilogia%20millenium%2Caps%2C166&tag=codicinsic-21&url=search-alias%3Ddigital-text) di Stieg Larsson e sapete che
grazie ad [Asphyxia](http://www.stieglarsson.com/discussion-boards/salanders-hacking-program-5768405), un software di controllo non dissimile da RCS, Lisbet
Salander è riuscita a, bhé se non l'avete letto è meglio che non vi dica cosa è
riuscita a fare.

[Visto che ormai il codice di RCS è
online](https://github.com/hackedteam?tab=repositories) ho pensato che fosse
più in linea con [Codice Insicuro]({{site.url}}), una serie di post che
analizzano pezzo per pezzo, laddove possibile, quanto trafugato.

Quello che emerso da una prima occhiata ai repository, si può ricondurre RCS a
3 componenti principali:

* gli agent per le varie piattaforme. L'agent è la componente che fa il lavoro
  sporco, che si nasconde nel computer (o nel telefono) vittima e si mette a
  collezionare dati.
* soldier, ovvero la parte contenente gli exploit per bucare il computer
  vittima ed installare l'agent
* il backend di RCS

Partiremo ad analizzare il backend, per poi passare agli agent. La parte che
realizza l'exploit è quella un po' più ardua e credo che ci impiegherò un bel
po'...

## Off by one

> Passw0rd!81 da uno che si firma senior sysadmin non si può proprio vedere.

[^1]: mandai il CV ad HT nel 2004. Non mi facero mai neanche il primo
      colloquio. Ho cercato ma i dati non arrivavano a quell'epoca.
