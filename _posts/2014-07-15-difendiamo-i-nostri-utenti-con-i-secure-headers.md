---
layout: post
author: thesp0nge
title: "Difendiamo i nostri utenti con i secure headers"
modified:
category: [Sicurina]
tags: [ruby, twitter, secure headers, csp, hsts, x-frame, x-xss, x-content-type]
image:
  feature: scudo.png
comments: true
share: true
---

In un mondo ideale, e per fortuna questo pazzo universo sembra molto lontano
dall'esserlo, due cose succederebbero oggi:

* la Germania non avrebbe distrutto il Brasile in una semifinale mondiale per
  [7-1](http://www.repubblica.it/speciali/mondiali/brasile2014/brasile/2014/07/08/news/brasile_germania-91059920/)
* tutto il mondo farebbe safe coding, applicherebbe tutte le _best practice_ in
  tema di sviluppo sicuro, farebbe un paio di code review prima del rilascio ed
  un penetration test approfondito.

Nel mondo reale, possiamo impazzire cercando di sensibilizzare gli sviluppatori
che lavorano con noi ai temi a noi più cari, ma possiamo anche dar loro una
piccola ricetta veloce, tipo [quelle della
Parodi](http://www.realtimetv.it/web/molto-bene/ricette-molto-veloci/), da
applicare per mitigare **alcuni** dei rischi legati al codice insicuro.

Rullo di tamburi: i [secure headers](https://www.owasp.org/index.php/List_of_useful_HTTP_headers)

## 5 header HTTP in più, 5 problemi in meno

Ormai il browser è diventato il programma che la gente usa di più. Tutti i
vendor hanno alle spalle un team di security con i controfiocchi dedicato alla
sicurezza della navigazione web ed il browser, con i suoi aggiornamenti
settimanali, è il componente più gestito di tutta la nostra postazione di
lavoro.

A partire da un paio d'anni organismi standard come l'IETF, il w3c o vendor in
autonomia hanno introdotto delle aggiunte al protocollo HTTP affinché si
proteggesse più efficacemente il browser dell'utente.

|Header|Descrizione|
|------|-----------|
|[Content Security Policy](https://w3c.github.io/webappsec/specs/content-security-policy/)|Permette di dichiarare quali sono le URL lecite che l'applicazione intende utilizzare per caricare contenuti. Di fatto impedisce attacchi come cross site scripting, clickjacking, cross frame scripting che si basano sull'iniettare nella pagina contenuti presi da siti arbitrari, solitamente in mano all'attaccante.|
|[HTTP Strict Transport Security](https://tools.ietf.org/html/rfc6797)|Forza il browser ad usare HTTPS come protocollo di comunicazione ed impedisce all'utente di ignorare i messaggi di avviso |
|[X-Frame-Options](https://tools.ietf.org/html/draft-ietf-websec-x-frame-options-02)|Nasce per contrastare il [clickjacking](https://www.owasp.org/index.php/Clickjacking) e permette di dire al browser di non fare il rendering di un frame sulla base della provenienza dello stesso.|
|[X-XSS-Protection](http://msdn.microsoft.com/en-us/library/dd565647(v=vs.85).aspx)|Abilita dei filtri presenti nei browser più recenti e che provano a mitigare i cross site scripting.|
|[X-Content-Type-Options](http://msdn.microsoft.com/en-us/library/ie/gg622941(v=vs.85).aspx)|Permette di bloccare il contenuto di script e risorse esterne sulla base del content-type.|

## La gemma secure_headers

La gemma [secure_headers](https://github.com/twitter/secureheaders) è stata
sviluppata dal team di application security di [twitter](http://twitter.com)
per introdurre gli header di cui sopra nel loro social network.

Era il 2011 infatti quando un [DOM based XSS](https://www.owasp.org/index.php/DOM_Based_XSS) fece
proliferare a suon di retweet un cross site scripting a catena come se si
[trattasse di un worm](http://blog.mindedsecurity.com/2010/09/twitter-domxss-wrong-fix-and-something.html).
Da allora una prima contromisura fu l'introduzione di sicurezza proattiva lato
client.

La gemma si installa o direttamente o inserendola nel ```Gemfile```
dell'applicazione web e attraverso l'esecuzione del comando ```bundle
install```.

Una volta installata, creiamo un file
```config/initializers/secure_headers.rb``` dove mettiamo la configurazione
iniziale della gemma che sarà caricata in automatico da rails allo startup
dell'applicazione.

{% highlight ruby %}
::SecureHeaders::Configuration.configure do |config|
  config.hsts = {:max_age => 20.years.to_i, :include_subdomains => true}
  config.x_frame_options = 'DENY'
  config.x_content_type_options = "nosniff"
  config.x_xss_protection = {:value => 1, :mode => 'block'}
  config.csp = {
    :default_src => "https://* self",
    :frame_src => "https://*",
    :img_src => "https://*",
    :report_uri => '//antani.com/uri-directive'
  }
end
{% endhighlight %}

Ora abilitiamo i secure_headers modificando il file ```application_controller.rb```:

{% highlight ruby %}
class ApplicationController < ActionController::Base
  # Probabilmente questa riga ci sarà già, serve per proteggervi dai cross site
  # request forgery. Se manca, aggiungetela.
  protect_from_forgery with: :exception
  ensure_security_headers
end
{% endhighlight %}

In automatico saranno aggiunti agli header di risposta, le impostazioni di
security che abbiamo specificato nel nostro file di configurazione.

Come tutte le cose che hanno a che fare con il virtual patching, ad esempio
l'uso di WAF come [mod_security](https://www.modsecurity.org), questo non si sostituisce alla
scrittura di codice sicuro, è un di più.

Nel caso voi scriviate codice Java, vi rimando al progetto
[highlines](https://github.com/sourceclear/headlines) che imposta gli header di
security per voi.

## Off by one

Grazie ai secure headers, avete la possibilità di mitigare al volo alcune
problematiche di security in attesa che implementiate hardening nel vostro
codice, seguendo [una delle linee guida di sviluppo sicuro che avete sulla
scrivania](https://codiceinsicuro.it/blog/date-una-linea-guida-al-ragazzo/).

Partite da qui, create una buona content security policy ed implementate il
filtro anti cross site scripting e poi dedicate il vostro tempo a capire come
rendere la vostra applicazione web più sicura.

Se non avete una linea guida per i vostri sviluppi in
[Rails](http://rubyonrails.org), [Sinatra](http://www.sinatrarb.com) o
[Padrino](http://www.padrinorb.com) potete [richiedermene una custom tutta per
voi](mailto:paolo@codiceinsicuro.it) o potete aspettare la pubblicazione
della [Owasp Ruby on Rails and friends security
guide](https://www.owasp.org/index.php/Projects/OWASP_Ruby_on_Rails_and_friends_Security_Guide)

Enjoy it!
