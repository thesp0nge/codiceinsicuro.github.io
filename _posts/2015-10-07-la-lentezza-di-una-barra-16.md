---
layout: post
title: "La lentezza di una barra 16"
promotion: "Un esempio di script ruby per la network discovery sicuramente migliorabile. Vediamo come."
modified: 
featured: true
category: [Chiacchiere da bar]
tags: [ruby, host discovery, nexpose, reti, firewall]
image:
  feature: discovery.jpg
  credit: NASA's Marshall Space Flight Center
  creditlink: https://flic.kr/p/9p2g8C
comments: true
share: true
---

Sul lavoro ho l'esigenza di mappare grosse reti, per scoprire quello che c'è
dentro. I software di asset inventory sono un'opzione, richiedono però un agent
a bordo e, se per qualsiasi motivo, l'agent non c'è ho un problema di copertura
del mio inventario.

Voglio quindi affidarmi alla rete. Per questo cosa posso usare? Tutti in coro
`nmap`. Già e se volessi solo questo potrei accontentarmi di questo script
shell:

{% highlight sh %}
#!/usr/bin/env bash
#
# This is an host discovery script
#
#
# -PS = Port Syn (TCP Syn)
# -PE = Echo Request
# --privileged = assume the user has priviliges
# -PU = UDP Ping
# -n = no resolution (for speed)
# -v = increase verbosity
# -oX = xml output

NMAP=`which nmap`
ICMP_SCAN="-PE"
SYN_SCAN_PORTS="21-23,25,53,80,135,137,139,443,445,3389,8080,8181"
UDP_SCAN_PORTS="53"
DATE=`(date +%Y%m%d)`

sudo -v
while true; do sudo -n true; sleep 60; kill -0 "$$" || exit; done 2>/dev/null &

if ! [ -x $NMAP ]; then
  echo "nmap not installed. Giving up"
  exit -1
fi


if [ $EUID -ne 0 ]; then
  echo "sorry, you must be root"
  echo "sudo $0 $*"
  exit -2
fi

if [ -z $1 ]; then
  echo "Missing network to scan"
  exit -3
fi

echo "Discovering host on $1"
echo $NMAP --privileged -n $ICMP_SCAN -PS$SYN_SCAN_PORTS -PU$UDP_SCAN_PORTS -sT -O --osscan-guess --max-os-tries 1 -p T:$SYN_SCAN_PORTS --max-retries 2 --min-rtt-timeout 100ms --max-rtt-timeout 3000ms --initial-rtt-timeout 500ms --min-rate 400 --max-rate 450 --max-parallelism 10 -v $1 -oX scout_$DATE.xml
sudo $NMAP --privileged -n $ICMP_SCAN -PS$SYN_SCAN_PORTS -PU$UDP_SCAN_PORTS -sT -O --osscan-guess --max-os-tries 1 -p T:$SYN_SCAN_PORTS --max-retries 2 --min-rtt-timeout 100ms --max-rtt-timeout 3000ms --initial-rtt-timeout 500ms --min-rate 400 --max-rate 450 --max-parallelism 10 -v $1 -oX scout_$DATE.xml
{% endhighlight %}

Funziona. Niente da dire. Il problema è che io voglio produrre un DB SQL,
SQLite va benissimo, con anche l'informazione sulla presenza dell'host nel mio
sistema di vulnerability management,
[Nexpose](https://www.rapid7.com/products/nexpose) nella fattispecie.

## Soluzione A. Unisco più strumenti

Poche settimane fa, [ho scritto un
post]({{site.url}}/blog/cerchiamo-un-host-in-nexpose-con-ruby/) dove mostravo
come integrare la command line e Nexpose con poche righe di ruby. Nmap mi
fornisce un output anche in un comodo formato XML, quindi quello che dovrei
fare è: estendere il mio script che ho mostrato [qualche settimana
fa]({{site.url}}/blog/cerchiamo-un-host-in-nexpose-con-ruby/) in maniera tale
che consumi il file XML di nmap come input.

A questo punto dovrei solamente aggiungere un pezzo di codice che mi salva i
risultati su DB, ma per questo ho un ORM flessibile come
[datamapper](http://datamapper.org).

Perché non mi convince questa soluzione? Perché nmap ha bisogno di essere
eseguito come root per il tipo di parametri passati, e io vorrei evitarmelo.

## Soluzione B. Faccio un nuovo strumento

Provo quindi a passare alla soluzione _all in one_. Monto sullo scheletro dello
script che parla con Nexpose, un semplice codice che rileva se la porta è
aperta oppure no.

{% highlight ruby %}
class Host
  def self.has_port_open?(host, port, timeout, sleep_period)
    begin
      Timeout::timeout(timeout) do
        begin
          s = TCPSocket.new(host, port)
          s.close
          return true
        rescue Errno::ECONNREFUSED, Errno::EHOSTUNREACH
          sleep(sleep_period)
          retry
        end
      end
    rescue Timeout::Error
      return false
    end
  end
  def self.is_alive?(host="127.0.0.1", ports=[21, 22, 25, 80, 139, 443, 445, 3389, 8080])
    ports.each do |p|
      return true if Scout::Host.tcp_sonar(host, 1, p)
    end

    # If TCP sonar failed try a single UDP port
    return true if Scout::Host.udp_sonar(host, 1, 53)
    return false
  end

  private
  def self.udp_sonar(host="127.0.0.1", timeout=5, port=53)
    begin
      Timeout::timeout(timeout) do
        s = UDPSocket.new(host, port)
        s.close
      end
    rescue Errno::ECONNREFUSED
      return true
    rescue => e
      return false
    end
    return true
  end



  def self.tcp_sonar(host="127.0.0.1", timeout=5, port=7)
    begin
      Timeout::timeout(timeout) do
        s = TCPSocket.new(host, port)
        s.close
      end
    rescue Errno::ECONNREFUSED
      return true
    rescue => e
      return false
    end
    return true
  end
end
{% endhighlight %}

Uso poi una routine che monta i pezzi insieme e crea un file CSV. Veramente,
l'import poi su DB è davvero l'ultimo dei miei pensieri.

{% highlight ruby %}
def self.do_the_job(n)
  sn = Scout::Nexty.new

  unless sn.live?
    $logger.error "nexpose is not alive. Giving up"
    return false
  end
  n.each do |h|
    begin
      name = Resolv.getname(h.to_s)
    rescue Resolv::ResolvError, SocketError => e
      $logger.warn e.to_s if WARN_IF_REVERSE_LOOKUP_FAILS
      name = h.to_s
    end
    alive = Scout::Host.is_alive?(h.to_s)
    STDERR.printf("%s,%s,%s,%s\n", h,name,alive, sn.is_scanned?(h.to_s)) unless PRINT_ONLY_ALIVE
    STDERR.printf("%s,%s,%s,%s\n", h,name,alive, sn.is_scanned?(h.to_s)) if alive && PRINT_ONLY_ALIVE
  end
  sn.logout
end
{% endhighlight %}

Funziona, l'output è quello di cui ho bisogno. C'è un unico problema. E'
drammaticamente lento. Su una /16 non basta una settimana di lavoro per
scoprire tutti gli host.

_"Beata innocenza, non usare la 3-way handshake, manda solo syn"_, direte voi.
Già, ma non sempre gli apparati di rete digeriscono bene un sacco di
connessioni mezze aperte. Lo scopo è quello di essere il più silente possibile,
quindi meglio chiudere la connessione in maniera educata.

_"Sei un n00b, usa i thread"_. Ecco, sempre con moderata educazione verso gli
altri parties della rete, questa è la strada da seguire. In qualche modo devo
capire come scomporre il mio input, una CIDR notation, in pezzi da far
consumare ai figlioletti del processo padre... vedremo gli sviluppi.

## Off by one

Solo enjoy e ricordatevi che per fare application security, bisogna sporcarsi
le mani col codice.
