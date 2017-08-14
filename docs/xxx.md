---
code-width: 106ex
---

# xxx.md------

---
---
```c++
#include "vane.h"   //required
#include <stdio.h>
#include <string>

using std::tuple;
using std::string;
using std::vector;


struct C {
    const char *name;
    C(const char *c) : name(c) {}
};

using varg = vane::varg <int ,C, string, vector<int>>;


////////////////////////////////////////////////////////////////////////////////
void print_Ts(string &s, vector<int> &v, C &c, int &i) {
    printf("\ns=%s; c=%s; i=%d; v=|", s.data(), c.name, i);
    for(int x: v) printf("%d|", x);
}

void print_Vs(varg &s, varg &v, varg &c, varg &i)
try {
    struct Fx {
        using type = void (varg*, varg*, varg *, varg*);
        using domains = tuple<tuple<string>, tuple<vector<int>>, tuple<C>, tuple<int>>;

        void operator()(string *s, vector<int> *v, C *c, int *i) {
            print_Ts(*s, *v, *c, *i);
            printf(" ----from print_Vs()");
        }
    };

    vane::multi_func<Fx>()(&s, &v, &c, &i);
}
catch( std::exception &x ) { printf("\nexception: %s\n", x.what()); }


int main()
{
    std::unique_ptr <varg::of<int>> 
         ip = vane::make_unique <int, varg>(1234);
    auto cp = vane::make_unique <C, varg>("ccccc");

    std::shared_ptr <varg::of<string>>
         sp = vane::make_shared <string, varg>("ssssss");
    auto vp = vane::make_shared <vector<int>, varg>(0,11,22,33);

    vp->push_back(999);

    printf("\ns=%s; c=%s; i=%d; v=|%d|...", sp->c_str(), cp->name, (int&)*ip, (*vp)[0] );

    print_Ts(*sp, *vp, *cp, *ip);
    print_Vs(*sp, *vp, *cp, *ip);
}

/* output **********************************************************************
s=ssssss; c=ccccc; i=1234; v=|0|...
s=ssssss; c=ccccc; i=1234; v=|0|11|22|33|999|
s=ssssss; c=ccccc; i=1234; v=|0|11|22|33|999| ----from print_Vs()
*/


```
