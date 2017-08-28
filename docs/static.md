# \_static<>----===================
&nbsp;  
&nbsp;  
&nbsp;  
When declaring the **type signature of a virtual_func**,
any polymorphic classe/struct type is considered virtual.
To treat a polymorphic type as a non-virtual, wrap it with **```_static<>```** in the declaration as in:


<pre class='_code'>using type = void (<strong>_static&lt;Base&&gt;</strong>, Base*);</pre>
only the Base* is considered virtual.


&nbsp;  
&nbsp;  

Consecutive ```_static<>'s``` can be combined into one:


<pre class='_code'>void (<strong>_static&lt;Base&&gt;</strong>, <strong>_static&lt;Base*&gt;</strong>, <strong>_static&lt;Base2&&&gt;</strong>, Base*);</pre>
is equivalent to
<pre class='_code'>void (<strong>_static&lt;Base&, Base*, Base2&&&gt;</strong>, Base*);</pre>

&nbsp;  
&nbsp;  


For non-polymorphic or primitive types that are considered non-virtual, ```_static<>``` has no effect.  
<code>void (<strong>_static&lt;int&gt;</strong>)</code> &nbsp; is equivalent to &nbsp; ```void (int)```   
and also


<pre class='_code'>void (<strong>_static&lt;Base&&gt;</strong>, int, <strong>_static&lt;Base&&gt;</strong>, Base*);
<i>//is equivalent to</i>
void (<strong>_static&lt;Base&, int, Base2&&&gt;</strong>, Base*);</pre>






