---
layout: post
title: "Poodle: scacco ad ssl 3.0"
modified:
category: [Under attack]
tags: [ssl, man in the middle, exploit, cve-2014-3566, tls, google, sslv3, heartbleed, beast, poodlebleed, poodlebleed.com, ciphersurfer]
image:
  feature: scacchi.png
  credit: DavideDeNova
  creditlink: https://flic.kr/p/Bsgss
comments: true
share: true
---

Niente, sembra che io non riesca proprio a scrivere l'ultimo post che parla di
#shellshock e del codice della bash che giace nei repository a testimoniare
come si scriveva software negli anni settanta.

Non è stato un anno semplice per [ssl](http://www.openssl.org), [heartbleed
prima](https://codicinsicuro.it/blog/heartbleed-parte-2-chiacchierata-da-pub-ma-tecnica-questa-volta)
ed ora [poodle](https://www.imperialviolet.com/2014/10/14/poodle.html).

I _credits_ vanno a tre persone di [Google](http://www.google.it), Bodo Moller,
Thai Duong e Krzysztof Kotowicz. Potete quindi partire, se volete, con teorie
complottiste a più non posso su #nsa che ci spia, #google che sapeva del bug da
decenni ma non ci ha detto niente perché voleva spiare tutte le email che
mandavamo e cose del genere. Il fondo di verità c'è, ma so che a voi piace
esagerare con la cospirazione.

Per gli altri, il problema è nel protocollo _ssl versione 3.0_ che è vecchio e
decrepito e soppiantato da anni dal TLS. Tuttavia, per assicurare quella
retrocompatibilità che altrimenti _non si sa mai_, molti siti supportano ancora
versioni vecchie dei protocolli ssl.

## Subito la mitigazione

Purtroppo disabilitare SSLv3 potrebbe non essere possibile per ragioni di
compatibilità. TLS per mitigare questo problema deve usare il meccanismo di
fallback **TLS_FALLBACK_SCSV**

Un client che vuole chiedere un downgrade del protocollo deve includere, nella
comunicazione, il valore 0x56, 0x00 (TLS\_FALLBACK\_SCSV) appunto. Il server,
ricevendo questo messaggio, controlla la versione proposta dal client con
quella più alta supportata dal server. Se il server supporta una versione più
alta allora può rifiutare la connessione indicando al client a quale versione
si deve uniformare se vuole instaurare una comunicazione sicura.

Questo meccanismo fa in modo che SSLv3 venga utilizzato solamente nelle
implementazioni _legacy_, probabilmente client il cui codice non è più
mantenuto da decenni.

Lato client, va disabilitato il supporto ad SSLv3 sui browser. Un JS malevolo,
potrebbe sfruttare POODLE forzando il browser vittima a fare un downgrade del
protocollo di comunicazione, quindi **anche** la propria postazione deve essere
adeguatamente protetta.

## Attacco al cifrario

Allora, non mi metterò qui a fare una traduzione del [paper rilasciato e che
descrive poodle](https://www.openssl.org/~bodo/ssl-poodle.pdf). I dettagli
matematici quindi che interessano la vulnerabilità li lascio a chi
brillantemente l'ha scoperta.

Il problema è nei caratteri che vengono passati dal client al server come
_padding_ per ottenere i blocchi della dimensione corretta per l'applicazione
degli algoritmi di cifratura.

POODLE sta appunto per _Padding Oracle On Downgraded Legacy Encryption_.

L'attacco consiste nel variare a piacimento il _padding_, ovvero il numero di
caratteri che il browser accoda alla richiesta per aggiustare le dimensioni dei
blocchi che poi dovranno essere usati dal server, copiandoci dati della
richiesta che si vuole mettere in chiaro, ad esempio dei cookie.

Per come è disegnato il protocollo quando decifra il dato usando la modalità
CBC _(Cipher Block Chaining)_, i byte nel blocco di padding sono messi in XOR
con i byte del blocco che li precede, sotto il controllo dell'attaccante.

L'attaccante quindi può capire se l'ultimo byte dell'ultimo blocco, usato per
il controllo, è corretto se la sua richiesta viene ritenuta valida dal server.
Le probabilità di indovinare il valore di un byte è di 1 su 256.

Questo porta l'attaccante a riuscire a mettere in chiaro n byte con in media
256xn richieste.

## ciphersurfer

[ciphersurfer](https://github.com/thesp0nge/cipherfurfer) è un tool in ruby che
ho scritto un paio di anni fa per valutare la qualità della configurazione SSL
di un server sulla base dei protocolli e dei cifrari supportati.

La teoria alla base del tool è il [documento di
SSLabs](https://www.ssllabs.com/downloads/SSL_Server_Rating_Guide_2009.pdf). Lo
scopo era anche realizzare i controlli descritti nella [Owasp Testing
guide](https://www.owasp.org/index.php/Testing_for_SSL-TLS_(OWASP-CM-001\)). In
questo caso, i test sono quelli della guida v3.

Ieri ho modificato il tool affinché fosse disponibile il controllo se un server
è vulnerabile a POODLE.

Testare se un host è vulnerabile a POODLE è veramente semplice. Basta creare
una richiesta HTTP, forzando la versione del protocollo da usare ad SSLv3. Se
il server risponderà alla mia GET allora significa che supporta SSLv3 e quindi
è vulnerabile. Se ottengo un errore SSL allora non è vulnerabile.

{%highlight ruby %}
def self.poodle?(host, port)
  request = Net::HTTP.new(host, port)
  request.use_ssl = true
  request.verify_mode = OpenSSL::SSL::VERIFY_NONE
  request.ssl_version = :SSLv3
  begin
    response = request.get("/")
    return true
  rescue OpenSSL::SSL::SSLError => e
    return false
  rescue
    return false
  end
end
{%endhighlight%}

Nello script, ho aggiunto il supporto al nuovo flag da linea di comando e poi
questo codice per onorarlo.
{%highlight ruby %}
if (options[:poodle])
  if Ciphersurfer::Scanner.poodle?(host, port)
    puts "[!] #{target} is vulnerable to POODLE attack. Please remove SSLv3 support"
  else
    puts "[*] #{target} does not support SSLv3"
  end
  exit
end
{%endhighlight%}

Per eseguire il test, basta specificare l'host da attaccare con il flag -P. In
realtà _attaccare_ è un po' tirato come termine, visto che in fondo viene fatta
solo una GET in HTTPS, quindi a conti fatti non è tutto questo grande attacco.

{%highlight sh %}
$ ciphersurfer -P gmail.com:443
[*] gmail.com:443 does not support SSLv3
$ ciphersurfer -P hubmiur.pubblica.istruzione.it:443
[!] hubmiur.pubblica.istruzione.it:443 is vulnerable to POODLE attack. Please remove SSLv3 support
{%endhighlight%}

## Off by one

Questa volta i media nostrani ne hanno parlato poco, forse perché [il logo di
poodlebleed](http://poodlebleed.com) è meno affascinante di quello di
heartbleed, anzi... è tutto sgranato, si vede che è una cosa fatta proprio alla
buona.

In realtà SSLv3 è stato deprecato da una quindicina d'anni, quindi in teoria
non dovrebbe avere un grosso impatto come vulnerabilità. Tuttavia sappiamo bene
il mondo IT, tra un _chi non fa non falla_ e un _si ma se lo disabilito poi
funziona? Meglio non rischiare_, tutto è rimasto invariato per anni ed SSLv3 è
ancora lì, configurato su alcuni web server in attesa di essere bucato.

Enjoy it!
