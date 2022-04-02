---
title: C++map(unordered_map) 的小于号
date: 2019-07-09
tags:
 - 

categories:
 - C++语法

---

之前打题的时候想从一个map中取出值最大的元素
然后顺手就写了

```c
    auto mx = max_element(mp.begin(), mp.end());
```
然后怎么调都调不出来样例=_=

后来冷静分析了一下
$map<T1, T2>$中的每个元素都是$pair<T1, T2>$，
所以$max\_element$调用的应该是$pair<T1, T2>$的小于号
即先比较$first$， 再比较$second$
看了下源码果然如此
(在stl_pair.h中)
```c
template<class _T1, class _T2>
    inline _GLIBCXX_CONSTEXPR bool
    operator<(const pair<_T1, _T2>& __x, const pair<_T1, _T2>& __y)
    { 
    	return __x.first < __y.first
	     || (!(__y.first < __x.first) && __x.second < __y.second); 
	}
```
所以想取出值最大的元素，需要给$max\_element$传入一个$cmp函数$

```c
    auto mx = max_element(mp.begin(), mp.end(), [](const pair<int, int> &x, const pair<int, int> &y){
        return x.second < y.second;
    });
```
传入的$cmp$定义的是$operator<$，注意别写反

