---
title: 线段树模板(POJ3468)
date: 2018-03-28
tags:
 - 

categories:
 - 数据结构

---

```
#include<stdio.h>
#include<cstring>
#include<iostream>
using namespace std;
typedef long long ll;

ll t[100005<<2],lazy[100005<<2],a[100005];
void pushup(int rt)
{
	t[rt] = t[rt<<1] + t[rt<<1|1];
}

void pushdown(int rt,int l,int r)
{
	if(lazy[rt])
	{
		lazy[rt<<1] += lazy[rt];
		lazy[rt<<1|1] += lazy[rt];//更新此节点的子节点 
		t[rt<<1] += lazy[rt]*l;
		t[rt<<1|1] += lazy[rt]*r;//下推懒惰标记至子节点 
		lazy[rt] = 0;//此节点懒惰标记置0 
	}
}

void build(int l,int r,int rt)
{
	lazy[rt] = 0;
	if(l==r)
	{
		t[rt] = a[l];
		return ;
	}
	int m = (l+r)>>1;
	build(l,m,rt<<1);
	build(m+1,r,rt<<1|1); 
	pushup(rt); //此节点改变，其父节点也要更新 
}

ll query(int L,int R,int l,int r,int rt)
{
	if(l>=L&&r<=R)
	{
		return t[rt];
	}
	int m = (l+r)>>1;
	pushdown(rt,m-l+1,r-m);//先更新再查询 
	ll ans = 0;
	if(L<=m)
		ans += query(L,R,l,m,rt<<1);
	if(R>m)
		ans += query(L,R,m+1,r,rt<<1|1);
	return ans;
}

void update(int L,int R,ll C,int l,int r,int rt)
{
	if(l>=L&&R>=r)//直接更新此区间的值，并打上懒惰标记 
	{
		t[rt] += C*(r-l+1);
		lazy[rt] += C;
		return ; 
	}
	int m = (l+r)>>1;
	pushdown(rt,m-l+1,r-m);//先解决之前的懒惰标记再更新 
	if(L<=m)
		update(L,R,C,l,m,rt<<1);
	if(R>m)
		update(L,R,C,m+1,r,rt<<1|1);
	pushup(rt); //此节点改变，其父节点也要更新 
}



int N,Q;
int x,y;
ll z;
char str[10];
int main()
{
	ios::sync_with_stdio(false);
	while(cin>>N>>Q)
	{
		for(int i=1;i<=N;i++)
		{
			cin>>a[i];
		}
		build(1,N,1);
		while(Q--)
		{
			cin>>str;		
			if(str[0]=='C')
			{
				cin>>x>>y>>z;
				update(x,y,z,1,N,1);
			}
			else
			{
				cin>>x>>y;
				cout<<query(x,y,1,N,1)<<endl;
			}
		}
	}	
	return 0;
}
```
