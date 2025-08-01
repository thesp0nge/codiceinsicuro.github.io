---
layout: post
title:
  "Programmazione Difensiva: Chiudere la Finestra su una Race Condition Critica"
author: thesp0nge
featured: false
category: [post]
tags:
  [
    Programmazione Difensiva,
    Race Condition,
    Secure Coding,
    TOCTOU,
    Python,
    Sicurezza Linux,
    Application Security,
    Pentesting,
    Vulnerability Analysis,
    Sicurezza Informatica,
    umask,
  ]
image:
  feature: race_condition_resized.jpg
  author_id:
  author_name:
  author_link:
  link:
comments: true
share: true
---

La programmazione difensiva è una filosofia di sviluppo che si basa su un
principio semplice ma fondamentale: scrivere codice che sia robusto e sicuro
anche quando opera in condizioni impreviste o in un ambiente potenzialmente
ostile. Invece di fidarsi che tutto sia configurato perfettamente, il codice
prende la responsabilità della propria sicurezza.

Pochi esempi illustrano l'importanza di questo approccio come una race condition
critica durante l'avvio di un servizio. Analizziamo come una mentalità difensiva
possa "chiudere la finestra" su una di queste vulnerabilità fugaci ma
devastanti.

## Un passaggio di privilegi un po' leggero

Molti servizi di sistema seguono un pattern comune: si avviano con privilegi
elevati (come root) per eseguire operazioni critiche (come creare una directory
in /run), per poi abbandonare tali privilegi e continuare a funzionare come un
utente con poteri limitati (service-user).

Senza un approccio difensivo, il codice potrebbe apparire così:

```Python
# Il servizio parte come root
resource_dir = "/run/my-service"

# 1. Viene creata una directory, fidandosi dei permessi di default del sistema
if not os.path.isdir(resource_dir):
    os.makedirs(resource_dir)

# 2. La proprietà viene cambiata, ma la finestra di vulnerabilità si è già aperta
uid = get_user_id("service-user")
os.chown(resource_dir, uid, get_group_id("service-user"))

# ... Il servizio continua a girare come 'service-user'
```

Il problema qui è la fiducia implicita. Il codice si fida che la umask di
default del sistema sia sicura. Se non lo è (ad esempio è 0000 o 0002 su un
sistema mal configurato), la directory viene creata per un istante come
scrivibile da chiunque (world-writable). Quando scrivo codice me ne devo curare?
Beh, se stai facendo programmazione difensiva, e leggendo questo blog è proprio
quello che ti porterò a fare, sì te ne devi preoccupare. Il tuo codice deve...
anzi, sarà resiliente quanto più possibile a configurazioni non robuste
dell'ambiente circostanze.

Quanto più possibile... per i miracoli ci attrezzeremo poi.

## Impatto: da una piccola finestra ad un takeover

Un utente malintenzionato locale può sfruttare questa minuscola finestra
temporale per creare un file o, peggio, un link simbolico all'interno della
directory. Questo punto d'appoggio può essere usato per lanciare attacchi più
gravi:

- Denial of Service (DoS): Bloccando la creazione del socket di comunicazione
  del servizio.

- Hijacking dell'IPC: Intercettando e manipolando la comunicazione interna
  dell'applicazione.

- Cross-Site Scripting (XSS): Iniettando dati malevoli che vengono poi serviti
  dall'API web a un amministratore.

## Come la riscriverei

Un po' come nei migliori piani, la programmazione difensiva non lascia la
sicurezza al caso. Invece di sperare in una umask sicura, la impone. Il codice
prende il controllo e chiude la finestra di vulnerabilità.

```Python
# Nel codice di setup del demone
resource_dir = "/run/my-service"

if not os.path.isdir(resource_dir):
    original_umask = -1
    try:
        # DIFESA 1: Impone una umask restrittiva, ignorando quella di sistema.
        original_umask = os.umask(0o077) # Permessi solo per il proprietario

        # DIFESA 2: Crea la directory con permessi espliciti e sicuri.
        os.makedirs(resource_dir, 0o700) # Permessi rwx------
    finally:
        # Ripristina sempre la umask originale per non alterare il sistema.
        if original_umask != -1:
            os.umask(original_umask)

# Ora, con la directory creata in modo sicuro, si può procedere con il chown.
# ...
```

Con questa modifica, il codice non si fida più dell'ambiente. Garantisce esso
stesso che la risorsa sia creata in modo sicuro fin dal primo istante. La
finestra è stata chiusa.

Questo è il cuore della programmazione difensiva: non chiedere "il sistema è
sicuro?", ma affermare "questa porzione di codice è sicura, a prescindere dal
sistema".

## Off by one

Siamo tornati finalmente. Sono passati poco più di due anni dall'ultimo post e
finalmente sono tornato.

Se mi hai seguito, sui vari social, sai che mi sono dedicato tanto al
[canale YouTube](https://www.youtube.com/@PaoloPerego) e a tanti audit per
rendere [openSUSE](https://get.opensuse.org) ancora più sicura.

Ora però sono tornato a produrre contenuti scritti, non sarà un'apparizione
sporadica, sento veramente molta voglia e molta energia attorno a questo
progetto che ho accantonato per un po'.

Non vedo l'ora di raccontarti cosa è successo lo scorso giugno a Norimberga,
all'[openSUSE conference](https://www.linkedin.com/posts/paolo-perego_la-mail-tanto-attesa-%C3%A8-arrivata-a-giugno-activity-7325830513800167424-iuZ5/?originalSubdomain=it),
di parlarti dei nuovi tool che sto scrivendo e di tante altre cose.

Intanto ti lascio qui sotto tutti i modi con cui puoi stare in contatto con me.

📝 [codiceinsicuro.it](https://codiceinsicuro.it) - articoli approfonditi e
tecnici su sicurezza, vulnerabilità, best practices di sviluppo sicuro, ecc

📣 [@thesp0nge](https://bsky.app/profile/thesp0nge.bsky.social) e il canale
telegram [paoloperegoofficial](https://t.me/paoloperegoofficial) - aggiornamenti
rapidi, condivisione di risorse, interazioni con altri esperti e la community

✉️ [la newsletter di CodiceInsicuro](https://codiceinsicuro.it/newsletter/) -
per articoli professionali, case study e aggiornamenti sul mio lavoro e
progetti.

📽️ [il mio canale YouTube](https://www.youtube.com/@PaoloPerego) - per video
tutorial, webinar, conferenze e demo dal vivo

⌨️ [il mio repo Github](https://github.com/thesp0nge/) - per condividere
progetti open source, script di sicurezza, strumenti e risorse pratiche.

Enjoy it!
