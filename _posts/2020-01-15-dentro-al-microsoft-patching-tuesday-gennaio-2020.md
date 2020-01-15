---
layout: post
title: "Dentro al Microsoft Patching Tuesday: Gennaio 2020"
author: thesp0nge
featured: false
category: [post]
tags: [microsoft, patching tuesday, cve, exploit]
image:
  feature: patch_sign.jpg
comments: true
share: true
---

Eccoci qui, l'anno nuovo è appena iniziato e siamo chiamati ad analizzare il
primo bollettino Microsoft rilasciato il 14 gennaio.

Agli onori della cronaca, anche per il coinvolgimento dell'NSA che ha scoperto
la vulnerabilità, la [CVE-2020-0601](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2020-0601). Il modulo crypt32.dll gestisce in maniera
errata i certificati firmati con algoritmi di cifratura a curva ellittica.
Questo permetterebbe ad un attaccante di bypassare il meccanismo di controllo
del certificato, forgiarne uno ed eseguire un man-in-the-middle o forzare
l'esecuzione di codice binario untrusted.

In questo tweet possiamo vedere come alcuni ricercatori abbiano già firmato dei
binari con dei certificati fake.

Di minor impatto mediatico ma potenzialmente devastanti sono le altre [due
remote code execution](https://twitter.com/GossiTheDog/status/1217165680023392262) sul Remote Desktop Gateway che viene spesso messo davanti
ai servizi di Remote Desktop.
Più precisamente stiamo parlando delle [CVE-2020-0610](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2020-0610) e [CVE-2020-0609](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/CVE-2020-0609).

Se non sei ancora iscritto alla
[newsletter](https://codiceinsicuro.it/newsletter/) ti suggerisco caldamente di
farlo in modo da ricevere l'analisi completa.

## L'analisi

Queste le CVE contenute nel bollettino di gennaio.

| CVE | Vulnerabilità | 
|-----|---------------|
| {% ms_cve CVE-2020-0606 %} |	.NET Framework Remote Code Execution Vulnerability |
| {% ms_cve CVE-2020-0605	 %} |.NET Framework Remote Code Execution Vulnerability |
| {% ms_cve CVE-2020-0646	 %} |.NET Framework Remote Code Execution Injection Vulnerability |
| {% ms_cve CVE-2020-0654	 %} |Microsoft OneDrive for Android Security Feature Bypass Vulnerability |
| {% ms_cve CVE-2020-0603	 %} |ASP.NET Core Remote Code Execution Vulnerability |
| {% ms_cve CVE-2020-0602	 %} |ASP.NET Core Denial of Service Vulnerability |
| {% ms_cve CVE-2020-0615	 %} |Windows Common Log File System Driver Information Disclosure Vulnerability |
| {% ms_cve CVE-2020-0634	 %} |Windows Common Log File System Driver Elevation of Privilege Vulnerability |
| {% ms_cve CVE-2020-0639	 %} |Windows Common Log File System Driver Information Disclosure Vulnerability |
| {% ms_cve CVE-2020-0656	 %} |Microsoft Dynamics 365 (On-Premise) Cross Site Scripting Vulnerability |
| {% ms_cve CVE-2020-0622	 %} |Microsoft Graphics Component Information Disclosure Vulnerability |
| {% ms_cve CVE-2020-0607	 %} |Microsoft Graphics Components Information Disclosure Vulnerability |
| {% ms_cve CVE-2020-0642	 %} |Win32k Elevation of Privilege Vulnerability |
| {% ms_cve CVE-2020-0643	 %} |Windows GDI+ Information Disclosure Vulnerability |
| {% ms_cve CVE-2020-0650	 %} |Microsoft Excel Remote Code Execution Vulnerability |
| {% ms_cve CVE-2020-0652	 %} |Microsoft Office Memory Corruption Vulnerability |
| {% ms_cve CVE-2020-0653	 %} |Microsoft Excel Remote Code Execution Vulnerability |
| {% ms_cve CVE-2020-0651	 %} |Microsoft Excel Remote Code Execution Vulnerability |
| {% ms_cve CVE-2020-0647	 %} |Microsoft Office Online Spoofing Vulnerability |
| {% ms_cve CVE-2020-0640	 %} |Internet Explorer Memory Corruption Vulnerability |
| {% ms_cve CVE-2020-0644	 %} |Windows Elevation of Privilege Vulnerability |
| {% ms_cve CVE-2020-0624	 %} |Win32k Elevation of Privilege Vulnerability |
| {% ms_cve CVE-2020-0635	 %} |Windows Elevation of Privilege Vulnerability |
| {% ms_cve CVE-2020-0620	 %} |Microsoft Cryptographic Services Elevation of Privilege Vulnerability |
| {% ms_cve CVE-2020-0616	 %} |Microsoft Windows Denial of Service Vulnerability |
| {% ms_cve CVE-2020-0608	 %} |Win32k Information Disclosure Vulnerability |
| {% ms_cve CVE-2020-0601	 %} |Windows CryptoAPI Spoofing Vulnerability |
| {% ms_cve CVE-2020-0621	 %} |Windows Security Feature Bypass Vulnerability |
| {% ms_cve CVE-2020-0633	 %} |Windows Search Indexer Elevation of Privilege Vulnerability |
| {% ms_cve CVE-2020-0623	 %} |Windows Search Indexer Elevation of Privilege Vulnerability |
| {% ms_cve CVE-2020-0613	 %} |Windows Search Indexer Elevation of Privilege Vulnerability |
| {% ms_cve CVE-2020-0614	 %} |Windows Search Indexer Elevation of Privilege Vulnerability |
| {% ms_cve CVE-2020-0632	 %} |Windows Search Indexer Elevation of Privilege Vulnerability |
| {% ms_cve CVE-2020-0627	 %} |Windows Search Indexer Elevation of Privilege Vulnerability |
| {% ms_cve CVE-2020-0628	 %} |Windows Search Indexer Elevation of Privilege Vulnerability |
| {% ms_cve CVE-2020-0625	 %} |Windows Search Indexer Elevation of Privilege Vulnerability |
| {% ms_cve CVE-2020-0626	 %} |Windows Search Indexer Elevation of Privilege Vulnerability |
| {% ms_cve CVE-2020-0629	 %} |Windows Search Indexer Elevation of Privilege Vulnerability |
| {% ms_cve CVE-2020-0631	 %} |Windows Search Indexer Elevation of Privilege Vulnerability |
| {% ms_cve CVE-2020-0630	 %} |Windows Search Indexer Elevation of Privilege Vulnerability |
| {% ms_cve CVE-2020-0617	 %} |Hyper-V Denial of Service Vulnerability |
| {% ms_cve CVE-2020-0641	 %} |Microsoft Windows Elevation of Privilege Vulnerability |
| {% ms_cve CVE-2020-0610	 %} |Windows Remote Desktop Gateway (RD Gateway) Remote Code Execution Vulnerability |
| {% ms_cve CVE-2020-0609	 %} |Windows Remote Desktop Gateway (RD Gateway) Remote Code Execution Vulnerability |
| {% ms_cve CVE-2020-0637	 %} |Remote Desktop Web Access Information Disclosure Vulnerability |
| {% ms_cve CVE-2020-0612	 %} |Windows Remote Desktop Gateway (RD Gateway) Denial of Service Vulnerability |
| {% ms_cve CVE-2020-0611	 %} |Remote Desktop Client Remote Code Execution Vulnerability |
| {% ms_cve CVE-2020-0636	 %} |Windows Subsystem for Linux Elevation of Privilege Vulnerability |
| {% ms_cve CVE-2020-0638	 %} |Update Notification Manager Elevation of Privilege Vulnerability |

