---
title: LeetCode 2.两数相加
date: 2020-07-06
tags:
 - 

categories:
 - Leetcode

---

直接模拟竖式加法即可(题目倒过来存放数字，可以说是极其友善了)。

```c
class Solution
{
public:
    ListNode *addTwoNumbers(ListNode *l1, ListNode *l2)
    {
        auto head = new ListNode(0);//ans是带头结点的单链表
        auto ans = head;
        char carry = 0;
        while (l1 != nullptr && l2 != nullptr)
        {
            l1->val += l2->val + carry;
            carry = 0;
            if (l1->val >= 10)
            {
                carry = 1;
                l1->val -= 10;
            }
            head->next = l1;
            head = head->next;
            l1 = l1->next;
            l2 = l2->next;
        }
        while (l1 != nullptr)
        {
            l1->val += carry;
            carry = 0;
            if (l1->val >= 10)
            {
                carry = 1;
                l1->val -= 10;
            }
            else//一个小优化。不进位时直接将后续结点接上就可以结束了
            {
                head->next = l1;
                break;
            }
            head->next = l1;
            l1 = l1->next;
            head = head->next;
        }
        while (l2 != nullptr)
        {
            l2->val += carry;
            carry = 0;
            if (l2->val >= 10)
            {
                carry = 1;
                l2->val -= 10;
            }
            else
            {
                head->next = l2;
                break;
            }                
            head->next = l2;
            l2 = l2->next;
            head = head->next;
        }
        if (carry)
            head->next = new ListNode(carry);
        auto t = ans;
        ans = ans->next;//跳过头结点
        delete t;//释放内存
        return ans;
    }
};
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200706200341762.png)
```python
class Solution:
    def addTwoNumbers(self, l1: ListNode, l2: ListNode) -> ListNode:
        carry = 0
        head = ListNode(0)
        ans = head
        while l1 and l2:
            l1.val += carry + l2.val
            carry = 0
            if l1.val > 9:
                l1.val -= 10
                carry = 1
            head.next = l1
            head = head.next
            l1 = l1.next
            l2 = l2.next
        while l1:
            l1.val += carry
            carry = 0
            if l1.val > 9:
                l1.val -= 10
                carry = 1
            else:
                head.next = l1
                break
            head.next = l1
            l1 = l1.next
            head = head.next
        while l2:
            l2.val += carry
            carry = 0
            if l2.val > 9:
                l2.val -= 10
                carry = 1
            else:
                head.next = l2
                break
            head.next = l2
            l2 = l2.next
            head = head.next
        if carry:
            head.next = ListNode(1)
        return ans.next

```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200706200258650.png)
python写得还是矬，跑这么慢= =

