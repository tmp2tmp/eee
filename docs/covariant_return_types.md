# Covariant return types
&nbsp;  
&nbsp;  
&nbsp;



```c++
//file: covariant_return-poly.cc
#include "vane.h"
#include <stdio.h>
using std::tuple;


struct     A  { A(char c='a') : n(c) {}  char n;  virtual ~A(){}  };
struct B : A  { B(char c='b') : A(c) {}  };
struct C : A  { C(char c='c') : A(c) {}  };


namespace detail {
    struct Fx
    {
        using type = A* (A*);   //note: the virtual function must return a A*

        using domains = tuple< tuple<A,B,C> >;

        //easy!
        A *operator()(A *v) { printf("\n%8c --> fA", v->n); return v; }
        B *operator()(B *v) { printf("\n%8c --> fB", v->n); return v; }
        C *operator()(C *v) { printf("\n%8c --> fC", v->n); return v; }
    };
}
using multi_func = vane::multi_func <detail::Fx>;


////////////////////////////////////////////////////////////////////////////////

A *call_baseTyped (multi_func *vfunc,  A *a) {
    return (*vfunc)(a);
}

int main() try 
{
    multi_func   mfunc;

    A a;
    B b;
    C c;


    printf("%s%13s  %s","real args","Fx-called","return");
    A *ret;
    ret = call_baseTyped (&mfunc, &a);     printf("%10c [%d]", ret->n, ret==&a);
    ret = call_baseTyped (&mfunc, &b);     printf("%10c [%d]", ret->n, ret==&b);
    ret = call_baseTyped (&mfunc, &c);     printf("%10c [%d]", ret->n, ret==&c);


    struct D : C  { D(char c='d') : C(c) {}  };

    D d;
    ret = call_baseTyped (&mfunc, &d);     printf("%10c [%d]", ret->n, ret==&d);
}
catch( const std::exception &ex ) { printf("\nexception: %s", ex.what() ); }


/* output **********************************************************************
real args    Fx-called  return
       a --> fA         a [1]
       b --> fB         b [1]
       c --> fC         c [1]
       d --> fC         d [1]
*/
```





































```c++
//file: covariant_return-virt.cc
#include "vane.h"
#include <stdio.h>
using std::tuple;


struct     A  { A(char c='a') : n(c) {}  char n;  virtual ~A(){}  };
struct B : A  { B(char c='b') : A(c) {}  };
struct C : A  { C(char c='c') : A(c) {}  };

using Virtual = vane::_virtual <A>;

namespace detail {
    struct Fx
    {
        using type = A* (Virtual*); //note: the virtual function must return a A*

        using domains = tuple< tuple<A,B,C> >;

        //easy!
        A *operator()(A *v) { printf("\n%8c --> fA", v->n); return v; }
        B *operator()(B *v) { printf("\n%8c --> fB", v->n); return v; }
        C *operator()(C *v) { printf("\n%8c --> fC", v->n); return v; }
    };
}
using multi_func = vane::multi_func <detail::Fx>;


////////////////////////////////////////////////////////////////////////////////

A *call_baseTyped (multi_func *vfunc,  Virtual *a) {
    return (*vfunc)(a);
}

int main() try 
{
    multi_func   mfunc;

    Virtual::of<A> a;
    Virtual::of<B> b;
    Virtual::of<C> c;


    printf("%s%13s  %s","real args","Fx-called","return");
    A *ret;
    ret = call_baseTyped (&mfunc, &a);     printf("%10c [%d]", ret->n, ret==&a);
    ret = call_baseTyped (&mfunc, &b);     printf("%10c [%d]", ret->n, ret==&b);
    ret = call_baseTyped (&mfunc, &c);     printf("%10c [%d]", ret->n, ret==&c);


    struct D : C  { D(char c='d') : C(c) {}  };

    Virtual::of<D> d;
    ret = call_baseTyped (&mfunc, &d);     printf("%10c [%d]", ret->n, ret==&d);
}
catch( const std::exception &ex ) { printf("\nexception: %s", ex.what() ); }


/* output **********************************************************************
real args    Fx-called  return
       a --> fA         a [1]
       b --> fB         b [1]
       c --> fC         c [1]
       d --> fC         d [1]
*/
```





































```c++
//////////////////////////////////////////////////////////////////////
//file: covariant_return-varg.cc
#include "vane.h"
#include <stdio.h>
using std::tuple;


struct     A  { A(char c='a') : n(c) {}  char n;  virtual ~A(){}  };
struct B : A  { B(char c='b') : A(c) {}  };
struct C : A  { C(char c='c') : A(c) {}  };

using Virtual = vane::varg <A,B,C>;

namespace detail {
    struct Fx
    {
        using type = A* (Virtual*); //note: the virtual function must return a A*

        using domains = tuple< tuple<A,B,C> >;

        //easy!
        A *operator()(A *v) { printf("\n%8c --> fA", v->n); return v; }
        B *operator()(B *v) { printf("\n%8c --> fB", v->n); return v; }
        C *operator()(C *v) { printf("\n%8c --> fC", v->n); return v; }
    };
}
using multi_func = vane::multi_func <detail::Fx>;


////////////////////////////////////////////////////////////////////////////////

A *call_baseTyped (multi_func *vfunc,  Virtual *a) {
    return (*vfunc)(a);
}

int main() try 
{
    multi_func   mfunc;

    Virtual::of<A> a;
    Virtual::of<B> b;
    Virtual::of<C> c;


    printf("%s%13s  %s","real args","Fx-called","return");
    A *ret;
    ret = call_baseTyped (&mfunc, &a);     printf("%10c [%d]", ret->n, ret==&a);
    ret = call_baseTyped (&mfunc, &b);     printf("%10c [%d]", ret->n, ret==&b);
    ret = call_baseTyped (&mfunc, &c);     printf("%10c [%d]", ret->n, ret==&c);


    struct D : C  { D(char c='d') : C(c) {}  };

    Virtual::of<D> d;
    ret = call_baseTyped (&mfunc, &d);     printf("%10c [%d]", ret->n, ret==&d);
}
catch( const std::exception &ex ) { printf("\nexception: %s", ex.what() ); }


/* output **********************************************************************
real args    Fx-called  return
       a --> fA         a [1]
       b --> fB         b [1]
       c --> fC         c [1]
       d --> fC         d [1]
*/
```
