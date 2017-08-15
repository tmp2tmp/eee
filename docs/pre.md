---
code-width: 111ex
---
```c++
#include "vane.h"   //required
#include <stdio.h>
using std::tuple;


/* inheritance hierachy:
      A-B
    O-X-Y
*/
struct A        { A(char c='a') : n(c) {}   char n;  };
struct B : A    { B(char c='b') : A(c) {}   };

struct O        { O(char c='o') : n(c) {}   char n;  };
struct X : O    { X(char c='x') : O(c) {}   };
struct Y : X    { Y(char c='y') : X(c) {}   };


using varg = vane::varg <A,B,O,X,Y>;

////////////////////////////////////////////////////////////////////////////////

struct Fx
{
    using type = void (int&, varg*, varg*);

//  using domains = tuple< tuple<A,B>, tuple<X,Y> >;
    using domains = tuple<
                        tuple<A,B>, //for A&&
                        tuple<X,Y>  //for O&&
                    >;

//specialized functions:
    void operator()(int &i, A *a, Y *x) { printf("%3d| %c %c --> fAY\n", i++, a->n, x->n); }
    void operator()(int &i, B *a, X *x) { printf("%3d| %c %c --> fBX\n", i++, a->n, x->n); }
};


////////////////////////////////////////////////////////////////////////////////
void call( vane::multi_func<Fx> *vfunc, int &i, varg *a, varg *x)
try {
    (*vfunc)(i, a, x);
}
catch(const std::exception &e) { printf("%3d| exception : %s\n", i, e.what()); }


int main()
{
    vane::multi_func<Fx>  mfunc;
    Fx  fx; //ordinary function object

    varg::of<A> a;   varg::of<B> b;
    varg::of<X> x;   varg::of<Y> y;
    varg::of<O> o;

    printf("%s%20s","real args","actually called\n");
    int i;
    i=10;   call(&mfunc, i, &a, &y);
                     fx( i, &a, &y);
    i=20;   call(&mfunc, i, &b, &x);
                     fx( i, &b, &x);
    i=100;  call(&mfunc, i, &b, &y);    //runtime error: function not found or ambiguous call
                //   fx( i, &b, &y);    //compile error: call is ambiguous
    i=200;  call(&mfunc, i, &a, &x);    //runtime error: function not found or ambiguous call
                //   fx( i, &a, &x);    //compile error: no matching call
    i=300;  call(&mfunc, i, &a, &o);    //runtime error: argument type out of domain
                //   fx( i, &a, &o);    //compile error: no matching call
}

/* output **********************************************************************
real args    actually called
 10| a y --> fAY
 11| a y --> fAY
 20| b x --> fBX
 21| b x --> fBX
100| exception : multi-function error: function not found or ambiguous call
200| exception : multi-function error: function not found or ambiguous call
300| exception : multi-function error: argument type out of domain
*/
#if 0
real args    actually called
 10| a y --> fAY
 11| a y --> fAY
 20| b x --> fBX
 21| b x --> fBX
100| exception : multi-function error: function not found or ambiguous call
200| exception : multi-function error: function not found or ambiguous call
300| exception : multi-function error: argument type out of domain
#endif
```
