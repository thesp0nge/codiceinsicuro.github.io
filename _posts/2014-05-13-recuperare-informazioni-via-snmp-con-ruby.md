---
layout: post
title: "Recuperare informazioni via SNMP (con ruby)"
modified:
category: [attackers]
tags: [h4f, snmp, ruby, information gathering, nmap, port scan]
image:
  feature: trash-cable.jpg
  credit: George P. Macklin
  creditlink: https://flic.kr/p/amvx5E
comments: true
share: true
---

Se come sysadmin ti stai domandando chi mai potrà essere interessato a
recuperare informazioni su un host per un attacco successivo, allora ti manca
una profonda dose di awareness. Secondo Gartner, ma il dato che ricordo è
vecchiotto di un 6 - 7 anni, più dell'80% delle intrusioni informatiche avviene
dall'interno dell'infrastruttura aziendale.

Veicoli d'attacco classici sono virus, malware, chiavette USB che arrivano da
amici di amici di amici e dai sempre classici utenti in VPN o impiegati
scontenti o semplicemente burloni. Si ci sono anche le persone diversamente
oneste nella vita (e questa _purtroppo_ non è fantasy-banfa-security).

Oggi vediamo come si possa usare [ruby](http://www.ruby-lang.org/en) ed il
[protocollo
SNMP](http://en.wikipedia.org/wiki/Simple_Network_Management_Protocol) per
avere qualche informazione in più rispetto ad un portscan.

## Attenzione, leggimi bene un paio di volte

Lo scopo di [codiceinsicuro.it](https://codiceinsicuro.it) è nella mia testa
molto chiaro. Parlare di application security, in italiano, con esempi concreti
e codice alla mano. Ci sono delle situazioni _boarder line_ dove per parlare di
un particolare aspetto si può dare allo script kiddie l'idea che adesso può
bucare l'universo intero dalla sua console di IRB che usa perché lo fa sentire
31337.

Potrei anche buttare lì errori nel codice d'esempio a caso in modo che il
nostro Neo in erba non possa vivere di solo copia e incolla.

**No**. Il codice che verrà presentato e funzionante e, precisazione che farò
ora e non ripeterò più, se volete giocare all'accher 31337 che ascolta musica
electro da uno stereo in una stanzetta buia bhé buon per voi, il mondo è bello
perché è vario ma non sentitevi incentivati a farlo leggendo quello che scrivo
io. Perché la mia opinione su di voi è pari a quella che ho per #sha7.

## SNMP

Il protocollo SNMP (Simple Network Management Protocol) è un protocollo
applicativo, layer 7 della pila ISO/OSI, la cui funzione è quella di offrire
servizi di diagnostica per amministratori di rete e sistemisti. I device
vengono attestati in rete con una _community string_ che permette di inviare
query per conoscere le proprietà e lo stato in cui versa un host, uno switch,
un router, una stampante di rete o qualsiasi cosa pubblichi il demone SNMP in
ascolto sulla porta UDP 161.

Protocollo UDP, quindi non aspettatevi sessioni, non aspettatevi ritrasmissione
o error recovery. Se c'è una congestione in rete e i vostri pacchetti andranno
persi... bhé sono andati persi.

E' possibile usare TCP per il protocollo SNMP ma a mia memoria, ho visto solo
installazioni su UDP. Prendete questa come una statistica personale.

Il modello di sicurezza, all'interno di una comunicazione così inaffidabile,
non può essere molto evoluto. In particolare un gioco fondamentale lo ricopre
la stringa della community con la quale si configura il demone SNMP, una sorta
di password con la quale "autenticarsi" per poter interrogare un dispositivo.

> SNMP versione 3 supporta anche l'encryption e meccanismi più complessi come
> username e password per profilare chi sta facendo cosa. In questo caso ci si
> affida al protocollo DTLS che assicura l'encription di dati su comunicazione
> non affidabile.
> Anche in questo caso, io ho visto la maggior parte dei sistemi usare per
> retrocompatibilità e mille altri constraint, ignoranza inclusa, SNMP versione
> 2.

Esistono due _community_ (che ricordiamoci valgono un po' come le password,
perché senza la community giusta non potremo interrogare quel device) standard:

* public
* private

Spesso l'incauto sysadmin lascia la community invariata e qui entriamo in scena
noi.

## Tutto parte dal portscan, e vi possono avere già scoperti

Allora, attenzione perché se nella rete dove vi trovate c'è un IDS[^1]
probabilmente se lanciate un portscan, se le regole sono scritte bene, se fanno
scattare un alert e se c'è qualcuno che guarda l'alert, allora potreste essere
scoperti. Ci sono tanti se, concordo, tuttavia spesso molti di questi fattori
vengono a mancare, quindi diciamo che potreste essere anche fortunati.

Anche se la fortuna aiuta gli audaci, lanciare nmap in modalità _aggressive_ è
un po' come sparare con un bazooka contro una zanzara. Siamo interessati alla
sola porta UDP 161, quindi possiamo fare una richiesta più mirata.
**Attenzione** per lanciare questa scansione dovete essere root sulla macchina.

{% highlight text %}
$ sudo nmap -sU -p161 127.0.0.0/24
{% endhighlight %}

Avrete una serie di host per le quali la porta sarà open, questi file sono
quello che state cercando.

## Minatori, al lavoro

Entra in scena ruby ora, in particolare la gemma
[snmp](https://github.com/hallidave/ruby-snmp). Installarla è triviale, basta
un semplice:

{% highlight text %}
$ gem install snmp
{% endhighlight %}

Questa gemma non ha dipendenze strane in quanto è una pura implementazione in
ruby del protocollo SNMP.

Proviamo una semplice query, che restituisca la descrizione, il contatto
dell'amministratore, il nome macchina e la location del datacenter dove la
macchina è attestata:

{% highlight ruby %}
#!/usr/bin/ruby
require 'snmp'

include SNMP

lookup_values = ["sysDescr", "sysContact", "sysName", "sysLocation"]

Manager.open(:Host => 'localhost', :Community => 'public') do |manager|
  manager.walk(lookup_values) do |row|
    row.each { |vb| puts "\t#{vb.value}" }
  end
end
{% endhighlight %}

All'output ho sostituito il nome reale con 'localhost', nella mia rete l'ho
lanciato contro un po' di IP a caso ottenuti dalla scansione delle porte UDP
161 fino a quando ho trovato un host con la community 'public':

{% highlight text %}
$ ./snmp_walk.rb
  SunOS localhost 5.10 Generic_147441-02 i86pc
  "System administrator"
  localhost
  "System administrators office"
{% endhighlight %}

Ora, a parte il dettaglio sul dove si trova la macchina e la descrizione del
contatto, ho delle informazioni molto utili. So l'architettura, _i86pc_, so il
sistema operativo e la sua versione (Sun Solaris) e anche il patch level.

Per risalire alla sola versione (quindi non a tutto questo dettaglio), avrei
dovuto lasciare lavorare nmap in maniera molto più aggressiva e sperare che le
condizioni di scansione fossero quelle ottimali per ottenere una rilevazione
con un buon grado di confidenza. Spesso nmap (soprattutto nel mondo Microsoft)
si trova a darti alcune probabilità su quale sia la reale release.

Adesso proviamo a modificare il nostro script, snmp_walk.rb, in modo tale da
renderlo indipendente dall'output di nmap. Per fare questo useremo la gemma
[ipaddress](https://rubygem.org/gems/ipaddress)che ci permette di gestire in
maniera agevole indirizzi IP e indirizzi di rete in notazione CIDR.

Posso quindi passare la mia intera rete /24 allo script senza più passare da
nmap. Sarà lo script a cercare di usare la community SNMP public su un certo
indirizzo IP per ottenere informazioni.

Adesso provo a recuperare qualche informazione in più sullo stato delle schede
di rete. Perché questa informazione è utile? Perché un server può avere più
schede di rete di quanto non mi dica il DNS della rete interna, magari su VLAN
di management o magari su VLAN dedicate ad altri servizi. L'idea è che
particolari demoni siano in ascolto non su tutte le interfacce ma solamente su
un specifico IP e per un attaccante sono tutti punti di ingresso potenziali.

{%highlight ruby%}
#!/usr/bin/ruby
require 'snmp'
require 'ipaddress'

include SNMP

lookup_values = ["sysDescr", "sysContact", "sysName", "sysLocation", "ifIndex", "ifDescr", "ifInOctets", "ifOutOctets"]

# ARGV[0] is an IP address or a network in CIDR notation
raise "Missing IP address or network" if ARGV[0].nil?

@list = IPAddress.parse(ARGV[0])
@list.each do |ip|
  puts "Asking #{ip.to_s} for info using 'public' SNMP community"
  Manager.open(:Host => ip.to_s, :Community => 'public') do |manager|
    manager.walk(lookup_values) do |row|
      row.each { |vb| puts "\t#{vb.value}" }
    end
  end
end
{%endhighlight %}

Adesso vediamo di rendere le cose un po' più interessanti. SNMP non da nessun
dettaglio a livello di protocollo su quali debbano essere le informazioni messe
a disposizioni da un sistema.

Quando è stato disegnato l'SNMP, è stato creato in maniera tale che le
informazioni disponibili fossero definite da MIB (Management Information Bases)
preposti a descrivere la struttura dei dati di un sistema. Per modellare questa
struttura dati è stata creata una gerarchia di identificatori, [OID (Object
IDentifier)](http://en.wikipedia.org/wiki/Object_identifier) che si presentano
come una stringa composta da interi separati da un '.'.

Ogni OID rappresenta una variabile collegata ad un'informazione di sistema che
può essere letta o **scritta** a seconda delle permission legate alla
community.

In particolare modifichiamo il nostro script affinché chieda la descrizione
della macchina (OID = "1.3.6.1.2.1.1.1.0") e l'uptime (OID =
"1.3.6.1.2.1.1.3.0").

{% highlight ruby %}
#!/usr/bin/ruby
require 'snmp'
require 'ipaddress'

include SNMP

# ARGV[0] is an IP address or a network in CIDR notation
raise "Missing IP address or network" if ARGV[0].nil?

@list = IPAddress.parse(ARGV[0])
@list.each do |ip|
  puts "Asking #{ip.to_s} for info using 'public' SNMP community"
  Manager.open(:Host => ip.to_s, :Community => 'public') do |manager|
    response = manager.get([ObjectId.new("1.3.6.1.2.1.1.1.0"), ObjectId.new("1.3.6.1.2.1.1.3.0")])
    response.each_varbind do |vb|
      puts "#{vb.name.to_s}  #{vb.value.to_s}  #{vb.value.asn1_type}"
    end
  end
end
{% endhighlight %}

Eseguiamo lo script.

{% highlight text %}
$ ruby snmp_walk.rb localhost
Asking localhost for info using 'public' SNMP community
SNMPv2-MIB::sysDescr.0  SunOS localhost 5.10 Generic_147441-02 i86pc  OCTET STRING
SNMPv2-MIB::sysUpTime.0  4 days, 18:39:34.30  TimeTicks
{% endhighlight %}

La macchina è stata riavviata 4 giorni fa. L'indicazione lato attaccante che
abbiamo da questo dato è quello di un sistema comunque vivo, che può essere
stato appena aggiornato. Non è una macchina dimenticata nel datacenter. E'
anche vero che sarebbe meglio parlare di _indizio_ più che di informazione,
perché ci permette di fare solo supposizioni, non certo di trarre conclusioni.

Sapendo che l'host target è una Sun Solaris, possiamo andare a vedere qual è
l'OID relativo alla tabella dei processi per questo sistema operativo. Sì, la
gerarchia degli OID è molto puntuale.
La tabella dei processi è memorizzata nell'OID
[1.3.6.1.4.1.42.3.12.1](http://www.alvestrand.no/objectid/1.3.6.1.4.1.42.3.12.1.html).
Proviamo a chiedere ora la lista dei processi di quella macchina.


{%highlight ruby %}
#!/usr/bin/ruby
require 'snmp'
require 'ipaddress'

include SNMP

# ARGV[0] is an IP address or a network in CIDR notation
raise "Missing IP address or network" if ARGV[0].nil?

@list = IPAddress.parse(ARGV[0])
@list.each do |ip|
  puts "Asking #{ip.to_s} for info using 'public' SNMP community"
  Manager.open(:Host => ip.to_s, :Community => 'public') do |manager|
    response = manager.get([ObjectId.new("1.3.6.1.2.1.1.1.0"), ObjectId.new("1.3.6.1.2.1.1.3.0")])
    response.each_varbind do |vb|
      puts "#{vb.name.to_s}  #{vb.value.to_s}  #{vb.value.asn1_type}"
    end

    # Sun Process Table - http://www.alvestrand.no/objectid/1.3.6.1.4.1.42.3.12.1.html
    processTable = ObjectId.new("1.3.6.1.4.1.42.3.12.1")
    manager.walk(processTable) { |varbind|  puts "#{varbind.value.to_s}" if varbind.name.to_s.start_with?("SNMPv2-SMI::enterprises.42.3.12.1.10")}
  end
end
{%endhighlight %}

L'output del nostro script è più interessante ora:

{%highlight text %}
$ ruby snmp_walk.rb localhost
Asking localhost for info using 'public' SNMP community
SNMPv2-MIB::sysDescr.0  SunOS localhost 5.10 Generic_147441-02 i86pc  OCTET STRING
SNMPv2-MIB::sysUpTime.0  4 days, 19:38:27.64  TimeTicks
sched
init
pageout
fsflush
zpool-rpool
vmtasks
svc.startd
svc.configd
devfsadm
zpool-zpool1
syseventd
powerd
...
{%endhighlight %}

Da qui in avanti è solo un andare a vedere quale informazioni recuperare dalla
macchina target e quali OID sono associati.

Lo script è disponibile a questo [gist su github](https://gist.github.com/thesp0nge/e252d3159603d58c128a):
{% gist thesp0nge/e252d3159603d58c128a %}

## Off by one

Configurare un demone SNMP con una community public e farlo rispondere a
qualsiasi query è da sconsiderati. E' possibile risalire a informazioni
critiche come i processi in esecuzione, i demoni in ascolto, gli utenti
presenti sulla macchina (o almeno alcuni di essi).

Il suggerimento, lato sistemistico, è quello di usare la versione di SNMPv3 con
protocollo DTLS ed usare il modello role based per profilare chi può fare le
query e cosa può interrogare.

Enjoy it!

[^1]: Intrusion Detection System
