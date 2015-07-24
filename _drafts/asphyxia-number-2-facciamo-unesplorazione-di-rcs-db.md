---
layout: post
title: "Asphyxia #2: facciamo un'esplorazione di rcs-db"
promotion: "Iniziamo l'esplorazione di rcs-db. Questa volta non cerchiamo nulla in particolare. Buona caccia, quindi."
modified: 
featured: true
category: [under]
tags: [Asphyxia, rcs-db, worker, Hacking Team, malware, RCS, hacking, ruby, code review]
image:
  feature: hacked-team.png
  credit: The Internet
  creditlink:
comments: true
share: true
---

Nel [primo post della serie
Asphyxia]({{site.url}}/blog/asphyxia-number-1-ma-rcs-installa-immagini-pedopornografiche/),
ci siamo occupati dell'analisi del codice trafugato da [Hacking
Team](http://www.hackingteam.com) per capire se RCS facesse o meno _evidence
planting_, ovvero se ci fosse del codice che generasse prove fasulle sul device
controllato.

La risposta è stata negativa.

Ora spostiamo la nostra attenzione sul repository
[rcs-db](https://github.com/hackedteam/rcs-db). Qui c'è veramente tanto da
analizzare, credo ci resteremo su un po'.

Questa volta non stiamo cercando qualcosa di specifico, quindi il nostro
compito è più arduo. Dobbiamo fare una code review completa, cercare di capire
le componenti dell'architettura, le loro interazioni e le azioni che compiono.

Mi dico da solo... _buona caccia_.

## Le dipendenze

Guardando l'inizio del Gemfile capiamo di trovarci di fronte ad un archivio che
ha una certa età. Il preambolo dei file delle dipendenze dei progetti ruby,
pesca da ```rubygems.org``` in HTTPS anziché in HTTP, già da qualche anno.

L'unico archivio marchiato HackingTeam è
[rcs-common](https://github.com/hackedteam/rcs-common), quello che abbiamo
visto la [scorsa
puntata]({{site.url}}/blog/asphyxia-number-1-ma-rcs-installa-immagini-pedopornografiche/).

{% highlight ruby %}
source "http://rubygems.org"
# Add dependencies required to use your gem here.

gem "rcs-common", ">= 9.2.3", :path => "../rcs-common"

gem 'em-http-request', "=1.0.3" # > 1.0.3 version does not work under Windows
gem 'em-websocket'
gem 'em-http-server', ">= 0.1.7"
{% endhighlight %}

Tutti questi richiami poi ad [Event machine](#) mi danno l'idea che in questo
archivio ci deve essere una parte di comunicazione HTTP, un qualche demone di
sistema che fornisca informazioni all'esterno. Ci torneremo sopra dopo.

Continuando, salta agli occhi che viene usata una versione di
[minitar](https://rubygems.org/gems/minitar) modificata. Visti i dubbi sul
software che stiamo analizzando, la domanda un po' ad effetto è _perché l'hanno
modificata? Cosa hanno cambiato?_.
L'archivio è pubblico, faremo un diff successivamente.

{% highlight ruby %}
# TAR/GZIP compression
gem "minitar", ">= 0.5.5", :git => "git://github.com/danielemilan/minitar.git", :branch => "master"
{% endhighlight %}

L'ultima cosa interessante di questo Gemfile è l'uso di [OpenCV](#) e
l'informazione che gli sviluppatori sono in ambiente Mac OS X, visto che nei
commenti ci sono istruzioni per installare le librerie di sistema con
[homebrew](#).

Viene poi, in qualche modo, utilizzata la libreria per gestire i bitcoin ed un
portafolio, probabilmente per analizzare quello di una vittima una voltra
introdotti nel suo device. Per ora, portiamoci a casa quest'informazione.

{% highlight ruby %}
gem 'ruby-opencv', "~> 0.0.10"
# Install the 2.4.4a version via homebrew, and then launch if your homebrew folder
# is not in the default location, lauch:
# gem install ruby-opencv -v 0.0.10 -- --with-opencv-dir="/Users/username/.homebrew/Cellar/opencv/2.4.4a"
# check this out: http://stackoverflow.com/questions/3987683/homebrew-install-specific-version-of-formula

gem 'sbdb'
# needs some love to compile bdb and tuple under windows
# see scripts/coins/INSTALL

gem 'bitcoin-ruby'
{% endhighlight %}

## Il Rakefile

Il Rakefile di questo archivio è una miniera di informazioni. Dopo un po' di
alias per le varie invocazioni della suite di test, inizia la parte
interessante.

La dipendenza [rcs-common](https://github.com/hackedteam/rcs-common) non viene
distribuita attraverso ```rubygems.org```, abbastanza comprensibile, ma viene
installata da un repository locale che ogni sviluppatore deve avere pronto come
requisito.

{%highlight ruby%}
desc "Install rcs-common gem system wide"
task :rcs_common_gem do
  execute "Installing rcs-common gem system wide" do
    current_path = File.dirname(__FILE__)
    gem_path = File.expand_path(File.join(current_path, '../rcs-common'))
    Dir.chdir(gem_path)
    system("rake protect:install")
    Dir.chdir(current_path)
  end
end
{%endhighlight%}

La gemma viene installata attraverso un task ```protect:install``` dichiarato
all'interno della gemma rcs-common. In particolare, nel file
```rcs-common/tasks/protect.rake``` è dichiarato cosa deve fare
```protect:install```.

{%highlight ruby%}
desc "Build and install an encrypted version of rcs-common into system gems"
  task :install do
    FileUtils.rm_rf("#{LIB_PATH}/../pkg")
    Rake::Task['protect:build'].invoke
    gemfile = Dir["#{LIB_PATH}/../pkg/*.gem"].first
    system("gem install --conservative #{gemfile}")
  end

{%endhighlight%}

Il task protect:install invoca il task protect:build e poi installa la gemma
nel sistema.

La build utilizza [RubyEncoder](https://www.rubyencoder.com) per cifrare i sorgenti che entreranno nella
gemma. Questo accorgimento può significare solamente che questo codice non è,
come avevo ipotizzato prima di scrivere questo post, una dashboard locale ad
HackingTeam. E' il codice che viene distribuito ai clienti di RCS e che serve,
presumibilmente a raccogliere i dati del malware.

{%highlight ruby%}
desc "Build an encrypted version of rcs-common gem into the pkg directory"
task :build do
  begin
    FileUtils.cp_r(LIB_PATH, "#{LIB_PATH}_src")

    # Encoding files
    report("Encoding scripts (use --trace to see RubyEncoder output)") do
      exec_rubyencoder("#{RUBYENC} --stop-on-error --encoding UTF-8 -b- -r --ruby #{RUBYENC_VERSION} \"#{LIB_PATH}/*.rb\"")
    end


    # Copy rgloader to lib folder

    rgpath = "#{LIB_PATH}/rgloader"
    FileUtils.rm_rf(rgpath)
    FileUtils.mkdir(rgpath)

    files = Dir["#{RUBYENCPATH}/Loaders/**/**"]
      # keep only the interesting files (2.0.x windows, macos)
    files.delete_if {|v| v.match(/bsd/i) or v.match(/linux/i)}
    files.keep_if {|v| v.match(/#{RUBYENC_VERSION.gsub('.','')[0..1]}/) or v.match(/loader.rb/) }

    files.each { |f| FileUtils.cp(f, rgpath) }


    # Building the gem

    export_protected = windows? ? "set PROTECTED=1 &&" : "export PROTECTED=1 ;"
    system "#{export_protected} rake build"
  ensure
    # Restore the lib folder
    if Dir.exists?("#{LIB_PATH}_src")
      FileUtils.rm_rf(LIB_PATH) if Dir.exists?(LIB_PATH)
      FileUtils.mv("#{LIB_PATH}_src", LIB_PATH)
    end
  end
end

{%endhighlight%}
desc "Create export.zip assets archive (evidence export)"
task :export_zip do
  execute "Creating export.zip" do
    config_path = File.expand_path('../config', __FILE__)
    target = "#{config_path}/export.zip"
    srcs = "#{config_path}/export.zip.src/"

    FileUtils.rm(target) if File.exists?(target)

    # Note the -D options (do not add directory entries)
    system("cd \"#{srcs}\" && zip -r -D \"#{target}\" .")
  end
end

