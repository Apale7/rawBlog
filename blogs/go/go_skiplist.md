---
title: golang实现skiplist
date: 2021-07-20
tags:
 - golang
categories:
 - golang
---

最近打算写一个nosql，第一步先实现了一个skiplist方便后面的LSM实现

+ 目前只实现了Get Set
+ 详情见 https://github.com/Apale7/kiDB

```go
package engine

import (
	"bytes"
	"math/rand"
)

type SkipList struct {
	maxLevel        int
	length          int
	probability     float64
	probabilityList []float64
	randomGenerator rand.Source
	head            []*Node //每一行的头指针
	previousCache   []*Node //每一行key比当前key小的node, 插入时使用
}

type Node struct {
	key   []byte
	value interface{}
	next  *Node
	prev  *Node // 只在level0使用
	down  *Node
}

func (n *Node) Next() Iterator {
	return n.next
}

func (n *Node) Prev() Iterator {
	return n.prev
}

func (n *Node) Value() interface{} {
	return n.value
}

func (n *Node) Key() []byte {
	return n.key
}

func NewSkipList(maxLevel int, probability float64, randomGenerator rand.Source) *SkipList {
	if probability >= 1 {
		panic("invalid probability")
	}
	probabilityList := make([]float64, maxLevel)
	probabilityList[0] = 1
	for i := 1; i < maxLevel; i++ {
		probabilityList[i] = probabilityList[i-1] * probability
	}
	head := make([]*Node, maxLevel)
	head[0] = &Node{}
	for i := 1; i < maxLevel; i++ {
		head[i] = &Node{
			down: head[i-1],
		} //head要分配内存，previousCache直接存指针，不用分配内存
	}

	return &SkipList{
		maxLevel:        maxLevel,
		length:          0,
		probability:     probability,
		probabilityList: probabilityList,
		randomGenerator: randomGenerator,
		head:            head,
		previousCache:   make([]*Node, maxLevel),
	}
}

func NewDefaultSkipList() *SkipList {
	return NewSkipList(20, float64(1)/3, rand.NewSource(rand.Int63()))
}

// randomLevel return level in [1, maxLevel]
func (sl *SkipList) randomLevel() (level int) {
	r := float64(sl.randomGenerator.Int63()) / (1 << 63)

	level = 1
	for level < sl.maxLevel && r < sl.probabilityList[level] {
		level++
	}
	return level
}

func (sl *SkipList) previousNodes(key []byte) []*Node {
	cache := sl.previousCache
	prev := sl.head[sl.maxLevel-1] //prev.key是当前level中小于key的最大的key
	var now *Node
	for i := sl.maxLevel - 1; i >= 0; i-- {
		now = prev.next
		for now != nil && bytes.Compare(key, now.key) > 0 {
			prev = now
			now = now.next
		}
		cache[i] = prev
		prev = prev.down
	}
	return cache
}

func (sl *SkipList) Set(key []byte, value interface{}) *Node {
	prevs := sl.previousNodes(key)
	if nxt := prevs[0].next; nxt != nil && bytes.Equal(nxt.key, key) {
		//存在，直接修改value
		nxt.value = value
		return nxt
	}

	level := sl.randomLevel()
	nodes := make([]*Node, level)
	nodes[0] = &Node{
		key:   key,
		value: value,
		prev:  prevs[0],
		next:  prevs[0].next,
	}
	prevs[0].next = nodes[0]

	for i := 1; i < level; i++ {
		nodes[i] = &Node{
			key:  key,
			next: prevs[i].next,
			down: nodes[i-1],
		}
		prevs[i].next = nodes[i]
	}
	sl.length++
	return nodes[0]
}

func (sl *SkipList) Get(key []byte) Iterator {
	now := sl.head[sl.maxLevel-1]
	for i := sl.maxLevel - 1; i > 0; i-- {
		for now.next != nil && bytes.Compare(now.next.key, key) < 0 {
			now = now.next
		}
		now = now.down
	}
	for now != nil && bytes.Compare(now.key, key) < 0 {
		now = now.next
	}
	if now != nil && bytes.Equal(now.key, key) {
		return now
	}
	return nil
}

func (sl *SkipList) GetRange(left, right *[]byte) (begin Iterator, end Iterator) {
	return
}

```