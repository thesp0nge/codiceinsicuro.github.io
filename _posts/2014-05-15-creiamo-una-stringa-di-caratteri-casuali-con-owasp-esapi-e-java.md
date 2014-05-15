---
layout: post
title: "Creiamo una stringa di caratteri casuali con Owasp ESAPI e Java"
modified:
category: [builders, quick howto]
tags: [owasp, owasp esapi, java, numero casuale, pseudorandom, h4f]
image:
  feature: random_string_2.png
  credit: Jannis Andrija Schnitzer
  creditlink: https://flic.kr/p/3wEaFB
comments: true
share: true
---

Spesso si ha l'esigenza di creare una stringa di caratteri alfanumerici che sia
casuale. Ad esempio possiamo usarla come password temporanea, come salt per
offuscare una password, come chiave, ...

Senza inventare un'altra volta la ruota, possiamo usare la libreria [Owasp
ESAPI **LINK**](#)[^1]. Il progetto Owasp ESAPI nasce con lo scopo di fornire
una serie di API che realizzano controlli di sicurezza. Il codice è opensource
e viene costantemente rivisto dalla community. Io ero il maintainer di [Owasp
ESAPI for ruby](https://rubygems.org/gems/owasp-esapi-ruby) anche se è un paio
d'anni che mi riprometto di riprendere in mano tutto... non è detto che un
giorno non lo faccia.

Per compilare ed eseguire il codice che poi vi mostro, avete bisogno del jar
file della libreria che potete recuperare partendo dalla pagina del progetto
sul sito [Owasp **LINK**](#)

Inoltre avrete bisogno di un file, ESAPI.properties che contiene alcune
configurazioni per il fine tuning della libreria. Ecco, io me lo sono pescato
dal repository dei sorgenti, potrebbe essere una bella miglioria se questo file
venisse generato con i valori di default nel caso non fosse trovato.

Il mio lo potete trovare [qui]({{ site.url }}/assets/resources/ESAPI.properties).

Il codice di per se è abbastanza banale. Create un'istanza della classe
DefaultRandomizer e le chiedete di generare per voi una stringa random di 32
caratteri alfanumerici.

Tutta la magia è nella libreria e voi avete la voltra stringa random in 2 righe
di codice.

{% highlight java %}
import org.owasp.esapi.reference.DefaultRandomizer;
import org.owasp.esapi.EncoderConstants;

public class CreateRandomString {
  public static void main(String args[]){
    DefaultRandomizer r = (DefaultRandomizer) DefaultRandomizer.getInstance();
    System.out.println("32 char string: " + r.getRandomString(32, EncoderConstants.CHAR_ALPHANUMERICS));
    }
}
{% endhighlight %}

Compilare ed eseguire il codice è semplice. Io, come sapete, non scrivo codice
Java dai tempi di [Owasp Orizon **LINK**](#), quindi non ho un ambiente
preparato e non ho un $CLASSPATH interessante. Passo il percorso del JAR di
Owasp Esapi direttamente da linea di comando, ipotizzando si trovi nella stessa
directory dove avete creato il file CreateRandomString.java.

Lo stesso dicasi per l'esecuzione della classe, in questo caso il $CLASSPATH
dovrà avere anche la directory '.' in quando il vostro bytecode si trova lì e
java non lo include automaticamente tra i path da cercare.

L'output come vedete è una stringa, in questo caso specifico di 32 caratteri,
con un encoding che ne permette la semplice memorizzazione senza dover
ricorrere alla codifica unicode. I caratteri di questa stringa sono generati
con le API SecureRandom del JDK. In questo caso le chiamate di ESAPI sono solo
dei wrapper e poco più, alla chiamata nativa e sicura offerta dal linguaggio.

{% highlight text %}
$ javac -cp esapi-2.1.0.jar CreateKeys.java
$ java -cp esapi-2.1.0.jar:. CreateKeys

32 char string: nTIL3FJccrnkfbbYiJsBiRDQkovdkLjj
{% endhighlight %}

## Off by one

[Owasp ESAPI **LINK**](#) è un bel progettone ed offre agli sviluppatori delle
API che possono essere utilizzate in codice di produzione per aggiungere
controlli di security. Il codice ha un livello di maturità tale da essere usato
in portali di grosse dimensioni senza il pericolo che faccia crollare il vostro
bel castello di carte.

ESAPI è disponibile in molti linguaggi oltre a Java: PHP, Ruby, .NET tra quelli
più usati per le web application. Sarebbe interessante farne il porting anche
per Go o qualche framework javascript come NodeJs.

Sicuramente usare un'API come [Owasp ESAPI **LINK**](#) non può che aiutare lo
sviluppatore ad introdurre controlli di security senza dover entrare nel
dettaglio di quali siano tutti i modi per mitigare un cross site scripting, una
sql injection o un cross site request forgery.

[^1]: Cos'è Owasp? Owasp è un acronimo per Open Web Application Security
      Project. E' una community che raccoglie specialisti del settore dell'ICT
      security con lo scopo di creare awareness, realizzare guide e documentazione,
      realizzare codice che permettano lo sviluppo di applicazioni web sicure.
