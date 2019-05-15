---
layout: post
author: thesp0nge
title: "Shellshock, quando il codice è sotto nafta"
modified:
category: [Sicurina]
tags: [code review, opensource, bash, shellshock, exploit, vulnerabilità, heartbleed, cve-2014-6271, cve-2014-6277, cve-2014-7169, cve-2014-7186, cve-2014-7187, c, bad programming habits, variabili globali, codice non mantenuto]
image:
  feature: shell3.png
comments: true
share: true
---

[Un paio di settimane
fa](https://codiceinsicuro.it/blog/shellshock-capitolo-1-la-prova-pratica-che-le-code-review-servono/)
eravamo nel pieno del bubbone #shellshock, tutti ad applicare patch, tutti con
il fiato sul collo del proprio capo da una parte ed un occhio ai bollettini CVE
che sembravano non finire mai dall'altra.

Adesso la calma è tornata su Internet, complice anche la [quarta ondata di leak
di celebrità nude **LINK**](#), torniamo ad uno stato di presunta sicurezza.
Siamo tutti al sicuro fino al prossimo break-in.

Oggi non parliamo dell'exploit, ma parliamo della causa. Perché #shellshock?
Perché la #bash si è rivelata così vulnerabile? [Robert
Graham](http://www.blogger.com/profile/09879238874208877740) ha scritto questo
[bellissimo
post](http://blog.erratasec.com/2014/09/the-shockingly-bad-code-of-bash.html)
che lo spiega nel dettaglio. Io ve lo racconto in italiano cercando, se riesco,
di dare qualche spunto in più. Sappiate che tutti i #kudos vanno a lui.

## Il problema, in breve

Per chi si fosse perso anche il [post dove automatizzo il
test](https://codiceinsicuro.it/blog/shellshock-automatizziamo-il-test/) e in
generale si fosse perso tutte le ultime due settimane di racconti isterici di
script CGI in frantumi, la farò veramente breve.

Bash non sanitizza il codice quando si dichiara una variabile d'ambiente. E'
possibile quindi dichiarare una variabile d'ambiente che contenga una funzione
vuota ed è possibile accodare un comando arbitrario dopo il separatore dei
comandi, il _;_. La shell prende quella dichiarazione, e una volta raggiunto il
separatore lo onora, termina la variabile ed esegue il comando arbitrario per
noi.

Ricordiamoci tutti gli script CGI che ad esempio usano alcuni campi della
richiesta http, questi sono candidati ideali per provare a vedere se il
sysadmin ha aggiornato tutti i pacchetti o meno.

## Entrino gli imputati: le variabili d'ambiente

In questa analisi, sto prendendo in considerazione il codice sorgente nel file
_bash-4.3.tar.gz_ con il seguente checksum.

{%highlight sh %}
$ sha1sum bash-4.3.tar.gz
45ac3c5727e7262334f4dfadecdf601b39434e84  bash-4.3.tar.gz
{%endhighlight%}

Come abbiamo detto il problema è localizzato durante l'inizializzazione delle
variabili d'ambiente.  Le variabili d'ambiente sono inizializzate nel file
_shell.c_, primo imputato in questo processo.

{%highlight sh %}
$ sha1sum shell.c
6073520406d0a091ffe3c5d9c319b1306fabc5b9  shell.c
{%endhighlight%}

Alla linea 1738, abbiamo la chiamata che, **secondo mio gusto personale**,
sarebbe stata più elegante senza quell'ifdef.

{%highlight c%}
#if defined (RESTRICTED_SHELL)
  initialize_shell_variables (shell_environment, privileged_mode||restricted||running_setuid);
#else
  initialize_shell_variables (shell_environment, privileged_mode||running_setuid);
#endif
{%endhighlight%}

Visto che a seconda della definizione della costante RESTRICTED_SHELL cambia
solo un flag passato in or mentre si costruisce il secondo parametro della
chiamata, senza che cambi il prototipo della funzione stessa, sarebbe stato
molto più elegande valorizzare il parametro restricted a 1 o 0 rispettivamente.

Veniamo poi al file variables.c, riga 318 dove è dichiarata la funzione
incriminata.

{%highlight sh %}
$ sha1sum variables.c
bafda97b905da97c2a01ee296bc1522cb6eba8a8  variables.c
{%endhighlight%}

Ci sono la bellezza di 24 variabili globali in questo file. Al mio professore
di programmazione alla Statale, probabilmente non sarebbe mai venuta voglia di
firmarmi il libretto con un codice del genere.

24 variabili globali in un file mi dicono che quel codice è un [PITA](http://en.wiktionary.org/wiki/pain_in_the_ass) da
manutenere e probabilmente a livello di architettura e disegno sono state
seguite strade diverse, in momenti storici diversi e da team di sviluppo
diversi e che per passare informazioni utili alle routine in questo file si è
dovuto ricorrere a 24 variabili condivise per non rompere tutto. Dal mio punto
di vista il commento è _questo codice è attaccato con lo sputo, funziona ma non
sappiamo come_.

{%highlight c%}
extern char **environ;

/* Variables used here and defined in other files. */
extern int posixly_correct;
extern int line_number, line_number_base;
extern int subshell_environment, indirection_level, subshell_level;
extern int build_version, patch_level;
extern int expanding_redir;
extern int last_command_exit_value;
extern char *dist_version, *release_status;
extern char *shell_name;
extern char *primary_prompt, *secondary_prompt;
extern char *current_host_name;
extern sh_builtin_func_t *this_shell_builtin;
extern SHELL_VAR *this_shell_function;
extern char *the_printed_command_except_trap;
extern char *this_command_name;
extern char *command_execution_string;
extern time_t shell_start_time;
extern int assigning_in_environment;
extern int executing_builtin;
extern int funcnest_max;

#if defined (READLINE)
extern int no_line_editing;
extern int perform_hostname_completion;
#endif
{%endhighlight%}

Dalla riga 329 compresa è la fiera dell'aritmentica dei puntatori.

Partiamo con un ciclo for dove incremento l'indice nel punto stesso dove valuto
la condizione per rimanere nel for. Se l'indice fosse cambiato da qualche altra
parte nel codice, avrei avuto un brutto side effect e tanti mal di testa.

{%highlight c%}
for (string_index = 0; string = env[string_index++]; )
{%endhighlight%}

L'indice viene comunque incrementato dopo il test, quindi il fatto di scrivere
il for così o scriverlo nella forma più formalmente corretta, non ha impatti.

{%highlight c%}
for (string_index = 0; string = env[string_index]; string_index++)
{%endhighlight%}

Questo codice, serve data una variabile d'ambiente a cercare il carattere di
'='. Assegno alla variabile c, un indirizzo di memoria che varia ad ogni
iterazione, fino a quando non arrivo al '='.

{%highlight c%}
while ((c = *string++) && c != '=')
      ;
{%endhighlight%}

Ma un'occhiata alla man page di strtok, non gliela vogliamo dare? Sul mio mac,
si parla di un'implementazione basata su [FreeBSD](http://www.freebsd.org) 3.0.
Di sicuro fare un refactor per portare questo ciclo negli anni 2000 poteva
essere una buona idea visto che i mezzi ora ci sono.

{%highlight sh%}
$ man strtok
{%endhighlight%}

La vulnerabilità però è a linea 362. La routeine parse\_and\_execute, definita
nel file evalstring.c alla riga 189, non fa altro che **eseguire** il comando
specificato nel primo parametro, la variabile temp\_string nel nostro caso.

{%highlight c%}
strcpy (temp_string, name);
temp_string[char_index] = ' ';
strcpy (temp_string + char_index + 1, string);

if (posixly_correct == 0 || legal_identifier (name))
  parse_and_execute (temp_string, name, SEVAL_NONINT|SEVAL_NOHIST);
{%endhighlight%}

Il problema è che temp\_string è costruita con delle strcpy che sappiamo essere
insicure by design, in quanto non controllano né la dimensione del buffer di
destinazione prima di eseguire la copia (il 90% dei buffer overflow li vai a
trovare con grep su strcpy & similia), né eventuali caratteri speciali, come il
';' che separa due comandi shell.

Quando temp\_string è passata alla parse\_and\_execute, il valore del comando
da eseguire non è stato validato ed è sotto controllo dell'attaccante che si
può sbizzarrire ad lanciare comandi arbitrari grazie al fatto che nessuno ha
validato il suo input prima di passarlo ad una routine che lancia una shell.

## Off by one

La mancata validazione dell'input è la causa di praticamente il 99% della
magagne con cui combattiamo ogni giorno, dal cross site scripting, al buffer
overflow. I punti dove il nostro codice legge input dall'esterno sono i punti
dove un attaccante può interagire, ne segue che devono essere i punti più
protetti, o quantomeno, i punti dove metto più attenzione. Io non posso
permettermi, in nome di non so quale ottimizzazione, di non validare un input
di un utente prima di memorizzarlo, soprattutto come in questo caso se devo
passarlo in esecuzione ad una shell.

Un'espressione regolare, una strtok o una strchr alla ricerca di ';' avrebbero
mitigato l'attacco con successo con una penalizzazione in termini di tempo di
esecuzione del tutto trascurabile.

Pensaci la prossima volta che leggi input dall'esterno. Vuoi che la prossima
applicazione alla ribalta sia la tua?

Enjoy!
