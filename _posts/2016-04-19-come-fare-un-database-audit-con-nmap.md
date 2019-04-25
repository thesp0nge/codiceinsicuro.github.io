---
layout: post
author: thesp0nge
title: "Come fare un database audit con nmap"
promotion: 
modified: 
featured: true
category: [Under attack]
tags: [nmap, database audit, mysql, cis]
image:
  feature: database.jpg
comments: true
share: true
---

Ne avevo già parlato lo scorso Luglio: [nmap è uno strumento eccezionale e può
essere utile anche in un Vulnerability
Assessment]({{site.url}}/blog/come-fare-un-vulnerability-assessment-con-nmap/).
Oggi ho scoperto che, nel caso di MySQL è un potente strumento per l'auditing
di un DB.

## Prologo

Oggi, stavo cercando qualche istanza di database
[NoSQL](https://it.wikipedia.org/wiki/NoSQL) in giro tra le mie reti del Luna
Park per provare un nuovo strumento di _database audit_. Ah, per l'inciso,
trovare uno strumento di database audit che lavora come dico io, è molto,
**molto** difficile.

Dicevo, ero lì che cercavo tra i risultati di
[Nexpose](https://www.rapid7.com/products/nexpose/), la macchina che più si
poteva prestare ad essere immolata alla sperimentazione, quando nelle finestre
di riepilogo degli asset, vedo elencati una serie di database.

La macchina, chiamiamola per semplicità _10.10.0.3_, aveva la porta MySQL
aperta e vedevo tutti i suoi database elencati. Visto che Nexpose lavora con
nmap e qualche colpo di rpm, almeno sulle distribuzioni _rpm powered_, mi sono
chiesto come diavolo avesse tirato fuori tutti quei risultati.

Dopo una ricerchina su [Google](https://google.com), è venuto fuori che ci sono
11 script per [nmap](https://nmap.org), tutti dedicati al simpatico database di
casa Oracle.

Oh bhé, tanto è da immolare, sfruttiamoli.

## Seek...

Dunque, i nomi dei percorsi sono diversi tra Sistemi Operativi diversi e
versioni di nmap diverse. Come regola, prendete la directory dello share,
cercate i dati di nmap e qui chercate i dati degli script scritti in
[lua](http://www.lua.org). Bingo, avete trovato quello che stavate cercando.

Torniamo a noi. Sul mio
[Mac]({{site.url}}/blog/usare-apple-e-veramente-contrario-alletica/), nmap è
installato usando [Homebrew](http://brew.sh).

Tutti i package, quindi, sono installati in _/usr/local/Cellar_. Ogni package
avrà una sottodirectory per ciascuna versione installata, in modo da creare una
specie di sandbox tra le diverse versioni.

{% highlight sh %}

$ ls /usr/local/Cellar/nmap/7.12/share/nmap/scripts/mysql-*
/usr/local/Cellar/nmap/7.12/share/nmap/scripts/mysql-audit.nse
/usr/local/Cellar/nmap/7.12/share/nmap/scripts/mysql-brute.nse
/usr/local/Cellar/nmap/7.12/share/nmap/scripts/mysql-databases.nse
/usr/local/Cellar/nmap/7.12/share/nmap/scripts/mysql-dump-hashes.nse
/usr/local/Cellar/nmap/7.12/share/nmap/scripts/mysql-empty-password.nse
/usr/local/Cellar/nmap/7.12/share/nmap/scripts/mysql-enum.nse
/usr/local/Cellar/nmap/7.12/share/nmap/scripts/mysql-info.nse
/usr/local/Cellar/nmap/7.12/share/nmap/scripts/mysql-query.nse
/usr/local/Cellar/nmap/7.12/share/nmap/scripts/mysql-users.nse
/usr/local/Cellar/nmap/7.12/share/nmap/scripts/mysql-variables.nse
/usr/local/Cellar/nmap/7.12/share/nmap/scripts/mysql-vuln-cve2012-2122.nse

{% endhighlight %}

Ora, visto che è a solo scopo dimostrativo, metteremo sull'altare dei sacrifici
il mysql che ho installato sul mio Mac per qualche giochino con WordPress e
[Redmine](http://www.redmine.org).

Per prima cosa, verifichiamo che la porta sia effettivamente aperta e, essendo nmap un portscanner, potrebbe essere proprio compito suo. Gli diciamo di fare anche il fingerprint del servizio in modo da recuperare, se riesce, il numero di versione.

{% highlight sh %}
~ $ nmap -sV localhost -p 3306

Starting Nmap 7.12 ( https://nmap.org ) at 2016-04-18 23:14 CEST
Nmap scan report for localhost (127.0.0.1)
Host is up (0.00023s latency).
Other addresses for localhost (not scanned): ::1 fe80::1
PORT     STATE SERVICE VERSION
3306/tcp open  mysql   MySQL 5.7.11

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 0.90 seconds
{% endhighlight %}

Aperta. Ora, chiediamo qualcosa di più ed usiamo lo script
[mysql-info](https://nmap.org/nsedoc/scripts/mysql-info.html).

{% highlight sh %}
~ $ nmap -sV -sC localhost -p 3306 --script=mysql-info

Starting Nmap 7.12 ( https://nmap.org ) at 2016-04-18 23:19 CEST
Nmap scan report for localhost (127.0.0.1)
Host is up (0.00032s latency).
Other addresses for localhost (not scanned): ::1 fe80::1
PORT     STATE SERVICE VERSION
3306/tcp open  mysql   MySQL 5.7.11
| mysql-info:
|   Protocol: 53
|   Version: .7.11
|   Thread ID: 1595
|   Capabilities flags: 65535
|   Some Capabilities: ConnectWithDatabase, IgnoreSigpipes, SupportsLoadDataLocal, LongPassword, SupportsTransactions, ODBCClient, Speaks41ProtocolOld, Support41Auth, SwitchToSSLAfterHandshake, Speaks41ProtocolNew, InteractiveClient, LongColumnFlag, FoundRows, IgnoreSpaceBeforeParenthesis, DontAllowDatabaseTableColumn, SupportsCompression
|   Status: Autocommit
|   Salt: [}\x19
|_NAy2zG93      fCq\x07SU/

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 1.07 seconds
{% endhighlight %}

Quanta abbondanza. Sembra ci sia un problema di output con il [salt del
database](http://stackoverflow.com/questions/4351702/what-is-salt-when-relating-to-mysql-sha1).
Questo salt, altro non è se non una stringa pseudocasuale, accodata alle
password cifrate per prevenire attacchi basati sulle rainbow tables.

No, non usano _bcrypt_. Male. Andiamo avanti.

Ora, passiamo a cercare di forzare il lucchetto. Abbiamo MySQL aperto, abbiamo
nmap, usiamo lo script
[mysql-brute](https://nmap.org/nsedoc/scripts/mysql-brute.html) che fa un
attacco di forza bruta su una serie di account well known.

{% highlight sh %}
~ $ nmap -sV -sC localhost -p 3306 --script=mysql-brute

Starting Nmap 7.12 ( https://nmap.org ) at 2016-04-18 23:24 CEST
Nmap scan report for localhost (127.0.0.1)
Host is up (0.00024s latency).
Other addresses for localhost (not scanned): ::1 fe80::1
PORT     STATE SERVICE VERSION
3306/tcp open  mysql   MySQL 5.7.11
| mysql-brute:
|   Accounts:
|     root:<empty> - Valid credentials
|     netadmin:<empty> - Valid credentials
|     guest:<empty> - Valid credentials
|     user:<empty> - Valid credentials
|     web:<empty> - Valid credentials
|     sysadmin:<empty> - Valid credentials
|     administrator:<empty> - Valid credentials
|     webadmin:<empty> - Valid credentials
|     admin:<empty> - Valid credentials
|     test:<empty> - Valid credentials
|_  Statistics: Performed 20 guesses in 1 seconds, average tps: 20

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 1.27 seconds
{% endhighlight %}

Nel mio caso, sulla mia macchina locale, l'utente root non ha password. Questo
non succede mai nella realtà vero?!?

Ok, ora io potrei anche usare il client di mysql e navigare, ma visto che ho
iniziato con nmap, continuerò con il mio fido coltellino svizzero. Coltellino
che ora mi servirà per enumerare tutti i database presenti su quella mia
macchina.

Per fare questo uso lo script
[mysql-databases](https://nmap.org/nsedoc/scripts/mysql-databases.html)

{% highlight sh %}
~ $ nmap -sV -sC localhost -p 3306 --script=mysql-databases --script-args=mysqluser=root

Starting Nmap 7.12 ( https://nmap.org ) at 2016-04-18 23:28 CEST
Nmap scan report for localhost (127.0.0.1)
Host is up (0.00023s latency).
Other addresses for localhost (not scanned): ::1 fe80::1
PORT     STATE SERVICE VERSION
3306/tcp open  mysql   MySQL 5.7.11
| mysql-databases:
|   information_schema
|   blog
|   ecommerce
|   mysql
|   performance_schema
|   portfolio
|   redmine
|_  test

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 0.96 seconds
{% endhighlight %}

Allo script occorre passare anche, come argomento, l'utente MySQL che si vuole
utilizzare. Noi abbiamo l'utente root, siamo particolarmente fortunati.
L'efficacia dello script ovviamente è dovuta ai privilegi dell'utente sul
sistema.

## ... and destroy

Nel 2012, uscì una brutta vulnerabilità riguardante MySQL e MariaDB. Il
[CVE-2012-2122](http://seclists.org/oss-sec/2012/q2/493) parla di un bypass
dell'autenticazione sul DBMS a causa di un errore di casting di una variabile.
Di fatto, sfruttando questo bug, era possibile collegarsi a qualsiasi MySQL,
usando una password casuale a patto di conoscere un utente reale del db. Di
fatto, l'utente _root_ esiste quasi sempre. Lo script
[mysql-vuln-cve2012-2122](https://nmap.org/nsedoc/scripts/mysql-vuln-cve2012-2122.html)
serve proprio a sfruttare questa vulnerabilità nei database MySQL.

Ahimé, la mia versione è moderna e non vulnerabile a questa problematica.

{% highlight sh %}
~ $ nmap -sV -sC localhost -p 3306 --script=mysql-vuln-cve2012-2122

Starting Nmap 7.12 ( https://nmap.org ) at 2016-04-18 23:36 CEST
Nmap scan report for localhost (127.0.0.1)
Host is up (0.00025s latency).
Other addresses for localhost (not scanned): ::1 fe80::1
PORT     STATE SERVICE VERSION
3306/tcp open  mysql   MySQL 5.7.11

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 2.28 seconds
{% endhighlight %}

## Questione di audit

Quanti di noi fanno girare di solito, audit sui database, sanno cos'è lo
standard [CIS](https://www.cisecurity.org). Lo standard CIS consiste in una
serie di checklist che, dato un sistema, mi indicano se la sua configurazione è
più o meno sicura.

Purtroppo nmap include uno file di checklist [CIS per MySQL
5.1](https://benchmarks.cisecurity.org/downloads/show-single/index.cfm?file=mysql.102),
mentre ci sono [checklist più recenti per altre versioni del
DBMS](https://benchmarks.cisecurity.org/community/editors/groups/single/?group=mysql).

Lo script da lanciare è
[mysql-audit](https://nmap.org/nsedoc/scripts/mysql-audit.html), che però ha
bisogno necessariamente di un file di audit contenente i controlli CIS che si
vuole implementare.

Come dicevamo, il file di compliance CIS che viene fornito con nmap, non solo è
vecchio e si applica solo a nmap 4.1, 5.0 e 5.1, ma è anche [sintatticamente
errato](https://github.com/nmap/nmap/pull/371). Ho creato una pull request
giusto mentre preparavo questo post, altrimenti non funzionava nulla.

Lanciando lo script, ahimé abbiamo dei risultati che non sono veritieri,
proprio perché questa versione di checklist non è applicabile alla versione di
MySQL che sto usando io.

{% highlight sh %}
~ $ nmap localhost -p 3306 --script=mysql-audit --script-args "mysql-audit.filename='/usr/local/Cellar/nmap/7.12/share/nmap/nselib/data/mysql-cis.audit',mysql-audit.username='root'"

Starting Nmap 7.12 ( https://nmap.org ) at 2016-04-18 23:41 CEST
Nmap scan report for localhost (127.0.0.1)
Host is up (0.00028s latency).
Other addresses for localhost (not scanned): ::1 fe80::1
PORT     STATE SERVICE
3306/tcp open  mysql
| mysql-audit:
|   CIS MySQL Benchmarks v1.0.2
|       3.1: ERROR: Failed to execute SQL statement
|       3.2: ERROR: Failed to execute SQL statement
|       3.2: ERROR: Failed to execute SQL statement
|       4.1: ERROR: Failed to execute SQL statement
|       4.4: Remove test database => PASS
|       4.5: Change admin account name => PASS
|       4.7: Verify Secure Password Hashes => PASS
|       4.9: Wildcards in user hostname => PASS
|       4.10: No blank passwords => PASS
|         The following users were found having blank/empty passwords
|           root
|
|       4.11: Anonymous account => PASS
|       5.1: Access to mysql database => REVIEW
|         Verify the following users that have access to the MySQL database
|           user  host
|       5.2: Do not grant FILE privileges to non Admin users => PASS
|       5.3: Do not grant PROCESS privileges to non Admin users => PASS
|       5.4: Do not grant SUPER privileges to non Admin users => PASS
|       5.5: Do not grant SHUTDOWN privileges to non Admin users => PASS
|       5.6: Do not grant CREATE USER privileges to non Admin users => PASS
|       5.7: Do not grant RELOAD privileges to non Admin users => PASS
|       5.8: Do not grant GRANT privileges to non Admin users => PASS
|       6.2: ERROR: Failed to execute SQL statement
|       6.3: ERROR: Failed to execute SQL statement
|       6.4: ERROR: Failed to execute SQL statement
|       6.5: ERROR: Failed to execute SQL statement
|       6.6: ERROR: Failed to execute SQL statement
|       6.7: ERROR: Failed to execute SQL statement
|       6.8: ERROR: Failed to execute SQL statement
|       6.9: Safe user create => FAIL
|       6.10: ERROR: Failed to execute SQL statement
|
|     Additional information
|       The audit was performed using the db-account: root
|_      The following admin accounts were excluded from the audit: root,debian-sys-maint

Nmap done: 1 IP address (1 host up) scanned in 0.45 seconds
{% endhighlight %}

L'idea comunque di avere una checklist applicata così semplicemente dal mio
portscanner, apre nella mia testa innumerevoli scenari.

Di sicuro, i file di checklist devono controllare se sono applicabili alla
versione di MySQL a seconda del banner. Poi, un possibile miglioramento è
quello di creare più file di audit, in modo da coprire le versioni mancanti di
MySQL ed eventualmente estendere anche ad altri DBMS.

## Off by one

Nmap è uno strumento straordinario e, da quando ha integrato il motore di
scripting basato su Lua, è diventato definitivamente uno strumento poliedrico.
Ormai chiamarlo port scanner è riduttivo, abbiamo visto come dal port scan, si
possa fare information gathering, fino all'exploiting e per finire anche report
di compliance.

Da questo post è nato anche un rimedio: [Nmap e MySQL: dalla porta al
dato]({{site.url}}/rimedi/nmap-e-mysql-dalla-porta-al-dato/).

Nmap e questa routine può mancare nella pipeline di [pipeline di
appsec]({{site.url}}/blog/di-pipeline-processi-ed-automazione/) di ciascuno di
noi. Io l'ho già integrato, e tu?

Enjoy it.
