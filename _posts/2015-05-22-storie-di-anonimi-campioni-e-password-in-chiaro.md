---
layout: post
author: thesp0nge
title: "Storie di Anonimi, Campioni e password in chiaro"
promotion: Tra attacchi di cellule nostrane di Anonymous e campioni che non campionano, spuntano ancora password in chiaro.
modified: 
featured: false
category: [Under attack]
tags: [anonymous, digital champions, PA, expo, siti governativi, banfa, password in chiaro]
image:
  feature: anon.jpg
comments: true
share: true
---

Nei giorni scorsi, [la parte italiana di Anonymous](http://anon-news.blogspot.it) ha fatto parlare di sè
per due scorribande, rispettivamente al Ministero della Difesa e ad uno dei
siti dell'[Expo 2015](http://www.expo2015.org/it).

In una loro comunicazione, emerge l'ennesimo caso di software commissionato, in
fretta e furia, a incapaci in grado di partorire un portale di ticketing che
[salva le password degli utenti in chiaro nel database](https://twitter.com/OperationItaly/status/599607756681781249). [Come abbiamo
visto]({{site.url}}/blog/costruiamo-un-sistema-di-autenticazione-con-sinatra-e-warden-parte-1/)
qualche giorno fa, è veramente semplice cifrare in maniera robusta ed efficace
le password di un portale. Persino un neo diplomato ormai sa che le password in
chiaro in un database non ci vanno.

Soprassiedo sulle motivazione dietro l'azione. Recentemente Milano è stata
devestata, questa volta ahimé nel mondo reale, da terroristi che dietro l'astio
contro le multinazionali e le banche hanno piegato le attività di piccoli
commercianti e costretto il comune a pagare soldi pubblici, quindi di
incolpevoli cittadini, per riparare i danni. Penso solo che se veramente
McDonald sia la massima somma dei mali alimentari del mondo, allora sono felice
che tutti questi facinorosi mangino e vivano ad impatto zero. Io, nonostante mi
impegni, non ce la faccio. Ma stiamo divagando.

Ieri, il quotidiano [La
Stampa](http://www.lastampa.it/2015/05/21/italia/cronache/indagine-anonymous-dopo-gli-arresti-degli-hacker-otherwise-e-aken-caccia-ai-complici-88BsViM7lhsFZ2blbIOMaK/pagina.html)
se ne esce con un articolo che, al di là dei toni da cyber fiction, cita due
persone coinvolte nelle indagini che _sembrerebbero_ essere gli autori
materiali degli attacchi. Il condizionale è obbligo perché, come ormai non
accade più in questo paese, si è innocente fino a prova contraria e fino a che
un giudice non dice il contrario.

Visto che non conoscevo i due figuri, mi sono messo a cercare in rete se magari
erano su [LinkedIN](https://www.linkedin.com) o se erano in qualche modo
presenti in rete. Dei due, google mi rimanda al sito dell'associazione dei
[Digital Champions](http://www.digitalchampions.it). Combaciano nome, paesino ed
età... però potrebbe essere un caso di omonimia tra coetanei in un paese di
1000 anime, potrebbe.

Quello che mi ha spaventato è stato quel 0.0001% di probabilità che invece la
risposta sia, _"no, non potrebbe essere un caso"_. Mi ha spaventato vedere che
attraverso questo **pastrocchio all'italiana** dei campioni digitali, noi
facciamo entrare a contatto con la PA, per nobili motivi di awareness,
personaggi che non solo possono essere in conflitto di interesse in quanto
fornitori di servizi di consulenza ICT, ma potenzialmente persone con diversi
valori morali circa la legalità[^2].

Negli altri paesi, il campione è uno, nominato dal Governo e fa lui il campione
digitale. Noi abbiamo inventato la stortura che il campione crea
un'associazione e tutti versando la quota possono concorrere alla riffa di
fregiarsi, in maniera ingannevole[^1], del titolo di campioni digitali ed
ottenere una strada diretta per parlare con le istituzioni locali che magari
senza quel titolo non avrebbero avuto.

Ancora più scandaloso, secondo me, è che i campioni digitali non stiano facendo
awareness per indirizzare gli imbarazzanti problemi di sicurezza informatica
dei siti istituzionali. Dov'era il digital champion, quando hanno appaltato il
sito del ticketing dell Expo con le sue password in chiaro? Dov'era il digital
champion quando hanno messo online quel sito senza testarlo?

Quando lo facciamo seriamente? Quando la smettiamo di banfare e pensare solo
all'orticello?

Ahimé, credo proprio mai. Mai perché è nella natura dell'uomo, e dell'italiano
medio che non brilla per senso civico poi, quella di ricavarsi un orticello per
coltivare i propri interessi. Se si tratta di festini, lo chiamiamo conflitto
di interessi, se si tratta di altro, lo chiamiamo sensibilizzazione.

## Off by one

La cosa che più interessa a noi è che nel 2015 siamo ancora qui a parlare di
password in chiaro e siti istituzionali bucabili da chiunque e messi online
senza uno straccio di penetration test, firewall applicativo e linea guida di
sviluppo sicuro.

Ci lamentiamo dei bassi stipendi dell'ICT italiano, di come il mondo del lavoro
all'estero sia migliore ma la realtà è che _la massa_ fa questo mestiere per
campare non perché lo ama. Quando fai una cosa per dovere e non per passione la
farai male e se fai una cosa male, non sei professionale e se non sei
professionale meriti le [due noccioline che ti
tirano.](https://codiceinsicuro.it/blog/se-paghi-noccioline-attirerai-scimmie-storie-job-posting-nellera-delle-startup/).
Sto parlando della massa ovviamente, non delle eccellenze quelle le abbiamo
ovviamente, ma vengono affossate da un rumore di fondo... un brusio che rende
cacofonico il sistema ICT Italiano.

Un'accozzaglia di rumori che ci costringe, nel 2015, a parlare di password che
non cifrano, siti istituzionali che non stanno integri e campioni che non
campionano.

Enjoy... o questa volta, forse no.

[^1]: Dico che è una dicitura ingannevole in quanto tecnicamente il Campione
      Digitale è **uno**, gli altri sono membri dell'associazione che, guarda tu il
      caso alle volte, ha lo stesso nome della carica ufficiale. Bel paese l'Italia,
      no?

[^2]: sarà ovviamente un caso di omonimia tra coetanei in un paesino sperduto
      di montagna ovviamente.
