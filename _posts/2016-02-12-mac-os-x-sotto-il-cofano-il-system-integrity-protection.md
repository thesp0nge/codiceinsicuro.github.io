---
layout: post
author: thesp0nge
title: "Mac OS X sotto il cofano: il system integrity protection"
promotion: "El Capitain ha introdotto il System Integrity Protection: un meccanismo per proteggere il sistema persino da root"
modified: 
featured: false
category: [Spinaci]
tags: [mac os x, sip, system integrity protection, tampering, mac, segregation of duties]
image:
  feature: sip.jpg
comments: true
share: true
---

Alzi la mano chi pensa ad un [avanzato meccanismo di protezione per Mac OS
X](https://en.wikipedia.org/wiki/System_Integrity_Protection) se io ora vi
dicessi _"SIP"_.

Io, fino ad un paio di giorni fa, ero nel gruppo folto di quelli che ha tenuto
la mano giù.

Ora, se avete un Mac OS X sotto la tastiera, date questo comando:

{%highlight sh%}
  $ man csrutil
  usage: csrutil <command>
  Modify the System Integrity Protection configuration. All configuration changes apply to the entire machine.

  Available commands:

    clear
        Clear the existing configuration. Only available in Recovery OS.
    disable
        Disable the protection on the machine. Only available in Recovery OS.
    enable
        Enable the protection on the machine. Only available in Recovery OS.
    status
        Display the current configuration.

    netboot
        add <address>
            Insert a new IPv4 address in the list of allowed NetBoot sources.
        list
            Print the list of allowed NetBoot sources.
        remove <address>
            Remove an IPv4 address from the list of allowed NetBoot sources.

{%endhighlight%}

SIP, è un meccanismo introdotto in [Mac OS X El
Capitain](https://en.wikipedia.org/wiki/OS_X_El_Capitan), per proteggere alcune
risorse critiche del sistema, **anche** da root. Si, a me continua a venire in
mente [AngeL](http://angel-lsm.sf.net) e molte scelte che feci sbagliate in
passato, prima fra tutte non accettare l'invito del prof. Bruschi nel 2001.

Nei sistemi Unix, root è **dio**. root può fare tutto. Questo lo sanno tutti.
Nei sistemi dove si vuole invece introdurre, un ulteriore meccanismo di
_enforcement_ della sicurezza, si limita il potere di dio a salvaguardia del
sistema stesso.

Ecco in parole povere cos'è SIP. Prima di El Capitain, bisognava usare i
[securelevel](https://en.wikipedia.org/wiki/Securelevel) per operare controlli
simili, tuttavia era una feature meno ricca di quella apparsa nell'autunno
dello scorso anno.

La protezione offerta da SIP, riguarda la protezione dalla scrittura di alcune
risorse del sistema, la negazione della possibilità di agganciarsi a processi
particolari, tra cui quelli firmati con una chiave privata Apple, per tracing
con [DTrace](https://en.wikipedia.org/wiki/DTrace). In ultima istanza, e questo
è quello con cui mi sono imbattuto qualche giorno fa, all'inizio dei miei
esperimenti con Mac OS X, il SIP nega la possibilità di caricare estensioni del
kernel che non siano state firmate digitalmente con un certificato
**particolare** rilasciato da Apple e per il quale Apple ti fa il terzo grado.

Insomma, te la vogliono far sudare questa macchina. Anche a scopo didattico.
Per disabilitare il SIP, serve infatti, riavviare la macchina in modalità
_recovery_ e dalla shell che si apre, lanciare il comando:

{%highlight sh%}
  $ csrutil disable
{%endhighlight%}

Al riavvio successivo, l'anarchia è tornata sovrana e nessuno dirà più di no al
nostro **root**. La domanda è: _voi lo fareste?_

C'è un bellissimo post [di Rich
Trouton](https://derflounder.wordpress.com/2015/10/01/system-integrity-protection-adding-another-layer-to-apples-security-model/)
che da una overview completa di quello che è protetto da SIP e di come
interagire in userland.

Io no, sinceramente. Mi tengo il mio SIP e troverò un altro modo per giocare in
_kernel land_. Come ogni sistema informativo, anche il SIP ha delle regole,
alcune di [esse possono essere eluse](https://reverse.put.as/2015/10/12/rootfool-a-small-tool-to-dynamically-disable-and-enable-sip-in-el-capitan/).

Nota a margine su [Rootfool](https://github.com/gdbinit/rootfool), il tool che
permette di controllare il SIP.

Si basa su una Kernel extension che fa l'hook di una chiamata, csrctl(), che,
chiamata da csrutil, permette di controllare il SIP. Ma senza un certificato
valido, non puoi installare questa kext.

Enjoy it!
