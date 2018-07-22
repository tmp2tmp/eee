# [Vane](https://tmp2tmp.github.io/eee/)

**---  A multiple-dispatch library for C++14 ---  
     + meta-programming facilities**  
&nbsp;  
&nbsp;  
&nbsp;  
### Abstract
Vane implements multiple-dispatch in three ways  
based on the runtime types of the mutiple arguments of
- intact ordinary polymorphic classes or
- wrapper classes of polymorphic classes that have the same base or
- wrapper classes of arbitrary (including non-polymorphic or primitive) types  

None of them requires the existing class code to be modified.  
Vane is easy to use, requires no chaotic boilerplate devices to be put on the classes.  
**vane::multi\_func** itself is polymorphic &nbsp;  
; &nbsp;  you can change the whole behavior of a 'multi\_func' at runtime  
&nbsp; &nbsp; by simply replacing it with another instance of a different multi\_func class  
&nbsp; &nbsp; just as you can do with ordinary polymorphic class instances.  
Vane also includes meta-programming facilities that make meta-programming much easier.
&nbsp;  
&nbsp;  

****

### Introduction
[Implementing multiple dispatch - basic syntax](https://tmp2tmp.github.io/eee/hello_world.html)  
[Shape collision](https://tmp2tmp.github.io/eee/collide.html)  
&nbsp;  

### Features
- Simple & easy syntax : &nbsp; No need to attach complicated distracting unwieldy gears to existing class code. There are no messy macro things.
- [Function call resolutoin is supported](https://tmp2tmp.github.io/eee/call_resolution.html) : &nbsp; 
  Runtime function call resolutoin based on the inheritance hierarchies of the argument types is supported.
- Arbitrary number of virtual/non-virtual arguments can be arbitrarily mixed.  
  &nbsp; Three sorts of virtual parameters of Vane can also be freely mixed.
- [Virtual & mutiple inheritance](https://tmp2tmp.github.io/eee/diamond.html)  virtual argument types are supported.
- [Covariant return types are supported.](https://tmp2tmp.github.io/eee/covariant_return_types.html)
- Virtual functions are [implemented as function `objects'](https://tmp2tmp.github.io/eee/oop_featured.html).
- Virtual function objects are polymorphic:  
  [can be replaced at runtime](https://tmp2tmp.github.io/eee/replacing_virtual_functions.html) switching the whole set of specializations.

&nbsp;  

### More Usages
<!--
- [utility &nbsp; for std::shared_ptr](https://tmp2tmp.github.io/eee/make_shared.html)  
- [std::shared_ptr &nbsp; utility](https://tmp2tmp.github.io/eee/make_shared.html)  
- [```make_shared utility```](https://tmp2tmp.github.io/eee/make_shared.html)  
- [using with &nbsp; std::shared_ptr](https://tmp2tmp.github.io/eee/make_shared.html)  
- forcing static dispatch / calling base implementations
-->
- [runtime errors](https://tmp2tmp.github.io/eee/runtime_errors.html)
- [make_shared &nbsp;utility](https://tmp2tmp.github.io/eee/make_shared.html)  
- [vt-vars](https://tmp2tmp.github.io/eee/vt-vars.html)  
&nbsp;  


### [Resources & Referrences](https://tmp2tmp.github.io/eee/resources.html)



