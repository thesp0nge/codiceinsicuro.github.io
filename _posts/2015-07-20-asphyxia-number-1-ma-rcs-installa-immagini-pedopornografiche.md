---
layout: post
author: thesp0nge
title: "Asphyxia #1: ma RCS installa immagini pedopornografiche?"
promotion: "Il software RCS di HackingTeam ha un meccanismo di evidence planting?"
modified: 
featured: false
category: [under]
tags: [Asphyxia, Hacking Team, RCS, evidenze, pedo pornografia, code review, ruby]
image:
  feature: hacked-team.png
comments: true
share: true
---

L'[attacco ad Hacking
Team]({{site.url}}/blog/hackingteam-e-la-storia-del-figlio-del-calzolaio/) ha
lasciato tanti strascichi ed ha aperto tante domande soprattutto tra i non
addetti ai lavori.

Uno dei _j'accuse_ più ricorrenti era quello che, RCS, installava sul computer
della vittima dei file dai nomi riconducibili a video di pedo-pornografia.

L'_evidence planting_ come modo per creare un piano accusatorio contro l'ignaro
ed innocente cittadino intercettato. Vantaggio per HackingTeam, nessuno.
Divertimento per i pennivendoli o i forcaioli dell'ultim'ora, massimo.

Ho ricevuto molte critiche per questo mio pensiero, tuttavia se una persona
compra un software di _offensive security_ e lo usa per infrangere la legge o
causare danni, è lui il responsabile. Questo allo stesso modo con cui io potrei
creare danni bucando con [metasploit](http://metasploit.org) una macchina e
facendo un download con Chrome di un filmato di così bassa lega. Il software è
uno strumento, non ha una coscienza. Il come lo uso dipende dal raziocinio e
dalla morale della persona. Non possiamo accusare chi ha scritto un software di
come lo useranno i propri clienti.

Come credo faccia qualsiasi persona non sessualmente deviata, depreco con forza la
fruizione di contenuti espliciti che riguardano minori (o in generale persone
non consenzienti o non consapevoli che stanno andando in video). Quello che
però voglio capire è, codice alla mano, se quest'accusa mossa ad RCS è fondata
oppure no.

> RCS fa evidence planting?

## L'accusa e lo screenshot

Il fronte del sì si basa compatto su due prove _"inconfutabili"_.

La prima, con i nomi di file.

{%highlight ruby%}
# rcs-common/lib/rcs-common/evidence/file.rb
path = hash[:path] || ["C:\\Utenti\\pippo\\pedoporno.mpg", "C:\\Utenti\\pluto\\Documenti\\childporn.avi", "C:\\secrets\\bomb_blueprints.pdf"].sample
{%endhighlight%}

La seconda, con l'ammissione di colpevolezza: sto creando prove false.

{%highlight ruby%}
# rcs-backdoor/lib/rcs-backdoor
if options[:generate] then
  trace :info, "Creating #{options[:gen_num]} fake evidences..."
  b.create_evidences(options[:gen_num], options[:gen_type])
end
{%endhighlight%}

Ci sono parole chiave che stuzzicano l'immaginario ai più. C'è backdoor, c'è
pedoporno, c'è childporn. C'è anche una stampa che dice che il programma sta
generando delle prove false.

Ora, prendiamo un po' di ossigeno per il nostro stanco cervello. Abbiamo un
malware, un software offensivo, chiamatelo come volete che, prima di creare una
prova falsa per favorire l'incriminazione di un inputato, ce lo dice con un
log? Ma neanche in [CSI:Cyber](https://it.wikipedia.org/wiki/CSI:_Cyber) avreste visto una cosa simile.

## RCS::Common: l'analisi

Ci troviamo nel [repository
rcs-common](https://github.com/hackedteam/rcs-common), all'interno del file
```lib/rcs-common/evidence/file.rb```. Qui troviamo una routine ```content```
nel modulo RCS::FileopenEvidence, così strutturata:

{%highlight ruby%}
def content(*args)
  hash = [args].flatten.first || {}

  process = hash[:process] || ["Explorer.exe\0", "Firefox.exe\0", "Chrome.exe\0"].sample
  process.encode!("US-ASCII")

  path = hash[:path] || ["C:\\Utenti\\pippo\\pedoporno.mpg", "C:\\Utenti\\pluto\\Documenti\\childporn.avi", "C:\\secrets\\bomb_blueprints.pdf"].sample
  path = path.to_utf16le_binary_null

  content = StringIO.new
  t = Time.now.getutc
  content.write [t.sec, t.min, t.hour, t.mday, t.mon, t.year, t.wday, t.yday, t.isdst ? 0 : 1].pack('l*')
  content.write process
  content.write [ 0 ].pack('L') # size hi
  content.write [ hash[:size] || 123456789 ].pack('L') # size lo
  content.write [ 0x80000000 ].pack('l') # access mode
  content.write path
  content.write [ ELEM_DELIMITER ].pack('L')
  content.string
end
{%endhighlight%}

La prima cosa che possiamo notare è che viene violata la convenzione sui nomi
per le classi ruby e relativo filename. Se il file si chiama (dopo lib/)
```rcs-common/evidence/file.rb``` il modulo dovrebbe chiamarsi
RcsCommon::Evidence::File. Anche il nome RCS::FileopenEvidence non è corretto,
in quanto le classi (o i moduli) dovrebbero avere il camelcase quando ci sono
due parole unite, diventando quindi RCS::FileOpenEvidence. Seguendo la naming
convention il file dovrebbe chiamarsi (lib/ escluso)
```rcs/file-open-evidence.rb```

Visto che il mondo ruby, viaggia molto sul concetto di convenzione, per pulizia
direi di non cambiare questo ecosistema di regole non scritte.

Questo file, ```file.rb``` viene richiamato dalla classe contenuta nel file
```lib/rcs-common/evidence.rb```. La classe in questione, RCS::Evidence,
contiene un metodo generate, con un commento molto esplicativo (siamo ala linea
109):

{%highlight ruby%}
# factory to create a random evidence
def generate(type, common_info)
  @name =  SecureRandom.hex(16)
  info = Hash[common_info]
  info[:da] = Time.now.utc
  info[:type] = type

  # extend class on requested type
  extend_on_type info[:type]

  # header
  type_id = EVIDENCE_TYPES.invert[type]
  header = generate_header(type_id, info)
  @binary = append_data(encrypt(header))

  # content
  if respond_to? :generate_content
    content = info.delete(:content)
    chunks = content ? generate_content(content) : generate_content
    chunks.each do | c |
      @binary += append_data( encrypt(c), c.bytesize )
    end
  end
  
  return self
end
{%endhighlight%}

Dal commento sembrerebbe che questo metodo non sia altro che un generatore
random di una evidence. RCS ha molte evidence contenute nel percorso
```evidence/*```, quella incriminata sulla pedo-pornografia è una di queste.

Non è stato rilevato, all'interno del codice esaminato, nulla che richiami il
download di materiale pedo-pornografico dalla rete al fine di incriminare
l'utente del computer target.

RCS::Common, dalle analisi non contiene software in grado di creare o scaricare
dalla rete materiale pedopornografico.

## RCS::Backdoor: l'analisi

Ci spostiamo ora nel repository
[rcs-backdoor](https://github.com/hackedteam/rcs-backdoor). Qui la prima cosa
che salta all'occhio è, oltre al file ```LICENSE.txt``` che, di fatto, ci dice
che questa gemma è opensource (sembra proprio la MIT license), il Rakefile.

Uno dei task è dedicato alla creazione della directory per le prove, nella home
della gemma.

{%highlight ruby%}
desc "Housekeeping for the project"
task :clean do
  execute "Cleaning the evidence directory" do
    Dir['./evidences/*'].each do |f|
      File.delete(f)
    end
  end
end
{%endhighlight%}

Nel file ```backdoor.rb``` nella lib di questa gemma, c'è la classe
RCS::Backdoor::Application che introduce la seconda _prova_ portata
dall'accusa.
Alla riga 179 troviamo il seguente codice:

{%highlight ruby%}
if options[:generate] then
  trace :info, "Creating #{options[:gen_num]} fake evidences..."
  b.create_evidences(options[:gen_num], options[:gen_type])
end
{%endhighlight%}

b è una variabile, istanza della classe RCS::Backdoor:Backdoor istanziata poco
prima. Il ```create_evidence``` è un metodo che serve per generare una prova su
disco.
{%highlight ruby%}
# create some evidences
def create_evidences(num, type = :RANDOM)
  # ensure the directory is created

  FileUtils.rm_rf(@evidence_dir)

  FileUtils.mkpath(@evidence_dir) if not File.directory?(@evidence_dir)
  
  real_type = type
  
  # generate the evidence
  num.times do
    #real_type = RCS::EVIDENCE_TYPES.values.sample if type == :RANDOM
    real_type = [:APPLICATION, :DEVICE, :CHAT, :CLIPBOARD, :CAMERA, :INFO, :KEYLOG, :SCREENSHOT, :MOUSE, :FILEOPEN, :FILECAP].sample if type == :RANDOM
    Evidence.new(@evidence_key).generate(real_type, @info).dump_to_file(@evidence_dir)
  end
end
{%endhighlight%}

Evidence.new potrebbe essere anche uno di quei file, con il nome pedo-porno che
però come da codice della classe che li implementa, non hanno un contenuto.

La classe Application ha poi come compito, quello di salvare in un database
locale una serie di evidenze.

Anche qui, le prove fasulle non sono però _"reali"_, manca il pezzo di codice
che le crea, sono solo dei nomi di file, dei numeri di telefono fake, dei
contatti che forse semanticamente hanno senso, proprio per testare il motore di
RCS, ma che semanticamente non vogliono dire proprio nulla.

## Off by one

Possiamo quindi dire, dopo quest'analisi, che i timori su un possibile utilizzo
di RCS per creare prove _adhoc_ per incriminare ignari contribuenti, sono
infondati.

Se una persona intercettata ha del materiale pedo pornografico sul suo PC è
perché è un depravato, non perché ha RCS a bordo.

Enjoy it!
