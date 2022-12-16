---
id: 473
title: 'Non mettete regole troppo complesse alle vostre password'
date: '2022-04-16T11:51:07+02:00'
author: thesp0nge
excerpt: 'Perché non usare una frase al posto di una password? Lasciamoci alle spalle regole di complessità obsolete e abbracciamo l''usabilità con un occhio di riguardo alla sicurezza.'
layout: post
guid: 'https://codiceinsicuro.it/?p=473'
permalink: /2022/04/16/non-mettete-regole-troppo-complesse-alle-vostre-password/
neve_meta_sidebar:
    - ''
neve_meta_container:
    - ''
neve_meta_enable_content_width:
    - ''
neve_meta_content_width:
    - '0'
neve_meta_title_alignment:
    - ''
neve_meta_author_avatar:
    - 'on'
neve_post_elements_order:
    - '["title","meta","thumbnail","content","tags","comments"]'
neve_meta_disable_header:
    - ''
neve_meta_disable_footer:
    - ''
neve_meta_disable_title:
    - ''
spay_email:
    - ''
image: /wp-content/uploads/2022/04/em5w9_xj3uu.jpg
categories:
    - Riflessioni
tags:
    - complessità
    - gdpr
    - password
---

Questa mattina, godendomi un sole caldo che ha sicuramente dato il buongiorno, ho letto questo tweet all’interno del mio feed.

> 2022\. Sito di grandissima azienda privata che gestisce molti dati personali. [pic.twitter.com/i4Xy2H0XgI](https://t.co/i4Xy2H0XgI)
>
> — Federico Maggi (@phretor) [April 15, 2022](https://twitter.com/phretor/status/1514875162444931073?ref_src=twsrc%5Etfw)

 <script async="" charset="utf-8" src="https://platform.twitter.com/widgets.js"></script>La form del cambio password di questo sito, lamenta un’eccessiva lunghezza della password scelta dall’utente. Fermiamoci un attimo e ripetiamolo **molto** lentamente: la password che l’utente ha scelto è troppo lunga.

Le chance che quella password veleggi verso una memorizzazione in chiaro sono molto alte. Altrimenti, perché lamentarsi della lunghezza?

## La lunghezza e l’hash

In linguaggi come Java, C# o PHP, la gestione delle stringhe di testo è molto evoluta e quindi non è sicuramente una scelta per evitare un buffer overflow. Compito dell’interprete è quello di allocare dinamicamente la memoria in modo tale da evitare pattern molto più comuni in sorgenti scritti in linguaggio C.

Se si vuole memorizzare nel database, l’hash SHA256 della password, memorizzando la rappresentazione in caratteri esadecimali del risultato della funzione, ci servono 64 caratteri, se non ho sbagliato i conti. **Sessantaquattro**. La cosa importante, da tenere in considerazione è che questa dimensione è indipendente dalla lunghezza dell’input. Quindi, una password di 3 caratteri, una passphrase di 20 caratteri o il capitolo di un libro, quando dati in pasto ad una funzione SHA256 restituiranno una stringa di 64 caratteri. Potenza e mistero delle funzioni di hashing.

Se non ci credete, compito per casa è verificarlo voi stessi.

## Complessità, caratteri speciali e usabilità

Alzi la mano chi ama mettere una password complessa come <kbd>Rdaj£25!PdaDD21$</kbd> ? A nessuno, neanche agli esperti di sicurezza informatica, figuriamoci all’utente comune. Ora alzi la mano chi ama dover scegliere una password che soddisfi tante regole di complessità, ogni 3 mesi?

Pensate all’utente comune, quello che di solito viene preso come target in campagne mirate o che di solito clicca il link con l’immagine del gattino. Un utente con una buona dose di consapevolezza, ma che di mestiere fa altro e che non può ricordarsi codici senza un nesso logico che cambiano ogni 3 mesi.

<mark class="wp-block-coblocks-highlight__content">Come persone che parlano di sicurezza applicativa a sviluppatori, dobbiamo renderci conto che abbiamo una grossa responsabilità. I nostri consigli devono essere fattibili, devono venire incontro all’utente e non devono essere onerosi da sviluppare.</mark>

Un codice troppo complesso da sviluppare, probabilmente conterrà errori e vulnerabilità oppure, cosa molto più probabile richiederà troppo tempo per essere realizzato e quindi al team di sviluppo, sarà chiesto di rilassare alcuni, se non tutti, dei vincoli che abbiamo dato loro.

Un set di regole troppo complesse, porterà l’utente finale scegliere una password come <kbd>Rdaj£25!PdaDD21$</kbd>1, scriverla su un foglietto e ogni tre mesi cambiare l’ultima cifra. Aggiungere un controllo sulla similarità della password aiuterebbe? No, inasprirebbe ancora di più l’utente e non è nostro interesse, né avere utenti scontenti, né bloccare la gente sulla password di accesso.

## Frasi, usiamo le frasi

Ne parlavo [circa cinque anni fa](https://codiceinsicuro.it/2017/03/13/entropia-password-e-passphrase/): la soluzione al problema di dare un segreto che sia semplice da ricordare ad un utente è quello di permettergli di scegliere qualcosa che il cervello memorizza in maniera semplice. Esclusi numeri e date, quello che siamo bravi a ricordare sono le frasi.

Il verso di una canzone o di una poesia, una frase di senso compiuto, una frase che ci siamo inventati, sono ottimi esempi di password:

- computazionalmente robuste
- resistenti ad un attacco basato su dizionario
- resistenti ad un attacco di password guessing a forza bruta

Perché quindi non permettere una password come “Il colore della mia stanza è blu”? Ho provato a pensare a motivazioni tecniche, problemi di encoding, problemi con la gestione degli spazi e, **giuro**, non mi è venuto in mente nulla di sensato.

Nel caso non avessi visto qualcosa di macroscopico, lasciami un commento. Sono proprio curioso di capire e magari di aiutarti a trovare una soluzione.

## Off by one

Perché reinventare la ruota? In un’epoca basata sui micro servizi, perché non creare un’API che sia un po’ flessibile e che possa essere utilizzata per il blocco “autenticazione”? Certo, magari la realtà X ha bisogno di una customizzazione particolare, in quel caso può usare questo mattoncino come base su cui partire.

Bene, oggi ho creato [questo repository](https://github.com/thesp0nge/deadly-simple-login-api). Sto pensando ad un’API scritta in Java, eseguita all’interno di un container, con un database configurabile e di default basato su SQLite3.

Questa API avrà le funzionalità di login, logout e cambio password e penso sarà solo il middleware in maniera tale che ognuno possa personalizzare le pagine come più gli aggrada. Anche il database ovviamente sarà personalizzabile via JDBC.

L’idea è levarsi dalle scatole quel set di regole complessità assurde che spesso sono chieste in fumosi documenti di compliance, scritti da persone che magari non hanno la minima idea del problema e che pensano veramente che “2 maiuscole, 3 numeri e 4 caratteri speciali” rendano una password più sicura, ottenendo in cambio l’ennesimo post-it attaccato al monitor.

Enjoy it!
