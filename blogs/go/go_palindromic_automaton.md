---
title: go 回文树板子
date: 2021-08-09
tags:
 - golang
categories:
 - golang
---

存个回文树的板子

(回文树yyds!!! 马拉车，狗都不写!!!)

[SPOJ-NUMOFPAL](https://vjudge.net/problem/SPOJ-NUMOFPAL)

```go
package main

import "fmt"

type node struct {
	next       []int
	len, num   int
	suffixLink int
}

func makeNode(alphaNum int) node {
	return node{
		next: make([]int, alphaNum),
	}
}

type palindromicAutomaton struct {
	alphaNum  int
	s         string //input
	maxSuffID int    //length of the max current SuffixPalindromicString
	tree      []node
}

func NewPalindromicAutomaton(s string, alphaNum int) *palindromicAutomaton {
	tree := make([]node, 0, len(s))
	tree = append(tree,
		node{},
		node{
			next:       make([]int, alphaNum),
			len:        -1,
			num:        0,
			suffixLink: 1,
		},
		node{ //odd root
			next:       make([]int, alphaNum),
			len:        0,
			num:        0,
			suffixLink: 1,
		},
	)

	return &palindromicAutomaton{
		alphaNum:  alphaNum,
		s:         s,
		maxSuffID: 2,
		tree:      tree,
	}
}

func (pa *palindromicAutomaton) pushBack(pos int) bool {
	cur, curLen := pa.maxSuffID, 0
	c := int(pa.s[pos] - 'a')
	s := pa.s
	for {
		curLen = pa.tree[cur].len
		if pos-1-curLen >= 0 && s[pos-1-curLen] == s[pos] {
			break
		}
		cur = pa.tree[cur].suffixLink
	}
	if pa.tree[cur].next[c] != 0 {
		pa.maxSuffID = pa.tree[cur].next[c]
		return false
	}
	num := len(pa.tree)
	pa.tree = append(pa.tree, makeNode(pa.alphaNum))
	pa.maxSuffID = num

	pa.tree[num].len = pa.tree[cur].len + 2
	pa.tree[cur].next[c] = num
	if pa.tree[num].len == 1 {
		pa.tree[num].suffixLink = 2
		pa.tree[num].num = 1
		return true
	}

	for {
		cur = pa.tree[cur].suffixLink
		curLen = pa.tree[cur].len
		if pos-1-curLen >= 0 && s[pos-1-curLen] == s[pos] {
			pa.tree[num].suffixLink = pa.tree[cur].next[c]
			break
		}
	}
	pa.tree[num].num = 1 + pa.tree[pa.tree[num].suffixLink].num
	return true
}

func main() {
	var s string
	fmt.Scanln(&s)
	pa := NewPalindromicAutomaton(s, 26)
	var ans int64
	for i := range s {
		pa.pushBack(i)
		ans += int64(pa.tree[pa.maxSuffID].num)
	}
	fmt.Println(ans)
}
```