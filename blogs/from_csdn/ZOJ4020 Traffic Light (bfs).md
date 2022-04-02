---
title: ZOJ4020 Traffic Light (bfs)
date: 2018-04-11
tags:
 - 

categories:
 - 搜索

---

好久没打搜索了。。一个bfs哇了一晚上╭(╯^╰)╮
题目几乎是一个裸的bfs，只不过每个点有两种状态，每走一步状态就反转，所以判下一个点的去过没有的时候要判断与当前状态相反的点。
代码:

```
#include <bits/stdc++.h>
using namespace std;

bool t[100005]; 
int T,n,m;
bool vis[100005][2];
struct point
{
	int x,y,c;	
	point(int X=0,int Y=0,int C=0)
	{
		x = X;
		y = Y;
		c = C;
	}
	bool operator==(point a)
	{
		return x==a.x&&y==a.y;
	}
}S,E;

bool ok(point &a)
{
	if(a.x>0&&a.y>0&&a.x<=n&&a.y<=m&&!vis[(a.x-1)*m+a.y][a.c%2])	
	{
		vis[(a.x-1)*m+a.y][a.c%2] = 1;//写在这里下面可以省几行ヽ(￣▽￣)? 
		return true;
	}
		
	return false;
} 

int bfs()
{
	queue<point> que;
	point p,ps,px,pz,py;
	que.push(S);
	vis[(S.x-1)*m+S.y][0] = 1;
	while(!que.empty())
	{
		p = que.front();
		que.pop();
		if(p==E)
		{
			return p.c;
		}
		ps = point(p.x-1,p.y,p.c+1);//上下左右 
		px = point(p.x+1,p.y,p.c+1);
		pz = point(p.x,p.y-1,p.c+1);
		py = point(p.x,p.y+1,p.c+1);
		if(!(p.c%2)) //c是偶数，为一种状态 
		{
			if(t[(p.x-1)*m+p.y]%2==0)//0上下，1左右 
			{
				if(ok(ps))
					que.push(ps);
				if(ok(px))
					que.push(px);
			}
			else
			{
				if(ok(pz))
					que.push(pz);	
				if(ok(py))
					que.push(py);	
			}	
		} 
		else//c是奇数，另一种状态 
		{
			if(t[(p.x-1)*m+p.y]%2==0)//0左右，1上下 
			{
				if(ok(pz))
					que.push(pz);	
				if(ok(py))
					que.push(py);
			}
			else
			{
				if(ok(ps))
					que.push(ps);
				if(ok(px))
					que.push(px);	
			}	
		}
	}
	return -1;
}

int main()
{
	scanf("%d",&T);
	while(T--)
	{
		memset(vis,0,sizeof(vis));
		scanf("%d%d",&n,&m);
		int l = 1;
		for(int i=1;i<=n;i++)
		{	
			for(int j=1;j<=m;j++)
			{
				scanf("%d",&t[l++]);
			}
		} 			
		scanf("%d%d%d%d",&S.x,&S.y,&E.x,&E.y);
		printf("%d\n",bfs());
	}	
}
```
