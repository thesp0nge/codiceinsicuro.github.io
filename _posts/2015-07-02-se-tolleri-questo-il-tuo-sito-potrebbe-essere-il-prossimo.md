---
layout: post
title: "Se tolleri questo il tuo sito potrebbe essere il prossimo"
promotion: "Fare awareness in campo ICT Security non è mai abbastanza. Il tuo sito è al sicuro? Capiamolo insieme"
modified: 
featured: true
category: [Chiacchiere da bar]
tags: [awareness, sslv3, hardening, cloud, attaccanti, guardia e ladri]
image:
  feature: bici.jpg
  credit: Guido Andolfato
  creditlink: https://flic.kr/p/4AHvEa
comments: true
share: true
---

Tutto dipende da quello che sappiamo e dalla nostra sensibilità. Difficilmente
usciremmo di casa la mattina lasciando porta e finestre spalancate; abbiamo
capito che esistono i ladri che possono venire a farci visita.

Difficilmente partiremmo per un lungo viaggio senza controllare almeno olio e
pressione degli pneumatici; abbiamo capito che questo potrebbe avere delle
serie ripercussioni sia sulla nostra vacanza che sulla nostra stessa
incolumità.

Abbiamo acquisito competenze e sensibilità in settori, pubblica sicurezza e
meccanica per citare gli esempi di cui sopra, sui quali la maggior parte di noi
non va oltre. Ma è giusto così, quel livello base di competenze e quella minima
sensibilità ci mettono al riparo da guai non desiderati.

Nel campo informatico no.

Continuiamo imperterriti a pubblicare siti web, applicazioni mobile e chi più
ne ha più ne metta che non sono state neanche testate ma che, soprattutto, non
hanno fatto alcun passaggio di test di sicurezza. Facciamo questo a cuor
leggero, forti di non riesco a capire quale convinzione, un attacco informatico
non succederà mai a noi.

## La vergogna ed il disonore

Vi racconto una storia. Settimana scorsa stavo facendo un po' di random surfing
e mi sono imbattuto in un blog, acquisito di recente da un grosso nome nel
campo dell'editoria, che parlava fi fashion.

Ormai _fashion blogger_, così come _food blogger_, sono diventate professioni
remunerative e può essere interessante anche il giro di affari in termini di
soldi ricavati dalle inserzioni pubblicitarie.

Mentre navigavo sulle nuove tendenze dell'autunno 2015, vedo che il mio browser
richiama un file da un dominio esterno. Si trattava di un file di testo che
veniva incluso in questo blog, basato _ovviamente_ su
[WordPress](https://wordpress.org). Questo file veniva scaricato da un sito
francesce, un sito vetrina di un laboratorio analisi o comunque una struttura
medica. Questo file era codice PHP che realizzava una shell.

Il giro del fumo è quindi che un attaccante prima buca questo sito francesce di
una società nel campo _medicale_, parcheggia qui il codice PHP da iniettare
sulle vere vittime dei suoi attacchi e poi va in giro a bucare ignari _blogger_
facendo in modo che i propri server si peschino il PHP, lo eseguano ed aprano
un po' di shell in giro per il mondo.

Ho mandato una mail sia alla blogger nostrana che ai francesi, spiegando nel
dettaglio cosa era successo. Ovviemente, **nessuna** risposta.

## Quindi può capitare anche a me?

Sì e, forse, è già capitato e non te ne sei neanche reso conto. I motivi che
possono spingere una persona ad attaccare il tuo sito sono disparati e, per la
tua igiene mentale, non li prenderei neanche in considerazione.

Perché un ladro ruba? Perché la macchina si rompe? Rispondere a questo domande
non risolve il mio problema, considerare il rischio ed essere proattivo sì.

## Maddai, io ho HTTPS

Di improvvisati _ciso_[^1] ne ho conosciuti parecchi. Giusto ieri un ragazzo,
da 5 anni interactive media foobar manager o qualcosa di simile, mi ha
contestato un report perché davanti al sito hanno un piccolo waf, credo fatto
in casa, che banna l'ip attaccante per una decina di minuti. E tu a spiegare
che un attaccante, l'IP sorgente te lo fa vedere come il prestigiatore ti
lascia vedere le carte mentre le mescola.

Le risposte più disarmanti le ho avute comunque da chi è convinto, a volte
**fermamente**, che il lucchetto davanti alla URL li stia proteggendo da
attacchi informatici. _"Tanto il sito è in HTTPS."_ E tu, sempre gentilmente,
gli mostri il dump del database preso con la più banale delle SQL Injection.

## Off by one

Spesso i nostri interlocutori hanno un falso senso di sicurezza. Questa
convinzione si basa sull'assunto, falso, che nessuno li possa attaccare e,
secondo me assai più pericoloso, sulla mancata percezione del pericolo.

Secondo me in tutti i corsi, dalle superiori, all'ECDL, all'Università, si deve
parlare della figura del criminale quando si parla di Internet. Un po' come
quando i nostri genitori ci hanno detto che al mondo non esistono solo le
persone buone, bisogna togliere l'immagine romanzata della Rete come luogo,
_cyber_, dove tutti condividono, dove si è social, dove tutti si è felici.

Mi spiace essere così rude, ma la Rete è popolata dalle stesse persone che
trovate lì fuori. C'è la persona affabile, la persona collaborativa, il
permaloso, l'egocentrico, lo stronzo e c'è anche quello che è lì pronto per
fregarvi. Questa è la _neutralità della Rete_. Un po' come nei giochi di ruolo,
la Rete ha un allineamento _neutrale_, non le importa né del bene né del male,
Lei è lì, serafica, un agglomerato di gente che parla TCP/IP e che cerca di
raggiungersi anche quando un hop è giù.

Che voglia raggiungervi con scopi bellicosi, bhé dipende dalla persona dietro
il monitor, la Rete per quello se ne frega.

Oggi vi voglio dare un compito, dopo aver letto questo post, condividetelo con
un vostro amico o un vostro collega, che magari non si occupa di informatica ma
che è responsabile di un sito o di un prodotto online. Fategli vedere che anche
una _fashion blogger_ può essere vittima di un attacco e poi domandategli
_"secondo te siamo veramente al sicuro?"_ e poi riportate qui le risposte che
ottenete. Che ne dite?

Enjoy it!

[^1]: Chief Information Security Officier. E' la persona che in azienda è a
      capo del dipartimento di sicurezza informatica. Di solito non comprende anche
      la parte di sicurezza fisica e, per maggior indipendenza è bene che sia un
      diretto diporto o del CTO o delle risorse umane. Ma sugli organigrammi ognuno
      poi fa come vuole.
