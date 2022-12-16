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
