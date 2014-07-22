---
layout: post
title: "Automatizzare, automatizzare e automatizzare. Quando non puoi fare tutto tu"
modified: 
category: [Sicurina]
tags: [code review, svn, metriche, complessità ciclomatica, automatismi]
image:
  feature:
  credit:
  creditlink:
comments: true
share: true
---

E' almeno un annetto che il mio capo mi chiede se è possibile automatizzare
alcuni test. A lui si è aggiunto il mio team mate da un po'. Di solito quando
si tratta di cambiamenti così radicali, lascio che l'esigenza di ripresenti da
sola un po' di volte per capire quanto è critica, prima di buttarmi a capofitto
nell'implementarla.

Visto che ritorna prepotentemente, molto probabilmente è un'esigenza reale e
impellente e merita di scalare in priorità.

> Ma cosa vuol dire automatizzare l'SSDLC?

## Problemi, vincoli e requisiti

A me non piacciono i tool commerciali, sia di WAPT (Appscan, WebInspect,
Acunetix, Netsparker, ...) sia di CodeReview (Fortify, Ounce, Checkmarx) per un
semplice motivo[^1]: non si integrano e non puoi scriptarli.

Quando ho iniziato a pensare al problema di automatizzare, almeno in parte, il
mio workout di application security, mi sono trovato ad affrontare il problema
delle GUI. I tool sono fatti per essere venduti standalone, o al massimo
integrati con altri prodotti della suite del vendor che ti promette di
risolvere tutti i problemi del Creato.

> Problema numero **uno**: gli strumenti che ho non vanno bene, devo usare
> qualcosa che possa essere lanciato da command line, senza intervento umano,
> guidato se possibile da un file di configurazione flessibile a piacere e con
> un output che io possa consumare per creare una dashboard.

Il secondo problema è *cosa testare?* Attività come il penetration test
applicativo o la code review sono tipologie di test che hanno intriseche
componenti umane molto forti. Il chi fa i test, la sua esperienza e la sua
seniority influiscono sulla bontà del report finale. Cercare di modellare il
comportamento di un tool esistente affinché esegua certi test non è difficile:
è impossibile. E' impossibile altresì mettersi a riscrivere ogni volta tool ad
hoc che modellino la particolare applicazione web o il particolare pezzo di
codice o il particolare test.

> Problema numero **due**: trovare il subset di test che è possibile
> automatizzare.

## Imparare dai migliori

Per capire come automatizzare sono andato sul web ed ho cercato talk che
parlassero di cose analoghe. Sono stato fortunato ed in
[Twitter](https://twitter.com) hanno avuto proprio la mia esigenza, quella di
automatizzare il più possibile la parte di testing.

Le esperienze altrui devono essere, ovviamente, prese come ispirazione; serve
poi calarle nella propria realtà che è differente caso per caso.

## Carrello della spesa

Dunque, quello che ci serve, per la parte di code review è:

* parlare con gli sviluppatori e capire che sistema di versioning e quali
  linguaggi sono utilizzati;
* un sistema per memorizzare dove sono i sorgenti ed eventualmente le
  credenziali per fare checkout: un file YAML andrà benissimo, alpiù un database
  SQLite;
* uno strumento che calcoli metriche sui sorgenti;
* uno strumento che faccia un minimo di analisi statica.

Segno di poca voglia di sperimentare in certi ambienti, dove si comprano
battaglioni di junior con poca passione e con l'unica aspirazione di diventare
manager nella grande società di consulenza e fare tanti bei powerpoint, i
linguaggi che affronterete saranno Java e .NET. Meno probabile, ma ancora
possibile, php e c. Scordatevi, purtroppo, di vedere cose scritte in Go,
NodeJS, Ruby... è già tanto che se ne parlate non esordiscano con la battuta
_"Ruby? ahahahah, chi? Quella di Silvio?"_.

Prima del tool, risolviamo cosa dovete verificare non ci sia nel codice. Lo
scenario ideale è quello nel quale voi abbiate distribuito internamente delle
linee guida di sviluppo sicuro. In questi documenti ci sarà scritto quali API,
quali pattern di programmazione dovranno essere evitati in favore di
alternative più sicure.

Il vostro tool dovrà cercare nel codice i pattern che nelle linee guida avete
marcato come cose non gradite nel software aziendale. Se non avete delle linee
guida di sviluppo sicuro, mentre ne scrivete una, vi consiglio di andare sul
sito Owasp e cercare nei vari Cheatsheet come prevenire cross site scripting e
SQL Injection per i vari linguaggi ed iniziare almeno da lì.

> Una linea guida di sviluppo sicuro che sia bella pragmatica, con molti esempi
> di codice, è comunque qualcosa che vi serve veramente.

## Censire i sorgenti

Vinta la lotta con i vari responsabili che si dimostreranno restii e ostili nel
darvi accesso ai sorgenti, dovete rendere permanente al vostro sistema dove
andare a pescare i dati. Mi raccomando, già è difficile vincere la lotta per
avere il dove... non chiedete un'utente che possa fare anche commit, limitatevi
al _read only_. E' un suggerimento che viene dal cuore.

Allo scopo, anche in previsione che poi scriverò tutto in Ruby[^2], va
benissimo un file JSON, qualcosa del tipo:

{%highlight json%}
[
{"name": "PippoBackend", "CVS":  "svn", "url":  "https://myrepository.local/svn/PippoBackend", "username": "guest", "password": "guest" },
{"name": "PippoBackend", "CVS":  "svn", "url":  "https://myrepository.local/svn/PippoBackend", "username": "guest", "password": "guest" }
]
{%endhighlight%}

> **attenzione** qui mettete le credenziali dei vari sistemi di versioning,
> questo file è da proteggere!!!

Leggere le informazioni contenute qui denro è un _oneliner_ (dopo il require
'json').

{%highlight ruby%}
2.0.0-p353 :003 > a=JSON.parse(File.read("/Users/thesp0nge/tmp/test.json"))
 => [{"name"=>"PippoBackend", "CVS"=>"svn", "url"=>"https://myrepository.local/svn/PippoBackend", "username"=>"guest", "password"=>"guest"}, {"name"=>"PippoBackend", "CVS"=>"svn", "url"=>"https://myrepository.local/svn/PippoBackend", "username"=>"guest", "password"=>"guest"}]
{%endhighlight%}

Molto più comodo di un DB e molto più semplice da proteggere a livello di
filesystem.

## Calcolare le metriche

Allora, qui si entra in un ginepraio di tutto quello che la teoria
dell'Ingegneria del Software ha insegnato. Potrei urtare la sensibilità di
qualcuno. Potrei non dare la definizione più adatta della matrica che più
amate. Pace.

Calcolare un po' di metriche serve a me, application security, sostanzialmente
per valutare ad occhio qual è la probabilità che un paricolare sorgente abbia
bug al suo interno. Solo statistica.

Il codice lo prendo in prestito da un branch di sviluppo di
[dawn](https://github.com/codesake/codesake-dawn). Quindi si applicano solo a
sorgenti scritti in ruby. L'equivalente per altri linguaggi di programmazione è
magari uno spunto per sciversi uno script ad hoc.

{% highlight ruby %}
@raw_file_content = File.readlines(@filename)

...

@raw_file_content.each do |line|
  comment += 1 if line.strip.chomp.start_with?('#')
  nl += 1 if line.strip.chomp.start_with?('\n') || line.strip.chomp.start_with?('\r') || line.chomp.empty?
  lines +=1
end
{%endhighlight%}

L'indicazione che posso avere in termini di rapporto tra linee vuote o linee di
commento e numero totale di linee è empirica e la lego alla psicologia dello
sviluppatore. Tutti noi siamo presi dalla sindrome della pagina bianca quando
non sappiamo cosa scrivere. Non potendo scarabocchiare sul monitor, ho valutato
nel corso degli anni che un eccessivo numero di linee vuote equivale alla
situazione in cui chi stava scrivendo non aveva colto tutti i dettagli
dell'algoritmo da implementare.
Questo significa: possibilità di errori nella business logic.

**Nota bene** questa è una mia valutazione personale creata sulla base del
codice che ho visto negli anni. Non ha alle spalle nessuna spiegazione
scientifica. Come #sha7.

Il numero di commenti se troppo basso in relazione al numero di linee di
codice, può indicare se accoppiato ad un indice di complessità ciclomatica
elevato un codice lasciato crescere come le piante di un giardino d'agosto:
incontrollate.

In un sorgente di grosse dimensioni e complesso, quindi con un indice
ciclomatico elevato, non avere dei commenti indica la probabilità che quel
codice sia assolutamente non manutenibile e quindi prono a tutta una serie di
errori che solo l'immaginazione può limitare.

**Nota ancora meglio** sto usando condizionali e sto parlando di probabilità. A
beneficio dello sviluppatore permaloso che legge qui.

Per calcolare la complessità ciclomatica di un codice, dawn prima fa il parsing
del codice sorgente e poi va a vedere quante istruzioni che causano un branch
sono state trovate. Questa è solo una stima dell'indice ipotizzato da McCabe,
che parlava del numero di possibili percorsi all'interno di un grafo dove i
nodi sono le istruzioni del nostro pcodice da esaminare.

{% highlight ruby %}
@ast = RubyParser.new.parse(File.binread(@filename), @filename) if is_ruby?
@ast = RubyParser.new.process(Haml::Engine.new(File.read(@filename)).precompiled, @filename) if is_haml?
@ast = RubyParser.new.process(Erb.new(File.read(@filename)).src, @filename) if is_erb?

...

def calc_cyclomatic_complexity
  ret = 1
  @ast.deep_each do |exp|
    ret +=1 if is_a_branch?(exp.sexp_type)
  end
  ret
end
def is_a_branch?(type)
  branch_types = [:if, :if_mod, :unless, :unless_mod, :when, :elsif, :ifop,
                  :while, :while_mod, :until, :until_mod, :for, :do_block, :brace_block,
                  :rescue, :rescue_mod]
  return true if branch_types.include?(type)
end
{% endhighlight %}

## Analizza il tuo codice

A questo punto, puoi scegliere il tool di analisi statica che preferisci o che
puoi permetterti visto i costi. L'idea di creare un automatismo porta a non
avere tool scritti con la GUI, questo scoraggia i più, ma che [non sia un
lavoro per tutti lo avevamo già
capito](https://codiceinsicuro.it/blog/ricordami-perche-lo-faccio-non-e-un-lavoro-per-tutti/).

Per Java e .NET, alternative free o da command line non ce ne sono AFAIR. Per
PHP inutile copiare quanto presente sul solito [thread fantastico su
stackoverflow](http://stackoverflow.com/questions/378959/is-there-a-static-code-analyzer-like-lint-for-php-files), mentre per ruby vi segnalo:

* [Codesake::Dawn](http://rubygems.org/gems/codesake-dawn) - disclaimer: sono il project leader
* [Brakeman](http://rubygems.org/gems/brakeman) - il migliore


[^1]: a dire la verità i motivi sono molteplici e partono dal costo,
      improponibile, alla curva di apprendimento (ripida quando vuoi andare un minimo
      nel dettaglio) per arrivare al rumore di fondo dato dai falsi positivi. Troppi.
      L'output a volte è pressoché inutile.

[^2]: che no, non è quella che si impalmava il buon Silvio nazionale e che
      adesso ha più soldi di quanti ne potremmo vedere noi in una vita.
