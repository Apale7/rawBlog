---
title: codeforce743D - Chloe and pleasant prizes
date: 2018-11-06
tags:
 - 

categories:
 - 树上算法

---

题意：一棵$n$个节点的树，每个节点有一个价值(存在负数)。两个人一人选一棵子树，问 在两棵子树没有公共节点的情况下 两人能取到的价值之和的最大值。

思路：设$dp[u]$是在以$u$为根的树选一棵子树能取到的最大价值。$dp[u]$要么是整棵树的权值之和$sum[u]$，要么是$dp[v]$中的最大值($v$是$u$的孩子)。而答案显然是某一个节点的价值最大的子树与价值次大的子树的价值之和。$dp$ $sum$两个数组一边$dfs$一边维护即可

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;
const int maxn = 2e5 + 5;
int w[maxn];
const long long inf = 1e18;
vector<int> G[maxn];
long long ans;
long long dp[maxn], sum[maxn];

void dfs(int u, int fa)
{
    sum[u] = w[u];
    for (int v:G[u])
    {
        if (v == fa) continue;
        dfs(v, u);
        sum[u] += sum[v];
        if (dp[u] > -inf)
            ans = max(ans, dp[u] + dp[v]);
        dp[u] = max(dp[u], dp[v]);
    }
    dp[u] = max(dp[u], sum[u]);
}

int main()
{
    ans = -inf;
    int n, u, v;
    cin >> n;
    for (int i = 1; i <= n; ++i)
        cin >> w[i];
    for (int i = 1; i <= n; ++i)
        dp[i] = -inf;
    for (int i = 0; i < n - 1; ++i)
    {
        cin >> u >> v;
        G[u].emplace_back(v);
        G[v].emplace_back(u);
    }
    dfs(1, 0);
    int num = 0;
    for (int i = 2; i <= n; ++i)
        if (G[i].size() == 1)
            ++num;
    if (num < 2)//叶子少于两个的话，不可能有答案。
        cout << "Impossible" << endl;
    else
        cout << ans << endl;
    return 0;
}
```


