---
title: hdu 1885 Key Task
date: 2018-02-16
tags:
 - 

categories:
 - 搜索

---

<p>怕是寒假做不完搜索1了......</p><p>题目：</p><p></p><div class="panel_content">The Czech Technical University is rather old — you already know that it celebrates 300 years of its existence in 2007. Some of the university buildings are old as well. And the navigation in old buildings can sometimes be a little bit tricky, because of strange long corridors that fork and join at absolutely unexpected places. <br /><br />The result is that some first-graders have often di?culties finding the right way to their classes. Therefore, the Student Union has developed a computer game to help the students to practice their orientation skills. The goal of the game is to find the way out of a labyrinth. Your task is to write a verification software that solves this game. <br /><br />The labyrinth is a 2-dimensional grid of squares, each square is either free or filled with a wall. Some of the free squares may contain doors or keys. There are four di?erent types of keys and doors: blue, yellow, red, and green. Each key can open only doors of the same color. <br /><br />You can move between adjacent free squares vertically or horizontally, diagonal movement is not allowed. You may not go across walls and you cannot leave the labyrinth area. If a square contains a door, you may go there only if you have stepped on a square with an appropriate key before.</div>InputThe input consists of several maps. Each map begins with a line containing two integer numbers R and C (1 ≤ R, C ≤ 100) specifying the map size. Then there are R lines each containing C characters. Each character is one of the following: <br /><br /><center><img src="https://odzkskevi.qnssl.com/a7ef1acff61732031b94921073b7cb74?v=1517991252" width="423" height="150" alt="" /></center><br /><br />Note that it is allowed to have <br />more than one exit,<br />no exit at all,<br />more doors and/or keys of the same color, and<br />keys without corresponding doors and vice versa.<br /><br />You may assume that the marker of your position (“*”) will appear exactly once in every map. <br /><br />There is one blank line after each map. The input is terminated by two zeros in place of the map size.OutputFor each map, print one line containing the sentence “Escape possible in S steps.”, where S is the smallest possible number of step to reach any of the exits. If no exit can be reached, output the string “The poor student is trapped!” instead. <br /><br />One step is defined as a movement between two adjacent cells. Grabbing a key or unlocking a door does not count as a step.Sample Input<pre style="white-space:pre-wrap;">1 10
*........X

1 3
*#X

3 20
####################
#XY.gBr.*.Rb.G.GG.y#
####################

0 0</pre>Sample Output<pre style="white-space:pre-wrap;">Escape possible in 9 steps.
The poor student is trapped!
Escape possible in 45 steps.</pre><p><br /></p><p>题目大意:走迷宫，#是墙，*是起点，X是终点，. 是路，小写字母是钥匙，大写字母是门，可能没有终点，输出有终点时去最近的终点的路程。</p><p>解题思路:这道题跟前面那个基本一样，就是状态压缩bfs，区别就两点，一是终点(出口)不唯一，且可能不存在，在输入时要判断是否存在出口，不存在就不要bfs了；二是钥匙不是从a开始的。Y是第25个字母，但显然不能用2的25次方的储存状态，在输入时简单处理即可。<br /></p><p>代码如下:</p><pre class="cpp"></pre><pre class="cpp">#include&lt;iostream&gt;
#include&lt;queue&gt;
#include&lt;cstring&gt;
using namespace std;

int dx[] = {1,-1,0,0};
int dy[] = {0,0,1,-1};
int n,m,k;
char map[105][105];
int vis[105][105][1&lt;&lt;5];
struct node
{
    int x,y,step;
    int k;//记录状态
    node(int X=0,int Y=0,int Step=0,int K = 0)
    {
        x = X;
        y = Y;
        step = Step;
        k = K;
    }
}p,S,pp;

queue&lt;node&gt; que;

void pick_Up()
{
	int num = map[pp.x][pp.y] - 'a';
	pp.k |= (1 &lt;&lt; num);
}

bool cannot_Open(int num)
{
	int a = p.k#
	return a==0;//检验有没有相应的钥匙 
}

int bfs()
{
	que.push(S);
	int num;
	vis[S.x][S.y][0] = 1;
	while(!que.empty())
	{

		p = que.front();
		que.pop();
		if(map[p.x][p.y]=='X')
			return p.step; 
		for(int i=0;i&lt;4;i++)
		{		
			pp.x = p.x+dx[i];
			pp.y = p.y+dy[i];
			pp.step = p.step+1;
			pp.k = p.k;
			if(!map[pp.x][pp.y]||map[pp.x][pp.y]=='#')//判断边界    
				continue;    
			if(map[pp.x][pp.y]=='B'||map[pp.x][pp.y]=='A'||map[pp.x][pp.y]=='C'||map[pp.x][pp.y]=='D')//遇到门 
			{				
				num =  map[pp.x][pp.y] - 'A';//A门对应0，B门对应1...... 
				num = 1&lt;&lt;num;//转换为2进制的位，如有A门对应pow(2,0)(第一位上的1)，B门对应pow(2,1)（第二位上的1）...... 
				if(cannot_Open(num))
					continue;					
			}
			else if(map[pp.x][pp.y]=='b'||map[pp.x][pp.y]=='a'||map[pp.x][pp.y]=='c'||map[pp.x][pp.y]=='d')//钥匙 
			{
				pick_Up();//遇到钥匙就捡起来...  

			}
			
			if(!vis[pp.x][pp.y][pp.k])//同一状态同一地点只走一次 
			{
				vis[pp.x][pp.y][pp.k] = 1;
				que.push(pp);
			}		
		}
	}
	return -1;
}

void init() 
{
	memset(map,0,sizeof(map));
	memset(vis,0,sizeof(vis));
	while(!que.empty())
	{
		que.pop();	
	}	
}

int main()
{
	ios::sync_with_stdio(false);
	while(cin&gt;&gt;n&gt;&gt;m&amp;&amp;(n||m))
    {
    	k = 0; 
    	init();
        for(int i=1;i&lt;=n;i++)
        {
            for(int j=1;j&lt;=m;j++)
            {
                cin&gt;&gt;map[i][j];
                if(map[i][j]=='R'||map[i][j]=='r')//一开始忘记处理，遇到Y就崩了。。。 
                	map[i][j] -= ('R' - 'A');
                else if(map[i][j]=='G'||map[i][j]=='g')
                	map[i][j] -= ('G' - 'C');
                else if(map[i][j]=='G'||map[i][j]=='g')
                	map[i][j] -= ('G' - 'C');
                else if(map[i][j]=='Y'||map[i][j]=='y')
                	map[i][j] -= ('Y' - 'D');
                if(map[i][j]=='X')
                {
                	k = 1;
				}
				else if(map[i][j]=='*')
				{
					S.x = i;
					S.y = j;
				}
            }
        }
        if(k==0)
        {
        	cout&lt;&lt;"The poor student is trapped!"&lt;&lt;endl;
        	continue;
		}	
       	int ans = bfs();
       	if(ans==-1)
       	{
       		cout&lt;&lt;"The poor student is trapped!"&lt;&lt;endl;
        	continue;	
		}
		cout&lt;&lt;"Escape possible in "&lt;&lt;ans&lt;&lt;" steps.\n";
       		
    }
}</pre><br />
