---
layout: post
title: "Entropia, password e passphrase"
promotion: 
modified: 
featured: false
category: [post]
tags: [entropia, shannon, password, complessità della password, passphrase]
image:
  feature: password_strength.png
  credit: xkcd.com
  creditlink: http://imgs.xkcd.com/comics/password_strength.png
comments: true
share: true
---

Password, croce e delizia dei meccanismi di autenticazione là fuori. Dalla
robustezza di questo meccanismo, dipendete il primo bastione della sicurezza
dei nostri sistemi. Ma quanto è sicura una password? Le password policy
funzionano? Le password sono più o meno sicure rispetto alle passphrase?

Ho provato a giocare un po' con
l'[entropia](https://it.wikipedia.org/wiki/Entropia_\(teoria_dell%27informazione\))
per misurare i bit necessari a memorizzare i vari pattern di stringhe
rappresentanti ipotetiche password.

Mi sono detto, _maggiore l'entropia, maggiore sarà bontà della password_. In
parole povere, sono partito dall'ipotesi che, l'entropia di una stringa sia un
buon KPI per quella stringa se vista come password.

Per giocare, ho usato Ruby come al solito ed ho creato un metodo entropy che,
dichiarato in questo modo alla classe String, mi permette di estendere la
classe base con questo nuovo metodo.

{%highlight ruby%}
class String
  def entropy
    self.each_char.group_by(&:to_s).values.map { |x| x.length / self.length.to_f }.reduce(0) { |e, x| e - x*Math.log2(x) }
  end
end
{%endhighlight%}

A questo punto posso, data una stringa arbitraria, calcolare il valore
dell'entropia così come definita da Shannon.

{%highlight sh%}
$ irb
2.3.3 :001 > class String
2.3.3 :002?>     def entropy
2.3.3 :003?>         self.each_char.group_by(&:to_s).values.map { |x| x.length / self.length.to_f }.reduce(0) { |e, x| e - x*Math.log2(x) }
2.3.3 :004?>       end
2.3.3 :005?>   end
 => :entropy
2.3.3 :006 > "Leggi anche tu codiceinsicuro.it".entropy
 => 3.7775182662886326
2.3.3 :007 >
{%endhighlight%}

Un valore di _3.78_... non male come consiglio di lettura!

Per capire come si comportano delle stringhe, generate in maniera più o meno
sicura, buttiamo lì un programmino che calcola l'entropia di qualche stringa
con dei pattern particolari.

{%highlight ruby%}
if __FILE__ == $0
  require 'benchmark'
  require 'digest'

  puts "Entropy for clear text passwords:"
  o = [('a'..'z'), ('A'..'Z'), ('0'..'9')].map(&:to_a).flatten
  string = (0...16).map { o[rand(o.length)] }.join

  words = ["aba17a8c1041b4b4", "fT$e-'U_78~Ol:yNp", "aaaaaaaaaaaaaaaa", "password", string, "caro sempre fu quest ermo colle e questa siepe che tanta parte del guardo esclude", "Mario1968", "Gennaio2017", "correct horse battery staple", "Nullam id dolor id nibh ultricies vehicula ut id elit."]

  words.each do |w|
    puts 'entropy("%s") #=> %f' % [w, w.entropy]
  end

  puts "Entropy for SHA256 counterpart:"

  words.each do |w|
    puts 'entropy("%s") #=> %f' % [Digest::SHA256.hexdigest(w), Digest::SHA256.hexdigest(w).entropy]
  end

  words = ["correct horse battery staple", "correct horse battery staple!", "correct horse battery staple123", "correct horse battery staple123!"]
    words.each do |w|
    puts 'entropy("%s") #=> %f' % [w, w.entropy]
  end
end
{%endhighlight%}

Ho messo un po' di stringhe con minuscole e numeri, minuscole maiuscole e
numeri, una stringa impossibile "fT$e-'U_78~Ol:yNp" che in realtà è un'ottima
password, una stringa completamente pseudo casuale, qualche passphrase e
qualche combinazione di password banali come quelle composte da MeseAnno.

> Le password sono più o meno sicure rispetto alle passphrase?

Ho poi fatto lo stesso calcolo sulla versione offuscata con SHA256 delle stesse
stringhe. Perché sul DB è questo il valore che va, siamo d'accordo tutti vero?

I risultati, mi hanno un po' sorpreso. Non tanto per l'andamento, in linea con
quanto mi aspettassi, quanto per lo scarto. La stringa impossibile da ricordare
ha il valore più alto di entropia, mentre la stringa _password_ e la stirnga
con solo minuscole e numeri hanno un valore di entropia minore delle altre. Lo
0 della stringa fatta da una sola lettera, credo non meriti la citazione.

Mi ha un po' sorpreso il basso scarto tra la passphrase e la stringa generata
con caratteri pseudocasuali.

{%highlight sh%}
Entropy for clear text passwords:
entropy("aba17a8c1041b4b4") #=> 2.811278
entropy("fT$e-'U_78~Ol:yNp") #=> 4.087469
entropy("aaaaaaaaaaaaaaaa") #=> 0.000000
entropy("password") #=> 2.750000
entropy("H7E6JbcmWH0oNIR6") #=> 3.750000
entropy("caro sempre fu quest ermo colle e questa siepe che tanta parte del guardo esclude") #=> 3.795849
entropy("Mario1968") #=> 3.169925
entropy("Gennaio2017") #=> 3.277613
entropy("correct horse battery staple") #=> 3.494680
entropy("Nullam id dolor id nibh ultricies vehicula ut id elit.") #=> 3.837316
{%endhighlight%}

Questo risultato, figlio del limitato alfabeto usato per la passphrase, mi dice
che in realtà la quantità di informazioni necessarie per memorizzare
Gennaio2017 è _quasi_ quella necessaria per memorizzare questo
[Leopardi](http://www.pensieriparole.it/poesie/poesie-d-autore/poesia-18135)
rivisitato.

*Primo risultato:* vista dal punto di vista di un calcolatore, una passphrase
non è *molto* più robusta di una password banale come _Gennaio2017_.

Per rendere l'entropia della nostra passphrase maggiore, ne arricchiamo
l'alfabeto. Vediamo come, aggiungendo tipologie di caratteri differenti, ho un
aumento della quantità di informazione necessaria per memorizzare le stringhe
differenti.

Questo però vanifica l'obiettivo di avere qualcosa di semplice da memorizzare,
obiettivo che fa scegliere una frase piuttosto che una parola incomprensibile
con lettere e numeri.

{%highlight sh%}
entropy("correct horse battery staple") #=> 3.494680
entropy("correct horse battery staple!") #=> 3.590571
entropy("correct horse battery staple123") #=> 3.768555
entropy("correct horse battery staple123!") #=> 3.851410
{%endhighlight%}

Le nostre password, però, vengono memorizzate in forma offuscata all'interno di
un database. Non useremo né MD5, né SHA1 in quanto ora entrambe vulnerabili a
collisioni, ci affideremo a SHA256.

Offuschiamo le password e calcoliamone l'entropia.

{%highlight sh%}
Entropy for SHA256 counterpart:
entropy("ead6e29924ed2e710cf7516e823c91a525b0bf44f2dc5f1b67c3ad53dc252e5f") #=> 3.855088
entropy("1491d9db271970cb5ee7194d5c5df593941adcc410d67c3041c182b92c513aab") #=> 3.756548
entropy("0c0beacef8877bbf2416eb00f2b5dc96354e26dd1df5517320459b1236860f8c") #=> 3.910582
entropy("5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8") #=> 3.807504
entropy("3d4b44efe4597b537a7f998e749e8343c1d500430e001288ffd912dd0ea414b4") #=> 3.740976
entropy("0879b981b1be9f00b41be7127aa4092b59e7a3eefde4568208229cbc5fb81a1c") #=> 3.806597
entropy("7ed59b58b947d17aa40b519f34583800e6eb2bbdfb51e21bf447e6307e529979") #=> 3.790263
entropy("374e8f8746cd5920105e061bbd879c236d291d7361c9ffb3d65359b3097ddbb3") #=> 3.803729
entropy("30ae317b1168671a902123a01c0e8d3b36b4418587ff7cd28b48a3fad75cfac3") #=> 3.860130
entropy("c4bbcb1fbec99d65bf59d85c8cb62ee2db963f0fe106f483d9afa73bd4e39a8a") #=> 3.853777
entropy("3610bece7b415d00354be7e61e80b30cde56a51d0ff19300bd949810e1b3fc14") #=> 3.713754
{%endhighlight%}

Essendo parole di uno stesso alfabeto ed aventi tutte la stessa lunghezza,
l'entropia è pressapoco la stessa.

*Secondo risultato:* quando offuschiamo una parola chiave o una frase, possiamo
abbassarne il valore di entropia.

## Dal punto di vista dell'attaccante

Chi vuole violare la mia password parte dal suo valore offuscato. Da questo
punto di partenza, essendo le funzioni di hash ad una sola direzione, l'unico
approccio possibile, oltre al social engineering o compromettere la postazione
della vittima, è un attacco a forza bruta.

E qui la passphrase si rivela essere la scelta migliore. Una parola chiave con
una combinazione di lettere, numeri e caratteri speciali, può essere sempre
ricavata da un tool di bruteforce. Potrebbero volerci anni per arrivare alla
parola corretta, ma prima o poi il caso mi porterà al tanto agoniato
_Gennaio2017_ o _Farfallina78_.

Se la mia parola chiave è invece, _"cantami o diva del pelide achille"_ o
_"cani mangiano dromedari verdi"_, sfido qualsiasi programma automatico a
prendere parole per comporre frasi di senso compiuto o meno. Neanche le più
sofisticate AI.

## Perché scegliere una passphrase

Al posto di una password scegliete una passphrase perché:

* ha in ogni caso un buon valore di base di entropia
* è semplice da memorizzare perché associata a nostri processi mentali
* non è ricavabile da un tool automatico di bruteforce

Se sei uno sviluppatore, quindi, battiti per togliere quei vincoli assurdi sul
numero di minuscole, maiuscole, numeri, lettera e testamento. Supporta le
passphrase, tanto poi nel tuo DB occuperanno sempre lo stesso numero di byte,
una volta offuscate.

Enjoy it!
