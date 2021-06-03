---
layout: post
title: "Getting root: SecureCode"
author: thesp0nge
featured: false
category: [post]
tags: [getting-root, boot2root, offensive, oswe, vulnhub]
image:
   feature: secure_code.jpg
   author_id: @chriscurry92
   author_name: Chris Curry
   author_link: https://unsplash.com/@chriscurry92
   link: https://unsplash.com/photos/j5s_uLajP2o
comments: true
share: true
---

[SecureCode](https://www.vulnhub.com/entry/securecode-1,651/) è una macchina
nuova e particolarmente interessante che potete trovare su [Vuln
Hub](https://www.vulnhub.com).

La macchina è già pronta per essere importata in VirtualBox, tuttavia da
qualche mese sto provando con soddisfazione
[kvm](https://it.wikipedia.org/wiki/Kernel-based_Virtual_Machine#:~:text=Kernel%2Dbased%20Virtual%20Machine%20(KVM,un%20driver%20di%20rete%20paravirtuale.)
quindi devo prima convertire il disco della macchina nel formato qcow2.

{%highlight sh%}
tar xfv SecureCode1.ova
qemu-img convert SecureCode1-disk1.vmdk SecureCode1-disk1.vmdk SecureCode1-disk1.qcow2 -O qcow2
sudo mv SecureCode1-disk1.qcow2 /var/lib/libvirt/images
{%endhighlight%}

Ora posso creare una nuova macchina usando il disco appena convertito.

## Enumeration

