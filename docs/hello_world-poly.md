# hello_world  (polymorphism-based)

```c++
//file: hello_world-poly.cc
#include "vane.h"   //required
#include <stdio.h>


/* inheritance hierachy:
       Speak        What 
       /  \         /  \
   Hello  Open  World  Sesame
*/

struct Speak          { virtual ~Speak(){} };   //required: polymorphic base
struct Hello : Speak  { };
struct Open  : Speak  { };


struct What          { virtual ~What(){}  };    //required: polymorphic base
struct World : What  { };
struct Sesame: What  { };


////////////////////////////////////////////////////////////////////////////////
//co-class that defines the traits & function set for a multi-function
struct Fx
{
    //declare the type signature of the multi-function
    using type  = void (const char*, Speak*, What&);
                     // polymorphic (Speak*, What&) are the virtual parameters

    //argument type selectors:  eventually confines the specialized function set
    using domains = std::tuple<
        std::tuple<Speak, Hello, Open>,   //types for Speak*: must be one of them or their subclasses
        std::tuple<What,  World, Sesame>  //for What&
        >;

//specify argument-specialized functions:
    void operator()(const char *p, Speak*, What  &) { printf("%12s --> speak_what??\n", p);  } //f0
    void operator()(const char *p, Hello*, World &) { printf("%12s --> Hello_World \n", p);  } //f1
    void operator()(const char *p, Open *, Sesame&) { printf("%12s --> Open_Sesame \n", p);  } //f2
};


////////////////////////////////////////////////////////////////////////////////
template<typename Func>
void call_baseTyped(Func *func, const char *p, Speak *s, What &w)
{
    (*func) (p, s, w);
}

int main() try 
{
    vane::multi_func <Fx>   multi_func;
    vane::virtual_func <void (const char*, Speak*, What&)>
         *virtual_func = &multi_func;   //a multi_func is a virtual_func

    Fx  func;  //ordinary function object


    Hello  hello; 
    World  world;
    Open   open;
    Sesame sesame;

    call_baseTyped (       &func,         "func", &hello, world);
    call_baseTyped (       &func,         "func", &open,  sesame);
    call_baseTyped ( &multi_func,   "multi_func", &hello, world);
    call_baseTyped (virtual_func, "virtual_func", &open,  sesame);
}
catch(const std::exception &e) {
    fprintf(stderr,"\n\nexception : %s", e.what());
}

/* output **********************************************************************
        func --> speak_what??
        func --> speak_what??
  multi_func --> Hello_World 
virtual_func --> Open_Sesame 
*/
```
