# runtime errors
&nbsp;  
&nbsp;  
&nbsp;

Invalid function calls (ambiguous calls or calls that have no matching functions)
generate runtime errors as exceptions:  
&nbsp; &nbsp; ```vane::multifunction\_error:: invalid\_call``` &nbsp; derived from ```std::runtime\_error```.  
But not 100% compatible with the C++ language call-resolution behaviors.  
Though not 100% compatible, calling the function call operator of the co-class(FX) of a mult\_func can be
useful for debugging to test at compile time whether calls on some possible combinations of argument types
will generate runtime errors of call-resolution.

calling the function call operator of the co-class(FX) of a mult\_func is 100% of C++ language call-resolution semantics.


Runtime errors occurr at runtime only. This makes debugging inconvenient.  
Whether a vane::multi\_func call generates a runtime error or not can be tested
  by getting the code-path acquire execution at runtime.  
But it can be test at compile time if we know the possible combinations of the argument types at the call.  
For the combinations of the arguments

The co-class of a multi\_func

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
void call (vane::multi_func<Fx> *mfunc, int &i, A &&a, O &&x);


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


void call (vane::multi_func<Fx> *mfunc, int &i, A &&a, O &&x) try
{
    (*mfunc)(i, std::move(a), std::move(x));

    if(0) {
        /* this block
           - will be optimized out when compiled optimized.
           - ensures at compile-time  //not 100% actually; but 100% in the above cases in main()
                                      //so may be useful practically in general,
                                      //   esp. Fx is a template paratmeter typename
                that mfunc calls for its argument types in (A*,Y*), (B*,X*)
                          of which types the arguments are expected to be passed at exectution
                     will generate no call-resolution errors at runtime.
        */
        (*(Fx*)mfunc) ( i, A(), Y());   //compile OK
        (*(Fx*)mfunc) ( i, B(), X());   //compile OK
    //  (*(Fx*)mfunc) ( i, B(), Y());   //compile error: call is ambiguous
    //  (*(Fx*)mfunc) ( i, A(), X());   //compile error: no matching function
    //  (*(Fx*)mfunc) ( i, A(), O());   //compile error: no matching function
    }
}
catch(const std::exception &e) { printf("\n%3d| exception : %s", i, e.what()); }


/* output **********************************************************************
real args    Fx called
  0| a y --> fAY
  1| a y --> fAY
 10| b x --> fBX
 11| b x --> fBX
100| exception : virtual-function error: no matching function or ambiguous call
200| exception : virtual-function error: no matching function or ambiguous call
300| exception : virtual-function error: argument type out of domain
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
void call (vane::multi_func<Fx> *mfunc, int &i, VA *a, VO *x);


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


void call (vane::multi_func<Fx> *mfunc, int &i, VA *a, VO *x) try
{
    (*mfunc)(i, a, x);

    if(0) {
        /* this block
           - will be optimized out when compiled optimized.
           - ensures at compile-time  //not 100% actually; but 100% in the above cases in main()
                                      //so may be useful practically in general,
                                      //   esp. Fx is a template paratmeter typename
                that mfunc calls for its argument types in (A*,Y*), (B*,X*)
                          of which types the arguments are expected to be passed at exectution
                     will generate no call-resolution errors at runtime.
        */
        (*(Fx*)mfunc) ( i, (A*)nullptr, (Y*)nullptr);   //compile OK
        (*(Fx*)mfunc) ( i, (B*)nullptr, (X*)nullptr);   //compile OK
    //  (*(Fx*)mfunc) ( i, (B*)nullptr, (Y*)nullptr);   //compile error: call is ambiguous
    //  (*(Fx*)mfunc) ( i, (A*)nullptr, (X*)nullptr);   //compile error: no matching function
    //  (*(Fx*)mfunc) ( i, (A*)nullptr, (O*)nullptr);   //compile error: no matching function
    }
}
catch(const std::exception &e) { printf("\n%3d| exception : %s", i, e.what()); }


/* output **********************************************************************
real args    Fx called
  0| a y --> fAY
  1| a y --> fAY
 10| b x --> fBX
 11| b x --> fBX
100| exception : virtual-function error: no matching function or ambiguous call
200| exception : virtual-function error: no matching function or ambiguous call
300| exception : virtual-function error: argument type out of domain
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
void call (vane::multi_func<Fx> *mfunc, int &i, varg *a, varg *x);


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


void call (vane::multi_func<Fx> *mfunc, int &i, varg *a, varg *x) try
{
    (*mfunc)(i, a, x);

    if(0) {
        /* this block
           - will be optimized out when compiled optimized.
           - ensures at compile-time  //not 100% actually; but 100% in the above cases in main()
                                      //so may be useful practically in general,
                                      //   esp. Fx is a template paratmeter typename
                that mfunc calls for its argument types in (A*,Y*), (B*,X*)
                          of which types the arguments are expected to be passed at exectution
                     will generate no call-resolution errors at runtime.
        */
        (*(Fx*)mfunc) ( i, (A*)nullptr, (Y*)nullptr);   //compile OK
        (*(Fx*)mfunc) ( i, (B*)nullptr, (X*)nullptr);   //compile OK
    //  (*(Fx*)mfunc) ( i, (B*)nullptr, (Y*)nullptr);   //compile error: call is ambiguous
    //  (*(Fx*)mfunc) ( i, (A*)nullptr, (X*)nullptr);   //compile error: no matching function
    //  (*(Fx*)mfunc) ( i, (A*)nullptr, (O*)nullptr);   //compile error: no matching function
    }
}
catch(const std::exception &e) { printf("\n%3d| exception : %s", i, e.what()); }


/* output **********************************************************************
real args    Fx called
  0| a y --> fAY
  1| a y --> fAY
 10| b x --> fBX
 11| b x --> fBX
100| exception : virtual-function error: no matching function or ambiguous call
200| exception : virtual-function error: no matching function or ambiguous call
300| exception : virtual-function error: argument type out of domain
*/
```
