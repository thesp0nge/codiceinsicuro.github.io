---
layout: post
title: "Domenica d'Agosto, che caldo fa"
promotion: "E' stato un anno fin qui molto ricco. Godiamoci questo weekend di Agosto con qualche highlight"
modified: 
featured: true
category: [Chiacchiere da bar]
tags: [blog, agosto, estate, hacking team, nmap, awareness, vulnerability assessment]
image:
  feature: mare.jpg
  credit: Io
  creditlink: 
comments: true
share: true
---

Caldo, mare, estate. Montagna, relax, estate. Comunque voi la vediate, questo è
il periodo dell'anno dove possiamo staccare un po' la spina. Agosto è il
momento dell'anno dove si tirano i bilanci dei primi mesi e si ricaricano le
batterie per i lunghi mesi invernali.

Questo 2015 è stato scoppiettante. La scena Italiana è legata alla nuova moda
di definire _cyber_ qualsiasi cosa c'entri con la security mentre nelle aziende
si respira ancora una mentalità da anni '70.

Il movimento delle _startup_ non è stato in grado di prendersi sulle spalle un
modo agile di fare sicurezza applicativa. Pochissime realtà, complici i costi
aggiuntivi, pensano a dare ai propri clienti un'app che sia anche sicura oltre
che _eye candy_.

In attesa dell'autunno e altre storie di ordinaria sicurezza applicativa,
passiamo le nostre domeniche d'Agosto con 5 delle storie più belle di [Codice
Insicuro]({{site.url}}).

Ecco le prime 5. Buona lettura.

## Questione di protocolli

Ci siamo lasciati, settimana scorsa, con la notizia, un po' inquietante che il
sistema italiano della gestione dell'identità digitale, sarà protetto con SSL
versione 3.0 o la sua versione di poco modificata, TLS 1.0.

Conoscendo il modo con cui nascono e vivono questi progetti, ci saranno state
fior fior di giornate di società di consulenza, pagate a caro prezzo, per
portare soluzioni, vendor o più semplicemente fuffa: un sacco di fuffa.

Possibile che nessuno si sia accorto che siamo arrivati a TLS versione 1.2 e
che la sua adozione richiede solo mezz'ora su Internet per cercare come
disabilitare i protocolli a seconda del web server utilizzato?

Questo è **disarmante**, soprattutto perché l'hardening di un web server
dovrebbe essere la **base**, il pane quotidiano di ciascun sysadmin che si
rispetti. Soprattutto se lavora ad un progetto che impatterà 60 milioni di
persone.

<figure>
  <a href="{{site.url}}/blog/spid-con-ssl3-e-tls1-dot-0-saremo-tutti-securizzati/"><img src="/assets/images/stolen_identity.jpg"></a>
  <figcaption>SPID: con SSL3 e TLS1.0 saremo tutti securizzati</figcaption>
</figure>

## Usiamo i nostri tool al limite

Ci siamo divertiti vedendo come usare [nmap](https://nmap.org) al di là delle
sue capacità con
[Vulscan](http://www.computec.ch/projekte/vulscan/?s=download), uno script LUA
per estendere nmap con una knowledge base di vulnerabilità che affliggono vari
software di sistema.

Abbiamo visto cos'è un vulnerability assessment e come poterne fare uno in
emergenza, con poco a disposizione. Sempre ben consapevoli dei limiti dei
risultati che andremo a trovare.

<figure>
  <a href="{{site.url}}/blog/come-fare-un-vulnerability-assessment-con-nmap/"><img src="/assets/images/door.jpg"></a>
  <figcaption>Come fare un vulnerability Assessment con nmap</figcaption>
</figure>

## Forcaioli alla riscossa

L'inizio di Luglio è stato caratterizzato dall'attacco ad [Hacking
Team](https://www.hackingteam.com). 400Giga di dati trafugati da ignoti e la
scoperta del segreto di Pulcinella, ovvero che RCS è un software _offensivo_
per intercettare dati in transito da un elaboratore o smartphone compromesso.
Il crucifige poi è stata la vendita di questo software a paesi dove c'è una
dittatura militare, come se le nostre aziende già non rifornissero gli arsenali
di mezzo mondo perché al vil denaro non si comanda. Ma vuoi mettere quanto è
hackish parlare di _captatori informatici_?

Vuoi mettere poter dire che Hacking Team controlla, lei personalmente, i
computer di milioni di cittadini? Una sorta di Grande Fratello mondiale?

Non una parola su chi quel software lo ha comprato. Non una parola su chi quel
software lo sta usando in indagini. Non una parola su chi ha autorizzato l'uso
di quel software in un'indagine. Sembra che abbia fatto tutto Hacking Team in
autonomia. Definire questo atteggiamento ridicolo è dir poco. Sarei ben lieto
di vedere lo stesso livore contro le società che costruiscono caccia, navi da
guerra, pistole ben consapevoli che se c'è uno stronzo che li usa per fare del
male ci sono almeno venti persone che le usano all'interno della legalità.

Ma è molto più bello dire che c'è una cospirazione alla base e che siamo tutti
controllati. Così si vendono copie di giornali e di ebook di
_cyberbanfasechiuriti_.

<figure>
  <a href="{{site.url}}/blog/lattacco-ad-hacking-team-e-la-scena-forcaiola-italiana/"><img src="/assets/images/hacked-team.png"></a>
  <figcaption>L'attacco ad hacking team e la scena forcaiola italiana</figcaption>
</figure>

## Io sviluppatore? Ma come ti permetti, io sono banfa

Abbiamo parlato dell'atteggiamento un po' classista che in Italia si respira
verso chi sviluppa software. Visto come una versione 2.0 del metalmeccanico, di
cui spesso ereditano il contratto, lo sviluppatore è l'ultima ruota del carro
che fa funzionare cose che il ben più remunerato _commerciale_ va in giro a
vendere.

Spesso fa miracoli per realizzare accrocchi che in teoria non dovrebbero stare
in piedi. Sempre con il sorriso tra le labbra, a volte al lavoro anche nei
weekend e spesso anche gratis.

Tutti li schifano. Tutti li evitano. Tutti si affrettano di dire che loro non
sono sviluppatori, ma nessuno in realtà ne può fare a meno.

<figure>
  <a href="{{site.url}}/blog/premetto-io-non-sono-uno-sviluppatore/"><img src="/assets/images/kanban.jpg"></a>
  <figcaption>Premetto, io non sono uno sviluppatore</figcaption>
</figure>

## Disassemblare che passione

A Maggio ci siamo avventurati in quanto sia bello fare il reverse di un file
APK e di quanto sia facile risalire a _pseudo segreti_ che incauti sviluppatori
pensano siano al segreto. Spesso si trovano URL in teoria nascoste, password e
cose interessanti che possono essere utilizzate per attacchi successivi.

Abbiamo riflettuto su come sia utile offuscare il codice e disaccoppiare le
informazioni sensibili da qualcosa in mano ad utente, che non è detto sia a noi
leale.

<figure>
  <a href="{{site.url}}/blog/dal-file-apk-al-codice-sorgente-in-poche-semplici-mosse/"><img src="/assets/images/android.jpg"></a>
  <figcaption>Dal file APK al codice sorgente in poche semplici mosse</figcaption>
</figure>

## Off by one

Ecco la prima _pick 5_ dei post più interessanti apparsi [qui]({{site.url}})
nell'ultimo periodo. Ci vediamo tra una settimana per un'altra, _domenica
d'Agosto_.
