---
layout: post
author: thesp0nge
title: "Cerchiamo un host in Nexpose con Ruby"
promotion: "Vediamo come usare ruby e le API di Nexpose per cercare se un host è scansionato o no"
modified: 
featured: false
category: [Pick'n'chic]
tags: [ruby, nexpose, rapid7, vulnerability management, vulnerability assessment, scripting, script]
image:
  feature: lumaca.jpg
comments: true
share: true
---

[Nexpose](https://www.rapid7.com/products/nexpose) è un prodotto commerciale
per il vulnerability management, sviluppato da
[Rapid7](https://www.rapid7.com), gli stessi dietro a Metasploit tanto per
intenderci.

Una particolarità che non deve mancare in alcun tool di security, che Nexpose
ha ed è per questo che l'ho scelto, è una serie di API per sviluppare script
accessori che integrano la nostra piattaforma di vulnerability management.

## Disclaimer

Non sono in alcun modo sponsorizzato da Rapid7 o dal suo distributore italiano.
Quando ho dovuto scegliere uno strumento che mi aiutasse nel vulnerability
management, mi sono basato su alcuni parametri per me importanti:

* integrabilità con altri tool
* possibilità di installazione su Linux
* disponibilità di documentazione
* community
* supporto
* disponibilità di API

Basandomi su questi parametri scelsi Nexpose e poi è stato un rapporto di
amore/odio con alcune cose che il tool fa egregiamente ed altre che il tool fa
un po' meno bene... ed in questi casi mi tocca lavorare con le API.

## Problema

Io tengo sotto vulnerability management un numero discreto di server, tra
sviluppo, collaudo e produzione. Siamo nell'ordine delle migliaia di macchine.

Capita, ogni tanto, che mi si presenti un indirizzo IP o un FQDN che a memoria
non mi dica niente.
Per scoprire se la macchina è sotto scansione, dovrei ogni volta aprire un
browser, puntare alla console, autenticarmi e cercare. Noioso. Ogni tanto i
server che si presentano e che sono da validare sono un'estrazione di un
inventario degli asset. Ricercare a mano, diventa **impossibile** e
sinceramente poco divertente.

## Soluzione

Regola numero 34, comma b, paragrafo 3 dello [thesp0nge](http://thesp0nge.com)
pensiero sul lavoro è: _rendere le cose divertenti affinché la giornata pesi di
meno_.

Per applicare questa regola e risolvere il mio problema, uso le API che Nexpose
mi mette a disposizione e scrivo uno script che mi cerca se un host è presente
oppure no nel mio vulnerability management. Meglio ancora, leggo una lista di
host da un file e li cerco uno ad uno. Sì perché il comma a, paragrafo 15, rigo
f della regola numero 34 recita: _automatizzare, automatizzare tutto il
possibile_.

### Installare le gemme giuste

Per lavorare con ruby e Nexpose abbiamo bisogno della gemma
[nexpose](https://rubygems.org/gems/nexpose) sviluppata dai ragazzi di Rapid7.

Piccola storiella. In realtà spippolo con Nexpose e ruby da qualche anno e la
loro gemma prima era _molto_ limitata. Avevo fatto un fork ed alcuni pull
request al repository originale. Tuttavia le mie modifiche, qualcosa legato
alla ricerca degli asset, fu inglobato senza un merge ma col copia e incolla.
L'approccio non mi piacque ed ebbi uno screzio con uno del team di sviluppo.
Ora sembra che il progetto sia mantenuto meglio, ma continuo a non voler
contribuire direttamente al loro codice. Scritto per altro in pessimo stile
rubesco.

Torniamo a noi. L'installazione della gemma ```nexpose``` è molto semplice e
segue lo stile ruby di installazione delle librerie accessorie.

{% highlight sh %}
$ gem install nexpose
{% endhighlight %}

Useremo anche un po' di colori, quindi installiamo anche la gemma
```logger-colors```.

{% highlight sh %}
$ gem install logger-colors
{% endhighlight %}

Ok, ambiente pronto. Si comincia!

### Fatevi un account

Prima cosa, per non fare danni. Capite bene cosa devono fare i vostri script
con le API e poi createvi un'utenza con le permission ristrette all'osso.
Questo rispetta il principio del minimo privilegio e, soprattutto, vi evita di
fare danni.

Suggerisco, per i meno esperti, di non avventurarvi per ora nella modifica di
site, asset o nel lanciare scansioni da script. Per ora partiamo con operazioni
in sola lettura.

Il mio account si chiama ```nexty_ro``` ed ha i privilegi di visualizzare i
dati relativi a tutti gli asset e tutti i site.

Per Nexpose un asset è una macchina, che può avere anche più di un indirizzo
IP, mentre il site è un raggruppamento logico di asset. Poi ci sono tante cose
carine come asset group che mirano a complicarci ancora di più la vita. Per ora
li ignoriamo.

### Pronti, via!

Il nostro script ruby, parte in maniera abbastanza classica.

{% highlight ruby %}
#!/usr/bin/env ruby

require 'getoptlong'
require 'logger'
require 'logger/colors'

require 'nexpose'
include Nexpose
APPNAME = "nexty"
VERSION = "0.10"

HOST    = "127.0.0.1"
USER    = "nexty_ro"
PASS    = "pippo123"
{% endhighlight %}

Per velocità ho cablato i paramatri di connessione a Nexpose nello script.
Questo pone il problema di proteggere adeguatamente lo script da occhi
indiscreti.

{% highlight sh %}
$ chmod go-rwx script_ficoso.rb
{% endhighlight %}

Ovviamente se ci bucano la macchina e si portano via lo script... bhé,
fessacchiotti voi.

Io ho aggiunto un po' di gestione della linea di comando, ma solo perché allo
script voglio far fare un po' di cose. Per il momento possiamo dedicarci ad una
sola funzionalità. Ignorate pure le altre

{% highlight ruby %}

$logger = Logger.new(STDOUT)
$logger.datetime_format = '%Y-%m-%d %H:%M:%S'

opts = GetoptLong.new(
  [ '--abandoned',  '-A',   GetoptLong::OPTIONAL_ARGUMENT],
  [ '--discovery',  '-d',   GetoptLong::REQUIRED_ARGUMENT],
  [ '--search',     '-s',   GetoptLong::REQUIRED_ARGUMENT],
  [ '--debug',      '-D',   GetoptLong::NO_ARGUMENT],
  [ '--version',    '-v',   GetoptLong::NO_ARGUMENT],
  [ '--help',       '-h',   GetoptLong::NO_ARGUMENT]
)

options={:action=>:none, :input=>nil}

opts.quiet=true
begin
  opts.each do |opt, val|
    case opt
    when '--version'
      puts "#{APPNAME} v#{VERSION}"
      Kernel.exit(0)
    when '--search'
      options={:action=>:search, :input=>val}
    when '--discovery'
      options={:action=>:discovery, :input=>val}
    when '--abandoned'
      options={:action=>:abandoned, :input=>val.to_i}  unless val.empty?
      options={:action=>:abandoned, :input=>90}   if val.empty?
      if options[:input] <= 0
        $logger.info "nexty is starting up"
        $logger.error "-A flag requires a positive number as parameter."
        Kernel.exit(-3)
      end
    end

  end
rescue GetoptLong::InvalidOption => e
  $logger.error e.message
  Kernel.exit(-2)
end

if options[:action] == :none
  $logger.error "nothing to do. Giving up"
  Kernel.exit(-3)
end

$logger.info "nexty is starting up"
do_search(options[:input])    if options[:action] == :search
do_discovery(options[:input]) if options[:action] == :discovery
do_abandoned(options[:input]) if options[:action] == :abandoned
$logger.info "nexty is leaving"

{% endhighlight %}

Ho raggruppato, ma serve un po' di refactoring in effetti, le funzioni che
fanno qualcosa con un namespace del tipo ```do_*```. Essendo uno script
semplice, per ora, non ho messo classi ed è tutto nello stesso file. Elminister
mi punirà.

{% highlight ruby %}

def do_search(input)
begin
  nsc = Connection.new(HOST, USER, PASS)
  nsc.login
  $logger.info "connected to #{HOST} as #{USER}"
  if File.file?(input)
    $logger.info "reading data from file #{input}"
    f = File.readlines(input)
    f.each do |name|
      tocheck = name.chomp+"*"
      old_assets = nsc.filter(Search::Field::ASSET, Search::Operator::IS, tocheck)
      old_assets.each { |a| STDERR.puts "#{name.chomp}, YES" } unless old_assets.empty?
      STDERR.puts "#{name.chomp}, NO" if old_assets.empty?
      STDERR.flush
    end
  else
    $logger.info "searching asset #{input}"
    tocheck = input+"*"
    assets = nsc.filter(Search::Field::ASSET, Search::Operator::IS, tocheck)
    assets.each do |a|
      STDERR.puts "#{a.name} (#{a.id}): #{a.risk_score}"
    end
    STDERR.flush
  end

  nsc.logout
  $logger.info "logout from #{HOST}"
  return 0
rescue Timeout::Error, Errno::EINVAL, Errno::ECONNRESET, EOFError,
       Net::HTTPBadResponse, Net::HTTPHeaderSyntaxError, Net::ProtocolError, APIError => e
  $logger.error "#{e.to_s}"
  return -1
end
end

{% endhighlight %}

Ho aggiunto il carattere '*' per fare una ricerca con wildcard. Se capita
infatti di ricercare il nome macchina, invece censito con FQDN, potremmo anche
non ottenere alcun risultato. In questo modo, se c'è lo troviamo. E' importante
che nel file hosts della macchina che usiamo per la scansione ci siano i nomi
macchina aggiornati in modo che Nexpose possa risolvere sempre l'indirizzo IP.
Ogni tanto i DNS interni non sono aggiornati...

## Off by one

Poter interagire con il nostro sistema di scansione via API è di una comodità
estrema e sinceramente molto divertente.

Presto vederemo come giocare con le scansioni scansioni di discovery per non
lasciarci scappare neanche una macchina.

Enjoy!
