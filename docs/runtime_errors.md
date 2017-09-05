# runtime errors
&nbsp;  
&nbsp;  
&nbsp;

sample code
&nbsp;  
&nbsp;



```c++
//file: runtime_errors-poly.cc
#include "vane.h"
#include <stdio.h>
using std::tuple;


/* inheritance hierarchy:
      A-B
    O-X-Y
*/

struct A        { A(char c='a') : n(c) {}   char n;  virtual ~A(){}  };
struct B : A    { B(char c='b') : A(c) {}   };

struct O        { O(char c='o') : n(c) {}   char n;  virtual ~O(){}  };
struct X : O    { X(char c='x') : O(c) {}   };
struct Y : X    { Y(char c='y') : X(c) {}   };


////////////////////////////////////////////////////////////////////////////////

struct Fx
{
    using type = void (int&, A&&, O&&);   //type of the virtual function

    using domains = tuple<          //type domains of the virtual parameters
                        tuple<A,B>, //for A&&
                        tuple<X,Y>  //for O&&
                    >;
    //specializatins:
    void operator()(int &i, A &&a, Y &&x) { printf("\n%3d| %c %c --> fAY", i++, a.n, x.n); }
    void operator()(int &i, B &&a, X &&x) { printf("\n%3d| %c %c --> fBX", i++, a.n, x.n); }
};


////////////////////////////////////////////////////////////////////////////////
void call( vane::multi_func<Fx> *vfunc, int &i, A &&a, O &&x)
try {
    (*vfunc)(i, std::move(a), std::move(x));
}
catch(const std::exception &e) { printf("\n%3d| exception : %s", i, e.what()); }


int main()
{
    vane::multi_func<Fx>  mfunc;
    Fx  fx;   //ordinary function object


    printf("%s%13s","real args","Fx called");
    int i;
    i=0;    call (&mfunc, i, A(), Y());
                      fx( i, A(), Y());
    i=10;   call (&mfunc, i, B(), X());
                      fx( i, B(), X());
    i=100;  call (&mfunc, i, B(), Y()); //runtime error: no matching function or ambiguous call
                 //   fx( i, B(), Y()); //compile error: call is ambiguous
    i=200;  call (&mfunc, i, A(), X()); //runtime error: no matching function or ambiguous call
                 //   fx( i, A(), X()); //compile error: no matching function
    i=300;  call (&mfunc, i, A(), O()); //runtime error: argument type out of domain
                 //   fx( i, A(), O()); //compile error: no matching function
}

/* output **********************************************************************
real args    Fx called
  0| a y --> fAY
  1| a y --> fAY
 10| b x --> fBX
 11| b x --> fBX
100| exception : multi-function error: no matching function or ambiguous call
200| exception : multi-function error: no matching function or ambiguous call
300| exception : multi-function error: argument type out of domain
*/
```











































```c++
//file: runtime_errors-virt.cc
#include "vane.h"
#include <stdio.h>
using std::tuple;


/* inheritance hierarchy:
      A-B
    O-X-Y
*/

struct A        { A(char c='a') : n(c) {}   char n;  virtual ~A(){}  };
struct B : A    { B(char c='b') : A(c) {}   };

struct O        { O(char c='o') : n(c) {}   char n;  virtual ~O(){}  };
struct X : O    { X(char c='x') : O(c) {}   };
struct Y : X    { Y(char c='y') : X(c) {}   };


using VA = vane::_virtual <A>;
using VO = vane::_virtual <O>;

////////////////////////////////////////////////////////////////////////////////

struct Fx
{
    using type = void (int&, VA*, VO*);   //type of the virtual function

    using domains = tuple<          //type domains of the virtual parameters
                        tuple<A,B>, //for VA*
                        tuple<X,Y>  //for VO*
                    >;
    //specializatins:
    void operator()(int &i, A *a, Y *x) { printf("\n%3d| %c %c --> fAY", i++, a->n, x->n); }
    void operator()(int &i, B *a, X *x) { printf("\n%3d| %c %c --> fBX", i++, a->n, x->n); }
};


////////////////////////////////////////////////////////////////////////////////
void call( vane::multi_func<Fx> *vfunc, int &i, VA *a, VO *x)
try {
    (*vfunc)(i, a, x);
}
catch(const std::exception &e) { printf("\n%3d| exception : %s", i, e.what()); }


int main()
{
    vane::multi_func<Fx>  mfunc;
    Fx  fx;   //ordinary function object

    VA::of<A> a;    VO::of<X> x;
    VA::of<B> b;    VO::of<Y> y;
                    VO::of<O> o;

    printf("%s%13s","real args","Fx called");
    int i;
    i=0;    call (&mfunc, i, &a, &y);
                      fx( i, &a, &y);
    i=10;   call (&mfunc, i, &b, &x);
                      fx( i, &b, &x);
    i=100;  call (&mfunc, i, &b, &y);   //runtime error: no matching function or ambiguous call
                 //   fx( i, &b, &y);   //compile error: call is ambiguous
    i=200;  call (&mfunc, i, &a, &x);   //runtime error: no matching function or ambiguous call
                 //   fx( i, &a, &x);   //compile error: no matching function
    i=300;  call (&mfunc, i, &a, &o);   //runtime error: argument type out of domain
                 //   fx( i, &a, &o);   //compile error: no matching function
}

/* output **********************************************************************
real args    Fx called
  0| a y --> fAY
  1| a y --> fAY
 10| b x --> fBX
 11| b x --> fBX
100| exception : multi-function error: no matching function or ambiguous call
200| exception : multi-function error: no matching function or ambiguous call
300| exception : multi-function error: argument type out of domain
*/
```





































```c++
//file: runtime_errors-varg.cc
#include "vane.h"
#include <stdio.h>
using std::tuple;


/* inheritance hierarchy:
      A-B
    O-X-Y
*/
//note: for varg<>, parameters being polymorphic or not doesn't matter
struct A        { A(char c='a') : n(c) {}   char n;  virtual ~A(){} };
struct B : A    { B(char c='b') : A(c) {}   };

struct O        { O(char c='o') : n(c) {}   char n;  };
struct X : O    { X(char c='x') : O(c) {}   };
struct Y : X    { Y(char c='y') : X(c) {}   };


using varg = vane::varg <A,B,O,X,Y>;

////////////////////////////////////////////////////////////////////////////////

struct Fx
{
    using type = void (int&, varg*, varg*);   //type of the virtual function

    using domains = tuple<          //type domains of the virtual parameters
                        tuple<A,B>, //for the 1st varg*
                        tuple<X,Y>  //for the 2nd varg*
                    >;
    //specializatins:
    void operator()(int &i, A *a, Y *x) { printf("\n%3d| %c %c --> fAY", i++, a->n, x->n); }
    void operator()(int &i, B *a, X *x) { printf("\n%3d| %c %c --> fBX", i++, a->n, x->n); }
};


////////////////////////////////////////////////////////////////////////////////
void call( vane::multi_func<Fx> *vfunc, int &i, varg *a, varg *x)
try {
    (*vfunc)(i, a, x);
}
catch(const std::exception &e) { printf("\n%3d| exception : %s", i, e.what()); }


int main()
{
    vane::multi_func<Fx>  mfunc;
    Fx  fx;   //ordinary function object

    varg::of<A> a;   varg::of<X> x;
    varg::of<B> b;   varg::of<Y> y;
                     varg::of<O> o;

    printf("%s%13s","real args","Fx called");
    int i;
    i=0;    call (&mfunc, i, &a, &y);
                      fx( i, &a, &y);
    i=10;   call (&mfunc, i, &b, &x);
                      fx( i, &b, &x);
    i=100;  call (&mfunc, i, &b, &y);   //runtime error: no matching function or ambiguous call
                 //   fx( i, &b, &y);   //compile error: call is ambiguous
    i=200;  call (&mfunc, i, &a, &x);   //runtime error: no matching function or ambiguous call
                 //   fx( i, &a, &x);   //compile error: no matching function
    i=300;  call (&mfunc, i, &a, &o);   //runtime error: argument type out of domain
                 //   fx( i, &a, &o);   //compile error: no matching function
}

/* output **********************************************************************
real args    Fx called
  0| a y --> fAY
  1| a y --> fAY
 10| b x --> fBX
 11| b x --> fBX
100| exception : multi-function error: no matching function or ambiguous call
200| exception : multi-function error: no matching function or ambiguous call
300| exception : multi-function error: argument type out of domain
*/
```
