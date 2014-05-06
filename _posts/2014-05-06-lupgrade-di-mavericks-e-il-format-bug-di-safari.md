---
layout: post
title: "L'upgrade di Mavericks e il format bug di Safari"
modified:
category: [attackers]
tags: [os-x, apple, format-bug, snprintf, anni 90, mavericks, 10.9, safari, cve-2014-1315]
image:
  feature: safari_format_bug.png
  credit: Il mio macbook
  creditlink:
comments: true
share: true
---

## Quello che non conosci potrebbe ucciderti

Ve la ricordate immagino, la critica alla ragion pura fatta appena una ventina
di giorni fa in pieno ciclone [heartbleed attack](http://heartbleed.com).

> La polemica su open vs closed nella lotta a chi ce l'ha più sicuro appassiona
> un po' tutti e molti, che non hanno mai scritto una riga di codice vogliono
> metterci la bocca.

Se il codice è _opensource_, oltre a rimetterci la faccia come il simpatico
sviluppatore tedesco che un paio di anni fa si è dimenticato di controllare
quanti caratteri doveva allocare, hai anche una chiara descrizione sia della
vulnerabilità che della fix. Sai qual è il problema, sai cosa rischi e sai come
è stato risolto.

Il codice _proprietario_ bhé... ha gli stessi problemi di quello opensource. Ha
anch'esso bug di security. Può avere anch'esso vulnerabilità che fanno
sorridere se pensiamo che si parlava di _format bug_ prima del cambio di
millennio. La differenza sta nel fatto che non sai se il problema è stato
mitigato correttamente. Non sai a volte neanche quale sia il problema: conosci
il sintomo come in questo caso ma puoi solo intuire la causa.

## Il security update APPLE-2014-002

Oggi il mio macbook mi ha chiesto se volessi aggiornare il sistema operativo
con delle non meglio precisate patch che, tra l'altro, risolvevano alcune issue
di security. Attenzione, Apple ti mette a disposizione le release notes
dell'aggiornamento, tuttavia non sempre si ha tempo e voglia
di andarsele a leggere, soprattutto davanti ad un popup apparso durante una
sessione di lavoro.

Ecco, il [Security Update 2014-002](http://support.apple.com/kb/HT6207) è uno
di quelli da installare. Andando a leggere le release note fornite da Apple,
sono molte le vulnerabilità di severità **alta** che sono state fixate.

![La schermata dell'Update Apple 2014-002]({{site.url}}/images/apple-sw-update-2014-002.png)

Tra di esse è stato chiuso il
[CVE-2014-1315](http://web.nvd.nist.gov/view/vuln/detail?vulnId=CVE-2014-1315)
che mi rimanda ai tempi dell'Università. Eravamo tra 2000 e il 2001 e stavo
lavorando con Aldo alla tesi di laurea, il [progetto
AngeL](http://www.sikurezza.org/angel/). Erano due i modi più in voga per
attaccare _localmente_ una macchina unix:

* i buffer overflow[^1]
* le uncontrolled format string.

## Il CVE-2014-1315 e le uncontrolled format string

La vulnerabilità [uncontrolled format
string](http://en.wikipedia.org/wiki/Uncontrolled_format_string)[^2], di cui il
[CVE-2014-1315](http://web.nvd.nist.gov/view/vuln/detail?vulnId=CVE-2014-1315)
è un esempio, sono introdotte quando nel codice sorgente lo sviluppatore stampa
a video una stringa senza usare le direttive di formattazione che le funzioni
della famiglia _printf()_ mette a disposizione.

Questa famiglia di vulnerabilità può portare al crash del programma vulnerabile
e, in alcune circostanze, all'esecuzione di codice arbitrario.

Ora pensate allo scenario in cui una mail di phishing viene inviata con una url
opportunamente formattata. L'URL viene mascherata dall'HTML della mail[^3].
L'ignaro utente che usa Safari clicca il link che contiene in realtà un payload
che sfrutta questa uncontrolled format string. Il risultato è codice arbitrario
eseguito lato client dove, nel caso di Mac OS X, può succedere che qualche
utente abbia privilegi elevati. Ma anche se non fosse un super user,
sicuramente modo di far danni si trova.

Effettivamente l'aggiornamento ha fatto il suo dovere e Safari si comportava
così a fronte della stessa url in ingresso.

![Safari dopo l'upgrade]({{site.url}}/images/safari-after-update.png)

## Ma come funziona il format bug?

L'errore di programmazione alla base di questo, e di praticamente la
maggioranza delle vulnerabilità più gravi lì fuori, è la mancata validazione
dell'input. In questo caso, un input malformato si aggiunge ad una _leggerezza_
dello sviluppatore.

Ecco un esempio di programma C che prende il primo parametro passato dalla
linea di comando e lo stampa su standard output.

{% highlight c%}
#include <stdio.h>
#include <string.h>

int main(int argc, char **argv)
{
  char p[1024];
  // We play fairly. We avoid buffer overflow here. (remember the string
  // termination character '\0', that's why only 1023 bytes copied form argument.
  strncpy(p, argv[1], 1023);
  printf("You wrote:\n");
  printf(p);
  printf("\n");

  return 0;
}
{% endhighlight %}

Riga 11. Stampiamo il contenuto della variabile p, che contiene una stringa
presa dalla command line, quindi contiene una stringa sotto il controllo del
potenziale attaccante, senza dare la direttiva di formattazione, "%s" in questo
caso.

{% highlight c%}
printf(p);
{% endhighlight %}

La cosa strana, compilando con gcc questo codice di esempio, è che ci viene
dato un warning che stiamo usando la printf in un modo potenzialmente insicuro.
Attenzione, pur essendo un modo potenzialmente insicuro, è assolutamente
lecito. A parte il warning, che decidiamo di ignorare, il programma viene
infatti compilato.

{%highlight text %}
format_bug.c:11:10: warning: format string is not a string literal (potentially insecure) [-Wformat-security]
{%endhighlight%}

> Quando compiliamo un software in C, è buona cosa usare la direttiva -Wall in
> modo da avere tutti i _warning_ del caso dal compilatore. In questo modo
> potremmo accorgerci anzitempo di sviste, macroscopiche come nel caso del
> format bug.

Eseguendo il programma vulnerabile, otteniamo che stampa a video quello che noi
gli abbiamo passato dalla linea di comando, la lettera f nell'esempio qui
sotto.

{% highlight text %}
~/src/hacking » ./format_bug "f"
You wrote:
f
{%endhighlight%}

Ora proviamo a dare in pasto al programma la stringa "A %x".
{% highlight text %}
~/src/hacking » ./format_bug "A %x"
You wrote:
A 100
{%endhighlight%}

La lettera A ce l'aspettavamo, ma quel 100 da dove arriva? Eh, la printf
vulnerabile ha preso quanto passato a linea di comando ed ha interpretato la %x
come una direttiva di formattazione, che comunque deve essere passata alla
printf all'interno di una stringa costante, quindi di fatto la chiamata è del
tutto lecita.

La man page di printf[^4] spiega bene cosa fa la direttiva x:

{% highlight text %}
The conversion specifiers and their meanings are:
  diouxX  The int (or appropriate variant) argument is converted to signed
  decimal (d and i), unsigned octal (o), unsigned decimal (u), or unsigned
  hexadecimal (x and X) notation.
{%endhighlight%}

Prende un argomento e lo stampa in notazione esadecimale. In questo caso in cui
l'argomento non c'è, la printf lo va a prendere risalendo lo stack.
Se non ci credete proviamo a mettere un po' di quelle %x...

{% highlight text %}
~/src/hacking » ./format_bug "AAAA %x %x %x %x %x %x %x %x %x %x %x %x %x"
You wrote:
AAAA 100 7756b638 ddccfdc1 40 5159de00 0 0 0 5159dfb0 41414141 25207825 20782520 78252078
{%endhighlight%}

Ecco qui, è apparso il _41414141_ che altro non è che la rappresentazione in
esadecimale di 4 lettere 'A'.

Se non ci credete, proviamo a cambiare una lettera e vediamo l'output cambiare,
un 41 sarà diventato un 42 ovvero la rappresentazione esadecimale della lettera
'B'.

{% highlight text %}
~/src/hacking » ./format_bug "ABAA %x %x %x %x %x %x %x %x %x %x %x %x %x"
You wrote:
ABAA 100 7756b638 cb5d2fd6 40 5b66fe00 0 0 0 5b66ffb0 41414241 25207825 20782520 78252078
{%endhighlight%}

Sempre dalla pagina di manuale della printf vediamo che c'è un modo per
ottimizzare la scrittura qui sopra. E' possibile infatti dire alla printf di
scegliere l'n-esimo parametro da stampare, secondo la direttiva di
formattazione passata, dalla lista semplicemente mettendo appena dopo il segno
%, il numero ordinale del parametro seguito dal carattere $.

{% highlight text %}
~/src/hacking » ./format_bug 'ABAB %10$x'
You wrote:
ABAB 42414241
{%endhighlight%}

La printf ha una seconda direttiva che può tornare molto utile ora, la
direttiva %n. La direttiva %n scrive nell'indirizzo di memoria passato come
parametro, il numero di caratteri stampati in precedenza.
{% highlight text %}
n       The number of characters written so far is stored into the integer indicated by the int * (or variant) pointer argument.  No argument is converted.
{%endhighlight%}

Passando la direttiva %n nel nostro pattern d'attacco andremo a dire alla
printf vulnerabile di scrivere il numero 4 (il numero di caratteri della
stringa ABAB) all'indirizzo di memoria 0x42414241.

Il risultato, sul mio Mac è quello di causare un errore di segmentazione,
dovuto al meccanismo di protezione della memoria del sistema operativo.

{% highlight text %}
~/src/hacking » ./format_bug 'ABAB %10$n'
You wrote:
[1]    65639 segmentation fault (core dumped)  ./format_bug 'ABAB %10$n'
{%endhighlight%}

A questo punto il prossimo passo è cercare di scrivere un valore arbitrario in
memoria. L'obiettivo è caricare uno shellcode in una locazione di memoria nota
e sovrascrivere il valore dell'instruction pointer del programma vulnerabile in
maniera tale da deviarne il flusso di esecuzione e facendoci aprire una shell.
Se il programma dovesse girare con privilegi elevati anche la shell
erediterebbe tali privilegi.

Ma, c'è un ma. Il passo era breve fino a quando non hanno farcito i sistemi
operativi di controlli per non rendere eseguibile lo stack e altri ammenicoli
per limitare questo tipo di danni. Stavo provando, mentre scrivevo questo post,
a bucare il mio programma vittima ma Mac Os X si è rivelato un valido
avversario. Quindi credo che rimanderò la parte "dal core dump alla shell" in
un post ad hoc, per evitare che questo diventi un papiro.

## Off by one

Abbiamo visto come una semplice distrazione possa portare un attaccante ad
usare il nostro codice per leggere e scrivere dati arbitrari in memoria.

Abbiamo anche visto come ci sono software che usiamo ogni giorno, il nostro
browser, che soffrono di vulnerabilità critiche che affliggono la nostra
postazione di lavoro e che possono essere sfruttate, spesso, da codice web
caricato in siti malevoli (che ovviamente visitiamo o carichiamo a nostra
insaputa... chi ha detto porno?)

Abbiamo visto come è importante installare le patch di security che il sistema
operativo ci propone. Vale per i server ma vale soprattutto per i client.

Mentre scrivevo questo post, è uscita una vulnerabilità critica per Internet
Explorer riassunta nel bollettino
[MS14-021](https://technet.microsoft.com/en-us/library/security/ms14-021.aspx).

Cito testualmente dal Technet:

{%highlight text%}
"The vulnerability could allow remote code execution if a user views a
specially crafted webpage using an affected version of Internet Explorer. An
attacker who successfully exploited this vulnerability could gain the same user
rights as the current user. Users whose accounts are configured to have fewer
user rights on the system could be less impacted than users who operate with
administrative user rights."
{%endhighlight%}

Quindi se Windows Update vi sta implorando da una settimana di installare
questo upgrade, vi consiglio caldamente di lasciarlo fare. Questo è quello che
rischiate: [anatomia di un exploit: CVE
2014-1776](http://vrt-blog.snort.org/2014/05/anatomy-of-exploit-cve-2014-1776.html)

Su [stackoverflow.com](http://stackoverflow.com/questions/7459630/how-can-a-format-string-vulnerability-be-exploited) trovate il solito bellissimo thread pieno di contenuti interessanti e di spunti sui format bug.

Ci lasciamo con un la promessa di un seguito presto su questi schermi, "Format
bug e OS X: dal core dump alla shell" dove ripartiamo dal core dump ottenuto
nel tentativo di scrivere in memoria con la direttiva %n.

Enjoy it!

[^1]: se non sapete cosa sia un buffer overflow, in attesa che prepari un post apposta qui su codiceinsicuro.it, leggete la bibbia in materia: [Smashing The Stack For Fun And Profit](http://insecure.org/stf/smashstack.html)
[^2]: rimando al link inglese di Wikipedia in quanto, come in molte voci che parlano di IT e di sicurezza informatica, molto più completo della traduzione in italiano.
[^3]: come riporta il bollettino del NVD, la vittima deve interagire volontariamente con il pattern di attacco (cliccare il link). Nel caso di utenti non smaliziati, la cosa è tutto fuorché improbabile, putroppo.
[^4]: man 3 printf
