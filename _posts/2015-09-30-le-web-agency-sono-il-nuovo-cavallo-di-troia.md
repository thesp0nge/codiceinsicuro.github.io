---
layout: post
author: thesp0nge
title: "Le web agency sono il nuovo cavallo di troia?"
promotion: "Le web agency sono il nuovo cavallo di troia? Grazie a loro gli attaccanti hanno vita più facile? Ahem... sì!"
modified: 
featured: false
category: [Meditazione]
tags: [web agency, application security, outsourcing, security, policy, banfa]
image:
  feature: trojan_horse.jpg
comments: true
share: true
---

_Sorry to be so dramatic_, direbbe il buon Steve ma la realtà è che quando
diamo in _outsourcing_ dei nostri dati o del nostro software da sviluppare,
abbassiamo il nostro livello di sicurezza; mettiamo un bel link debole nella
nostra catena. Link che aspetta solo di essere spezzato.

Un paio di giorni fa, [Anonymous buca alcuni database di Banca Intesa e
Unipol](http://motherboard.vice.com/it/read/degli-anonymous-italiani-hanno-pubblicato-dei-dati-di-banca-intesa-e-unipol).
Ora, dai due istituti nessuna smentita, nessun comunicato forte e la cosa, a me
che sono cliente, fa un pelo incazzare.

Scusate, ho scritto _un pelo_; prometto di non farlo più.

Su ghostbin ci sono i link ad alcuni dati trafugati sia per
[Intesa](https://ghostbin.com/paste/an6ht/raw) che per
[Unipol](https://ghostbin.com/paste/mpdnc/raw). Dati che sinceramente non ho
voglia di verificare per la loro veridicità. Mi basta il silenzio imbarazzato.

Dai link e dal contenuto dei database, **sembra** e lo ripeto ancora in bold
perché questa è assolutamente una mia supposizione, **sembra** che il
denominator comune sia un'agenzia web, il cui CMS pubblicato sul web sia stato
usato come punto di ingresso.

> A questo punto mi chiedo, le web agency sono il cavallo di troia del 2015?

La risposta è sì e lo dico a ragion veduta avendoci lavorato per un anno e
mezzo.

## Al cliente piace l'outsource

Diciamocelo, al cliente piace dare in outsource le cose. Risparmia soldi,
risparmia tempo, risparmia sbattimenti. Al cliente piace. C'è la parola
_risparmia_.

Dando i dati aziendali all'esterno il cliente si espone ad un bel rischio. Non
lo sa. Lo ignora. Non ne ha la più pallida idea. Non ci pensa.

Forse il problema è proprio questo. Quando diamoi nostri dati a terzi, che sia
il sito del supermercato o il sito di un nostro fornitore per un lavoro, non
siamo abituati a pensare che qualcuno possa usare il fornitore come un cavallo
di troia, per arrivare ad informazioni che, difficilmente vrebbe potuto
ottenere.

Paranoia? Cyber Fantasy? Mica tanto, visto l'azione di
[Anonymous](http://motherboard.vice.com/it/read/degli-anonymous-italiani-hanno-pubblicato-dei-dati-di-banca-intesa-e-unipol).

## L'agenzia web: il groviera

Le agenzie web spuntano come funghi. Spesso non sono altro che qualche _pre
sales_ che ha un portafoglio di sviluppatori freelance, sottopagati, ai quali
affidare la parte tecnica. Alcune sono serie e strutturate, hanno esperti in
usabilità, esperti in design ed esperti nella comunicazione. Possono avere
anche ottimi sviluppatori ma la realtà, che vi posso dire per esperienza
diretta è la seguente.

Il carico di lavoro è disumano. Se il workaholism fosse una malattia
riconosciuta dall'INPS, i dipendenti delle web agency non andrebbero mai al
lavoro. Sabato, Domenica, Natale? No way, il cliente ha detto _"voglio il sito
in 3 giorni"_, quindi vuole il sito in 3 giorni. Non esiste la parola _"no"_.
Fate lo stesso coi vostri figli? Spero di no.

Gli sviluppatori sono **sottopagati**. Che siano freelance o dipendenti, lo
sviluppatore (almeno qui da noi) ha uno stipendio inferiore a quello degli
altri team. Nonostante siano le figure che implementano le richieste assurde
del cliente, suffragate da sorrisoni e da _"certo che possiamo realizzare il
sito in 2 giorni visto che 1 è andato via in fuffaware"_ da parte dei project
manager, gli sviluppatori non sono remunerati in maniera adeguata.

Time to market azzerato. Pur di non perdere il cliente, che non sa quello che
vuole ma lo vuole subito, l'agenzia non stima i tempi di realizzazione di un
lavoro nel modo corretto. Di fatto viene garantito al committente un time to
market che, per essere assolto, deve tradursi in un lavoro di infima qualità.

L'unica alternativa è fare il copia, adatta e incolla da siti già svilppati. Se
ci fate caso, infatti non è che il web italiano brilli per creatività.

Il know how di sicurezza **non esiste**. Veniamo al punto che ci interessa di
più. Spesso lo sviluppatore è anche sysadmin, perché spesso l'agenzia mette in
hosting da sé o sul proprio cloud, il prodotto del cliente. Lo sviluppatore
quindi, scrive codice come un matto, evita i test che gli farebbero perdere
tempo, configura l'ambiente e mette in produzione. **Direttamente**.

Firewall? No. Web application firewall? No. Penetration test? No. Code review?
Ah ah ah.

Il risultato? Un attaccante sa che un fornitore di EvilCorp è la _ACME Web_ che
si professa, ovviamente, leader di mercato nel campo della realizzazione dei
siti web. La _ACME Web_, prende in gestione dalla EvilCorp il database di
utenti perché deve popolare il giochino che permette ad un cliente di vincere
la bambolina di Tyrell.

Il sito [Vinci Tyrell](https://www.vincityrell.biz) è messo online in un paio
di giorni. La EvilCorp è contenta. I project manager della _ACME Web_ sono
contenti. Gli sviluppatori della _ACME Web_ sanno che quel prodotto fa schifo
ma sono già al lavoro su un altro sito che va in produzione il giorno
successivo. L'attaccante, la nonna materna di Mr.Robot dalla casa di riposo
usando un 386 con una Slackware 2.0 e lynx, buca il sito [Vinci
Tyrell](https://www.vincityrell.biz) in pochi minuti ed il database della
EvilCorp è su pastebin o similiari.

Paranoia? Cyber Fantasy? Naaaa, leggi
[sopra](http://motherboard.vice.com/it/read/degli-anonymous-italiani-hanno-pubblicato-dei-dati-di-banca-intesa-e-unipol).

## La sfida persa di noi di security

In tutto questo sapete di chi è la colpa secondo me? Nostra. Intendo di chi fa
security di mestiere. Di chi va alle conferenze a parlare. Di chi fa awareness.

Andiamo sempre agli stessi eventi a cantarcela e suonarcela, tronfi di quelle
quattro _buzzword_ che ormai non si possono neanche più sentire: cloud, big
data, cyber security, APT.

Quando andiamo da un cliente gli parliamo di ITIL, di ISO, di processi. Gli
facciamo comprare un IPS, un IDS e apparati per miliardi. Pretendiamo che ogni
sviluppatore abbia sotto il sedere un tool di code review, questo nella pia
illusione che per magia il codice diventi sicuro.

Mentre il cyber banfa sales, con ciuffo lucente e cravatta annodata
**p-e-r-f-e-t-t-a-m-e-n-t-e**, fattura giornate in questo, ci sono società che
mettono online siti che espongono clienti come EvilCorp ad intrusioni
informatiche verso i loro dati non in casa loro.

Il dato è all'esterno. L'asset è all'esterno. Tu puoi comprare tutto il ferro
che vuoi ma se non fai awareness interno e se non fai formazione agli
sviluppatori che lavorano per te, sei in mutande e non lo sai. Mentre è quasi
giustificata l'ignoranza del business man in mutande, si noti ho detto _quasi_,
non è giustificata l'ignoranza del cyber banfa hub3r expert.

Vorrei vedere tanti talk di security nelle conferenze dedicate a chi sviluppa.
Nel mio piccolo ci sto provando, a Novembre sarò al
[RubyDay](https://www.rubyday.it) con un talk tutto di awareness. Il grosso dei
nomi della security nostrana, è ahimé dedicato ad andare ad eventi auto
referenziali.

Il Security Manager di Intesa sa perfettamente cos'è un APT o i rischi
associati al BYOD. Lo sviluppatore della _ACME Web_ invece vuole un modo veloce
per scrivere quella form in modo che sia libera da SQL Injection.

Per fare questo, chi fa security... o meglio cyber security... o meglio
sicurezza cibernetica, deve sporcarsi le mani col codice. Deve capire il
problema di chi mette il codice online, invece di perdere tempo a coniare altre
buzzword da mettere sulle slide.

## Off by one

illuminante. Da la possibilità, a chi fa divulgazione, di sdoganare il concetto
che l'anello più debole della catena può essere al di fuori dell'azienda e che,
anche un pesce piccolo come un'agenzia web, diventa un target **strategico**
per un attaccante.

Dopotutto, le mura del Trombatorrione sono state tirate giù da un buco per lo
scolo delle acque fognarie no? Ecco, l'esempio calza. Stampatevelo in mente e
parlate coi vostri fornitori, fate loro awareness e date loro policy da
seguire, vincolanti contrattualmente.

Enjoy it!
