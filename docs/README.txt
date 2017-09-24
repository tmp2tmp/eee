[multiple dispatch (hello_world)](hello_world.md)  &nbsp; //basic syntax  

<!--    - [Virtual functions can be replaced at runtime](replacing-virtual-functions.md) is supported //polymorphism  -->
<!--    - [Replacing virtual functions at runtime](replacing-virtual-functions.md) is supported //polymorphism  -->
<!-- or for [calling the base implementations](calling_base_implementations) of a virtual function.  -->
<!-- - function pointers are easily implemented as function object pointers.      -->

    - Inheritance gives easy means for [forcing static dispatch](forcing_static_dispatch.md)<!-- accessing individual implementatins -->
 &nbsp; <!-- polymorphism, inheritance etc-->

- Function specializations can be confined and maintained more conveniently than of global/module functions which have only namespace as a confining measure.
------------------------------------------------------------------------------------
  - Virtual functions are [implemented as function `objects'](oop_featured.md):  
    OOP features can be taken advantage of on the virtual function objects
  - OOP features can be taken advantage of on the virtual function objects: &nbsp; esp. polymorphism, inheritance...
	  - Function specializations can be confined and maintained more conveniently than of global/module functions.<!-- which have only namespace as a confining measure.-->
	  - Virtual function objects are polymorphic:  
		[can be replaced at runtime](replacing_virtual_functions.md) switching the whole set of specializations.
	  - Specialization function sets can be defined reusing existing code easily by inheritance.
	  - Instance specific data can be associated to each function object while global/module functions can have only common global/static data.

