---
layout: post
author: thesp0nge
title: "Shellshock, automatizziamo il test"
modified:
category: [Spinaci]
tags: [shellshock, automatizzare, application security, expect, bash, exploit, cve-2014-6271, cve-2014-6277, cve-2014-7169, cve-2014-7186 , cve-2014-7187]
image:
  feature: shell2.png
comments: true
share: true
---

Qualche giorno fa abbiamo parlato di [shellshock, dei danni che può fare e di
come può
propagarsi](https://codiceinsicuro.it/blog/shellshock-capitolo-1-la-prova-pratica-che-le-code-review-servono/).

Vi ho rimandato, in un update del post,
all'[articolo](http://lcamtuf.blogspot.it/2014/09/quick-notes-about-bash-bug-its-impact.html)
originale che spiega due CVE, il
[CVE-2014-7186](http://web.nvd.nist.gov/view/vuln/detail?vulnId=CVE-2014-7186)
e il
[CVE-2014-7187](http://web.nvd.nist.gov/view/vuln/detail?vulnId=CVE-2014-7187),
che nel mio post avevo colpevolmente omesso.

Oggi parliamo invece di come testare la vulnerabilità quando abbiamo in
gestione un gran numero di server unix.

## Un passo oltre il vulnerability management

Potreste avere già in campo un processo di vulnerability management, quindi
potreste avere un software di vulnerability assessment che periodicamente
scansiona le vostre macchine per issue di security.

A seconda della schedulazione voi avrete quindi l'elenco delle macchine
vulnerabili a shellshock con tutti i CVE che ne seguono.

Questo implica anche che il vostro tool abbia già tutte le firme per i
possibili exploit legati a shellshock.

Il vostro capo però vuole una situazione aggiornata **ora** e non c'è tempo di
aspettare che partano tutte le scansioni schedulate. Dobbiamo quindi
arrangiarci.

### Lista della spesa

Per automatizzare con successo il processo di verifica ci serve:

* elenco completo dei server unix da testare
* script che provi tutti i possibili exploit sulla bash
* script per automatizzarne l'esecuzione

Sembra paradossale, ma forse l'elenco completo dei server unix da testare è la
cosa più complessa da recuperare. Ci sono realtà dove agenti di software di
asset inventory, provano a popolare per noi questo elenco. Ci sono realtà dove
tutto è dentro un enorme foglio di calcolo. Ci sono realtà dove non c'è nulla e
si lavora per subnet.

Qui dipende molto dalla vostra realtà. In dubbio, chiedete ai sysadmin.
L'importante è che abbiate un elenco di indirizzi IP di macchine Unix, perché
il nostro script non si metterà a fare un nmap per discovery e per riconoscere
il sistema operativo.

### Lo script per fare il check locale

Lo script per testare, localmente, tutte le varianti di shellshock lo potete
trovare [qui su github.com](https://github.com/hannob/bashcheck). Non fa altro
che provare a mettere i diversi pattern d'attacco in una variabile d'ambiente e
vedere come reagisce la shell.

Anche in questo caso però ho bisogno di fare qualche modifica. Lo script di
[hannob](https://github.com/hannob/) è bello, usa i colori, da messaggi
completi, ma trovo l'output sia poco usabile in caso debba collezionare i dati
di 1000 server.

Ho bisogno quindi di modificare lo script per ottenere in output un YES o NO
divisi da virgole a seconda che l'exploit sia andato a buon fine o meno. Alla
fine sto costruendo un enorme file CSV che potrò importare in un foglio di
calcolo per fare un po' di _intelligence_ sui dati.

{% highlight sh %}
#!/bin/bash

[ -n "$1" ] && bash=$(which $1) || bash=$(which bash)
echo -n "$bash,"
echo -n "$($bash --version | head -n 1 | cut -f2 -d ","),"

#r=`a="() { echo x;}" $bash -c a 2>/dev/null`
if [ -n "$(env 'a'="() { echo x;}" $bash -c a 2>/dev/null)" ]; then
	echo -n "maybe vulnerable to unknown parser bugs,"
elif [ -n "$(env 'BASH_FUNC_a%%'="() { echo x;}" $bash -c a 2>/dev/null)" ]; then
	echo -n "bugs not exploitable,"
elif [ -n "$(env 'BASH_FUNC_a()'="() { echo x;}" $bash -c a 2>/dev/null)" ]; then
	echo -n "bugs not exploitable,"
elif [ -n "$(env 'BASH_FUNC_<a>%%'="() { echo x;}" $bash -c a 2>/dev/null)" ]; then
	echo -n "bugs not exploitable,"
else
	echo -n "bugs not exploitable,"
fi


r=`env x="() { :; }; echo x" $bash -c "" 2>/dev/null`
if [ -n "$r" ]; then
	echo -n "YES,"
else
	echo -n "NO,"
fi

cd /tmp;rm echo 2>/dev/null
env x='() { function a a>\' $bash -c echo 2>/dev/null > /dev/null
if [ -e echo ]; then
	echo -n "YES,"
else
	echo -n "NO,"
fi

$($bash -c "true $(printf '<<EOF %.0s' {1..80})" 2>/tmp/bashcheck.tmp)
ret=$?
grep AddressSanitizer /tmp/bashcheck.tmp
if [ $? == 0 ] || [ $ret == 139 ]; then
	echo -n "YES,"
else
	echo -n "NO,"
fi


$bash -c "`for i in {1..200}; do echo -n "for x$i in; do :;"; done; for i in {1..200}; do echo -n "done;";done`" 2>/dev/null
if [ $? != 0 ]; then
	echo -n "YES,"
else
	echo -n "NOT RELIABLE,"
fi

$($bash -c "f(){ x(){ _;};x(){ _;}<<a;}" 2>/dev/null)
if [ $? != 0 ]; then
	echo -n "YES,"
else
	echo -n "NO,"
fi

if [ -n "$(env x='() { _;}>_[$($())] { echo x;}' $bash -c : 2>/dev/null)" ]; then
	echo -n "YES,"
elif [ -n "$(env BASH_FUNC_x%%='() { _;}>_[$($())] { echo x;}' $bash -c : 2>/dev/null)" ]; then
	echo -n "YES,"
elif [ -n "$(env 'BASH_FUNC_x()'='() { _;}>_[$($())] { echo x;}' $bash -c : 2>/dev/null)" ]; then
	echo -n "YES,"
else
	echo -n "NO,"
fi
{% endhighlight %}

Provando questo script sul mio macbook, ottengo il seguente output:

{%highlight sh%}
/bin/bash, version 3.2.51(1)-release (x86_64-apple-darwin13),maybe vulnerable to unknown parser bugs,YES,YES,YES,NOT RELIABLE,YES,NO,
{%endhighlight%}

Colleziono quindi la shell che ho testato, la versione e poi l'output degli
exploit. Lascio la virgola dopo l'ultimo risultato perché lo script che poi
eseguirà i tentativi, appenderà l'hostname e se è riuscito ad collegarsi sulla
macchina.

### Lo script per automatizzare il tutto

Per eseguire questo script, vi servirà un utente locale sulle varie macchine
che andrete a testare. Probabilmente ne avrete già uno, sostituite quindi la
login corretta al valore 'guest'.

Una volta lanciato lo script vi chiederà la password da utilizzare per le
connessioni ssh, proverà a copiare lo script _attaccante_ sulla macchina, lo
eseguirà redirigendone l'output su un file, recupererà il file dalla macchina
target e poi farà pulizia.

{% highlight sh %}
#!/bin/sh
APPNAME=`basename $0`
USER='guest'
EXPECT=`which expect`
BASHCKECK="$PWD/rawbashcheck"


###############################################################################
# shellshock finder script
# v1.0 - paolo@codiceinsicuro.it
###############################################################################

function help() {
  echo "$APPNAME - v1.0 - paolo@codiceinsicuro.it"
  echo "$APPNAME is a script to automate #shellshock check within a given list of hosts"
  echo "\nusage: $APPNAME hostlist.txt"
  echo "e.g. $APPNAME my_hostlist.txt"
}

function upload() {
  $EXPECT << EOD
  spawn scp -P $2 $BASHCKECK $USER@$1:~

  expect {
      -re ".*yes.*no.*" {
          exp_send "yes\r"
          exp_continue
      }
      -re ".*assword.*" {
          exp_send "$password\r"
          exp_continue
      }
      "Permission denied" {
        exit 5
      }
      "lost connection" {
        exit 5
      }
  }

EOD
}

function exploit() {
  $EXPECT << EOD
  spawn ssh -p $2 $USER@$1 ~/rawbashcheck > result.txt

  expect {
      -re ".*yes.*no.*" {
          exp_send "yes\r"
          exp_continue
      }
      -re ".*assword.*" {
          exp_send "$password\r"
          exp_continue
      }
  }

EOD
}

function download() {
  $EXPECT << EOD
  spawn scp -P $2 $USER@$1:~/result.txt .

  expect {
      -re ".*yes.*no.*" {
          exp_send "yes\r"
          exp_continue
      }
      -re ".*assword.*" {
          exp_send "$password\r"
          exp_continue
      }
  }

EOD
}

function clean_up() {
  $EXPECT << EOD
  spawn ssh -p $2 $USER@$1 rm ~/rawbashcheck ~/result.txt

  expect {
      -re ".*yes.*no.*" {
          exp_send "yes\r"
          exp_continue
      }
      -re ".*password.*" {
          exp_send "$password\r"
          exp_continue
      }
  }

EOD
}

###############################################################################
# So the story begins
###############################################################################

if ! [ -x $EXPECT ]; then
  echo "expect command not found"
  exit
fi

if ! [ -e $BASHCKECK ]; then 
  echo "$BASHCKECK not found"
  exit
fi

if [ $# -ne 1 ]; then
  help
  # exit
fi

echo "Please enter $USER password: "
read -s password


echo "BASH PATH, BASH VERSION, PARSER STATUS, CVE-2014-6271, CVE-2014-7169, CVE-2014-7186, CVE-2014-7187, CVE-2014-6277, CVE-2014-6278, HOST, REMOTE ACCESS" > out.txt

ips = `readarray -t array < $1`
for i in ${ips[@]}
do
  echo $i
done

exit

for i in ${ips[@]}
do
  echo "exploiting shellshock on $i"
  upload $i 10100
  if [ $? -ne 5 ]; then
    exploit $i 10100
    sleep 0.3
    download $i 10100
    sleep 0.3
    cat result.txt >> out.txt
    echo "$i, YES" >> out.txt
    clean_up $i 10100
    sleep 0.3
  else
    echo "- , - , - , - , - , - , - , - , -, $i, NO" >> out.txt
    sleep 0.6

  fi
done
{% endhighlight %}

L'output sarà quindi un file CSV contenente l'esito dei test sulla macchina.
Ecco l'output dello script eseguito sul mio portatile.

{%highlight sh%}
BASH PATH, BASH VERSION, PARSER STATUS, CVE-2014-6271, CVE-2014-7169, CVE-2014-7186, CVE-2014-7187, CVE-2014-6277, CVE-2014-6278, HOST, REMOTE ACCESS
/bin/bash, version 3.2.51(1)-release (x86_64-apple-darwin13),maybe vulnerable to unknown parser bugs,YES,YES,YES,NOT RELIABLE,YES,NO, localhost, YES
{%endhighlight%}

## Off by one

Se avete un migliaio di indirizzi IP da scansionare, eseguire questo script vi
consentirà, non solo di verificare lo stato della macchina per la vulnerabilità
di cui tutti parlano in questi giorni, ma anche di verificare che voi abbiate
una login remota da utilizzare... ovviamente per security stuff.

Enjoy!
