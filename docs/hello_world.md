# hello_world
&nbsp;  
&nbsp;  
&nbsp;

- multi-function by wrapper class _virtual<>
```c++
//file: hello_world-unary-virt.cc
#include "vane.h"   //required
#include <stdio.h>
using std::tuple;
using vane::_virtual;  //for _virtual <Hello>

struct Base         { virtual ~Base(){} };  //required: polymorphic base
struct Hello : Base { };
struct World : Base { };


////////////////////////////////////////////////////////////////////////////////
//co-class that defines the traits & function set for a multi-function
struct Fx
{
    //declares the type signature of the multi-function
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

```
