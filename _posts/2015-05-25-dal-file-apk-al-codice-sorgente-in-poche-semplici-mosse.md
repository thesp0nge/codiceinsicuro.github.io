---
layout: post
author: thesp0nge
title: "Dal file APK al codice sorgente in poche semplici mosse"
promotion: "Vediamo come è possibile passare da un file APK ai codici sorgenti di un'applicazione mobile non offuscata."
modified: 
featured: false
category: [sicurina]
tags: [codice sorgente, android, java, apk, classes.dex, dalvik, jvm, virtual machine]
image:
  feature: android.jpg
comments: true
share: true
---

[Google](https://www.google.it) dà molta importanza alla sicurezza di
[Android](https://www.android.com). Una vulnerabilità nel sistema operativo che
ormai fa girare [qualche milione](#) di dispositivi mobile in giro per il mondo
si può facilmente tradurre in un grosso danno di immagine.

Nella knowledge base di Android viene suggerito
[proguard](http://developer.android.com/tools/help/proguard.html) come libreria
per offuscare il codice. E' importante offuscare il nostro codice altrimenti,
come vedremo in questo post, è possibile fare il reverse di un file APK in
pochissimo tempo e con alte probabilità di successo.

## Perché fare il reverse?

Precisiamo, fare il reverse di un file APK è un'attività che può essere
considerata sulla linea di confine tra il lecito e l'illecito. Se non
esplicitamente espresso dalla licenza, alcune infatti esplicitano il diniego ad
attività di reversing, il confine potrebbe essere oltrepassato solo nel caso si
voglia pacchettizzare un'applicazione modificata con backdoor o trojan o altre
porcate simili.

Io per il [progetto "Stand by
Wordpress"](https://standbywordpress.wordpress.com) ho fatto il reverse del
file APK dell'applicazione WordPress per android per soli fini di studio. Sto
eseguendo una code review e condividerò con loro i risultati sperando possano
capire le motivazioni alla base.

Sicuramente è un'attività che, se fatta **esclusivamente** ai fini di studio,
porta grandi benefici in termini di cose imparate... e ti fa acquistare fin da
subito _100 punti code review_.

## Il file APK

Innanzitutto, tecnicamente voi non _dovreste aver accesso_ ai file APK
installati sul vostro dispositivo. Questo perché, in teoria, voi non _dovreste
aver ottenuto_ i privilegi di root sul proprio dispositivo.
Nel caso, fortuito, voi siate ```UID=0``` sul vostro device, allora potete
scaricare il file dell'applicazione.

In alternativa, perché c'è sempre un'alternativa, voi potete andare sul sito
[www.apkmirror.com](http://www.apkmirror.com) e scaricare il file APK che vi
interessa analizzare.

Una volta scaricata l'applicazione, ci troviamo di fronte alla prima sorpresa.
Per chi non lo sapesse, il file APK non è altro che un archivio ZIP contenente
tutto quello che serve alla nostra applicazione per funzionare. Lo stesso
concetto dei file .app di Mac OS X per intenderci.
Nel nostro file APK, troveremo quindi:

* immagini
* file xml contenenti testi vari
* una directory META-INF che contiene il file MANIFEST.MF ed il certificato
  utilizzato per firmare l'applicazione prima della pubblicazione sullo store.
  Il file MANIFEST.MF contiene invece le permission di cui avrà bisogno
  l'applicazione per essere installata. E' qui che lo store leagge le
  informazioni che vi vengono presentate al momento del download e che
  dovrebbero mettervi in allarme se un giochino ha bisogno di accedere alla
  videocamera.
* il file classes.dex

A noi serve quest'ultimo, quindi estraiamolo.

{% highlight sh %}
$ unzip file.apk classes.dex
{% endhighlight %}

## Il file classes.dex

Il file classes.dex non è altro che l'insieme dei file ```.class``` di cui è
composta l'applicazione, in un formato tradotto per
[Dalvik](http://en.wikipedia.org/wiki/Dalvik_(software)), la virtual machine di
Android.

A questo punto, siamo a metà del nostro percorso. Abbiamo bisogno di tradurre
il formato per Dalvik nel bytecode Java standard per poter utilizzare uno dei
tanti decompilatori che ci sono in giro su Internet.

Scarichiamo, quindi, il tool [dex2jar](http://sourceforge.net/projects/dex2jar)
e traduciamo il nostro file classes.dex in un archivio JAR contenenti classi
nel consueto formato tipico delle applicazioni java.

{% highlight sh %}
$ d2j-dex2jar.sh classes.dex
{% endhighlight %}

L'output è un file chiamato ```classes-dex2jar.jar``` che potremo scompattare
in maniera molto semplice, se ci serve accedere ai file .class, sempre con
```unzip``` oppure che possiamo dare in input al nostro tool di scansione del
codice nel caso supporti anche i file JAR come input.

Siamo arrivati ad avere il bytecode... ora manca un ultimo passaggio.

## I file sorgenti

Uno dei decompilatori Java più completi, ce ne sono **veramente** molti, è
[JD-GUI](http://jd.benow.ca). JD-GUI, si presenta come frontend grafico al
decompilatore vero e proprio, molto pulita e semplice da usare. Una volta
aperto il file JAR, i file class vengono decompilati e presentati a video.

## Off by one

Ci si mette di più a leggere questo post che a fare tutta l'operazione. A
questo punto parte il divertimento vero e proprio. Codice decompilato alla
mano, potete giocare con qualche espressione regolare o qualche colpo di
```grep``` alla ricerca di pattern noti di cattiva programmazione o alla
ricerca di parole chiavi come _secret_, _password_ o _sha7_.

I file .class possono essere utilizzati con
[Findbugs](http://findbugs.sourceforge.net) ad esempio, per una prima analisi
statica automatica.

Non c'è ancora uno strumento che ha preso il posto di [Owasp
Orizon](https://www.owasp.org/index.php/Category:OWASP_Orizon_Project) nello
scacchiere opensource dell'analisi statica per codice Java. Visto che mi serve,
un po' per lavoro, un po' perché sto ancora rispondendo a persone che mi
chiedono aiuto su Orizon e un po' perché manca anche uno strumento per
l'analisi di codice Android, ho ripreso in mano [Decompiling Java](http://www.amazon.it/gp/product/1430254696/ref=as_li_ss_tl?ie=UTF8&camp=3370&creative=24114&creativeASIN=1430254696&linkCode=as2&tag=codicinsic-21) ed ho
iniziato a buttar giù [qualche idea](https://github.com/thesp0nge/smug) che
unisca un po' i punti che ho lasciato aperti durante il mio viaggio
nell'analisi statica di codice Java.

Enjoy it e dimmi cosa ne pensi!
