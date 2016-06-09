---
layout: tip
title: "Nmap e MySQL: dalla porta al dato"
tags: [nmap, mysql, audit, cve-2012-2122, redteam]
level: intermediate
comments: true
share: true
order: 2
---

Questo rimedio nase dal post [Come fare un database audit con
nmap]({{site.url}}/blog/come-fare-un-database-audit-con-nmap/). Nel post viene
spiegato tutto il razionale dei vari comandi. Qui, avrete solo i passi, punto
per punto, con un oneliner.

Ricordiamo solo lo scopo. Da un database MySQL vogliamo accedere al dato
contenuto nel DB.

Negli esempi, _ip_ è l'indirizzo target.

## Trovare MySQL

{% highlight sh %}
~ $ nmap -sV ip -p 3306

Starting Nmap 7.12 ( https://nmap.org ) at 2016-04-18 23:14 CEST
Nmap scan report for localhost (127.0.0.1)
Host is up (0.00023s latency).
Other addresses for localhost (not scanned): ::1 fe80::1
PORT     STATE SERVICE VERSION
3306/tcp open  mysql   MySQL 5.7.11

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 0.90 seconds
{% endhighlight %}

## Catturo informazioni maggiori sul DBMS in esecuzione

{% highlight sh %}
~ $ nmap -sV -sC ip -p 3306 --script=mysql-info

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

## Provo ad ottenere delle utenze valide

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

## Enumero i database contenuti

**ATTENZIONE**: questo funziona se avete un account. Se non trovate alcun
account valido con il passo precedente, l'enumerazione del database non darà
risultati. Nel oneliner wui sotto è stato omesso l'argomento mysqlpassword in
quanto vuota nel oneliner precedente. Se omesso, comunque lo script
mysql-database, cerca di ricavarla da mysql-brute.

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

## Uso la CVE-2012-2122

Il bollettino [CVE-2012-2122](http://seclists.org/oss-sec/2012/q2/493) è
relativo alla possibilità di bypassare il meccanismo di autenticazione di un db
MySQL a patto di conoscere uno username valido.

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

## Audit di compliant CIS

**ATTENZIONE**: mentre vi scrivo il file audit purtroppo è relativo al CIS di
MySQL 4.1, 5.0 e 5.1. Per versioni successive di MySQL non ci sono script di
audit disponibili al momento.

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

