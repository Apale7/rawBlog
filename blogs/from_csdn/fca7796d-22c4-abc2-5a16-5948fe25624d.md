---
title: zoj1610- Count the Colors（线段树区间染色覆盖问题）
date: 2018-05-10
tags:
 - 

categories:
 - 数据结构

---

Painting some colored segments on a line, some previously painted segments may be covered by some the subsequent ones.
Your task is counting the segments of different colors you can see at last.


Input


The first line of each data set contains exactly one integer n, 1 <= n <= 8000, equal to the number of colored segments.
Each of the following n lines consists of exactly 3 nonnegative integers separated by single spaces:

x1 x2 c

x1 and x2 indicate the left endpoint and right endpoint of the segment, c indicates the color of the segment.

All the numbers are in the range [0, 8000], and they are all integers.

Input may contain several data set, process to the end of file.



Output


Each line of the output should contain a color index that can be seen from the top, following the count of the segments of this color, they should be printed according to the color index.
If some color can't be seen, you shouldn't print it.

Print a blank line after every dataset.



Sample Input


5
0 4 4
0 3 1
3 4 2
0 2 2
0 2 3
4
0 1 1
3 4 1
1 3 2
1 3 1
6
0 1 0
1 2 1
2 3 1
1 2 0
2 3 0
1 2 1


Sample Output


1 1
2 1
3 1
1 1

0 2
1 1

题意: 输入一个n,n行x,y,c,把区间[x,y]涂成c颜色,问最后每种颜色各有多少块(如11221233,1两块，2两块，3一块)

这一类线段树区间染色覆盖的问题，实际上都是对lazy标记的维护
首先要把lazy初始化为不存在的值。这题的颜色为0-8000，初始化为-1即可
现在假设区间[1,5]的颜色为1，欲将区间[1,3]染成2，思路如下:
	先将[1,5]分成[1,3]和[4,5]，然后修改[1,3]的值，
因为此时[1,5]已由[1,3]和[4,5]替换，[1,5]失去意义，故删除[1,5]的lazy值(置为-1)
这一步中划分和删除操作都在pushdown中实现

```
void pushdown(int rt)
{
	c[rt<<1] = c[rt<<1|1] = c[rt];//划分
	c[rt] = -1;//删除
}
```
	接着上面，若此时要把[1,5]染为3，直接修改[1,5]的lazy值即可，不用管下面的子节点，等到查询的时候再pushdown即可

针对这题: 染区间[1,2],[3,4]为同一种颜色的时候，不能直接修改四个点的值，因为[2,3]显然是没颜色的，在update操作时把区间左值+1，变成左开右闭，避免染多

代码:

```
#include<bits/stdc++.h>
#define lson l,m,rt<<1
#define rson m+1,r,rt<<1|1
//#define pushup(rt) t[rt]=t[rt<<1]+t[rt<<1|1];
using namespace std;
//typedef long long ll;
const int maxn = 8005;
int c[maxn<<2];
int ANS[maxn],last;

void pushdown(int rt)
{
	c[rt<<1] = c[rt<<1|1] = c[rt];
	c[rt] = -1;
}
void update(int L,int R,int C,int l,int r,int rt)
{
	if(L<=l&&R>=r)
	{
		c[rt] = C;
		return ;
	}

	if(~c[rt])
		pushdown(rt);
	int m = (l+r)>>1;
	if(L<=m)
		update(L,R,C,lson);
	if(R>m)
		update(L,R,C,rson);
}

void query(int l,int r,int rt)
{
	if(l==r)
	{
		if(~c[rt]&&c[rt]!=last)//last记录上一个区间的颜色，
		{                      //不同就让这个区间的颜色块数+1
			++ANS[c[rt]];
		}
		last = c[rt];
		return ;
	}
	int m = (l+r)>>1;
	if(~c[rt])
		pushdown(rt);
	query(lson);
	query(rson);
}

int N;
int sum,x,y,col;
int main()
{
	while(scanf("%d",&N)!=EOF)
	{
		memset(c,-1,sizeof(c));
		memset(ANS,0,sizeof(ANS));
		for(int i=1;i<=N;++i)
		{
			scanf("%d%d%d",&x,&y,&col);
			if(x<y)
			/*因为下面更新的是x+1,
			当题目输入x == y时不能更新，否则会re*/
				update(x+1,y,col,1,8000,1);
				//区间左值+1变成左开右闭
		}
		last = -1;
		query(1,8000,1);
		for(int i=0;i<=8000;++i)
		{
			if(ANS[i])
				printf("%d %d\n",i,ANS[i]);
		}
		printf("\n");
	}
	return 0;
}
```
