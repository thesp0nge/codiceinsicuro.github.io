---
layout: post
title: "Dentro al Microsoft Patching Tuesday: Dicembre 2019"
author: thesp0nge
featured: false
category: [post]
tags: [microsoft, patching tuesday, cve, exploit]
image:
  feature: patch_sign.jpg
comments: true
share: true
---

Come ogni mese, Microsoft ha [rilasciato](https://portal.msrc.microsoft.com/en-us/security-guidance/releasenotedetail/2019-Dec) il bollettino con le patch di dicembre, ultimo bollettino per quest'anno.

Se tu che stai leggendo, sei iscritto alla newsletter [Insicurezze
Collaterali](https://codiceinsicuro.it/newsletter/) avrai ricevuto da poco una
email che con un link per scaricare il foglio di calcolo contenente i CVE
coperti dal bollettino assieme ad una valutazione del livello di priorità da
dare ad ogni singola issue.

Se non sei ancora iscritto alla
[newsletter](https://codiceinsicuro.it/newsletter/) ti suggerisco caldamente di
farlo.

## L'analisi

Queste le CVE contenute nel bollettino di Dicembre.

| CVE | Vulnerabilità | 
|-----|---------------|
| {% ms_cve CVE-2019-1489 %} | Remote Desktop Protocol Information Disclosure Vulnerability |
| {% ms_cve CVE-2019-1465 %} | Windows GDI Information Disclosure Vulnerability |
| {% ms_cve CVE-2019-1468 %} | Win32k Graphics Remote Code Execution Vulnerability |
| {% ms_cve CVE-2019-1466 %} | Windows GDI Information Disclosure Vulnerability |
| {% ms_cve CVE-2019-1467 %} | Windows GDI Information Disclosure Vulnerability |
| {% ms_cve CVE-2019-1400 %} | Microsoft Access Information Disclosure Vulnerability |
| {% ms_cve CVE-2019-1464 %} | Microsoft Excel Information Disclosure Vulnerability |
| {% ms_cve CVE-2019-1461 %} | Microsoft Word Denial of Service Vulnerability |
| {% ms_cve CVE-2019-1462 %} | Microsoft PowerPoint Remote Code Execution Vulnerability |
| {% ms_cve CVE-2019-1463 %} | Microsoft Access Information Disclosure Vulnerability |
| {% ms_cve CVE-2019-1485 %} | VBScript Remote Code Execution Vulnerability |
| {% ms_cve CVE-2019-1453 %} | Windows Remote Desktop Protocol (RDP) Denial of Service Vulnerability |
| {% ms_cve CVE-2019-1476 %} | Windows Elevation of Privilege Vulnerability |
| {% ms_cve CVE-2019-1477 %} | Windows Printer Service Elevation of Privilege Vulnerability |
| {% ms_cve CVE-2019-1474 %} | Windows Kernel Information Disclosure Vulnerability |
| {% ms_cve CVE-2019-1478 %} | Windows COM Server Elevation of Privilege Vulnerability |
| {% ms_cve CVE-2019-1483 %} | Windows Elevation of Privilege Vulnerability |
| {% ms_cve CVE-2019-1488 %} | Microsoft Defender Security Feature Bypass Vulnerability |
| {% ms_cve CVE-2019-1487 %} | Microsoft Authentication Library for Android Information Disclosure Vulnerability |
| {% ms_cve CVE-2019-1490 %} | Skype for Business Server Spoofing Vulnerability |
| {% ms_cve CVE-2019-1332 %} | Microsoft SQL Server Reporting Services XSS Vulnerability |
| {% ms_cve CVE-2019-1350 %} | Git for Visual Studio Remote Code Execution Vulnerability |
| {% ms_cve CVE-2019-1349 %} | Git for Visual Studio Remote Code Execution Vulnerability |
| {% ms_cve CVE-2019-1486 %} | Visual Studio Live Share Spoofing Vulnerability |
| {% ms_cve CVE-2019-1387 %} | Git for Visual Studio Remote Code Execution Vulnerability |
| {% ms_cve CVE-2019-1354 %} | Git for Visual Studio Remote Code Execution Vulnerability |
| {% ms_cve CVE-2019-1351 %} | Git for Visual Studio Tampering Vulnerability |
| {% ms_cve CVE-2019-1352 %} | Git for Visual Studio Remote Code Execution Vulnerability |
| {% ms_cve CVE-2019-1471 %} | Windows Hyper-V Remote Code Execution Vulnerability |
| {% ms_cve CVE-2019-1470 %} | Windows Hyper-V Information Disclosure Vulnerability |
| {% ms_cve CVE-2019-1472 %} | Windows Kernel Information Disclosure Vulnerability |
| {% ms_cve CVE-2019-1458 %} | Win32k Elevation of Privilege Vulnerability |
| {% ms_cve CVE-2019-1469 %} | Win32k Information Disclosure Vulnerability |
| {% ms_cve CVE-2019-1480 %} | Windows Media Player Information Disclosure Vulnerability |
| {% ms_cve CVE-2019-1481 %} | Windows Media Player Information Disclosure Vulnerability |
| {% ms_cve CVE-2019-1484 %} | Windows OLE Remote Code Execution Vulnerability |


Ci sono 2 CVE che hanno una priorità alta e che quindi richiedono un patching abbastanza rapido:

* {% ms_cve CVE-2019-1468 %}
* {% ms_cve CVE-2019-1458 %}

In particolare per la [CVE-2019-1458](https://securelist.com/windows-0-day-exploit-cve-2019-1458-used-in-operation-wizardopium/95432/) sono state rilevate evidenze di utilizzo in the wild durante attacchi reali.

Se vedete il bollettino nel complesso la priorità è bassa, proprio perché ci sono 35 CVE che non sono particolarmente interessanti. Tuttavia, il fatto che esista un exploit noto per una delle issue che sono state corrette, deve far suonare un campanello di allarme e far spingere sull'acceleratore con una discreta energia.

Fossi in voi, vorrei passare una vigilia di Natale tranquilla mentre si sboccia del prosecco; che ne dite?

## Off by one

E' passato un bel po' dall'ultimo post, non ho fatto più video su Instagram ed ho saltato il bollettino di novembre. La realtà dei fatti è che sono stato sottoposto ad un piccolo intervento al ginocchio, niente di preoccupante, ora sono in via di guarigione.

Nel 2020 mi metterò sotto seriamente e ci saranno un sacco di contenuti interessanti. Promesso.


Enjoy it!
