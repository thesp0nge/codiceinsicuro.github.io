---
layout: post
title: "La cyber ai tempi del SARS-CoV-2"
author: thesp0nge
featured: false
category: [post]
tags: [vpn, consigli, quarantena, security posture, smartworking]
image:
  feature: rainbow.jpg
comments: true
share: true
---

Già, l'Italia da qualche settimana è in quarantena a causa del virus
[SARS-CoV-2](https://www.epicentro.iss.it/coronavirus/faq) che sta modificando
radicalmente le nostre abitudini. Compresa quella, per alcune realtà con
mentalità più _radicate_ in epoche lontane, di recarsi a picchiottare sui tasti
di una tastiera per 8 ore al giorno.

L'Italia scopre lo smartworking e mai poteva scegliere modo peggiore a mio
avviso. In un servizio andato in onda su La7 e che girava su
[LinkedIN](https://www.linkedin.com/posts/paolo-perego_smartworking-asapitalia-growtogether-activity-6645626280765124608-3DOv)
oggi, più del 50% degli italiani intervistati definivano lo smartworking un
disagio.
Ovviamente questo a causa del **perché** la gente sta facendo lavoro da casa, è
ovvio che se non puoi uscire perché lo stato èp in lockdown, il problema non è
dello smartworking ma dell'emergenza sanitaria.

A proposito, per quanto valga la mia parola, state a casa. Andrà tutto bene.
 
## Una buona postura cyber 

Chi era pronto per lo smartworking aveva dotato ai propri dipendenti un
portatile, opportunamente configurato, per poter lavorare. Spesso quella
portatile è anche l'unica postazione di lavoro del dipendente.

Supponiamo di essere in uno scenario del genere dove il security team interno
ha:

* stabilito linee guida per le patch e fatto sì che i device aziendali le
  rispettino
* stabilito linee guida per l'account con una password policy o meglio
  incentivando l'uso delle passphrase o della biometria
* configurato i concentratori VPN aziendali con un'autenticazione a due fattori
* segregato l'accesso alle VLAN sulla base dei profili VPN di accesso
* fatto in modo che ogni portatile aziendale abbia a bordo l'antivirus
  configurato ed aggiornato

Cosa mai potrebbe andare storto?

Oddio in realtà, potrebbero andare storte comunque tante cose, di sicuro però
ci troviamo in una situazione privilegiata, dove l'utente è ragionevolmente
sicuro di accedere alle risorse aziendali utilizzando il proprio router ADSL
personale la cui password di default è 'password' come il primo giorno in cui è
stato installato.

Usciamo un attimo da questo scenario e mettiamoci in quello dove la direttiva
del dipartimento Risorse Umane è stata: "Signori, siamo in guerra. Da domani
per favore, ognuno lavori da casa propria con la propria ADSL."

Ecco qualche consiglio per sopravvivere.

### Fate pause

Sperimenterete da voi che, figli a parte (ne ho 2), sarete molto più concentrati nel vostro spazio rispetto all'ufficio. Almeno a me succede questo. 
Credo di aver migliorato la produttività di molto. 

A patto ovviamente di fare pause: 

* prendere una boccata d'aria, dalla finestra o dal giardino privato se siete fortunati;
* alzatevi ogni ora e muovetevi per 5 minuti
* mantenetevi idratati e non esagerate coi caffè
* mangiate sano che non si può andare in palestra o a correre

Non c'entra con la cybersecurity? Davvero? E chi è l'anello più debole di tutta la catena?

Eh già cari i miei Insicuri, siamo noi l'anello più debole, nessuno escluso. 
L'igene cyber quindi parte da noi, prima ancora che dagli aspetti tecnologici.

### Curate il vostro laptop

Se stai usando il tuo laptop personale per lavorare, assicurati di seguire
l'ABC della sicurezza, passi che questa volta sono proprio **mandatori**.

Installa un antivirus
([Malwarebytes](https://it.malwarebytes.com/mwb-download/) e
[Bitdefender](https://www.bitdefender.it/solutions/free.html) sono quelli che
mi piacciono di più e che uso sulle mie postazioni non basate su
[Linux](https://www.ubuntu-it.org/)).

Applica tutte le patch disponibili e rilasciate dal vendor del tuo sistema
operativo.

La vostra società vi deve aver fornito dei parametri di connessione alla VPN
aziendale, compreso il client suggerito.

### Non accettate le mail da sconosciuti

Se possibile, leggete la posta aziendale da interfaccia web per evitare di
aprire in automatico allegati potenzialmente pericolosi. Fate molta attenzione
ad email che veicolano malware, in particolare:

* conoscete il mittente della mail?
* ha un allegato che non vi aspettate? Se sì, la prima cosa che dovete fare è
  rivolgervi al vostro security team per un feedback. Se la vostra azienda non
  ha un team di security, allora potete scaricare l'allegato e caricarlo su
  [VirusTotal](https://www.virustotal.com/gui/home) per un'analisi prima di
  aprirlo.
* all'interno della mail ha dei link da seguire? Copiate i link su un editor di
  testo e verificate non rimandino a domini strani

Siate sospettosi su qualsiasi cosa differisca dalla vostra routine lavorativa. 

## Off by one

In queste giornate lo ammetto, non ho voglia neanche di studiare per
[OSCE](https://www.offensive-security.com/ctp-osce/). Avrei dovuto lanciare un
podcast e dei video ma mi sono perso in un mood piuttosto cupo.

Mi do qualche giorno per organizzare le idee, poi dovrebbero esserci alcune
novità, spero interessanti all'orizzonte per tutti voi Insicuri là fuori.

Che dire? Mi aiutereste ad invitare quante più persone, dicendo loro di
iscriversi alla [newsletter](https://codiceinsicuro.it/newsletter/) per non
perdersi neanche un post, un video o una puntata dei possimi podcast?

Enjoy it!
