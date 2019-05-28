---
layout: post
title: "Crea le tue API di telemetria con Ruby e Sinatra"
author: thesp0nge
featured: false
category: [post]
tags: [ruby, sinatra, mvc, activerecord, dawnscanner]
image:
  feature: telemetry.jpg
comments: true
share: true
---

Quando ho iniziato a riscrivere la versione 2.0 di
[dawnscanner](https://dawnscanner.org), ho pensato di introdurre un meccanismo
che mi consentisse di mandare dei dati telemetrici sull'utilizzo del tool.

L'idea non era tanto quella di avere il dettaglio di cosa stesse scansionando
l'utente, quanto di avere il dato di utilizzo dello strumento e versione dello
stesso.

Per questo genere di sviluppi, di solito mi affido a Ruby ed il framework
[grape](https://github.com/ruby-grape/grape) per la costruzione di API REST.
Visto che però si trattava di qualcosa di molto piccolo, mi sono affidato a
[Sinatra](https://github.com/sinatra/sinatra), un framework MVC per la
creazione di semplici applicazioni web.

L'applicazione web, fornirà un identificativo univoco ai client che ne faranno
richiesta; ogni istanza di dawnscanner quindi avrà un proprio ID che verrà
richiesto dal tool se lo stesso non ne troverà valore salvato all'interno della
propria configurazione in locale.

Lato server, implementare un endpoint che se interrogato in GET ti dia un ID
univoco è semplice, basta usare la libreria SecureRandom di sistema.

{%highlight ruby %}
get '/new' do
  i = Id.new
  i.uuid = Id.get_new_id
  i.save

  content_type :json
  {:uuid => i.uuid }.to_json
end
{%endhighlight%}

Id è una classe che estende
[ActiveRecord](https://api.rubyonrails.org/classes/ActiveRecord/Base.html), che
si interfaccia quindi con il database per rendere persistente l'identificativo
appena creato.

{%highlight ruby%}
require 'securerandom'

class Id < ActiveRecord::Base
  def self.get_new_id
    return SecureRandom.uuid
  end
end
{%endhighlight%}

Anche in questo caso, abbastanza semplice come classe.

L'inizializzazione del sistema di telemetria avviene nella classe
[Dawn::Cli](https://github.com/thesp0nge/dawnscanner/blob/master/lib/dawn/cli/dawn_cli.rb).
L'idea è quella di avere un'entry point dove i client fanno una POST passando
il proprio identificativo, l'indirizzo IP e la versione della knowledge base.

{% highlight ruby %}
def have_a_telemetry_id?
  debug_me ($telemetry_id != ""  and ! $telemetry_id.nil?)
  return ($telemetry_id != ""  and ! $telemetry_id.nil?)
  
end

def get_a_telemetry_id
  return "" if ($telemetry_url == "" or $telemetry_url.nil?)
  debug_me("T: " + $telemetry_url)

  url = URI.parse($telemetry_url+"/new")
  res = Net::HTTP.get_response(url)

  return "" unless res.code.to_i == 200
  return JSON.parse(res.body)["uuid"]
end


def telemetry
  unless have_a_telemetry_id?
    $telemetry_id = get_a_telemetry_id
    $config[:telemetry][:id] = $telemetry_id
    debug_me($config)
    debug_me("saving config to " + $config_name)
    File.open($config_name, 'w') { |f| f.write $config.to_yaml }
  end

  debug_me("Telemetry ID is: " + $telemetry_id)
  
  uri=URI.parse($telemetry_url+"/"+$telemetry_id)
  header = {'Content-Type': 'text/json'}
  tele = { "kb_version" => Dawn::KnowledgeBase::VERSION , 
           "ip" => Socket.ip_address_list.detect{|intf| intf.ipv4_private?}.ip_address, 
           "message"=> Dawn::KnowledgeBase
        }
  http = Net::HTTP.new(uri.host, uri.port)
  request = Net::HTTP::Post.new(uri.request_uri, header)
  request.body = tele.to_json

  response=http.request(request)
  debug_me(response.inspect)

  return true
  
end
{% endhighlight %}

L'url alla quale viene fatta la POST è uguale all'id del client, questo per
rendere difficile l'eventuale tampering dei dati da parte di qualche
buontempone.

{%highlight ruby%}
post '/:uuid' do
  request.body.rewind
  @request_payload = JSON.parse request.body.read

  i = Id.find_by("uuid", params['uuid'].to_s)
  unless i.nil? 
    l=Log.new
    l.uuid = params['uuid'].to_s
    l.ip=@request_payload['ip']
    l.kb_version=@request_payload['kb_version']
    l.message=@request_payload['message']
    l.save
  end
end
{%endhighlight%}

Ho scelto SQLite3 come database, visto che per piccole moli di dati è
decisamente la scelta più ovvia.

Il progetto è su [github.com](https://github.com/thesp0nge/telemetry) ed è
ovviamente open. Ho scelto questa strada per fugare qualsiasi dubbio circa i
dati inviati da dawnscanner al mio sistema di telemetria, sistema che
ovviamente può essere disabilitato da file di configurazione.

