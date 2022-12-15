---
id: 5
title: 'Facciamo behavior-driven development con il C'
date: '2022-04-01T11:16:33+02:00'
author: 'Paolo Perego'
excerpt: "Il Behaviour-driven development, utilizzato spesso nello sviluppo di applicazioni web, è un paradigma che ho conosciuto quando scrivevo codice in Ruby on Rails, lavorativamente una vita fa.\n\nLeggi in questo post, come applicare lo stesso concetto ad un codice scritto in C"
layout: post
guid: 'https://paoloperego.it/2022/03/16/facciamo-behavior-driven-development-con-il-c/'
permalink: /2022/04/01/facciamo-behavior-driven-development-con-il-c/
image: /wp-content/uploads/2022/03/wc6mj0krzgw.jpg
categories:
    - sviluppo
tags:
    - c
    - 'code review'
    - libcheck
    - testing
---

Il [Behaviour-driven development](https://it.wikipedia.org/wiki/Behavior-driven_development), utilizzato spesso nello sviluppo di applicazioni web, è un paradigma che ho conosciuto quando scrivevo codice in [Ruby on Rails](https://rubyonrails.org/), lavorativamente una vita fa.

L’idea alla base è quella di partire scrivendo i casi di test, gli scenari che la nostra applicazione deve soddisfare, descrivendo il comportamento desiderato di una certa porzione di codice. Una volta descritto il comportamento, si inizia l’implementazione fino a quando il caso di test non smetterà di fallire. A quel punto la nostra API avrà il comportamento atteso.

Per mia esperienza personale, introdurre questo modo di fare testing, a progetto già avviato, risulta un po’ difficile, proprio per il concetto stesso del [Behaviour-driven development](https://it.wikipedia.org/wiki/Behavior-driven_development).

Prendiamo [chomp](https://github.com/thesp0nge/chomp) come esempio. [chomp](https://github.com/thesp0nge/chomp) è un’utility scritta in linguaggio C che elimina l’ultimo carattere dallo standard input e stampa il resto sullo standard output.

## Iniziamo dalle fondamenta

Per questo progetto ho utilizzato [libcheck](https://libcheck.github.io/check/doc/check_html/check_toc.html#SEC_Contents), una libreria che permette di scrivere unit test per C.

Andremo a creare una prima alberatura per il nostro codice, mettendo i sorgenti nella directory src e i test nella directory test. Lasciamo nella directory principale del progetto, il file README, il file della licenza, i file principali per gli autotools ed eventualmente il Changelog in futuro.

Spendo una parola per il Changelog. Di solito, per i miei progetti, uso l’approccio suggerito [qui](https://keepachangelog.com/en/1.0.0/). Trovo che il Changelog sia uno strumento fondamentale per la documentazione del proprio progetto e racconti tantissimo ad uno sviluppatore che, magari, vuole aiutarci nel nostro codice.

## Scriviamo i casi di test

Iniziamo scrivendo il Makefile.am, nella directory test, che verrà poi trasformato nel Makefile dagli autotools.

<div class="wp-block-syntaxhighlighter-code ">```
<pre class="brush: cpp; title: ; notranslate" title="">
## Process this file with automake to produce Makefile.in

TESTS = check_chomp
check_PROGRAMS = check_chomp
check_chomp_SOURCES = check_chomp.c $(top_builddir)/src/chomp.h $(top_builddir)/src/chomp.c
check_chomp_CFLAGS = @CHECK_CFLAGS@
check_chomp_LDADD =  @CHECK_LIBS@
```

</div>In questo modo stiamo dicendo che dovrà essere creato un eseguibile, check\_chomp, che dovrà essere costruito attraverso il file check\_chomp.c, contenente i casi di test e dai due sorgenti effettivi, chomp.h e chomp.c.

I flag per il compilatore e per il linker, CHECK\_CFLAGS e CHECK\_LIBS, sono personalizzabili ma hanno comunque dei valori di default forniti dal framework di test.

A questo punto, scriviamo il programma che sarà eseguirà i nostri casi di test: check\_chomp.c.

Il main apparirà così:

<div class="wp-block-syntaxhighlighter-code ">```
<pre class="brush: plain; title: ; notranslate" title="">
int main(void)
{
    int number_failed;

    Suite *s;
    SRunner *sr;

    s = chomp_suite();
    sr = srunner_create(s);

    srunner_run_all(sr, CK_NORMAL);
    number_failed = srunner_ntests_failed(sr);
    srunner_free(sr);
    return (number_failed == 0) ? EXIT_SUCCESS : EXIT_FAILURE;
}
```

</div>Il codice fa veramente poche cose:

- crea una suite di casi di test
- esegue i casi di test
- conta i casi di test che sono falliti per dare un output
- esce

E’ interessante vedere la funzione che crea la suite di casi di test, per farci un’idea di quali siano i “comportamenti” che il nostro codice dovrà avere:

<div class="wp-block-syntaxhighlighter-code ">```
<pre class="brush: plain; title: ; notranslate" title="">
Suite *chomp_suite(void)
{
    Suite *s;
    TCase *tc_core;

    s = suite_create("Chomp");
    tc_core = tcase_create("Core");

    tcase_add_test(tc_core, test_chomp_src_null_string);
    tcase_add_test(tc_core, test_chomp_negative_bytes);
    tcase_add_test(tc_core, test_chomp_too_many_bytes);
    tcase_add_test(tc_core, test_chomp_works_1_byte);
    tcase_add_test(tc_core, test_chomp_works_5_byte);
    suite_add_tcase(s, tc_core);

    return s;
}
```

</div>Il concetto ispiratore di questo modo di sviluppare il codice è quello di scrivere tutti i comportamenti che sono attesi dal software che vogliamo scrivere, prima ancora di averlo scritto.

Noi sappiamo ad esempio, cosa deve succedere se do in input una stringa vuota, andrò quindi a scrivere lo scenario di test:

<div class="wp-block-syntaxhighlighter-code ">```
<pre class="brush: plain; title: ; notranslate" title="">
START_TEST(test_chomp_src_null_string)
{
    char dst[30];
    int ret = chomp(dst, NULL, 1);
    ck_assert_int_eq(ret, -1);
}
END_TEST
```

</div>Andrò poi a modellare il comportamento della funzione chomp(), definita nel file src/chomp.c, che altro non è che la mia API principale, in maniera tale che il caso di test smetta di fallire. In questo modo io avrò rispettato il comportamento atteso.

## Off by one

L’utilità di questo approccio è quella di avere il codice sempre in linea con quello che è il comportamento atteso, magari quello che ho definito con il cliente o con altri team di sviluppo, con il cui codice, la mia API dovrà interagire.

Scrivere gli scenari di test porta sicuramente via un po’ di tempo, ma se pensiamo ai benefici di questo approccio, riusciamo a capire bene come questo tempo speso, sia in realtà un ritorno di investimento in futuro, in termini di robustezza e, perché no, di postura di sicurezza del nostro codice.

Se ti va di condividere la tua esperienza su come affronti il test del codice. In particolare che framework utilizzi, quando scrivi i test case e soprattutto che tipo di codice verifichi, se web o da linea di comando.

Enjoy it!