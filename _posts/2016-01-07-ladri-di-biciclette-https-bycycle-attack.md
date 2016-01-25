---
layout: post
title: "Ladri di biciclette: HTTPS bicycle attack"
promotion: "HTTPS bicycle attack: ecco come ottengo informazioni utili da qualche pacchetto TLS catturato"
modified: 
featured: true
category: [Under attack]
tags: [https, tls, stream cipher, information disclosure, https bicycle, bycycle attack]
image:
  feature: bici_2016.jpg
  credit: Armando Magro
  creditlink: https://flic.kr/p/5KxzVA
comments: true
share: true
---

Ci hanno insegnato, i saggi della sicurezza applicativa, che la cifratura
avrebbe garantito, tra l'altro, la riservatezza del dato in transito.

No, non stiamo per demolire uno dei pilastri del nostro lavoro. HTTPS è ancora
la strada da seguire, ma[^1].

Lo scorso 30 Dicembre, mentre eravamo in rosticceria ad ordinare l'insalata
capricciosa e le tartine per la festa dell'indomani, un ricercatore, tale
[GUIDO VRANKEN](https://guidovranken.wordpress.com) ha pubblicato [un
post](https://guidovranken.wordpress.com/2015/12/30/https-bicycle-attack/) dove
ci augura _buona fine e buon inizio_, presentandoci un nuovo attacco a HTTP e
TLS: il [bicycle
attack](http://www.theregister.co.uk/2016/01/06/https_bicycle/).

## Hai voluto la bicicletta?

Come spiegato molto chiaramente anche in questo post, apparso sul [blog di
Websense](http://blogs.websense.com/security-labs/https-bicycle-attack-obtaining-passwords-tls-encrypted-browser-requests),
l'attacco mira ad ottenere dettagli sui dati in transito, usando qualche
pacchetto TLS catturato in precedenza, basandosi sulla quantità di informazioni
costanti che il browser invia quando fa una richiesta HTTP.

Ovvero.

Facciamo finta che davanti ad una maschera di login, con un fiammante IE 10 (il
[cui supporto di
security](https://www.microsoft.com/en-us/WindowsForBusiness/End-of-IE-support)
sta per finire, tra l'altro), voi inviate le vostre credenziali, diciamo la
coppia _"paolo:digitalblasphemy"_. Supponiamo anche che qualcuno riesca, con un
MitM ad esempio, a catturare quel particolare pacchetto HTTPS.

A questo punto, l'attaccante continua a non avere in mano il dato in chiaro.
Usando l'HTTPS bicycle attack, l'attaccante è in grado di ricavare la lunghezza
dei campi della form che avete compilato, semplicemente togliendo alla
dimensione del pacchetto catturato, tutta la parte costante che quella
particolare versione del browser avrebbe inviato in risposta alla stessa form.

L'attaccante deve quindi anche ricavare, l'**esatta** versione del browser che
state utilizzando. Sotto queste condizioni, grazie al bicycle attack,
l'attaccante è in grado di calcolare la lunghezza della password che abbiamo
inviato al server, 15 caratteri nel nostro caso. L'attaccante conosce, perché è
un'informazione che gli fornisce direttamente l'applicazione web, quali sono i
caratteri leciti o illeciti accettati per il campo password. A questo punto,
l'attacco di bruteforce contro la nostra password ha dei paletti ben definiti,
devono essere generate tutte le possibili combinazioni dei caratteri leciti,
per una password di 15 caratteri. Sono, ovviamente moltissimi[^2], però ho
circoscritto di molto lo spazio delle mie password dove poter andare alla
cieca.

Dormiamo quindi, anche oggi, sonni tranquilli. Non siamo di fronte ad un
[Heartbleed](https://en.wikipedia.org/wiki/Heartbleed) versione 2.0 o ad un
[Poodle](https://en.wikipedia.org/wiki/POODLE) 2016. Però quest'anno inizia con
il botto: la cifratura può non bastare a tutelare la riservatezza del mio dato.

## Come scelgo una buona password?

E' **sicuramente** fuori strada, chi ha pensato ad una cosa del tipo:

> FgerS2"!7ueQ

Per forza, avrà pensato qualcuno, sono pochi caratteri. Perché non usare:

> l+YPnMVemSOoswhGseoWRLFkiQ7OqcyHO/OYmm6fE2ZAev5Gt6JwOMr7DBgQcLC6

Sicuramente è una password robusta, ma non è utilizzabile. Nessun utente è in
grado di memorizzare una stringa complessa come questa, almeno senza scriverla.
Ecco perché proliferano _paperina76_ o _inverno2015_.

Che ne pensate di qualcosa di patriottico, come:

> Fratelli d'Italia, l'Italia si e' desta

Prendere una frase, di una canzone, di una poesia ed utilizzare quella è
sicuramente una scelta vincente. Mitiga di sicuro un attacco a forza bruta,
sfido chiunque ad attaccare una password composta da più parole separate da
spazi.

Ma magari ci torniamo in futuro con un post ad hoc.

Nel frattempo, se sei uno sviluppatore cifra la password con bcrypt o SHA512 o
SHA256[^3] la password **prima** dell'invio verso il server, in questo modo
l'informazione catturata sarà sempre della stessa dimensione (quella
dell'hash), non fornendo ulteriori informazioni all'attaccante.

Come inizio, non c'è male e siamo solo al 7 Gennaio.

Enjoy it!


[^1]: in Italiano non si può lasciare una congiunzione lì da sola, lo so. Sono
      un _grammar nazi_ anche io. Non potendo usare un colonna sonora, creo
      _suspence_ con un 3 in analisi logica.

[^2]: facciamo finta che il sito sia progettato male ed accetti solo lettere
      minuscole come password, per semplicità nei conti. 26 lettere elevato
      alla 15: 1,68 * 10^21. Un numero di tutto rispetto!

[^3]: no, SHA7 non è un'opzione.

