---
title: 解封我的CSDN...
date: 2018-02-02
tags:
 - 

categories:
 - ACM水题

---


<p style="text-indent:32px"><span style="white-space:pre">&nbsp;</span>开学后沉迷学习无法自拔(其实是懒)，忘记写博客来记录我的学习生涯，直至现在寒假了才想起，现决定解封我的CSDN。</p>
<p>刚刚看了下我的第一篇博客(我都差点忘记我写过博客。。。)，当时初学编程，那道题的思路完全是错的...... 最恐怖的是还有</p>
<p>几十个人看了那篇QAQ。 大一第一学期已经过去了，学了一个学期ACM，我越来越觉得师兄刚开始说的&quot;人与人之间的差</p>
<p>距有时候可能比人比猪还大&quot;这句话特别在理，同届生恐怖得像魔&#39740;一样。。。 虽然我现在还不能望其项背，但我还是会坚持</p>
<p>下去。解封之际，先附上上篇博客中那道五个多月前难住我的题的实现代码。</p>
<p>先复述一遍题目</p>
<p><span class="space" style="white-space:pre; display:inline-block; text-indent:2em; line-height:inherit">&nbsp;输入一个n，输出一个螺旋向内递增的从1到n^2的n阶方阵（如下图）</span></p>
<p><span class="space" style="white-space:pre; display:inline-block; text-indent:2em; line-height:inherit"><br>
</span></p>
<p><span class="space" style="white-space:pre; display:inline-block; text-indent:2em; line-height:inherit"><img src="https://img-blog.csdn.net/20180202224445280?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvQXBhbGVfOA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast" alt=""></span></p>
<p><span class="space" style="white-space:pre; display:inline-block; text-indent:2em; line-height:inherit"><span style="text-indent:2em">代码如下：</span></span></p>
<p><span class="space" style="white-space:pre; display:inline-block; text-indent:2em; line-height:inherit"></span><pre name="code" class="cpp">#include&lt;iostream&gt;
#include&lt;cstring&gt;
using namespace std;

int map[10][10];
void build(int n)
{ 
    int x = 0;
    int y = 0;
    int tot = map[x][y] = 1;
    while(tot&lt;n*n)
    {
        while(y&lt;n-1&amp;&amp;!map[x][y+1])//最外面一层时遇到边界（-1或n）时停止循环，内层遇到下一个位置为非0(即外层数字已填入)时停止循环 
        {						   
        	map[x][++y] = ++tot;
		}
        while(x&lt;n-1&amp;&amp;!map[x+1][y])
            map[++x][y] = ++tot;
        while(y&gt;=1&amp;&amp;!map[x][y-1])
            map[x][--y] = ++tot;
        while(x&gt;=1&amp;&amp;!map[x-1][y])
            map[--x][y] = ++tot;
    }
}


void show(int n)
{
    for(int i=0;i&lt;n;i++)
    {
        for(int j=0;j&lt;n;j++)
        {
            cout&lt;&lt;map[i][j];
            if(j==n-1)
                cout&lt;&lt;endl;
            else
                cout&lt;&lt;' ';
            //PS：懒得打输出右对齐了，就这样了。。。 
        }
    }
}


int main()
{
    int n;
    while(cin&gt;&gt;n)
    {
        memset(map,0,sizeof(map));//没填入的都清0，方便边界判断 
        build(n);
        show(n);
        cout&lt;&lt;endl; 
    }
}</pre><br>
</p>
<p style="text-align:center; text-indent:32px"><span style="white-space:pre"><br>
</span></p>
<p style="text-align:center; text-indent:32px"><span style="white-space:pre"><br>
</span></p>
<p style="text-align:center; text-indent:32px"><span style="white-space:pre"><br>
</span></p>
<br>
<br>
<p></p>

