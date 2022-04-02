---
title: HDU5090(贪心+priority_queue优化)
date: 2018-03-10
tags:
 - 

categories:
 - ACM水题

---

<p>        两种优先队列的声明方法</p><p>        std::priority_queue&lt;T&gt; que;<br /></p><p>        std::priority_queue&lt;T, std::vector&lt;T&gt;, cmp&gt; que;</p><p>        优先队列的top默认是大的，若要小的优先，则要定义一个结构体cmp，将()运算符重载</p><p>因为优先队列的优先级通过！cmp来判断，cmp要这样写：</p><pre class="cpp">struct cmp
{
	bool operator()(int &amp;a,int &amp;b)
	{
		return a&gt;b;
	}    
};</pre><p>        </p><p>        题目略</p><p>思路:先对a数组升序数据排序，逐一判断a[i]与i的关系)(i从1开始)，</p><p>        若==就continue；</p><p>        小于就a[i]+k，i--，重新对a进行排序；</p><p>        大于就直接tom赢了。<br /></p><p>每次小于都sort一次:15ms</p><pre class="cpp">#include&lt;cstdio&gt;
#include&lt;cstring&gt;
#include&lt;algorithm&gt;
using namespace std;

int M,N,K,a[105],n;
int main()
{
	scanf("%d",&amp;M);
	while(M--)
	{
		memset(a,0,sizeof(a));
		scanf("%d %d",&amp;N,&amp;K);
		for(int i=1;i&lt;=N;i++)
		{
			scanf("%d",&amp;a[i]);			
		}
		sort(a+1,a+N+1);
		int flag = 1;
		for(int i=1;i&lt;=N;i++)
		{
			if(a[i]==i)
				continue;
			else if(a[i]&lt;i)
			{
				a[i] += K;
				i--;
				sort(a+1,a+N+1);
			}
			else
			{
				flag = 0;
				break;
			}
		}
		if(flag)
			printf("Jerry\n");
		else
			printf("Tom\n");
	}
}</pre><p>用priority_queue优化:0ms</p><pre class="cpp">#include&lt;cstdio&gt;
#include&lt;queue&gt;
using namespace std;

struct cmp
{
	bool operator()(int &amp;a,int &amp;b)
	{
		return a&gt;b;
	}    
};
int M,N,K,a,n;
int main()
{
	scanf("%d",&amp;M);
	while(M--)
	{
	    priority_queue&lt;int, vector&lt;int&gt;, cmp&gt; que;
		scanf("%d %d",&amp;N,&amp;K);
		for(int i=1;i&lt;=N;i++)
		{
			scanf("%d",&amp;a);
			que.push(a);
		}
		int flag = 1;
		for(int i=1;i&lt;=N;i++)
		{
		    a = que.top();
		    que.pop();
			if(a==i)
				continue;
			else if(a&lt;i)
			{
				a += K;
				que.push(a);
				i--;
			}
			else
			{
				flag = 0;
				break;
			}
		}
		if(flag)
			printf("Jerry\n");
		else
			printf("Tom\n");
	}
}
</pre><br /><br /><p>        </p><p>   <br /></p>
