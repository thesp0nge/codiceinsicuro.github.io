---
layout: post
author: thesp0nge
title: "32 Milioni di account twitter trafugati: ancora problemi con le credenziali"
promotion: "32 Milioni di account twitter trafugati: ancora problemi con le credenziali"
modified:
featured: false
category: [News]
tags: [twitter, password, credenziali, attacco]
image:
  feature: twitter_hacked.jpg
comments: true
share: true
---

Sembra sia un periodo caldo per i sistemi di autenticazione là fuori. Nella
giornata di martedì 7 Giugno, Twitter dal suo account per il supporto esce con
questa dichiarazione.


Techcrunch è uscito poche ore fa con un
[post](http://techcrunch.com/2016/06/08/twitter-hack/) che parla di 32 milioni
di credenziali trafugate, insieme alla password offuscata. Credenziali che
sarebbero già in vendita nel Deep Web.

Il sito [leakedsource.com](https://leakedsource.com), un database a pagamento
dei record utente trafugati di recente, ha
[ufficializzato](https://www.leakedsource.com/blog/twitter) la presenza di un
database dedicato a Twitter ed alimentato con i record trafugati da un
sedicente "Tessa88@exploit.im".

Purtroppo il sito permette solo agli account a pagamento di visualizzare
eventuali record trafugati, mentre permette a tutti di fare una ricerca per il
proprio indirizzo email.

[Michael Coates](https://twitter.com/_mwc), security officer di Twitter e nome
noto nel mondo della sicurezza applicativa, ha confermato l'incidente
rassicurando gli utenti che l'elenco trafugato non sarebbe originato da un
breach sui sistemi.


Dovrebbe trattarsi quindi, di un data leak volontario. Un dipendente
insoddisfatto? Errore umano? Un database che si è trovato nel posto sbagliato
nel momento sbagliato? Solo supposizioni.

Di sicuro, in un tweet successivo, Twitter offusca le proprie password con
BCrypt, un algoritmo resistente agli attacchi sulle rainbow table e su quelli
basati sulla forza bruta. Se quindi la vostra password non è come quella di
[Mark Zuckemberg](#), ovvero 'dadada', la sicurezza del vostro account dovrebbe
essere al sicuro.


Comunque, per essere tranquilli, fate una ricerca su
[leakedsource.com](https://leakedsource.com) e se trovate la vostra email
nell'archivio legato a twitter, resettate le vostre credenziali, e magari
abilitate l'autenticazione a due fattori.

Sempre su
[leakedsource.com](https://www.leakedsource.com/blog/twitter#passwords) è
possibile trovare un poco rassicurante elenco delle password in chiaro più
utilizzate. Intramontabile '123456' o la sua variante robusta '123456789';
sembra proprio che la sicurezza del proprio account non sia tra i pensieri
dell'internauta medio.

[Leakedsource](https://www.leakedsource.com/), nel presentare l'elenco, fa
un'affermazione che da qualche indizio sulle modalità di attacco. Le password
sarebbero state collezionate non offuscate e prese direttamente dai browser.
Questo confermerebbe quanto detto da
[Coates](https://twitter.com/_mwc/status/740762909144428544), circa la non
compromissione dei server di Twitter.com.

Probabilmente qualche botnet o qualche malware con a bordo un keylogger.
Attaccare il client è spesso più redditizio di attaccare società che mettono in
campo risorse e denaro per proteggere i propri asset.

Anche l'internauta medio dovrebbe fare lo stesso. Investire in antivirus,
antimalware e consapevolezza e seguire qualche accorgimento base come:

* non aprire link o allegati provenienti da fonti sconosciute
* prima di seguire il link, controllare che quanto visualizzato corrisponda
  all'effettiva URL
* investire qualche soldo in un antivirus e antimalware e tenere aggiornate le
  firme
* rassegnarsi nel non aver vinto l'ultimo modello di smartphone ad una riffa
  alla quale non si era iscritti.

## Parlano di questa compromissione

* [Techcrunch](http://techcrunch.com/2016/06/08/twitter-hack/)
* [Leakedsource.com](https://www.leakedsource.com/blog/twitter)
