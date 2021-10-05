---
layout: post
title: "Biometria, openSUSE Leap e Lenovo Thinkpad: rivolviamo i problemi"
author: thesp0nge
featured: false
category: [post]
tags: [opensuse, linux, fprintd, setup]
image:
   feature: fingerprint.jpg
   author_id: macroman
   author_name: Immo Wegmann
   author_link: https://unsplash.com/@macroman
   link: https://unsplash.com/photos/5PqBCWUtYbo
comments: true
share: true
---

Ho un portatile [Thinkpad
Lenovo](https://www.lenovo.com/it/it/laptops/thinkpad/p-series/ThinkPad-P15-Mobile-Workstation/p/22WSP15P5N1)
come workstation di lavoro e di recente sono passato da openSUSE Tumbleweed a [openSUSE
Leap](https://get.opensuse.org/leap/).

Per chi non sapesse la differenza tra le due,
[openSUSE Tumbleweed](https://get.opensuse.org/tumbleweed/) è la versione di openSUSE
con pacchetti aggiornati settimanalmente, una rolling che è stabile al punto
giusto. Tuttavia, essendo la mia workstation di lavoro ho preferito optare per
una versione di openSUSE più conservativa.

Purtroppo nel downgrade il lettore di impronte digitali ha smesso di funzionare
a causa di una versione molto vecchia di
[fprintd](https://software.opensuse.org/package/fprintd).

Per fortuna sono a disposizione anche per openSUSE Leap i pacchetti
sperimentali. ![Pacchetti
Sperimentali]({{site_url}}/assets/images/pacchetto_sperimentale.png)

Per installare fprintd dai pacchetti sperimentali ho quindi aggiunto il
repository della mia versione di openSUSE Leap utilizzando zypper:

{% highlight sh %}
zypper addrepo https://download.opensuse.org/repositories/hardware/openSUSE_Leap_15.3/hardware.repo
zypper refresh
zypper in fprintd-pam-1.90.9-lp153.39.2.x86_64 fprintd-1.90.9-lp153.39.2.x86_64 fprintd-lang-1.90.9-lp153.39.2.x86_64
{% endhighlight %}

_Et voilà_

Ora non serve altro che modificare il file ```/usr/lib/systemd/system/fprintd.service```, aggiungendo queste righe:

{% highlight sh %}
[Install]
WantedBy=multi-user.target
{% endhighlight %}

In questo modo potremo abilitare il servizio fprintd ed averlo a disposizione al prossimo boot:

{% highlight sh %}
systemctl enable fprintd
{% endhighlight %}

Enjoy it!
