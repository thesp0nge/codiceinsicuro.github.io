---
layout: post
author: thesp0nge
title: "LastPass security breach e le tue password nel cloud"
promotion: "LastPass è stato appena bucato, davvero metteresti le tue credenziali nel cloud?"
modified: 
featured: false
category: [under]
tags: [cloud, sicurezza informatica, password manager, password, attacco informatico]
image:
  feature: doors.jpg
comments: true
share: true
---

2014, Lifehacker pubblica un post profetico: [_Is LastPass Secure? What Happens
if It Gets
Hacked?_](http://lifehacker.com/is-lastpass-secure-what-happens-if-it-gets-hacked-1555511389).
Nell'articolo si cerca di smorzare un po' l'allarmismo e di buttarla in
caciare. LastPass ha subito un attacco nel 2011, ma lo **ha notificato
subito**. Certo i dati erano andati, però ci ha avvisati. L'articolo dice che
bisogna sempre abilitare la two factor authentication per accedere al proprio
vault e secondo me il numero di persone che hanno abilitato la doppia
autenticazione è in % simile a quelli che leggono l'informativa sulla
[#cookielaw](http://www.cookielaw.org). 

Gira che ti rigira, sta di fatto che il 15 Giugno 2015,
[LastPass](https://www.lastpass.com) è costretta ad uscire con un post dove
[dice di essere stata
bucata](https://blog.lastpass.com/2015/06/lastpass-security-notice.html/).

> The investigation has shown, however, that LastPass account email addresses,
> password reminders, server per user salts, and authentication hashes were
> compromised.
> ...
> Because encrypted user data was not taken, you do not need to change your
> passwords on sites stored in your LastPass vault. As always, we also
> recommend enabling multifactor authentication for added protection for your
> LastPass account.

Ora, io penso che mettere _Giugno2015_ come password sia da ritardati, tanto
vale non mettere nulla. Tuttavia penso anche che mettere tutti i propri segreti
sul cloud sia ancora peggio. E' un po' come mettere la chiave della propria
porta blindata appesa alla finestra, protetta da un vetro.

Perché? Perché questa smania di pensare che il cloud sia qualcosa di sicuro.
Perché questa smania di pensare che i vostri dati sono gestiti meglio se
ridondati in chissà quanti e quali datacenter sparsi per il mondo.


> Ne avevamo già
> [parlato]({{site.url}}/blog/netcrash-tensione-ai-contorni-della-nuvola/). Il
> cloud non è sicuro, vi fa risparmiare soldi in termini di manutenzione del
> server ma non vi garantisce nulla sulla protezione dei dati che gli affidate.

## Ma io ho mille password diverse, come faccio?

Lo so, sto per dire quello che potrebbe sembrare un'eresia, ma il posto più
sicuro dove io memorizzerei le password è il mio device.

Una soluzione _quick win_? Il file di testo. Sento già le urla disperate, spero
non del pubblico che felice posta sui social network quando non è a casa o dove
lascia i figli o che usa servizi online per memorizzare le chiavi di accesso.

Si, un file di testo. Il mio si chiama ```password.txt.gpg``` ed è memorizzato in
```/Users/thesp0nge/Documents/01_Personal\ Stuff```. Il mio file di testo è cifrato
con [GPG](https://gnupg.org). La mia passphrase è lunga 34 caratteri, spazi
compresi.

Come memorizzare una password di 34 caratteri? Semplice, scegli qualcosa che ti
ricordi. Può essere la formazione della tua squadra di calcio o un verso di una
poesia o di una canzone.

> £edxs%R4rs è una buona password? **NO**

In barba a tante credenze popolari, la complessità della password non è
qualcosa di tecnologico. Il motivo è semplice. Quando stiamo cercando di
indovinare una password, con un tool come [John the
Ripper](http://www.openwall.com/john/) e fallisce l'attacco basato su un
dizionario, vengono provate tutte le permutazioni possibili di stringhe di
caratteri alfanumerici più caratteri speciali.

_Prima o poi_, anche £edxs%R4rs cadrà. Una password come _"Tanto tuonò che
piovve"_ invece è resistente ad un attacco a forza bruta, direi quasi
inattaccabile.

## Threat modeling

Per attaccare il mio file di testo contenente tutte le password, dovete nell'ordine:

* bucare il mio Mac, se non ho perso il device o lasciato incustodito. Ma il
  mio Mac è regolarmente patchato, con un antivirus installato e regolarmaente
  aggiornato e con il sistema di firewall locale di OS X attivo. Certo, sono
  vulnerabile a 0-day. Vuol dire che un attaccante deve comprare uno 0 day per
  attaccare il mio Mac. Scenario non impossibile ma improbabile.
* cercare di indovinare la mia password di accesso alla macchina, se ho perso
  il device (che ha il disco cifrato). E qui non è una password da dizionario ed
  ho un job di John the ripper che prova a vedere quanto ci si impiega a
  romperla. L'ho cambiata 2 mesi fa. Cambierò la password prima che john termini.
* una volta ottenuto accesso alla macchina, dovete fare un attacco di forza
  bruta su una passphrase di 34 caratteri (spazi compresi). Dovete iterare 26
  lettere maiuscole + 26 lettere minuscole + 10 numeri + una decina di caratteri
  speciali + lo spazio... il tutto elevato alla 34. Buona fortuna, per i
  prossimi secoli avrete da fare.

## Il mio password vault

Per crearvi un _password vault_ fatto in casa avete bisogno di:

* una buona passphrase. Scegliete una frase che per voi sia facile da ricordare e
  che contenga molte parole. _"Cantami o diva del pelide Achille l'ira funesta"_,
  _"Fatti non foste per viver come bruti"_, _"Notti magiche inseguendo un goal di
  un'estate Italiana"_ sono ottimi esempi per una passphrase. Potete decidere
  una vostra convenzione per le maiuscole, ad esempio ogni parola avrà la prima
  lettera maiuscola. Se la vostra paranoia è a livello 10, il che non è sempre
  un male, potete decidere di sostituire anche le lettere coi numeri ottenendo
  qualcosa come _"F4tt1 N0n F0st3 P3r V1v3R C0m3 Brut1"_. 0 caratteri strani ma
  un tool non la indovinerà **mai**.
* [GPG](http://gnupg.org) installato. Fate riferimento alle istruzioni sul sito
  o del vostro sistema operativo per installare GPG.

Per cifrare il vostro file, lanciate gpg in questo modo:

{%highlight sh%}
$ gpg -c password.txt
Enter passphrase:   <YOUR-PASSWORD>
Repeat passphrase:  <YOUR-PASSWORD>
{%endhighlight%}

GPG, come algoritmo standard quando usa la crittografia simmetrica, attenzione
non stiamo usando una coppia di chiavi, quindi la classica crittografia
asimmetrica che si **deve** usare quando si devono scambiare informazioni su un
canale trasmissivo considerato non sicuro (sì Internet lo è per definizione),
usa [CAST5](https://it.wikipedia.org/wiki/CAST-128).

Su reddit ho [trovato il classico
flame](http://www.reddit.com/r/linux/comments/1l097o/gpg_encryption_strength/)
sul tema _"cast5 è abbastanza sicuro?"_. Bhé io non sono un crittoanalista,
quindi non ho le robuste fondamenta matematiche per analizzare un algoritmo di
cifratura da questo punto di vista. Mi baso sul fatto che, ad oggi, non ci
siano vulnerabilità note e che vi ho raccomandato di usare una chiave bella
tosta e composta da una frase con molte parole.

Quindi, per il nostro vault fatto in casa, CAST5 va benissimo. Sempre meglio
che metterli in cloud.

Per mettere in chiaro i vostri dati, il comando è veramente semplice:

{% highlight sh %}
$ gpg password.txt.gpg
gpg: CAST5 encrypted data
Enter passphrase:<YOUR-PASSWORD>
{% endhighlight %}

Punti di attenzione:

* la passphrase è l'anello debole della catena. Se la scegliete debole sono guai
* dovete proteggere quel file da accessi non autorizzati. Occhio quindi al
  patching della vostra macchina, ad attacchi preparati ad hoc contro di voi (qui
  vi salva solo la paranoia), alla password di accesso al sistema, a cifrare il
  vostro harddisk e a non lasciare mai incustodito il vostro device.

## Off by one

Il cloud è un posto brutto e sporco. Vogliono vendercelo come l'El Dorado
perché ci sono troppi interessi ed un ecosistema di startup che ci sta facendo
sopra business. Per l'utente medio, cloud vuol dire non doversi occupare della
maintenance del proprio server, anche se virtuale. Attenzione, questa la pagate
tutta. Voi non avete il controllo e nel momento in cui io devo memorizzare
qualcosa di sensibile, io **voglio** avere il controllo, soprattutto delle
misure di difesa.

Non sapete neanche quanti flame mi sono subito quando attaccavo qualche
_startup fica 2.0_ che voleva mettere in cloud dati sanitari per fare delle
diagnosi qualcosa di _yo yo social_.

Se non vi va di usare GPG, un buon compromesso è [KeyPass](http://keepass.info)
ma, per favore, per favore... non mettete le vostre password nel cloud.

Enjoy it!
