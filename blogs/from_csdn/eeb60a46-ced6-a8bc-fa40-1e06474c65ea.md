---
title: LeetCode 1.两数之和
date: 2020-07-06
tags:
 - 

categories:
 - Leetcode

---

# LeetCode 1.两数之和

两个想法：

## 1、二分查找

#### 记录每个数的下标，按值排序后遍历，二分查找判断是否存在$target-a$

## C++代码

```c
class Solution
{
public:
    vector<int> twoSum(vector<int> &nums, int target)
    {
        vector<pair<int, int>> p(nums.size());
        for (int i = 0; i < nums.size(); ++i)
        {
            p[i].first = nums[i];
            p[i].second = i;
        }
        sort(p.begin(), p.end());
        for (auto a = p.begin(); a != p.end(); ++a)
        {
            auto t = make_pair(target - a->first, 0);//second随便填，因为只关心first
            auto b = lower_bound(p.begin(), p.end(), t, [](const pair<int, int> &x, const pair<int, int> &y)
            {
                return x.first < y.first;
            });//lambda表达式传入cmp函数自定义二分查找的规则(只比较first)。因为库函数lowerbound是用小于号进行判断的，所以传入一个自定义的小于规则
            if (b != p.end() && a != b && a->first + b->first == target)
            {//除了要判断有没有找到(b != p.end()), 还需要注意ab不能为同一个数
                return vector<int>{a->second, b->second};
            }
        }
        return vector<int>{-1, -1};
    }
};
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200706163947755.png)
### Python代码

```python
class Solution:
    def binary_search(self, p, target):
        l, r = 0, len(p) - 1
        while l < r:
            m = l + r >> 1
            if p[m][0] >= target:
                r = m
            else:
                l = m + 1
        return l

    def twoSum(self, nums: List[int], target: int) -> List[int]:
        p = [(v, i) for i, v in enumerate(nums)]
        p.sort(key=lambda x: x[0])
        for i, v in enumerate(p):
            j = self.binary_search(p, target - v[0])
            if i != j and v[0] + p[j][0] == target:
                return [v[1], p[j][1]]
        return [-1, -1]
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200706164010861.png)

## 2、哈希表

#### 只遍历一遍，用哈希表记录已经遍历过的数的值和下标。每遍历到一个新的数$x$，用哈希表查一下$target-x$是否存在

```c
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> vis;
        for (int i = 0; i < nums.size(); ++i)
        {
            if (vis.count(target - nums[i]))
                return vector<int>{vis[target - nums[i]], i};
            vis[nums[i]] = i;
        }
        return vector<int>{-1, -1};
    }
};
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200706164035286.png)
```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        vis = {}
        for i, v in enumerate(nums):
            if target - v in vis:
                return [vis[target - v], i]
            vis[v] = i
        return [-1, -1]
```


![在这里插入图片描述](https://img-blog.csdnimg.cn/20200706164056975.png)

用哈希表省去了构造value, pos的pair和排序的过程，无论是代码长度还是效率都略优。


