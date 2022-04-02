---
title: ACM-ICPC 2018 徐州赛区网络预赛 J - Maze Designer
date: 2018-09-13
tags:
 - 

categories:
 - 图算法,树上算法

---

题目链接:https://nanti.jisuanke.com/t/31462

题意:
在一个N*M的空地上，建墙造一个迷宫，使得迷宫的耗费最小，且迷宫中的任意两点之间只有一条路，题目保证每组数据的迷宫唯一。
输入迷宫中两个点的坐标，输出两点间的距离

思路:任意两点间只有一条路，显然是一棵树。在地图上建最大生成树，就可以使得墙的耗费最小。两点间距离就是在树上跑LCA

```
#include <cstdio>
#include <queue>
#include <vector>
#include <cstring>
#include <algorithm>

using namespace std;

const int maxn = (int)3e5 + 5;
int N,M,Q;
#define getpos(i,j) (i-1)*M + j

struct Edge
{
    int u,v,w;
    Edge(int _u=0,int _v=0,int _w=0)
    {
        u = _u;
        v = _v;
        w = _w;
    }
    bool operator<(const Edge a) const
    {
        return w > a.w;
    }
};

vector<Edge> e;
vector<int> G[maxn];
int f[maxn];
int Find(int x)
{
    return x == f[x] ? x : f[x] = Find(f[x]);
}

int deep[maxn],in[maxn],out[maxn],cnt,anc[maxn][21],dis;
void dfs(int u,int fa)
{
    in[u] = ++cnt;
    deep[u] = deep[fa] + 1;
    anc[u][0] = fa;
    for (int i = 1; i <= 20; ++i)
    {
        anc[u][i] = anc[anc[u][i-1]][i-1];
        if(!anc[u][i])
            break;
    }
    for(auto v:G[u])
    {
        if(v!=fa)
            dfs(v,u);
    }
    out[u] = cnt;
}

int lca(int a,int b)
{
    if(deep[a]>deep[b])
        swap(a,b);
    if(in[a] <= in[b] && out[b] <= out[a])
        return a;
    for(int i=20;~i;--i)
        if(deep[a] < deep[b] && deep[a] <= deep[anc[b][i]])
            b = anc[b][i];
    for(int i=20;~i;--i)
        if(anc[a][i]!=anc[b][i])
            a = anc[a][i], b = anc[b][i];
    return anc[a][0];
}

void init()
{
    cnt = 0;
    for (int i = 1; i < maxn; ++i)
    {
        f[i] = i;
    }
    deep[0] = 0;

}

int main()
{
    init();
    int u, v, w;
    char dir[2];
    scanf("%d%d",&N,&M);
    for(int i = 1;i <= N; ++i)
    {
        for (int j = 1; j <= M ; ++j)
        {
            u = getpos(i,j);
            for (int k = 0; k < 2; ++k)
            {
                scanf("%s%d",dir,&w);
                if (dir[0] == 'D')
                    v = getpos(i+1,j);
                else if (dir[0] == 'R')
                    v = getpos(i,j+1);
                else
                    continue;
                e.emplace_back(Edge(u,v,w));
            }
        }
    }
    sort(e.begin(),e.end());
    int x, y;
    for (auto i:e)
    {
        x = Find(i.u);
        y = Find(i.v);
        if(x!=y)
        {
            G[i.v].emplace_back(i.u);
            G[i.u].emplace_back(i.v);
            f[x] = y;
        }
    }
    dfs(getpos(1,1),0);
    scanf("%d",&Q);
    int x1, y1, x2, y2, L;
    while(Q--)
    {
        scanf("%d%d%d%d",&x1,&y1,&x2,&y2);
        u = getpos(x1,y1), v = getpos(x2,y2);
        L = lca(u,v);
        printf("%d\n",deep[u] + deep[v] - 2*deep[L]);
    }
    return 0;
}
```
