---
layout: post
title: "Heartbleed - parte 1: la chiacchiera da pub"
modified: 2014-04-18 07:47:31 +0200
category: [attackers, heartbleed]
tags: [heartbleed, cve-2014-0160, vulnerabilità, ssl, openssl, opensource, simple-life, chiacchiere-da-pub]
image:
  feature: heartbleed.jpg
  credit: Jon Åslund
  creditlink: https://www.flickr.com/photos/jooon/
comments: true
share: true
---

Per il primo post di [codiceinsicuro](http://codiceinsicuro.it) invece del
classico e tranquillo "Hello world!" dove si scrivono tanti buoni propositi,
eccomi dentro il vortice dell'[heartbleed bug](http://heartbleed.com/).

A dire la verità i post sull'argomento saranno due: questo, polemico ed un
altro, un po' più tecnologico che analizza il problema e la soluzione.

Perché un post polemico? Perché nell'ordine ho letto:

* la sicurezza del software _opensource_ sarebbe solo presunta;
* il modello di sviluppo _open_ è giunto alla sua fine;
* l'NSA sapeva di questo bug da un paio d'anni ed ha tenuto il mondo all'oscuro.

Arrivato alla terza, ho cercato veramente se qualcuno stesse parlando di
[Matrix](http://it.wikipedia.org/wiki/Matrix_(trilogia)) e quindi mi dovessi
aspettare che un fantomatico architetto in questo momento stesse ricompilando
il kernel di Linux con una backdoor.

Anche se delle 3, l'unica su cui purtroppo devo dire che mi trova d'accordo è
la seconda. Ma non per colpa del modello.

## La sicurezza presunta del software opensource

Ormai è una polemica sterile e vecchia tanto quanto "VI vs Emacs" o "BSD vs
GPL". Il software opensource è più sicuro? E' proprio vero che più occhi vedono
più vulnerabilità?

Se così fosse, come si spiega allora un bug tanto macroscopico lasciato
lievitare 2 anni in una libreria usata ovunque nel mondo?

Il tempo impiegato a chiudere il buco, una volta sollevato il polverone
dovrebbe far tacere tutti. Si parla di ore, manciate. Ci sono software di
vendor blasonati che cadono ad un port scan, eppure sono lì, nelle nostre
enterprise e guai a chi li tocca. Con centinaia di migliaia di euro investiti
in integrazione, è già tanto che funziona... chi ci mette soldi per un progetto
di migrazione?

Il pensiero del sottoscritto è che, non solo il software opensource è più
sicuro di tanta porcheria che le grandi aziende si portano in casa e che usano
per i propri dati critici, ma è anche di una qualità nettamente superiore.

## Il modello che ha fatto il suo tempo per una community che forse non c'è più

[OpenSSL](http://www.openssl.org) è rilasciato in licenza duale ma di
[ispirazione BSD](http://it.wikipedia.org/wiki/Licenze_BSD). Una porzione della
licenza recita:

{% highlight text %}
* THIS SOFTWARE IS PROVIDED BY THE OpenSSL PROJECT ``AS IS'' AND ANY
* EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
* PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE OpenSSL PROJECT OR
* ITS CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
* SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
* NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
* HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
* STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
* ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
* OF THE POSSIBILITY OF SUCH DAMAGE.
{% endhighlight %}

Come a dire, io ho scritto questo codice... funziona, ma te lo do senza
particolari garanzie, se ti serve per cose critiche buttaci un occhio anche tu.

Buttaci un occhio anche tu.

Questo implica due cose fondamentali:

* l'utente medio di openssl (le distribuzioni che lo incorporano nei loro
  pacchetti, o il sysadmin che prepara un server critico, o uno sviluppatore che
  lavora ad un portale) deve avere le competenze necessarie a leggere del codice
  scritto in C
* l'utente medio di openssl deve avere tempo e voglia di mettersi lì a fare una
  code review.

Lo sponsor più grande di
[OpenSSL](http://www.openssl.org/support/acknowledgments.html) è
[Qualys](http://www.qualys.com). Qualys fa application security. Qualys è uno
dei player più importanti di application security. Dov'era Qualys quando hanno
rilasciato la versione con quel bug? Ha fatto una code review? Ha supportato
gli sviluppatori o ha pagato per avere il logo sul sito e dire _hey, io sono
sponsor di openssl_.

IBM e HP sono due player molto importanti nel panorama dell'application
security. Si sono comprate Ounce e Fortify rispettivamente. Si fanno pagare le
licenze fior fior di soldoni ed in ogni conferenze che conta c'è il loro logo
in bella vista. Possibile che il loro impegno si fermi qui?

[Coverity](https://scan.coverity.com/) a grandi lettere dice che ti da gratis
la possibilità di fare review su codice opensource. **Gratis**. Possibile che
nessuno in coverity abbia mai provato a fare una scansione su qualche libreria
base opensource?

Che dire poi di tutti noi? Legioni di persone che si professano paladini della
code review. Quando è stata l'ultima code review fatta su codice opensource al
solo scopo di aiutare la community?

Io non ne ho mai fatta una.

Il problema è che il modello è veramente alla fine perché la community tutta da
per scontato che ci sia qualcun altro a fare quel lavoro, di fatto la community
si sta sgretolando[^1].

Non può esistere che io, professionista di application security, mi accontenti
di usare del software o delle librerie senza verificare se sono solide o no
lato security. E soprattutto, non posso piangere come un'educanda se qualcuno
le buca.

## Tutti ci spiano, nessuno è al sicuro.

Ok, fa molto fico vivere nel terrore che l'NSA ci stia spiando e che stia
aprendo una backdoor proprio sul mio mac in questo momento, mentre sto
scrivendo.
Oddio, magari è veramente così. Tuttavia dire che l'NSA sapeva di questo bug
prima degli altri e l'ha tenuto nascosto è un'ipotesi che tecnicamente sta in
piedi ma buttata lì solamente per strizzare l'occhio al _j'accuse_ senza né
capo, né coda.

L'NSA sapeva di quel bug da due anni? Bhé evidentemente è stata più efficace di
tanti fanfaroni che si riempiono la bocca di compliance o di certifiche ma che
all'atto pratico non saprebbero fare la review di un paio di linee di visual
basic in croce, figuriamoci il C.

I complotti lasciamoli dove stanno. La realtà, signori miei, è che ci ha fatto
molto comodo che un gruppetto di hacker a loro spese mantenessero openssl. Ci
ha fatto comodo ed in barba a tanta retorica sulla community non abbiamo fatto
nulla per aiutare la community stessa ad avere una libreria più sicura.

Magari, prima di invocare l'NSA, sbattiamoci a dare al mondo un software
migliore. E non pensiamo solo a quanto è fico scrivere il nuovo social network
per gli amanti delle azalee se tanto poi un mancato if fa crollare tutto il
castello.

## Off by one

Nasce quindi oggi [codiceinsicuro](http://codiceinsicuro.it) che prende le
ceneri di [armoredcode](http://armoredcode.com) che comunque resta online e per
cose grosse verrà ancora aggiornato sporadicamente.

Ho deciso di aprire un blog in italiano, perché da noi risorse sul web che
parlano di application security come piace a me non ce ne sono.

Prossimamente ancora Heartbleed con un'analisi tecnica e un PoC in ruby su come
testare la vulnerabilità e poi, visto che il mio focus principale è il mondo
Ruby, inizieremo con delle code review periodiche di librerie o framework
importanti.

Enjoy!

[^1]: un'iperbole. Passatemi la boutade, è il primo post tuttavia.
