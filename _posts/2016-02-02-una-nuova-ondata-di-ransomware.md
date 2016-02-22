---
layout: post
title: "Una nuova ondata di ransomware"
promotion: "Fare soldi nel lato oscuro non passa, solo, dal violare i sistemi. Spesso è meglio rendere un PC inservibile."
modified: 
featured: true
category: [Chiacchiere da bar]
tags: [cryptolocker, cifratura, allegati, virus, malware, ransomware, cbtlocker]
image:
  feature: tesla_crypt.png
  credit: The Internet
  creditlink: http://www.google.it
comments: true
share: true
---

Hai sul tuo laptop le foto del bimbo, sereno, mentre ti sorride alla festa
dell'asilo. In una cartella, nascosta, hai il frutto di altro genere di
navigazioni. Sorridono sempre, hanno la maggiore età[^1] e guardano in camera
con aria birichina mentre aspettano l'idraulico.

Un giorno ricevi una mail con una fattura in allegato. Sarà per quella gara.
Non fai neanche caso al testo sgrammaticato, la maggior parte dei tuoi colleghi
non conosce il congiuntivo e non sa quando si usa l'accento grave e quando
quello acuto. Apri l'allegato e...

_"HelpDesk, buongiorno!"_

_"Buongiorno, un cazzo. Ho il disco pieno di file che
non si aprono più. Non riesco a lavorare. Mi si è cambiata anche l'immagine di
sfondo. Cazzo, ne so, delle scritte in inglese... locker... un conto alla
rovescia. Io mica so l'inglese, siamo in Italia, perdinci[^2]. Risolvimi questo
casino."_

_"Si, probabilmente ha preso quel virus che cancella i dati. Mi deve portare il
disco che lo formattiamo. Ce l'ha un backup?"_

_"Ué, io faccio il venditore, copro la Brianza e mezzo Veneto. Ciò mica tempo
di fare il becàp. Ho capito, faccio da solo."_

_Click_

In realtà ti sei appena ricordato che portare il disco in assistenza,
rivelerebbe quella smodata passione per le donne asiatiche che difficilmente si
coniuga con la vendita di valvole termostatiche. Almeno, non nel florido
NordEst. Hai anche letto sul giornale che ci sono questi virus che _cifrano_ il
disco e se non paghi il riscatto non rivedi più i tuoi dati.

_"Cazzo sarà un bitcoin, lo chiedo a mio nipote... quello lì è sempre su
feisbuc"_

## Una storia inventata, ma neanche tanto

In questi giorni, ondate di
[CBT-locker](https://www.reddit.com/r/sysadmin/comments/2tqo8q/cbtlocker_thread/)
e sue varianti, stanno impestando il web. Il veicolo d'infezione può essere,
oltre che la classica mail, una pagina web di un sito compromesso che scarica
il PDF contenente il malware via JavaScript.

Target della campagna, l'ignaro utente. L'anello debole della catena.

> Ma attaccare l'utente medio con questi ransomware paga?

Sembrerebbe di sì, il ThreatPost, nel 2012,
[stimava](https://threatpost.com/ransomware-scams-netting-criminals-33000-day-110812/77200/)
che la cifra giornaliera ricavata da campagne di questo tipo, si potesse
aggirare attorno ai $33.000. [Stime più
recenti](http://www.tripwire.com/state-of-security/regulatory-compliance/pci/cybercrime-is-now-more-profitable-than-the-drug-trade/),
aggiornate allo scorso 2013, danno il CyberCrime, di cui il ransomware è solo
una parte certo, più
[redditizio](https://www.europol.europa.eu/content/eu-serious-and-organised-crime-threat-assessment-socta)
del commercio mondiale di Marijuana, Cocaina ed Eroina messe insieme. Le cifre
parlano di un giro di affari di 3 Trilioni di $.

Cautelarsi è possibile, ma la soluzione tecnologica è solo l'ultimo pezzo.
Bisogna usare il cervello. Non bisogna cliccare su qualsiasi link che cammini.
Controlliamo quello che fa il nostro browser ed evitiamo di andare col PC
aziendale sui siti delle donnine asiatiche.

Aggiorniamo i nostri programmi. Aggiorniamo Silverlight, aggiorniamo Flash,
aggiorniamo Java, aggiorniamo il nostro sistema operativo, aggiorniamo i nostri
browser.

## Off by one

Il mercato della criminalità legata al web, abbiamo visto dati alla mano, paga.
L'impunità non dico che è garantita, ma altamente probabile. Sta a noi
cautelarci, utilizzando lo strumento informatico con criterio.

Nei prossimi post, giocheremo un po' con Mac OS X che, a detta dell'uomo
comune, è sicuro perché è Unix. Vedremo come giocare con il Mandatory Access
Control, vedremo come implementare un meccanismo di controllo delle operazioni
dei nostri processi e vedremo come anche Mac OS X può essere, perché no,
attaccato da un ransomware.

> Hai pagato, ma non rivedi più i tuoi file. Un po' te lo sei cercato.

Molte persone, anche in posti chiave dell'azienda, usano un Mac... non sarebbe
bello, attaccare non solo l'anello più debole della catena, ma anche l'anello
d'oro?

Enjoy it!

[^1]: il porno lo abbiamo guardato tutti. Ci limitiamo al porno che non
      contempla minorenni che, per quanto mi riguarda, dovrebbe sparire dalla
      Rete in tempo zero.

[^2]: ho usato perdinci perché mi sono ricordato essere passato solo un mese da
      Natale
