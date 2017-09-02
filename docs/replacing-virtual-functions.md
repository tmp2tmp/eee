# replacing virtual functions
&nbsp;  
&nbsp;  
&nbsp;
#### open methods as member functions
&nbsp;  
&nbsp;  
&nbsp;



```c++
//file: switch-collide-poly.cc
#include "vane.h"   //required
#include <stdio.h>
using std::tuple;


/* inheritance hierarchy

           / Rectangle
    Shape +- Ellipse
           \ Polygon

    ShapeCollision +- _CollisionFx_early - _CollisionFx_later
                    \ _CollisionFx_third
*/


struct Shape {
    virtual ~Shape() {}   //polymorphic base is required
    Shape(const char *c = "shape") : name(c) {}
    const char *name;
};



struct ShapeCollision
{
    using type = void (Shape*, Shape*);  //signature of the virtual function

    void print(Shape *p, Shape *q, const char *tag) {
        printf("(%-9s %9s) --> %s-%s\n", p->name, q->name, api_version, tag);
    }

    const char *api_version;
    ShapeCollision(const char *version) : api_version(version) {}
};

using virtual_collide_func = vane::virtual_func <ShapeCollision::type>;






////////////////////////////////////////////////////////////////////////////////
//the early api
struct Rectangle : Shape { Rectangle(const char *c = "rectangle") : Shape(c) {} };
struct Ellipse   : Shape { Ellipse  (const char *c = "ellipse"  ) : Shape(c) {} };


namespace detail {
    struct _CollisionFx_early : ShapeCollision
    {
        //note: 'type' is inherited
        using domains = tuple <  //function selector
                        tuple <Rectangle, Ellipse>,
                        tuple <Rectangle, Ellipse>
                        >;
        _CollisionFx_early (const char *version="early api") : ShapeCollision(version) {}

        //specializations
        void operator() (Rectangle *p, Rectangle *q) { print(p,q, "fRR"); }
        void operator() (Ellipse   *p, Ellipse   *q) { print(p,q, "fEE"); }
        void operator() (Rectangle *p, Ellipse   *q) { print(p,q, "fRE"); }
    };
}
using early_collide_func = vane::multi_func <detail::_CollisionFx_early>;



//new_api - slightly different api
namespace detail {
    struct _CollisionFx_later : _CollisionFx_early
    {
        //note: 'type', 'domains' are inherited
        _CollisionFx_later (const char *version="Later api") : _CollisionFx_early(version) {}

        //specializations:
        using _CollisionFx_early::operator();
        void operator() (Rectangle *p, Ellipse   *q) { print(p,q, "fRE -modified"); }
        void operator() (Ellipse   *p, Rectangle *q) { print(p,q, "fER -added"); }
    };
}
using later_collide_func = vane::multi_func <detail::_CollisionFx_later>;





////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//3rd_api - very different api
struct Polygon : Shape { Polygon (const char *c = "polygon") : Shape(c) {} };


namespace detail {
    struct _CollisionFx_third : ShapeCollision
    {
        //note: 'type' is inherited
        using domains = tuple <       //note: different domains than the formers
                        tuple <Rectangle, Ellipse, Polygon>,
                        tuple <Rectangle, Ellipse, Polygon>
                        >;
        _CollisionFx_third (const char *version="THIRD API") : ShapeCollision(version) {}

        //specializations
        void operator() (Rectangle *p, Rectangle *q) { print(p,q, "fRR -compatible"); }
        void operator() (Ellipse   *p, Ellipse   *q) { print(p,q, "fEE -compatible"); }
        void operator() (Rectangle *p, Ellipse   *q) { print(p,q, "fRE -modified behavior"); }
        void operator() (Ellipse   *p, Rectangle *q) { print(p,q, "fER -modified behavior"); }

        void operator() (Rectangle *p, Polygon   *q) { print(p,q, "fRP -new");   }
        void operator() (Ellipse   *p, Polygon   *q) { print(p,q, "fEP -new");   }
    };
}
using third_collide_func = vane::multi_func <detail::_CollisionFx_third>;




////////////////////////////////////////////////////////////////////////////////
void early_module (virtual_collide_func  &collide) {
    printf("--------------------------------------------------early_module\n");
    Rectangle  r;
    Ellipse    e;

    collide (&r, &r);
    collide (&e, &e);
    collide (&r, &e);
}
 
void later_module (virtual_collide_func  &collide) {
    printf("--------------------------------------------------later_module\n");
    Rectangle  r;
    Ellipse    e;
    Polygon    p;

    collide (&r, &r);
    collide (&e, &e);
    collide (&r, &e);
    collide (&e, &r);
}

void third_module (virtual_collide_func  &collide) {
    printf("--------------------------------------------------3rd_module\n");
    Rectangle  r;
    Ellipse    e;
    Polygon    p;

    collide (&r, &r);
    collide (&e, &e);
    collide (&r, &e);
    collide (&e, &r);

    collide (&r, &p);
    collide (&e, &p);
}


int main() try
{
    printf("%15s%20s\n","real args","fx called");

    early_collide_func  early_collide;
    later_collide_func  later_collide;
    third_collide_func  third_collide;


    early_module (early_collide);    printf("\n");

    later_module (later_collide);
    early_module (later_collide);    printf("\n");

    third_module (third_collide);
    later_module (third_collide);
    early_module (third_collide);
}
catch(const std::exception &e) { printf("\nexception: %s", e.what());  }


/* output **********************************************************************
      real args           fx called
--------------------------------------------------early_module
(rectangle rectangle) --> early api-fRR
(ellipse     ellipse) --> early api-fEE
(rectangle   ellipse) --> early api-fRE

--------------------------------------------------later_module
(rectangle rectangle) --> Later api-fRR
(ellipse     ellipse) --> Later api-fEE
(rectangle   ellipse) --> Later api-fRE -modified
(ellipse   rectangle) --> Later api-fER -added
--------------------------------------------------early_module
(rectangle rectangle) --> Later api-fRR
(ellipse     ellipse) --> Later api-fEE
(rectangle   ellipse) --> Later api-fRE -modified

--------------------------------------------------3rd_module
(rectangle rectangle) --> THIRD API-fRR -compatible
(ellipse     ellipse) --> THIRD API-fEE -compatible
(rectangle   ellipse) --> THIRD API-fRE -modified behavior
(ellipse   rectangle) --> THIRD API-fER -modified behavior
(rectangle   polygon) --> THIRD API-fRP -new
(ellipse     polygon) --> THIRD API-fEP -new
--------------------------------------------------later_module
(rectangle rectangle) --> THIRD API-fRR -compatible
(ellipse     ellipse) --> THIRD API-fEE -compatible
(rectangle   ellipse) --> THIRD API-fRE -modified behavior
(ellipse   rectangle) --> THIRD API-fER -modified behavior
--------------------------------------------------early_module
(rectangle rectangle) --> THIRD API-fRR -compatible
(ellipse     ellipse) --> THIRD API-fEE -compatible
(rectangle   ellipse) --> THIRD API-fRE -modified behavior
*/
```







































```c++
//file: switch-collide-virt.cc
#include "vane.h"   //required
#include <stdio.h>
using std::tuple;


/* inheritance hierarchy

           / Rectangle
    Shape +- Ellipse
           \ Polygon

    ShapeCollision +- _CollisionFx_early - _CollisionFx_later
                    \ _CollisionFx_third
*/


struct Shape {
    virtual ~Shape() {}   //polymorphic base is required
    Shape(const char *c = "shape") : name(c) {}
    const char *name;
};

using VirtualShape = vane::_virtual<Shape>;

struct ShapeCollision
{
    using type = void (VirtualShape*, VirtualShape*);  //signature of the virtual function

    void print(Shape *p, Shape *q, const char *tag) {
        printf("(%-9s %9s) --> %s-%s\n", p->name, q->name, api_version, tag);
    }

    const char *api_version;
    ShapeCollision(const char *version) : api_version(version) {}
};

using virtual_collide_func = vane::virtual_func <ShapeCollision::type>;






////////////////////////////////////////////////////////////////////////////////
//the early api
struct Rectangle : Shape { Rectangle(const char *c = "rectangle") : Shape(c) {} };
struct Ellipse   : Shape { Ellipse  (const char *c = "ellipse"  ) : Shape(c) {} };


namespace detail {
    struct _CollisionFx_early : ShapeCollision
    {
        //note: 'type' is inherited
        using domains = tuple <  //function selector
                        tuple <Rectangle, Ellipse>,
                        tuple <Rectangle, Ellipse>
                        >;
        _CollisionFx_early (const char *version="early api") : ShapeCollision(version) {}

        //specializations
        void operator() (Rectangle *p, Rectangle *q) { print(p,q, "fRR"); }
        void operator() (Ellipse   *p, Ellipse   *q) { print(p,q, "fEE"); }
        void operator() (Rectangle *p, Ellipse   *q) { print(p,q, "fRE"); }
    };
}
using early_collide_func = vane::multi_func <detail::_CollisionFx_early>;



//new_api - slightly different api
namespace detail {
    struct _CollisionFx_later : _CollisionFx_early
    {
        //note: 'type', 'domains' are inherited
        _CollisionFx_later (const char *version="Later api") : _CollisionFx_early(version) {}

        //specializations:
        using _CollisionFx_early::operator();
        void operator() (Rectangle *p, Ellipse   *q) { print(p,q, "fRE -modified"); }
        void operator() (Ellipse   *p, Rectangle *q) { print(p,q, "fER -added"); }
    };
}
using later_collide_func = vane::multi_func <detail::_CollisionFx_later>;





////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//3rd_api - very different api
struct Polygon : Shape { Polygon (const char *c = "polygon") : Shape(c) {} };


namespace detail {
    struct _CollisionFx_third : ShapeCollision
    {
        //note: 'type' is inherited
        using domains = tuple <       //note: different domains than the formers
                        tuple <Rectangle, Ellipse, Polygon>,
                        tuple <Rectangle, Ellipse, Polygon>
                        >;
        _CollisionFx_third (const char *version="THIRD API") : ShapeCollision(version) {}

        //specializations
        void operator() (Rectangle *p, Rectangle *q) { print(p,q, "fRR -compatible"); }
        void operator() (Ellipse   *p, Ellipse   *q) { print(p,q, "fEE -compatible"); }
        void operator() (Rectangle *p, Ellipse   *q) { print(p,q, "fRE -modified behavior"); }
        void operator() (Ellipse   *p, Rectangle *q) { print(p,q, "fER -modified behavior"); }

        void operator() (Rectangle *p, Polygon   *q) { print(p,q, "fRP -new");   }
        void operator() (Ellipse   *p, Polygon   *q) { print(p,q, "fEP -new");   }
    };
}
using third_collide_func = vane::multi_func <detail::_CollisionFx_third>;




////////////////////////////////////////////////////////////////////////////////
void early_module (virtual_collide_func  &collide) {
    printf("--------------------------------------------------early_module\n");
    VirtualShape::of<Rectangle>  r;
    VirtualShape::of<Ellipse>    e;

    collide (&r, &r);
    collide (&e, &e);
    collide (&r, &e);
}
 
void later_module (virtual_collide_func  &collide) {
    printf("--------------------------------------------------later_module\n");
    VirtualShape::of<Rectangle>  r;
    VirtualShape::of<Ellipse>    e;
    VirtualShape::of<Polygon>    p;

    collide (&r, &r);
    collide (&e, &e);
    collide (&r, &e);
    collide (&e, &r);
}

void third_module (virtual_collide_func  &collide) {
    printf("--------------------------------------------------3rd_module\n");
    VirtualShape::of<Rectangle>  r;
    VirtualShape::of<Ellipse>      e;
    VirtualShape::of<Polygon>      p;

    collide (&r, &r);
    collide (&e, &e);
    collide (&r, &e);
    collide (&e, &r);

    collide (&r, &p);
    collide (&e, &p);
}


int main() try
{
    printf("%15s%20s\n","real args","fx called");

    early_collide_func  early_collide;
    later_collide_func  later_collide;
    third_collide_func  third_collide;


    early_module (early_collide);    printf("\n");

    later_module (later_collide);
    early_module (later_collide);    printf("\n");

    third_module (third_collide);
    later_module (third_collide);
    early_module (third_collide);
}
catch(const std::exception &e) { printf("\nexception: %s", e.what());  }


/* output **********************************************************************
      real args           fx called
--------------------------------------------------early_module
(rectangle rectangle) --> early api-fRR
(ellipse     ellipse) --> early api-fEE
(rectangle   ellipse) --> early api-fRE

--------------------------------------------------later_module
(rectangle rectangle) --> Later api-fRR
(ellipse     ellipse) --> Later api-fEE
(rectangle   ellipse) --> Later api-fRE -modified
(ellipse   rectangle) --> Later api-fER -added
--------------------------------------------------early_module
(rectangle rectangle) --> Later api-fRR
(ellipse     ellipse) --> Later api-fEE
(rectangle   ellipse) --> Later api-fRE -modified

--------------------------------------------------3rd_module
(rectangle rectangle) --> THIRD API-fRR -compatible
(ellipse     ellipse) --> THIRD API-fEE -compatible
(rectangle   ellipse) --> THIRD API-fRE -modified behavior
(ellipse   rectangle) --> THIRD API-fER -modified behavior
(rectangle   polygon) --> THIRD API-fRP -new
(ellipse     polygon) --> THIRD API-fEP -new
--------------------------------------------------later_module
(rectangle rectangle) --> THIRD API-fRR -compatible
(ellipse     ellipse) --> THIRD API-fEE -compatible
(rectangle   ellipse) --> THIRD API-fRE -modified behavior
(ellipse   rectangle) --> THIRD API-fER -modified behavior
--------------------------------------------------early_module
(rectangle rectangle) --> THIRD API-fRR -compatible
(ellipse     ellipse) --> THIRD API-fEE -compatible
(rectangle   ellipse) --> THIRD API-fRE -modified behavior
*/
```








































```c++
//file: switch-collide-varg.cc
#include "vane.h"   //required
#include <stdio.h>
using std::tuple;


struct Rectangle  { const char *name = "rectangle"; };
struct Ellipse    { const char *name = "ellipse";   };
struct Polygon    { const char *name = "polygon";   };

using VirtualShape = vane::varg <Rectangle, Ellipse, Polygon>;
                    //NOTE: type list cannot be modified later;
                    //      all the types needed must be included at first
                    //      : it's the limitation of varg<> type


struct ShapeCollision
{
    using type = void (VirtualShape*, VirtualShape*);  //signature of the virtual function


    template <typename Shape1, typename Shape2>       //just an example; could use a base class
    void print(Shape1 *p, Shape2 *q, const char *tag) {
        printf("(%-9s %9s) --> %s-%s\n", p->name, q->name, api_version, tag);
    }

    const char *api_version;
    ShapeCollision(const char *version) : api_version(version) {}
};

using virtual_collide_func = vane::virtual_func <ShapeCollision::type>;





////////////////////////////////////////////////////////////////////////////////
/* inheritance hierarchy

    ShapeCollision +- _CollisionFx_early - _CollisionFx_later
                    \ _CollisionFx_third
*/

//the early api
namespace detail {
    struct _CollisionFx_early : ShapeCollision
    {
        //note: 'type' is inherited
        using domains = tuple <  //function selector
                        tuple <Rectangle, Ellipse>,
                        tuple <Rectangle, Ellipse>
                        >;
        _CollisionFx_early (const char *version="early api") : ShapeCollision(version) {}

        //specializations
        void operator() (Rectangle *p, Rectangle *q) { print(p,q, "fRR"); }
        void operator() (Ellipse   *p, Ellipse   *q) { print(p,q, "fEE"); }
        void operator() (Rectangle *p, Ellipse   *q) { print(p,q, "fRE"); }
    };
}
using early_collide_func = vane::multi_func <detail::_CollisionFx_early>;



//new_api inheriting existing specialization set
namespace detail {
    struct _CollisionFx_later : _CollisionFx_early
    {
        //note: 'type', 'domains' are inherited
        _CollisionFx_later (const char *version="Later api") : _CollisionFx_early(version) {}

        //specializations:
        using _CollisionFx_early::operator();
        void operator() (Rectangle *p, Ellipse   *q) { print(p,q, "fRE -modified"); }
        void operator() (Ellipse   *p, Rectangle *q) { print(p,q, "fER -added"); }
    };
}
using later_collide_func = vane::multi_func <detail::_CollisionFx_later>;




////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//3rd_api - very different api
namespace detail {
    struct _CollisionFx_third : ShapeCollision
    {
        //note: 'type' is inherited
        using domains = tuple <       //note: different domains than the formers
                        tuple <Rectangle, Ellipse, Polygon>,
                        tuple <Rectangle, Ellipse, Polygon>
                        >;
        _CollisionFx_third (const char *version="THIRD API") : ShapeCollision(version) {}

        //specializations
        void operator() (Rectangle *p, Rectangle *q) { print(p,q, "fRR -compatible"); }
        void operator() (Ellipse   *p, Ellipse   *q) { print(p,q, "fEE -compatible"); }
        void operator() (Rectangle *p, Ellipse   *q) { print(p,q, "fRE -modified behavior"); }
        void operator() (Ellipse   *p, Rectangle *q) { print(p,q, "fER -modified behavior"); }

        void operator() (Rectangle *p, Polygon   *q) { print(p,q, "fRP -new");   }
        void operator() (Ellipse   *p, Polygon   *q) { print(p,q, "fEP -new");   }
    };
}
using third_collide_func = vane::multi_func <detail::_CollisionFx_third>;




////////////////////////////////////////////////////////////////////////////////
void early_module (virtual_collide_func  &collide) {
    printf("--------------------------------------------------early_module\n");
    VirtualShape::of<Rectangle>  r;
    VirtualShape::of<Ellipse>    e;

    collide (&r, &r);
    collide (&e, &e);
    collide (&r, &e);
}
 
void later_module (virtual_collide_func  &collide) {
    printf("--------------------------------------------------later_module\n");
    VirtualShape::of<Rectangle>  r;
    VirtualShape::of<Ellipse>    e;
    VirtualShape::of<Polygon>    p;

    collide (&r, &r);
    collide (&e, &e);
    collide (&r, &e);
    collide (&e, &r);
}

void third_module (virtual_collide_func  &collide) {
    printf("--------------------------------------------------3rd_module\n");
    VirtualShape::of<Rectangle>  r;
    VirtualShape::of<Ellipse>      e;
    VirtualShape::of<Polygon>      p;

    collide (&r, &r);
    collide (&e, &e);
    collide (&r, &e);
    collide (&e, &r);

    collide (&r, &p);
    collide (&e, &p);
}


int main() try
{
    printf("%15s%20s\n","real args","fx called");

    early_collide_func  early_collide;
    later_collide_func  later_collide;
    third_collide_func  third_collide;


    early_module (early_collide);    printf("\n");

    later_module (later_collide);
    early_module (later_collide);    printf("\n");

    third_module (third_collide);
    later_module (third_collide);
    early_module (third_collide);
}
catch(const std::exception &e) { printf("\nexception: %s", e.what());  }


/* output **********************************************************************
      real args           fx called
--------------------------------------------------early_module
(rectangle rectangle) --> early api-fRR
(ellipse     ellipse) --> early api-fEE
(rectangle   ellipse) --> early api-fRE

--------------------------------------------------later_module
(rectangle rectangle) --> Later api-fRR
(ellipse     ellipse) --> Later api-fEE
(rectangle   ellipse) --> Later api-fRE -modified
(ellipse   rectangle) --> Later api-fER -added
--------------------------------------------------early_module
(rectangle rectangle) --> Later api-fRR
(ellipse     ellipse) --> Later api-fEE
(rectangle   ellipse) --> Later api-fRE -modified

--------------------------------------------------3rd_module
(rectangle rectangle) --> THIRD API-fRR -compatible
(ellipse     ellipse) --> THIRD API-fEE -compatible
(rectangle   ellipse) --> THIRD API-fRE -modified behavior
(ellipse   rectangle) --> THIRD API-fER -modified behavior
(rectangle   polygon) --> THIRD API-fRP -new
(ellipse     polygon) --> THIRD API-fEP -new
--------------------------------------------------later_module
(rectangle rectangle) --> THIRD API-fRR -compatible
(ellipse     ellipse) --> THIRD API-fEE -compatible
(rectangle   ellipse) --> THIRD API-fRE -modified behavior
(ellipse   rectangle) --> THIRD API-fER -modified behavior
--------------------------------------------------early_module
(rectangle rectangle) --> THIRD API-fRR -compatible
(ellipse     ellipse) --> THIRD API-fEE -compatible
(rectangle   ellipse) --> THIRD API-fRE -modified behavior
*/
```
