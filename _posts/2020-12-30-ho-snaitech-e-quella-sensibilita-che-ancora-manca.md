---
layout: post
title: "Ho, Snaitech e quella sensibilità che ancora manca"
author: thesp0nge
featured: false
category: [post]
tags: [data leak, data breach, project management, investimenti, serietà, blueteam, redteam]
image:
   feature: data-leak.jpg
   author_id: "@daanmooij"
   author_name: Daan Mooij 
   author_link: https://unsplash.com/s/photos/leak
   link:
comments: true
share: true
---

[Snaitech](https://tecnologia.libero.it/snai-down-e-stato-un-attacco-hacker-41580)
e [l'operatore mobile
Ho.](https://www.wired.it/internet/tlc/2020/12/29/ho-mobile-database/) sono
state le ultime vittime in ordine di tempo di attacchi informatici o comunque
di fughe di dati.

Mentre nel caso di Snaitech sembra trattarsi del solito DDos, nel caso di Ho.,
la fuga di dati potrebbe essere stata realizzata attraverso un'API [realizzata
in maniera poco
robusta.](https://www.dday.it/redazione/38025/ho-mobile-e-il-presunto-furto-di-dati-i-dubbi-e-le-certezze-quello-che-sappiamo-fino-ad-oggi)

## Empatia

Condizionali a parte, mettiamo subito una cosa in chiaro. La community in casi
come questi dovrebbe essere più solidale con la vittima di un attacco. 

Non solo potrebbe capitare a tutti, oppure è già capitato e neanche ce ne siamo
accorti, ma bisogna sempre ricordare che dall'altra parte ci sono
professionisti che tutto meritano tranne che andare alla gogna, anche perché in
molti casi sono gli ultimi a doversi prendere la colpa.

## Vizi italici e non solo

Veniamo a qualcosa che vediamo spesso nei progetti IT in giro per il mondo o
per diretta esperienza o per i racconti di amici e colleghi.

1. Il progetto ha delle scadenze irrealizzabili decise a tavolino da persone
   non tecniche, non in grado quindi di stimare lo sforzo necessario ad
   implementare un servizio webo mobile.
2. L'appalto per lo sviluppo non viene dato ai migliori ma a chi poi mi farà un
   favore / ad un amico manager / a chi mi costa meno. Già, l'approccio del "me
   lo fa mio cugino" è purtroppo molto diffuso e i risultati a cui porta è codice
   non sviluppato adeguatamente, mal progettato e soprattutto non testato
   adeguatamente. 
3. Io non voglio disservizi, quindi apparati come Intrusion Prevention System o
   WAF li tengo spenti, sempre se esistono.
4. I penetration test affidati a chi può uscire con tariffe da 100 euro al
   giorno. Dopotutto, il poco budget a disposizione per un progetto i cui
   penetration test sono emersi solo in corso d'opera, non permette di affidarsi a
   quelle 3/4 società italiane per i quali qualche euro in più valgono tantissimo.

Quindi, poco tempo a disposizione, pianificazioni errate e corsa al risparmio.
Questi i tre vizi capitali che portano un progetto software alla ribalta delle
cronache per essere stati oggetto di un attacco criminale.

## Off by one

Quale il compito di chi fa application security in azienda? Sensibilizzare,
parlare, creare una cultura aziendale per far capire che la security ha un
costo non più negoziabile all'interno di un progetto IT.

Certo, noi abbiamo anche il dovere di pensare gli sforzi, come linee guida di
sviluppo o API robuste, in maniera tale che siano riutilizzabili in modo da
spalmare il costo per l'hardening su più progetti.
Awareness e automazione quindi. Cercare di introdurre code review _light_ o
assessment per vulnerabilità macroscopiche, che possano essere fatte da uno
strumento, mentre l'effort insostituibile di un professionista deve essere
speso per un'analisi approfondita, per evitare che un attaccante poi possa
farvi fare una magra figura sul mercato.

Insomma, basta andare al risparmio.
Enjoy it!
