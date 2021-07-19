---
title: go benchmark踩坑
date: 2021-07-20
tags:
 - golang
categories:
 - golang
---

今天用go的benchmark的时候踩了个坑(其实是自己傻逼了)

背景如下：
写了个skiplist，想测试一下length在1e6时插入的性能

于是写出了如下代码：
```go
func BenchmarkSkipListSet(b *testing.B) {
	sl := NewDefaultSkipList()
	cnt := 1000000
	for i := 0; i < cnt; i++ {
		sl.Set([]byte(utils.RandomAlphaString(10)), 1)
	}
	b.StartTimer()
	for i := 0; i < b.N; i++ {
		sl.Set([]byte(utils.RandomAlphaString(10)), 1)
	}
	b.StopTimer()
}
```
## 我想的是
计时器从b.StartTimer()开始计时，到b.StopTimer()结束计时

## 实际上
计时器从一开始就在计时，调用stop暂停，调用start继续
于是我就测出了单次插入花费10s，人都傻了_(¦3」∠)_

## 正确的代码
```go
func BenchmarkSkipListSet(b *testing.B) {
	b.StopTimer()//计时器暂停
	sl := NewDefaultSkipList()
	cnt := 1000000
	for i := 0; i < cnt; i++ {
		sl.Set([]byte(utils.RandomAlphaString(10)), 1)
	}
	b.StartTimer()//开启计时器
	for i := 0; i < b.N; i++ {
		sl.Set([]byte(utils.RandomAlphaString(10)), 1)
	}
}
```