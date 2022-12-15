---
layout: post
author: thesp0nge
title: "Getting root: Brainpan 1"
promotion: Brainpan 1 è una boot2root pensata per esercitarsi nello scrivere semplici exploit per buffer overflow semplici, senza meccanismi di protezione dello stack.
modified:
featured: false
category: [post]
tags: [walkthrough,oscp,vulnhub,getting-root,brainpan,write-up]
image:
  feature: brainpan_1.png
comments: true
share: true
---

[Brainpan 1](https://www.vulnhub.com/entry/brainpan-1,51/) è stata la macchina
più divertente che ho risolto questo inverno, mentre mi preparavo per l'esame
per
l'[OSCP](https://www.offensive-security.com/information-security-certifications/oscp-offensive-security-certified-professional/).

Questa macchina è l'ideale per chi vuole esercitarsi nella scrittura di exploit
per buffer overflow molto simili a quelli che si trovano nel corso di Offensive
Security.

## Enumeration

Come sempre tutto parte da una scansione per trovare porte aperte e servizi in
ascolto. Nel mio piccolo lab, la vittima ha l'indirizzo IP 192.168.252.129.

{%highlight sh%}
# nmap -sV 192.168.252.129

...

# Nmap 7.70 scan initiated Tue Jun 26 08:27:06 2018 as: nmap -sV -oA brainpan 192.168.252.129
Nmap scan report for brainpan (192.168.252.129)
Host is up (1.7s latency).
Not shown: 998 closed ports
PORT      STATE SERVICE VERSION
9999/tcp  open  abyss?
10000/tcp open  http    SimpleHTTPServer 0.6 (Python 2.7.3)
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port9999-TCP:V=7.70%I=7%D=6/26%Time=5B31DCC3%P=x86_64-pc-linux-gnu%r(NU
SF:LL,298,"_\|\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20
SF:\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20_\|\x20\x20\x20\x20
SF:\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x2
SF:0\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x
SF:20\n_\|_\|_\|\x20\x20\x20\x20_\|\x20\x20_\|_\|\x20\x20\x20\x20_\|_\|_\|
SF:\x20\x20\x20\x20\x20\x20_\|_\|_\|\x20\x20\x20\x20_\|_\|_\|\x20\x20\x20\
SF:x20\x20\x20_\|_\|_\|\x20\x20_\|_\|_\|\x20\x20\n_\|\x20\x20\x20\x20_\|\x
SF:20\x20_\|_\|\x20\x20\x20\x20\x20\x20_\|\x20\x20\x20\x20_\|\x20\x20_\|\x
SF:20\x20_\|\x20\x20\x20\x20_\|\x20\x20_\|\x20\x20\x20\x20_\|\x20\x20_\|\x
SF:20\x20\x20\x20_\|\x20\x20_\|\x20\x20\x20\x20_\|\n_\|\x20\x20\x20\x20_\|
SF:\x20\x20_\|\x20\x20\x20\x20\x20\x20\x20\x20_\|\x20\x20\x20\x20_\|\x20\x
SF:20_\|\x20\x20_\|\x20\x20\x20\x20_\|\x20\x20_\|\x20\x20\x20\x20_\|\x20\x
SF:20_\|\x20\x20\x20\x20_\|\x20\x20_\|\x20\x20\x20\x20_\|\n_\|_\|_\|\x20\x
SF:20\x20\x20_\|\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20_\|_\|_\|\x20\x20_
SF:\|\x20\x20_\|\x20\x20\x20\x20_\|\x20\x20_\|_\|_\|\x20\x20\x20\x20\x20\x
SF:20_\|_\|_\|\x20\x20_\|\x20\x20\x20\x20_\|\n\x20\x20\x20\x20\x20\x20\x20
SF:\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x2
SF:0\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x
SF:20\x20_\|\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x
SF:20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\n\x20\x20\x20\x20\x20\x20\x2
SF:0\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x
SF:20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\
SF:x20\x20_\|\n\n\[________________________\x20WELCOME\x20TO\x20BRAINPAN\x
SF:20_________________________\]\n\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20
SF:\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ENTER\x
SF:20THE\x20PASSWORD\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x
SF:20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\n\n\
SF:x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20
SF:\x20\x20\x20\x20\x20\x20\x20\x20>>\x20");

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Tue Jun 26 08:27:46 2018 -- 1 IP address (1 host up) scanned in 39.99 seconds


{%endhighlight%}

Il servizio in ascolto sulla porta 9999 è programma custom che chiede una
password all'utente.

![Servizio in ascolta sulla 9999]({{site.url}}/assets/images/brainpan_9999.png)

Sulla porta 10000 è in ascolto un web server con un'infografica di Veracode come
homepage.

![Veracode]({{site.url}}/assets/images/veracode.png)

Con dirb sulla porta 10000 troviamo una directory /bin/ che contiene un
binario, brainpan.exe

Il file brainpan.exe apre una socket sulla porta 9999 sulla mia macchina... è
l'eseguibile del demone in ascolto sulla vittima.

A questo punto, possiamo iniziare a fare un reverse per capire qualcosa di più
sul comportamento di questo binario. Usando il comando 'strings' cerco stringhe
ascii intelleggibili, contenute all'interno del file eseguibile, nella speranza
che la password sia salvata in chiaro da qualche parte.

{% asciicast 189658 %}

Nonostante abbia la password, ci posso fare veramente poco. Devo sperare che
brainpan.exe abbia qualche vulnerabilità, come un buffer overflow, che mi
permetta di entrare sulla macchina.

Mi scrivo un semplice fuzzer che prova, valori sempre crescenti di password,
nella speranza di causare un errore di segmentazione, o meglio ancora un
_illegal instruction_.

{%highlight python %}
#!/usr/bin/env python

import socket
import sys

def fuzz(ip):
    for i in range(30):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            s.connect((ip, 9999))
            payload = int(i) * ("A"*100)
            s.send(payload+"\r\n")
            print "[*} sending " + str(len(str(payload))) + " bytes"
            s.close

        except socket.error, msg:
            print "Service die at " + str(len(str(payload))) + " bytes"
            sys.exit(1)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print "[!] usage: " + sys.argv[0] + " ip_address"
        sys.exit(0)
    else:
        fuzz(sys.argv[1])

{%endhighlight %}

{% asciicast 189656 %}

Il fuzzer si ferma dopo aver inviato 800 byte quando il demone smette di
rispondere andando in crash. Il messaggio di errore ci dice che abbiamo
sovrascritto il valore di un registro che veniva utilizzato per referenziare
un'area di memoria.

Questo è un buon punto di partenza ma non abbiamo ancora la shell in tasca.

Modificando il mio semplice fuzzer, provo a mandare un buffer di 1000 byte
generato con pattern_create.rb per capire dopo quanti caratteri ho la
sovrascrittura dell'EIP.

{% asciicast 189800 %}

Il valore del EIP è 0x35724134. Per calcolare l'offset entro il quale io
sovrascrivo il mio EIP, uso il tool pattern_offset. Ottengo che si trova dopo
524 caratteri.

Il prossimo obiettivo è quello di avere la conferma di poter sovrascrivere
ulteriormente il mio EIP. Modifico quindi il codice del mio fuzzer in maniera
tale da mandare 524 byte di padding e la stringa "BBBB" allo scopo di causare
la sovrascrittura dell'EIP con 0x42424242.

{% asciicast 189801 %}

Debugger alla mano posso vedere lo stato dei miei registri. Il mio shellcode
viene copiato nello stack e referenziato dai registri opportuni.

![OllyDBG in azione]({{site.url}}/assets/images/ollydbg.png)

Usando il comando objdump, cerco all'interno del binario la stringa "ff e4" che
corrisponde all'istruzione JMP ESP. Quello che voglio fare è quindi è cambiare
il valore dell'EIP in maniera tale che, la prossima istruzione da eseguire,
sarà la JMP ESP, contenuta all'indirizzo 0x311712f3. In questo modo
l'esecuzione continuerà dalla zona nello stack che sto riempiendo con il mio
shellcode.

Per evitare soprese, durante la sovrascrittura dello stack, dovrò andare a
verificare se ci sono caratteri particolari che non vengono gestiti
correttamente. Ad esempio, un '\n' potrebbe essere interpretato come fine del
flusso di dati ed interrompere quindi la scrittura di byte nello stack di
brainpan.exe.
Lo scopo è quindi quello di costruire uno shellcode che venga copiato nella sua
interezza all'interno dello stack.

Come trovo i bad characters? Abbastanza semplice, cambio il mio payload,
mettendo dopo la stringa "BBBB" tutti e 256 codici ascii, dallo 0x00 a 0xFF e
vedo chi viene copiato e chi invece deve essere scartato perché interrompe la
mia sequenza.

Per brainpan.exe, l'unico bad character sarà 0x00. Quando feci a Gennaio questa
macchina, usai msfvenom per creare un payload, ora però, visto che sto
studiando per la SLAE, uso lo shellcode creato per [il secondo assignment per
l'esame]({{site.url}}/slae/assignment-2-create-a-reverse-shellcode/).

{%asciicast 190052%}

Lanciando l'exploit, dopo averlo provato sul exe scaricato dal sito, ottengo una
reverse shell non privilegiata sulla macchina.

>> Provandolo sul mio target reale, invece non succede niente. Perché?

Passa un giorno, mi scervello, ascolto musica neu metal, cade una bomba d'acqua
sull'Italia settentrionale, l'Inghilterra passa sulla Colombia ai rigori agli
ottavi di Russia 2018 e non riesco a dormire per l'afa.

Poi la soluzione. Quando scrissi lo shellcode per la SLAE, usai la nuova
numerazione introdotta dal kernel 4.3 in poi per le chiamate che si occupano
del networking.

In pratica, prima del kernel 4.3 tutte le system call come socket(), bind(),
connect(), ... erano multiplexate dalla chiamata socketcall() che, grazie al
numero di funzione da richiamare, specificato nel registro EAX, ti redirigeva
sulla funzione corretta.

Potete approfondire [qui, quando faccio la PoC analysis]({{site.url}}/slae/assignment-1-create-a-bind-shellcode/)

Quindi, ho fatto uno shellcode troppo moderno per Brainpan. Torniamo a
msfvenom.

{%asciicast 190053%}

Da qui, il takeover della macchina prende molteplici strade. A Gennaio, presi
la strada panoramica, mentre a Giugno, quando stavo usando questa macchina per
un talk al [Richmond Cyber Resilience
Forum](http://www.richmonditalia.it/conferenze-cyber/) ho trovato una via
direttissima, quasi per caso.

## Takeover percorso panoramico

Nella home dell'utente ho uno script eseguito in crontab per verificare il
funzionamento dei servizi sulle porte 9999 e 10000. Il crontab è quello
dell'utente puck, quindi non posso sfruttare questa strada per elevare i miei
privilegi.

Carico sulla macchina, usando wget ed un web server sulla mia kali, lo scrip
linuxprivchecker.py. Gli exploit per questa versione del kernel non funzionano.

In /usr/local/bin, ho trovato un programma, /usr/local/bin/validate che è SUID e
dell'utente anansi... probabilmente la strada per root è più lunga di quanto
sembri. Con peda, estensioe di gdb, verifico le feature di sicurezza di
validate... nessuna. Se è vulnerabile ad un bof, posso scrivere un exploit
semplice semplice.

Con GDB, verifico che con un input di 1000 A, causo la sovrascrittura dell'EIP e
dello stack e del registro EBX. Non ho jmp o call a esp nel mio binario e non ho
neanche jmp ebx (FF E3), quindi devo usare un ROP gadget per sovrascrivere il
mio EIP. Posso usare lo stesso EIP del bof precedente, sfruttando quella
chiamata a JMP ESP.

L'offset a cui sovrascrivo l'EIP è 116 bytes. Noto che EAX punta al mio
shellcode, nel eseguibile validate trovo una call eax (FF D0) all'indirizzo
0x804862b. Metto questo nel mio EIP, in maniera tale da saltare all'interno del
mio stack. Ora sono l'utente anansi.

Dall'output del comando 'sudo -l' sappiamo che il comando
/home/anansi/bin/anansi_util può essere eseguito come utente root, via sudo
senza password. Copio /bin/bash e lo eseguo come sudo -u root ./anansi_util

E siamo root.

## Takeover percorso direttissimo

Il takeover per direttissima sfrutta sempre anansi_util, che può essere
eseguito anche dall'utente puck, con i privilegi di root attraverso sudo, senza
password.

Il comando attraverso il parametro manual ed un comando a caso, apre la man
page corrispondente. A questo punto, non resta altro che chiedere al nostro
pager preferito, di aprire una shell per noi e, visto che anansi_util ha
mantenuto il privilegio di root per eseguire man, mi trovo root, quasi per
caso.

{%asciicast 190054%}

## Off by one

Questo post è nei miei draft da fine marzo. La SLAE e altri stravolgimenti
stanno portando via veramente tanto al mio tempo ma eccoci ancora qui.

Brainpan 1 è stata una macchina veramente divertente e non vedo l'ora di
provare la seconda parte. Questa volta, magari facendovi aspettare un po' meno.

Enjoy it!
