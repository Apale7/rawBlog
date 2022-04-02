---
title: 宽搜——Dungeon Master
date: 2018-02-02
tags:
 - 

categories:
 - ACM水题

---


<p>题目：</p>
<p><span class="space" style="white-space:pre; display:inline-block; text-indent:2em; line-height:inherit">&nbsp;PS:懒得看的话直接拉下去看题目大意</span></p>
<dd style="">
<div class="ptx" lang="en-US">You are trapped in a 3D dungeon and need to find the quickest way out! The dungeon is composed of unit cubes which may or may not be filled with rock. It takes one minute to move one unit north, south, east, west, up or down. You
 cannot move diagonally and the maze is surrounded by solid rock on all sides.&nbsp;<br>
<br>
Is an escape possible? If yes, how long will it take?&nbsp;<br>
</div>
</dd><dt style="margin-top:20px; padding-left:35px; color:rgb(0,0,0); font-family:Simsun; font-size:14px">
Input</dt><dd style="">
<div class="ptx" lang="en-US">The input consists of a number of dungeons. Each dungeon description starts with a line containing three integers L, R and C (all limited to 30 in size).&nbsp;<br>
L is the number of levels making up the dungeon.&nbsp;<br>
R and C are the number of rows and columns making up the plan of each level.&nbsp;<br>
Then there will follow L blocks of R lines each containing C characters. Each character describes one cell of the dungeon. A cell full of rock is indicated by a '#' and empty cells are represented by a '.'. Your starting position is indicated by 'S' and the
 exit by the letter 'E'. There's a single blank line after each level. Input is terminated by three zeroes for L, R and C.</div>
</dd><dt style="margin-top:20px; padding-left:35px; color:rgb(0,0,0); font-family:Simsun; font-size:14px">
Output</dt><dd style="">
<div class="ptx" lang="en-US">Each maze generates one line of output. If it is possible to reach the exit, print a line of the form&nbsp;<br>
<blockquote>Escaped in x minute(s).</blockquote>
<br>
where x is replaced by the shortest time it takes to escape.&nbsp;<br>
If it is not possible to escape, print the line&nbsp;<br>
<blockquote>Trapped!</blockquote>
</div>
</dd><dt style="margin-top:20px; padding-left:35px; color:rgb(0,0,0); font-family:Simsun; font-size:14px">
Sample Input</dt><dd style="">
<pre class="sio">3 4 5
S....
.###.
.##..
###.#

#####
#####
##.##
##...

#####
#####
#.###
####E

1 3 3
S##
#E#
###

0 0 0
</pre>
</dd><dt style="margin-top:20px; padding-left:35px; color:rgb(0,0,0); font-family:Simsun; font-size:14px">
Sample Output</dt><dd style="">
<pre class="sio">Escaped in 11 minute(s).
Trapped!</pre>
题目大意：你被困在一个3D迷宫里面，S表示起点，E表示终点，. 表示可走的地方，走每一步需要一分钟，求脱困的最短时间
<p></p>
<p>题目不难，不过有个坑——迷宫不止一条路能出去，因此要找的是最短路而不是找路。若认为这题只有一条路，用深搜，恭喜你wa了。 由于数据范围较大，即使用回溯法dfs也会超时，因此只能BFS。</p>
<p><span style="color:rgb(79,79,79); text-align:justify">下面附上代码：</span><br>
</p>
<pre name="code" class="cpp">#include&lt;iostream&gt;
#include&lt;cstdio&gt;
#include&lt;algorithm&gt;
#include&lt;cstring&gt;
#include&lt;queue&gt;
using namespace std;
int L,R,C,ans;
char map[35][35][35];
int vis[35][35][35];		//标记走过的地方用于剪枝 
int dl[]={-1,1,0,0,0,0};  	//六个方向 
int dr[]={0,0,-1,1,0,0};  
int dc[]={0,0,0,0,-1,1}; 




struct point
{
	int L;
	int R;
	int C;
	int num;//记录当前走到第几步 
	
	point(int l=0,int r=0,int c=0,int n=0)
	{//最近才学到原来结构体也可以有构造函数-_-|| 
		L = l;
		R = r;
		C = c;
		num = n;
	}
	~point(){}
}S,a;
queue&lt;point&gt; que;




int main()
{
	while(cin&gt;&gt;L&gt;&gt;R&gt;&gt;C&amp;&amp;(L||C||R))
	{
		memset(map,0,sizeof(map));
		memset(vis,0,sizeof(vis));
		while(!que.empty())//上次终点时队列为非空，清空队列 
			que.pop();
		ans = 999999999;
		for(int i=1;i&lt;=L;i++)
			for(int j=1;j&lt;=R;j++)
				for(int k=1;k&lt;=C;k++)
				{
					cin&gt;&gt;map[i][j][k];
					if(map[i][j][k]=='S')
					{
						S.L = i;
						S.R = j;
						S.C = k;
					}
				}
					
		que.push(point(S.L,S.R,S.C,0));
		int k = 1;//标记能否走到终点
		while(k&amp;&amp;!que.empty())
		{
			a = que.front();
			que.pop();
			for(int i=0;i&lt;6;i++)
			{//搜索六个方向 
				if(vis[a.L+dl[i]][a.R+dr[i]][a.C+dc[i]]==0&amp;&amp;(map[a.L+dl[i]][a.R+dr[i]][a.C+dc[i]]=='.'||map[a.L+dl[i]][a.R+dr[i]][a.C+dc[i]]=='E'))
				{
					if(map[a.L+dl[i]][a.R+dr[i]][a.C+dc[i]]=='E')
					{//下一步是终点了 
						ans = min(a.num+1,ans);//这步应该多余了，宽搜到的一定是最短路 
						k = 0; //标记能否走到终点
						break;
					}
					vis[a.L+dl[i]][a.R+dr[i]][a.C+dc[i]] = 1;
					que.push(point(a.L+dl[i],a.R+dr[i],a.C+dc[i],a.num+1));
				}	
			}	
		}		
		if(k)
			ans = 0;
		if(ans)	
			printf(&quot;Escaped in %d minute(s).\n&quot;,ans);
		else
			printf(&quot;Trapped!\n&quot;);
	}
}</pre>
<p></p>
宽搜最近刚回，总结一下：
<p></p>
<p><span class="space" style="white-space:pre; display:inline-block; text-indent:2em; line-height:inherit"><span class="space" style="white-space:pre; display:inline-block; text-indent:2em; line-height:inherit">&nbsp;</span>&nbsp;搜索一个节点时，先判断边界条件，不符合直接return，符合则将其进行标记，防止走回头路，然后将其各个子节点插入</span></p>
<p><span class="space" style="white-space:pre; display:inline-block; text-indent:2em; line-height:inherit">队列中，每次从队列中取出一个元素，进行判断；如此反复，直至找到答案或队列为空。</span><br>
</p>
<p><span class="space" style="white-space:pre; display:inline-block; text-indent:2em; line-height:inherit"><span class="space" style="white-space:pre; display:inline-block; text-indent:2em; line-height:inherit">&nbsp;一定要做标记剪枝！！！</span><br>
</span></p>
<p><span class="space" style="white-space:pre; display:inline-block; text-indent:2em; line-height:inherit"><span class="space" style="white-space:pre; display:inline-block; text-indent:2em; line-height:inherit"><span style="color:rgb(79,79,79); text-align:justify; text-indent:32px; white-space:pre">&nbsp;一定要做标记剪枝！！！</span><br>
</span></span></p>
<p><span class="space" style="white-space:pre; display:inline-block; text-indent:2em; line-height:inherit"><span class="space" style="white-space:pre; display:inline-block; text-indent:2em; line-height:inherit"><span style="color:rgb(79,79,79); text-align:justify; text-indent:32px; white-space:pre"><span style="color:rgb(79,79,79); text-align:justify; text-indent:32px; white-space:pre">&nbsp;一定要做标记剪枝！！！</span><br>
</span></span></span></p>
<p><span class="space" style="white-space:pre; display:inline-block; text-indent:2em; line-height:inherit">&nbsp;</span><span class="space" style="white-space:pre; display:inline-block; text-indent:2em; line-height:inherit">&nbsp;后果如下</span><br>
</p>
<p><span class="space" style="white-space:pre; display:inline-block; text-indent:2em; line-height:inherit"><span class="space" style="white-space:pre; display:inline-block; text-indent:2em; line-height:inherit"><img src="https://img-blog.csdn.net/20180202231658795?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvQXBhbGVfOA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast" alt="" style="text-indent:0px; white-space:normal"></span></span></p>
<p><br>
</p>
<p><br>
</p>
<p><br>
</p>
<p><br>
</p>
<p><br>
</p>
<p><br>
</p>
</dd>
