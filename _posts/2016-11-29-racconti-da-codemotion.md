---
layout: post
title: "Racconti da codemotion"
promotion: "Qualche racconto dal mio ultimo talk a Codemotion. Tra una demo che si inceppa ed una scena IT che è viva."
modified:
featured: false
category: [post]
tags: [codemotion, talk, bot, go, sviluppo, passione]
image:
  feature: codemotion.jpg
  credit: Gregor Fischer/codemotion
  creditlink: https://flic.kr/p/AB6EnK
comments: true
share: true
---

Venerdì, mentre vi ammazzavate di reload sulla pagina di
[Amazon](https://www.amazon.it) per il _black friday_, ho fatto il mio ultimo
talk, per il 2016, a [Codemotion](https://milano2016.codemotion.com).

Lasciatemi dire che è stato un bellissimo evento, un sacco di pubblico, molte
startup e grandi nomi tra sponsor ed spositori, Cisco ed IBM ad esempio.

L'intervento di IBM è stato quello che più ha rotto gli schemi. Il talk ha
visto infatti sul palco il robot [Pepper](https://www.ald.softbankrobotics.com/en/cool-robots/pepper) dialogare con gli speaker facendo
un po' di cabaret. Veramente interessante.

Gli altri keynote, per il mio gusto personale, un po' sottotono, offuscati
forse dal simpatico androide bianco.

La giornata è andata via veramente liscia. Ho cercato di seguire un po' la
track di security e quella di [Go](https://golang.org), linguaggio di programmazione che sembra
stia prendendo particolarmente piede, soprattutto in campo DevOps per le sue
integrazioni con [Docker](https://www.docker.com), scritto anch'esso in Go.

Della mia track, per il venerdì, perché sabato non sono andato, degni di nota
il talk di [Andrea Pompili](https://www.linkedin.com/in/andreapompili) sugli attacchi agli IoT, con particolare
attenzione per l'automotive, e il talk di [Davide Papini](https://www.linkedin.com/in/davide-papini-b335608) che ha parlato di
_machine learning_, applicato alla rilevazione di malware, citando anche un
lavoro di [Marco Balduzzi](http://www.madlab.it) di Trend Micro.

Piccola nota negativa della giornata. Gli spazi. Secondo me la gente era **veramente**
tanta, e l'organizzazione si è data veramente un gran da fare per organizzare
tutto al meglio, ma secondo me se fosse stato in una location flat, tutta su un
piano ed enorme, si sarebbe respirato un po' di più. Mi viene in mente la
location di [Railsberry](http://www.railsberry.com/2013/venues) ad esempio. Va detto comunque che l'effetto _siamo
alla smau nei primi anni 90_, non ha intaccato né la qualità dell'evento, né il
gran lavoro del team di [Codemotion](http://www.codemotionworld.com/about/). Kudos, bravissimi!

## Il mio talk

Venerdì portavo il talk che ho portato all'evento di [ISACA
Venice]({{site.url}}/blog/molto-benissimo-il-racconto-del-talk-a-isaca-venice/).
Ho parlato quindi di [application security
pipeline](https://www.owasp.org/index.php/OWASP_AppSec_Pipeline). Non ho
distribuito grappa come a [Bologna]({{site.url}}/blog/questione-di-malloc/), ho
fatto solo un po' di spaccio di stickers di [Codice Insicuro]({{site.url}}).
Stickers finiti tra l'altro.

Ho aggiunto però una nota di colore, presentando [Canaveral](#) un orchestrator
che ho scritto per integrare tool di security nella propria pipeline.

[Canaveral](https://github.com/thesp0nge/canaveral) si basa su
[Grape](https://github.com/ruby-grape/grape/blob/master/README.md), un
framework [Ruby](https://ruby-lang.org/en) per creare API e servizi Rest. Al
momento [canaveral](https://github.com/thesp0nge/canaveral), integra:

* nmap
* owasp zap
* dawnscanner

Per la demo, mi serviva infatti coprire un po' tutti i momenti di test, sono
quindi partito da questo. Il _job_ che integra nmap è proprio quello che non è
partito durante la demo, demo che ho rifinito nel viaggio di andata in
metropolitana; quindi si può affermare che sì, Murphy esiste, ti vede e ti fa
andare storte le cose.

Pubblico interessato, con un sacco di domande. Immancabili ormai i momenti
_trivia_ con i premi. Questa volte le code review erano **molto** semplici,
infatti in palio c'era solamente uno sticker, niente Grappa di Tony.

## La scena

Eh. Sono due le cose: o nei grandi system integrator ci va soprattutto gente
senza troppa passione, o la passione il system integrator la uccide a mani
basse. Ok, ho imbrogliato. Essendoci passato anche io, è la seconda.

Al netto di dove muoia la passione quando valichi la porta di certi ambienti,
il livello degli sviluppatori presenti al Politecnico venerdì era veramente
alto.

Mi viene quindi spontaneo chiedervi, o chiedermi... _"ma di preciso, dove avete
lasciato morire la vostra passione?"_

Veramente la soluzione alla bolletta da pagare è un lavoro che, non nei
contenuti magari, ma nella forma, in come viene rivenduto, impariamo ad odiare
ogni giorno di più?

Siamo tutti leoni da tastiera quando si parla di politica, quindi perché
abbandonarsi allo status quo per non dispiacere il capo ed avere la vita così
placida e serena e dire, arrivati al mercoledì: _"dai, che abbiamo
scollinato."_

Veramente tutto si riduce a guardare il calendario del 2017, cercando di
trovare la combinazione ottimale dei giorni di ferie per inserire il filotto di
ponti più lungo?

Abbiamo veramente deciso di barattare i nostri sogni e la nostra energia per la
routine, per passare il badge alle 9, aspettando l'ora del treno di ritorno,
tra un caffè alla macchinetta e qualche battuta, subita, stupida e lontana anni
luce dal concetto di scherzo?

Se è così, meglio non guardarsi più allo specchio. Perché di gente che lecca i
piedi per arrivare, putroppo, l'Italia ne è già piena.

Enjoy.
