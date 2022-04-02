---
title: 2018年华工校赛E——Youhane Assembler
date: 2018-04-09
tags:
 - 

categories:
 - 字符串

---

题目主干如下：
链接：https://www.nowcoder.com/acm/contest/94/E
来源：牛客网

我们给出一个字符串的集合，在这个集合中有个字符串，编号为的字符串的长度为。我们给出个查询，每个查询是一个整数对，表示我们假定号串在左边，号串在右边，我们要查询的是最大的长度使号串的前缀与号串的后缀相等。
如我们有串："ACGT"、"AACCGGTT"、“AAAA”，则查询(2,3)的结果为0，因为"AAAA"在右面欲与左面的"AACCGGTT"进行拼接，显然并没有公共的前后缀区域可以使两串拼接。而查询(3,2)的结果为2，因为此时“AAAA”放在了左面欲与右面的"AACCGGTT"拼接，这时有最长的公共区域"AA"。
输入描述:
多文件，多数据，每个文件中只会有一组测试数据。
对于每组数据：
* 第一行，是一个整数表示有多少个串。
* 接下来的行，每行是一个DNA串，只由"ACGT"这四个大写英文字母组成。
* 接下来的一行，是一个整数，表示查询的个数。
* 接下来的`$Q$`行，每行有两个整数表示查询的整数对，含义请参见题目描述。
* 所有的DNA串长度加和不会超过。
输出描述:
对于每组查询，输出一个整数，表示答案，独占一行。
示例1
输入

3
AAAA
ACGT
AACCGGTT
12
1 1
1 2
1 3
2 2
2 3
3 3
3 3
3 2
3 1
2 2
2 1
1 1
输出

4
1
2
4
0
8
8
0
0
4
0
4

比赛的时候想着自己不会后缀树，凉了凉了，回来看到网上大佬的代码，是真的强无敌，自己对kmp还是不理解啊。
大佬的思路: 把提供后缀的串接在提供前缀的串前面，得到新串str，求str的next数组，next[str.length]就是最长相同前后缀的长度，为了防止拼接后的字符串越过两个原串的边界，在中间加一个唯一的字符隔开,即str = r + '#' + l，这样跨越了#的前后缀就不可能相同了;

代码如下:

```
#include<bits/stdc++.h>
using namespace std;
 
string a[300005],str;
int Next[300005];
int N,Q,l,r;
 
void getNext(int len)
{
    int j=0,k=-1;
    Next[0] = -1;
    while(j<len)
        if(k==-1||str[j]==str[k])
            Next[++j] = ++k;
        else
            k = Next[k];
}
 
int main()
{
    ios::sync_with_stdio(false);
    cin>>N;
    for(int i=1;i<=N;i++)
        cin>>a[i];
    cin>>Q;
    while(Q--)
    {
        cin>>l>>r;
        str = a[r] + '*' + a[l];
        getNext(str.length());     
        cout<<Next[str.length()]<<endl;
    }  
    return 0;
}
```
以后要谨记: next数组存的是该位置最长相同前后缀的长度。 只是背下kmp，或是把模板带去是没用的。。根本不可能有裸题的嘛QAQ

