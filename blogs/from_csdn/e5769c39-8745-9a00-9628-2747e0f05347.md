---
title: LeetCode 5.最长回文子串
date: 2020-07-12
tags:
 - 

categories:
 - Leetcode

---

裸的马拉车算法。(当然回文自动机也行)

```c
class Solution
{
public:
    string longestPalindrome(const string &s)
    {
        auto p = manacher(s);
        return s.substr(p.first - p.second >> 1, p.second - 1);
    }

    pair<int, int> manacher(const string &s)
    {
        string a = "$#";
        for (auto &i: s)
        {
            a.push_back(i);
            a.push_back('#');
        }
        vector<int> p(a.size(), 0);
        int mx = 0, mid = 0, ansMid = 0, ansLen = 0;
        for (int i = 1; i < int(a.size()); ++i)
        {
            p[i] = mx > i ? min(mx - i, p[2 * mid - i]) : 1;

            while (a[i + p[i]] == a[i - p[i]]) ++p[i];
            if (i + p[i] > mx)
            {
                mx = i + p[i];
                mid = i;
            }
            if (p[i] > ansLen)
            {
                ansLen = p[i];
                ansMid = i;
            }
        }
        return {ansMid, ansLen};
    }
};
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200712162630327.png)

