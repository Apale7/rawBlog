---
title: vscode go关闭超链接跳转
date: 2021-02-21
tags:
 - 

categories:
 - Go

---

## 问题：
希望在go代码中ctrl左键import的package查看定义，但却跳转到了浏览器的https://pkg.go.dev/xxxx/xxxx中
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210221194043668.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0FwYWxlXzg=,size_16,color_FFFFFF,t_70)

## 原因：
- vscode会默认识别超链接，然后在ctrl左键点击超链接时进行跳转
- go的package就是以超链接的形式引入的
## 解决方法
- 禁用vscode识别超链接的功能

```json
	"editor.links": false,
```


