# make_shared &nbsp; _virtual

```c++
//file: vt-make_shared.cc
#include "vane.h"   //required
#include <stdio.h>

using vane::_virtual;   //for _virtual<Shape>


struct Shape {
    virtual ~Shape() {}  //polymorphic base is required
    const char *name;
                           Shape    (const char *c) : name(c)  {} };
struct Rectangle : Shape { Rectangle(const char *c) : Shape(c) {} };
struct Ellipse   : Shape { Ellipse  (const char *c) : Shape(c) {} };
struct Polygon   : Shape { Polygon  (const char *c) : Shape(c) {} };


void print_virtualed (_virtual<Shape>&, _virtual<Shape>*);

int main()
{
    //make_shared equiv.'s
    auto shared_Rp =  std::make_shared <_virtual<Shape>::of<Rectangle>>("shard_R");
    auto shared_Ep = vane::make_shared <Ellipse, _virtual<Shape>>      ("shared_E");

    printf("\n%s; %s", shared_Rp->name, shared_Ep->name);
    print_virtualed (*shared_Rp, &*shared_Ep);

____//make_unique equiv.'s
    auto unique_Rp =  std::make_unique <_virtual<Shape>::of<Rectangle>>("unique_R");
    auto unique_Pp = vane::make_unique <Polygon, _virtual<Shape>>      ("unique_P");

    printf("\n%s; %s", unique_Rp->name, unique_Pp->name);
    print_virtualed (*unique_Rp, &*unique_Pp);
}

////////////////////////////////////////////////////////////////////////////////
void print_virtualed (_virtual<Shape> &a, _virtual<Shape> *b)
try {
    using std::tuple;
    struct Fx {
        using type = void (_virtual<Shape>*, _virtual<Shape>*);
        using domains = tuple < tuple <Rectangle, Ellipse, Polygon>,
                                tuple <Rectangle, Ellipse, Polygon> >;

        void operator()(Rectangle *a, Ellipse *b) { printf("\n%s, %s\t@fxRE", a->name, b->name); }
        void operator()(Rectangle *a, Polygon *b) { printf("\n%s, %s\t@fxRP", a->name, b->name); }
    };

    vane::multi_func<Fx>()(&a,b);
}
catch( std::exception &x ) { printf("\nexception: %s\n", x.what()); }

/* output **********************************************************************
shard_R; shared_E
shard_R, shared_E	@fxRE
-----------------------------------------
unique_R; unique_P
unique_R, unique_P	@fxRP
*/
```
