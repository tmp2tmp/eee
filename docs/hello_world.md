# hello_world
&nbsp;  
&nbsp;  
&nbsp;  

<p class='_on_ul'>
Given a set of functions,
determining at runtime which one in the set to call - based on the types of the multiple arguments -
is multiple dispatch.
It corresponds to mapping from the possible lists of the argument types to the functions to be called.
Each argument can be assigned the set of the possible types that it can be of.
In Vane we call it the <strong>type domain of the virtual argument</strong>.
Vane searches the argument type list space confined by the user-given argument type domains,
for the possible functions in the user-given function set, and makes the mapping table at compile time.<br>
Specifying this is through a co-class defining three parts:
</p>
<ul>
<li>declaring the type signature of the virtual function as in:   
   <pre class='_code'>using <strong>type</strong> = int(char*, Base1*, Base2&, Base3&&);</pre>
</li>
<li>defining what type each virtual artument can be of, like:   
<pre class='_code'>using <strong>domains</strong> = tuple &lt;domain1, domain2, domain3&gt;
//where domain1 = tuple &lt;Base1,Drived1,Drived2...&gt;
//      domain2....</pre>
</li>
<li>specifing the function set as member operators of the co-class like: 
<pre class='_code'>int <strong>operator()</strong> (char*,Base1*,Deived1*,Deive2*){...} 
//and more....</pre>
</li>
</ul>
&nbsp;  
&nbsp;  


<p class='_on_ul'>
Vane has three ways of multi-dispathcing according to the types of the virtual arguments.
</p>



- multi-dispaching by polymorphic class arguments (by-poly in short)  
  Any argument type of intact ordinary classes is OK if only it's polymorphic.  
  slowest
- by _virtual<>-wrapped typed arguments (by-virt)  
  Any argument type of intact ordinary classes that is wrapped with _virtual<> is OK if only it's polymorphic.  
  much faster than by-poly.
- by varg<>-wrapped typed arguments (by-varg)  
  Any arbitrary (including non-polymorphic or primitive) type of arguments is OK.  
  fastest;  
  slightly (about 8~15%) faster in general, or much faster when with virtual bases than by-virt  
  But the established type domains of the arguments cannot be altered/replaced.
&nbsp;  
&nbsp;  

#### hello_world's
```c++
//file: hello_world-poly.cc
#include "vane.h"   //required
#include <stdio.h>
using std::tuple;
    

struct Base         { virtual ~Base(){} };  //required: polymorphic base
struct Hello : Base { };
struct World : Base { };


////////////////////////////////////////////////////////////////////////////////
//co-class that defines the traits & function set for the multi_func
struct Fx
{
    //declares the type signature of the multi_func
    using type = void (const char*, Base&);
                     // polymorphic Base& is the virtual parameter
                     //    *,&,&& are supported;   also return types are supported

    //argument type selectors:  eventually confines the specialized function set
    using domains = tuple<
        tuple <Base, Hello, World> //types for Base& must be one of them or their subclasses
        >;

//specify argument-specialized functions:
    void operator() (const char *p, Base  &) { printf("%12s --> Base??\n", p);  } //f0
    void operator() (const char *p, Hello &) { printf("%12s --> Hello \n", p);  } //f1
    void operator() (const char *p, World &) { printf("%12s --> World \n", p);  } //f2
};


////////////////////////////////////////////////////////////////////////////////
template<typename Func>
void call_test_baseTyped(Func *func, const char *p, Base &base) {
    (*func) (p, base);
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
catch(const std::exception &e) { fprintf(stderr,"\nexception : %s", e.what()); }

/* output **********************************************************************
        func --> Base??
        func --> Base??
  multi_func --> Hello 
  multi_func --> World 
virtual_func --> Hello 
virtual_func --> World 
*/
```

```c++
//file: hello_world-virt.cc
#include "vane.h"   //required
#include <stdio.h>
using std::tuple;
using vane::_virtual;  //for _virtual <Base>

struct Base         { virtual ~Base(){} };  //required: polymorphic base
struct Hello : Base { };
struct World : Base { };


////////////////////////////////////////////////////////////////////////////////
//co-class that defines the traits & function set for the multi_func
struct Fx
{
    //declares the type signature of the multi_func
    using type = void (const char*, _virtual<Base>*);
                     // _virtual<Base>* is the virtual parameter
                     //    currently only pointer types are supported; return types are supported

    //argument type selectors:  eventually confines the specialized function set
    using domains = tuple<
        tuple <Base, Hello, World> //types for _virtual<Base>* must be one of them or their subclasses
        >;

//specify argument-specialized functions:
    void operator() (const char *p, Base* ) { printf("%12s --> Base??\n", p);  } //f0
    void operator() (const char *p, Hello*) { printf("%12s --> Hello \n", p);  } //f1
    void operator() (const char *p, World*) { printf("%12s --> World \n", p);  } //f2
};


////////////////////////////////////////////////////////////////////////////////
template<typename Func>
void call_test_baseTyped(Func *func, const char *p, _virtual<Base> *base) {
    (*func) (p, base);
}

void call_test_baseTyped(Fx *func, const char *p, Base *base) {
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
catch(const std::exception &e) { fprintf(stderr,"\nexception : %s", e.what()); }

/* output **********************************************************************
        func --> Base??
        func --> Base??
  multi_func --> Hello 
  multi_func --> World 
virtual_func --> Hello 
virtual_func --> World 
*/
```

```c++
//file: hello_world-varg.cc
#include "vane.h"   //required
#include <stdio.h>
using std::tuple;


struct Hello { };
struct World { };

using varg = vane::varg <Hello, World, int, std::string>;   //group arbitrarily

////////////////////////////////////////////////////////////////////////////////
//co-class that defines the traits & function set for the multi_func
struct Fx
{
    //declares the type signature of the multi_func
    using type = void (const char*, varg*);
                     // varg* is the virtual parameter
                     //    currently only pointer types are supported; return types are supported

    //argument type selectors:  eventually confines the specialized function set
    using domains = tuple<
        tuple <Hello, World, int, std::string> //types for varg* must be one of them or their subclasses
        >;

//specify argument-specialized functions:
    void operator() (const char *p, Hello*)         { printf("%13s --> Hello \n", p);  } //f0
    void operator() (const char *p, World*)         { printf("%13s --> World \n", p);  } //f1
    void operator() (const char *p, int *i)         { printf("%13s --> %d\n", p, *i);  } //f2
    void operator() (const char *p, std::string *s) { printf("%13s --> %s\n", p, s->c_str());  } //f3
};


////////////////////////////////////////////////////////////////////////////////
template<typename Func>
void call_test_uniformTyped(Func *func, const char *p, varg *varg) {
    (*func) (p, varg);
}

int main() try 
{
    vane::multi_func <Fx>   multi_func;
    vane::virtual_func <void (const char*, varg*)>
         *virtual_func = &multi_func;

    Fx  func;  //ordinary function object


    varg::of<Hello>   hello; 
    varg::of<World>   world;
    varg::of<int>          number{3};
    varg::of<std::string>  string{"ways of multi-functioning"};

    call_test_uniformTyped ( &multi_func,   "multi_func", &hello);
    call_test_uniformTyped ( &multi_func,   "multi_func", &world);
    call_test_uniformTyped (virtual_func, "virtual_func", &hello);
    call_test_uniformTyped (virtual_func, "virtual_func", &world);
    call_test_uniformTyped ( &multi_func,   "multi_func", &number);
    call_test_uniformTyped (virtual_func, "virtual_func", &string);

    func("func(&hello )", &hello);        //varg<>'s of struct/class types are compatible with the existing code
    func("func(&number)", &(int&)number); //varg<>'s of non-struct/class types are not compatible; need type-cast
    func("func(&string)", &string);
}
catch(const std::exception &e) { printf("\nexception : %s", e.what()); }

/* output **********************************************************************
   multi_func --> Hello 
   multi_func --> World 
 virtual_func --> Hello 
 virtual_func --> World 
   multi_func --> 3
 virtual_func --> ways of multi-functioning
func(&hello ) --> Hello 
func(&number) --> 3
func(&string) --> ways of multi-functioning
*/
```


