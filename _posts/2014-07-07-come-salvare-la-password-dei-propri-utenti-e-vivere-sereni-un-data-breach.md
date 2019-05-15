---
layout: post
author: thesp0nge
title: "Come salvare la password dei propri utenti e vivere sereni un data breach"
modified: 2014-07-07 07:56:19 +0200
category: [Sicurina]
tags: [bcrypt, sha512, sha256, java, password]
image:
  feature: lock.png
comments: true
share: true
---

Ok, nessuno vive serenamente un data breach però ci sono accorgimenti che
possono mitigare parzialmente un'intrusione nel nostro backend.

La giornata parte alle 7 AM con una rassegna delle principali fonti sul web e,
come nei nostri peggiori incubi, il nostro nome è accanto ad un link su
[pastebin](http://pastebin.com) dove viene sbandierato ai quattro venti il
nostro database degli utenti.

Effettivamente, hai avuto risvegli migliori.

## I vari stadi della crisi

Ho provato a buttar giù, in ordine crescente, una lista di quanto sei nei guai.
Si va dal **tanto** al _potresti essere quasi tranquillo_.

Mettiamo un po' qualche vincolo però. Se la tua applicazione web non da
all'utente dei vincoli di complessità alla quale la password deve sottostare
allora azzera tutto... potresti averla offuscata con qualsiasi algoritmo ma se
la password è "canebagnato12" o "pippopippo123" allora un attacco a forza bruta
impiegherà non più di qualche ora per indovinare la password.

### Cosa farà l'attaccante

L'attaccante ti ha appena bucato, non importa per ora come[^1]. Ha un file con
delle username e altre informazioni tra cui la password cifrata (ma averla in
chiaro è ahimé un'opzione) ed un salt (opzionale).

> Le funzioni di hash, sono funzioni matematiche _one way_ che prendono un
> valore e lo trasformano in un altro valore, presumibilmente in un dominio
> ristretto se confrontato a quellodi partenza.

Le funzioni di hash sono usate ad esempio per calcolare l'indice dove
memorizzare un dato in una struttura dati chiamata Hashmap.

Queste funzioni hanno un limite. Essendo l'alfabeto di destinazione più piccolo
del sorgente, nasce il fenomeno delle collisioni. La collisione è quando la
stessa funzione di hash, applicata a due input diversi, restituisce lo stesso
valore in output.

Gli algoritmi della famiglia RC, MD e SHA sono **particolari** funzioni di hash
studiate per minimizzare il problema delle collisioni. Se qualcuno pensa che
una funzione di hash è una funzione di crittografia, non sa di cosa sta
parlando. Ci sono algoritmi di offuscamento che sono anche funzioni di hash, ma
non è detto che tutte le funzioni di hash sia anche un algoritmo di
offuscamento. Eviterei di usare la parola crittografia... perché lo scopo della
crittografia è avere un sistema sicuro per lo scambio di informazioni che
permetta ai legittimi interlocutori di mettere in chiaro il testo. Le funzioni
di _secure hashing_ non hanno questo obiettivo. Una volta offuscato, il dato
resta offuscato e l'unico modo di metterlo in chiaro è un attacco di forza
bruta o con dizionario.

Eccoci al dunque. L'attaccante ha una serie di hash, che non sono reversibili
per definizione. Nel suo arsenale d'attacco di saranno un bel po' di dizionari
contenente password di uso comune alle quali verrà applicato l'algoritmo di
hash per vedere se il valore offuscato è nel database appena trafugato.

Il particolare algorito di hash viene desunto dalla lunghezza dell'hash stesso.
Quindi è un'informazione che dobbiamo dare per scontata sia in mano a chi ci
attacca.

Terminati i dizionari, si parte enumerando tutte le possibili combinazioni di
lettere e numeri. E qui è solo una questione di tempo (tranne in un caso).

### Fuori concorso: hai creato un tuo meccanismo di cifratura

Esiste una regola aurea nel mondo dell'IT security. **Mai, mai, mai**
inventarsi un metodo di cifratura fatto in casa. Gli algoritmi in uso sono
stati elaborati da scienziati con profonde basi matematiche e sono stati
rivisti più e più volte da comitati fatti di matematici ed esperti di
criptoanalisi. Se tu te lo inventi da solo e poi dici di fare bagni di umiltà a
me che te lo faccio notare, forse è il caso che tu riveda la definizione stessa
di umiltà.

Questo è un fuori concorso, perché se tu hai giocato a fare il criptoanalista
in cerca di successo, dai pure per scontato che un attaccante vero con qualche
skill abbia già capito come funziona il tuo algoritmo rivoluzionario.

Fai scadere subito tutti gli account forzando un reset password e prepara un
post pubblico di scuse con su il cappello con le orecchie da asino. Se Sgarbi
fosse nella stanza con te sentiresti eccheggiare le parole: "capra, capra,
capra!".

### defcon 1: le tue password sono memorizzate in chiaro

Vai nella stanza insieme al tuo amico che si inventa gli algoritmi di cifratura
ed ascolta con lui il commento tecnico di Sgarbi al tuo operato.

Non ci sono tante giustificazioni nel salvare la password di un utente in
chiaro se non una serafica ignoranza. Essendo routine già pronte ed il web
pieno zeppo di esempi di come usare una cifratura X ad una password, volerla
salvare in chiaro è il semplice mix tra menefreghismo ed ignoranza.

Ingiustificabile.

Come può un utente scoprire se ha dato la password in mano ad un cialtrone
siffatto? Prova a seguire il link del reset password, se l'applicazione ti fa
scadere la password e ti da un link per fare il reset password allora hai
qualche speranza. Se ti arriva una mail con la password in chiaro nel corpo del
testo, rispondi alla persona citando Sgarbi. Poi mi cercherei il sito del
competitor.

Tira giù il sito e metti al suo posto una pagina di scuse dove ti dichiari un
cialtrone ed avvisi tutti che hai messo alla berlina delle password che sono
state magari usate anche in altri siti. Dici che, nonostante su linkedin tu sia
un senior, è la prima volta che scrivi una web application e giuri giuri giuri
non rifarai più una cappella del genere.

Poi rimetti in piedi il portale come dio comanda.

### defcon 2: le tue password sono offuscate senza salt

Allora aggiungere un salt random nel momento in cui viene applicata la funzione
di hash alla password è sicuramente un'ottima cosa. Perturba l'input quanto
basta per rendere un attacco a dizionario inutile e un attacco a forza bruta
veramente difficile, visto che devi attaccare sia la password che il salt
quindi le combinazioni lievitano.

Certo è, che se il salt è nello stesso DB delle password e quindi finisce in
mano all'attaccante, aggiungerlo non rende la tua ricetta molto più gustosa,
anzi. Il salt va protetto e memorizzato in un luogo diverso dall'hash.

Se l'attaccante ha in mano anche l'hash allora il tuo livello di nervosismo è
legato all'algoritmo di cifratura utilizzato.
Se l'attaccante non ha in mano l'hash, diciamo che ragionevolmente puoi stare
un po' più tranquillo.

In entrambi i casi, applicazione offline, password reset forzato e post di
scuse ai tuoi utenti (che di solito sono i tuoi clienti paganti).

### defcon 3: le tue password sono offuscate con SHA1 o MD5 con il salt

Dunque MD5 e SHA1 erano il top... forse una decina d'anni fa. Il problema è che
lo sviluppatore medio ha sentito questi nomi all'Università e li ha associati
al nome password e non si è mai evoluto.

Wang e Yu, hanno pubblicato nel 2005 [un paper che parla di come produrre una
collisione per
MD5 e SHA1](http://www.infosec.sdu.edu.cn/uploadfile/papers/How%20to%20Break%20MD5%20and%20Other%20Hash%20Functions.pdf),
spiegato anche in [questo sito](http://www.mscs.dal.ca/~selinger/md5collision/)
dove vengono portati anche dei scenari d'attacco basati sull'uso delle hash
nella firma di programmi.

Ne parla anche [Shneier sul suo
blog](https://www.schneier.com/blog/archives/2005/02/sha1_broken.html), MD5 e
SHA1 **non** devono essere usate per offuscare la password, per creare una
signature per un sorgente anzi, meglio... **non** devono essere più usate.

**Scordatevi SHA1 e MD5** e mi spiace se questa affermazione forte vi possa far
pensare che io sia uno spocchioso arrogante, ma il fatto è che questi due
algoritmi di hash non sono sicuri. Period. E questo sottolinea come una
funzione di hash non per forza è sicura.

Detto questo... il problema delle collisioni deve convincervi a non usarli in
codice reale. In realtà un attaccante della collisione se ne importa
relativamente.

Cambiare da SHA1 a SHA256 o SHA512 equivale a cambiare... una costante. Quindi
lato sviluppatore, dovete solo preoccuparvi di cambiare la dimensione della
colonna del database.

{% highlight java %}
MessageDigest md = MessageDigest.getInstance("SHA-1");
String text = "This is some text";
md.update(text.getBytes("UTF-8"));
byte[] digest = md.digest();

// SHA-256
MessageDigest md = MessageDigest.getInstance("SHA-256");
String text = "This is some text";
md.update(text.getBytes("UTF-8"));
byte[] digest = md.digest();

// SHA-512
MessageDigest md = MessageDigest.getInstance("SHA-512");
String text = "This is some text";
md.update(text.getBytes("UTF-8"));
byte[] digest = md.digest();
{% endhighlight %}

In questi esempi il salt va accodato al testo da mandare in pasto alla classe
[MessageDigest](http://docs.oracle.com/javase/8/docs/api/java/security/MessageDigest.html)

Diciamo che puoi anche non mettere offline il sito, però una pagina dove ti
scusi dell'incidente è dovuta. Forza il cambio password a tutti e cambia il
metodo di offuscamento... cambialo in SHA512 già che ci sei.

### defcon 4: le tue password sono offuscate con SHA256 o SHA512 con il salt

Ok, ci sei quasi.
Il metodo di cifratura è quasi quello ottimale.

Per un attaccante un attacco a dizionario è sempre possibile nel caso di
password senza vincoli di complessità e un attacco di forza bruta se hai usato
un salt è veramente complesso.

Puoi stare quasi tranquillo.

Comunque comunica ai tuoi clienti quello che è successo e forza il cambio
password per tutti. A livello di codice puoi stare dove sei e non fare
modifiche, se però vuoi usare
[bcrypt](http://www.mindrot.org/files/jBCrypt/jBCrypt-0.2-doc/), bhé allora
sarebbe il top.

### defconf 4 e mezzo: le tue password sono offuscate con bcrypt o hai usato oauth

Ok, ci siamo. Stai usando
[bcrypt](http://www.mindrot.org/files/jBCrypt/jBCrypt-0.2-doc/). Questo ti
mette al riparo dall'aumento della potenza di calcolo degli strumenti usati per
l'attacco e quindi sul fatto che gli attacchi a forza bruta diventeranno sempre
più veloci man mano che [l'hardware crescerà in
potenza](http://codahale.com/how-to-safely-store-a-password/).

Ti mette al sicuro sul fatto che un attacco a forza bruta abbia successo...
tendenzialmente sì. Se hai permesso cmq "pippopippo12" come password lì te la
sei andata a cercare, però.

Io farei una pagina in risposta che spiego cosa è successo ed il dettaglio
tecnico sul fatto che sia stato usato bcrypt con un salt generato con le API di
Bcrypt e memorizzato in un posto a parte. **Suggerirei** il cambio della
password ma non forzerei un reset massivo.

### Checklist pre disastro

Ma prima di andare online, per evitare di bruschi risvegli, cosa è opportuno fare?
Vediamo una checklist possibile.

* hai validato tutto l'input che viene passato al database?
* hai utilizzato i
  [PreparedStatement](http://docs.oracle.com/javase/8/docs/api/java/sql/PreparedStatement.html)
  usando i placeholder per inserire i valori messi dall'utente?
* hai usato BCrypt per offuscare la password nel DB?
* hai applicato un salt generato in maniera sicura con le API di BCrypt?
* hai memorizzato il salt in un database diverso da quello degli hash?
* hai fatto un penetration test alla tua applicazione prima di andare online?

### Off by one

Se ci avete fatto caso, a parità di algoritmo, quello che veramente vi salva è
avere dei vincoli di complessità alla password. Una password non deve essere
una parola presa da un dizionario, deve avere una lunghezza adeguata e deve
contenere il solito mix tra alfanumerici e caratteri speciali come %, $, £, &,
/, ! etc.. etc...

Io sono un fan delle password composte da più parole quindi permetterei
l'inserimento di una stringa arbitraria come password, tanto voi dovete
memorizzarne il valore offuscato da un'hash, quindi di lunghezza costante.

Sfido chiunque a trovare una password come "io ho un cagnolone bagnato come
password perché mi sento 31337", con un attacco a forza bruta.

Nel vostro codice non inventatevi la crittografia ed usate bcrypt.

Per il resto, enjoy!

**UPDATE**: grazie [alor](https://twitter.com/AlbertoOrnaghi) per aver
segnalato il typo nella checklist... ovviamente i salt vanno messi in un posto
diverso dagli hash.

[^1]: in realtà capire come ti ha bucato per te è vitale. Quest'informazione è
      il primo punto dal quale applicare patch e fare hardening. Ovviamente prima di
      tornare on line un penetration test applicativo è molto più che suggerito.
