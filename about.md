---
layout: page
permalink: /about/
title: Su questo blog
tagline: Un blog di application security morbido fuori e croccante dentro
tags: [about, Jekyll, theme, responsive]
modified: 11-02-2016
comments: false
share: true
image:
  feature: about.png
  credit:
  creditlink:
---

Quando ho aperto [armoredcode.com](http://armoredcode.com)[^1], il mio scopo
era quello di scrivere di application security.
Avevo letto da poco un libro, Technical Blogging di A.Cangiano e mi aveva
inspirato. Da sempre cercavo di creare un punto di interesse attorno ai temi
della sicurezza applicativa, ancora poco diffusa in Italia e partii dai
suggerimenti trovati in quel libro.

Con il tempo, gli impegni, la vita e i [progetti
collaterali](http://dawnscanner.org) nel campo sempre ICT security hanno reso
la scrittura di post di un certo livello, molto più difficile. Non impossibile,
solo molto difficile.

Per questo motivo, dato che a me piace scrivere, ho deciso di creare un blog su
quello che amo fare in italiano. Almeno la parte di scrittura risulterà più
fluente e più semplice in termini di tempo.

### Perché un altro blog di application security?

In questi anni ho cercato sul web delle risorse che affrontassero il tema della
sicurezza applicativa ma ho trovato solamente blog che postavano notizie di
incidenti, di patch di security da applicare e di recensioni di tool. Ho
trovato veramente pochi posti dove si parlasse della sicurezza del codice, con
il codice.

Questo blog vuole parlare di sicurezza applicativa codice sorgente alla mano,
quando disponibile, e dimostrare che scrivere codice di per sé non è un lavoro
semplice, ma per farlo sicuro poi ci vuole proprio una bella squadra.

### Qui non troverai

* seriali di software
* dettagli su come commettere illeciti informatici
* warez
* codici sorgente di exploit
* 0 day
* marchette commerciali

### Invece potrai

* imparare a scrivere codice sicuro
* imparare che scrivere codice non è una cosa brutta di cui vergognarsi
* trovare esempi di safe coding in [ruby](http://ruby-lang.org/en)
* trovare esempi di codice per eseguire test (statici o dinamici) sempre in
  [ruby](http://ruby-lang.org/en)
* imparare come mettere in sicurezza un application server
* imparare il significato di termini come vulnerability assessment, web
  application penetration test, code review e perché tutte queste cose servono a
  te e alla tua azienda
* ...

[Codice Insicuro]({{site.root}}) vuole diventare il principale blog italiano sui temi di
application security. Per ora è il primo blog italiano di application security
croccante fuori e morbido dentro.

Per qualsiasi dubbio o perplessità mi trovate via email qui:
[paolo@codiceinsicuro.it](mailto:paolo@codiceinsicuro.it)

### Qualche dato

{% capture count %}{{ site.posts.size }}{%endcapture%}
Sono stati scritti {{ count }} posts ad oggi. Il primo è stato scritto il {{ site.posts.last.date | date: "%d/%m/%Y"}} mentre l'ultimo il {{ site.posts.first.date | date: "%d/%m/%Y" }}.


[^1]: sempre un blog di application security, in inglese, aperto il 16 Marzo 2011.
