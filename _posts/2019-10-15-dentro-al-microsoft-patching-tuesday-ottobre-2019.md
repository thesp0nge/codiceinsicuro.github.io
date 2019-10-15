---
layout: post
title: "Dentro al Microsoft Patching Tuesday: Ottobre 2019"
author: thesp0nge
featured: false
category: [post]
tags: [microsoft, patching tuesday, cve, exploit]
image:
  feature: patch_sign.jpg
comments: true
share: true
---

Eccoci qui, [circa una settimana
fa](https://portal.msrc.microsoft.com/en-us/security-guidance/releasenotedetail/28ef0a64-489c-e911-a994-000d3a33c573)
Microsoft ha emanato il bollettino di sicurezza per Ottobre 2019.

Venerdì scorso le persone che sono iscritte alla newsletter [Insicurezze
Collaterali](https://codiceinsicuro.it/newsletter/) hanno ricevuto un foglio di
calcolo contenente i CVE coperti dal bollettino assieme ad una valutazione del
livello di priorità da dare ad ogni singola issue.

## L'analisi

Queste le CVE contenute nel bollettino di Ottobre.

| CVE | Vulnerabilità | 
|-----|---------------|
| {% ms_cve CVE-2019-1070 %} | Microsoft Office SharePoint XSS Vulnerability |
| {% ms_cve CVE-2019-1230 %} | Hyper-V Information Disclosure Vulnerability |
| {% ms_cve CVE-2019-1313 %} | SQL Server Management Studio Information Disclosure Vulnerability|
| {% ms_cve CVE-2019-1314 %} | Windows 10 Mobile Security Feature Bypass Vulnerability|
| {% ms_cve CVE-2019-1327 %} | Microsoft Excel Remote Code Execution Vulnerability  |
| {% ms_cve CVE-2019-1328 %} | Microsoft SharePoint Spoofing Vulnerability|
| {% ms_cve CVE-2019-1329 %} | Microsoft SharePoint Elevation of Privilege Vulnerability |
| {% ms_cve CVE-2019-1330 %} | Microsoft SharePoint Elevation of Privilege Vulnerability|
| {% ms_cve CVE-2019-1331 %} | Microsoft Excel Remote Code Execution Vulnerability |
| {% ms_cve CVE-2019-1334 %} | Windows Kernel Information Disclosure Vulnerability|
| {% ms_cve CVE-2019-1337 %} | Windows Update Client Information Disclosure Vulnerability |
| {% ms_cve CVE-2019-1344 %} | Windows Code Integrity Module Information Disclosure Vulnerability|
| {% ms_cve CVE-2019-1345 %} | Windows Kernel Information Disclosure Vulnerability|
| {% ms_cve CVE-2019-1358 %} | Jet Database Engine Remote Code Execution Vulnerability|
| {% ms_cve CVE-2019-1359 %} | Jet Database Engine Remote Code Execution Vulnerability|
| {% ms_cve CVE-2019-1361 %} | Microsoft Graphics Components Information Disclosure Vulnerability|
| {% ms_cve CVE-2019-1363 %} | Windows GDI Information Disclosure Vulnerability|
| {% ms_cve CVE-2019-1369 %} | Open Enclave SDK Information Disclosure Vulnerability|
| {% ms_cve CVE-2019-1378 %} | Windows 10 Update Assistant Elevation of Privilege Vulnerability

Ora, secondo i miei KPI non ci sono vulnerabilità con priorità alta e
l'installazione di questo bollettino Microsoft può avvenire entro il prossimo
mese di marzo 2020, secondo il processo di vulnerability management che vuole
120 giorni di deadline per l'applicazione dello stesso.

Ah, se volete la mia spassionata opinione, la scelta di mettere insieme tutti i
CVE in un unico bollettino che o installi in toto o scarti è una scelta
pessima da parte di Microsoft.

## Non serve a niente!!!

Questo il commento che mi sono sentito dire in un gruppo privato e ammetto di
non aver inventato nulla di che. All'interno di un processo di vulnerability
management può essere utile avere una traccia che dica, quando hai un grosso
parco macchine da gestire, se intervenire di corsa o essere ragionevolmente più
rilassati.

Voi come gestite i feedback negativi? E il vulnerability management? 

## Regalo per voi

Ho deciso di fare un regalo a tutti, anche per invogliarvi ad iscrivervi alla
[newsletter](https://codiceinsicuro.it/newsletter/) e ricevere i prossimi
bollettini per primi.

Condivido con voi l'analisi del bollettino di
[ottobre](https://codiceinsicuro.it/patching_tuesday/201910_CS_WindowsSecurityOrdinaryPatching.xlsx). Che ne pensate?

Se avete qualche suggerimento potete lasciarlo qui sotto tra i commenti. Non
vedo l'ora di sapere cosa ne pensate.

Enjoy it!
