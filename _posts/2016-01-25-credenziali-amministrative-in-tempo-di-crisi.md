---
layout: post
author: thesp0nge
title: "Credenziali amministrative in tempo di crisi"
promotion: "Sicuri serva lo UID=0 o essere Admin per un vulnerability assessment?"
modified: 
featured: false
category: [Chiacchiere da bar]
tags: [vulnerability assessment, nexpose, root, administrator, credenziali, login, permessi]
image:
  feature: blue_door.jpg
comments: true
share: true
---

Sto avendo seri problemi con [Nexpose](https://www.rapid7.com/nexpose). Dato un
host X, succede sia per Windows che per Linux, _randomicamente_, effettuando
una scansione autenticata ho un fingerprint errato del sistema operativo, e di
conseguenza risultati completamente sballati per il mio vulnerability
assessment.

I prodotti sul mercato, danno la possibilità di avere una scansione _whitebox_
di un server. Configuro la scansione fornendo delle credenziali usate dal tool,
il tool raccoglie informazioni su quello che è installato sul server e poi va
nella knowledge base ad vedere quali vulnerabilità sono presenti e quali no.

Già qui c'è qualcosa che ho contestato all'R&D di Rapid7, ma per la quale ho
già avuto picche. Se il mio famoso server X è una Windows 2003, sistema
operativo ormai dichiarato morto, ho soltato una vulnerabilità critica che mi
dice che il sistema operativo è obsoleto. Non vengono cioè elencate tutte le
vulnerabilità che affliggono quel server.

Ora supponiamo di avere una macchina Windows 2008, non patchata. Ci saranno...
quante... una cinquantina di issue di vario livello? Ecco adesso mettiamo in un
foglio di calcolo i dati delle due macchine, perché magari devo fornire un
executive summary. La macchina 2008 spiccherà su quella 2003 anche se, a conti
fatti, l'ultima rappresenta un rischio ben maggiore che non viene supportato
dai dati dello strumento.

Ecco perché non dobbiamo mai fidarci ciecamente dei tool. Il problema è che,
per i vulnerability assessment, probabilmente devi applicare scansioni a
centinaia o migliaia di macchine, quindi, di un tool, ti devi per forza un po'
(af)fidare.

Ma torniamo a noi. Interrogato, il primo livello di HelpDesk, che poi in Rapid7
almeno se sei in ItaGLia è l'unico livello di supporto al quale accedi, ti dice
candidamente che, per quello che riguarda il fingerprint del sistema operativo,
devi per forza avere un utente amministrativo, non ci devono essere antivirus o
firewall tra il server di scansione ed il target.

L'ultima affermazione ha senso, ma le altre due?

Nexpose come prima cosa fa un nmap e poi fa fingerprint del protocollo per
capire dove c'è ssh, nel caso di Linux, o guarda se ci sono aperte le porte
standard SMB per quanto riguarda Windows. nmap gli dice che le porte sono
aperte. Per quale forza divina sulla terra, ogni tanto, badate non sempre, ma
ogni tanto, il tool non riesce ad entrare sulla macchina con un utente valido?

Sembrerebbe che il punto principale, riguardi i permessi dell'utente. Mi sono
sentito chiedere se l'utente è un local admin o è root e mi sono sentito dire
che, i miei insuccessi sono dovuti al fatto che l'utente sia un regular user.

Un po' come dire... un attaccante, per fare un fingerprint di un server, deve
essere root, no?!? Dubito che chi abbia scritto quel codice, abbia anche mai
bucato una macchina.

Torniamo un attimo al nostro utente. Questo è usato per vedere i pacchetti che
sono installati sulla macchina. Nel caso di Windows, potrei anche immaginare
che la lista del software installato sia disponibile solo all'amministratore
locale, potrei immaginarlo... anche se questo non giustifica il fatto che
_randomicamente_ il test whitebox funziona alla perfezione.

Ma Linux/Unix? Prendiamo RedHat, l'utente deve poter fare:

```
cat /etc/redhat-release
rpm -qa
```

Devi essere root? Ma scherziamo? Io per primo non do in mano ad un tool un
utente privilegiato, figuriamoci un sysadmin al quale sto cercando di fare
proprio sensibilizzazione sul non usre root ovunque, sull'uso di ```sudo```...
poi arriva il primo Nexpose e mi dice _eh no, per sapere che è una RHEL 6.5
devi essere root_.

Il bello è che tutti ragionano così. Nessus, Qualys, AntaniSoft...

Capisco che un vulnerability assessment è significativo _fino ad un certo
punto_, però così sembra proprio di buttar via soldi in strumenti poco
ergonomici.

E voi, che strumento usate? Avete esperienze simili? I vostri strumenti sono
più precisi del mio?
Lasciate un commento.

Enjoy it!
