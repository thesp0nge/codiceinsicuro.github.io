---
layout: post
title: "Costruiamo un sistema di autenticazione con Sinatra e Warden - Parte 3"
promotion: "Costruiamo un sistema di autenticazione con poche righe di ruby grazie a Sinatra e Warden (parte 3)."
modified: 
featured: true
category: [Sicurina]
tags: [sinatra, ruby, warden, ldap, bcrypt, web app, talk_rd2015]
image:
  feature: warden-3.jpg
  credit: John Haslam
  creditlink: https://flic.kr/p/3qrPVn
comments: true
share: true
---

Nella [prima puntata di questa mini
serie]({{site.url}}/blog/costruiamo-un-sistema-di-autenticazione-con-sinatra-e-warden-parte-1/)
abbiamo visto tutta la business logic per autenticare i nostri utenti, censiti
su un LDAP. Nella [seconda
puntata]({{site.url}}/blog/costruiamo-un-sistema-di-autenticazione-con-sinatra-e-warden-parte-2/)
abbiamo visto all'opera [Warden](https://rubygems.org/gems/warden) ed abbiamo
constatato quanto sia semplice farne il setup di fatto realizzando un solido
sistema di autenticazione con veramente poche linee di codice.

Oggi ci concentriamo con le rotte, le viste e come bonus track scriviamo uno
script che faccia funzioni di console per il debug,
[Sinatra](http://www.sinatrarb.com) non ha infatti un equivalente a ```rails
console``` per intenderci.

## Quattro rotte, quattro

Ci servono 4 endpoint per gestire l'autenticazione dei nostri utenti.

### Atterraggio

La rotta più semplice gestisce l'atterraggio di utenti non autenticati al
sistema. Solitamente a questo link si viene _gentilmente_ accompagnati quando
si tenta di accedere ad una risorsa protetta.

{%highlight ruby%}
get '/' do
  redirect '/auth/login' unless authenticated?
end
{%endhighlight%}

Quello che andremo a fare è unicamente presentare la maschera di login.

{%highlight ruby%}
get '/auth/login' do
  haml :login
end
{%endhighlight%}

Il nostro login.haml (che andremo a posizionare nella directory ```views/```
sarà simile a questo.

{%highlight haml%}
.container
  %form.form-signin{:action => "/auth/login", :method => "post"}
    %span#reauth-email.reauth-email
    %input#inputEmail.form-control{:autofocus => "", :placeholder => "Domain user", :required => "", :type => "text", :name => "user[username]"}/
    %input#inputPassword.form-control{:placeholder => "Password", :required => "", :type => "password", :name=>"user[password]"}/
{%endhighlight%}

Scopriamo quindi la seconda rotta che dovremo implementare, quella che gestisce
il submit della form.

### Biglietti prego

Nella rotta che gestisce la POST ad ```/auth/login``` dobbiamo chiamare warden
e chiedere di autenticare il nostro utente. Se [ci
ricordiamo]({{site.url}}/blog/costruiamo-un-sistema-di-autenticazione-con-sinatra-e-warden-parte-2/)
quando abbiamo definito le nostre strategie di autenticazione, abbiamo
implementato un metodo ```authenticate!``` che invocava il metodo opportuno
della classe ```User``` per autenticare il nostro utente.

Ora è giunto il momento di connettere i punti, quindi in risposta a questa
POST, passeremo la palla a Warden.

{%highlight ruby%}
post '/auth/login' do
  env['warden'].authenticate!
  flash[:success] = env['warden'].message

  if session[:return_to].nil?
    redirect '/'
  else
    redirect session[:return_to]
  end
end
{%endhighlight%}

Ricordate che di default, quando abbiamo configurato Warden abbiamo indicato
```/auth/unauthenticated``` come action nel caso l'autenticazione non vada a
buon fine.

### Si ritorni in fila

La nostra terza rotta sarà quindi quella di default quando l'autenticazione non
va a buon fine. Tuttavia qui c'è veramente poco da fare.

{%highlight ruby%}
post '/auth/unauthenticated' do
 redirect '/'
end
{%endhighlight%}

### E' stato bello

L'ultima rotta che dobbiamo dare ai nostri utenti è quella per il logout
volontario.

{%highlight ruby%}
get '/auth/logout' do
  env['warden'].raw_session.inspect
  env['warden'].logout
  flash[:success] = 'Successfully logged out'
  redirect '/'
end
{%endhighlight%}

Anche in questo caso ci affidiamo ad un metodo di default di Warden per il
logout.

## Console

Come promesso ecco la bonus track. In [Sinatra](http://www.sinatrarb.com) non
c'è come dicevamo, l'equivalente di ```rails console``` o della console di
padrino.
A volte, anzi **sempre**, è utile testare modelli, helper via
[IRB](http://en.wikipedia.org/wiki/Interactive_Ruby_Shell). Per fare questo il
nostro script, che chiameremo ```/bin/console```, non dovrà fare altro che
includere la nostra applicazione, app.rb, ed avviare IRB.

{%highlight ruby%}
#!/usr/bin/env ruby

require 'irb'
require './app'

IRB.start
Kernel.exit(0)
{%endhighlight%}

Tutto qui? Sì, tutto qui.
Se lo confrontate con il config.ru, noterete che sono pressoché identici. La
differenza più importante è che, al posto di lanciare la nostra applicazione,
si lancierà IRB.

{%highlight ruby%}
require './app'

run Unlock
{%endhighlight%}

Nel caso di config.ru più complessi e quindi applicazioni Sinatra con più
modelli, più controller, un mapping delle rotte più granulare la regola aurea
per creare un bin/console è quella di copiare il config.ru, eliminare l'ultima
parte del file ed avviare IRB dopo che sono state caricate tutte le dipendenze.
L'ultima riga, la ```Kernel.exit(0)``` ci assicura che non parta Sinatra una
volta usciti da IRB, facendo terminare correttamente lo script.

## Off by one

Abbiamo quasi finito. Il nostro sistema ora permette di autenticare gli utenti
su active directory e gestire la loro sessione tramite Warden. Nella prossima
puntata inseririremo la protezione [per il cross site request
forgery](https://github.com/baldowl/rack_csrf) ed un meccanismo per inserire
controlli per evitare l'immissione di password troppo semplici da parte dei
nostri utenti.

Enjoy it!
