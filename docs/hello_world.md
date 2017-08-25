# hello_world
&nbsp;  
&nbsp;  
&nbsp;



- multi-function
```c++
//file: hello_world-unary-poly.cc
#include "vane.h"   //required
#include <stdio.h>
using std::tuple;


struct Base         { virtual ~Base(){} };  //required: polymorphic base
struct Hello : Base { };
struct World : Base { };


////////////////////////////////////////////////////////////////////////////////
//co-class that defines the traits & function set for a multi-function
struct Fx
{
    //declares the type signature of the multi-function
    using type = void (const char*, Base&);
                     // polymorphic Base& is the virtual parameters
                     //    *,&,&& are supported;   also return type is supported

    //argument type selectors:  eventually confines the specialized function set
    using domains = tuple<
        tuple <Base, Hello, World> //types for Base& must be one of them or their subclasses
        >;

```
