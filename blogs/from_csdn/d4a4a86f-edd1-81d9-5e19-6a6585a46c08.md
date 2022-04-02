---
title: Kefa and Watch CodeForces - 580E
date: 2019-04-18
tags:
 - 

categories:
 - 字符串

---

[题目链接](http://codeforces.com/problemset/problem/580/E)
#### 题意
一个1e5的字符串a， 1e5次操作
$op\  l\ r\  c$(下标从1开始)
$op$ == 1：把$[l, r]$的所有字符改成c
$op$ == 2：询问$[l, r]$是否存在长度为c的循环节
#### 解法
首先有一个结论， **若$[l, r-c]$与$[l+c, r]$相同，则长度为$c$的循环节存在**
为了节约字符串比较的时间，显然要把字符串的每个字符哈希为
$$h[i] = a[i] * base^{n-i-1}\ \ (i从0开始)$$
的形式
每个子串的哈希值就是
$$\sum_{i=l}^{r} h[i]$$
这个sigma显然要用线段树或树状数组维护

这题树状数组怎么区间更新我想不到(流下了不学无术的泪水o(╥﹏╥)o)
讲讲线段树怎么写。
(该mod的地方自行脑补，不写出来了)
##### 线段树部分
上面提到了，要维护的是区间的哈希值之和$\sum_{i=l}^{r} h[i]$
如果是单点更新，那其实是很好写的，每个叶子结点都可以直接存$h[i]$，更新的时候先把c处理成对应的$h[i]$，直接维护区间和即可(这种情况其实用树状数组写起来更舒服，例如[这题](https://blog.csdn.net/Apale_8/article/details/89322353))
然而区间更新的时候，上面那种写法就不适用了(~~太菜了想不到~~ )
现在要解决的问题是：有一个序列$a[]$，l$ogN$求出
$$\sum_{i=l}^r base^{i-1}*a[i]$$
可以这样维护：
预处理出$base^i$的值$p[i]$，$base^i$的前缀和$pp[i]$
对于叶子结点， 保存$a[i]$
###### pushUp
$sum[rt] = sum[rt << 1] * p[r - m] + sum[rt << 1 | 1]$
可以这样理解：把左右子树的和累加的时候，右子树的和是正确的，但左子树的和要整体在base进制下左移$r-m$位，就好像把123和45拼在一起变成12345时，就是123 * $10^2$ + 45
query时也是一样的左右合并

###### update
update很好理解， $[l, r]$的值都被修改为c时，这一段的区间和显然是$c * pp[r-l]$
然后再打上lazy标记：lazy[rt] = val;
pushdown同理
###### 代码
(这题test75卡ull自然溢出.....)
```c
#include <bits/stdc++.h>

using namespace std;
typedef long long ull;
typedef pair<ull, ull> puu;
const int base = 31;
const int maxn = 100005;
const int mod = 1e9 + 9;
char a[maxn];
ull pp[maxn], p[maxn];
#define ls l, m, rt << 1
#define rs m+1, r, rt << 1 | 1
ull sum[maxn << 2];
int lazy[maxn << 2];

void build(int l, int r, int rt) {
    lazy[rt] = 0;
    if (l == r) {
        sum[rt] = ull(a[l]);
        return;
    }
    int m = l + r >> 1;
    build(ls);
    build(rs);
    sum[rt] = (sum[rt << 1] * p[r - m] % mod + sum[rt << 1 | 1]) % mod;
};

inline void pushDown(int l, int r, int rt) {
    if (lazy[rt]) {
        int m = l + r >> 1;
        lazy[rt << 1] = lazy[rt << 1 | 1] = lazy[rt];
        sum[rt << 1] = pp[m - l] * lazy[rt] % mod;
        sum[rt << 1 | 1] = pp[r - m - 1] * lazy[rt] % mod;
        lazy[rt] = 0;
    }
}

void update(int L, int R, int val, int l, int r, int rt) {
    if (L <= l && r <= R) {
        sum[rt] = pp[r - l] * val % mod;
        lazy[rt] = val;
        return;
    }
    int m = l + r >> 1;
    pushDown(l, r, rt);
    if (L <= m)
        update(L, R, val, ls);
    if (R > m)
        update(L, R, val, rs);
    sum[rt] = (sum[rt << 1] * p[r - m] % mod + sum[rt << 1 | 1]) % mod;
}

ull query(int L, int R, int l, int r, int rt) {
    if (L == l && r == R)
        return sum[rt];
    int m = l + r >> 1;
    pushDown(l, r, rt);
    ull ans = 0;
    if (R <= m)
        return query(L, R, ls);
    else if (L > m)
        return query(L, R, rs);
    else {
        ans = (query(L, m, ls) * p[R - m] % mod + query(m + 1, R, rs)) % mod;
        return ans;
    }
}

int n, m, k;

int main() {
    cin >> n >> m >> k;
    m += k;
    p[0] = pp[0] = 1;
    for (int i = 1; i <= n; ++i) {
        p[i] = p[i - 1] * base % mod;
        pp[i] = (p[i - 1] * base % mod + pp[i - 1]) % mod;
    }
    cin >> a;
    build(0, n - 1, 1);
    int op, l, r, c;
    ull h1, h2;
    while (m--) {
        cin >> op >> l >> r >> c;
        --l, --r;
        if (op == 1) {
            update(l, r, c + '0', 0, n - 1, 1);
        }
        else {
            if (r - l + 1 <= c) {
                cout << "YES\n";
                continue;
            }
            h1 = query(l, r - c, 0, n - 1, 1);
            h2 = query(l + c, r, 0, n - 1, 1);
            if (h1 == h2)
                cout << "YES\n";
            else
                cout << "NO\n";
        }
    }
    return 0;
}
```


