# Shape Collision
&nbsp;  
&nbsp;  
&nbsp;  

```c++
//file: collide-poly.cc
#include "vane.h"   //required
#include <stdio.h>
#define ____    printf("----------------------------------------\n");
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

        using domains = tuple<  //function selector
                            tuple <Rectangle, Ellipse, Polygon>,
                            tuple <Rectangle, Ellipse, Polygon>
                        >;
        //specializations
        void operator() (Rectangle *p, Rectangle *q) { printf("(%-9s %9s) --> fRR\n", p->n, q->n);   }
        void operator() (Rectangle *p, Ellipse   *q) { printf("(%-9s %9s) --> fRE !!\n", p->n, q->n);}
        void operator() (Rectangle *p, Polygon   *q) { printf("(%-9s %9s) --> fRP\n", p->n, q->n);   }
        void operator() (Ellipse   *p, Ellipse   *q) { printf("(%-9s %9s) --> fEE\n", p->n, q->n);   }
        void operator() (Ellipse   *p, Polygon   *q) { printf("(%-9s %9s) --> fEP\n", p->n, q->n);   }
        void operator() (Polygon   *p, Polygon   *q) { printf("(%-9s %9s) --> fPP\n", p->n, q->n);   }
    };
}
using collide_multi_func = vane::multi_func <detail::Fx>;


////////////////////////////////////////////////////////////////////////////////

void test_call_uniformTyped (collide_multi_func *vfunc, Shape *p, Shape *q)
try {
    (*vfunc)( p, q );
}
catch(const std::exception &e) { printf("exception: %s\n", e.what());  }


int main()
{
    collide_multi_func  collide;

    Rectangle  r;
    Ellipse    e;
    Polygon    p;

    printf("%15s%20s\n","real args","fx called");
    test_call_uniformTyped (&collide, &r, &r);
    test_call_uniformTyped (&collide, &r, &e);
    test_call_uniformTyped (&collide, &r, &p);
    test_call_uniformTyped (&collide, &e, &e);
    test_call_uniformTyped (&collide, &e, &p);
    test_call_uniformTyped (&collide, &p, &p);

____
    struct Square : Rectangle { Square() : Rectangle("~SQUARE~") {}; };
    Square  square;

    test_call_uniformTyped (&collide, &square, &e);
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
#define ____    printf("----------------------------------------\n");
using std::tuple;


struct Shape {    const char *n;
                  virtual ~Shape() {}   //polymorphic base is required
                           Shape    (const char *c = "shape"    ) : n(c)     {} };
struct Rectangle : Shape { Rectangle(const char *c = "rectangle") : Shape(c) {} };
struct Ellipse   : Shape { Ellipse  (const char *c = "ellipse"  ) : Shape(c) {} };
struct Polygon   : Shape { Polygon  (const char *c = "polygon"  ) : Shape(c) {} };

using VShape = vane::_virtual<Shape>;


////////////////////////////////////////////////////////////////////////////////
namespace detail {
    //co-class that defines the traits & function set for the multi_func
    struct Fx
    {
        using type    = void (VShape*, VShape*);   //signature of the multi_func

        using domains = tuple<  //function selector
                            tuple <Rectangle, Ellipse, Polygon>,
                            tuple <Rectangle, Ellipse, Polygon>
                        >;
        //specializations
        void operator() (Rectangle *p, Rectangle *q) { printf("(%-9s %9s) --> fRR\n", p->n, q->n);   }
        void operator() (Rectangle *p, Ellipse   *q) { printf("(%-9s %9s) --> fRE !!\n", p->n, q->n);}
        void operator() (Rectangle *p, Polygon   *q) { printf("(%-9s %9s) --> fRP\n", p->n, q->n);   }
        void operator() (Ellipse   *p, Ellipse   *q) { printf("(%-9s %9s) --> fEE\n", p->n, q->n);   }
        void operator() (Ellipse   *p, Polygon   *q) { printf("(%-9s %9s) --> fEP\n", p->n, q->n);   }
        void operator() (Polygon   *p, Polygon   *q) { printf("(%-9s %9s) --> fPP\n", p->n, q->n);   }
    };
}
using collide_multi_func = vane::multi_func <detail::Fx>;



////////////////////////////////////////////////////////////////////////////////

void test_call_uniformTyped (collide_multi_func *vfunc,  VShape *p, VShape *q)
try {
    (*vfunc)( p, q );
}
catch(const std::exception &e) { printf("exception: %s\n", e.what());  }


int main()
{
    collide_multi_func  collide;    //multi_func object

    VShape::of<Rectangle>  r;
    VShape::of<Ellipse>    e;
    VShape::of<Polygon>    p;

    printf("%15s%20s\n","real args","fx called");
    test_call_uniformTyped (&collide, &r, &r);
    test_call_uniformTyped (&collide, &r, &e);
    test_call_uniformTyped (&collide, &r, &p);
    test_call_uniformTyped (&collide, &e, &e);
    test_call_uniformTyped (&collide, &e, &p);
    test_call_uniformTyped (&collide, &p, &p);

____
    struct Square : Rectangle { Square() : Rectangle("~SQUARE~") {}; };
    VShape::of<Square>  square;

    test_call_uniformTyped (&collide, &square, &e);
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
#define ____    printf("----------------------------------------\n");
using std::tuple;



struct Rectangle { const char *n = "rectangle"; };
struct Ellipse   { const char *n = "ellipse";   };
struct Polygon   { const char *n = "polygon";   };


using VShape = vane::varg <Rectangle, Ellipse, Polygon>;


////////////////////////////////////////////////////////////////////////////////
namespace detail {
    //co-class that defines the traits & function set for the multi_func
    struct Fx
    {
        using type    = void (VShape*, VShape*);   //signature of the multi_func

        using domains = tuple<  //function selector
                            tuple <Rectangle, Ellipse, Polygon>,
                            tuple <Rectangle, Ellipse, Polygon>
                        >;
        //specialized functions
        void operator() (Rectangle *p, Rectangle *q) { printf("(%-9s %9s) --> fRR\n", p->n, q->n);   }
        void operator() (Rectangle *p, Ellipse   *q) { printf("(%-9s %9s) --> fRE !!\n", p->n, q->n);}
        void operator() (Rectangle *p, Polygon   *q) { printf("(%-9s %9s) --> fRP\n", p->n, q->n);   }
        void operator() (Ellipse   *p, Ellipse   *q) { printf("(%-9s %9s) --> fEE\n", p->n, q->n);   }
        void operator() (Ellipse   *p, Polygon   *q) { printf("(%-9s %9s) --> fEP\n", p->n, q->n);   }
        void operator() (Polygon   *p, Polygon   *q) { printf("(%-9s %9s) --> fPP\n", p->n, q->n);   }
    };
}
using collide_multi_func = vane::multi_func <detail::Fx>;



////////////////////////////////////////////////////////////////////////////////

void test_call_uniformTyped (collide_multi_func *vfunc,  VShape *p, VShape *q)
try {
    (*vfunc)( p, q );
}
catch(const std::exception &e) { printf("exception: %s\n", e.what());  }


int main()
{
    collide_multi_func  collide;    //multi_func object

    VShape::of<Rectangle>  r;
    VShape::of<Ellipse>    e;
    VShape::of<Polygon>    p;

    printf("%15s%20s\n","real args","fx called");
    test_call_uniformTyped (&collide, &r, &r);
    test_call_uniformTyped (&collide, &r, &e);
    test_call_uniformTyped (&collide, &r, &p);
    test_call_uniformTyped (&collide, &e, &e);
    test_call_uniformTyped (&collide, &e, &p);
    test_call_uniformTyped (&collide, &p, &p);

____
    struct Square : Rectangle { Square() { n = "~SQUARE~"; } };
    VShape::of<Square>  square;

    test_call_uniformTyped (&collide, &square, &e);
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


