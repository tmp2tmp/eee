# Vane

**---  A multiple-dispatch library for C++14 ---  
     + a bunch of meta-programming facilities**  
&nbsp;  
&nbsp;  
&nbsp;  
### Abstract
Vane implements multiple-dispatch in three ways  
based on the runtime types of the mutiple arguments of
- intact ordinary polymorphic classes
- wrapper classes of polymorphic classes that have the same base
- wrapper classes of arbitrary (including non-polymorphic or primitive) types  

None of them requires the existing class code to be modified.  
Vane is easy to use, requires no chaotic boilerplate devices to be put on the classes.  
**vane::multi\_func** itself is polymorphic  
; &nbsp;  you can change the whole behavior of a 'multi\_func' at runtime  
&nbsp; &nbsp; by simply replacing it with another instance of a different multi\_func class  
&nbsp; &nbsp; just as you can do with ordinary polymorphic class instances.  
Vane also includes meta-programming facilities that make meta-programming much easier.
&nbsp;  
&nbsp;  

****

### Introduction
[multiple dispatch (hello_world)](hello_world.md)  &nbsp; //basic syntax  
[shape collision](collide.md)  
&nbsp;  
&nbsp;
### Features
- simple & easy syntax  
- nargs  
- mathcing functions  
- [supports virtual & mutiple inheritance](diamond.md)  
- [replacing virtual functions at runtime](replacing-virtual-functions.md)  
&nbsp;  
&nbsp;
### More Usages
- varg<>  
  - [vt-make_shared](vt-make_shared.md)  
  - [vt-vars](vt-vars.md)  
&nbsp;  
&nbsp;
#### [more examples](examples.md)
[hello_world](hello_world.md)  
[hello_world-poly](hello_world-poly.md)  
[zzz](zzz.md)  
[xxx](xxx.md)  
[pre](pre.md)  
&nbsp;  
&nbsp;
#### [Resources & Referrences](resources.md)



