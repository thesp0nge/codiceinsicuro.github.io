---
layout: post
author: thesp0nge
title: "EyePiramid: il Grande Fratello è tra noi"
promotion: Il caso eyepiramid ha dimostrato, come se ce ne fosse bisogno, che la stampa non è pronta per i temi di cybersecurity (e forse anche alcuni esperti).
modified: 
featured: false
category: [post]
tags: [banfa, eyepiramid, spear phishing, malware, phretor, lk]
image:
  feature: pyramid.jpg
comments: true
share: true
---

Ieri è scoppiato il bubbone [Eyepiramid](http://www.lastampa.it/2017/01/11/italia/cronache/ecco-come-i-malware-colpiscono-i-paesi-pi-deboli-kvltzKCjt7b3ArZ3SQiIsJ/premium.html), una storia di _cyber spionaggio_,
che ha interessato buona parte della classe politica italiana.

In breve, secondo l'ordinanza di [custodia cautelare](http://formiche.net/wp-content/blogs.dir/10051/files/2017/01/ordinanza-occhionero.pdf) i fratelli Occhionero
_sarebbero_ responsabili di aver creato una botnet di PC per fare quello che fa
[_Lisbeth Salander_](https://it.wikipedia.org/wiki/Lisbeth_Salander) nella trilogia [Millennium](https://it.wikipedia.org/wiki/Millennium_(trilogia)) con il suo software di
controllo remoto Asphyxia.

O, se preferiamo l'italica realtà, qualcosa di molto simile a quello che faceva
[Hacking Team]({{site.url}}/blog/hackingteam-e-la-storia-del-figlio-del-calzolaio/) con il suo RCS.

Controllo. Furto di informazioni.

## Quello che veramente dovete leggere per capire

Per capire meglio quello che è successo dovete fare, in quest'ordine:

* scaricare [l'ordinanza del GIP](http://formiche.net/wp-content/blogs.dir/10051/files/2017/01/ordinanza-occhionero.pdf)
* prendervi 40 minuti e guardare [l'analisi del documento](https://www.youtube.com/watch?v=RSU5hROpWeM) della
  magistratura, fatta da Matteo Flora
* leggervi l'analisi **tecnica** fatta da [@phretor](https://twitter.com/phretor) e disponibile sul suo
  [GitHub](https://github.com/eyepyramid/eyepyramid/blob/master/README.md). Ovviamente l'analisi è sulla base di quello che, il pubblico,
  può conoscere.

Ci sono poi due interventi di
[AZM](http://www.la7.it/omnibus/video/manzoni-anche-nelle-tecnologie-informatiche-ci-sono-aspetti-negativi-e-tanti-rischi-11-01-2017-201663)
e Stefano Mele, rispettivamente su La7 e Sky TG24, che fanno un quadro generale
ad alto livello della vicenda.

Poi basta. Quello che vi serve per capire è qui. Anche nel proseguio di questo
post, non aggiungo un solo bit di informazione.

## Cybersecurity e la scusa di buttarla in caciara

Dopo aver letto un post su un blog tecnico di una persona legata ad una casa
che produce software a Redmond, ho pensato che anche [Codice
Insicuro]({{site.url}}) dovesse partecipare alla caciara mediatica.

Ah, avessi messo qualche adv.

Esperti, o sedicenti esperti di grandi società di consulenza, si sono lanciati
in _crucifige_ sullo stato della cybersecurity italiana. Non totalmente a
torto, diciamolo, ma quale è la colpa? Forse delle stesse società di consulenza che non fanno vero awareness per non rendere indipendente il proprio cliente? _grin_

Questi due fratelli avrebbero, usato tecniche di phishing per compromettere
lanciare un attacco verso più alti esponenti della vita pubblica italiana.
Tecnologicamente avrebbero utilizzato un malware già noto, sembrerebbe
modificato in qualche modo e scritto ex novo un sistema di controllo in Visual
Basic.

Diciamo che aver usato nomi reali per l'acquisto dei domini per il command and
control del malware e per l'acquisto di alcune licenze di software usato
nell'impianto progettato, non fanno di loro i nuovi Kevin Mitnick dell'IT
italiano.

Ma tant'è... hanno spiato Renzi. Praticamente parte del web, pensa siano eroi.

Quale sembrerebbe sia la colpa di tutto questo? Della scarsa attenzione ai temi
di sicurezza informatica, da parte delle industrie private e del comune
cittadino.

E questo è vero. Io discuto ancora sulla necessità di HTTPS nelle form di login
per applicazioni non esposte in Internet, quando non spiego come si fa una bind
ad LDAP per usare l'autenticazione di dominio ovunque, figuriamoci se una
persona non tecnica di uno studio legale può esimersi dall'aprire un allegato
in una mail.

Venendo qui ho visto una persona aprire dal proprio smartphone un
_invoice.docx_ allegato. In un articolo della Stampa di ieri, si parlava di un
[70% di analfabetismo funzionale in Italia](http://www.lastampa.it/2017/01/10/blogs/il-villaggio-quasi-globale/il-per-cento-degli-italiani-analfabeta-legge-guarda-ascolta-ma-non-capisce-MDZVIPwxMmX7V4LOUuAEUO/pagina.html). La gente ha problemi con la
propria lingua madre, figuriamoci coi malware.

Enjoy it (o forse no)!
