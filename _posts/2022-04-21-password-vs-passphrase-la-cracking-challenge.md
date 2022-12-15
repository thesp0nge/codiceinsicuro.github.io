---
id: 479
title: 'Password vs Passphrase: la cracking challenge'
date: '2022-04-21T18:32:41+02:00'
author: 'Paolo Perego'
excerpt: 'Password cracking challenge: 5 hash da rompere (2 password e 3 passphrase). Quale hash resisterà più a lungo?'
layout: post
guid: 'https://codiceinsicuro.it/?p=479'
permalink: /2022/04/21/password-vs-passphrase-la-cracking-challenge/
neve_meta_sidebar:
    - ''
neve_meta_container:
    - ''
neve_meta_enable_content_width:
    - ''
neve_meta_content_width:
    - '0'
neve_meta_title_alignment:
    - ''
neve_meta_author_avatar:
    - ''
neve_post_elements_order:
    - '["title","meta","thumbnail","content","tags","comments"]'
neve_meta_disable_header:
    - ''
neve_meta_disable_footer:
    - ''
neve_meta_disable_title:
    - ''
spay_email:
    - ''
image: /wp-content/uploads/2022/04/uw_nwjc1mbe.jpg
categories:
    - 'Exploit e dintorni'
    - Riflessioni
tags:
    - gdpr
    - passphrase
    - password
    - 'password cracking'
    - sha256
---

Settimana scorsa [ho scritto un post](https://codiceinsicuro.it/2022/04/16/non-mettete-regole-troppo-complesse-alle-vostre-password/) che su LinkedIN ha creato una vivace discussione.

<iframe allowfullscreen="" frameborder="0" height="698" loading="lazy" src="https://www.linkedin.com/embed/feed/update/urn:li:share:6921032253057724416" title="Embedded post" width="504"></iframe>Come potete vedere, accanto a commenti mirati a promuovere il proprio blog o commenti mirati a provare a rivendere qualche tecnologia proprietaria, la questione su cosa sia meglio tra password e passphrase è dibattuta e non sembra esserci una visione comune.

Per provare a rendere la cosa più interessante, oggi sempre [su LinkedIN ho lanciato](https://www.linkedin.com/posts/paolo-perego_non-mettete-regole-troppo-complesse-alle-activity-6922927684033417216-yz2F?utm_source=linkedin_share&utm_medium=member_desktop_web) una #passwordcrackingchallenge che ripropongo anche qui.

Come algoritmo di hash ho scelto uno sha256 senza usare salt. Le hash sono state generate usando il comando:

<div class="wp-block-syntaxhighlighter-code ">```
<pre class="brush: bash; title: ; notranslate" title="">
$ echo -n "stringa" | sha256sum
```

</div>Come policy per la password ho scelto: almeno 1 maiuscola, almeno 1 numero, almeno un carattere speciale, almeno 8 caratteri mentre per la passphrase ho pescato solo dall’italiano, solo caratteri minuscoli tranne i nomi di persona che sono stati scritti secondo le regole della nostra grammatica, che spero conosciate.

Questi gli hash:

<div class="wp-block-syntaxhighlighter-code ">```
<pre class="brush: bash; title: ; notranslate" title="">
 021911e07fbd55e6480cc9127b6da3cd5a25f57dc47a14213d298dc06a082a4f (Password di 13 caratteri)
f3ddebd7a0379a6626c19c95a068c173734f910c6c32d14936f34ec9a33290d9 (Password di 9 caratteri)
a6fabf6238568215f9f00cc5caad69ec96e46b33fd88e5591fcb502aef58fd44 (Passphrase di 4 parole italiane (frase di senso compiuto))
8345147c1367174a397cfe1e0695871197dc66f7d3c5f6a865f9106a87a34b3e (Passphrase di 4 parole italiane (frase non di senso compiuto))
7791a9337f4fcc36499a7ec123ef3d4c55b94fc1ffcacfc08d9fc1022d8f39e7 (Passphrase di 11 parole italiane (frase di senso compiuto, presa da una canzone))

```

</div>La sfida è, entro il 31 dicembre 2022, vedere quanti hash hanno resistito. Siete liberi di usare qualsiasi mezzo a vostra disposizione.

Mentre scrivevo questo post ho preso una decina di minuti per accompagnare mia figlia a danza e la [prima hash è già caduta](https://www.linkedin.com/feed/update/urn:li:activity:6922927684033417216?commentUrn=urn%3Ali%3Acomment%3A%28activity%3A6922927684033417216%2C6922939189579628544%29):

<div class="wp-block-syntaxhighlighter-code ">```
<pre class="brush: plain; title: ; notranslate" title="">
f3ddebd7a0379a6626c19c95a068c173734f910c6c32d14936f34ec9a33290d9: P4ssw0rd_
```

</div>## Off by one

Lo scopo di questa challenge non è tanto confrontare password e passphrase empiricamente. Il confronto, come vedete dalla hash che è stata trovata, è su segreti che l’utente medio sceglie per via della loro mnemonicità.

Io sono convinto che le passphrase siano una scelta migliore di una parola chiave con astrusi meccanismi di complessità; complessità che è solo per l’utente non certo per un elaboratore per il quale un carattere… è pur sempre un carattere.

Happy cracking!