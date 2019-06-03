---
layout: post
title: "Se produci software, il problema delle licenze terze è anche tuo"
author: thesp0nge
featured: false
category: [post]
tags: [chiacchiere da bar, java, licenze, aws, amazon, software, vendor]
image:
  feature: coffee.jpg
comments: true
share: true
---

Trovo il sistema di licensing di Oracle complesso. Accanto ai suoi RDBMS,
Oracle ha messo mano da poco anche al [licensing di
Oracle](https://upperedge.com/oracle/using-java-heres-how-oracles-new-2019-java-se-licensing-affects-you/)
che ora diventa a pagamento per uso commerciale.

Ci riflettevo mentre chiedevo ad un fornitore che mi distribuisce un tool
commerciale basato su Java se il suo software funzionava anche con l'[SDK di
Amazon](https://aws.amazon.com/it/sdk-for-java/).

La risposta è _un assordante silenzio_. La risposta che nessuno da è _"ah, Java
è diventato a pagamento?"_.

Che poi se ci pensiamo il problema si riflette su tutto l'ecosistema attorno al
software commerciale prodotto e venduto come pacchetto. Come gestisci le
vulnerabilità del JS che usi per fare quella bella animazione che non serve a
nulla ma che ti introduce un bellissimo cross site scripting?
E di quella versione del web server, vecchia di 10 anni, che però ti tieni in
bundle tra l'ecosistema certificato perché **funziona**, ne vogliamo parlare?

Owasp ha dedicato una voce della sua Top 10 proprio alle [vulnerabilità
introdotte da componenti di terze
parti](https://www.owasp.org/index.php/Top_10-2017_A9-Using_Components_with_Known_Vulnerabilities).

Chi produce software, secondo me, ha un obbligo etico nei confronti dei propri
clienti, che lo deve portare a:

* preoccuparsi delle licenze delle componenti terze
* gestire le vulnerabilità ed il patching di librerie e software accessorio,
  con un processo **snello** di certificazione delle stesse
* avere un report di security assessement che certifichi che un software esce
  con zero problemi di sicurezza (o solo alcuni di minor entità).

Lo chiediamo a gran voce a Microsoft per il suo sistema operativo, perché
dovrebbe essere diverso per chi produce il gestionale che usiamo per i cedolini
dei nostri dipendenti, ad esempio. Perché dovremmo tollerare che una software
house ci venda un prodotto per gestire un'anagrafica che esponga la nostra rete
ad una remote code execution? 

In tal senso, dovrebbe venirci in aiuto l'[ISO
27001](https://it.wikipedia.org/wiki/ISO/IEC_27001). Se un'azienda è
certificata, allora anche il suo codice lo dovrebbe essere e, nel caso di
un'azienda non certificata, dovrebbe essere il mercato a chiedere prodotti
certificati al fine di portarsi in casa prodotti di qualità.

Non andremmo mai a comprare un'auto che si ribalta alla prima curva vero?

E' inutile ad andare all'ennesimo Summit a parlare dei massimi sistemi o delle
minacce di _guerre cibernetiche_ se poi non siamo in grado di andare da chi
scrive il software e parlare di security proprio dove serve?

Tu cosa ne pensi? Produci del software che vendi ai tuoi clienti? Come gestisci
il problema della sicurezza non solo del tuo codice ma anche dell'ecosistema
che fai installare al tuo cliente per farlo funzionare?
Dimmi la tua lasciando un commento qui sotto.
