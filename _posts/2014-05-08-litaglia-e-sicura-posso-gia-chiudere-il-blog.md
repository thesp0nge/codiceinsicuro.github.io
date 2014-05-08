---
layout: post
title: "L'ItaGLia è sicura. Posso già chiudere il blog"
modified: 2014-05-08 08:13:44 +0200
category: [builders]
tags: [sicurezza, banfa, media, interviste, carrier, ddos, sicurezza perimetrale, chiacchiere, sha7, daje, owasp, owasp italy, owasp day]
image:
  feature: italia_sicura.jpg
  credit: Kiki Hood
  creditlink: https://flic.kr/p/5yunZJ
comments: true
share: true
---

Quella nel titolo, è pura ironia, l'Italia informaticamente parlando non ha
vinto il palmares della security e no, il neonato
[codiceinsicuro]({{site.url}}) non chiude.

E' successo che questa mattina vedessi
[un'intervista](http://www.lineaedp.it/news/11073/litalia-supera-lesame-sicurezza/)
ad un IT Manager di un importante carrier italiano. Questi affermava che
l'Italia era sicura, che esistevano straordinarie misure di protezione contro i
_denial of service_ distribuiti e altre amenità.

Sicuramente la pessima informazione che i media fanno in questo settore, con la
scusa di dover parlare a persone con un livello tecnico basso[^1], contribuisce
a rendere il nostro Paese, altro che sicuro... lo rende lo zimbello del mondo
in campo tecnologico.

Sicuramente esportare al mondo storie come quella dell'invezione di
[sha7: l'algoritmo di cifratura più sicura del
mondo](http://italiainnovatori.gov.it/en/innovations/sha-7-2/), con tanto di
comunità italiana delle startup in fermento per tanto concentrato di fuffa, non
rende la nostra immagine come quella di un Paese che è pieno di gente capace
che di tecnologia ne capisce davvero.

In realtà, l'intervista è un puro spot marketing per vendere i servizi di
security offerti dal carrier. Ci potrebbe stare se venduta per quello che è,
ovvero una descrizione dei servizi offerti e _bla bla bla_ ma sparare il titolo
sensazionalistico che l'Italia supera l'esame della sicurezza è **pura**
**disinformazione**.

Fa passare il messaggio che la security all'interno delle aziende non serve
perché tanto c'è il carrier che ci protegge dai DDOS.

> Quante aziende hanno al proprio interno un processo consolidato di
> Vulnerability Management? Quante aziende hanno al proprio interno un processo
> di protezione della postazione di lavoro? Quante aziende fanno regolarmente e
> fanno fare ai propri outsource, penetration test applicativi e code review
> sulle applicazioni web che vengono pubblicate?

La sicurezza non è comprare un prodotto o fare un'attività _una tantum_ di
verifica. Se installi Nessus, ovviamente la versione free mica vorremmo far
spendere soldi all'azienda per il proprio bene, e fai una scansione un paio di
volte all'anno non stai facendo vulnerability management. In realtà non lo fai
neanche se lo fai girare una volta al giorno, a meno che poi tu strutturi il
report e fai scatenare delle attività di patching mirato a fronte delle
vulnerabilità più critiche.

Questo concetto non riesce proprio a fare breccia né nell'IT Manager Italiano
medio, né nella stampa (sia quella generalista che sta ancora in piena crisi
[Heartbleed](http://heartbleed.com), sia quella specialistica rivolta ai
decision maker).

L'IT Manager non è opportunamente guidato, a mio avviso per decidere cosa deve
chiedere alla propria struttura interna di information security. Ehi, non è uno
stupido, se gli spieghi rischi e benefici anche senza scendere in tecnicismi è
mille volte meglio di propinargli l'ennesima sbobba markettara[^2].

## Le conferenze di settore

Cartina al tornasole di quanto ci piace indorarci la pillola autoproclamandoci
ed autoacclamandoci sono le conferenze di settore, o almeno la maggior parte di
esse.

Spesso organizzate in lussuosi hotel dove regna lo sfarzo e dove l'ergonomia,
la connettività garantita, l'acustica della sala, la logistica tutte
caratteristiche che non riescono ad avere il sopravvento rispetto a due cose
che l'italiota medio ritiene fondamentali:

* le hostess, possibilmente carine e ancor più possibilmente scollate
* abbondante catering

Avere track di formazione qualche giorno prima dei talk? Chissenefrega. Avere
dei talk di approfondimento tecnico? Secondario, vuoi mettere se al desk ad
accogliere il panzuto IT Manager non c'è il sosia di Drew Barrimore?

Gli argomenti ultimamente sono sempre gli stessi:
* la sicurezza nel cloud
* Identity and Access Management (IAM per gli amici)
* il dark web, perché alla fine non posso esagerare con la scollatura quindi
  devo dare un po' di fantapolitica, un po' di cybercrime.

Per carità, il problema della criminalità organizzata in Internet o delle
cyberwar è **molto più che serio**. Ma noi qui siamo ancora allo stadio di
avere database pubblicati sui server web aziendali in DMZ o altre porcate
simili tipo memorizzare password in chiaro.

C'è poi una cosa spesso molto curiosa. Le conferenze di security sono fatte da
persone di security, per persone di security o male che vada qualche talk
markettaro per accaparrarsi i clienti. Di sviluppatori, pochi o non pervenuti.

> Com'è possibile che io possa costruire una buona cultura di sviluppo sicuro
> se non vado alle conferenze di sviluppatori a parlare di security con il
> linguaggio degli sviluppatori?

Secondo me l'interlocutore per parlare di vulnerabilità web è chi il codice web
lo mette online, chi lo scrive. Ed è quello che accade all'estero dove spesso
sono gli stessi sviluppatori a raggiungere un livello tale da poter parlare di
security e di come implementano la security nel loro codice.

Sicuramente sulle conferenze e sui talk ci tornerò spesso qui sul blog.

## Il prossimo Owasp Day è a Genova

Diverso, ma potrei essere di parte in quanto faccio parte del [board di Owasp
Italia](http://www.owasp.org/index.php/Italy) è il taglio che viene dato agli
Owasp Day che vengono organizzati.

Quello organizzato al volo da Matteo Meucci, chair di Owasp Italia, si svolgerà
tra una settimana, il [14 Maggio a
Genova](https://owasp.org/index.php/Italy_OWASP_Day_2014_Genova). Vista anche
la presenza importante di Gary McGraw e vista l'organizzazione [nell'Ateneo
della città ligure](http://www.dibris.unige.it/) che patrocina l'evento,
suggerisco a tutte le persone che scrivono codice, che gestiscono server, che
sono security manager, che sono IT Manager o che hanno a che fare in qualche
modo con codice web rilasciato, di partecipare ad eventi come questi.

[^1]: se io conosco un argomento bene ed il mio mestiere è scrivere allora sono
      in grado di usare il linguaggio appropriato per far comprendere a tutti un
      concetto senza scendere in tecnicismi. Se io non conosco un argomento, scrivo
      una marea di stronzate nascondendomi dietro alla scusa di dover essere il più
      generale possibile. Questa può essere la definizione dell'informazione su temi
      tecnologici (o scientifici in generale) di molti media.

[^2]: ho promesso un blog di application security, non un blog politically correct.
