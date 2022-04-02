---
title: ST表板子
date: 2019-04-17
tags:
 - 

categories:
 - 数据结构

---

存一个ST表板子
可用于维护静态区间最值和gcd
以后的代码左花括号不会另起一行。
(让两个队友舒服点o(╥﹏╥)o)
```c
int dp[maxn][30];
void init() {
	for (int j=1; j<=20; ++j)
		for (int i=1; i + (1 << j) - 1 <= n; ++i)
			dp[i][j] = __gcd(dp[i][j-1], dp[i+(1 << (j-1))][j-1]);
}

int query(int l, int r) {
	int k = log2(r - l + 1);
	return __gcd(dp[l][k], dp[r - (1 << k) + 1][k]);
}
```


