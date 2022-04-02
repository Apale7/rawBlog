---
title: 最小生成树——kruskal
date: 2018-03-07
tags:
 - 

categories:
 - 图算法

---

<p>        今天是我第一次用克鲁斯卡尔a题。纪念一下。</p><p>        kruskal算法是一种贪心算法，它每次取权重最小的边并判断该边的两个端点是否属于同一棵树，显然当端点属于<br /></p><p>同一棵树时加上这条边会使这棵树出现环，此时舍去该边；当端点不属于同一棵树时，将该边加入树中，因为该边的</p><p>权重是当前最小的，最后得到的一定是最小生成树。</p><p>        首先要判断两个点是否在同一棵树上，这就要用到快速查询数据是否属于同一个集合的工具——并查集。<br /></p><p>        并查集的基本思想：每个集合选一个元素为代表，其他的元素都直接或间接地指向这个代表，形成一棵树。在查找</p><p>两个元素时，只要看它们指向的代表的值是否相同就能知道它们是否属于同一个集合。</p><p>        并查集的实现方法：以一个数组f[]来存储元素的信息，假设为代表的元素为a，则f[a]=a,该元素为树的根节点， 其余</p><p>所有该集合元素的数组都是叶子结点，值都为a，即f[b] = a,f[c]=a ...... 当所有元素都直接指向代表时，查询的时间</p><p>复杂度为O(1)。但随着元素的加入，该树可能会退化成一条长链，查询的时间复杂度会退化为O(n)，此时只要把所有元素</p><p>都指向代表即可。</p><p>        代码如下：<br /></p><pre class="cpp">int find(int x)
{
	return f[x]==x ? x : f[x]=find(f[x]);
}</pre><p>        每次查询完都会把f[x]的值更新为find(f[x])</p><p>        有了并查集，就可以正式开始kruskal了。<br /></p><p>        首先要以边的权重对边进行排序，直接用STL sort即可<br /></p><p>        然后按顺序遍历每一条边，将边的两端点用并查集判断是否属于同一集合，否则合并这两条边<br /></p><pre class="cpp">for(int i=0;i&lt;m;i++)
{
	x = find(wall[i].u);
	y = find(wall[i].v);
	if(x!=y)
	{
		//cnt++;
		cost += wall[i].w;
		f[x] = y;
	}	 
}</pre><p>        合并的操作就是让f[x] = y; ，相当于把xy连起来，cost用于记录最小生成树的各边权值之和。</p><p>        附上刚刚a的题：http://acm.hdu.edu.cn/showproblem.php?pid=6187<br /></p><p>        ac代码：<br /></p><p>   <br /></p><pre class="cpp">#include&lt;iostream&gt;
#include&lt;cstdio&gt; 
#include&lt;algorithm&gt;

using namespace std;

int n,m,c,d,cost,cnt,f[200005],sum;

struct Wall
{
	int u;
	int v;
	int w;
}wall[200005];

bool cmp(Wall a,Wall b)
{
	return a.w&gt;b.w;
}

int find(int x)
{
	return f[x]==x ? x : f[x]=find(f[x]);
}

int main()
{
	while(~scanf("%d%d",&amp;n,&amp;m))
	{
		sum = 0;
		cost = 0;
		cnt = 0;
		for(int i=1;i&lt;=n;i++)
		{
			scanf("%d%d",&amp;c,&amp;d);
			f[i] = i;
		}
		int u,v,w;
		for(int i=0;i&lt;m;i++)
		{
			scanf("%d%d%d",&amp;u,&amp;v,&amp;w);
			wall[i].u = u;
			wall[i].v = v;
			wall[i].w = w;
			sum += w;
		}
		int x,y; 			
		sort(wall,wall+m,cmp);
		//kruskal
		for(int i=0;i&lt;m;i++)
		{
			x = find(wall[i].u);
			y = find(wall[i].v);
			if(x!=y)
			{
				cnt++;
				cost += wall[i].w;
				f[x] = y;
			}	 
		}	
		printf("%d %d\n",m-cnt,sum-cost);
	}	
} </pre><br /><p>        <br /></p>
