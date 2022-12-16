---
layout: post
title: "Dentro al Microsoft Patching Tuesday: Luglio 2021"
author: thesp0nge
featured: false
category: [post]
tags: [microsoft, patching tuesday, cve, exploit]
image:
   feature: july.jpg
   author_id: glencarrie
   author_name: Glen Carrie
   author_link: https://unsplash.com/@glencarrie
   link: https://unsplash.com/s/photos/july
comments: true
share: true
---

Era partito bene a fine 2019 e poi abbandonato, il momento dentro al Patching
Tuesday di Microsoft riprende da questo mese con i dati di luglio.

Da questo mese mi aiuterà [questo bellissimo
script](https://github.com/Immersive-Labs-Sec/msrc-api), scoperto da poco.
Prende i dati forniti da una API del sito Microsoft e fa una statistica delle
vulnerabilità del mese con enfasi su quelle sfruttate attivamente.

Questi i dati di luglio:

{% highlight sh %}
July 2021 Security Updates
[+] Found a total of 117 vulnerabilities
  [-] ]32 Elevation of Privilege Vulnerabilities
  [-] ]8 Security Feature Bypass Vulnerabilities
  [-] ]44 Remote Code Execution Vulnerabilities
  [-] ]14 Information Disclosure Vulnerabilities
  [-] ]12 Denial of Service Vulnerabilities
  [-] ]7 Spoofing Vulnerabilities
[+] Found 4 exploited in the wild
  [-] CVE-2021-33771 -- Windows Kernel Elevation of Privilege Vulnerability
  [-] CVE-2021-34448 -- Scripting Engine Memory Corruption Vulnerability
  [-] CVE-2021-31979 -- Windows Kernel Elevation of Privilege Vulnerability
  [-] CVE-2021-34527 -- Windows Print Spooler Remote Code Execution Vulnerability
{% endhighlight %}

## L'analisi

Delle 117 vulnerabilità corrette, 4 sono in questo momento sfruttate in
attacchi reali. Questo significa che esiste un exploit e che quindi la
correzione della vulnerabilità è un'attività critica.

In particolare la CVE-2021-34527 è quella balzata agli [onori
della
cronaca](https://securelist.com/quick-look-at-cve-2021-1675-cve-2021-34527-aka-printnightmare/103123/)
col nome di PrintNighmare. A causa di un problema nel sistema di gestione dello
spooler di stampa di Windows è possibile eseguire codice arbitrario da remoto.

Su GitHub sono
[molti](https://www.google.com/search?q=print+nightmare+exploit+github) i
repository contenenti PoC per PrintNightmare (in origine classificato solo come
CVE-2021-1675 non corretta completamente da un update precedente),
tuttavia l'analisi più bella della vulnerabilità, con spiegato passo passo come
sfruttarla è sicuramente
[questa](https://github.com/JumpsecLabs/PrintNightmare/blob/main/PrivEscTest.md).
