---
title: HDU2852 KiKi's K-Number (权值线段树求第k大)
date: 2018-07-18
tags:
 - 

categories:
 - 数据结构

---

	题意：三种操作，0 e 表示插入一个数字e，1 e 表示删除一个数字e，2 e k 表示查询比e大的第k个数，删除和查询均可能没有
	目标。

	思路：建一棵权值线段树，维护每个数字区间中数字的数量。 查询时，先查出1到e的数字数量n，然后查询第k+n大。

```
#include<cstdio>
#include<cstring>
using namespace std;
#define lson l,m,rt<<1
#define rson m+1,r,rt<<1|1
const int maxn = 1e5 + 10;
const int N = 100000;
int num[maxn<<2];
void update(int pos,int val,int l,int r,int rt)
{
    if(l==r)
    {
        if(num[rt]+val<0)
        {
            printf("No Elment!\n");
            return ;
        }
        num[rt] += val;
        return ;
    }

    int m = l + r >> 1;
    if(pos<=m)
        update(pos,val,lson);
    else
        update(pos,val,rson);
    num[rt] = num[rt<<1] + num[rt<<1|1];
}

int query(int k,int l,int r,int rt)//找第k大
{
    if(num[rt]<k)
    {
        printf("Not Find!\n");
        return -1;
    }
    if(l==r)
        return l;
    int m = l + r >> 1;
    if(k<=num[rt<<1])
        return query(k,lson);
    else
        return query(k-num[rt<<1],rson);
}

int query(int L,int R,int l,int r,int rt)//L<= <=R的数的数量
{
    if(L<=l&&r<=R)
        return num[rt];
    int m = l + r >> 1;
    int ans = 0;
    if(L<=m)
        ans += query(L,R,lson);
    if(R>m)
        ans += query(L,R,rson);
    return ans;
}

void init()
{
    memset(num,0,sizeof(num));
}

int Q,p,e,k,n;
int main()
{
    while(scanf("%d",&Q)!=EOF)
    {
        init();
        while(Q--)
        {
            scanf("%d%d",&p,&e);
            if(!p)
                update(e,1,1,N,1);
            else if(p==1)
                update(e,-1,1,N,1);
            else
            {
                scanf("%d",&k);
                n = query(1,e,1,N,1);
                k += n;
                n = query(k,1,N,1);
                if(n!=-1)
                    printf("%d\n",n);
            }
        }
    }
    return 0;
}

```
