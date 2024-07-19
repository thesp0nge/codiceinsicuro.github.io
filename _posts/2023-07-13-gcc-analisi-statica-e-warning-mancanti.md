---
layout: post
title: "GCC, analisi statica e warning mancanti"
author: thesp0nge
featured: false
category: [post]
tags: [buffer overflow, analisi statica, gcc, c]
image:
   feature: detective.jpg
   author_id: kirklai
   author_name: 𝓴𝓘𝓡𝓚 𝕝𝔸𝕀
   author_link: https://unsplash.com/it/@kirklai
   link: https://unsplash.com/it/foto/6Ptwy-nDnoE
comments: true
share: true
---

Eh già... in questi mesi ho dato anima e corpo al [canale YouTube](https://www.youtube.com/c/PaoloPerego) ed ho trascurato un po' il mio blog. Questa però è una delle cose che voglio prima raccontare qui, nella mia versione digitale di un [Bullet Journal](https://bulletjournal.it/che-cose-il-bullet-journal/).

Il nostro amato [GCC](https://gcc.gnu.org/), ha un'opzione che fa eseguire un'analisi statica del codice sorgente che sta compilando.

Specificando il flag ```-fanalyzer``` durante la compilazione, si attivano tutta una serie di controlli che dovrebbero aiutare chi fa code review, a trovare [vulnerabilità nel codice sorgente](https://gcc.gnu.org/onlinedocs/gcc/Static-Analyzer-Options.html).

## Cosa possiamo trovare?
Vedendo [la lista dei controlli che è possibile attivare](https://gcc.gnu.org/onlinedocs/gcc/Static-Analyzer-Options.html), sembra che la maggior parte dei test sia collegata a errori nella gestione della memoria, errori nella deallocazione delle risorse e alcuni relativi ai buffer overflow, croce e delizia di tutti noi che speriamo in un ```SIGSEGV```.

Settimana scorsa ho fatto partire una nuova iniziativa sul mio spazio LinkedIN: [_Spot the vuln_](https://www.linkedin.com/posts/paolo-perego_spotthevuln-awareness-safecoding-activity-7083024430750142464-NT9Q?utm_source=share&utm_medium=member_desktop) . 
_Spot the vuln_ non è altro che una serie di post con un codice sorgente **semplice**, contenente una vulnerabilità. L'idea è quella di parlare di sicurezza, sviluppo e sensibilizzare su quanto possa essere complesso rivedere del codice.

Sto divagando.

## Compilatore, pensaci tu!

Ho quindi usato il codice sorgente che ho usato per il primo Spot the vuln, chiedendo a GCC di farmi un'analisi statica al momento della compilazione.

Mi sono detto: 
> <<Sicuramente si accorgerà che sto passando a quella funzione una stringa troppo grossa e quando proverò a fare la strcpy() riceverò un warning durante la compilazione.>>

Ecco: nulla di tutto questo. Il compilatore ha compilato il sorgente senza un warning alcuno, mi ha creato un file a.out che, quando ha ricevuto in input una stringa troppo grande è stato termianto con un ```SIGSEGV```.

A quel punto, ho provato a pensare:
> <<Forse il passaggio ad una funzione, manda un po' in confusione il compilatore. Proviamo a rendergli le cose più semplici.>>

## Test
Ho scritto quindi, questo codice sorgente, nella speranza di ricevere un warning, un singolo warning mentre veniva compilato.

``` c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>


int main() {
    char *a = malloc(10);
    char b[50];
    
    if (a == NULL)
        return -1;
    
    scanf("%s", b);
    printf("%s\n", b);
    strcpy(a, b);
    return 0;
}
```

Il null check in riga 10 è stato inserito perché, **effettivamente**, il GCC ti avvisa che, nel caso la malloc() dovesse fallire, tu stai deferenziando un puntatore NULL. 
Tutto questo compilando semplicemente con ```gcc -fanalyzer file.c```.
Introdotto il controllo in riga 10, secondo voi ho ricevuto un warning sulla strcpy() in riga 15?
**NO**. Ovviamente, il programma, a fronte di un input molto grande, riceve un errore di segmentazione e viene terminato.

> Attenzione, non state sovrascrivendo il vostro Instruction Pointer grazie ai numerosi meccanismi di protezione per gli exploit che sfruttano i buffer overflow. Questa parte, legata al mondo offensive, è out of scope per il momento.

Ho provato quindi a non lasciare l'input dinamico ma a copiare una stringa hardcoded di grandi dimensioni.
``` c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>


int main() {
    char *a = malloc(10);
    char b[50];
    
    if (a == NULL)
        return -1;
    strcpy(b, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    printf("%s\n", b);
    strcpy(a, b);
    return 0;
}
```

**BOOM**. Il compilatore mi avvisa che ci potrebbe essere un buffer overflow ma non sulla strcpy tra le due variabili, ma nella strcpy() in linea 12, quella dove copio in b la stringa _hardcoded_. 

In effetti mi sono reso conto di aver messo anche lì troppe "A", una volta rientrato nei 49 caratteri, il warning è sparito e con esso il crash del programma.
La strcpy() in linea 14, dove una stringa di 49 caratteri è stata copiata in un'area di memoria allocata per contenerne 10 non ha causato problemi a runtime.

Qualche considerazione:
1. Il GCC di fatto non ha sbagliato. Il programma non ha risentito di questa copia così "allegra" di dati
2. Dal punto di vista di chi fa code review questo comportamento è pericoloso. Nel primo esempio, dove l'input è dinamico abbiamo il crash dell'applicazione, nel secondo caso proabilmente 49 caratteri non bastano per mandare in crash, ma sto di fatto realizzando un overflow, dovrebbe secondo me essere segnalato dal compilatore. Dopotutto sono solo warning.
3. In effetti la funzione di analisi statica funziona: la strcpy() di linea 12 veniva indicata come sofferente di un buffer overflow quando le mie "A" erano troppe.

## Off by one
Concludendo questo primo esperimento, possiamo tirare qualche conclusione. Sicuramente per alcune categorie di vulnerabilità, GCC può essere un primo passo, ma...

Per i buffer overflow è preciso nel rilevare la vulnerabilità quando l'array è dichiarato staticamente, nello stack. Per variabili dichiarate nello heap, attraverso la malloc, non è così sofisticato da fare un po' di inferenza e dire che stiamo un po' giocando col fuoco.

Vi lascio anche [un po' di risorse free su Code Review](https://www.linkedin.com/posts/gabriellebotbol_cybersecurity-cybersaezcuritaez-pentest-activity-7085211260232814592-5d5p?utm_source=share&utm_medium=member_desktop). Possono essere un buon punto per partire nel vostro viaggio nella parte di sicurezza offensiva più legata al codice sorgente.

Enjoy it.

