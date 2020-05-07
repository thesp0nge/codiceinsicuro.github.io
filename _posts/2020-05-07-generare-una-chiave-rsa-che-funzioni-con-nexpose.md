---
layout: post
title: "Generare una chiave RSA che funzioni con Nexpose"
author: thesp0nge
featured: false
category: [post]
tags: [nexpose, openssl, chiavi private, vulnerability assessment, vulnerability management]
image:
  feature: keys.jpg
comments: true
share: true
---

Per il mio vulnerability management di solito mi faccio aiutare da
[Nexpose](https://www.rapid7.com/products/nexpose/). Lo uso ormai da quasi una
decina d'anni, ha una bella interfaccia API, integrazione con Metasploit e,
anche se la UI non è questo granché, fa decisamente il suo.

## Test autenticati

Nel corso degli anni, ho preso l'abitudine di alternare test blackbox, magari
sul perimetro esterno della mia infrastruttura a test autenticati per avere il
vero stato di salute della macchina.

Questo mi aiuta nel ricondurre il patching dando la giusta priorità alle cose
da fare.

Per fare un test autenticato su macchine Linux, si può creare un utente su ogni
macchina e specificare login e password oppure usare le chiavi ssh per
permettere l'autenticazione del motore di scansione sull'asset.

Seguendo la
[documentazione](https://nexpose.help.rapid7.com/docs/using-ssh-public-key-authentication)
tuttavia, non riuscivo a creare una chiave privata che venisse accettata dal
sistema. Ora, la UI ha evidenti limiti tra cui quello di farmi capire cosa
andava storto.

Guardando il log in nsc/logs/nsc.log ottenevo:

{% highlight java %}
Caused by: com.rapid7.auth.CredentialValidationException: Could not read PEM key
        at com.rapid7.auth.KeyCredentialsConverter.convert(Unknown Source) ~[r7shared.jar:na]
        at com.rapid7.auth.KeyCredentialsConverter.convert(Unknown Source) ~[r7shared.jar:na]
        at com.rapid7.nexpose.credentials.repo.ScanCredentialRepository.getServiceCredentials(Unknown Source) ~[nxshared.jar:na]
        at com.rapid7.nexpose.credentials.repo.ScanCredentialRepository.createCredential(Unknown Source) ~[nxshared.jar:na]
        at com.rapid7.nexpose.credentials.service.ScanCredentialService.createSharedCredential(Unknown Source) ~[nxshared.jar:na]
        at com.rapid7.nexpose.credentials.service.ScanCredentialService$$FastClassBySpringCGLIB$$b7b81974.invoke(<generated>) ~[nxshared.jar:na]
        at org.springframework.cglib.proxy.MethodProxy.invoke(MethodProxy.java:204) ~[spring-core-4.2.4.RELEASE.jar:4.2.4.RELEASE]
        at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.invokeJoinpoint(CglibAopProxy.java:720) ~[spring-aop-4.2.4.RELEASE.jar:4.2.4.RELEASE]
        at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:157) ~[spring-aop-4.2.4.RELEASE.jar:4.2.4.RELEASE]
        at org.springframework.transaction.interceptor.TransactionInterceptor$1.proceedWithInvocation(TransactionInterceptor.java:99) ~[spring-tx-4.2.4.RELEASE.jar:4.2.4.RELEASE]
        at org.springframework.transaction.interceptor.TransactionAspectSupport.invokeWithinTransaction(TransactionAspectSupport.java:281) ~[spring-tx-4.2.4.RELEASE.jar:4.2.4.RELEASE]
        at org.springframework.transaction.interceptor.TransactionInterceptor.invoke(TransactionInterceptor.java:96) ~[spring-tx-4.2.4.RELEASE.jar:4.2.4.RELEASE]
        at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:179) ~[spring-aop-4.2.4.RELEASE.jar:4.2.4.RELEASE]
        at org.springframework.aop.framework.adapter.MethodBeforeAdviceInterceptor.invoke(MethodBeforeAdviceInterceptor.java:52) ~[spring-aop-4.2.4.RELEASE.jar:4.2.4.RELEASE]
        at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:168) ~[spring-aop-4.2.4.RELEASE.jar:4.2.4.RELEASE]
        at org.springframework.aop.interceptor.ExposeInvocationInterceptor.invoke(ExposeInvocationInterceptor.java:92) ~[spring-aop-4.2.4.RELEASE.jar:4.2.4.RELEASE]
        at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:179) ~[spring-aop-4.2.4.RELEASE.jar:4.2.4.RELEASE]
        at org.springframework.aop.framework.CglibAopProxy$DynamicAdvisedInterceptor.intercept(CglibAopProxy.java:655) ~[spring-aop-4.2.4.RELEASE.jar:4.2.4.RELEASE]
        at com.rapid7.nexpose.credentials.service.ScanCredentialService$$EnhancerBySpringCGLIB$$469ef715.createSharedCredential(<generated>) ~[nxshared.jar:na]
        ... 131 common frames omitted
Caused by: java.io.IOException: unrecognised object: OPENSSH PRIVATE KEY
        at org.bouncycastle.openssl.PEMParser.readObject(Unknown Source) ~[bcpkix-jdk15on-1.57.jar:1.57.0]
        at com.rapid7.net.ssh.SSHUtils.readPEMKeyPair(Unknown Source) ~[r7shared.jar:na]

{%endhighlight%}

Cercando su Google, quell'eccezione è dovuta ad chiave RSA con un formato che
vecchie versioni della libreria [Bouncy
Castle](https://bouncycastle.org/java.html) non sono in grado di gestire.

Questa la mia versione di openssl.

{%highlight sh%}
$ openssl version  
OpenSSL 1.1.1f  31 Mar 2020
{% endhighlight %}

Per ovviare a questo problema di formati, ho creato le chiavi non con
ssh-keygen, ma con openssl. Di solito uso una passphrase per sbloccare le mie
chiavi, per questa ragione ho scritto la passphrase in un file di testo e
passato il nome del file come argomento.

{% highlight sh%} 
openssl genrsa -passout file:pass.txt -out chiave_privata 2048
openssl rsa -in chiave_privata -passin file:pass.txt -pubout -out chiave_pubblica.pub
{%endhighlight%}

That's all. Ora la vostra chiave privata in formato PEM verrà accettata da
Nexpose e potrete andare a mettere la chiave pubblica corrispondente nei vari
asset linux che volete scansionare.

## Disclaimer

Questo non è un post sponsorizzato ma se in futuro qualcuno di Rapid7 volesse
farsi recensire, ben venga.

## Io speriamo che me la cyber

Da tre settimane ho lanciato il progetto "Io speriamo che me la cyber", un
canale YouTube (che presto diventerà anche un podcast), dove ogni settimana
pubblico un videeo di qualche minuto per introdurre concetti di sicurezza
informatica a chi non è completamente a digiuno di IT e vuole capirne di più di
questo mondo.

Ti sei già iscritto?

<iframe width="560" height="315" src="https://www.youtube.com/embed/gFuM975LMD8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

