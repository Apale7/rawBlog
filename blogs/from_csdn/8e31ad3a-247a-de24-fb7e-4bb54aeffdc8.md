---
title: 线段树模板（新）
date: 2018-05-16
tags:
 - 

categories:
 - 数据结构

---

```
#define lson l,m,rt<<1
#define rson m+1,r,rt<<1|1
#define pushup(rt) t[rt] = t[rt<<1] + t[rt<<1|1];
const int maxn = 100000+10;
typedef long long ll;
ll t[maxn<<2],lazy[maxn<<2],a[maxn];

void build(int l,int r,int rt)
{
	lazy[rt] = 0;
	if(l==r)
	{
		scanf("%lld",&t[rt]);
		return ;
	}
	int m = (l+r)>>1;
	build(lson);
	build(rson);
	pushup(rt);
}


void pushdown(int l,int r,int rt)
{
	if(lazy[rt])
	{
		lazy[rt<<1] += lazy[rt];
		lazy[rt<<1|1] += lazy[rt];
		t[rt<<1] += l*lazy[rt];
		t[rt<<1|1] += r*lazy[rt];
		lazy[rt] = 0;
	}
}
void update(int L,int R,int C,int l,int r,int rt)
{
	if(L<=l&&r<=R)
	{
		t[rt] += (r-l+1)*C;
		lazy[rt] += C;
		return ;
	}
	int m = (l+r)>>1;
	pushdown(m-l+1,r-m,rt);
	if(L<=m)
		update(L,R,C,lson);
	if(R>m)
		update(L,R,C,rson);
	pushup(rt);
}

ll query(int L,int R,int l,int r,int rt)
{
	if(L<=l&&r<=R)
		return t[rt];
	int m = (l+r)>>1;
	pushdown(m-l+1,r-m,rt);
	ll ans = 0;
	if(L<=m)
		ans += query(L,R,lson);
	if(R>m)
		ans += query(L,R,rson);
	return ans;
}
```
