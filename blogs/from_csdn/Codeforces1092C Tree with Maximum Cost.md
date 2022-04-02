---
title: Codeforces1092C Tree with Maximum Cost
date: 2018-12-19
tags:
 - 

categories:
 - 树上算法

---

题目链接:http://codeforces.com/contest/1092/problem/F

题意：给出一棵有n个节点的树， 每个节点有一个正整数权值$a[i]$，每条边的长度为1，让你找一个点$v$，使得$\sum_{i=1}^{n}{a[i] * dis(i,v)}$的值最大($dis(i,v)是i到v的距离$)

思路：昨天晚上十二点多敲的时候真的呆，以为是类似求树的重心那样，找最大子树最大的那个点(树的重心是最大子树最小)。敲完试了下两个样例都过了，一交，wa on test3，巨尴尬=_=。
树重心只考虑了路径距离之和最小，没考虑到点的权值。今早想出来的解法是：先随便选一个基点v，求出$\sum_{i=1}^{n}{a[i] * dis(i,v)}$，然后从这个点开始往子树$dfs$。
如果**把基点往子树移动**，显然**子树部分的所有点都少算了一次**，**除子树外的所有点则多算了一次**。只要预处理出子树的点权之和，就可以$O(1)$转移。做一遍$O(n)$的$dfs$即可得出答案。

代码:

```c
#include <iostream>
#include <cstdio>
#include <algorithm>
#include <cstring>
#include <vector>

using namespace std;
const int maxn = 200000 + 10;
int n, a[maxn];
vector<int> G[maxn];

int dis[maxn];
long long sum[maxn];

void dfs1(int u, int fa)
{
    dis[u] = dis[fa] + 1;
    sum[u] = a[u];
    for (auto v:G[u])
    {
        if (v == fa) continue;
        dfs1(v, u);
        sum[u] += sum[v];
    }
}

long long ans, tot;

void dfs2(int u, int fa, long long s)
{
    s = s - sum[u] + tot - sum[u];
    ans = max(s, ans);
    for (auto v:G[u])
    {
        if (v == fa) continue;
        dfs2(v, u, s);
    }
}

int main()
{
    scanf("%d", &n);
    int u, v;
    tot = 0;
    for (int i = 1; i <= n; ++i)
    {
        scanf("%d", &a[i]);
        tot += a[i];
    }
    for (int i = 0; i < n - 1; ++i)
    {
        scanf("%d%d", &u, &v);
        G[u].emplace_back(v);
        G[v].emplace_back(u);
    }
    dis[0] = -1;
    dfs1(1, 0);
    long long t = 0;
    for (int i = 1; i <= n; ++i)
        t += 1ll * a[i] * dis[i];//t是以1为基点的答案
    ans = t;
    for (auto v:G[1])
        dfs2(v, 1, t);
    printf("%lld\n", ans);
    return 0;
}
```


