---
title: KMP模板
date: 2018-04-11
tags:
 - 

categories:
 - 字符串

---

```
char t[1000005],p[10005];
int Next[10005];

void getNext()
{
    int j=0,k=-1;
    int len = strlen(p);
    Next[0] = -1;
    while(j<len)
        if(k==-1||p[j]==p[k])
            Next[++j] = ++k;
        else
            k = Next[k];
}

int KMP()
{
	getNext();
	int j = 0,i = 0;
	int tlen = strlen(t),plen = strlen(p);
	while(i<tlen&&j<plen)
	{
		if(j==-1||t[i]==p[j])
		{
			++i;
			++j;
		}
		else
			j = Next[j];
	}
	if(j==plen)
		return i-plen;
	else
		return -1;	
}

//nextval应该很少用到吧。。。
void getNextval()
{
    int j=0,k=-1;
    int len = strlen(p);
    Next[0] = -1;
    while(j<len)
        if(k==-1||p[j]==p[k])
        {
        	++j,++k;
        	if (p[j] != p[k])
                Next[j] = k;
            else
                Next[j] = Next[k];
        }
        
        else
            k = Next[k];
}

```
