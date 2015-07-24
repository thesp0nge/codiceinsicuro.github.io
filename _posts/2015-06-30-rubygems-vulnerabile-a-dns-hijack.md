---
layout: post
title: "Rubygems vulnerabile a DNS Hijack"
promotion: "Rubygems ha corretto lo scorso maggio un possibile DNS Hijack sul sistema di distribuzione delle gemme ruby"
modified: 
featured: true
category: [Under attack]
tags: [cve-2015-3900, cve-2015-4020, dns hijack, rubygems, ruby, vulnerabilità, web]
image:
  feature: gems.jpg
  credit: Andrea
  creditlink: https://flic.kr/p/7AViT1
comments: true
share: true
---

Quattro giorni fa è passata [nella mailing list
ruby-security-ann](https://groups.google.com/forum/#!msg/ruby-security-ann/Mu7Q3R1ymDs/K0akJkCN614J)
la segnalazione di una vulnerabilità corretta in
[rubygems](https://rubygems.org) più di un mese fa.

Ultimamente sto trascurando
[dawnscanner](https://rubygems.org/gems/dawnscanner) in favore di altri
progetti, tra cui [WordStress](http://wordstress.org). Per questo motivo sono
stato meno attento a quello che succedeva nel mondo _rubesco_.

Il 15 Maggio scorso, veniva [segnalato sul blog di
rubygems.org](http://blog.rubygems.org/2015/05/14/CVE-2015-3900.html), il
rilascio di una nuova versione di rubygems per correggere una vulnerabilità che
se sfruttata dava la possibilità ad un attaccante di fare un DNS hijack e
potenzialmente distribuire versioni di gemme modificata rispetto alle
originali.

[Rubygems](https://rubygems.org), infatti, è il sistema di distribuzione del
software utilizzato dal mondo [ruby](https://ruby-lang.org/en). Il sistema è
centralizzato e, attraverso il comando ```gem```, permette di scaricare ed
installare gemme, ovvero librerie di terze parti che possiamo utilizzare nelle
nostre applicazioni ruby (o rails, o sinatra, o padrino, o rack, &mdots;).

Grazie ad un'[impostazione DNS](https://en.wikipedia.org/wiki/SRV_record), il
sito di rubygems.org permetteva la redirezione di client verso un host separato
e dedicato alla distribuzione delle gemme e alle richieste fatte via API.

Il comando ```gem``` tuttavia, e da qui il problema, non verificava l'hostname
restituito dalla chiamata DNS prima di redirigere le richieste del client.

Se un attaccante fosse stato in grado di forgiare una risposta alla richiesta
DNS del client, realizzando un DNS hijack, avremmo che potenzialmente software
modificato, sarebbe stato distribuito e considerato lecito.

La [patch come potete
vedere](https://github.com/rubygems/rubygems/commit/6bbee35fd6daed045103f3122490a588d97c066a),
rende più consistente la parte di validazione della risposta DNS prima darla in
pasto al client.

## Cosa devo fare

Fortunatamente possiamo risolvere il problema molto facilmente; aggiornando
rubygems all'ultima versione disponibile.

Questo comando, aggiornerà ```gem``` all'ultima patch rilasciata per quella
minor release, in modo da non rovinare nulla nel caso fossimo obbligati a stare
su versioni vecchiotte di ruby o gem stesso.

{% highlight sh %}
$ gem update --system 
{% endhighlight %}

Attenzioni a versioni vecchie di ruby, dalla 1.9.0 alla 2.2.0. Queste infatti
hanno una versione di rubygems incapsulata, vulnerabile e non aggiornabile. In
questi casi sarebbe meglio passare ad una versione aggiornata dell'interprete
stesso.
