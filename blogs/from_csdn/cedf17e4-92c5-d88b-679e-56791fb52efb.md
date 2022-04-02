---
title: LightOJ 1339	Strongest Community
date: 2019-05-18
tags:
 - 

categories:
 - 数据结构

---

#### 题意
查询$[L, R]$中连续出现次数最多的数出现的次数，如$[1,1,2,2,2,2,3,3,3]$中连续出现次数最多的是2，次数为4
#### 思路
这题显然可以直接线段树区间合并。
用线段树维护区间的前缀中的答案(答案指**区间中连续出现次数最多的数出现的次数**)、后缀中的答案。
设$m = L + R >> 1$，则$ans[L,R]$是以下三者中最大的那个：
1. $ans[L,m]$
2. $ans[m+1,R]$
3. 跨越了$m$的部分。这一部分可以由右区间前缀的答案和左区间后缀的答案合并得到
代码：

```c
#include <bits/stdc++.h>

using namespace std;
const int maxn = 100005;
int n, a[maxn], len[maxn << 2], pre[maxn << 2], suf[maxn << 2];
#define ls l,m,rt<<1
#define rs m+1,r,rt<<1|1

inline void pushUp(int l, int r, int rt) {
    pre[rt] = pre[rt << 1];
    suf[rt] = suf[rt << 1 | 1];
    len[rt] = max(len[rt << 1], len[rt << 1 | 1]);
    int m = l + r >> 1;
    if (a[m] == a[m + 1]) {
        if (pre[rt] == m - l + 1)
            pre[rt] += pre[rt << 1 | 1];
        if (suf[rt] == r - m)
            suf[rt] += suf[rt << 1];
        len[rt] = max(len[rt], suf[rt << 1] + pre[rt << 1 | 1]);
    }
};

void build(int l = 1, int r = n, int rt = 1) {
    if (l == r) {
        len[rt] = pre[rt] = suf[rt] = 1;
        return;
    }
    int m = l + r >> 1;
    build(ls);
    build(rs);
    pushUp(l, r, rt);
}

int query(int L, int R, int l = 1, int r = n, int rt = 1) {
    if (L <= l && r <= R) {
        return len[rt];
    }
    int m = l + r >> 1;
    if (L > m)
        return query(L, R, rs);
    else if (R <= m)
        return query(L, R, ls);
    else {
        int ans = max(query(L, R, rs), query(L, R, ls));
        if (a[m] == a[m + 1])
            ans = max(ans, min(pre[rt << 1 | 1], R - m) + min(suf[rt << 1], m - L + 1));
        return ans;
    }
}

int main() {
    int T, m, c;
    scanf("%d", &T);
    for (int ca = 1; ca <= T; ++ca) {
        scanf("%d%d%d", &n, &c, &m);
        for (int i = 1; i <= n; ++i) {
            scanf("%d", a + i);
        }
        build();
        int l, r;
        printf("Case %d:\n", ca);
        for (int i = 1; i <= m; ++i) {
            scanf("%d%d", &l, &r);
            printf("%d\n", query(l, r));
        }
    }
    return 0;
}
```

然鹅因为这题是刷分块莫队专题时遇到的。
所以晚点补一份分块。


