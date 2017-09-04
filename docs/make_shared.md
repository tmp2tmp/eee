# make_shared &nbsp; utility
&nbsp;  
&nbsp;  
&nbsp;

<div style='font: 12pt consolas; white-space:pre'>
when  using VirtualShape = _virtual&lt;Shape&gt;;  
  or  using VirtualShape = varg&lt;Rectangle,...&gt;  
where struct Rectangle : Shape {...};
</div>

<pre><code>std::make_shared&lt;VirtualShape::of&lt;Rectangle&gt;&gt;{...};
<i>//is equivalent to:</i>
vane::make_shared&lt;Rectangle, Shape&gt;{...};
</code></pre>

<pre><code>std::make_unique&lt;VirtualShape::of&lt;Rectangle&gt;&gt;{...};
<i>//is equivalent to:</i>
vane::make_unique&lt;Rectangle, Shape&gt;{...};
</code></pre>



&nbsp;  
&nbsp;  
&nbsp;

```c++
//file: make_shared-virt.cc
#include "vane.h"   //required
#include <stdio.h>
#define ____    printf("\n-----------------------------------------");
using std::tuple;
using vane::_virtual;   //for _virtual<Shape>


struct Shape             { const char *name;
                           virtual ~Shape() {}  //polymorphic base is required
                           Shape    (const char *c) : name(c)  {} };
struct Rectangle : Shape { Rectangle(const char *c) : Shape(c) {} };
struct Ellipse   : Shape { Ellipse  (const char *c) : Shape(c) {} };
struct Polygon   : Shape { Polygon  (const char *c) : Shape(c) {} };


struct PrintFx {
    using type = void (_virtual<Shape>*);
    using domains = tuple <tuple <Rectangle, Ellipse, Polygon> >;

    void operator()(Rectangle *s) { printf("\n%s  @fR", s->name); }
    void operator()(Ellipse   *s) { printf("\n%s  @fE", s->name); }
    void operator()(Polygon   *s) { printf("\n%s  @fP", s->name); }
};


int main() try
{
    vane::multi_func <PrintFx>                    mprint;
    vane::virtual_func <void(_virtual<Shape>*)>  &vprint= mprint;

    PrintFx  print;   //ordinary function object


    //std::make_shared equiv.
    auto shared_Rp =  std::make_shared <_virtual<Shape>::of<Rectangle>> ("shared_R");
    auto shared_Ep = vane::make_shared <Ellipse, _virtual<Shape>>       ("shared_E");
    auto shared_Pp = vane::make_shared <Polygon, _virtual<Shape>>       ("unique_P");

    mprint (&*shared_Rp);
    vprint (&*shared_Ep);
    print  (&*shared_Pp);
    printf ("\n%s", shared_Pp->name);


____//std::make_unique equiv.
    auto unique_Rp =  std::make_unique <_virtual<Shape>::of<Rectangle>> ("unique_R");
    auto unique_Ep = vane::make_unique <Ellipse, _virtual<Shape>>       ("unique_E");
    auto unique_Pp = vane::make_unique <Polygon, _virtual<Shape>>       ("unique_P");

    mprint (&*unique_Rp);
    vprint (&*unique_Ep);
    print  (&*unique_Pp);
    printf ("\n%s", unique_Pp->name);
}
catch( std::exception &x ) { printf("\nexception: %s\n", x.what()); }


/* output **********************************************************************
shared_R  @fR
shared_E  @fE
unique_P  @fP
unique_P
-----------------------------------------
unique_R  @fR
unique_E  @fE
unique_P  @fP
unique_P
*/
```




































```c++
//file: make_shared-varg.cc
#include "vane.h"
#include <stdio.h>
#define ____    printf("\n-----------------------------------------");
using std::tuple;


struct Rectangle { Rectangle(const char *c): name(c) {}  const char *name; };
struct Ellipse   { Ellipse  (const char *c): name(c) {}  const char *name; };
struct Polygon   { Polygon  (const char *c): name(c) {}  const char *name; };

using Shape = vane::varg <Rectangle, Ellipse, Polygon>;


struct PrintFx {
    using type = void (Shape*);
    using domains = tuple <tuple <Rectangle, Ellipse, Polygon> >;

    void operator()(Rectangle *s) { printf("\n%s  @fR", s->name); }
    void operator()(Ellipse   *s) { printf("\n%s  @fE", s->name); }
    void operator()(Polygon   *s) { printf("\n%s  @fP", s->name); }
};


int main() try
{
    vane::multi_func <PrintFx>         mprint;
    vane::virtual_func <void(Shape*)>  &vprint = mprint;

    PrintFx  print;   //ordinary function object


    //std::make_shared equiv.
    auto shared_Rp =  std::make_shared <Shape::of<Rectangle>> ("shared_R");
    auto shared_Ep = vane::make_shared <Ellipse, Shape>       ("shared_E");
    auto shared_Pp = vane::make_shared <Polygon, Shape>       ("shared_P");

    mprint (&*shared_Rp);
    vprint (&*shared_Ep);
    print  (&*shared_Pp);
    printf ("\n%s", shared_Pp->name);


____//std::make_unique equiv.
    auto unique_Rp =  std::make_unique <Shape::of<Rectangle>> ("unique_R");
    auto unique_Ep = vane::make_unique <Ellipse, Shape>       ("unique_E");
    auto unique_Pp = vane::make_unique <Polygon, Shape>       ("unique_P");

    mprint (&*unique_Rp);
    vprint (&*unique_Ep);
    print  (&*unique_Pp);
    printf ("\n%s", unique_Pp->name);
}
catch( std::exception &x ) { printf("\nexception: %s\n", x.what()); }


/* output **********************************************************************
shared_R  @fR
shared_E  @fE
shared_P  @fP
shared_P
-----------------------------------------
unique_R  @fR
unique_E  @fE
unique_P  @fP
unique_P
*/
```

