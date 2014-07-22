---
layout: post
title: "La sicurezza invisibile: abusing jsonp e la risposta della community rails"
modified:
category: [Spinaci]
tags: [CVE-2014-4671, miki, jsonp, callback, encoding, swf, flash, ruby on rails]
image:
  feature: flash.png
  credit: JD Hancock
  creditlink: https://flic.kr/p/7zuBLD
comments: true
share: true
---

[Michele Spagnulo](http://miki.it), non lo scopro certo io, è uno che di
application security ne sa tanto. Neanche una settimana fa se ne esce con
[questo post](http://miki.it/blog/2014/7/8/abusing-jsonp-with-rosetta-flash/)
che mette a nudo un problema di design di JSONP e del suo meccanismo di
callback.

Michele ha realizzato un tool, [Rosetta
Flash](https://github.com/mikispag/rosettaflash), che prende un file SWF
arbitrario e ne fa l'_encoding_ con dei magheggi spiegati nel dettaglio nel
[suo post
originale](http://miki.it/blog/2014/7/8/abusing-jsonp-with-rosetta-flash/) fino
a trasformarlo in una sequenza di caratteri alfanumerici, pronta per essere
data in pasto ad un endpoint JSONP che, desideroso di eseguire qualcosa, prende
in pasto questa callback e si carica un flash arbitrario.

## Lo scenario di attacco

L'ha spiegato nel dettaglio
[Michele](http://miki.it/blog/2014/7/8/abusing-jsonp-with-rosetta-flash/) io
prendo e traduco solamente per i lettori più pigri. Tre fattori che permettono
l'exploit:

* un file flash, **per design**, può fare delle operazioni di GET e POST verso
  il dominio sul quale il filmato è in hosting. Questo vuol dire che se un
  attaccante è in grado di fare l'_upload_ di un file SWF opportunamente
  preparato, sarà in grado di recuperare i cookie di una sessione autenticata su
  quel dominio, senza le limitazioni imposte dal file ```crossdomain.xml``` e poi
  redirigere il traffico verso un dominio controllato dall'utente.
* JSONP, sempre **per design**, permette di specificare i primi byte
  dell'output di un endpoint specificando i parametri della callback direttamente
  nell'URL.
* un file SWF può essere racchiuso in un tag ```<object>``` in un dominio
  controllato dall'attaccante e verrà eseguito come script flash se il contenuto
  risulta essere un file Flash valido.

L'attaccante potrà quindi ospitare una pagina dove si carica, dentro un
```<object>``` i cui dati saranno la JSONP vulnerabile (che sarà una URL
assoluta del nostro target) alla quale daremo in pasto un file SWF trasformato
in caratteri alfanumerici con il tool di Michele. La JSONP onorerà la callback
che, eventualmente, cercherà di fare delle POST verso il dominio
dell'attaccante portandosi dietro i cookie di sessione. Per dire.

## La risposta degli sviluppatori Rails

Che io abbia un debole per Ruby ed i suoi framework per lo sviluppo web non è
un mistero. Rails, Sinatra, Padrino sono esempi stupendi di framework MVC[^1]
che già offrono in modo trasparente per lo sviluppatore sia routine di
filtering per i Cross Site Scripting, sia meccanismi di protezione per il Cross
Site Request Forgery, sia come Rails che forza BCrypt come metodo di cifratura
per le password.

Da un paio di giorni dopo il post di Michele, Rails offre protezione nativa
all'exploit che lega JSONP e Flash grazie a [questa pull
request](https://github.com/rails/rails/pull/16109/files).

Più di mezzo milione di siti web protetti dal prossimo ```bundle update```. Non
male.

## Off by one

Una delle caratteristiche principali di un buon framework è quella di annegare
al suo interno tutta una serie di funzionalità **base** il cui funzionamento
non sempre è di pubblico dominio e soprattutto non sempre compreso da tutto il
bacino di utenza.

Annegare una delle mitigazioni di questo exploit all'interno della parte del
framework che si occupa di gestire la callback JSONP è una risposta seria da
parte del core team di rails e da l'immagine di un progetto maturo e
focalizzato sulla qualità.

Vi rimando al post di Michele per le mitigazioni a livello sistemistico che
includono, tra l'altro, l'uso dei secure headers di cui abbiamo parlato
[qualche giorno
fa](https://codiceinsicuro.it/blog/difendiamo-i-nostri-utenti-con-i-secure-headers).

Enjoy it!

[^1]: per i puristi. Sinatra non forza il concetto di MVC, tuttavia è
      consuetudine per uno sviluppatore, applicare gli stessi concetti usati in
      un'applicazione Rails o Padrino anche qui.
