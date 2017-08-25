# xxx
&nbsp;  
&nbsp;  
&nbsp;  

```c++
//vg-make_shared.cc
#include "vane.h"   //required
#include <stdio.h>
#include <string>

using std::string;
using std::vector;
using std::tuple;


struct C {
    C(const char *c) : name(c) {}
    const char *name;
};

using varg = vane::varg <int, C, string, vector<int>>;


void print_fixed_typed (string &s, vector<int> &v, C &c, int &i);
void print_varged      (varg &s, varg &v, varg &c, varg &i);

//demonstrates std::make_shared'ed varg types
int main()
{
    std::unique_ptr <varg::of<int>>
         ip = vane::make_unique <int, varg>(1234);   //<--> std::make_unique <int>(1234)
    auto cp = vane::make_unique <C, varg>("ccccc");  //<--> std::make_unique <C>("ccccc")

    std::shared_ptr <varg::of<string>>
         sp = vane::make_shared <string, varg>("ssssss");
    auto vp = vane::make_shared <vector<int>, varg>(0,11,22,33);


    //as shared pointers:
    vp->push_back(999);

    printf("\ns=%s; c=%s; i=%d; v=|%d|...", sp->c_str(), cp->name, (int&)*ip, (*vp)[0] );
    print_fixed_typed (*sp, *vp, *cp, *ip);

    //as varg pointers:
    print_varged      (*sp, *vp, *cp, *ip);
}


////////////////////////////////////////////////////////////////////////////////

void print_fixed_typed(string &s, vector<int> &v, C &c, int &i) {
    printf("\ns=%s; c=%s; i=%d; v=|", s.data(), c.name, i);
    for(int x: v) printf("%d|", x);
}

void print_varged(varg &s, varg &v, varg &c, varg &i)  //just an argument-varg'ed printer only for demonstration
try {
    struct Fx {
        using type = void (varg*, varg*, varg *, varg*);
        using domains = tuple <tuple<string>, tuple<vector<int>>, tuple<C>, tuple<int>>;

        void operator()(string *s, vector<int> *v, C *c, int *i) {
            print_fixed_typed(*s, *v, *c, *i);
            printf(" ----from print_varged()");
        }
    };

    vane::multi_func<Fx>()(&s, &v, &c, &i);
}
catch( std::exception &x ) { printf("\nexception: %s\n", x.what()); }

/* output **********************************************************************
s=ssssss; c=ccccc; i=1234; v=|0|...
s=ssssss; c=ccccc; i=1234; v=|0|11|22|33|999|
s=ssssss; c=ccccc; i=1234; v=|0|11|22|33|999| ----from print_varged()
*/
```
