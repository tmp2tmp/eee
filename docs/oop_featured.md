# Virtual functions as function objects
&nbsp;  
&nbsp;  
&nbsp;
### Open methods as function objects

Vane implements open multi-methods as function objects.  

Thanks to C++, unlike other languages, C++ allows overloading function call operators,
and this feature alllows implementing free-standing functions as member functions
- i.e. member functions that have the interfaces of non-member funtions and can be used 
	in the contexts where ordinay functions of the same signatures can be used.


Implementing multi-methods as function objects has advantages over implementing as global/module functions:  
- Function specializations can be confined and managed more conveniently
  than of global/module functions which have only ```namespace``` as a confining measure.
- Instance specific data can be associated to each function object
  while global/module functions can have only common global/static data.
- Specialization function sets can be defined reusing existing code easily by inheritance.
- Forcing static dispatch can easily be done using the inherited static dispatch interface of the base class:  
  this also can be used, for [example](runtime_errors.md),
  to check at compile time whether or not a specific combination of argument types
  has an available specialization.
- and just all the other OOP features.


&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;
### Double virtual
C++ directly supports runtime dispatch on a single argument via C++ <code><b>virtual</b></code> functions.
Being that the functions - whose calls are dispatched at runtime based on the dynamic type of single one of the arguments -
  are virtual,
&nbsp; it's consistent with it that the functions - whose calls are dispatched at runtime based on the dynamic types of two or more of the arguments -
	are called virtual.
: vane::multi\_func is virtual on multiple argument types.


And a vane::multi\_func itself - as a parameter passed as `this' pointer - is a virtual argument.  
: this gives the virtual function objects polymorphism of specialization sets
  - i.e. a virtual function object [can be replaced at runtime](replacing-virtual-functions.md)
     switching the whole set of specializations.


