---
layout: post
author: thesp0nge
title: "Quando la spia è la tastiera del tuo smartphone: il caso Flash Keyboard"
promotion: "Quando la spia è la tastiera del tuo smartphone: il caso Flash Keyboard"
modified: 
featured: false
category: [News]
tags: [tastiera, spyware, android, cina, smartphone]
image:
  feature: keyboard.jpg
comments: true
share: true
---

Quanti di noi, possessori di uno smartphone Android non _rooted_, investono il
proprio tempo a leggere e capire le autorizzazioni che un'app ci richiede
quando vuole essere installata?

Ho detto, "leggere e capire".

Di sicuro sono stati in pochi a farsi le domande giuste quando hanno installato
[Flash Keyboard](https://play.google.com/store/apps/details?id=com.dotc.ime.latin.flash&hl=it), una delle tante app con le funzionalità da tastiera. E
secondo [questo
studio](https://regmedia.co.uk/2016/06/07/pentestflashkeybpardpaper.pdf) della
società [PenTest](http://www.pentest.co.uk/about.html), hanno fatto male a non
farsele.

Emerge infatti, da questo report inquietante, che [Flash Keyboard](https://play.google.com/store/apps/details?id=com.dotc.ime.latin.flash&hl=it), che nel
Febbraio scorso era all'undicesimo posto tra le applicazioni più scaricate,
cinque posizioni prima di Whatsapp per dire, altro non era che un sofisticato
spyware.

Oddio, che qualcosa non tornasse, lo si poteva capire dalla miriade di
autorizzazioni richieste dall'applicazione.

![Autorizzazioni richieste da Flash Keyboard]({{site.url}}/assets/images/auth_flash_keyboard.jpg)

Ma la complessità è nemica della sicurezza, quindi milioni di persone vedendo
un elenco enorme di autorizzazioni hanno pensato bene di portarsi il nemico in
casa. Li biasimiamo? No. Quando un sistema è troppo complesso, l'utente medio
troverà il modo di usarlo nel peggior modo possibile.

La _nostra app_ richiedeva di accedere a log di sistema, di poter uccidere
processi arbitrari, di comunicare con l'esterno, di poter scattare foto e
registrare video, di scaricare file senza notifica e molto altro.

Durante
[l'analisi](https://regmedia.co.uk/2016/06/07/pentestflashkeybpardpaper.pdf)
condotta da PenTest, è emerso come quest'applicazione spedisse tutta una serie
di informazioni a server cinesi, più precisamente all'host
tdcv3.talkingdata.net. Informazioni come:

* Device manufacturer
* Device model number
* Device IMEI
* Android version
* Owners email address
* Wi-Fi SSID
* Wi-Fi MAC
* Mobile Network (e.g. Vodafone)
* GPS co-ordinates accurate to 1-3 meters
* Information about nearby Bluetooth devices
* Details of any proxies used by the device

La conclusione del report di PenTest è che ci troviamo di fronte, in realtà, ad
un tentativo maldestro di applicazione che scheda i suoi utenti nel tentativo
di monetizzare qualcosa. Decompilando il binario non si ha evidenza che, tutte
le cose brutte che avrebbe potuto fare con quelle permission, siano
effettivamente state fatte. Anzi, il solo fatto che il codice non sia
offuscato, rende meno probabile l'ipotesi di malware avanzato.

L'episodio di Flash Keyboard però ci deve far capire che:

* sovente installiamo cose a caso
* diamo troppa libertà alle applicazioni installate sui nostri smartphone
* non abbiamo ancora compreso a fondo il meccanismo delle autorizzazioni
* mettiamo a rischio la nostra privacy

## Parlano di Flash Keyboard

* [Tom's Hardware](http://www.tomshw.it/news/la-tastiera-che-ti-spia-e-piu-scaricata-di-whatsapp-77715)
* [PC Professionale](http://www.pcprofessionale.it/evidenza-home/flash-keyboard-tastiera-spia/)
* [Android Pit](https://www.androidpit.com/flash-keyboard-for-android-why-you-should-avoid-it)
