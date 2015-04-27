---
layout: post
title: "Costruiamo un sistema di autenticazione con Sinatra e Warden. Parte 2"
promotion: "Costruiamo un sistema di autenticazione con poche righe di ruby grazie a Sinatra e Warden."
modified: 
featured: true
category: [Sicurina]
tags: [sinatra, ruby, warden, ldap, bcrypt, web app, talk_rd2015]
image:
  feature: warden-2.jpg
  credit: Wisconsin Department of Natural Resources
  creditlink: https://flic.kr/p/b3gXPT
comments: true
share: true
---

Nella [scorsa
puntata]({{site.url}}/blog/costruiamo-un-sistema-di-autenticazione-con-sinatra-e-warden-parte-1/)
abbiamo analizzato il modello ```User``` di una semplice applicazione basata su
[Sinatra](http://www.sinatrarb.com) e
[Warden](https://rubygems.org/gems/warden) per realizzare un frontend di
autenticazione basato su Active Directory o comunque su un server LDAP.

In questa puntata vedremo il controller e le view.


## Il file app.rb

Il nostro file app.rb conterrà i controller della nostra applicazione sinatra.
Definirà tutte le rotte che potranno essere richiamate dall'utente ed invocherà
il modello nel modo opportuno.

Esendo un'applicazione di esempio, ho lasciato la configurazione di DataMapper
in bella vista per gli ambienti di esercizio e di staging. Una mossa più furba
è quella di leggere, in esercizio e in staging o comunque in ambienti
condivisi, il valore del pathname da linea di comando al momento dello startuo
del server, oppure lo si può mettere in una variabile d'ambiente. La variabile
d'ambiente lascia comunque la possibilità di poter essere letta.

{%highlight ruby%}
require 'bundler'
Bundler.require

require 'tilt/haml'
require 'json'

configure(:development) do
  DataMapper.setup(:default, "sqlite3://#{Dir.pwd}/db/codice_insicuro_auth.db")
end
configure(:test) do
  DataMapper.setup(:default, "sqlite3://#{Dir.pwd}/db/codice_insicuro_auth_test.db")
end
configure(:production) do
  DataMapper.setup(:default, "postgres://test:test@localhost/codice_insicuro_auth")
end
configure(:staging) do
  DataMapper.setup(:default, "postgres://test:test@localhost/codice_insicuro_auth_staging")
end

require File.join(File.dirname(__FILE__), 'lib', 'warden.rb')
require File.join(File.dirname(__FILE__), 'models', 'user.rb')
{%endhighlight%}

Di seguito all'inizializzazione di DataMapper troviamo la dichiarazione della
classe CodiceInsicuroAuth che poi andremo ad eseguire.
Diciamo a Sinatra di abilitare le sessioni, necessarie per la memorizzazione
lato server delle informazioni di chi ha fatto login. Creiamo poi un secret che
sarà utilizzato per la generazione del cookie di sessione.

Anche in questo caso, possiamo usare un _secret_ hardcoded nel caso di
un'applicazione di test, tuttavia se molti hanno accesso a quel sorgente può
essere opportuno passare il secret durante lo startup come parametro. In questo
caso si beneficierebbe anche di una variabilità della logica con cui sono
costruiti i token man mano che l'applicazione viene riavviata.

In questo caso, il mio secret è stato generato usando questa funzione nel mio
```.zshrc``` che legge dei dati da urandom e me li mette in un formato
_intelleggibile_.

{%highlight sh %}
function mkpw() { head /dev/urandom | uuencode -m - | sed -n 2p | cut -c1-${1:-10}; }
{%endhighlight%}

{%highlight ruby%}
class CodiceInsicuroAuth < Sinatra::Base
  enable :sessions
  register Sinatra::Flash
  set :session_secret, "QdckPg1tGaloOD2nvix3XAzfy3x73rSKOu8lJgWsCiwp7udBBudWeFmT/qSO/pP90htBCIDSQHvo"

{%endhighlight%}

Si passa poi alla configurazione di Warden e la definizione delle sue strategie
di autenticazione. Quello che voglio realizzare è il seguente:

* in sviluppo l'applicazione dovrà usare la password, in formato
  [bcrypt](https://rubygems.org/gems/bcrypt)
* in staging e produzione, si dovrà utilizzare LDAP

Sostanzialmente ho scelto questo approccio perché lo sviluppo è sul mio
portatile e ci lavoro durante gli spostamenti da e verso casa.

La configurazione di Warden prevede, oltre alla definizione di cosa deve essere
serializzato nella sessione memorizzata server side, l'id dell'utente in questo
caso, la definizione delle strategie e cosa fare in cado si mancata
autenticazione.

{%highlight ruby%}
  if self.development?

    use Warden::Manager do |config|
      config.serialize_into_session{|user| user.id }
      config.serialize_from_session{|id| User.get(id) }

      config.scope_defaults :default,
        strategies: [:password],
        action: 'auth/unauthenticated'
      config.failure_app = self
    end
  else
    use Warden::Manager do |config|
      config.serialize_into_session{|user| user.id }
      config.serialize_from_session{|id| User.get(id) }

      config.scope_defaults :default,
        strategies: [:ldap, :password],
        action: 'auth/unauthenticated'
      config.failure_app = self
    end

  end

  Warden::Manager.before_failure do |env,opts|
    env['REQUEST_METHOD'] = 'POST'
  end
{%endhighlight%}

## Il mio helper lib/warden.rb

[Sinatra](http://www.sinatrarb.com) non ha il concetto di helper, come invece
hanno [Padrino](http://www.padrinorb.com) o [Rails](http://rubyonrails.org).
Nel caso servisse, l'approccio che mi piace di più è quello di creare una
directory ```/lib``` nell'alberatura della mia applicazione Sinatra e creare lì
i miei helper che poi andrò ad includere nell'applicazione principale (il
file ```app.rb```).

In questo caso, ho creato un helper per Warden per definire le strategie e
crearmi alcune routine per recuperare l'utente corrente.

Queste routine sono state create solo per rendere il codice di controller e
viste più leggibile. Framework più complessi basati su Warden come
[Devise](https://rubygems.org/gems/devise) hanno già questi helper pronti, per
progetti più complessi dove magari serve utilizzare Facebook e Twitter come
fonti autoritative per l'autenticazione usare Devise può essere la soluzione
più semplice.

{%highlight ruby%}
def warden
  env['warden']
end

def authenticated?
  warden.authenticated?
end

def current_user
  return warden.user if authenticated?
  return nil unless authenticated?
end
{%endhighlight%}

### Il piccolo stratega della login

Per Warden, una strategia è la descrizione di cosa deve fare una volta che si
vede arrivare una coppia di credenziali.

Warden, nella gestione dell'autenticazione, chiamerà almeno 2 routine che
devono essere **necessariamente** definite in una strategia:

* valid?
* authenticate!

Nella documentazione sul repository github di warden, ci sono molti altri
metodi che possono essere definiti, tuttavia questi due sono quelli obbligatori
e servono per decidere rispettivamente quando una coppia di credenziali è da
considerarsi passibile di essere analizzata e cosa fare per decidere se quella
coppia è valida, ovvero se la password è corretta.

In entrambe le nostre strategie, definiremo il metodo ```valid?``` andando a
verificare che nei parametri passati alla richiesta HTTP via POST, ci siano i
parametri relativi alla username ed alla password.

#### Perché non via GET?

Allora, ci sono tante cose che possono far accapponare la pelle in campo ICT
security, ma nessuna batte username e password (magari in chiaro) passate via
HTTP GET. Se ti stai chiedendo _eh che male c'è?_ vai a dare un'occhiata al
file ```access.log``` di apache.

#### Strategia per le password

La strategia per autenticare la password è molto semplice. Prima ricerco il mio
utente nel database e se lo trovo chiamo il metodo ```authenticate``` della
classe User.

Se il metodo del mio modello restituisce ```true``` allora invoco
```success!``` che dice a Warden di prendere l'oggetto user, passato come
parametro, serializzarlo e metterne l'id in sessione.

Se l'autenticazione fallisce, sollevo un'eccezione dando un messaggio laconico
d'errore.

{%highlight ruby%}
Warden::Strategies.add(:password) do
  def valid?
    params['user'] && params['user']['username'] && params['user']['password']
  end

  def authenticate!
    user = User.first(username: params['user']['username'])

    if user.nil?
      throw(:warden, message: "The username and password combination ")
    elsif user.authenticate(params['user']['password'])
      success!(user)
    else
      throw(:warden, message: "The username and password combination ")
    end
  end
end
{%endhighlight%}

#### Perché un messaggio generico di errore?

Se sei tra le persone che amano spiegare per filo e per segno ad un utente, che
magari non ha molta dimestichezza con l'informatica, il perché ed il per come
le sue credenziali non vanno bene e quindi mandi a video messaggi come _la
password che hai messo è troppo lunga, ti ricordi: solo 6 caratteri?_ o _no
guarda, la username è sbagliata ma questa è la password del mese scorso_ o
_ehi, ti sei scordato la password, schiaccia qui e te la rimando via mail su_,
allora sappi che stai sbagliando tutto.

Messaggi troppo dettagliati possono permettere ad un attaccante di capire come
funziona il tuo meccanismo di autenticazione nel dettaglio, di enumerare gli
utenti validi ed in alcuni casi di bypassare il controllo sulla password.

Per chi poi argomenta che molti utenti trovano questi messaggi difficili perché
magari non si ricordano la password, considera che:

* la porta blindata di casa tua ha una chiave. Baratteresti quella chiave con
  un sistema che ti fa aprire la porta bussando 3 volte di seguito? Vuoi entrare?
  Usa la chiave.
* se i tuoi utenti usano talmente poco il tuo sito da dimenticarsi la password,
  tu l'engagement dei tuoi clienti l'hai già perso e non sarà mettendo a
  repentaglio la sicurezza degli altri clienti affezionati che recupererai
  qualche manciata di click.

#### La strategia per LDAP

La strategia per LDAP è praticamente **identica** a quella per le password;
cambia solo il metodo del nostro modello User che deve essere invocato per
autenticare l'utente.

{%highlight ruby%}
Warden::Strategies.add(:ldap) do
  def valid?
    params['user'] && params['user']['username'] && params['user']['password']
  end

  def authenticate!
    user = User.first_or_create(username: params['user']['username'])

    if user.nil?
      throw(:warden, message: "The username and password combination ")
    elsif user.ldap_authenticate(File.join(File.dirname(__FILE__), '..', 'config', 'ldap.yml'), params['user']['password'])
      success!(user)
    else
      throw(:warden, message: "The username and password combination ")
    end
  end
end
{%endhighlight%}

## Off by one

In questo post abbiamo visto il cuore del nostro meccanismo di autenticazione.
Abbiamo definito le strategie di Warden e collegato il framework con il nostro
modello ```User```.

Nella prossima puntata andremo a vedere nel dettaglio i controller e le viste
che daranno un tocco grafico alla nostra piccola applicazione web.
