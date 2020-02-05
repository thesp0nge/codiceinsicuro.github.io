---
layout: post
title: "Getting root: symfonos: 5"
author: thesp0nge
featured: true
category: [getting-root]
tags: [offensive, boot2root, vulnhub, oscp, osce]
image:
  feature: zeus.jpg
comments: true
share: true
---

Riprendono gli studi per OSCE e riparte anche la serie
[getting-root](https://codiceinsicuro.it/categories#getting-root) con
[symfonos: 5](https://www.vulnhub.com/entry/symfonos-5,415/), una macchina
pubblicata il mese scorso sul portale VulnHub.

Dopo aver scaricato la macchina da VulnHub, è stata importata all'intero di
Virtualbox in esecuzione sulla mia macchina, dove era già pronta e configurata
una macchina virtuale Kali Linux che uso abitualmente per lavoro. Entrambe le
macchine sono state configurate per essere su una rete interna all'host dove
sono in esecuzione, nel mio caso sulla rete 192.168.56.0.

## Information gathering

Come prima cosa, facciamo una scansione abilitando i plugin di default sulle
porte principali.

{% highlight sh %}
nmap -A -T4 192.168.56.120 -oA first
{% endhighlight %}

Salvo sempre le scansioni e l'output dei tool, per due ragioni principali:

* ho sempre a disposizione le informazioni senza dover sprecare tempo nel dover
  rilanciare dei comandi
* in caso di assessment reale, salvando anche i timestamp ho una cronistoria di
  quello che ho lanciato. In caso di down di un servizio o di una macchina, è
	quindi possibile risalire a cosa stavo facendo. Succede raramente ma
	meglio essere previdenti.

![Nmap]({{site.url}}/assets/images/getting-root/symfonos5/nmap.png)

Un demone ssh ed un sito web con la particolarità di server LDAP (ed LDAPS) in
ascolto.

Il sito web è strano, una gigantografia di Zeus, niente nei commenti della
pagina, niente negli header HTTP.

![Website]({{site.url}}/assets/images/getting-root/symfonos5/website.png)

Enumeriamo ulteriormente alla ricerca di URL comuni:
{% highlight sh %}
dirb http://192.168.56.120/ -o dirb
{% endhighlight %}

![Dirb]({{site.url}}/assets/images/getting-root/symfonos5/dirb.png)

Con dirb scopriamo anche un interessante pagina di amministrazione che provo ad
sollecitare un po' ma sembra non essere vulnerabile a SQL injection o Cross
site scripting. 

![admin.php]({{site.url}}/assets/images/getting-root/symfonos5/admin.php.png)

Sembriamo essere di fronte ad un punto morto. Non ci sono credenziali di
default, non si può bypassare la pagina e non sembrano esserci altre pagine
collegate. Penso quindi ad un altro modo per enumerare risorse web: il fuzzing.
In questo modo posso trovare, se esistono, pagine web che non sono referenziate
dalla prima, a patto di avere un buon dizionario.

Usando wfuzz, scopriamo che esistono altre pagine sul sito, in particolare una
pagina di logout e una home.php

{%highlight sh%}
wfuzz --hc 404 -w /usr/share/wordlists/wfuzz/general/common.txt http://192.168.56.120/FUZZ.php
{%endhighlight%}

![wfuzz]({{site.url}}/assets/images/getting-root/symfonos5/wfuzz.png)

Chiamando la pagina home.php, nella risposta vedo che un link è costruito
passando una URL alla pagina stessa.

![home.php]({{site.url}}/assets/images/getting-root/symfonos5/home.php.png)

Volevo provare a vedere se la pagina fosse vulnerabile ad una [local file
inclusion](https://en.wikipedia.org/wiki/File_inclusion_vulnerability#Local_file_inclusion)
e dal contenuto del file /etc/passwd nella response HTTP, direi che ci siamo.

![LFI]({{site.url}}/assets/images/getting-root/symfonos5/lfi.png)

## Accesso non privilegiato

A questo punto, provo a catturare qualche file a caso, tra cui admin.php e
faccio una scoperta interessante. All'interno trovo le credenziali con cui
l'applicazione fa la bind a LDAP.

![Credenziali di LDAP in admin.php]({{site.url}}/assets/images/getting-root/symfonos5/ldap_creds.png)

Con queste credenziali, provo a collegarmi ad LDAP e sbirciare un po' al suo
interno. Qui trovo i dettagli dell'utente 'zeus' del quale avevo visto
l'esistenza nel file passwd, tra cui la password.

![Credenziali di Zeus]({{site.url}}/assets/images/getting-root/symfonos5/ldap_zeus.png)

In questo modo, ho accesso alla macchina come utente non privilegiato e posso
iniziare ad enumerare quello che c'è sulla macchina per fare una privilege
escalation e diventare root.

![Shell di Zeus]({{site.url}}/assets/images/getting-root/symfonos5/zeus.png)

## Privilege escalation

Dopo aver visto versione del kernel, pacchetti installati e fatta un'idea delle
possibili strade da seguire, mi viene in mente di controllare se l'utente zeus
può lanciare comandi con sudo.

Lanciando il comando sudo -l, possiamo vedere che l'utente zeus può lanciare
dpkg come utente privilegiato.

![Sudo di Zeus]({{site.url}}/assets/images/getting-root/symfonos5/zeus_sudo.png)

La prima cosa che ho fatto, a questo punto, è stata andare nella man page di
dpkg e vedere se era possibile invocare in qualche modo una shell.

![man dpkg]({{site.url}}/assets/images/getting-root/symfonos5/dpkg_man.png)

Il comando dpkg ha un'opzione, --pre-invoke, che permette di specificare un
comando da eseguire prima di eseguire il task per il quale è stato invocato...
bingo.

{%highlight sh%}
sudo dpkg --pre-invoke /bin/bash --configure bash
{%endhighlight%}

Invocando questo comando, sono stato in grado di elevare i miei privilegi sul
sistema e diventare root.

![root]({{site.url}}/assets/images/getting-root/symfonos5/root.png)

## Off by one

La macchina è semplice e non è come quelle che mi troverò di fronte al secondo
tentativo per l'OSCE. Tuttavia è stato divertente come esercizio.

Occorre fare attenzione quando si concede l'utilizzo del comando sudo ad utenti
sul sistema, affinché non si aprano degli scenari per i quali gli stessi
possono eseguire comandri arbitrari sul sistema.
Lato difesa quindi, attenzione sempre a cosa concediamo sulle nostre macchine.

Lato attacco... controllate sempre cosa può fare con sudo il vostro utente non
privilegiato :)


Enjoy it!
