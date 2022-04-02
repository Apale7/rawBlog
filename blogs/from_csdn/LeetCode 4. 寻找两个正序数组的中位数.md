---
title: LeetCode 4. 寻找两个正序数组的中位数
date: 2020-07-07
tags:
 - 

categories:
 - Leetcode

---

累了……以后只放一份代码了。
# 思路
假设第一个数组的长度为$s1$，第二个数组的长度为$s2$
在数组1中选一个位置$m1$，将数组分割为两部分，
左半部分长度为$m1$，右半部分长度为$s1-m1$
在数组2中也选一个位置$m2$进行分割，使得$m1+m2 == s1-m1+s2-m2$
此时如果$m1$左侧的数小于等于$m2$右侧的数，且$m2$左侧的数小于等于$m1$右侧的数，则中位数就产生在两个分割处两侧的四个数中；否则就调整$m1$的位置，直到满足条件。
因此二分$m1$，就可以在$O(logs1)$的时间内得到答案
因为数组长度的奇偶处理起来很麻烦，所以可以借鉴马拉车算法中的增加分隔符的思想将数组长度翻倍。翻倍后长度一定是奇数，更方便处理。
实际上不需要真正地添加分隔符，只要将二分的范围翻倍，取数组值的时候再除以二即可
二分较小的数组可以提升性能。
```python
class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        inf = 2000000000
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1
        s1, s2 = len(nums1), len(nums2)
        low, high = 0, 2 * len(nums1)
        while low <= high:
            m1 = low + high >> 1
            m2 = s1 + s2  - m1
            l1 = nums1[m1 - 1 >> 1] if m1 else -inf
            r1 = nums1[m1 >> 1] if m1 < 2 * s1 else inf
            l2 = nums2[m2 - 1 >> 1] if m2 else -inf
            r2 = nums2[m2 >> 1] if m2 < 2 * s2 else inf
            if l1 > r2:
                high = m1 - 1
            elif l2 > r1:
                low = m1 + 1
            else:
                break
        return (max(l1, l2) + min(r1, r2)) / 2.0
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020070721000141.png)

