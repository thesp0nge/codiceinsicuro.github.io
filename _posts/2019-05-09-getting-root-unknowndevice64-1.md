---
layout: post
title: "Getting root: unknowndevice64: 1"
author: thesp0nge
featured: false
category: [getting-root]
tags: [offensive, boot2root, vulnhub]
image:
  feature: root.png
comments: true
share: true
---

[nknowndevice64](https://www.vulnhub.com/entry/unknowndevice64-1,293/) è una
macchina boot2root che su VulnHub viene descritta come di media difficoltà,
forse per la parte che riguarda l'analisi steganografica di un'immagine.

La parte di privilege escalation è abbastanza semplice e sfrutta una
misconfiguration del sistema.

## Information gathering

Una volta scaricata l'immagine della macchina virtuale dal sito e importata in
VirtualBox, ci appare una schermata di login testuale di una macchina Linux.

![Prima schermata della macchina virtuale]({{site.url}}/assets/images/getting-root/ud64/first_boot.png)

Visto che non conosco l'indirizzo IP del mio obbiettivo, uso il tool
netdiscover per fare una scansione e vedere chi è vivo nella subnet della mia
macchina Kali.

Il comando ```netdiscover -i eth0 -r 192.168.56.0/24``` mi restituisce alcuni
indirizzi IP sulla mia rete 192.168.56.x tra cui un 192.168.56.110 che è quello
della mia nuova vittima designata.

{%highlight sh%}

 Currently scanning: Finished!   |   Screen View: Unique Hosts                                                                                                  
                                                                                                                                                                
 5 Captured ARP Req/Rep packets, from 4 hosts.   Total size: 300                                                                                                
 _____________________________________________________________________________
   IP            At MAC Address     Count     Len  MAC Vendor / Hostname      
 -----------------------------------------------------------------------------
 192.168.56.100  08:00:27:f4:0c:04      1      60  PCS Systemtechnik GmbH                                                                                       
 192.168.56.102  08:00:27:52:4b:cf      1      60  PCS Systemtechnik GmbH                                                                                       
 192.168.56.109  00:0c:29:59:02:fa      2     120  VMware, Inc.                                                                                                 
 192.168.56.110  08:00:27:a4:d5:b4      1      60  PCS Systemtechnik GmbH    
{%endhighlight%}

Andando a vedere quali servizi sono esposti, possiamo osservare che sono aperte
due porte non standard per SSH e per il sito Web.

{%highlight sh%}
[root:~]# nmap -p- 192.168.56.110 -sV
Starting Nmap 7.70 ( https://nmap.org ) at 2019-05-09 14:20 CEST
mass_dns: warning: Unable to determine any DNS servers. Reverse DNS is disabled. Try using --system-dns or specify valid servers with --dns-servers
Nmap scan report for 192.168.56.110
Host is up (0.000051s latency).
Not shown: 65533 closed ports
PORT      STATE SERVICE VERSION
1337/tcp  open  ssh     OpenSSH 7.7 (protocol 2.0)
31337/tcp open  http    SimpleHTTPServer 0.6 (Python 2.7.14)
MAC Address: 08:00:27:A4:D5:B4 (Oracle VirtualBox virtual NIC)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 7.48 seconds
{%endhighlight%}

Il sito web appare scarno con un messaggio subliminale nascosto come spesso
accade tra i commenti.

![Codice sorgente della pagina]({{site.url}}/assets/images/getting-root/ud64/source.png)

Il commento rivela l'esistenza di un'immagine il cui contenuto evoca che sia
nascosto qualche forma di segreto attraverso la steganografia.

![key is h1dd3n]({{site.url}}/assets/images/getting-root/ud64/key_is_h1dd3n.png)

Usando il tool steghide e usando h1dd3n come chiave, come suggeritoci dal nome
dell'immagine, siamo in grado di estrarre un file di testo.

![Steghide]({{site.url}}/assets/images/getting-root/ud64/steghide.png)

Il file contiene del codice scritto in
[Brainfuck](https://it.wikipedia.org/wiki/Brainfuck), linguaggio nato per
essere implementato con un compilatore il più piccolo possibile.

Utilizzando un [decoder online](https://www.dcode.fr/brainfuck-language),
otteniamo quella che sembra una credenziale.

{%highlight sh%}
ud64:1M!#64@ud
{%endhighlight%}

Collegandoci in SSH come utente ud64, ci troviamo però di fronte a quella che
sembra essere una [restricted
shell](https://www.gnu.org/software/bash/manual/html_node/The-Restricted-Shell.html).

![rbash]({{site.url}}/assets/images/getting-root/ud64/rbash.png)

Fortunatamente esistono vari modi per sfuggire a questa gabbia e di solito
vengono sfruttate le funzionalità offerte da strumenti come vi o man, di
lanciare comandi shell.

Quello che ho fatto è stato:
* lanciare un vi e far aprire una shell
* esportare un PATH in maniera tale da poter richiamare i comandi in maniera
  più agevole
* provare a lanciare un sudo -l per vedere se c'erano programmi che potevo
  eseguire come root senza password. Fortunatamente un clone di strace era
  disponibile.
* root dance.

Il tutto documentato da questo filmato:

{%asciicast 245181%}
