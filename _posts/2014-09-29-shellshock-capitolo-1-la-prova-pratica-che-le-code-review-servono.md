---
layout: post
title: "Shellshock capitolo 1. La prova pratica che le code review servono"
modified: 2014-09-29 18:37:43 +0200
category: [Chiacchiere da bar]
tags: [code review, opensource, bash, shellshock, exploit, vulnerabilità, heartbleed, cve-2014-6271, cve-2014-6277, cve-2014-7169, cve-2014-7186, cve-2014-7187]
image:
  feature: shells.png
  credit: Alex Loach
  creditlink: https://flic.kr/p/bDzuBm
comments: true
share: true
---

Se non sapete cosa sia la vulnerabilità
[shellshock](http://en.wikipedia.org/wiki/Shellshock_(software_bug)), allora
siete rimasti scollegati dalla rete negli ultimi 4, 5 giorni. In alternativa
non vi occupate né di software, né di _Information Technology_ in generale, il
che in alcune circostanze è un bene.

[La vulnerabilità che ha preso il nome di
shellshock](https://www.google.it/search?client=safari&rls=en&q=shellshock+vulnerability&ie=UTF-8&oe=UTF-8&gfe_rd=cr&ei=nhkpVLGFKMaO8Qfu24GADA)
è una issue di security che afflige l'interprete dei comandi [bash](http://www.gnu.org/software/bash/). Scoperta da [Stéphane Chazelas](http://stephane.chazelas.free.fr) il 12 Settembre e
parcheggiata per permettere la scrittura della patch ed il successivo rilascio
degli aggiornamenti da parte delle principali distribuzioni di Linux e Unix (e
sì, anche Mac OS X, ma la Apple sta ancora pensando a [The Fappening](https://www.google.it/search?client=safari&rls=en&q=the+fappening&ie=UTF-8&oe=UTF-8&gfe_rd=cr&ei=nZYrVJ61N6WO8QfvwYCQBw)).

Resa nota il 24 Settembre a questa vulnerabilità è stato assegnato un primo
identificativo [CVE-2014-6271](http://web.nvd.nist.gov/view/vuln/detail?vulnId=CVE-2014-6271) ed un indicatore di severità, il
[CVSS](http://www.first.org/cvss), di 10 su 10.

## Cos'è una shell?

I sistemi operativi moderni offrono un'interfaccia grafica che permette di
interagire con il nostro computer, che permette di far fare "cose" a questa che
sarebbe solo una calcolatrice con manie di protagonismo. E a volte con un bel
retina display.

Quest'interfaccia, che permette di creare cartelle, di spostare file da una
cartella all'altra, di lanciare i programmi, di svuotare il cestino, deve
appoggiarsi su un "qualcosa" per parlare con il sistema operativo, che è quella
cosa, per farla **MOLTO** breve, che gestisce per voi l'hardware, i pezzi di
ferro insomma.

Questo qualcosa, questi servizi offerti dal sistema operativo, formano la
shell. La shell, non è altro che un involucro[^1] che racchiude il kernel.
Quando aprite il terminale, o il _prompt di dos_ per i più smaliziati, aprite
un programma che espone la shell ai vostri comandi, permettendovi di fare le
stesse cose (in maniera molto più potente e parametrizzata) che fate con
l'interfaccia grafica.


Ok, in breve e molto semplificato, questa è la _shell_. La [bash](http://www.gnu.org/software/bash/) è
una delle tante shell disponibili, ce ne sono molte altre, ma questa è quella
di default all'interno di un sistema Linux. Ognuno è libero di cambiarsela, ma
questa è quella con cui partite.

> La shell che uso io è la [zsh](http://www.zsh.org), ma tanto non preoccupatevi una
> bash voi ce l'avete, così come il buco.

## Le vulnerabilità

### CVE-2014-6271

Tanto per essere chiari, il problema si chiama errore nell'interpretazione
dell'input. Se un utente dichiara una variabile d'ambiente contenente una
funzione opportunamente formattata in modo da accodare dei comandi arbitrari al
corpo della funzione stessa, la shell non solo prende quell'input e lo mette
nella variabile come se fosse del testo, ma esegue anche tutti i comandi che le
sono stati dati.

{%highlight sh%}
$ env x='() { :;}; echo vulnerable' bash -c 'echo hello'
vulnerable
hello
$
{% endhighlight %}

La scritta vulnerable non dovrebbe apparire. Appare? Ecco, allora dovete
aggiornare la bash, al posto di "echo vulnerable", potrebbe esserci un meno
rassicurante "rm -rf /" o "echo 0 > /dev/sda".

> E' importante notare che il comando arbitrario viene eseguito con gli stessi
> privilegi dell'utente che sta assegnando alla variabile "x" il payload
> d'attacco.

Un utente non privilegiato, in realtà può far ben pochi danni. Può tirarsi la
zappa sui piedi, non può leggere _/etc/shadow_ ad esempio. L'utente root, al
contrario, può, ma voi non siete sempre connessi con l'utente privilegiato
vero?

...

**Vero?[^2]**

In realtà, le vulnerabilità non sono una sola ma **cinque**. Aperto il vaso di
Pandora, non si sa mai quanta porcheria esce vero? Cinque issue diverse di
security, tutte figlie di codice scritto male. Tutte figlie della **stessa**
porzione di codice scritta male.

Quella di cui abbiamo parlato prima, che viene testata con quel pezzetto di
codice ha preso l'identificativo
[CVE-2014-6271](http://web.nvd.nist.gov/view/vuln/detail?vulnId=CVE-2014-6271).

### CVE-2014-7169

Tavis Ormandy, mentre lavorava alla patch per il
[CVE-2014-6271](http://web.nvd.nist.gov/view/vuln/detail?vulnId=CVE-2014-6271),
ha trovato un altro bug nel parser della shell.

Prendete questo pezzo di codice.

{% highlight sh %}
env X='() { (a)=>\' sh -c "echo date"; cat echo
{% endhighlight %}

Sintatticamente non è corretta come definizione, infatti se osservate bene le
parentesi graffe non sono neppure bilanciate. La shell da un messaggio
d'errore, tuttavia il parser prende il codice 'sh -c "echo date"' ed esegue il
comando date mettendo l'output in un file chiamato _echo_.

Se provato a lanciare solo il pezzo aggiunto per attaccare la macchina, vedete
che il comporamento è quello atteso, ovvero "date" viene preso come parametro
del comando "echo" e quindi viene stampata la stringa "date" a video.

{% highlight sh %}
$ sh -c "echo date"
date
$
{% endhighlight %}

Il problema è nel parser della shell che invece interpreta "date" come un
comando da eseguire ed "echo" come nome del file da usare per redirigerne
l'output.

Lanciato sul mio **Mac** poco fa:

{% highlight sh %}
$ env X='() { (a)=>\' sh -c "echo date"; cat echo
sh: X: line 1: syntax error near unexpected token `='
sh: X: line 1: `'
sh: error importing function definition for `X'
Tue Sep 30 08:17:36 CEST 2014
$
{% endhighlight %}

### CVE-2014-7186 e CVE-2014-7187

Florian Weimer, un ricercatore [RedHat](http://www.redhat.com), mentre lavorava
alla patch per il
[CVE-2014-6271](http://web.nvd.nist.gov/view/vuln/detail?vulnId=CVE-2014-6271),
ha trovato non uno, ma due problematiche. Quando la shell si trova a gestire
più dichiarazioni come _<<EOF_ o _done_ permette di concatenare nello stack un
comando arbitrario a spazzatura, comando che ovviamente viene eseguito dalla
shell.

Un sistema vulnerabile a CVE-2014-7186, eseguendo questo codice, stamperà
"CVE-2014-7186 vulnerable, redir\_stack"

{% highlight sh %}
bash -c 'true <<EOF <<EOF <<EOF <<EOF <<EOF <<EOF <<EOF <<EOF <<EOF <<EOF <<EOF <<EOF <<EOF <<EOF' ||
echo "CVE-2014-7186 vulnerable, redir_stack"
{% endhighlight %}

Invece, un sistema vulnerabile a CVE-2014-7187, stamperà a video "CVE-2014-7187
vulnerable, word\_lineno" quando si tenterà di eseguire questo ciclo for.

{% highlight sh %}
(for x in {1..200} ; do echo "for x$x in ; do :"; done; for x in {1..200} ; do echo done ; done) | bash ||
echo "CVE-2014-7187 vulnerable, word_lineno"
{% endhighlight %}

### CVE-2014-6277 e CVE-2014-6278

Leggete direttamente il post di [lcamtuf](http://lcamtuf.blogspot.it/2014/09/quick-notes-about-bash-bug-its-impact.html) e scoprite quanto in realtà è profonda la tana del bianconiglio.

## L'attacco

Aprire una shell di root e volontariamente assegnare ad una variabile
d'ambiente un payload con un comando dannoso è uno scenario d'attacco non
realistico. Non è così che la vulnerabilità viene _sfruttata[^3]_.

Ci sono, tuttavia, numerosi vettori per portare l'attacco.

### Script CGI

I [CGI](http://it.wikipedia.org/wiki/Common_Gateway_Interface), o Common Gateway Interfaces, sono delle pagine web
dinamiche scritte solitamente in Perl o per i più avventurosi in C o usando la
bash stessa. Solitamente uno script CGI utilizza le variabili d'ambiente per
passare informazioni, comandi, richieste dell'utente a tool terzi presenti
sulla macchina, per eseguire compiti specifici.

Ad esempio HTTP\_USER\_AGENT può essere usata per passare al programma
informazioni su chi lo sta chiamando, magari per fare multiplexing su vari
servizi ad esempio. Se eseguo una richiesta HTTP, mettendo uno dei pattern
d'attacco dello shellshock in questo campo HTTP e se questo campo viene messo
in una variabile d'ambiente usata da una shell, sono nei guai. Concedo
all'attaccante di eseguire codice arbitrario con i privilegi dell'utente che in
quel momento sta eseguendo il web server. Si spera non root. **Si spera**.

### SSH e DHCP

Possibili vettori d'attacco possono essere anche
[OpenSSH](http://www.openssh.org) grazie alla funzionalità di _ForceCommand_ e
all'uso delle variabili d'ambiente come buffer per memorizzare i comandi da
eseguire e i server DHCP che possono essere configurati per passare pattern
d'attacco a client ed eseguire così codice arbitrario.

## Ma quindi opensource vuol dire veramente sicuro?

Spesso confrontandomi davanti ad una birra, quando si parlava di cose
tecnologiche, la dicotomia opensource-sicurezza saltava fuori.

> Il software opensource è più sicuro. Il codice è lì a portata di tutti.
> Abbasso W$nZ0ZZ! ... Così dicevano.

Col senno di poi, questa tesi ha una seria lacuna. Il software opensource è più
sicuro, perché il codice è lì a portata di tutti ma **se e solo se** qualcuno
il codice lo guarda.

La vulnerabilità era lì, latente, dalla versione 1.13 della bash datata
**1992**.

22 anni fa.

Questo fa perdere un po' di certezze anche al fanboi più accanito. Se non si
investe tempo e risorse per fare revisioni del codice per issue di security
anche sul software opensource, lo scenario come quello di questa 4 giorni di
fuoco è quello che ci aspetta.

Lo vedremo nella seconda parte, quando analizzeremo dove è il problema nel
codice della shell, ma stiamo parlando di un pachiderma software non più
mantenuto. Parliamo di codice con uno stile di programmazione che potremmo
definire antidiluviano.

E tutto questo, ha portato ad un software non di qualità e insicuro.

Nonostante, come nel caso di
[heartbleed](https://codiceinsicuro.it/blog/heartbleed-parte-1-la-chiacchiera-da-pub/),
la vulnerabilità fosse lì sotto gli occhi di tutti da più di dieci anni.

## Mac OS X ed i suoi utenti

Apple ha cura dei propri utenti... ne ha molta cura e li tratta come stupidi.
Sappiamo tutti che la GUI di Mac OS X è fantastica, ma molti utenti usano anche
il Mac per quello che è... un sistema Unix.

Cito il commento di Apple sull'esposizione dei propri utenti, non lo traduco
per evitare di introdurre errori.

> The vast majority of OS X users are not at risk to recently reported bash
> vulnerabilities," an Apple spokesperson told iMore. "Bash, a UNIX command
> shell and language included in OS X, has a weakness that could allow
> unauthorized users to remotely gain control of vulnerable systems. With OS X,
> systems are safe by default and not exposed to remote exploits of bash unless
> users configure advanced UNIX services. We are working to quickly provide a
> software update for our advanced UNIX users.
_(fonte: [iMore](http://www.imore.com/apple-working-quickly-protect-os-x-against-shellshock-exploit)_

Brillante deduzione. Se non configuri alcun servizio che accetti connessioni e
magari se tieni il Mac offline allora sei al sicuro da #shellshock.

Per favore, interrompete un attimo la lettura ed alzatevi in piedi per
tributare l'ufficio stampa Apple dell'applauso per la #fuffaware dell'anno.

Mac OS X, come tutti i server unix di questo mondo, può essere vulnerabile...
basta che ospiti un Apache con mod\_cgi abilitato ed una pagina dinamica che
usa crea una variabile d'ambiente a fronte di un input dell'utente e
l'_exploit_ è servito.

Per la cronaca, la fix per i sistemi della mela morsicata è per fortuna
[disponibile](http://support.apple.com/kb/DL1768).

## Off by one

22 anni.

22 anni senza che persona alcuna pensi sia arrivato il momento di fare una code
review di security su quel software opensource che tutti usiamo.

La bellezza dell'opensource non sta in una presunta sicurezza imposta da una
forza superiore. La bellezza dell'opensource è che la comunità **può** fare
queste revisioni, perché il codice è aperto e disponibile a tutti.

Se la comunità non lo fa, si perde la bellezza ed il senso di avere il codice
aperto. E giustifica chi, forse perché di parte, afferma che il software
commerciale ha maggiori investimenti in revisioni di sicurezza. Il codice tanto
è chiuso, non potremo mai verificare.

Enjoy!

**UPDATE 1**
Grazie a [@guly](https://twitter.com/theguly) che mi ha ricordato i concetti
base delle sottrazioni e per avermi segnalato che mi ero dimenticato dei CVE
scoperti da
[lcamtuf](http://lcamtuf.blogspot.it/2014/10/bash-bug-how-we-finally-cracked.html)

**UPDATE 2**
Grazie a epinna per la segnalazione sul typo


[^1]: da qui il nome, per analogia con il mondo dei molluschi

[^2]: sì posso capirlo. Lanciare _sudo comando_ è meno veloce di lanciare n
      comandi al secondo all'interno di una sessione con un bel _#_ come prompt dei
      comandi e mostrare al mondo che siamo i Billy the Kid della tastiera. Tuttavia,
      se volete essere dei buoni sysadmin e non rischiare di brasare la vostra
      macchina per un errore, dovete lavorare come utente non privilegiato ed usare
      sudo alla bisogna.
[^3]: Paolo ama la lingua italiana. _to exploit_ è figo come verbo, ma
      _exploitata_ è ridicolo da sentirsi figurarsi da leggersi.
