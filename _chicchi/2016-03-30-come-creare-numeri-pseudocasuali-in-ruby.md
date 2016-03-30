---
layout: chicchi
title: "Come creare numeri pseudocasuali in Ruby"
tags: [ruby, random, numeri casuali, PRNG]
comments: true
share: true
order: 2
---

Creare un numero pseudocasuale: prima o poi capita a tutti. Ogni linguaggio di
programmazione ha, nelle proprie librerie standard, dei metodi per generare
numeri pseudocasuali, partendo da un _seed_, da un seme che alimenta
l'algoritmo stesso.

La bontà della serie generata, dipende **esclusivamente** da questo seme. Non
ci credete? Fate questo esperimento:

{% highlight ruby %}
r1=Random.new(10)
r2=Random.new(10)

puts r1.rand
puts r2.rand
{% endhighlight %}

r1 ed r2 sono due oggetti slegati tra di loro, se si esclude il fatto che è
stato passato lo stesso seed durante l'inizializzazione del motore di
generazione di numeri pseudocasuali. Io scommetto che r1 ed r2 hanno generato
lo stesso numero. Non solo, io scommetto che tutta la sequenza di numeri
generati da r1 ed r2 sarà la stessa, per quanti tentativi voi facciate.

> Primo risultato quindi: il seed influenza la sequenza pseudocasuale. Due
> generatori diversi, aventi lo stesso seed, genereranno la stessa sequenza
> pseudocasuale.

Il nocciolo del problema, quindi è: come scelgo questo _seed_?

## L'approccio che non approccia

Prendiamo l'esempio di prima e togliamo il parametro al costruttore della
classe Random. In questo caso, come da
[documentazione](http://ruby-doc.org/core-2.3.0/Random.html), Random prende
come seed dei valori dell'ambiente tra cui il PID del processo e alcuni bit di
entropia presi da sorgenti dipendenti dal Sistema Operativo (/dev/urandom, ad
esempio, nel caso dei sistemi Unix).

> If number is omitted, seeds the generator using a source of entropy provided
> by the operating system, if available (/dev/urandom on Unix systems or the
> RSA cryptographic provider on Windows), which is then combined with the time,
> the process id, and a sequence number.

{%highlight ruby%}

r1=Random.new
r2=Random.new

# r1.seed => 310613232339021331097288623431271330771
puts r1.rand
puts r2.rand
{% endhighlight %}

## L'approccio basato sul tempo

Una possibile soluzione, è quella di affidarsi al tempo per inizializzare il
seed.

{%highlight ruby%}

r1=Random.new(DateTime.now.strftime('%Q').to_i)

# r1.seed => 1459343182940

puts r1.rand
{% endhighlight %}

In questo caso però la scelta è peggiorativa, in quanto il seed è nettamente
più piccolo come dimensioni.

## L'approccio a stringhe

Per complicare un po' le cose, Ruby mette a disposizione anche la libreria
[securerandom](http://ruby-doc.org/stdlib-2.3.0/libdoc/securerandom/rdoc/SecureRandom.html).
Lo scopo sembra, dalla documentazione, quello di generare alfanumerici
pseudocasuali, ad esempio per la generazione di cookie di sessione o di
password _onetime_.

{%highlight ruby%}
require 'securerandom'

p SecureRandom.base64(12) #=> "7kJSM/MzBJI+75j8"
p SecureRandom.hex(13)    #=> "39b290146bea6ce975c37cfc23"
{% endhighlight %}

## Off by one

Allora, usare
[securerandom](http://ruby-doc.org/stdlib-2.3.0/libdoc/securerandom/rdoc/SecureRandom.html)
è la scelta da fare quando serve generare una stringa pseudocasuale, quindi in
ambito web, dovrà essere usata questa.

Se vi serve invece generare degli interi, la scelta deve ricadere su Random
lasciando al Kernel dell'interprete di Ruby il compito di inizializzare il
motore di generazione di numeri pseudocasuali.

Enjoy it!
