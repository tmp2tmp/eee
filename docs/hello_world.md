# hello_world
&nbsp;  
&nbsp;  
&nbsp;  
- multi_func by just polymorphic arguments

```c++
//file: hello_world-poly.cc
#include "vane.h"   //required
#include <stdio.h>
using std::tuple;
    

struct Base         { virtual ~Base(){} };  //required: polymorphic base
struct Hello : Base { };
struct World : Base { };


////////////////////////////////////////////////////////////////////////////////
//co-class that defines the traits & function set for a multi_func
struct Fx
{
    //declares the type signature of the multi_func
    using type = void (const char*, Base&);
                     // polymorphic Base& is the virtual parameters
                     //    *,&,&& are supported;   also return type is supported

    //argument type selectors:  eventually confines the specialized function set
    using domains = tuple<
        tuple <Base, Hello, World> //types for Base& must be one of them or their subclasses
        >;

//specify argument-specialized functions:
    void operator()(const char *p, Base  &) { printf("%12s --> Base??\n", p);  } //f0
    void operator()(const char *p, Hello &) { printf("%12s --> Hello \n", p);  } //f0
    void operator()(const char *p, World &) { printf("%12s --> World \n", p);  } //f1
};


////////////////////////////////////////////////////////////////////////////////
template<typename Func>
void call_test_baseTyped(Func *func, const char *p, Base &h) {
    (*func) (p, h);
}

int main() try 
{
    vane::multi_func <Fx>   multi_func;
    vane::virtual_func <void (const char*, Base&)>
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
        func --> Base??
        func --> Base??
  multi_func --> Hello 
  multi_func --> World 
virtual_func --> Hello 
virtual_func --> World 
*/
```
&nbsp;  

- by wrapper class \_virtual&lt;&gt;

```c++
//file: hello_world-virt.cc
#include "vane.h"   //required
#include <stdio.h>
using std::tuple;
using vane::_virtual;  //for _virtual <Hello>

struct Base         { virtual ~Base(){} };  //required: polymorphic base
struct Hello : Base { };
struct World : Base { };


////////////////////////////////////////////////////////////////////////////////
//co-class that defines the traits & function set for a multi_func
struct Fx
{
    //declares the type signature of the multi_func
    using type = void (const char*, _virtual<Base>*);
                     // _virtual<Base>* is the virtual parameters
                     //    current only pointer types are supported; return type is supported

    //argument type selectors:  eventually confines the specialized function set
    using domains = tuple<
        tuple <Base, Hello, World> //types for Hello& must be one of them or their subclasses
        >;

//specify argument-specialized functions:
    void operator()(const char *p, Base* ) { printf("%12s --> Base??\n", p);  } //f0
    void operator()(const char *p, Hello*) { printf("%12s --> Hello \n", p);  } //f0
    void operator()(const char *p, World*) { printf("%12s --> World \n", p);  } //f1
};


////////////////////////////////////////////////////////////////////////////////
template<typename Func>
void call_test_baseTyped(Func *func, const char *p, _virtual<Base> *b) {
    (*func) (p, b);
}

void call_test_baseTyped(Fx *func, const char *p, Base *b) {
    (*func) (p, b);
}

int main() try 
{
    vane::multi_func <Fx>   multi_func;
    vane::virtual_func <void (const char*, _virtual<Base>*)>
         *virtual_func = &multi_func;

    Fx  func;  //ordinary function object


    _virtual<Base>::of<Hello>  hello; 
    _virtual<Base>::of<World>  world;

    call_test_baseTyped (       &func,         "func", &hello);
    call_test_baseTyped (       &func,         "func", &world);
    call_test_baseTyped ( &multi_func,   "multi_func", &hello);
    call_test_baseTyped ( &multi_func,   "multi_func", &world);
    call_test_baseTyped (virtual_func, "virtual_func", &hello);
    call_test_baseTyped (virtual_func, "virtual_func", &world);
}
catch(const std::exception &e) { fprintf(stderr,"\n\nexception : %s", e.what()); }

/* output **********************************************************************
        func --> Base??
        func --> Base??
  multi_func --> Hello 
  multi_func --> World 
virtual_func --> Hello 
virtual_func --> World 
*/
```



