---
layout: post
author: thesp0nge
title: "Testiamo in automatico le password dei nostri utenti"
promotion: "Con un piccolo script ruby verifichiamo che i nostri utenti non abbiano password banali"
modified: 
featured: false
category: [Pick'n'chic]
tags: [ruby, ldap, active directory, password, password policy]
image:
  feature: pwd_incorrect.jpg
comments: true
share: true
---

Facendo penetration test da un po' di tempo, una delle cose che ho notato più
frequentemente è che le persone sottovalutano molto la necessità di avere una
password robusta.
Questo è ancora più divertente quando, durante le sessioni di awareness, la
gente ti guarda quasi sfottendo e ti dice _"sì, ma tanto per arrivare a quella
vulnerabilità devi essere dall'interno dell'azienda, come fai da fuori?"_

> Se la tua password per l'accesso in VPN è "Cagnolino123" o "Marzo1976" non è
> che ci voglia poi molto.

Ricordate il mantra del 2015? Automazione. Io voglio che mensilmente mi parta
uno script che mi dia un elenco di persone che hanno credenziali deboli.

## Abbiamo detto che siamo a Marzo, giusto?

Al di là degli evergreen come ```Password```, il proprio username, una tendenza
è quella di avere come password il mese e l'anno... così da dare anche una
parvenza di complessità e di dinamicità, ogni 3 mesi password completamente
nuova.

L'innocenza degli utenti incauti è così dolce.

Facciamo attenzione a giocare ai novelli ispettori Cluseau. Potremmo causare il
blocco dell'account se iniziamo a fare bruteforce delle password. Questo, oltre
a fare innervosire il nostro soc, causa un moto di fastidio nell'utente che può
non comprendere del tutto le finalità dei nostri test.

L'idea è quindi, partendo da un elenco di username, provare alcune password del
tipo ```MeseAnno```. Però, visto che vogliamo automatizzare il test, voglio che
sia il mio script a costruire l'elenco delle password partendo dal mese
corrente.

Grazie alla classe DateTime di ruby, questo si realizza abbastanza facilmente.
{%highlight ruby%}
def self.generate_passwords(limit=5)
    today = DateTime.now
    month = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"]

    ret = []
    ret << "#{month[today.month - 1]}#{today.year}"
    t=today
    (1..limit).each do |l|
      t = t << 1
      ret << "#{month[t.month - 1]}#{t.year}"
    end
    ...
{%endhighlight%}

Come fare poi per testare la coppa di credenziali? Semplice, provo a fare una
bind LDAP ad uno dei domain controller usando quello username e quella
password.

Questo metodo può essere utile anche se volete fare autenticazione su
ActiveDirectory da un'applicazione Sinatra o Padrino.

{%highlight ruby%}
def self.authenticate(login, pass)
  return nil if login.empty? or pass.empty?

  conn = Net::LDAP.new :host => "ldapserver",
    :port => 389,
    :base => 'DC=foo,DC=bar',
    :auth => { :username => "#{login}@foo.bar",
               :password => pass,
               :method => :simple }
    return conn.bind
rescue Net::LDAP::LdapError => e
  puts e
  return false
end

{%endhighlight%}

Il concetto è semplice, se la bind va a buon fine allora le credenziali sono
corrette, altrimenti la password non è quella. Da alcuni numeri ricavati in
questi anni di test, con questo metodo si possono raccogliere dal 20 fino al
70% delle password di dominio di un'organizzazione.

Preferisco avere come output un file csv, per successivi spippolamenti con un
foglio di calcolo. Questo piace **M-A-L-E-D-E-T-T-A-M-E-N-T-E** agli executive.
Per comodità, salvo anche su SQL il tutto, utilizzando
[DataMapper](http://datamapper.org), un ORM leggero che mi torna utile in quasi
tutti gli script che faccio.

{%highlight ruby%}
if Mamba.authenticate(user,pass)
  STDOUT.puts "#{user},ANTANI"
{%endhighlight%}

**ATTENZIONE** avete appena salvato da qualche parte un elenco di username e
password. Fate attenzione a dove lo conservate. Sarebbe meglio comunque cifrare
il file con GPG o simili.

**ATTENZIONE (parte 2)** se non avete mandato aziendale per fare un test del
genere non mettetevi a giocare al piccolo hacker. Passate guai seri con
l'ufficio del personale. Un test del genere deve essere finalizzato unicamente
per una statistica sulla bontà dell'awareness aziendale sul tema di protezione
dei dati di accesso. Questo punto è molto importante, non è un gioco.

Nel dubbio che qualche lettore incauto non seguisse questi due punti, ho
modificato lo script rimuovendo il salvataggio della password. Questo per i fan
accaniti del copia e incolla.

## Off by one

Salviamo questo script in un nostro server di scansione e creiamo un file con
un'estrazione degli utenti di dominio. Mettiamo poi un cronjob che fa partire
ogni mese la scansione et voilà, avremo la situazione aggiornata dei nostri
utenti.

Tutto qui? Per nulla... i risultati scoraggianti che vedremo sono prima di
tutto un minito per noi. L'awareness lo stiamo facendo male. Dovremo sforzarci
ancora di più nel far capire ai nostri utenti che serve scevliere una password
robusta per accedere ai sistemi, soprattutto la propria postazione di lavoro.

Ecco lo script completo.
Enjoy!

{% highlight ruby %}
#!/usr/bin/env ruby

require 'net/ldap'
require 'yaml'
require 'date'
require 'data_mapper'
require 'dm-sqlite-adapter'
require 'dm-timestamps'


DataMapper::setup(:default, "sqlite3://#{Dir.pwd}/broken_accounts.db")

class User
  include DataMapper::Resource
  property :id, Serial
  property :login, String

end
DataMapper.finalize

User.auto_upgrade!

class Mamba
  def initialize

  end
  def self.authenticate(login, pass)
    return nil if login.empty? or pass.empty?

    conn = Net::LDAP.new :host => "ldapserver",
      :port => 389,
      :base => 'DC=foo,DC=bar',
      :auth => { :username => "#{login}@foo.bar",
                 :password => pass,
                 :method => :simple }
      return conn.bind
  rescue Net::LDAP::LdapError => e
    puts e
    return false
  end
  def self.generate_passwords(limit=5)
    today = DateTime.now
    month = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"]

    ret = []
    ret << "#{month[today.month - 1]}#{today.year}"
    t=today
    (1..limit).each do |l|
      t = t << 1
      ret << "#{month[t.month - 1]}#{t.year}"
    end
    ret << "Password01"
    ret << "Password02"
    ret << "Password03"
    ret << "CagnolinoBagnato123"
    #
    # Accoda qui un file di dizionario tuo
    #

    ret
  end

  def bite(filename)
    usernames = File.readlines(filename)
    start = Time.now
    Mamba.generate_passwords.each do |pass|
      STDERR.puts "Trying #{pass}"
      usernames.each do |user|
        user=user.chomp
        if Mamba.authenticate(user,pass)
          STDOUT.puts "#{user},ANTANI"
          u=User.new
          u.login = user
          u.save
          STDOUT.flush
        end

      end
      STDERR.puts "Going to sleep"
      sleep(300)
      STDERR.puts "Awake!"
    end
    end_time = Time.now

    STDERR.puts (end_time-start).duration
  end
end

class Numeric
  def duration
    secs  = self.to_int
    mins  = secs / 60
    hours = mins / 60
    days  = hours / 24

    if days > 0
      "#{days} days and #{hours % 24} hours"
    elsif hours > 0
      "#{hours} hours and #{mins % 60} minutes"
    elsif mins > 0
      "#{mins} minutes and #{secs % 60} seconds"
    elsif secs >= 0
      "#{secs} seconds"
    end
  end
end

raise "Missing filename" if ARGV.count != 1
raise "File doesn't exists" unless File.exists?(ARGV[0])
mamba = Mamba.new({:input=>ARGV[0]})
mamba.bite(ARGV[0])



{% endhighlight %}
