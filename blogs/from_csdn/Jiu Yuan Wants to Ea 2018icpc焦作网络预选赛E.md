---
title: Jiu Yuan Wants to Ea 2018icpc焦作网络预选赛E
date: 2018-09-17
tags:
 - 

categories:
 - 数据结构,树上算法

---

题目链接：https://nanti.jisuanke.com/t/31714
题意 ：一棵树，n个点，初值均为0，有四个操作:
1 u v x 把u v路径上所有点乘以x
2 u v x 把u v路径上所有点加上x
3 u v    把u v路径上所有点的值按位取反
4 u v    查询u v路径上所有点的和
答案 % $2^{64}$后输出

分析：
除了3，1 2 4就是裸轻重链剖分 + 线段树维护区间和
赛后看了别人的题解才知道怎么处理3。取反就等价于$*$$-1$再$-1$
$2^{64}$也不用模的，用unsigned long long直接自然溢出就好了...

pushdown的时候要想清楚乘和加的先后，
每次初始化一定要根据n来。 全初始化T成智障...

```
#include <cstdio>
#include <vector>
#include <algorithm>
#include <cstring>

using namespace std;
const int maxn = (int)1e5 + 5;
typedef unsigned long long ull;
const ull inf = (1 << 64) - 1;
int N,fa[maxn],M;
vector<int> G[maxn];

int deep[maxn], son[maxn], siz[maxn];
void dfs1(int u)
{
    siz[u] = 1;
    son[u] = 0;
    deep[u] = deep[fa[u]] + 1;
    for (int v:G[u])
    {
        dfs1(v);
        siz[u] += siz[v];
        if (siz[v] > siz[son[u]])
            son[u] = v;
    }
}

int top[maxn],id[maxn],cnt;
void dfs2(int u,int t)
{
    top[u] = t;
    id[u] = ++cnt;
    if (son[u])
        dfs2(son[u],t);

    for (int v:G[u])
    {
        if (v != son[u] && v != fa[u])
            dfs2(v,v);
    }
}

#define ls l,m,rt<<1
#define rs m+1,r,rt<<1|1
ull sum[maxn<<2],add[maxn<<2],mult[maxn<<2],rev[maxn<<2];

void pushdown(int rt,int l,int r)
{
    add[rt<<1] *= mult[rt],   add[rt<<1] += add[rt];
    add[rt<<1|1] *= mult[rt], add[rt<<1|1] += add[rt];
    mult[rt<<1] *= mult[rt];
    mult[rt<<1|1] *= mult[rt];

    sum[rt<<1] *= mult[rt], sum[rt<<1] += add[rt] * l;
    sum[rt<<1|1] *= mult[rt], sum[rt<<1|1] += add[rt] * r;

    add[rt] = 0;
    mult[rt] = 1;
}

void update(int L,int R,ull v,int l,int r,int rt,int op)
{
    if(L <= l && r <= R)
    {
        if(op == 1)
            sum[rt] *= v, mult[rt] *= v, add[rt] *= v;
        else if(op == 2)
            sum[rt] += (ull)(r-l+1)*v, add[rt] += v;
        else if(op == 3)
        {
            sum[rt] *= inf, sum[rt] += (r-l+1)*inf;
            add[rt] *= inf, add[rt] += inf;
            mult[rt] *= inf;
        }
        return ;
    }
    int m = l + r >> 1;
    pushdown(rt,m-l+1,r-m);
    if (L <= m)
        update(L,R,v,ls,op);
    if(R > m)
        update(L,R,v,rs,op);
    sum[rt] = sum[rt<<1] + sum[rt<<1|1];
}

ull query(int L,int R,int l,int r,int rt)
{
    if(L <= l && r <= R)
        return sum[rt];
    int m = l + r >> 1;
    pushdown(rt,m-l+1,r-m);
    ull ans = 0;
    if (L <= m)
        ans += query(L,R,ls);
    if(R > m)
        ans += query(L,R,rs);
    return ans;
}

void upd(int u,int v,int op,ull val = 0)
{
    while(top[u] != top[v])
    {
        if(deep[top[u]] < deep[top[v]])
            swap(u,v);
        update(id[top[u]],id[u],val,1,cnt,1,op);
        u = fa[top[u]];
    }
    if(deep[u] > deep[v])
        swap(u,v);
    update(id[u],id[v],val,1,cnt,1,op);
}

ull que(int u,int v)
{
    ull ans = 0;
    while(top[u] != top[v])
    {
        if(deep[top[u]] < deep[top[v]])
            swap(u,v);
        ans += query(id[top[u]],id[u],1,cnt,1);
        u = fa[top[u]];
    }
    if(deep[u] > deep[v])
        swap(u,v);
    ans += query(id[u],id[v],1,cnt,1);
    return ans;
}

void build(int l,int r,int rt)
{
    sum[rt] = add[rt] = 0;
    mult[rt] = 1;
    if(l == r)
        return ;
    int m = l + r >> 1;
    build(ls);
    build(rs);
}

void init()
{
    cnt = 0;
}

int main()
{
    int op,l,r;
    ull val;
    while (scanf("%d",&N) != EOF)
    {
        init();
        for (int i = 2; i <= N; ++i)
        {
            scanf("%d",&fa[i]);
            G[fa[i]].emplace_back(i);
        }

        scanf("%d",&M);
        dfs1(1);
        dfs2(1,1);
        build(1,cnt,1);
        while (M--)
        {
            scanf("%d%d%d",&op,&l,&r);
            if(op != 4)
            {
                if(op != 3)
                    scanf("%llu",&val);
                upd(l,r,op,val);
            }
            else
                printf("%llu\n",que(l,r));
        }
        for(int i=1;i<=N;++i)
            G[i].clear();
    }
    return 0;
}

```


