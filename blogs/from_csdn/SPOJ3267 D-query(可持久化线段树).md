---
title: SPOJ3267 D-query(可持久化线段树)
date: 2018-07-18
tags:
 - 

categories:
 - 数据结构

---

题意: 输入N个数字，查询区间[L,R]中有多少个不同的数字
	(第i个数字为a[i])
	思路：要维护的是不同的数字的数量，所以每个数只记最后出现的那一次。对N个位置每个位置建一棵线段树，线段树维护的是插入
	a[i]后树上各区间数字的数量。如果a[i]这个数字在前面被插入过，就在新建的树中把 包含a[i]的上一个位置的 所有区间 的 
	值-1，然后再照常插入a[i]，因此要用一个数组记录a[i]上次插入时的位置。查询时只要查R对应的版本的线段树就行了。	

```c
#include<bits/stdc++.h>
using namespace std;
const int maxn = 30010;
int t[maxn*30],tot,rts[maxn],lson[maxn*30],rson[maxn*30];

void add(int pos,int val,int l,int r,int &rt,int lst)
{
    rt = ++tot;
    t[rt] = t[lst]+val,lson[rt] = lson[lst],rson[rt] = rson[lst];
    if(l==r)
        return ;
    int m = l + r >> 1;
    if(pos<=m)
        add(pos,val,l,m,lson[rt],lson[lst]);
    else
        add(pos,val,m+1,r,rson[rt],rson[lst]);
}

int query(int L,int R,int l,int r,int rt)
{
    if(L<=l&&r<=R)
        return t[rt];
    int m = l + r >> 1,ans = 0;
    if(L<=m)
        ans += query(L,R,l,m,lson[rt]);
    if(R>m)
        ans += query(L,R,m+1,r,rson[rt]);
    return ans;
}

int N,a[maxn],x,y,Q,past[1000005];
int main()
{
    scanf("%d",&N);
    for(int i=1;i<=N;++i)
        scanf("%d",&a[i]);

    for(int i=1;i<=N;++i)
    {
        if(past[a[i]])//插入过
        {
            add(past[a[i]],-1,1,N,rts[i],rts[i-1]);//先把上个位置-1
            add(i,1,1,N,rts[i],rts[i]);//再把新的位置+1
        }
        else
            add(i,1,1,N,rts[i],rts[i-1]);
        past[a[i]] = i;
    }

    scanf("%d",&Q);
    while(Q--)
    {
        scanf("%d%d",&x,&y);
        printf("%d\n",query(x,y,1,N,rts[y]));
    }
    return 0;
}

```
		 

