---
title: URAL - 1989 Subpalindromes（字符串哈希+ 树状数组 or 线段树）
date: 2019-04-15
tags:
 - 

categories:
 - 字符串

---

[题目链接](https://vjudge.net/problem/URAL-1989)
### 题意
输入一个1e5的串a，1e5次询问
每次询问：
palindrome？ l r 询问$[l ,r]$的子串是否是回文串
change x c 把a[x]改成c
下标从1开始

### 解法
显然， 若一个串与它反转后的串相同，这个串就是回文串(~~废话~~ )
这里要用到多项式哈希， 将原串和反转后的串的每个字符哈希，用树状数组维护

### 字符串哈希
把字符串的第$i$个字符哈希:$h[i] = a[i] * base^i$
用$\sum_{i=l}^{r}{h[i]}$来表示$[l, r]$子串的哈希值
显然$\sum$可以用树状数组 $or$ 线段树快速维护
因为一个子串在原串和反转串中的位置不同，
设在原串中的位置为$[l, r]$，
则在反转串中的位置为$[len-r+1, len - l + 1]$(下标从1开始)
要先把靠左边的子串的哈希值乘上$base^{|r - (len - l + 1)|}$，对齐后再进行比较

代码：

```c
#include <bits/stdc++.h>

using namespace std;

const int base = 31;
const int maxn = 100005;
typedef unsigned long long ull;


char a[maxn], op[20];
int q, n;
ull p[maxn];
ull sum[2][maxn];

inline int lowbit(int x) {
    return x & -x;
}

void add(int p, ull val, bool flag) {
    for (int i = p; i <= n; i += lowbit(i)) {
        sum[flag][i] += val;
    }
}

ull getSum(int p, bool flag) {
    ull ans = 0;
    for (int i = p; i > 0; i -= lowbit(i)) {
        ans += sum[flag][i];
    }
    return ans;
}

int main() {
    scanf("%s", a + 1);
    n = strlen(a + 1);
    p[0] = 1;
    for (int i = 1; i <= n; ++i) {
        p[i] = p[i - 1] * base;
    }
    for (int i = 1; i <= n; ++i) {
        add(i, a[i] * p[i - 1], 0);
    }
    for (int i = 1; i <= n; ++i) {
        add(i, a[n - i + 1] * p[i - 1], 1);
    }
    scanf("%d", &q);
    int x, y;
    ull s1, s2;
    while (q--) {
        scanf("%s", op);
        if (op[0] == 'p') {
            scanf("%d%d", &x, &y);
            s1 = getSum(y, 0) - getSum(x - 1, 0);
            s2 = getSum(n - x + 1, 1) - getSum(n - y, 1);
            if (y < n - x + 1)
                s1 *= p[n - x + 1 - y];
            else
                s2 *= p[y - (n - x + 1)];
            if (s1 == s2)
                printf("Yes\n");
            else
                printf("No\n");
        }
        else {
            scanf("%d%s", &x, op);
            add(x, (op[0] - a[x]) * p[x - 1], 0);
            add(n - x + 1, (op[0] - a[x]) * p[n - x], 1);
            a[x] = op[0];
        }
    }
}
```


