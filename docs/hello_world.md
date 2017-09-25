# hello_world
&nbsp;  
&nbsp;  
&nbsp;  

<p class='_on_ul'>
Given <b>a set of functions</b>,
determining at runtime which one in the set to call - based on the types of the multiple arguments -
is <strong>multiple dispatch</strong>.
It corresponds to mapping from the possible lists of the argument types to the functions to be called.
Each argument can be assigned the set of the possible types that it can be of. &nbsp; 
In Vane this set of types is named the <strong>type domain of the virtual argument</strong>.
Vane searches the argument type list space confined by the user-given argument type domains,
for the possible functions in the user-given function set, and makes the mapping table at compile time.<br>
Specifying this is through a <strong>co-class</strong> defining three parts:
</p>
<ul>
<li>declaring the type signature of the <b>virtual function</b> as in:   
   <pre class='_code'>using <strong>type</strong> = int(char*, Base1*, Base2&, Base3&&);</pre>
</li>
<li>defining what types each <b>virtual argument</b> can be of, like:   
<pre class='_code'>using <strong>domains</strong> = tuple &lt;domain1, domain2, domain3&gt;;
<i>//where domain1 = tuple &lt;Base1,Drived1,Drived2...&gt;</i>
<i>//      domain2....</i></pre>
</li>
<li>specifing the <b>function set</b> as member operators of the co-class like: &nbsp; &nbsp; &nbsp; <i>//<b>specializations</b></i>
<pre class='_code'>int <strong>operator()</strong> (char*,Base1*,Deived1*,Deive2*){...} 
<i>//and more....</i></pre>
</li>
</ul>
&nbsp;  
&nbsp;  


<p class='_on_ul'>
   Vane has <b>three ways</b> of multi-dispathcing based on the <strong>types of the virtual arguments</strong>.
</p>

- multi-dispaching by **polymorphic** class arguments (by-poly in short)  
  Any argument type of ordinary classes is considered virtual if only it's polymorphic.  
  (to treat it as a non-virtual, wrap it with [**\_static<>**](static.md))  
  slowest
- by **\_virtual<>**-wrapped typed arguments (by-virt)  
  Any argument type of ordinary classes that is wrapped with \_virtual<> is considered virtual if only it's polymorphic.  
  much faster than by-poly.
- by **varg<>**-wrapped typed arguments (by-varg)  
  Any arbitrary (including non-polymorphic or primitive) type of arguments is considered virtual.  
  fastest:  
  - compared with by-virt:
  &nbsp; slightly faster in general (about 15~30%: varies according to the number of virtual arguments),
  	or quite faster when <b>virtual bases</b> are involved (about 40% ~ in most cases - two times).  
  - compared with by-poly:
	  &nbsp; much faster (in general about 5~7 times; &nbsp; and when <b>virtual bases</b> are involved, 10~20 times, mostly more than 15 times).

  But the type domains of the parameters cannot be altered/replaced once established.
&nbsp;  
&nbsp;  
&nbsp;  


#### hello_world's
```c++
//file: collide-poly.cc
#include "vane.h"   //required
#include <stdio.h>
#define ____    printf("\n----------------------------------------");
using std::tuple;



struct Shape {    const char *n;
                  virtual ~Shape() {}   //polymorphic base is required
                           Shape    (const char *c = "shape"    ) : n(c)     {} };
struct Rectangle : Shape { Rectangle(const char *c = "rectangle") : Shape(c) {} };
struct Ellipse   : Shape { Ellipse  (const char *c = "ellipse"  ) : Shape(c) {} };
struct Polygon   : Shape { Polygon  (const char *c = "polygon"  ) : Shape(c) {} };


////////////////////////////////////////////////////////////////////////////////
namespace detail {
    //co-class that defines the traits & function set for the multi_func
    struct Fx
    {
        using type    = void (Shape*, Shape*);   //signature of the multi_func

        using domains = tuple<  //specialization selector
                            tuple <Rectangle, Ellipse, Polygon>,
                            tuple <Rectangle, Ellipse, Polygon>
                        >;
        //specializations
        void operator() (Rectangle *p, Rectangle *q) { printf("\n(%-9s %9s) --> fRR", p->n, q->n);   }
        void operator() (Rectangle *p, Ellipse   *q) { printf("\n(%-9s %9s) --> fRE !!", p->n, q->n);}
        void operator() (Rectangle *p, Polygon   *q) { printf("\n(%-9s %9s) --> fRP", p->n, q->n);   }
        void operator() (Ellipse   *p, Ellipse   *q) { printf("\n(%-9s %9s) --> fEE", p->n, q->n);   }
        void operator() (Ellipse   *p, Polygon   *q) { printf("\n(%-9s %9s) --> fEP", p->n, q->n);   }
        void operator() (Polygon   *p, Polygon   *q) { printf("\n(%-9s %9s) --> fPP", p->n, q->n);   }
    };
}
using collide_multi_func = vane::multi_func <detail::Fx>;


////////////////////////////////////////////////////////////////////////////////

void test_call_uniformTyped (collide_multi_func *vfunc, Shape *p, Shape *q)
try {
    (*vfunc)( p, q );
}
catch(const std::exception &e) { printf("\nexception: %s", e.what());  }


int main()
{
    collide_multi_func  collide;

    Rectangle  r;
    Ellipse    e;
    Polygon    p;

    printf("%15s%20s","real args","fx called");
    test_call_uniformTyped (&collide, &r, &r);
    test_call_uniformTyped (&collide, &r, &e);
    test_call_uniformTyped (&collide, &r, &p);
    test_call_uniformTyped (&collide, &e, &e);
    test_call_uniformTyped (&collide, &e, &p);
    test_call_uniformTyped (&collide, &p, &p);

____
    struct Square : Rectangle { Square() : Rectangle("~SQUARE~") {}; };
    Square  square;

    test_call_uniformTyped (&collide, &square, &e);   //fRE !! -- Rectangle-Ellipse
}


/* output **********************************************************************
      real args           fx called
(rectangle rectangle) --> fRR
(rectangle   ellipse) --> fRE !!
(rectangle   polygon) --> fRP
(ellipse     ellipse) --> fEE
(ellipse     polygon) --> fEP
(polygon     polygon) --> fPP
----------------------------------------
(~SQUARE~    ellipse) --> fRE !!
*/
```

```c++
//file: collide-virt.cc
#include "vane.h"   //required
#include <stdio.h>
#define ____    printf("\n----------------------------------------");
using std::tuple;


struct Shape {    const char *n;
                  virtual ~Shape() {}   //polymorphic base is required
                           Shape    (const char *c = "shape"    ) : n(c)     {} };
struct Rectangle : Shape { Rectangle(const char *c = "rectangle") : Shape(c) {} };
struct Ellipse   : Shape { Ellipse  (const char *c = "ellipse"  ) : Shape(c) {} };
struct Polygon   : Shape { Polygon  (const char *c = "polygon"  ) : Shape(c) {} };

using VirtualShape = vane::_virtual <Shape>;


////////////////////////////////////////////////////////////////////////////////
namespace detail {
    //co-class that defines the traits & function set for the multi_func
    struct Fx
    {
        using type    = void (VirtualShape*, VirtualShape*);   //signature of the virtual function

        using domains = tuple<  //specialization selector
                            tuple <Rectangle, Ellipse, Polygon>,
                            tuple <Rectangle, Ellipse, Polygon>
                        >;
        //specializations
        void operator() (Rectangle *p, Rectangle *q) { printf("\n(%-9s %9s) --> fRR", p->n, q->n);   }
        void operator() (Rectangle *p, Ellipse   *q) { printf("\n(%-9s %9s) --> fRE !!", p->n, q->n);}
        void operator() (Rectangle *p, Polygon   *q) { printf("\n(%-9s %9s) --> fRP", p->n, q->n);   }
        void operator() (Ellipse   *p, Ellipse   *q) { printf("\n(%-9s %9s) --> fEE", p->n, q->n);   }
        void operator() (Ellipse   *p, Polygon   *q) { printf("\n(%-9s %9s) --> fEP", p->n, q->n);   }
        void operator() (Polygon   *p, Polygon   *q) { printf("\n(%-9s %9s) --> fPP", p->n, q->n);   }
    };
}
using collide_multi_func = vane::multi_func <detail::Fx>;



////////////////////////////////////////////////////////////////////////////////

void test_call_uniformTyped (collide_multi_func *vfunc,  VirtualShape *p, VirtualShape *q)
try {
    (*vfunc)( p, q );
}
catch(const std::exception &e) { printf("\nexception: %s", e.what());  }


int main()
{
    collide_multi_func  collide;

    VirtualShape::of<Rectangle>  r;
    VirtualShape::of<Ellipse>    e;
    VirtualShape::of<Polygon>    p;

    printf("%15s%20s","real args","fx called");
    test_call_uniformTyped (&collide, &r, &r);
    test_call_uniformTyped (&collide, &r, &e);
    test_call_uniformTyped (&collide, &r, &p);
    test_call_uniformTyped (&collide, &e, &e);
    test_call_uniformTyped (&collide, &e, &p);
    test_call_uniformTyped (&collide, &p, &p);

____
    struct Square : Rectangle { Square() : Rectangle("~SQUARE~") {}; };
    VirtualShape::of<Square>  square;

    test_call_uniformTyped (&collide, &square, &e);   //fRE !! -- Rectangle-Ellipse
}


/* output **********************************************************************
      real args           fx called
(rectangle rectangle) --> fRR
(rectangle   ellipse) --> fRE !!
(rectangle   polygon) --> fRP
(ellipse     ellipse) --> fEE
(ellipse     polygon) --> fEP
(polygon     polygon) --> fPP
----------------------------------------
(~SQUARE~    ellipse) --> fRE !!
*/
```

```c++
//file: collide-varg.cc
#include "vane.h"   //required
#include <stdio.h>
#define	____	printf("\n----------------------------------------");
using std::tuple;



struct Rectangle { const char *n = "rectangle"; };
struct Ellipse   { const char *n = "ellipse";   };
struct Polygon   { const char *n = "polygon";   };


using VirtualShape = vane::varg <Rectangle, Ellipse, Polygon>;


////////////////////////////////////////////////////////////////////////////////
namespace detail {
	//co-class that defines the traits & function set for the multi_func
	struct Fx
	{
		using type    = void (VirtualShape*, VirtualShape*);   //signature of the virtual function

		using domains = tuple<  //specialization selector
							tuple <Rectangle, Ellipse, Polygon>,
							tuple <Rectangle, Ellipse, Polygon>
						>;
		//specializations
		void operator() (Rectangle *p, Rectangle *q) { printf("\n(%-9s %9s) --> fRR", p->n, q->n);   }
		void operator() (Rectangle *p, Ellipse   *q) { printf("\n(%-9s %9s) --> fRE !!", p->n, q->n);}
		void operator() (Rectangle *p, Polygon   *q) { printf("\n(%-9s %9s) --> fRP", p->n, q->n);   }
		void operator() (Ellipse   *p, Ellipse   *q) { printf("\n(%-9s %9s) --> fEE", p->n, q->n);   }
		void operator() (Ellipse   *p, Polygon   *q) { printf("\n(%-9s %9s) --> fEP", p->n, q->n);   }
		void operator() (Polygon   *p, Polygon   *q) { printf("\n(%-9s %9s) --> fPP", p->n, q->n);   }
	};
}
using collide_multi_func = vane::multi_func <detail::Fx>;



////////////////////////////////////////////////////////////////////////////////

void test_call_uniformTyped (collide_multi_func *vfunc,  VirtualShape *p, VirtualShape *q)
try {
	(*vfunc)( p, q );
}
catch(const std::exception &e) { printf("\nexception: %s", e.what());  }


int main()
{
    collide_multi_func  collide;

	VirtualShape::of<Rectangle>  r;
	VirtualShape::of<Ellipse>    e;
	VirtualShape::of<Polygon>    p;

    printf("%15s%20s","real args","fx called");
	test_call_uniformTyped (&collide, &r, &r);
	test_call_uniformTyped (&collide, &r, &e);
	test_call_uniformTyped (&collide, &r, &p);
	test_call_uniformTyped (&collide, &e, &e);
	test_call_uniformTyped (&collide, &e, &p);
	test_call_uniformTyped (&collide, &p, &p);

____
	struct Square : Rectangle { Square() { n = "~SQUARE~"; } };
	VirtualShape::of<Square>  square;

	test_call_uniformTyped (&collide, &square, &e);   //fRE !! -- Rectangle-Ellipse
}


/* output **********************************************************************
      real args           fx called
(rectangle rectangle) --> fRR
(rectangle   ellipse) --> fRE !!
(rectangle   polygon) --> fRP
(ellipse     ellipse) --> fEE
(ellipse     polygon) --> fEP
(polygon     polygon) --> fPP
----------------------------------------
(~SQUARE~    ellipse) --> fRE !!
*/
```


