---
layout: post
title: "Shellerate: un framework per generare shellcode"
promotion: 
modified: 
featured: false
category: [post]
tags: [python, tool, shellcode, slae, polimorfismo, encoding, x86]
image:
  feature: shells.jpg
  credit:
  creditlink:
comments: true
share: true
---

L'anno scorso, in preparazione al corso [Cracking the
Perimeter](https://www.offensive-security.com/information-security-training/cracking-the-perimeter/),
avevo seguito il corso [x86 Assembly Language and Shellcoding on
Linux](https://www.pentesteracademy.com/course?id=3). Questo mi permise di
rinfrescare la programmazione in assembler per x86 e di imparare un po' di
python.

A distanza di qualche mese, il progetto
[shellerate](https://github.com/thesp0nge/shellerate) acquista una sua
importanza e maturità, almeno nella mia routine di coding.

Installare shellerate è abbstanza semplice e richiede di utilizzare pip, qui
nell'esempio uso la versione 3 del comando.

{% highlight sh %}
$ pip3 install shellerate --user
{% endhighlight %}

Da questo momento è possibile utilizzare le API di shellerate in modo da creare
i primi shellcode, anche se sto lavorando ad uno script che colleghi un po' le
varie possibilità.

Per generare lo shellcode per una bind shell in ambiente Linux x86, in ascolto
sulla porta 4444, sono sufficienti 2 righe di codice.

{%highlight python%}
from shellerate.bind_shellcode import *

b=BindShellcode(4444, 'x86', 'linux')
b.generate()
print("Shellcode: %s" % b.shellcode())

{%endhighlight%}

L'output, potrà poi essere utilizzato all'interno di un exploit che stiamo
scrivendo. Se si ha poi la necessità di farne una versione offuscata, per ora
solo attraverso la versione che [scritti per la
SLAE32](https://codiceinsicuro.it/slae/assignment-4-a-default-encoder/), basta
aggiungere una riga di codice.

{%highlight python%}
from shellerate.bind_shellcode import *

b=BindShellcode(4444, 'x86', 'linux')
b.encode()
b.generate()
print("Shellcode: %s" % b.shellcode())

{%endhighlight%}

Come si può vedere, ho cercato di tenere l'API il più possibile pulita e
minimal, in modo da rendere il codice di un exploit che usa shellerate,
semplice da leggere.

Creare una versione dello stesso shellcode, con un
[egg hunter](https://codiceinsicuro.it/slae/assignment-3-an-egg-hunter-journey/)
è semplice tanto quanto la versione offuscata: 

{%highlight python%}
b=BindShellcode(4444, 'x86', 'linux')
b.egg_hunter()
b.generate()
sc = b.shellcode()

print("Egg Hunter: %s" % sc["egg_hunter_code"])
print("Shellcode: %s" % sc["egg_hunter_shellcode"])
{%endhighlight%}

Sto lavorando in questi giorni ad un encoder custom che ho utilizzato per
risolvere una delle quest di
[vulnserver.exe](https://github.com/stephenbradshaw/vulnserver) e che prevede,
con una tecnica imparata nel corso della certificazione OSCE, di scrivere uno
shellcode utilizzando delle istruzioni di sottrazione e di push.

Tutta farina del sacco di Mati Aharoni che ha presentato questa tecnica in
questo talk a Defcon 16.

{% youtube gHISpAZiAm0 %}

Io ho solo messo insieme qualche pezzo e scritto un codice, utilizzato anche
nel mio ultimo tentativo di certificazione, per offuscare uno shellcode. Posso
assicurare che ha funzionato.

Presto questo codice sarà nella nuova versione di shellerate che,
probabilmente, potrà essere pronta per essere qualcosa di più che un esercizio
di stile.

Enjoy it.
