---
layout: chicchi
title: "Keystore, non solo certificati"
tags: [java, jsp, keystore, database, archivio, 3des]
comments: true
share: true
order: 1
---

Annoso problema. Ho delle informazioni sensibili, magari delle chiavi di
cifratura o delle password applicative e non so dove memorizzarle.

Java, ci mette a disposizione un luogo molto interessante, dove riporre al
sicuro i nostri _secret_: il
[KeyStore](http://docs.oracle.com/javase/6/docs/technotes/guides/security/crypto/CryptoSpec.html#KeystoreImplementation).

Il KeyStore è un file binario, cifrato in maniera simmetrica, solitamente
utilizzato per memorizzare i certificati.

Dalla [documentazione
Oracle](http://docs.oracle.com/javase/6/docs/technotes/guides/security/crypto/CryptoSpec.html),
abbiamo una definizione più ampia dello scopo con cui è stato progettato il
KeyStore:

> A database called a "keystore" can be used to manage a repository of keys and
> certificates. Keystores are available to applications that need data for
> authentication, encryption, or signing purposes.

Ogni applicazione, implementando la classe KeyStore, nel package java.security,
può scegliere 3 diversi formati per il file:

* jks: il formato di default, cifrato con un algoritmo custom dato da Oracle
* jceks: sempre un formato binario, ma con una cifratura più forte, basata su _triple des_
* pkcs12: basato sullo standard [PKCS12](http://www.rsasecurity.com/rsalabs/pkcs) di RSA

## Creiamo il Keystore

Il nostro keystore, non è altro che un file binario, cifrato con una chiave
attraverso un 3DES. Essendo questa, crittografia simmetrica, la stessa chiave
usata per cifrare dovrà essere usata per decifrare il file.

Spostiamo quindi un po' il problema. Usiamo un keystore per memorizzare dei
segreti, ma abbiamo bisogno di un segreto per sbloccare il keystore. Già,
bizzarro. Non storcete però il naso. La chiave del keystore, che a questo punto
è quello che dovete proteggere, può essere:

* passata a runtime in una variabile d'ambiente o a riga di comando
* cablata nel codice, magari offuscato
* letta a runtime all'interno delle operazioni di avvio della vostra
  applicazione

Ogni approccio ha i suoi pro e i suoi contro. Io credo sinceramente che
l'approccio della chiave nel codice, offuscato sia quello più versatile. Ci
sono [molti tool](https://www.owasp.org/index.php/Bytecode_obfuscation) per
rendere il bytecode java difficilmente comprensibile. Attenzione, **nessuno**
di essi offre il 100% di sicurezza contro il reverse.

{% highlight java %}
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;

private static KeyStore createKeyStore(String fileName, String pw) throws NoSuchAlgorithmException, CertificateException, IOException, KeyStoreException {
    File file = new File(fileName);

    final KeyStore keyStore = KeyStore.getInstance("JCEKS");
    if (file.exists()) {
        keyStore.load(new FileInputStream(file), pw.toCharArray());
    } else {
        keyStore.load(null, null);
        keyStore.store(new FileOutputStream(fileName), pw.toCharArray());
    }

    return keyStore;
}
{% endhighlight %}

## Leggo e scrivo dal Keystore

Per salvare un valore nel keystore, utilizzo la classe
[javax.crypto.PBEKeySpec](http://download.oracle.com/javase/6/docs/api/javax/crypto/spec/PBEKeySpec.html),
che offusca il valore garantendo un livello di protezione adeguato per una
password. Ricordiamoci che comunque il keystore è cifrato con triple des.

Raccomando la lettura della [documentazione Oracle, circa il motore Password
Based
Encryption](http://download.oracle.com/javase/6/docs/technotes/guides/security/crypto/CryptoSpec.html#PBEEx).

{% highlight java %}
public static void setKey(String key, String value, String keyStoreLocation, String keyStorePassword) throws Exception {

  SecretKeyFactory factory = SecretKeyFactory.getInstance("PBE");
  SecretKey generatedSecret = factory.generateSecret(new PBEKeySpec(value.toCharArray()));

  KeyStore ks = KeyStore.getInstance("JCEKS");
  ks.load(null, keyStorePassword.toCharArray());
  KeyStore.PasswordProtection keyStorePP = new KeyStore.PasswordProtection(keyStorePassword.toCharArray());

  ks.setEntry(key, new KeyStore.SecretKeyEntry( generatedSecret), keyStorePP);

  FileOutputStream fos = new java.io.FileOutputStream(keyStoreLocation);
  ks.store(fos, keyStorePassword.toCharArray());
}
{% endhighlight %}

Il metodo getKey, recupera la chiave specificata come parametro, dal keystore
con una particolare password.

{% highlight java %}
public static String getKey(String key, String keystoreLocation, String keyStorePassword) throws Exception{

  KeyStore ks = KeyStore.getInstance("JCEKS");
  ks.load(null, keyStorePassword.toCharArray());
  KeyStore.PasswordProtection keyStorePP = new KeyStore.PasswordProtection(keyStorePassword.toCharArray());

  FileInputStream fIn = new FileInputStream(keystoreLocation);

  ks.load(fIn, keyStorePassword.toCharArray());

  SecretKeyFactory factory = SecretKeyFactory.getInstance("PBE");

  KeyStore.SecretKeyEntry ske =
    (KeyStore.SecretKeyEntry)ks.getEntry(key, keyStorePP);

  PBEKeySpec keySpec = (PBEKeySpec)factory.getKeySpec(
      ske.getSecretKey(),
      PBEKeySpec.class);

  char[] password = keySpec.getPassword();

  return new String(password);

}
{% endhighlight %}

Ecco il nostro main che mostra come usare le routine per memorizzare una chiave
nel nostro keystore. A questo punto diventa critica la password con cui
cifriamo il keystore. Non usate _test123_ mi raccomando!

{%highlight java%}
public static void main(String[] args) throws Exception {
  final String  keyStoreFile = "./codiceinsicuro.keystore";
  KeyStore keyStore = createKeyStore(keyStoreFile, "test123");
  setKey("test", "leggi questo blog ogni giorno", keyStoreFile,  "test123");
  System.out.println("Found Key: " + getKey("test", keyStoreFile,  "test123" ));
}
{%endhighlight%}

Questo è il contenuto del nostro keystore. L'unica cosa _in chiaro_, a parte la
chiave "test" è il tipo dell'oggetto memorizzato, java/lang/String.
Sinceramente, accettabile come perdita di confidenzialità.

{%highlight sh%}
$ hexdump -C codiceinsicuro.keystore
00000000  ce ce ce ce 00 00 00 02  00 00 00 01 00 00 00 03  |................|
00000010  00 04 74 65 73 74 00 00  01 53 9d 38 dc ff ac ed  |..test...S.8....|
00000020  00 05 73 72 00 33 63 6f  6d 2e 73 75 6e 2e 63 72  |..sr.3com.sun.cr|
00000030  79 70 74 6f 2e 70 72 6f  76 69 64 65 72 2e 53 65  |ypto.provider.Se|
00000040  61 6c 65 64 4f 62 6a 65  63 74 46 6f 72 4b 65 79  |aledObjectForKey|
00000050  50 72 6f 74 65 63 74 6f  72 cd 57 ca 59 e7 30 bb  |Protector.W.Y.0.|
00000060  53 02 00 00 78 72 00 19  6a 61 76 61 78 2e 63 72  |S...xr..javax.cr|
00000070  79 70 74 6f 2e 53 65 61  6c 65 64 4f 62 6a 65 63  |ypto.SealedObjec|
00000080  74 3e 36 3d a6 c3 b7 54  70 02 00 04 5b 00 0d 65  |t>6=...Tp...[..e|
00000090  6e 63 6f 64 65 64 50 61  72 61 6d 73 74 00 02 5b  |ncodedParamst..[|
000000a0  42 5b 00 10 65 6e 63 72  79 70 74 65 64 43 6f 6e  |B[..encryptedCon|
000000b0  74 65 6e 74 71 00 7e 00  02 4c 00 09 70 61 72 61  |tentq.~..L..para|
000000c0  6d 73 41 6c 67 74 00 12  4c 6a 61 76 61 2f 6c 61  |msAlgt..Ljava/la|
000000d0  6e 67 2f 53 74 72 69 6e  67 3b 4c 00 07 73 65 61  |ng/String;L..sea|
000000e0  6c 41 6c 67 71 00 7e 00  03 78 70 75 72 00 02 5b  |lAlgq.~..xpur..[|
000000f0  42 ac f3 17 f8 06 08 54  e0 02 00 00 78 70 00 00  |B......T....xp..|
00000100  00 0f 30 0d 04 08 8c 57  09 3e 2d 54 1f 4b 02 01  |..0....W.>-T.K..|
00000110  14 75 71 00 7e 00 05 00  00 01 30 51 74 ed 88 de  |.uq.~.....0Qt...|
00000120  09 f4 88 b9 ab 2b 2d 43  87 06 a2 99 c6 9c 0d 6a  |.....+-C.......j|
00000130  4e 00 fe 26 be 06 71 d6  d8 d1 52 a4 ee 90 51 e1  |N..&..q...R...Q.|
00000140  66 7a 66 54 93 07 ea ba  57 85 4e 59 cd 99 b6 af  |fzfT....W.NY....|
00000150  59 60 e9 99 a7 97 dc 7d  8c 52 10 9d a2 ce a9 37  |Y`.....}.R.....7|
00000160  cd b2 bd 6c 38 0c 0d 3a  d9 f6 3f 02 c8 95 e7 16  |...l8..:..?.....|
00000170  34 82 05 be 07 99 46 64  ae f4 da 84 b5 1d cb 25  |4.....Fd.......%|
00000180  7c 75 ee ac d0 49 28 de  1d 55 81 f3 d0 37 9c 57  ||u...I(..U...7.W|
00000190  f1 e4 d4 ef 93 54 55 ab  e8 ad 25 6c 99 3c cd 40  |.....TU...%l.<.@|
000001a0  c8 30 8c 4c 12 47 8a fa  71 a5 bf 13 6c df 86 55  |.0.L.G..q...l..U|
000001b0  2d bf 80 81 45 ed 30 f3  8e b0 a9 c4 28 d6 c0 55  |-...E.0.....(..U|
000001c0  10 05 4b 46 12 02 5e b1  ed 3c 51 6f 78 03 07 35  |..KF..^..<Qox..5|
000001d0  94 f0 cf ec b7 e1 05 27  98 db 17 00 a5 00 bd 9c  |.......'........|
000001e0  5c ce 12 24 c3 67 ec 91  b6 02 0c 19 ff dd 02 cc  |\..$.g..........|
000001f0  4b d6 87 c7 12 07 db 90  b6 8d f9 2e 42 11 f9 92  |K...........B...|
00000200  03 5f ab 24 f6 99 4f a1  e7 7c 39 bf 63 f8 f1 e5  |._.$..O..|9.c...|
00000210  fd 21 9e fc 34 ae 0a f5  f6 20 8a 48 ba 21 89 fa  |.!..4.... .H.!..|
00000220  bf 60 bc a9 11 f2 c2 a4  e7 e8 d7 f2 f1 a8 c2 ed  |.`..............|
00000230  5b df 12 f6 a9 fa 7e 5f  64 35 dc 5d 91 41 d4 75  |[.....~_d5.].A.u|
00000240  53 5e 54 6c 86 e5 f7 18  97 28 75 74 00 16 50 42  |S^Tl.....(ut..PB|
00000250  45 57 69 74 68 4d 44 35  41 6e 64 54 72 69 70 6c  |EWithMD5AndTripl|
00000260  65 44 45 53 74 00 16 50  42 45 57 69 74 68 4d 44  |eDESt..PBEWithMD|
00000270  35 41 6e 64 54 72 69 70  6c 65 44 45 53 4d 5b 3e  |5AndTripleDESM[>|
00000280  40 dd d8 a6 f3 01 6d d8  3f 76 fa a9 5f 16 62 6f  |@.....m.?v.._.bo|
00000290  af                                                |.|
00000291
{%endhighlight%}

## Off by one

Il KeyStore può essere usato per memorizzare delle coppie chiave valore, come
parametri o credenziali. Il tutto deve essere protetto da una password per la
cifratura simmetica dell'archivio utilizzato.

A questo punto, come dicevamo nell'introduzione, non resta che scegliere la
strategia migliore per proteggere quest'unica parola chiave. Per quanto ho
avuto modo di vedere, il KeyStore è un po' sottovalutato come store sicuro per
riporre le credenziali. Perché non integrarlo in Android ed evitare password
memorizzate in file di configurazione?


**Disclaimer**

Il codice è stato preso ed adattato da [questo post su
StackOverflow](http://stackoverflow.com/questions/6243446/how-to-store-a-simple-key-string-inside-java-keystore).
Avevo in mente di cambiare l'algoritmo per l'offuscamento del secret nel
KeyStore, usando AES invece del [Password Based
Encryption](http://download.oracle.com/javase/6/docs/technotes/guides/security/crypto/CryptoSpec.html#PBEEx).
Poi ho preferito lasciar stare, non tanto per pigrizia, visto che per i fatti
miei avevo già le chiamate pronte, ma perché sinceramente non mi dispiace usare
quest'API.

Ho aggiunto il codice per creare il file del KeyStore.

A questo punto, l'evoluzione è memorizzare tutto in una classe ed incorporarla
nei vostri progetti.

{% gist thesp0nge/985cbdbf05c3caa63244 %}

Enjoy it!
