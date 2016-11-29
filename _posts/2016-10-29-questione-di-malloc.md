---
layout: post
title: "Questione di malloc()"
promotion: "Un po' di sana gogna acara per un codice C che contiene una vulnerabilità in più di quanto avessi preventivato."
modified: 
featured: false
category: [post]
tags: [malloc, talk, hackinbo, fun, code review, buffer overflow, memory leak, command injection]
image:
  feature: memoria.jpg
  credit: Stefano C. Manservisi
  creditlink: https://flic.kr/p/5RMQTV
comments: true
share: true
---

Si è da poco spenta l'eco della [Winter Edition 2016 di
HackInBo](https://www.hackinbo.it). Lo si può semplicemente descrivere, come
l'evento italiano **più figo** in campo ICT Security, o Cyber Security o
Sicurezza Cibernetica, chiamatela come vi pare.

In questo momento sono in stazione che aspetto il mio treno, destinazione
Milano. Nel talk di oggi, che se vi siete persi via streaming, potrete rivedere
tra qualche tempo sul canale [YouTube](https://www.youtube.com/user/HackInBo), c'è stato un acceso dibattito sul
seguente codice C.

Nel mio talk, un racconto sulla mia esperienza nella messa in sicurezza del
ciclo di vita del software, ho voluto inserire due momenti quiz. In premio, 1
shot di Grappa, definita _cura ferite medie_ per non urtare la sensibilità
della platea astemia.

Essendo il premio ricco, capisco lo spirito agonisto nel voler risolvere il
quesito.

Il codice è questo, molto semplice.

{% highlight c %}
#include <stdio.h>
#include <stdlib.h>
#include <strings.h>

/*
 * Familiy: CODE REVIEW
 * Level  : MEDIUM
 *
 * This great tool reads a command stored in an environment variable and
 * execute it using system() function.
 * Allowed commands are 'ls' and 'll' and a whitelist approach is in place.
 */
int main(int argc, char **argv) {
  char *envy;


  envy = malloc(20 * sizeof(char));
  printf("%p\n", envy);
  bzero(envy, 20 * sizeof(char));

  envy = getenv("HACKINBO");
  printf("%p\n", envy);
  if (envy == NULL) {
    fprintf(stderr, "Please set HACKINBO env variable for more fun\n");
    return -1;
  }

  printf("HACKINBO variable found with value %s\n", envy);
  /*
   * export HACKINBO="ls"
   */
  if ((strstr(envy, "ls") != NULL) || (strstr(envy, "ll") != NULL)) {
    printf("Executing HACKINBO fun");
    system(envy);
  } else {
    fprintf(stderr, "Well, you want too much fun now");
    return -2;
  }

  return 0;
}
{% endhighlight %}

L'idea è quella di leggere una variabile d'ambiente, HACKINBO, metterla in una
stringa, fare un whitelist **sbagliato** e poi eseguire il comando.

La vulnerabilità che avevo in mente era una command injection. Se HACKINBO
contiene la stringa "ls;sh", il controllo sul comando non fallisce, quindi alls
system viene passato in realtà, non uno ma due comandi da eseguire.

Si è scatenata un po' di _bagarre_. Alcuni dicevano di aggiungere un
_cancelletto_ alla variabile d'ambiente e nella concitazione della discussione,
non ho approfondito.

Se cerco di mettere un cancelletto, non ottengo altro che un errore:

{% highlight sh %}
HackInBo] ./a.out
0x7f8b8e500000
0x7fff55c2df52
HACKINBO variable found with value ls#ls
sh: ls#ls: command not found
Executing HACKINBO fun%
{% endhighlight %}

Di sicuro, non controllo il valore di ritorno di malloc(), quindi, nel caso non
ci fosse memoria disponibile, andrebbe tutto in _segmentation fault_ quando
provo a chiamre la bzero() la riga dopo.

Una scuola di pensiero ha puntato il dito sulla dimensione dell'input copiato
nella variabile, pensando ad un possibile _buffer overflow_. Questo punto lo
voglio poi approndire con più calma, ma almeno su macOS, passando un bel numero
di caratteri non riesco a mandare in _segfault_ il mio esempio. Forse tra
randomizzazione dello stack e gestione della memoria da parte dell'OS, andare a
sovrascrivere l'_instruction pointer_ è un impresa per veri duri.

Diciamo che, per essere rigorosi, va comunque controllata la dimensione del
buffer di destinazione, quando ci scrivo dentro dei byte letti dall'ambiente
esterno.

L'errore, che **c'è** e per il quale ringrazio
[@evilsocket](https://twitter.com/evilsocket), risiede nel fatto che la
chiamata getenv() restituisce di già un puntatore (char *).

Di fatto, ho introdotto un memory leak perché il primo puntatore, che ho
inizializzato a zero, viene perso.

Per chi suggeriva infine, andasse fatta una free() sulla variabile envy, prendo
direttamente quello che dice la man page di getenv su macOS.

> The getenv() function obtains the current value of the environment variable,
> name.  The application should not modify the string pointed to by the
> getenv() function.

Quindi, se interpreto bene il manuale, non devo fare una free esplicita di quel
puntatore.

## Off by one

Solo chi non fa, non falla. Poco male, ho sbagliato e ci sta un po' di sana e
pubblica gogna. Dopotutto, è tanto tempo che non scrivo codice C ed
effettivamente sono un po' arrugginito.

Preparatevi però ad un a nuova serie di post periodici, serie che devo
ancora studiare bene ma nella quale metterò un pezzo di codice con un alcune
vulnerabilità. Raccoglierò poi per [email](mailto:paolo@codiceinsicuro), le
risposte al quiz e, il tutto gestito con una ufficiale classifica, i migliori
si aggiudicheranno dei premi, che di volta in volta andremo a mettere in palio.

Enjoy!
