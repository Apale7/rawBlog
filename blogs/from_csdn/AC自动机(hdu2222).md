---
title: AC自动机(hdu2222)
date: 2018-04-18
tags:
 - 

categories:
 - 字符串

---

写的链式的，数组实现还不会。
链式如果delete就会花费很多时间，不delete就花很多内存。
就先这样吧......
```
#include<bits/stdc++.h>
using namespace std;

string str,pri;
int T,n;
struct Node
{
    int cnt;
    Node *next[26];
    Node *fail;
    Node()
    {
        cnt = 0;
        memset(next,0,sizeof(next));
        fail = nullptr;
    }
}*rt,*p,*pp;//要在主函数第一行写上 rt = new Node;


void Insert(string str)//往字典树中插入一个字符串
{
    int a;
    Node *p = rt;
    for(int i=0;str[i]!='\0';++i)
    {
        a = str[i] - 'a';
        if(p->next[a] == NULL)
        {
            p->next[a] = new Node;
            p->next[a]->cnt = 0;
        }
        p = p->next[a];
    }
    ++p->cnt;//记录该单词出现的次数
}


void getfail()
{
	queue<Node*> que;
	que.push(rt);                          	//根节点先入队
	while(!que.empty())					   
	{
		p = que.front();
		que.pop();
		for(int i=0;i<26;i++)				//遍历队首元素的next，
		{
			if(p->next[i])
			{
				if(p==rt)					//根节点的子节点的fail指针直接指向rt
					p->next[i]->fail = rt;	//(显然，因为同一层不可能存在相同的节点)
				else						//从p的fail指针指向的元素中找存在next[i]的
				{
					pp = p->fail;
					while(pp)				//pp为rt的时候退出循环
					{
						if(pp->next[i])		//找到就把fail指过去
						{
							p->next[i]->fail = pp->next[i];
							break;
						}
						pp = pp->fail;
					}
					if(pp==nullptr)			//找不到就指rt
						p->next[i]->fail = rt;
//					if(!p->next[i]->fail)   这样写也可以
//						p->next[i]->fail = rt;
				}
				que.push(p->next[i]);//p的所有子节点入队
			}
		}
	}
}

int query()
{
	int i;//主串下标
	int a;
	int cnt = 0;//模式串出现的次数
	p = rt;
	int len = str.length();
	for(int i=0;i<len;i++)
	{
		a = str[i] - 'a';
		while(p->next[a]==nullptr&&p!=rt)	//找主串第i个元素首次出现的位置
			p = p->fail;					//当前节点的next找不到就跳到fail
		p = p->next[a];
		if(p==nullptr)//没找到
			p = rt;
		pp = p;
		while(pp!=rt)//从str[i]首次出现的地方往后找
		{
			if(pp->cnt>=0)//找到一个单词，就把这个单词出现的次数统计下来
			{
				cnt += pp->cnt;
				pp->cnt = -1;//-1表示访问过(后面有可能还会搜到这个节点，标记以便查重)
			}
			else//此节点已统计过，不用再往下
				break;
			pp = pp->fail;
		}
	}
	return cnt;
}


int main()
{
	ios::sync_with_stdio(false);

    cin>>T;
    while(T--)
	{
		rt = new Node;
		cin>>n;
		while(n--)
		{
			cin>>pri;
			Insert(pri);
		}
		getfail();
		cin>>str;
		cout<<query()<<endl;
		delete rt;
	}
}
```
