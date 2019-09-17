---
layout: post
title: "Dentro al Microsoft Patching Tuesday: Settembre 2019"
author: thesp0nge
featured: false
category: [post]
tags: [microsoft, patching tuesday, cve, exploit]
image:
  feature: patch_sign.jpg
comments: true
share: true
---

Una settimana fa è uscito il bollettino Microsoft di Settembre 2019 che
riguarda il patching di security. Nelle [release
notes](https://portal.msrc.microsoft.com/en-us/security-guidance/releasenotedetail/24f46f0a-489c-e911-a994-000d3a33c573),
possiamo vedere la lista dei CVE che sono stati corretti.

Come
[scrivevo](https://codiceinsicuro.it/blog/patch-ordinario-e-patch-straordinario/)
qualche mese fa, in un processo di patching che prevede il patching ordinario,
quello che va fatto ora è analizzare ogni singola voce di questo elenco e
cercare di dare un valore di priorità.

Quello che vogliamo ottenere è una scaletta da dare ai nostri sysadmin per far
loro capire se questo aggiornamento è obbligatorio o meno.
Sì perché ormai da un bel po' di mesi, le patch di sicurezza di Microsoft si
presentano come un blob enorme da installare. Questo porta a dover pianificare
con ancor maggior attenzione le attività di remediation.

E no... non sono un tipo **patch or die**, sono un tipo **patch in fretta
quando serve**, ma per il resto business first, quindi garantire il servizio
deve essere l'obiettivo principale.
Definire quindi il grado di priorità da applicare ad ogni singolo intervento,
sulla base di KPI precisi, ci permette come blue team di aiutare il mio team di
operation nel decidere se pianificare un fermo macchina domani, tra quindi
giorni o tra due mesi.

## L'analisi

Ho fatto il lavoro per voi e queste sono le CVE corrette che, per i miei KPI
che mi sono dato, hanno una priorità **alta** e quindi vanno installati entro
il prossimo Patching Tuesday.

| CVE | Vulnerabilità | 
|-----|---------------|
| [CVE-2019-0787](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2019-0787) | Remote Desktop Client Remote Code Execution Vulnerability |
| [CVE-2019-0788](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2019-0788)|	Remote Desktop Client Remote Code Execution Vulnerability |
| [CVE-2019-1219](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2019-1219)|	Windows Transaction Manager Information Disclosure Vulnerability |
| [CVE-2019-1285](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2019-1285)|	Win32k Elevation of Privilege Vulnerability |
| [CVE-2019-1290](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2019-1290)|	Remote Desktop Client Remote Code Execution Vulnerability |
| [CVE-2019-1235](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2019-1235)|	Windows Text Service Framework Elevation of Privilege Vulnerability |
| [CVE-2019-1291](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2019-1291)|	Remote Desktop Client Remote Code Execution Vulnerability |
| [CVE-2019-1294](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2019-1294)|	Windows Secure Boot Security Feature Bypass Vulnerability |
| [CVE-2019-1295](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2019-1295)|	Microsoft SharePoint Remote Code Execution Vulnerability |
| [CVE-2019-1296](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2019-1296)|	Microsoft SharePoint Remote Code Execution Vulnerability |
| [CVE-2019-1257](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2019-1257)|	Microsoft SharePoint Remote Code Execution Vulnerability |

Come possiamo vedere sia RDP che SharePoint la fanno da padrone. Se quindi ho
un server dove **non** sono installati né il servizio di remote desktop né
sharepoint, dovrò correre ai ripari aggiornato in fredda pianificando un fermo
macchina urgente?

**No**, posso andare con relativa calma in quel caso.

Avendo quindi 11 vulnerabilità di priorità alta su 80, il valore globale del
bollettino sarà di priorità **media** in quanto 11/80 non supera la soglia che
ho fissato e le priorità medie sono in numero maggiore rispetto a quelle di
priorità bassa.
Per questo motivo definisco uno SLA di applicazione di questo pacchetto di
patch a 30 giorni.

## La sorpresa

Gli SLA e i KPI sono ovviamente personali, frutto di ragionamenti miei e
soprattutto di un processo che ho disegnato a mio uso e consumo.

Però, per chi vuole uno spunto, dal prossimo mese condividerò con gli iscritti
alla [mailing list](https://codiceinsicuro.it/newsletter/) del blog un foglio
di calcolo dove darò il dettaglio delle CVE corrette nel Patching Tuesday di
Ottobre, con un livello di priorità e con l'indicazione della priorità globale.

L'idea è di darvi un qualcosa da cui partire per supportare da subito il vostro
team nella comprensione e nell'applicazione delle patch Microsoft. Qui sul
blog, mi limiterò ad riportare le vulnerabilità di severità critica e alta.

La seconda sopresa è che sto pensando di fare dei video, un po' più estesi di
quelli pubblicati su [Instagram](https://www.instagram.com/codiceinsicuro/)
dove "leggiamo" insieme il bollettino Microsoft. Questo diciamo se riesco a
rimettere in piedi tutta l'attrezzatura che avevo all'epoca dei [Monday
Blues](https://codiceinsicuro.it/monday-blues/)

Quindi, se vuoi ricevere la mia analisi approfondita del Patching Tuesday in
formato elettronico, corri ad iscriverti alla [mailing
list](https://codiceinsicuro.it/newsletter/). Assieme al patching tuesday
riceverai un avviso ogni volta che scriverò un nuovo post e nel prossimo
futuro, quando vorrò condividere qualcosa sarai il primo a saperlo.

Enjoy it!
