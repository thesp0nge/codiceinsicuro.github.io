---
layout: post
title: "Apple, gli hacker, l'FBI e l'insana cultura del complotto"
promotion: "Un giudice federale, per conto dell'FBI, vuole sdoganare la backdoor di stato. Ci serve veramente nel 2016?"
modified: 
featured: true
category: [Chiacchiere da bar]
tags: [complotto, csi, snowden, apple, google, fbi, s.bernardino, ios, secure enclave, rsa]
image:
  feature: iphone.jpg
  credit: Sean MacEntee
  creditlink: https://flic.kr/p/dfssw5
comments: true
share: true
---

Diciamoci la verità. Nel nostro immaginario, ci affascina l'idea di essere
dentro un film _di achers_, dove veniamo spiati e dove siamo pedine
inconsapevoli di qualche cospirazione internazionale.

Intendiamoci, magari è effettivamente così. Magari le nostre fantasie più
segrete sono accontentate a nostra insaputa. Magari un nuovo, dio mi perdoni,
captatore informatico[^1], sta intercettando i miei _keystroke_ proprio mentre
sto scrivendo questo post.

O magari semplicemente, no. Magari semplicemente, non esiste alcuna _backdoor_
magica che mi permette di entrare ovunque e spiare la casalinga di Voghera per
scoprire che se la intende con il macellaio della piazza mentre il marito è al
lavoro.

Il caso è, chiaramente, quello dei giganti del'IT,
[Google](https://www.google.com) ed [Apple](https://www.apple.com), contro
l'FBI nel caso dell'attentatore di [San Bernardino](https://en.wikipedia.org/wiki/2015_San_Bernardino_attack).

## I fatti

Lo scorso anno, a [San Bernardino], in Florida, un terrorista con la sua
compagna, abusando di una religione che ha più legami con quella cattolica di
quanto gli stessi _papaboys_ sappiano, compie una strage.

Perché? Perché Dio, quando ha inventato il libero arbitrio, ha lasciato questi
_bug_? Non lo so. Se mi occupassi di filosofia o teologia, mi sarei già sparato
un colpo in testa. Ognuno la pensi come vuole.

Se una persona non vede quanto è bella la vita, nelle piccole cose che lo
circonda, allora è un poverino e non sarà la religione la risposta alle sue
domande.

In breve, pochi giorni fa, un giudice federale degli Stati Uniti d'America,
[ordina ad
Apple](https://assets.documentcloud.org/documents/2714001/SB-Shooter-Order-Compelling-Apple-Asst-iPhone.pdf)
di aiutare l'FBi nella sua richiesta di poter accedere ai dati contenuti
nell'iPhone 5C degli attentatori.

Apple, in un'[accorata lettera di Tim
Cook](http://arstechnica.com/gadgets/2016/02/tim-cook-says-apple-will-fight-us-govt-over-court-ordered-iphone-backdoor/),
dice che non ottemperà a nessuna richiesta del _buraeu_ perché la privacy degli
utenti, priorità, blablabla. Metteteci voi un po' di _buzzword_ per rendere
Apple paladina nel campo dei diritti della privacy.

A Cook si unisce presto, sia [Google](http://mashable.com/2016/02/19/google-apple-fbi/) che addirittura [Snowden](http://www.theguardian.com/technology/2016/feb/18/google-whatsapp-snowden-back-apple-against-fbi). La tesi,
sostenuta dai più è che si aprirebbe un pericolo precedente se Apple dicesse sì
all'FBI.

Al terzetto si è aggiunto [John
MCAFEE](http://www.businessinsider.com/john-mcafee-ill-decrypt-san-bernardino-phone-for-free-2016-2)
che si è offerto di violare il device a gratis per l'FBI che si è dimostrata
incapace di assumere le persone giuste.

## L'italica reazione

Nei gruppi Facebook e nella stampa generalista, non si è, ovviamente, capito
nulla dal punto di vista tecnico. Ci si è lanciati in voli pindarici di cui
qualche chicca:

* "Apple mette apposta degli 0 day in iOS e poi vende gli exploit alle agenzie governative"
* "Cosa cazzo vuole a violare un maledettissimo iPhone 5C"[^2]
* "Apple lo ha già fatto e questa è una trovata congiunta per farsi pubblicità"

Ovviamente, se chiedi a questi fan del complotto, di darti qualche link a
supporto delle loro tesi, ti imbarcano in cazzate di come Snowden abbia già
detto tutto anni fa, di come non ci si possa affidare ad Apple e di come io
sia, visto che non mi sono accodato al pensiero main stream, un ignorante
credulone che ciecamente crede a tutto quello che gli viene detto.

Komplotto!!!

## Tecnicalia

Leggete [questo
post](http://blog.trailofbits.com/2016/02/17/apple-can-comply-with-the-fbi-court-order/)
se volete farvi un'idea con qualche bit tecnico.

I contenuti di quel telefono, sono cifrati con una combinazione del PIN[^3] e
di una chiave di cifratura conosciuta da Apple e cablata al momento della
costruzione del device. Sembrerebbe in qualche EPROM, in quanto il wipe da
remoto, non fa altro che reinizializzare la chiave stessa.

Alzo subito una bandierina. l'FBI può accedere a quei contenuti in altri due modi:

* il backup di iTunes sul Mac o sul PC dell'attentatore
* iCloud, se attivo

Non ci ha pensato? Boh. Evidentemente dobbiamo escludere questa pista, perché
l'FBI ha chiesto ad Apple, in prima istanza, un sistema per poter fare il
bruteforce del PIN del telefono.

Problemino. Con i vari aggiornamenti di iOS, Apple ha introdotto un delay
variabile che aumenta all'aumentare del PIN incorretto e la possibilità di fare
il wipe del device a fronte di troppi tentativi sbagliati. Ahia.

A questo punto, il solerte ente governativo [chiede aiuto ad
Apple](https://assets.documentcloud.org/documents/2714001/SB-Shooter-Order-Compelling-Apple-Asst-iPhone.pdf).
In soldoni, viene chiesto ad Apple di fornire un modo per fare bruteforce del
PIN, dando la possibilità di inserire i tentativi via cavo, bluetooth, wifi e
qualsiasi altro protocollo usato dal device.

Visto che, anche avendo a disposizione fisicamente il supporto, essendo cifrato
il contenuto, l'FBI vuole proprio indovinare quei 4 numerini. Ve lo state
immaginando, vero, il potere che verrebbe dato nel poter rompere 4 cifre, in
maniera arbitraria anche da remoto?

[In questo articolo, il
Times](http://time.com/4229601/real-reason-apple-is-fighting-the-fbi/) analizza
quali possono essere i reali motivi per cui l'FBI non si arrangia da sola e
chiede aiuto, in maniera ufficiale ad Apple, attraverso un giudice. Rendere
legale il tutto.

L'FBI vuole poter operare nella legalità ed avere modo di sbloccare gli iDevice
di sospettati, senza troppi problemi.

Vi lascio anche un bell'articolo del [NY
Times](http://www.nytimes.com/2016/02/19/opinion/why-apple-is-right-to-challenge-an-order-to-help-the-fbi.html),
che potete leggere per vostro approfondimento.

Io credo Apple abbia fatto bene a non voler collaborare con il bureau. In
molti, stanno incensando la crociata a favore della privacy dei propri utenti
della casa di Cupertino. Ecco, io non credo sia filantropia quella di Apple.

In un'epoca dove il dato è diventato l'asset, e chi controlla il dato controlla
il mercato, Apple vuol _vendersi_ come paladina della privacy, ma credo sia più
interessata alla eco mediatica di questa battaglia.

## L'angolo del libro

**ATTENZIONE**: i link che trovate da questo momento, fino alla fine del post, contengono il codice di affiliazione del blog ad Amazon. Quindi se visitate, e comprate poi il libro, contribuite al progetto [Codice Insicuro]({{site.url}}).

Alla fine, iOS e l'hardware dell'iPhone sono delle belle gatte da pelare. Ho trovato su Amazon, questo libro, 
<a rel="nofollow" href="http://www.amazon.it/gp/product/159327601X/ref=as_li_ss_tl?ie=UTF8&camp=3370&creative=24114&creativeASIN=159327601X&linkCode=as2&tag=codicinsic-21">iOS Application Security: The Definitive Guide for Hackers and Developers</a>.

<iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=codicinsic-21&o=29&p=8&l=as4&m=amazon&f=ifr&ref=ss_til&asins=B01BLVZ3IK" style="width:120px;height:240px;padding-right:0.75em;float:left" scrolling="no" marginwidth="0" marginheight="0" frameborder="0"></iframe>

Viene illustrato il modello di sicurezza di iOS e come scrivere codice sicuro in Obj-C. Viene da se, che per capire come scrivere del buon codice, si devono vedere le falle più comuni delle applicazioni per iPhone ed iPad.

Sono a pagina 20, l'ho iniziato da un paio di giorni. Tuttavia, l'indice è molto promettente. L'approccio è quello di fornire gli strumenti per fare del buon reverse e della buona code review ad un'applicazione qualsiasi. L'autore ha promesso che parlerà di come illustrare anche i meccanismi di difesa di iOS. Per ora, è un buon investimento, anche se mi riservo di finirlo prima di farne una recensione completa.

## Off by one

Si chiude una settimana concitata dove, come [con il caso di Hacking Team]({{site.url}}/blog/lattacco-ad-hacking-team-e-la-scena-forcaiola-italiana), il panorama generalista italiano si scopre appassionato di cyber intrighi, exploit, 0 day. 

La passione è tanta, le voci competenti poche. Chiudo quindi citando il post di [LK su CheFuturo](http://www.chefuturo.it/2016/02/no-backdoor-apple-a-fbi/) che cita a sua volta Benjamin Franklin:

> "Chi è disposto a sacrificare la propria libertà per briciole di momentanea
> sicurezza, non merita né la libertà né la sicurezza. E le perderà entrambe".

Enjoy it.

[^1]: lo faccio solo per te [Francesco](https://www.facebook.com/francesco.micozzi)

[^2]: questa affermazione mi spaventa più delle altre perché viene da un CEO di
      una società di security che fa dell'analisi dei dispositivi mobili il suo
      core business.

[^3]: evidentemente l'attentatore l'ha impostato.
