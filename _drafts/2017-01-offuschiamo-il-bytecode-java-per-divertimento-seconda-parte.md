---
layout: post
title: "Offuschiamo il bytecode Java per divertimento: seconda parte"
promotion: "Secondo articolo di una serie che mostra come offuscare il bytecode java per divertimento e altro. Creiamo un agent"
modified: 
featured: false
category: [post]
tags: [java, code obfuscation, bytecode, javassist, java agent]
image:
  feature: nebbia.jpg
  credit: Giulio Farella
  creditlink: https://flic.kr/p/7xFUVP
comments: true
share: true
---

Eccoci alla seconda tappa del nostro viaggio verso il bytecode completamente
illeggibile. Nella [prima
parte]({{site.url}}/blog/offuschiamo-il-bytecode-java-per-divertimento-prima-parte/)
abbiamo visto come usare la libreria [javassist](http://www.javassist.org/) per
rinominare la nostra classe, i nostri metodi ed aggiungere del codice
_inutile_, giusto per aumentare l'entropia del nostro bytecode.

Vale sempre quello che ci siamo detti nella prima puntata, ovvero:

> la tecnica di _renaming_ e di _code injection_, alza l'asticella per scremare
> gli script kiddies. Puoi alzare l'asticella quanto vuoi, andando ad iniettare
> più codice, ma un reverser vero impiegherà solo più tempo a capire cosa fa la
> tua classe. L'obiettivo è rendere questo processo non vantaggioso in termini
> di effort.

## La vittima

La vittima è sempre il nostro HelloWorld, il cui codice è il seguente:
{% highlight java %}
public class HelloWorld {
  public final static String sayHello() {
    return "Hello World!";
  }

  public static void main(String[] arg) {
    System.out.println(sayHello());
  }
}
{%endhighlight%}

Compilato, il codice si presenta così:
{% highlight sh %}
00000000  ca fe ba be 00 00 00 34  00 21 0a 00 07 00 12 08  |.......4.!......|
00000010  00 13 09 00 14 00 15 0a  00 06 00 16 0a 00 17 00  |................|
00000020  18 07 00 19 07 00 1a 01  00 06 3c 69 6e 69 74 3e  |..........<init>|
00000030  01 00 03 28 29 56 01 00  04 43 6f 64 65 01 00 0f  |...()V...Code...|
00000040  4c 69 6e 65 4e 75 6d 62  65 72 54 61 62 6c 65 01  |LineNumberTable.|
00000050  00 08 73 61 79 48 65 6c  6c 6f 01 00 14 28 29 4c  |..sayHello...()L|
00000060  6a 61 76 61 2f 6c 61 6e  67 2f 53 74 72 69 6e 67  |java/lang/String|
00000070  3b 01 00 04 6d 61 69 6e  01 00 16 28 5b 4c 6a 61  |;...main...([Lja|
00000080  76 61 2f 6c 61 6e 67 2f  53 74 72 69 6e 67 3b 29  |va/lang/String;)|
00000090  56 01 00 0a 53 6f 75 72  63 65 46 69 6c 65 01 00  |V...SourceFile..|
000000a0  0f 48 65 6c 6c 6f 57 6f  72 6c 64 2e 6a 61 76 61  |.HelloWorld.java|
000000b0  0c 00 08 00 09 01 00 0c  48 65 6c 6c 6f 20 57 6f  |........Hello Wo|
000000c0  72 6c 64 21 07 00 1b 0c  00 1c 00 1d 0c 00 0c 00  |rld!............|
000000d0  0d 07 00 1e 0c 00 1f 00  20 01 00 0a 48 65 6c 6c  |........ ...Hell|
000000e0  6f 57 6f 72 6c 64 01 00  10 6a 61 76 61 2f 6c 61  |oWorld...java/la|
000000f0  6e 67 2f 4f 62 6a 65 63  74 01 00 10 6a 61 76 61  |ng/Object...java|
00000100  2f 6c 61 6e 67 2f 53 79  73 74 65 6d 01 00 03 6f  |/lang/System...o|
00000110  75 74 01 00 15 4c 6a 61  76 61 2f 69 6f 2f 50 72  |ut...Ljava/io/Pr|
00000120  69 6e 74 53 74 72 65 61  6d 3b 01 00 13 6a 61 76  |intStream;...jav|
00000130  61 2f 69 6f 2f 50 72 69  6e 74 53 74 72 65 61 6d  |a/io/PrintStream|
00000140  01 00 07 70 72 69 6e 74  6c 6e 01 00 15 28 4c 6a  |...println...(Lj|
00000150  61 76 61 2f 6c 61 6e 67  2f 53 74 72 69 6e 67 3b  |ava/lang/String;|
00000160  29 56 00 21 00 06 00 07  00 00 00 00 00 03 00 01  |)V.!............|
00000170  00 08 00 09 00 01 00 0a  00 00 00 1d 00 01 00 01  |................|
00000180  00 00 00 05 2a b7 00 01  b1 00 00 00 01 00 0b 00  |....*...........|
00000190  00 00 06 00 01 00 00 00  01 00 19 00 0c 00 0d 00  |................|
000001a0  01 00 0a 00 00 00 1b 00  01 00 00 00 00 00 03 12  |................|
000001b0  02 b0 00 00 00 01 00 0b  00 00 00 06 00 01 00 00  |................|
000001c0  00 03 00 09 00 0e 00 0f  00 01 00 0a 00 00 00 26  |...............&|
000001d0  00 02 00 01 00 00 00 0a  b2 00 03 b8 00 04 b6 00  |................|
000001e0  05 b1 00 00 00 01 00 0b  00 00 00 0a 00 02 00 00  |................|
000001f0  00 07 00 09 00 08 00 01  00 10 00 00 00 02 00 11  |................|
00000200
{%endhighlight%}

Usando [javassist](http://www.javassist.org) ed poche righe di codice, eravamo arrivati a questa versione del nostro bytecode:

{% highlight sh %}
00000000  ca fe ba be 00 00 00 34  00 48 01 00 24 66 33 61  |.......4.H..$f3a|
00000010  62 63 66 32 35 2d 62 30  65 31 2d 34 30 63 34 2d  |bcf25-b0e1-40c4-|
00000020  38 35 63 66 2d 61 61 34  35 62 38 66 30 61 36 65  |85cf-aa45b8f0a6e|
00000030  32 07 00 01 01 00 10 6a  61 76 61 2f 6c 61 6e 67  |2......java/lang|
00000040  2f 4f 62 6a 65 63 74 07  00 03 01 00 06 3c 69 6e  |/Object......<in|
00000050  69 74 3e 01 00 03 28 29  56 01 00 04 43 6f 64 65  |it>...()V...Code|
00000060  01 00 0f 4c 69 6e 65 4e  75 6d 62 65 72 54 61 62  |...LineNumberTab|
00000070  6c 65 0c 00 05 00 06 0a  00 04 00 09 01 00 24 61  |le............$a|
00000080  63 62 37 39 38 39 36 2d  31 63 30 66 2d 34 65 39  |cb79896-1c0f-4e9|
00000090  66 2d 39 63 37 38 2d 63  30 62 33 33 31 34 33 39  |f-9c78-c0b331439|
000000a0  32 65 34 01 00 14 28 29  4c 6a 61 76 61 2f 6c 61  |2e4...()Ljava/la|
000000b0  6e 67 2f 53 74 72 69 6e  67 3b 01 00 10 6a 61 76  |ng/String;...jav|
000000c0  61 2f 6c 61 6e 67 2f 53  74 72 69 6e 67 07 00 0d  |a/lang/String...|
000000d0  01 00 0d 53 74 61 63 6b  4d 61 70 54 61 62 6c 65  |...StackMapTable|
000000e0  01 00 10 6a 61 76 61 2f  6c 61 6e 67 2f 53 79 73  |...java/lang/Sys|
000000f0  74 65 6d 07 00 10 01 00  03 65 72 72 01 00 15 4c  |tem......err...L|
00000100  6a 61 76 61 2f 69 6f 2f  50 72 69 6e 74 53 74 72  |java/io/PrintStr|
00000110  65 61 6d 3b 0c 00 12 00  13 09 00 11 00 14 01 00  |eam;............|
00000120  0e 54 68 69 73 20 69 73  20 73 6f 20 66 6f 6f 08  |.This is so foo.|
00000130  00 16 01 00 13 6a 61 76  61 2f 69 6f 2f 50 72 69  |.....java/io/Pri|
00000140  6e 74 53 74 72 65 61 6d  07 00 18 01 00 07 70 72  |ntStream......pr|
00000150  69 6e 74 6c 6e 01 00 15  28 4c 6a 61 76 61 2f 6c  |intln...(Ljava/l|
00000160  61 6e 67 2f 53 74 72 69  6e 67 3b 29 56 0c 00 1a  |ang/String;)V...|
00000170  00 1b 0a 00 19 00 1c 01  00 0c 48 65 6c 6c 6f 20  |..........Hello |
00000180  57 6f 72 6c 64 21 08 00  1e 03 00 12 c9 6d 01 00  |World!.......m..|
00000190  16 6a 61 76 61 2f 6c 61  6e 67 2f 53 74 72 69 6e  |.java/lang/Strin|
000001a0  67 42 75 66 66 65 72 07  00 21 0a 00 22 00 09 01  |gBuffer..!.."...|
000001b0  00 0f 49 27 6d 20 75 73  69 6e 67 20 6b 65 79 3a  |..I'm using key:|
000001c0  20 08 00 24 01 00 06 61  70 70 65 6e 64 01 00 2c  | ..$...append..,|
000001d0  28 4c 6a 61 76 61 2f 6c  61 6e 67 2f 53 74 72 69  |(Ljava/lang/Stri|
000001e0  6e 67 3b 29 4c 6a 61 76  61 2f 6c 61 6e 67 2f 53  |ng;)Ljava/lang/S|
000001f0  74 72 69 6e 67 42 75 66  66 65 72 3b 0c 00 26 00  |tringBuffer;..&.|
00000200  27 0a 00 22 00 28 01 00  0f 63 72 65 61 74 65 53  |'..".(...createS|
00000210  65 63 72 65 74 4b 65 79  0c 00 2a 00 0c 0a 00 02  |ecretKey..*.....|
00000220  00 2b 01 00 08 74 6f 53  74 72 69 6e 67 0c 00 2d  |.+...toString..-|
00000230  00 0c 0a 00 22 00 2e 01  00 04 6d 61 69 6e 01 00  |....".....main..|
00000240  16 28 5b 4c 6a 61 76 61  2f 6c 61 6e 67 2f 53 74  |.([Ljava/lang/St|
00000250  72 69 6e 67 3b 29 56 01  00 03 6f 75 74 0c 00 32  |ring;)V...out..2|
00000260  00 13 09 00 11 00 33 0c  00 0b 00 0c 0a 00 02 00  |......3.........|
00000270  35 01 00 24 38 33 31 39  63 66 31 63 2d 36 39 38  |5..$8319cf1c-698|
00000280  63 2d 34 61 34 32 2d 38  63 38 63 2d 61 66 35 30  |c-4a42-8c8c-af50|
00000290  38 64 31 39 36 62 62 62  0a 00 0e 00 09 01 00 02  |8d196bbb........|
000002a0  6a 6a 08 00 39 01 00 24  63 30 64 38 66 64 33 30  |jj..9..$c0d8fd30|
000002b0  2d 30 31 64 62 2d 34 39  62 39 2d 38 66 63 61 2d  |-01db-49b9-8fca-|
000002c0  64 64 36 33 30 32 39 62  64 37 34 38 01 00 19 61  |dd63029bd748...a|
000002d0  20 67 72 65 61 74 20 73  74 72 69 6e 67 20 69 6e  | great string in|
000002e0  20 74 68 65 20 73 6b 79  08 00 3c 0c 00 37 00 0c  | the sky..<..7..|
000002f0  0a 00 02 00 3e 01 00 24  34 32 35 62 31 38 61 63  |....>..$425b18ac|
00000300  2d 65 39 64 32 2d 34 64  66 65 2d 39 37 66 63 2d  |-e9d2-4dfe-97fc-|
00000310  30 66 38 30 34 37 31 65  33 38 66 31 01 00 01 49  |0f80471e38f1...I|
00000320  01 00 24 63 66 34 66 38  30 39 66 2d 30 32 63 61  |..$cf4f809f-02ca|
00000330  2d 34 65 36 66 2d 39 64  65 63 2d 39 61 36 66 36  |-4e6f-9dec-9a6f6|
00000340  35 35 39 64 38 33 34 01  00 01 46 01 00 24 35 64  |559d834...F..$5d|
00000350  34 35 32 61 66 39 2d 37  65 64 30 2d 34 30 30 63  |452af9-7ed0-400c|
00000360  2d 38 31 30 39 2d 37 64  64 66 62 36 31 31 65 30  |-8109-7ddfb611e0|
00000370  35 36 01 00 01 5a 01 00  0a 53 6f 75 72 63 65 46  |56...Z...SourceF|
00000380  69 6c 65 01 00 0f 48 65  6c 6c 6f 57 6f 72 6c 64  |ile...HelloWorld|
00000390  2e 6a 61 76 61 04 21 00  02 00 04 00 00 00 03 00  |.java.!.........|
000003a0  00 00 40 00 41 00 00 00  00 00 42 00 43 00 00 00  |..@.A.....B.C...|
000003b0  00 00 44 00 45 00 00 00  05 00 01 00 05 00 06 00  |..D.E...........|
000003c0  01 00 07 00 00 00 1d 00  01 00 01 00 00 00 05 2a  |...............*|
000003d0  b7 00 0a b1 00 00 00 01  00 08 00 00 00 06 00 01  |................|
000003e0  00 00 00 01 00 19 00 0b  00 0c 00 01 00 07 00 00  |................|
000003f0  00 ab 00 05 00 08 00 00  00 67 03 3b 1a 99 00 0b  |.........g.;....|
00000400  b2 00 15 12 17 b6 00 1d  03 3c 1b 03 a0 00 0f 03  |.........<......|
00000410  3d 1c 04 60 3d 84 01 01  a7 ff f2 12 1f a7 00 03  |=..`=...........|
00000420  3a 04 12 20 36 05 15 05  12 20 a0 00 09 03 36 06  |:.. 6.... ....6.|
00000430  a7 00 2e 03 36 07 15 07  10 0a a3 00 24 b2 00 15  |....6.......$...|
00000440  bb 00 22 59 b7 00 23 12  25 b6 00 29 b8 00 2c b6  |.."Y..#.%..)..,.|
00000450  00 29 b6 00 2f b6 00 1d  84 07 01 a7 ff db 19 04  |.)../...........|
00000460  b0 00 00 00 02 00 08 00  00 00 06 00 01 00 21 00  |..............!.|
00000470  03 00 0f 00 00 00 26 00  07 fc 00 0e 01 fc 00 01  |......&.........|
00000480  01 10 44 07 00 0e ff 00  12 00 06 01 01 00 00 07  |..D.............|
00000490  00 0e 01 00 00 fd 00 02  00 01 f9 00 27 00 09 00  |............'...|
000004a0  30 00 31 00 01 00 07 00  00 00 26 00 02 00 01 00  |0.1.......&.....|
000004b0  00 00 0a b2 00 34 b8 00  36 b6 00 1d b1 00 00 00  |.....4..6.......|
000004c0  01 00 08 00 00 00 0a 00  02 00 00 00 07 00 09 00  |................|
000004d0  08 00 09 00 37 00 0c 00  01 00 07 00 00 00 19 00  |....7...........|
000004e0  02 00 01 00 00 00 0d bb  00 0e 59 b7 00 38 4b 12  |..........Y..8K.|
000004f0  3a 4b 2a b0 00 00 00 00  00 09 00 3b 00 0c 00 01  |:K*........;....|
00000500  00 07 00 00 00 1d 00 02  00 01 00 00 00 11 bb 00  |................|
00000510  0e 59 b7 00 38 4b 12 3d  4b b8 00 3f 57 2a b0 00  |.Y..8K.=K..?W*..|
00000520  00 00 00 00 01 00 46 00  00 00 02 00 47           |......F.....G|
0000052d
{%endhighlight%}

Leggermente più grosso come dimensioni rispetto al file originale, ma dal
contenuto offuscato per occhi meno esperti.

Quello che vogliamo fare ora è prendere in pasto un bytecode offuscato e
zippato e mandarlo in esecuzione. Tutto questo con un piccolo refactor del
codice visto fin'ora.

Sposterò tutta la logica dalla classe Erebo, ad un [agente](#). Un agente è una partcolare classe, contenente un metodo, che sarà invocato prima del main della nostra classe

## Off by one

Enjoy it!
