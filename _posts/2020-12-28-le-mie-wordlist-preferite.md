---
layout: post
title: "Le mie wordlist preferite"
author: thesp0nge
featured: false
category: [post]
tags: [wordlist, offensive, pentest, fuzz, quicktip]
image:
   feature: words.jpg
   author_id: "@noemieke"
   author_name: "Noémi Macavei-Katócz"
   author_link: https://unsplash.com/s/photos/word-list
   link:
comments: true
share: true
---

Quando facciamo un pentest su un'applicazione web abbiamo bisogno di enumerare
file e directory, alla ricerca di possibili porzioni del sito dimenticate, file
di backup o qualsiasi cosa ci possa dare una via per entrare.

Per fare una buona enumerazione del nostro obiettivo, abbiamo bisogno di
wordlist e queste sono le mie 3 fonti preferite.

Premessa: so bene nelle distribuzioni Linux già pronte per il pentest avete già
tutto quello che vi serve. Sto però pensando ad crearmi un'immagine con
l'essenziale di quello che uso più spesso, partendo da una distribuzione
minimale. Sinceramente è una cosa che vi consiglio.

## SecLists

[SecLists](https://github.com/danielmiessler/SecLists) è la prima wordlist che ho utilizzato. Contiene username, password, url, file e tutto quello che può essere dato in pasto al vostro fuzzer.

Il progetto è ancora mantenuto e l'installazione molto semplice:

{% highlight sh %}
wget -c https://github.com/danielmiessler/SecLists/archive/master.zip -O SecList.zip \
  && unzip SecList.zip \
  && rm -f SecList.zip
{% endhighlight %}

Se invece, come consiglio, si vuole avere più facilità di aggiornamento,
conviene clonare il repository:

{% highlight sh %}
git clone https://github.com/danielmiessler/SecLists.git
{% endhighlight %}


## PayloadsAllTheThings

[PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings) non
è propriamente una wordlist per fare fuzzing durante l'enumeration, ma più un
elenco esaustivo di payload appunto che possono essere usati per la ricerca di
xss o sql injection.

Il materiale è corposo e può essere usato come fonte di studio e ripasso mentre
si sta conducendo un assessment.

Attivamente sviluppato, il modo per averlo sul vostro sistema è quello di
clonare il repository:

{% highlight sh %}
git clone https://github.com/swisskyrepo/PayloadsAllTheThings.git
{% endhighlight %}

## FuzzDB

[FuzzDB](https://github.com/fuzzdb-project/fuzzdb) probabilmente lo usate già
perché incorporato in un sacco di tool come Owasp ZAP e Burp. Questo repository
contiene wordlist per fare enumeration.

Ultimamente ho avuto la necessità di crearmi uno script custom per fare fuzzing
e questo repository è stata la classica manna dal cielo.

Da installare con un git clone:

{% highlight sh %}
git clone https://github.com/fuzzdb-project/fuzzdb.git
{% endhighlight %}

## Assetnote Wordlists

Le wordlist di [Assetnote](https://wordlists.assetnote.io/) le ho appena
scoperte e non le ho ancora utilizzate in un'attività reale. 
Tuttavia sono aggiornate mensilmente dal team di Assetnote e si tratta di una
mole di dati impressionante.

Vi invito veramente ad andare sul loro [sito](https://wordlists.assetnote.io/)
e scegliere la wordlist a seconda della tecnologia alla base del sito che state
testando.


## Off by one

Conoscere le wordlist che sono sul vostro sistema ed eventualmente integrarle
con delle fonti dati aggiuntive, vi permette di avere più controllo sulla fase
di recon dei vostri assessment.

Avere il controllo di quello che state facendo è l'unico modo per avere un
deliverable di qualità e soprattutto per trovare il modo di bucare
un'applicazione con successo.

Enjoy it!
