---
layout: post
title: "Esercizio di code review in PHP: un semplice blogging engine"
promotion: "Questa code review ha dei problemi. Tu sei in grado di vedere dove ho sbagliato? Provaci."
modified: 
featured: true
category: [Under attack]
tags: [code review, php, owasp top 10, life]
image:
  feature: pagella.jpg
  credit: Alessandro Cani
  creditlink: https://flic.kr/p/wXZAh
comments: true
share: true
---

Qualche giorno fa, mi hanno sottoposto il [codice di un sistema di
blogging](https://github.com/thesp0nge/CodeReviewBlog) volutamente scritto in
maniera non sicura. Al suo interno ci sono alcune vulnerabilità che avrei
dovuto trovare e per le quali scrivere un minimo di reportistica.

Scopo dell'attività era una revisione del codice e la stesura di un report con
le classiche cose (descrizione della issue, severità, impatti, blablabla) e con
la patch per due issue.

## Pronti? Via

Partiamo con qualche considerazione:

* il codice è stato scritto, forse, da un liceale senza troppe conoscenze
  informatiche. Probabilmente il software funziona (non l'ho eseguito) ma lo fa
  perché per statistica il programmatore è riuscito a mettere insieme un po' di
  byte casuali che starebbero in piedi;
* di tool opensource per l'analisi statica in PHP non ce ne sono. Non dico
  belli come [dawnscanner](https://rubygems.org/gems/dawnscanner), mi sarei
  accontentato anche di un grep++, stà di fatto che mi devo accontentare di
  farmela a mano.

Prima di partire, consiglio sempre di calcolare il checksum dei file sorgenti.
Quando fai una codereview, ti scontri con l'ego delle persone che non ammettono
facilmente di avere un problema di security. A me è capitato qualche volta che
un bug di security scomparisse magicamente una volta consegnato il report ma
non perché segnalato ad me... perché semplicemente _la modifica era sempre
stata lì[^1]._

{%highlight text%}
$ find . -iname "*.php" -exec md5sum {} \; 
./comments/CMySQL.php     (a51440b6caca65847c3b48538f5b4a06)
./comments/comment.php    (e7cc56c9fa39159f506590ed8c821da0)
./comments/comments.php   (a4f25de38ad5d3ee2a8df96ef9ba7307)
./config.php              (ff84b438989a791d387cc6e4f908f8b6)
./curr.php                (a65f0c97a50a3feac14f37b13247c37f)
./encryption.php          (f33e206d668320c8964885bb5b441852)
./entry_submit.php        (c91152e3b617d06b42d359327d0b02b3)
./footer.php              (3dfe8f971c131fb12f1a8759fbdbae95)
./header.php              (4a26b15d5a68f61421a89678b69367c8)
./index.php               (4318c5ed0c93059d497fa245c7b1b357)
./new.php                 (ccc2549fc32a199b9ca7301cb72e7844)
./older.php               (06d7b44e282f7d6af30b466ae4e55d61)
./show.php                (659af515f1cac20e8e1f68231b0a2a43)
{%endhighlight %}

Dopo il checksum, ho iniziato calcolando un po' di statistiche. L'idea di base
era di stimare la complessità del codice usando solo le dimensioni dei file. La
stima è un po' rozza e poco significativa, avrei fatto meglio a scrivermi
qualcosa che calcolasse l'indice di complessità ciclometica ma era un'attività
mordi e fuggi, non ne ho trovato uno già fatto quindi mi accontento di ```wc
-l```.

{%highlight text%}
$ find . -iname "*.php" -exec wc -l {}\;

103 ./comments/CMySQL.php
54 ./comments/comment.php
65 ./comments/comments.php
10 ./config.php
12 ./curr.php
21 ./encryption.php
16 ./entry_submit.php
11 ./footer.php
35 ./header.php
21 ./index.php
22 ./new.php
15 ./older.php
19 ./show.php

{% endhighlight %}

Ok, da questi numeri _sembra_, ripeto _sembra_, che la parte che gestisce i
commenti sia bella corposa. Statisticamente il numero di bug, e anche di issue
di security, è direttamente proporzionale alle dimensioni dei file. File molto
grandi poi potrebbero indicare sia stato uno sviluppo a più mani (avrei dovuto
avere i log del software di versioning per verificarlo) o potrebbero essere
file con molto codice ridondato.

Terminiamo il primo giro, chiedendo all'interprete PHP di segnalare eventuali
errori di sintassi. Come detto, il codice non è stato eseguito quindi a priori
non sapevo neanche se compilasse.

{%highlight text %}
$ find . -iname "*.php" -exec php -l {} \;

No syntax errors detected in ./comments/CMySQL.php
No syntax errors detected in ./comments/comment.php
No syntax errors detected in ./comments/comments.php
No syntax errors detected in ./config.php
No syntax errors detected in ./curr.php
No syntax errors detected in ./encryption.php
No syntax errors detected in ./entry_submit.php
No syntax errors detected in ./footer.php
No syntax errors detected in ./header.php
No syntax errors detected in ./index.php
No syntax errors detected in ./new.php
No syntax errors detected in ./older.php
No syntax errors detected in ./show.php
{%endhighlight%}

Pulito. Chiudo quindi questa prima fase con una valutazione sullo stile del
codice. Non c'è una segregazione tra layer dati, business logic e presentation.
Troviamo codice che gestisce le query mischiato con HTML. Insomma, questo
codice è una porcheria stilistica che farebbe rabbirividire persino Enzo
Miccio.

## Deep in to the code

La navigazione parte da index.php. Questo file include header.php che a sua
volta prende i parametri di connessione da config.php creando una variabile $db
e costruendo il menu' di navigazione: curr.php per l'entry corrente, older.php
per l'elenco delle entry e new.php per una nuova entry.

La pagina index.php nel body mette l'ultimo post in evidenza, senza crearne un
link tuttavia. Più in basso, crea un elenco di entry meno recenti che vengono
collegate ad show.php con un parametro id che indica il post da visualizzare.


## Risultati

| ID      | Vulnerability                     | Severity |
|---------|-----------------------------------|----------|
| BLOG_1  | Multiple SQL Injections           | Critical |
| BLOG_2  | Stored Cross Site Scripting       | High     |
| BLOG_3  | Information Disclosure            | High     |
| BLOG_4  | Missing anti CSRF token           | High     |
| BLOG_5  | Insecure Direct Object Reference  | Medium   |
|---------|-----------------------------------|----------|

### BLOG_1: Multiple SQL Injection

#### File interessati

* show.php @ line 10
* comments/comments.php @ line 6 (called by show.php @ line 9)
* comments/comment.php @ line 14

#### Impatto

Grazie ad una SQL Injection un attaccante ha una console di accesso al nostro
database, può leggere dati, può modificarli, può aggiungerne di nuovi e può
ovviamente cancellare tutto. Alcuni DBMS permettono un'interazione più intima
grazie a stored procedure che in alcuni sistemi operativi permettono
l'esecuzione di comandi shell.

In questo caso, sfruttare la SQL Injection è veramente una cosa molto basilare.
Nel file show.php il codice vulnerabile è:

{%highlight php%}
$sql  = "SELECT * FROM entries WHERE id = '{$showId}';";
{%endhighlight%}

Basta chiamare la pagina show.php con il più classico degli '1'='1 che si trova
sul web per avere accesso al contenuto della tabella entries ad esempio:
```http://localhost/show.php?id=2' or '1'='1"```

#### Mitigazione

Solitamente si alza in coro il grido **devi usare i prepared statement**.
Questo è sostanzialmente corretto a metà. La soluzione è sì usare i prepared
statement, disponibili anche in PHP a patto di usare il driver mysqli, che
putroppo non è quello di default e sarà per questo che odio PHP, ma la seconda
parte della soluzione è quella di smettere di creare le stringhe attraverso la
concatenazione e l'uso diretto di parametri presi dalla request.

I prepared statement vanno quindi usati correttamente, facendo il binding dei
parametri attraverso le API offerte dalla libreria utilizzata.

Nel nostro caso, va prima di tutto installata e configurata l'estensione
[mysqli](http://php.net/manual/en/mysqli.installation.php).

Una volta che il nostro setup è completo, cambieremo il file header.php ed il
modo con cui crea la connessione al db. Sinceramente non amo l'approccio di
avere una connessione in un file header ma non mi andava di fare una
refactor completo dell'applicazione.

{%highlight php%}
$db= new mysqli($dbhost, $dbuser, $dbpassword, $dbdatabase);
if ($db->connect_errno) {
  echo "Failed to connect to database. Make sure you started the daemon and it's waiting for connections";
  /* complex error management code here... redirect to index.php?*/
}
{%endhighlight%}

Il file show.php diventerebbe quindi:
{%highlight php%}
if (!($stmt = $db->prepare("SELECT * FROM entries WHERE id =  (?)") {
  echo "An internal error occured. Please retry again later";
  /* complex error management code here... redirect to index.php?*/
}
if (!$stmt->bind_param("i", $showId)) {
  echo "An internal error occured. Please retry again later";
  /* complex error management code here... redirect to index.php?*/
}
if (!$stmt->execute()) {
    echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
}
$stmt->bind_result($id, $subject, $dateposted, $body);
$stmt->fetch_row();

echo "<h1>".$id." ".$subject."</h1><br/><i>Posted on: ".date("D j F Y g.iA", strtotime($dateposted))."</i><h2>".$body."<br/></h2>";
showComments($id);
{%endhighlight%}

### BLOG_2: Stored Cross Site Scripting

#### File interessati

Il problema risiede nel file entry_submit.php alla linea 6, quando il post
viene salvato. I punti in cui la vulnerabilità viene sfruttata sono tuttavia 5:

* in index.php line 12 (when last post is displayed)
* in index.php line 16 (previous post subject value)
* in show.php line 16
* in curr.php line 9
* in new.php line 18

#### Impatto

Con un cross site scripting diamo all'attaccante di eseguire codice javascript
arbitrario sui browser delle vittime. Questo può essere usato i molti modi,
dalla cattura delle sessioni utente, alla trasformazione del mio browser in un
bot per attacchi distribuiti contro siti web ad esempio.

#### Mitigazione

Per mitigare questa vulnerabilità occorre fare pulizia nell'input dell'utente
per evitare caratteri speciali che possono essere usati per modificare l'HTML
delle pagine generate dall'applicazione web. Sul web esistono molte librerie per PHP per fare input sanitize, ad esempio possiamo prendere [XSS Filter](https://gist.github.com/mbijon/1098477) e cambiare il file entry_submit.php in questo modo:

{%highlight php%}
<?php
require ("xss_clean.php");
require ("header.php");
require ("encryption.php");
if ($_POST['Submit_Entry']){
if (encrypt($_POST['passw']) == "8ab5648c5c1d3ff0bbd0ffc2f679e753f3183a94a0bd78272623d8090699782936c7b5c9ed508435a2627d7c2edbc4f1d8b379d567c5b18f6cca6151f27adeb9"){
$sql  = "INSERT INTO entries(dateposted, subject, body) VALUES (NOW(), '".xss_clean($_POST['title'])."', '".xss_clean($_POST['entry']."'));";

$result = mysql_query($sql);
echo "Entry Successful";
}
else {
echo "Wrong Password: ";
}
}
?>
{%endhighlight%}

### BLOG_3: Information Disclosure

#### File interessati

* comments.php line 7
* comments/CMySQL.php

#### Impatto

Nel file comments.php viene fatto un cast sulla variabile $blogID ad integer,
questa variabile è sotto il controllo dell'attaccante. Non essendoci alcuna
gestione dell'eccezione, l'attaccante potrebbe causare uno stack trace passando
un carattere alfabetico al posto che numerico.

Nel file CMySQL.php i parametri di connessione al database sono memorizzati
all'interno di una variabile $GLOBALS la cui visibilità è comune all'interno
del web server. Questo permette ad esempio ad uno script php scritto male di
accedere a quelle informazione, eventualmente anche corrompendo la funzionalità
offerta dal nostro blogging engine.

### BLOG_4: Missing CSRF token

#### File interessati
* comment.php

#### Impatto

La routine per inserire nuovi commenti non ha un sistema anti [cross site
request forgery](http://en.wikipedia.org/wiki/Cross-site_request_forgery).

E' possibile utilizzare [questo cheatsheet
Owasp](https://www.owasp.org/index.php/PHP_CSRF_Guard) per inserire un token
anti cross site request forgery.

### BLOG_5: Insecure Direct Object Reference

#### File interessati
* show.php @ line 10

#### Impatto

L'utente può interrogare il database dei post usando il parametro id della
richiesta HTTP nella pagina show.php, la stessa che causa la SQL Injection. Non
c'è alcun tipo di controllo sulla visibilità dei post, quindi di fatto è
possibile enumerare il contenuto della tabella ```entries```. Questo potrebbe
essere un comportamento voluto, tuttavia sarebbe opportuno validare il
parametro prima di passarlo alla query anche per dare consistenza alle
richieste portate al backend.

## Off by one

Ho voluto postare questo mio flusso di coscienza di quest'attività di code
review su un [questo codice volutamente
bucabile](https://github.com/thesp0nge/CodeReviewBlog) per dimostrare che le
code review non vanno mai fatte di fretta ed occorre essere concentrati. Io ho
impiegato 4 ore durante gli spostamenti in metropolitana, di certo non lo
scenario ottimo.

Dagli errori si impara, anche a 40 anni (soprattutto se prendi le cose
sottogamba).

Perché dico questo? Perché questi risultati non sono corretti. Chi mi ha
commissionato questo quiz ha completamente bocciato la review, vi lancio una
sfida quindi... fate voi la code review e ditemi cosa non ho visto e quali
vulnerabilità nuove ho introdotto.


[^1]: sviluppatori che cambiano codice sorgente correggendo un bug e poi ti
      dicono candidi, "no no guarda che questa issue non c'era, forse hai preso
      il file sbagliato": visti.
