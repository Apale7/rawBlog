---
title: Gin框架踩坑[参数错误时http状态码始终返回400]
date: 2021-01-20
tags:
 - 

categories:
 - Go

---

问题背景:
希望在post参数错误时返回自定义的提示信息，但http状态码始终返回400
```go
if err := c.BindJSON(&xxx); err != nil {
	fmt.Println("解析参数失败, err: %+v", err)
	c.JSON(http.StatusOK, "参数错误")
	return
}
```
原因: MustBindWith在参数错误时返回400

```go
// BindJSON is a shortcut for c.MustBindWith(obj, binding.JSON).
func (c *Context) BindJSON(obj interface{}) error {
    return c.MustBindWith(obj, binding.JSON)
}

// MustBindWith binds the passed struct pointer using the specified binding engine.
// It will abort the request with HTTP 400 if any error occurs.
// See the binding package.
func (c *Context) MustBindWith(obj interface{}, b binding.Binding) error {
    if err := c.ShouldBindWith(obj, b); err != nil {
        c.AbortWithError(http.StatusBadRequest, err).SetType(ErrorTypeBind) // nolint: errcheck
        return err
    }
    return nil
}
```
解决方法 : 绑定结构体时使用ShouldBind系列

