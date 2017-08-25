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
struct World : Base { };-----------------
```
