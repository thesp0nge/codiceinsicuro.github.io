---
layout: post
author: thesp0nge
title: "Costruiamo un sistema di autenticazione con Sinatra e Warden. Parte 1"
promotion: "Costruiamo un sistema di autenticazione con poche righe di ruby grazie a Sinatra e Warden."
modified: 
featured: false
category: [Sicurina]
tags: [sinatra, ruby, warden, ldap, bcrypt, web app, talk_rd2015]
image:
  feature: warden-1.jpg
comments: true
share: true
---

Facendo [penetration test
applicativi]({{site.url}}/blog/cose-un-penetration-test-applicativo-web/) da un
po' di anni ormai, sono abituato a vedere le peggiori cose davanti alla
maschera di login.

Non parlo di avere o meno HTTPS, anche se molti si ostinano a lasciare le
configurazioni di default sui server e quindi a lasciare abilitati SSLv2 e 3,
parlo di errori come:

* password memorizzate in chiaro o con un algoritmo di hash non sicuro;
* mancata integrazione con active directory o LDAP aziendale

## Active Directory e quella voglia di lavorare un po' di meno

Pensiamo un po' alle nostre reti aziendali. Praticamente ovunque c'è un domain
controller che gestisce l'autenticazione per le workstration windows.
Praticamente ovunque ci sono applicazioni aziendali pubblicate sulla intranet,
ciascuna con il proprio meccanismo di autenticazione (ed un database utenti).
Questo introduce:

* diversi database con credenziali di utenti interni sono su sistemi. La
  sicurezza di quei dati è demandata alla sicurezza di quei server. Se sono
  macchine di collaudo o sviluppo, è come aver pubblicato quei dati su
  [facebook](https://www.facebook.com/CodiceInsicuro).
* gli utenti, se non forzati, non cambieranno mai le password sui vari sistemi
  sparsi per l'azienda. Potremmo quindi avere quel "CAMBIAMI" che ci eravamo
  promessi di cambiare prima o poi, potremmo avere account dimenticati, potremmo
  avere mille situazioni che mettono in pericolo la credenziale stessa
  del'utente.

Basare il proprio meccanismo di autenticazione su una ricerca LDAP sul domain controller mi regala:

* provisioning / deprovisioning degli utenti. Se una persona lascia l'azienda,
  automaticamente non è più attivo anche sulla mia piattaforma;
* non devo inventarmi modi per salvare la password. Devo solo fare la pagina di
  login e fare un metodo nel mio _model_ che fa una bind ad LDAP;
* posso usare i gruppi di AD per la parte di autorizzazione;
* eredito le policy in atto per la complessità della password e per il cambio
  della stessa.

Tutto questo **scrivendo meno codice**, mi domando quindi... ma perché la gente
ama così tanto crearsi il proprio DB utenti con un'inutile MD5 sbandierata come
non plus ultra dell'application security?

## Problema culturale?

Recentemente ho sentito parlare un security manager che giustamente
sottolineava come il time to market, le scadenze impossibili e [stakeholder a
volte ignari dei
rischi]({{site.url}}/blog/spiega-la-sicurezza-informatica-al-marketing/) fanno
in modo che non si possa sviluppare un ecosistema di codice insicuro.

Bonariamente, è stato omesso anche il problema legato alla mancanza di cultura
ed un certo
[menefreghismo]({{site.url}}/blog/se-paghi-noccioline-attirerai-scimmie-storie-job-posting-nellera-delle-startup/)
che gira attorno al glue code partorito da junior venduti come senior da
società di consulenza per cui il C/R è più importante di un lavoro ben fatto.

Già. Siamo tutti campioni digitali, siamo tutti leader di mercato, ci vendono
consulenti che hanno 26 anni ma già 10 anni di esperienza in sviluppo
_enterprise_, i presales dicono tutti quanti di essere leader di mercato e poi
in azienda io cliente mi trovo certe brutture che neanche in un liceo.

**Rant?** Sì, mi fermo qui. Voi che leggete e state per fare il vostro
nuovissimi meccanismo di autenticazione, fermatevi un attimo e andate sotto.

## Perché Sinatra e Warden?

Chi scrive codice [Ruby](http://www.ruby-lang.org/en) spesso si butta subito
sull'accoppiata [Ruby on Rails](http://rubyonrails.org) per scrivere il proprio
parto in salsa HTTP. Ebbene, a me [Ruby on Rails](http://rubyonrails.org)
proprio non piace più.

Più precisamente, Rails ha smesso di entusiasmarmi dalla versione 3.qualcosa.
Prima era qualcosa di leggero ed era veramente sviluppo attraverso convenzioni.
Adesso, mio gusto personale, si è trasformato in un accrocchio gigantesco che
già dopo il primo ```rails new pippo``` ti ritrovi un elenco di gemme e di
dipendenze lungo come l'antico testamento.

Userò quindi [Sinatra](http://www.sinatrarb.com) come framework. Lo conosco (ed
usare qualcosa che si conosce è già il primo passo per il successo) ed è
leggero. Questa scelta mi da un piccolo ostacolo. Essendo Rails la moda, la
maggior parte delle gemme là fuori sono pensate con convenzioni che non si
applicano ad altri framework. Vedremo come ovviare.

[Warden](https://rubygems.org/gems/warden) è invece un middleware per Rack che
ci consente di creare la parte per l'autenticazione. E' semplice da usare e
configurare e può essere usato in maniera indipendente dal framework MVC
preferito.

## Il nostro Gemfile

Voglio fare in modo che la mia applicazione quando è in ambiente di sviluppo si
appoggi sulla più canonica accoppiata username e password, mentre usi
LDAP/Active Directory in staging e produzione. Perché questo? Perché lavorando
spesso negli spostamenti casa/ufficio può essere pesante mettere un server LDAP
sul nostro portatile e dargli un'alberatura uguale a quella del nostro domain
controller aziendale.

{%highlight ruby%}
source 'https://rubygems.org'
gem 'sinatra'
gem 'sinatra-flash', require: 'sinatra/flash'
gem 'haml'
gem 'net-ldap'
gem 'bcrypt-ruby'
gem 'data_mapper'
gem 'warden'
gem 'shotgun', :group => [:development, :test]
gem 'dm-sqlite-adapter', :group => [:development, :test]
gem 'dm-postgres-adapter', :group => [:production, :staging]
gem 'dawnscanner', :group => [:development, :test]
gem 'capistrano'
{%endhighlight%}

Uso [dawnscanner](https://rubygems.org/gems/dawnscanner) per la parte di
analisi statica e [DataMapper](http://datamapper.org) come ORM per astrarmi dal
database.

Io uso da sempre [RVM](https://rvm.io), ma gli equivalenti vanno benissimo lo
stesso. L'idea è quella che crearsi un proprio ambiente isolato per il
progetto, dove mettere tutte le gemme può essere una buona idea. Una volta
creato il gemset, installiamo le librerie di terze parti: ```$ bundle
install```.

## Il nostro modello: la classe User

Prima di vedere l'applicazione vera e propria, esaminiamo per un momento il
nostro modello, ```user``` in questo caso.

La prima parte di una classe che implementa un modello basato su
[DataMapper](http://datamapper.org) contiene la definizione delle proprietà che
corrisponderanno alle colonne della nostra tabella, ```users``` in questo caso.

Per convenzione, DataMapper crea una tabella chiamata con il nome della class
ruby, mettendola al plurale. Il consiglio migliore che vi posso dare è quello
di **non** usare mai nomi in italiano per le vostre classi, proprio per questo
genere di convenzioni.

{%highlight ruby%}
require 'bcrypt'

class User
  include DataMapper::Resource
  include BCrypt

  property :id, Serial, key: true
  property :username, String, length: 128

  property :password, BCryptHash
{%endhighlight%}

Che bello poter definire un campo come ```BCryptHash``` ignorando completamente
quanti caratteri riservare, lasciando che se ne occupi per noi l'ORM.

Non solo questo, la libreria ```BCrypt``` ridefinisce anche il metodo ```==```
per la classe ```BCryptHash```. Osservando il metodo ```authenticate``` io
passo una password (in chiaro) ed è il metodo ```==``` a cifrare il suo
parametro confrontandolo con il valore memorizzato nel db.

{%highlight ruby%}
  def authenticate(attempted_password)
    if self.password == attempted_password
      true
    else
      false
    end
  end
{%endhighlight%}

I puristi avrebbero riscritto ```authenticate``` in questo modo:
{%highlight ruby%}
  def authenticate(attempted_password)
    return self.password == attempted_password
  end
{%endhighlight%}

Scrivo anche la versione ottimizzata, che non ho testato, nel mio codice ho
lasciato l'altra, per evitare thread sull'ottimizzazione di questo metodo.

La magia dell'autenticazione LDAP/AD viene invece assicurata dal metodo
```ldap_authenticate```. Do come parametro un file di configurazione in formato
YAML e la password.

Un contenuto come questo per intenderci:
{%highlight yaml%}
host: "myhost"
port: 389
base: "DC=foo,DC=bar"
suffix: "foo.bar"
{%endhighlight%}

La routine poi prova a fare la bind ad LDAP e restituisce un boolean a seconda
se ci sia o meno riuscita.

{%highlight ruby%}
  def ldap_authenticate(filename, attempted_password)
    return false unless File.exist? filename

    conf=YAML.load_file(filename)
    conn = Net::LDAP.new :host => conf["host"],
      :port => conf["port"],
      :base => conf["base"],
      :auth => { :username => "#{self.username}@#{conf["suffix"]}",
                 :password => attempted_password,
                 :method => :simple }
      return conn.bind
  end
end
{%endhighlight%}

L'ultima parte del file, se fate attenzione questo codice è già fuori la classe
User, dice a DataMapper di concludere la configurazione e di fare
l'aggiornamento in automatico della tabella user a seconda delle property
trovate nella definizione della classe.

Questo modo è molto più rozzo delle migrazioni presenti in
[Rails](http://rubyonrails.org) o [Padrino](http://www.padrinorb.com), ma se
usato bene è gestibile... soprattutto se non si fanno troppi cambi nel
database.

Attenzione, nel caso voi abbiate dei modelli con delle associazioni tra di
loro, la parte di finalize e di auto_upgrade va fatta una sola volta, di solito
nel file ```config.ru``` una volta fatto il require di tutti i modelli.

{%highlight ruby%}
# Tell DataMapper the models are done being defined
DataMapper.finalize

User.auto_upgrade!
{%endhighlight%}

Mi creo un utente per lo sviluppo locale. L'utente admin:admin avrà senso solo
in ambiente di sviluppo, sarà warden ad occuparsi del metodo di autenticazione
da utilizzare sulla base della nostra configurazione.
{%highlight ruby%}

# Create a test User
if User.count == 0
  @user = User.create(username: "admin")
  @user.password = "admin"
  @user.save
end
{%endhighlight%}

## Off by one

Oggi abbiamo visto la prima parte del nostro sistema di autenticazione basato
su Sinatra e Warden. Nelle prossime puntate vedremo come costruire i controller
e le viste. Infine vedremo come creare una gemma che ci permetta di
riutilizzare questo sistema per più progetti diversi.

Enjoy it!
