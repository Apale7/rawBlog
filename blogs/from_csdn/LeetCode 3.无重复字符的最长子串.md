---
title: LeetCode 3.无重复字符的最长子串
date: 2020-07-06
tags:
 - 

categories:
 - Leetcode

---

遍历字符串s，用数组num(哈希表也行)记录已出现的字符，用队列存储以当前字符为尾的无重复字符的最长子串。当当前字符已出现时，要将上次出现的位置之前的所有字符从队列中删去。遍历过程中队列的最大长度就是最终结果。
#### C++
```c
class Solution
{
public:
    int lengthOfLongestSubstring(string s)
    {
        auto num = vector<char>(128, 0);
        queue<char> q;
        int ans = 0;
        for (auto &i: s)
        {
            if (num[i])
            {
                while (num[i])
                {
                    --num[q.front()];
                    q.pop();
                }
            }
            q.push(i);
            if (q.size() > ans)
                ans = q.size();
            ++num[i];
        }
        return ans;
    }
};
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200706202834702.png)

#### Python

```python
from queue import Queue
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        st = set()
        q = Queue()
        ans = 0
        for i in s:
            while i in st:
                st.remove(q.get())
            q.put(i)
            st.add(i)
            ans = max(ans, q.qsize())
        return ans
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200706203411603.png)
实际上直接维护两个指针来模拟队列操作，而不显式使用队列，效率会更高(时间复杂度都是$O(N)$)。
#### 修改后的Python

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        st = set()
        head = 0
        tail = -1
        ans = 0
        for i in s:
            while i in st:
                st.remove(s[head])
                head += 1
            tail += 1
            st.add(i)
            ans = max(ans, tail - head + 1)
        return ans
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200706204618261.png)
确实快了很多

