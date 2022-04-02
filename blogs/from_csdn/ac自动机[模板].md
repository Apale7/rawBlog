---
title: ac自动机[模板]
date: 2018-11-28
tags:
 - 

categories:
 - 字符串

---

```
struct AC_Automaton
{
    static const int sigmaSize = 26;
    int next[maxn][sigmaSize];
    int fail[maxn];
    int end[maxn];
    int siz, rt;

    void init()
    {
        siz = 0;
        rt = newNode();
    }

    int newNode()
    {
        memset(next[siz], -1, 4 * sigmaSize);
        fail[siz] = -1;
        end[siz] = 0;
        return siz++;
    }

    void insert(char s[], int id)
    {
        int p = rt, c;
        for (int i = 0; s[i]; ++i)
        {
            c = s[i] - 'A';
            if (next[p][c] == -1)
                next[p][c] = newNode();
            p = next[p][c];
        }
        end[p] = id;
    }

    void getFail()
    {
        queue<int> q;
        for (int i = 0; i < sigmaSize; ++i)
        {
            if (~next[rt][i])
            {
                fail[next[rt][i]] = rt;
                q.push(next[rt][i]);
            }
            else
                next[rt][i] = rt;
        }
        int p;
        while (!q.empty())
        {
            p = q.front();
            q.pop();
            for (int i = 0; i < sigmaSize; ++i)
            {
                int &v = next[p][i];
                if (~v)
                {
                    fail[v] = next[fail[p]][i];
                    q.push(v);
                }
                else
                    v = next[fail[p]][i];
            }
        }
    }

    void query(char s[],int ans[])
    {
        int p = rt, ret = 0;
        for (int i = 0; s[i]; ++i)
        {
            if (!isupper(s[i]))
                s[i] = 'Z' + 1;
            p = next[p][s[i] - 'A'];
            for (int j = p; end[j]; j = fail[j])
            {
                ++ans[end[j]];
            }
        }
    }
} ac;
```


