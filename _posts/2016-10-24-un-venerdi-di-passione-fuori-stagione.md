---
layout: post
title: "Un venerdì di passione fuori stagione"
promotion: "Lo scorso venerdì, una remote privilege escalation su tutti i kernel Linux dal 2007 in poi ed il più grande attacco DDoS della storia. Ma tre giorni dopo il Web è già risorto."
modified: 
featured: false
category: [post]
tags: [ddos, dirty cow, linux kernel, iot, dns]
image:
  feature: golgota.jpg
  credit: Sandro Lombardo
  creditlink: https://flic.kr/p/H7Bu1u
comments: true
share: true
---

Lo scorso venerdì, una remote privilege escalation su tutti i kernel Linux dal
2007 in poi ed il più grande attacco DDoS della storia. Ma tre giorni dopo il
Web è già risorto

Mentre ero impegnato tra le slide del prossimo
[HackInBo](https://www.hackinbo.it) e la routine di un pigro venerdì, ci hanno
pensato milioni di caffettiere connesse al web a dare un po' di pepe alla
giornata.

Guardate con sospetto il _social media manager_ che con entusiasmo vi vuol
vendere come feature essenziale, quella che la vostra macchinetta del caffè,
deve essere connessa ad Internet per controllare l'ora con l'orologio nucleare
sito alle isole Fiji per prepararvi la colazione alle ore sette, zero zero
secondo il fuso orario di Settala, Premenugo - Milano.

Sì perché quella feature fantastica, quel desiderio di interconnessione totale,
che vuole ad esempio che la vostra macchina sia sempre agganciata a Spotify,
incurante di una cosa chiamata radio, per mettere _like_ a tutto, è una
pantagruelica cretinata.

Non me vogliano gli amanti del social ad ogni costo, oppure, facciamo così,
vogliatemene pure, me ne farò una ragione. I device sono progettati **male**
per essere connessi ad Internet per dare servizi aggiuntivi.

Questa mala progettazione si sta ripercuotendo nell'uso di device come parti
attive in attacchi di tipo _denial of service_ distribuito.

Il pattern è molto semplice, quasi banale se vogliamo. Infetto il device,
proprio come faccio per un PC, magari mandando un malware che mi aiuta a
trovare le credenziali di accesso, ne prendo il controllo e alla fine mi
ritrovo con un elaboratore in miniatura da usare alla bisogna. Ora, pensate per
un attimo a quanti device connessi ci sono ormai nelle case; è un attimo
arrivare a cifre a sei zeri. Immaginate ora, se facessi mandare un solo
pacchetto TCP verso una porta a caso, diciamo la 53, quella del servizio di
risoluzione dei nomi, il DNS, di un provider.

I DNS di quel provider si troverebbero a gestire una mole di traffico
nell'ordine di qualche Gigabyte al secondo; mole di traffico che possiamo
equiparare a del rumore che impedisce alle richieste lecite di essere servite.

E il pasticcio è fatto. Telecamere di sorveglianza, piccoli elettrodomestici,
router di casa, si improvvisano per una sera attaccanti e tagliando fuori dalla
rete i server di [Github](https://github.com), [Twitter](https://twitter.com)
solo per citarne due. O meglio, sono stato impreciso. Non hanno tagliato fuori
dalla rete, [mezza costa orientale degli Stati Uniti](#), i server erano ancora
lì, ignari ed inoperosi.

Tanti piccoli elettrodomestici, hanno impedito ai
nostri laptop, ai nostri cellulari, di parlare con l'agente che dirige il
traffico per chiedere _"ehi, dove devo andare per visitare www.twitter.com?"_.

Hanno impedito che i nostri dispositivi avessero in risposta, _"guardi, vada su
34.211.2.89"_.

Paradossalmente se i nostri device avessero avuto nel loro file
```/etc/hosts```, questa informazione, non ci saremmo accorti di nulla. Sul
perché in realtà il DNS serva e non si possa avere e manutenere un file hosts
di milioni di entry, non mi soffermerei. Però per la prossima volta, un file
hosts di fallback con almeno gli indirizzi che uso di più almeno non mi fanno
buttare una giornata di lavoro.

Un po' come quando non va Google Maps e ti devi affidare alla cartina.

## Dirty Cow - CVE-2016-5195

Come se non bastasse la nostra caffettiera, anche il kernel di Linux ci si
mette. Venerdì è stato il giorno di [Dirty Cow](http://dirtycow.ninja), una
vulnerabilità sul meccanismo che gestice la copy-on-write (COW) e che permette
ad un utente, non privilegiato, di sovrascrivere **qualsiasi** file sul
sistema, a cui lui abbia accesso in lettura.

Il bug esiste dalla versione 2.6.22 (rilasciato nel 2007) ed è stato corretto
lo scorso 18 Ottobre. Direi quindi che i sistemi Linux sul pianeta afflitti da
Dirty Cow, si aggirano attorno al 90%. Così, a spanne.

C'è una [PoC
funzionante](https://raw.githubusercontent.com/dirtycow/dirtycow.github.io/master/dirtyc0w.c)
ed un [video](https://asciinema.org/a/03vjb3711y24wszr9we7y4f0b) che mostra
come sfruttare questa vulnerabilità.

Immaginate l'impatto che può avere su un server Linux sul quale voi avete messo
un sito aziendale in hosting condiviso, perché qualcuno ha messo in testa al
vostro IT Manager che _cloud è bello, senza se e senza ma_, Immaginate se
l'ultimo degli utenti che ha una shell su quel server, diventi improvvisamente
root. Quel qualcuno ora dirà al vostro IT Manager che root ha accesso anche ai
vostri dati?

Nel week end, non ho avuto troppo tempo per spippolare sulla
[PoC](https://raw.githubusercontent.com/dirtycow/dirtycow.github.io/master/dirtyc0w.c)
e trasformarla in qualcosa di più serio. Dovrete quindi fare da soli, se volete
diventare root su un server Linux qualsiasi. Ah, importante:

* l'exploit non lascia segni
* se il vostro utente ha accesso in lettura a quel file, l'exploit funziona al
  100%

Potete trovare tutti i dettagli su Dirty Cow,
[qui](https://github.com/dirtycow/dirtycow.github.io/wiki/VulnerabilityDetails),
se oggi riuscite ad arrivare a Github *grin*.

## Angolo della filosofia spiccia e populista !!111!!11

Social è bello. L'essere umano è nato per raggrupparsi in gruppi sulla base di
gusti personali e simpatie. Questi gruppi si intrattengono in chiacchiere, che
è il motore di una società sana.

Ecco, da quanto sarà l'uomo presente sulla Terra? Facciamo n mila anni che non
sbagliamo. Sono n mila anni che l'uomo è social, avevamo proprio bisogno di
Facebook?

Come tutte le cose, anche i social network e la connessione al web va presa con
moderazione. Altrimenti, gli scenari di _Brave New World_, da romanzo,
diventano un sinistro presagio.

Enjoy (con una birra tra amici in un pub)!!11!1!
