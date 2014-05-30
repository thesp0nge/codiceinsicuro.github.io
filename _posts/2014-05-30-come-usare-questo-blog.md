---
layout: post
title: "Come usare questo blog"
modified:
category: [servizio]
tags: [codice insicuro, blog, post, categorie, sicurina, pick'n'chich, doctor is in, angolo del libro, amazon]
image:
  feature: istruzioni.png
  credit: Arianna Flacco
  creditlink: https://www.flickr.com/photos/impaginazione/
comments: true
share: true
---

E' passato un mese e mezzo dal [primo post su
heartbleed](https://codiceinsicuro.it/blog/heartbleed-parte-1-la-chiacchiera-da-pub/)
ed arrivati ad una decina di post, l'[ultimo dei quali, sulle
startup](https://codiceinsicuro.it/blog/se-paghi-noccioline-attirerai-scimmie-storie-job-posting-nellera-delle-startup/)
ha riscosso parecchio successo in termini di visite e commenti[^1], è ora di
stendere un piano di pubblicazione che dia un senso a questo post.

Questo post non fa del repost di notizie prese dall'estero la sua forma
principale di contenuti. Di blog che riportano che la società X è stata bucata,
senza dare neanche un bit in più di valore aggiunto, è pieno il web. Quindi se
cercate qualcuno che vi racconti ad esempio che [ebay è stata
bucata](http://thehackernews.com/2014/05/ebay-hacked-change-your-account.html) e così anche [spotify](http://thehackernews.com/2014/05/spotify-hacked-urges-android-users-to.html), bhé usate un po'

[Google](https://www.google.it/search?q=voglio+avere+notizie+di+attacchi+informatici+cybercrime+banfa&oq=voglio+avere+notizie+di+attacchi+informatici+cybercrime+banfa&aqs=chrome..69i57.15390j0j7&sourceid=chrome&es_sm=119&ie=UTF-8)
e non rimarrete delusi.

Probabile che la storia di intrusione sia lo spunto per un post tecnico, come
ad esempio l'[upload di una web shell su un server di ebay](https://twitter.com/CEHSecurity/status/469718659313979393)
sarà lo spunto per un articolo sull'hardening di
[Wordpress](http://www.wordpress.org). Diciamocelo, ci saranno migliaia di
intrusioni al mondo, se stiamo qui solo ad elencarle facciamo sera senza aver
detto niente di concreto.

> Ho pensato che post di _meditazione_, come quello sulla [figura
> dell'application security
> specialist](https://codiceinsicuro.it/blog/ricordami-perche-lo-faccio-non-e-un-lavoro-per-tutti/),
> sono interessanti e mi diverte scriverli, però serve qualcosa di più
> strutturato.

Per questo motivo, troverete d'ora in avanti i post organizzati in 5 categorie distinte[^2]:

* Pick'n'chic: usare ruby in un penetration test applicativo
* Sicurina: pillole per scrivere codice più sicuro
* Doctor is in: lo sportello dell'awareness
* L'angolo del libro
* Spinaci: storie di hardening

## Pick'n'chic: usare ruby in un penetration test applicativo

Una delle cose più divertenti nel testare il codice altrui è quello di
inventarsi nuovi modi per attaccarlo, magari scrivendo script nuovi o
modificando tool esistenti. Nei post della serie _Pick'n'chic_,
useremo ruby come linguaggio di scripting per scrivere i nostri tool. Perché
proprio ruby? Perché è nato per parlare il _webbese_, ha delle ottime API, ci
puoi scrivere al volo anche una GUI WEB con [Sinatra](http://www.sinatrarb.com)
e poi perché mi piace.

## Sicurina: pillole per scrivere codice più sicuro

_Sicurina_ sarà la cura per lo sviluppo non sicuro. Vedremo in post
molto vari tra loro, come usare API esistenti (e.g. [Owasp
ESAPI](https://www.owasp.org/index.php/Category:OWASP_Enterprise_Security_API#tab=Home))
o come scrivere codice custom che risolva i principali problemo di application
security. Volendo riassumere, gestire l'autenticazione, l'autorizzazione e
filtrare l'input e già siete a cavallo.

## Doctor is in: lo sportello dell'awareness

Lo sviluppatore non è che non filtra l'input perché non è in grado di farlo,
non lo fa perché non ne vede il motivo. Sappiamo tutti che lo sviluppatore è
tendenzialmente pigro e cerca di essere essenziale nel codice che scrivere. Per
fare in modo che spenda tempo e righe di codice per introdurre check di
security, dovremo spiegargli nel dettaglio i rischi che la sua creatura corre
quando pubblicata su Internet.

No, non se ne può più di vedere il cross site scripting come un alert box in
javascript, altrimenti comincio a stare pesantemente dalla parte del developer.

I post nella categoria _Doctor is in_ serviranno ad educare il mondo
sui rischi e pericoli che un'applicazione web corre. Se poi voi non fate
niente, almeno non potrete dire che non ve l'ha detto nessuno.

## L'angolo del libro

Volevo trovare un modo per monetizzare questo blog senza farcire l'HTML di
adwords che, sinceramente, odio. Non mi andava inoltre di imbarcare chi legge
qui di storie, e vendervi che la mia VPS è a costo 0. Quindi mi sono iscritto
al programma di affiliazione di Amazon e, nei post della categoria de _l'angolo
del libro_ vedrete un link allo store amazon. Questo link contiene
il codice di questo blog quindi, se deciderete di comprare il libro sullo store
amazon seguendo questo link, amazon darà una percentuale a me. Se rimuovete il
codice e comprate il libro, amici come prima, solo che non vi voglio prendere
in giro, un po' di pubblicità c'è.

Però mi sembrava brutto mettere un link e dirvi "cliccate e fatemi diventare
milionario", quindi farò una recensione del libro che sponsorizzerò.

## Spinaci: storie di hardening

Consigli non solo per sviluppatori, perché il codice più robusto del mondo non
vale nulla se fatto girare su una Linux non mantenuta da anni con telnet aperto
e la password di root uguale a _hax0r_ o _31337_.

Nella categoria _spinaci_ parleremo di hardening, di configurare i nostri
servizi in maniera sicura.  Focus principale sono i servizi che fanno girare
web application, quindi web server, application server, DBMS. Avranno spazio
anche i CMS più popolari, come wordpress prendendo proprio spunto dal recente
hack di ebay, e il mondo NoSQL.

## Off by one

Categorie alla mano, qualche titolo di post lo potete leggere sul
[README](https://github.com/thesp0nge/codiceinsicuro.github.io/blob/master/README.md)
del progetto. Qualche post ce l'ho già in mente per il prossimo futuro e
verranno portati in forma aggiornata alcuni post interessanti che avevo scritto
su [armoredcode.com](http://armoredcode.com).

Per rendere la navigazione più fluida tra i vari post, rivedrò a breve anche la
home, quindi aspettatevi cambiamenti.

Enjoy it!

[^1]: speriamo anche i post più in topic arrivino agli stessi risultati.
[^2]: a parte le categorie _meditazione_ e _chiacchiere da pub_ che mi servono così, per scaricare un po' i toni.
