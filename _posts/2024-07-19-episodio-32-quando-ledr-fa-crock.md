---
layout: post
title: "Episodio 32: Quando l'EDR fa crock"
author: thesp0nge
featured: false
category: [post]
tags: [newsletter, malware, supply chain]
image:
   feature: episodio_32.png
   author_id:
   author_name:
   author_link:
   link:
comments: true
share: true
---

# Introduzione
Ciao caro lettore. Ero come al solito in ritardo nella creazione di questo
numero della newsletter di cybersecurity più aperiodica dell'universo, quando
Internet si è rotta ancora.

Questa volta sul serio.
Un [aggiornamento](https://www.crowdstrike.com/blog/statement-on-windows-sensor-update/) del software EDR di Crowdstrike ha causato un massivo
disservizio sui client Windows sui quali Falcon era installato. Il problema,
essendo Crowdstrike un leader di mercato, è che questo disservizio ha
interessato i client di mezzo mondo, mettendo in ginocchio banche, treni,
aeroporti e chi più ne ha più ne metta.

Ci sta parlando mezzo mondo, ci sono già meme e video degli influenser che
macinano click, io la chiudo veloce augurandomi che i ricercatori di
Crowdstrike trovino la fix. Il bug purtroppo capita a tutti. Per i clienti,
magari evitate procedure massive di deploy in esercizio senza test. Così, per
dire.

# Dalla Russia con furore

Oggi, [sul suo profilo
Twitter](https://x.com/kaspersky/status/1814227312721768805), Kaspersky l'ha
toccata piano. Non la metterò sulla geo politica, ma come risposta tra
competitor a me sinceramente piace... è sfottò sano.

Arriva però quattro giorni dopo [l'annuncio](https://www.zetter-zeroday.com/kaspersky-lab-closing-u-s-division-laying-off-workers-2/) che il popolare vendor,
competitor di Crowdstrike chiude la sua divisione U.S., licenziando i
dipendenti su suolo americano, dopo che lo stesso governo a stelle e strisce
aveva bandito il software russo sul suo territorio.

Governo che ha altri grattacapi visto che, in un'esercitazione di red team, la
CISA ha penetrato un'infrastruttura federale US e per [5 mesi ha avuto accesso persistentei](https://www.theregister.com/2024/07/12/cisa_broke_into_fed_agency/) ai sistemi senza che venisse rilevata.

Addirittura, l'ingresso iniziale sarebbe avvenuto sfruttando la mancata
applicazione della patch per la vulnerabilità [CVE-2022-21587](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-21587). Ora,
personalmente, io penso che un threat actor non punti a usare Kaspersky, che
tra l'altro ha in Europa un centro per la trasparenza dove permettono audit dei
loro prodotti, però questa è la mia personalissima opinione e ti prego di non
vederla immersa nei tristi scenari di guerra che purtroppo interessano l'est
Europa da più di un anno.

L'avanzata di codice malevolo, non è qualcosa che purtroppo ha momenti di pausa
e, strumenti come Crowdstrike, provano ad arginarla ma sono sempre di più i
nuovi codice malevoli che hanno come vittime banche e ospedali.

[È quello che è successo](https://arstechnica.com/tech-policy/2024/07/everythings-frozen-ransomware-locks-credit-union-users-out-of-bank-accounts/) in California a Patelco e Change Healthcare un paio di settimane fa.

# Supply chain e dintorni

Poteva essere un altro periodo di fuoco nel mondo delle librerie di terze
parti, [se i ricercatori di JFrog security](https://jfrog.com/blog/leaked-pypi-secret-token-revealed-in-binary-preventing-suppy-chain-attack/) non si fossero accorti di un access
token con diritti amministrativi smarrito in container Docker.

Questo token consentiva l'accesso ai repository Github di PyPi, Python e della
Python Software Foundation. Se sfruttato da un attaccante avrebbe potuto
facilmente portare a nuove backdoor nascoste nelle librerie python che tutti
noi utilizziamo ogni giorno.

Una cosa simile è successa a fine giugno al progetto javascript Polyfill. Il
Sansec security research team [ha scoperto](https://dev.to/snyk/polyfill-supply-chain-attack-embeds-malware-in-javascript-cdn-assets-55d6) che dei threat actor di origine
cinese, avevano preso il controllo di macchine nella CDN che distribuiva la
libreria javacript, distribuendo codice malevolo attraverso [cdn.polyfill.io](http://cdn.polyfill.io/).

Visto che spesso si dice che l'autenticazione a più fattori può essere
utilizzata per proteggersi da tentativi di frode o di impersonificazione, ti
rimando caro lettore [a questo post di Lorenzo Franceschi-Bicchierai](https://x.com/lorenzofb/status/1808522814372139380?s=46&t=rCov0ibnBsQX3sk_ktJ7hQ) che ci
racconta che Authy, la popolare applicazione utilizzata per la MFA, è stata
bucata e 33 milioni di numeri di telefono sono stati trafugati dagli
attaccanti.

# AI e analisi di malware

Che l'utilizzo dei modelli di intelligenza artificiale legata all'analisi del
codice sia un mio pallino, lo sai benissimo caro lettore. Un paio di edizioni
fa ti ho parlato delle chiacchierate che ho fatto con ChatGPT in un audit che
stavo facendo.

Ecco, i ricercatori di Google Cloud, hanno fatto [due](https://cloud.google.com/blog/topics/threat-intelligence/gemini-for-malware-analysis) [bei](https://cloud.google.com/blog/topics/threat-intelligence/scaling-up-malware-analysis-with-gemini) post sull'uso della
loro AI, Gemini, per l'analisi di malware.

Ecco questo mi affascina, avere un supporto che mi aiuti nel brainstorming, per
l'analisi di codice per cercare di sfruttare l'intelletto umano per guardare il
quadro a 360 gradi astraendo dalla chiamata a strcpy che magari può portare ad
errori, soprattutto in audit lunghi o quando magari la concentrazione cala,
come in queste giornate torride di luglio.

# Off by one

Eccoci qui alla fine di questo numero.

Ti ricordo che esiste [un canale telegram](https://t.me/paoloperegoofficial) legato alla community attorno al progetto Codice Insicuro e che esiste anche il [mio canale YouTube](https://www.youtube.com/@PaoloPerego).

Tornerò a fare ancora video?
Chi lo sa, tu intanto non farti trovare impreparato ed iscriviti.
Alla prossima.
