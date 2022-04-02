---
title: Treap(旋转)  bzoj3224普通平衡树
date: 2018-09-05
tags:
 - 

categories:
 - 数据结构

---

Treap = Tree + heap，Tree是BST，即同时维护二叉查找树和堆的性质
Treap的定义：

```
int ch[maxn][2], val[maxn], siz[maxn], num[maxn], pri[maxn];//此处优先级用了小根堆
int tot, rt;
#define ls ch[now][0]
#define rs ch[now][1]
```
ch数组存的是左右孩子节点的下标
val是BST的值，siz是子树大小，
num指值为val的数有多少个
pri是堆的值(此处选择了小根堆)
tot是treap的结点总数(val相同的很多个数只占一个结点)
rt是当前的树根
宏是拿来偷懒滴
1、一棵BST，无论如何左旋右旋，结点间的关系一定不会变。
2、BST在数据随机的情况下所有操作的期望都是O(logN)
Treap就是利用以上两点，把插入的数据通过旋转，变得好像是随机插入的一样。 
Treap的每次插入，先像普通的BST一样找到插入的位置，然后给pri赋随机值，再以旋转的方式用pri在不改变BST的性质的前提下维护heap。

旋转:
旋转后siz会变，要更新
```
inline void pushup(int now)
{
    siz[now] = siz[ls] + siz[rs] + num[now];
}

void rotate(int &x,int dir)//把now旋转到它的儿子的位置,dir为0代表右旋,1左旋
{
    int son = ch[x][dir];
    ch[x][dir] = ch[son][dir^1];
    ch[son][dir^1] = x;
    pushup(x);//旋转后x在下面，先更新x
    pushup(x=son);
}
```

插入一个值为v的数:
递归写起来比较舒服~
4种情况：
1、找到了一个空位
新建一个点，over
2、当前节点的val == v
当前结点的num+1，over
3、当前节点的val > v
递归往左子树插入
检查左孩子的pri是否小于当前的pri，小于则右旋(左子树完成插入后可能不满足堆的性质)
4、跟3反过来

一路上的siz都要++(下面多了一个数)
```
void Insert(int v,int &now)
{
    if(!now)//找到空位直接新开一个点
    {
        newnode(v,now);
        return ;
    }
    ++siz[now];
    if(val[now] == v)//这个数已经存在,num+1即可
    {
        ++num[now];
        return ;
    }
    else if(v < val[now])
    {
        Insert(v,ls);
        if(pri[ls] < pri[now])
            rotate(now,0);//左儿子优先级小就把左儿子旋到上面来(右旋)
    }
    else
    {
        Insert(v,rs);
        if(pri[rs] < pri[now])
            rotate(now,1);//右儿子优先级小就把右儿子旋到上面来(左旋)
    }
}
```

删除一个值为v的数:
3种情况 吧
1、如果找到val == v的结点，且该结点的num > 1，num-1就行了
2、找到val == v的结点，且该结点的num == 1
(1)如果没有左右子树，直接赋个0删了就行
(2)如果左右子树中有一个为空，赋值为不为空的那个(就是直接拿孩子把它覆盖掉)
(3)如果左右子树都有，把孩子中pri小的那个转上来(维护堆的性质不变)，然后再递归删当前结点(为什么不是删孩子结点？因为旋转完，当前节点已经转到孩子那里去了啊)
3、val != v
递归删左或右即可

一路上的siz都要-1
3的(3)siz不用-1，因为转上去的孩子siz都是没变的，转下去的那个点被删了，不用管它的siz

```
void dele(int v,int &now)
{
    if(!now)//防非法数据
        return ;
    if(val[now] == v)
    {
        if(num[now] > 1)
        {
            --siz[now];
            --num[now];
            return ;
        }
        else
        {
            if(!ls && !rs)
            {
                now = 0;
                return ;
            }
            else if(!ls || !rs)
            {
                now = ls + rs;
                return ;
            }
            else
            {
                int dir = pri[ls] > pri[rs];
                rotate(now,dir);
                dele(v,now);
            }
        }
    }
    else
    {
        --siz[now];
        dele(v,ch[now][v>val[now]]);
    }
}
```
查值为v的数的排名
比较简单 ，直接看注释吧

```
int rk(int v,int now)
{
    if(!now) return 0;//防非法数据
    if(v == val[now])
        return siz[ls] + 1;//siz[ls]是比v小的数的数量，+1就是v的排名
    else if(v < val[now])
        return rk(v,ls);
    else
        return rk(v,rs)+siz[ls]+num[now];//往右子树找记得把左子树大小和当前点的大小加上
}
```

查排名为k的数:
跟上面差不多
```
int kth(int k,int now)
{
    if(siz[ls] < k && siz[ls] + num[now] >= k)
        return val[now];
    else if(k <= siz[ls])
        return kth(k,ls);
    else
        return kth(k-siz[ls]-num[now],rs);
}
```

求前驱、后继

```
int pre(int v,int now)
{
    if(!now) return -inf;//找到空的地方返回-inf，因为上一层有max，-inf不会计入答案
    if(val[now] >= v)//当前节点的值比v大,不可能成为前驱
        return pre(v,ls);//往左节点找
    return max(pre(v,rs), val[now]);
}

int suc(int v,int now)
{
    if(!now) return inf;
    if(val[now] <= v)//当前节点的值比v小,不可能成为后继
        return suc(v,rs);//往右节点找
    return min(suc(v,ls), val[now]);
}
```

bzoj3224普通平衡树:

```
#include<cstdio>
#include<queue>
#include<cstdlib>
#include<algorithm>
using namespace std;
const int maxn = 1e5 + 5;
const int inf = 1e9 + 9;
int ch[maxn][2], val[maxn], siz[maxn], num[maxn], pri[maxn];//优先级用小根堆
int tot, rt;
#define ls ch[now][0]
#define rs ch[now][1]
queue<int> que;
inline void newnode(int v,int &x)
{
    if(!que.empty())
    {
        x = que.front();
        que.pop();
    }
    else
        x = ++tot;
    ch[x][0] = ch[x][1] = 0;
    num[x] = 1;
    val[x] = v;
    siz[x] = 1;
    pri[x] = rand();
}

inline void reuse(int x)
{
    que.push(x);
}

inline void pushup(int now)
{
    siz[now] = siz[ls] + siz[rs] + num[now];
}

void rotate(int &x,int dir)//把now旋转到它的儿子的位置,dir为0代表左儿子
{
    int son = ch[x][dir];
    ch[x][dir] = ch[son][dir^1];
    ch[son][dir^1] = x;
    pushup(x);//旋转后x在下面，先更新x
    //x = son;
    pushup(x=son);
}

void Insert(int v,int &now)
{
    if(!now)//找到空位直接新开一个点
    {
        newnode(v,now);
        return ;
    }
    ++siz[now];
    if(val[now] == v)//这个数已经存在,num+1即可
    {
        ++num[now];
        return ;
    }
    else if(v < val[now])
    {
        Insert(v,ls);
        if(pri[ls] < pri[now])
            rotate(now,0);//左儿子优先级小就把左儿子旋到上面来(右旋)
    }
    else
    {
        Insert(v,rs);
        if(pri[rs] < pri[now])
            rotate(now,1);//右儿子优先级小就把右儿子旋到上面来(左旋)
    }
}

void dele(int v,int &now)
{
    if(!now)
        return ;
    if(val[now] == v)
    {
        if(num[now] > 1)
        {
            --siz[now];
            --num[now];
            return ;
        }
        else
        {           
            if(!ls && !rs)
            {
				reuse(now);
                now = 0;
                return ;
            }
            else if(!ls || !rs)
            {
            	reuse(now);
                now = ls + rs;
                return ;
            }
            else
            {
                int dir = pri[ls] > pri[rs];
                rotate(now,dir);
                dele(v,now);
            }
        }
    }
    else
    {
        --siz[now];
        dele(v,ch[now][v>val[now]]);
    }
}

int rk(int v,int now)
{
    if(!now) return 0;
    if(v == val[now])
        return siz[ls] + 1;
    else if(v < val[now])
        return rk(v,ls);
    else
        return rk(v,rs)+siz[ls]+num[now];
}

int kth(int k,int now)
{
    if(siz[ls] < k && siz[ls] + num[now] >= k)
        return val[now];
    else if(k <= siz[ls])
        return kth(k,ls);
    else
        return kth(k-siz[ls]-num[now],rs);
}

int pre(int v,int now)
{
    if(!now) return -inf;
    if(val[now] >= v)//当前节点的值比v大,不可能成为前驱
        return pre(v,ls);//往左节点找
    return max(pre(v,rs), val[now]);
}

int suc(int v,int now)
{
    if(!now) return inf;
    if(val[now] <= v)//当前节点的值比v小,不可能成为后继
        return suc(v,rs);//往右节点找
    return min(suc(v,ls), val[now]);
}

int n,op,x;
int main()
{
    scanf("%d",&n);
    while(n--)
    {
        scanf("%d%d",&op,&x);
        switch(op)
        {
            case 1: Insert(x,rt); break;
            case 2: dele(x,rt); break;
            case 3: printf("%d\n",rk(x,rt));break;
            case 4: printf("%d\n",kth(x,rt));break;
            case 5: printf("%d\n",pre(x,rt));break;
            default:printf("%d\n",suc(x,rt));
        }
    }
    return 0; 
}
```
