# hello_world
&nbsp;  
&nbsp;  
&nbsp;
- multi-function by polymorphic arguments
```c++
//file: hello_world-unary-poly.cc
#include "vane.h"   //required
#include <stdio.h>
using std::tuple;


struct Hello          { virtual ~Hello(){} };   //required: polymorphic base
struct World : Hello  { };


////////////////////////////////////////////////////////////////////////////////
//co-class that defines the traits & function set for a multi-function
struct Fx
{
    //declares the type signature of the multi-function
    using type = void (const char*, Hello&);
                     // polymorphic Hello& is the virtual parameters
                     //    *,&,&& are supported;   also return type is supported

    //argument type selectors:  eventually confines the specialized function set
    using domains = tuple<
        tuple <Hello, World> //types for Hello& must be one of them or their subclasses
        >;

//specify argument-specialized functions:
    void operator()(const char *p, Hello &) { printf("%12s --> Hello\n", p);  } //f0
    void operator()(const char *p, World &) { printf("%12s --> World\n", p);  } //f1
};


////////////////////////////////////////////////////////////////////////////////
template<typename Func>
void call_test_baseTyped(Func *func, const char *p, Hello &h) {
    (*func) (p, h);
}

int main() try 
{
    vane::multi_func <Fx>   multi_func;
    vane::virtual_func <void (const char*, Hello&)>
         *virtual_func = &multi_func;

    Fx  func;  //ordinary function object


    Hello  hello; 
    World  world;

    call_test_baseTyped (       &func,         "func", hello);
    call_test_baseTyped (       &func,         "func", world);
    call_test_baseTyped ( &multi_func,   "multi_func", hello);
    call_test_baseTyped ( &multi_func,   "multi_func", world);
    call_test_baseTyped (virtual_func, "virtual_func", hello);
    call_test_baseTyped (virtual_func, "virtual_func", world);
}
catch(const std::exception &e) { fprintf(stderr,"\n\nexception : %s", e.what()); }

/* output **********************************************************************
        func --> Hello
        func --> Hello
  multi_func --> Hello
  multi_func --> World
virtual_func --> Hello
virtual_func --> World
*/
```


