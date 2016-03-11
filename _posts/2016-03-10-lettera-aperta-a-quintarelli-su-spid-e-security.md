---
layout: post
title: "Lettera aperta a Quintarelli su SPID e Security"
promotion: "In questa lettera aperta a Stefano Quintarelli, pongo alcune riflessioni su quello che manca allo SPID lato #appsec. Che ne pensate?"
modified: 
featured: true
category: [Chiacchiere da bar]
tags: [spid, identità digitale, single sign on, otp, policy]
image:
  feature: lettera.jpg
  credit: Arkangel
  creditlink: https://flic.kr/p/4vq9U2
comments: true
share: true
---

Tra poco, il 15 Marzo, entrerà in produzione lo
[SPID](http://www.agid.gov.it/agenda-digitale/infrastrutture-architetture/spid).
Lo SPID nasce con l'obiettivo di fornire un sistema di autenticazione unico per
il cittadino, nei confronti dei siti della pubblica amministrazione. Già lo
scorso [luglio ne
parlammo]({{site.url}}/blog/spid-con-ssl3-e-tls1-dot-0-saremo-tutti-securizzati/)
quando, nelle FAQ, veniva consigliato l'uso di SSLv3 e TLS1.0 come requisito
minimo per proteggere il canale trasmissivo tra Asserting party e le Relying
party.

La discussione di questi giorni in realtà nasce su [Twitter](https://twitter.com/quinta/status/707174446931578880). Sollevo
l'obiezione che sarebbe stato utile fornire al cittadino, prova che i sistemi
di terze parti degli Identity Provider, ma anche dei siti che integrano lo SPID
e rimandano l'utente da un IP, sono testati dal punto di vista della security.
Quindi pubblicare, ovviamente post mitigazione, i report dei penetration test
applicativi condotti **periodicamente** su quei sistemi e su quelle API.

Mi viene risposto che pubblicare queste informazioni sarebbe contraddittorio e
che comunque su quei sistemi [non ci sono dati dell'utente](https://twitter.com/quinta/status/707193157918838784), poi modificato in
"[solo quelle di codice fiscale + indirizzo per raggiungibilità alternativa
(mail/telefono)](https://twitter.com/quinta/status/707197451661393920)".

E ovviamente le informazioni per autenticare l'utente, verso siti terzi
aggiungo io.

Quinta mi ha dato la disponibilità di scrivergli una email in privato per
argomentare meglio i miei dubbi e per chiarire la mia posizione. Ho preferito
la lettera aperta perché, in fondo, sono temi che oggi valgono per lo SPID ma
domani valgono per il sito istituzionale della nostra azienda. Sono temi,
quelli dello sviluppo sicuro, del test, che non hanno ancora fatto presa in chi
gestisce un progetto informatico, salvo poi trovarsi con il sistema compromesso
e lavarsene le mani.

## Lettera aperta

> Stefano, spero non te la prenda se ti pongo qui sul blog qualche dubbio e
> perplessità. Puoi rispondermi se lo riterrai utile, in forma pubblica o
> privata. Io sarò comunque felice che almeno qualcuno in parlamento sappia
> cos'è una honeypot.
>
> Se ti ricordi, via [Twitter](https://twitter.com/thesp0nge/status/707173246723039232), abbiamo parlato dell'opportunità di eseguire
> penetration test periodici sui sistemi che implementano lo SPID e fornire al
> cittadino una prova, che questo meccanismo è messo in sicurezza e monitorato.
>
> Mi hai rimandato alle [regole
> tecniche](http://www.agid.gov.it/sites/default/files/circolari/spid-regole_tecniche_v1.pdf)
> e poi hai argomentato che non ci sono dati sensibili in mano a terzi. A parte
> quelli necessari per il funzionamento del Single Sign On, già questo potrebbe
> essere sufficiente.
>
> Facciamo per un attimo finta che effettivamente gli Identity Provider non
> abbiano nulla dell'utente a casa loro. Io penso che comunque, il flusso delle
> chiamate che staccano il token di autenticazione debba essere testato, e
> debba essere testato periodicamente.
> Cosa succede se, in un rilascio successivo, un'API di un Identity Provider
> permette a chiunque la invochi in maniera non lecita, di farsi dare un
> token valido? E siamo sempre nello scenario, che sappiamo essere non vero,
> nel quale gli IP non hanno neanche un dato dell'utente. Che succede se io
> buco la macchina di uno degli Identity Provider ed ottengo informazioni che
> mi permettono di generarmi OTP arbitrari? O arrivo anche solo ai dati degli
> utenti?
>
> Il penetration test applicativo, l'hardening di sistema, le linee guida di
> sviluppo sicuro, sono argomenti che nel 2016 anche la PMI deve considerare
> quando vuole andare online, figuriamoci una Nazione quando cerca di mettere
> in piedi un meccanismo di Single Sign On con tutti i siti della PA. E' il
> single point of failure per accedere, ad esempio, a dati fiscali, a dati
> anagrafici, a dati pensionistici e non lo trattiamo con la paranoia che
> merita?
>
> Il secondo punto che voglio sollevarti è questo. Prendi spunto dalla PCI.
> Paragrafo 6.6, mi pare. Vengono indicate le misure minime alle quali deve
> sottostare un'applicazione web per essere _compliant_: avere davanti un web
> application firewall e subire penetration test e code review periodiche.
>
> Per lo SPID, perché non avete dato delle linee guida di security alle quali,
> chi si vuole accreditare come Identity Provider, deve sottostare? Avete
> chiesto l'alta affidabilità? Avete chiesto piani di disaster recovery? Avete
> chiesto che i server siano protetti da firewall perimetrali **e** da web
> application firewall? Avete chiesto vengano seguite linee guida di sviluppo
> sicuro? Avete chiesto vengano fatti vulnerability assessment periodici sui
> server e web application penetration test sulle API dello SPID erogate dai
> sistemi coinvolti? Avete chiesto vengano fatte delle code review sul codice?
> Avete chiesto che gli Identity Provider tengano monitorate le API dello SPID
> da un SOC specializzato? Esiste una procedura di disaster recovery nel caso
> di account compromesso?
>
> Non possiamo limitarci a dire che le informazione date agli IP sono poche.
> Quello è il substrato che permette di autenticarsi su tutta la PA. Quello è
> il cuore, bucato quello, entri ovunque.
>
> Ovviamente, se tutte queste linee guida o raccomandazioni di application
> security, sono state date. Benissimo, facciamone menzione. Urliamolo ai
> quattro venti e facciamo vedere che sappiamo portare a casa un sistema
> informativo critico come questo dalla A alla Z. O saremo ricordati solo per i
> milioni sperperati per italia.it.
>
> Un'ultima cosa... spid.gov.it, al lancio con directory listing abilitato e
> server token. Non puoi dire che tanto è un sito vetrina temporaneo, perché se
> qualcuno te lo buca è comunque parte del dominio del Governo Italiano e, un
> po', la figura da cioccolattaio l'avremmo fatta tutti noi.
>
> Con stima professionale
>
> Paolo

Stefano se hai letto questa lettera aperta, puoi rispondere qui sotto nei
commenti. Ne potrebbe venir fuori un bel dibattito. Se preferisci la email,
puoi usare [paolo@codiceinsicuro.it](mailto:paolo@codiceinsicuro.it). Se non
ritieni la tua risposta possa dare valore aggiunto, non c'è problema. Però è
importante che chiunque legga questo post, ed ha la responsabilità di condurre
in porto un sistema web, complesso a piacere, si ponga queste domande. Perché
il prossimo sito compromesso potrebbe essere proprio il tuo, dati sensibili o
meno.

## SSLv3, TLS1.0... le bestie che non debelli mai

[Nelle regole
tecniche](http://www.agid.gov.it/sites/default/files/circolari/spid-regole_tecniche_v1.pdf),
paragrafo 1.2.2.3, vengono ancora indicati. Basta, davvedo, non ne possiamo
più. TLS è solo versione 1.2 ed il web server deve rifiutare i cifrari più
deboli.

Enjoy it!
