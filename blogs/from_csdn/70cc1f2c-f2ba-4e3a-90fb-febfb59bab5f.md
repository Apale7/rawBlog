---
title: POJ3667(线段树区间合并)
date: 2018-07-06
tags:
 - 

categories:
 - 数据结构

---

```cpp
#include<cstdio>
#include<algorithm>
#include<cstring>
using namespace std;
#define lson l,m,rt<<1
#define rson m+1,r,rt<<1|1

const int maxn = 50010;
int ls[maxn<<2],rs[maxn<<2],ms[maxn<<2],lazy[maxn<<2];

void pushdown(int rt,int len)
{
	if(~lazy[rt])
	{
		lazy[rt<<1] = lazy[rt<<1|1] = lazy[rt];
		if(lazy[rt])//0,入住
		{
			ms[rt<<1] = ls[rt<<1] = rs[rt<<1] = 0;
			ms[rt<<1|1] = ls[rt<<1|1] = rs[rt<<1|1] = 0;
		}
		else//1,退房
		{
			ms[rt<<1] = ls[rt<<1] = rs[rt<<1] = len-(len>>1);
			ms[rt<<1|1] = ls[rt<<1|1] = rs[rt<<1|1] = len>>1;
		}
		lazy[rt] = -1;
	}
}

void pushup(int rt,int len)
{
	ls[rt] = ls[rt<<1];
	rs[rt] = rs[rt<<1|1];
	if(ls[rt]==len-len/2)
		ls[rt] += ls[rt<<1|1];
	if(rs[rt]==len/2)
		rs[rt] += rs[rt<<1];
	ms[rt] = max(max(ms[rt<<1],ms[rt<<1|1]),ls[rt<<1|1]+rs[rt<<1]);
}


void build(int l,int r,int rt)
{
	ms[rt] = ls[rt] = rs[rt] = r-l+1;
	lazy[rt] = -1;
	if(l==r)
		return ;
	int m = (l+r)>>1;
	build(lson);
	build(rson);
}

void update(int L,int R,int C,int l,int r,int rt)
{
	if(L<=l&&r<=R)
	{
		if(!C)//退房
			ms[rt] = ls[rt] = rs[rt] = (r-l+1);
		else//入住
			ms[rt] = ls[rt] = rs[rt] = 0;
		lazy[rt] = C;
		return ;
	}
	pushdown(rt,r-l+1);
	int m = (l + r)>>1;
	if(L<=m)
		update(L,R,C,lson);
	if(R>m)
		update(L,R,C,rson);
	pushup(rt,r-l+1);
}


int query(int len,int l,int r,int rt)
{
	if(l==r)
		return l;
	pushdown(rt,r-l+1);
	int m = (l+r)>>1;
	if(ms[rt<<1]>=len)
		return query(len,lson);
	else if(ls[rt<<1|1]+rs[rt<<1]>=len)
		return m - rs[rt<<1] + 1;//ls[rt<<1|1]的l
	else
		return query(len,rson);
}

int N,M,op,len,x,y,p;
int main()
{
    scanf("%d%d",&N,&M);
    build(1,N,1);
    while(M--)
	{
		scanf("%d",&op);
		if(op==1)
		{
			scanf("%d",&len);//printf("ms[1]==%d\n",ms[1]);
			if(ms[1]<len)
				printf("0\n");
			else
			{

				p = query(len,1,N,1);
				printf("%d\n",p);
				update(p,p+len-1,1,1,N,1);
			}
		}
		else
		{
			scanf("%d%d",&x,&y);
			update(x,x+y-1,0,1,N,1);
		}
	}
	return 0;
}
```
