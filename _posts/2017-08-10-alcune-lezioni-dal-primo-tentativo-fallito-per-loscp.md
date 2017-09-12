---
layout: post
title: "Alcune lezioni dal primo tentativo fallito per l'OSCP"
promotion: 
modified: 
featured: false
category: [post]
tags: [oscp, pentest, offensive security]
image:
  feature: mare_2017.jpg
  credit: Marco Crupi
  creditlink: https://flic.kr/p/snYTFf
comments: true
share: true
---

Sono passati alcuni mesi dall'ultimo post. E' arrivato
[WannaCry](https://it.wikipedia.org/wiki/WannaCry), è arrivata [Petya /
NotPetya](https://www.theguardian.com/technology/2017/jun/27/petya-ransomware-cyber-attack-who-what-why-how)
e i media generalisti hanno scoperto il malware e la sicurezza informatica.

E' stato bucato
[Rousseau](http://www.repubblica.it/politica/2017/08/02/news/hacker_online_dimostra_la_vulnerabilita_di_rousseau_ho_bucato_il_sito_dati_a_rischio_-172221493/)
e dati di molti militanti del Movimento 5 Stelle sono ora in vendita sul web.

Mentre il mondo ITSEC italiano si sbizzarriva su [Twitter](https://twitter.com) su vari temi, io ero impegnato a tentare l'assalto all'[OSCP](https://www.offensive-security.com/information-security-certifications/oscp-offensive-security-certified-professional/).

## 5 punti

Partiamo subito con l'esito, servivano almeno 70 punti per passare ed in un
torrido 1 Agosto, mi sono fermato a 65 punti con 3 root flag, una shell con
privilegi non elevati e una macchina con una SQL Injection trovata e sfruttata
ma senza ottenere una shell. Quindi, nonostante un buon report, **bocciato**.

Ho ricevuto l'esito 1 giorno e mezzo dopo, come da prassi, e smaltita la
delusione provo a buttare qui sul blog qualche errore che ho commesso, nella
speranza di raggiungere l'obiettivo massimo questo autunno.

## Io e me

Di solito sono iper critico con me stesso. Basta poco per farmi vedere difetti
ovunque e far precipitare la mia autostima sotto le scarpe.

In questo caso, però, non ce l'ho fatta a non vedere il bicchiere pieno per
3/4. Avevo fatto un buon esame, praticamente rinfrescando concetti che non
toccavo più dai tempi del SiLAB all'Università. 

Mi sono perso in un effetto tunnel, quando ho carcato di sfruttare il mio unico
tentativo con Metasploit, per sfruttare una MS17-010 perdendo un po' di tempo.
Sono andato liscio su alcune cose che mi sarei aspettato più ostiche e sono
arrivato stremato dopo quasi 19 ore di lavoro.

Quindi, possiamo dire **bocciato** ma **soddisfatto**, il prossimo tentativo
andrà meglio, anche perché vorrò evitare questi errori, queste lezioni.

## Cosa ho imparato

1. Usare una versione di Kali a 32 bit, o comunque tenere una macchina Linux a
   32 bit per compilare exploit vecchi, magari in maniera statica.
2. Non sottovalutare **MAI** il laboratorio dell'OSCP. Con i 5 punti che avrei
   avuto facendo un buon report del laboratorio sarei passato.
3. Avere a portata di mano una macchina Windows con Visual Studio per compilare
   exploit per Win perché, in alcuni casi, fare una compilazione cross da Linux
   ti può portare via troppo tempo.
4. Non iniziare l'esame a mezzanotte. Seguire il flusso della giornata
   lavorativa, molto meglio iniziare alle 6 o alle 7 e fare una tirata unica
   fino alle 2 del giorno dopo.
5. Non serve, almeno a me, pianificare le pause. Vanno fatte, piccole e
   frequenti, ma è inutile forzare la pausa ad una certa ora.
6. Provare sempre la cosa più ovvia, come una password banale o a verificare
   quella _misconfiguration_ vista l'ultima volta nel 2001...
7. nmap è un caro amico, ma a volte è così lento. Pianificare con attenione le
   attività automatiche che si sa essere quelle più lunghe e dedicarsi ad altro
   mentre gli strumenti macinano.
8. Metasploit è utile ma non indispensabile, mentre msfvenom è **fondamentale**
9. Pianificare prima, le attività di test. Durante l'esame sale comunque
   l'adrenalina e lo stress, la mente si appanna quindi serve un piano di
   battaglia almeno macroscopico delle attività da fare durante la
   ricognizione.
10. Niente è impossibile. #tryharder non è messo lì per caso e durante il
    percorso per l'OSCP è l'attitudine a non mollare che fa la differenza.

## Off by one

A settembre, con calma estenderò il laboratorio e ripianificherò l'esame per
l'autunno. Nel frattempo, ho trovato un po' di siti dove vengono date macchine
da testare e challenge da risolvere e si farà pratica.

Ci sarà poi una piccola migrazione dei contenuti di Codice Insicuro. Post come
questi, non li vedrete più qui ma su uno spazio diverso, più blog personale. Su
Codice Insicuro ci saranno post leggermente diversi e introdurrò la doppia
lingua.

Enjoy it!


