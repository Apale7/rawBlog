---
title: golang使用高阶函数优雅地实现dal
date: 2022-02-02
tags:
 - golang
categories:
 - golang
---

有一个machine表，现在需要按照名称、用户、供应商、区域这些参数来查询一批machine
```go
package dal

import "gorm.io/gorm"

type Machine struct {
	Name     string
	UserID   uint
	Provider string
	Region   string
}

var db *gorm.DB
```
## 1.每个参数硬写
```go
func GetMachinesByUserID(userID uint) ([]Machine, error) {
	var machines []Machine
	err := db.Where("user_id = ?", userID).Find(&machines).Error
	return machines, err
}

func GetMachinesByName(name string) ([]Machine, error) {
	var machines []Machine
	err := db.Where("name = ?", name).Find(&machines).Error
	return machines, err
}

func GetMachinesByProvider(provider string) ([]Machine, error) {
	var machines []Machine
	err := db.Where("provider = ?", provider).Find(&machines).Error
	return machines, err
}

func GetMachinesByRegion(region string) ([]Machine, error) {
	var machines []Machine
	err := db.Where("region = ?", region).Find(&machines).Error
	return machines, err
}
......
```
缺点：大量的重复逻辑，函数的数量爆炸
## 2. 所有参数都传
```go
func GetMachines(userID uint, name string, provider string, region string) ([]Machine, error) {
	var machines []Machine
	if userID != 0 {
		db = db.Where("user_id = ?", userID)
	}
	if name != "" {
		db = db.Where("name = ?", name)
	}
	if provider != "" {
		db = db.Where("provider = ?", provider)
	}
	if region != "" {
		db = db.Where("region = ?", region)
	}
	err := db.Find(&machines).Error
	return machines, err
}
```
- 优点
    - 解决了函数数量爆炸的问题
- 缺点
    - 增加参数时需要修改函数声明
    - 参数较多时可读性极差，相邻的类型相同的参数很容易填错
## 3. 用一个struct来传参
```go
type MachineQuery struct {
	UserID   uint
	Name     string
	Provider string
	Region   string
}

func GetMachinesByQuery(query MachineQuery) ([]Machine, error) {
	var machines []Machine
	if query.UserID != 0 {
		db = db.Where("user_id = ?", query.UserID)
	}
	if query.Name != "" {
		db = db.Where("name = ?", query.Name)
	}
	if query.Provider != "" {
		db = db.Where("provider = ?", query.Provider)
	}
	if query.Region != "" {
		db = db.Where("region = ?", query.Region)
	}
	err := db.Find(&machines).Error
	return machines, err
}
```
- 优点
    - 增加参数不会影响函数声明
    - 入参是对象，不那么容易填错
- 缺点
    - 只能处理等值查询，其他查询条件实现起来仍比较繁琐
## 4. 用高阶函数来传参
```go
type Option func(*gorm.DB) *gorm.DB

func Name(name string) Option {
	return func(db *gorm.DB) *gorm.DB {
		return db.Where("name = ?", name)
	}
}

func NameNotEqual(name string) Option {
	return func(db *gorm.DB) *gorm.DB {
		return db.Where("name != ?", name)
	}
}

func UserID(userID uint) Option {
	return func(db *gorm.DB) *gorm.DB {
		return db.Where("user_id = ?", userID)
	}
}

func Provider(provider string) Option {
	return func(db *gorm.DB) *gorm.DB {
		return db.Where("provider = ?", provider)
	}
}

func Region(region string) Option {
	return func(db *gorm.DB) *gorm.DB {
		return db.Where("region = ?", region)
	}
}

func GetMachinesByQueryFunc(queryFuncs ...Option) ([]Machine, error) {
	var machines []Machine
	db := db
	for _, queryFunc := range queryFuncs {
		db = queryFunc(db)
	}
	err := db.Find(&machines).Error
	return machines, err
}
// 调用处
func xxx() {
    machines, err := GetMachinesByQueryFunc(UserID(1), Name("asd"), Provider("qwe"), Region("zxc"))
}
```
- 增加查询条件只需要增加一个Option函数

此外，诸如Name、NameNotEqual这类函数，完全可以用工具自动生成，无需手动实现