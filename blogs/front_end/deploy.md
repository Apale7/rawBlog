---
title: js静态资源托管(gzip)
date: 2022-02-02
tags:
 - 前端
 - js
categories:
 - 前端
---

## 部署脚本
app.js
```javascript
const express = require('express');
//创建web服务器
const app = express();
//导入gzip包
const compression = require("compression")
//文件操作
const fs = require('fs');
const path = require('path');
const chalk = require('chalk')

//启用gzip中间件,在托管之前
app.use(compression())
//托管静态资源
app.use(express.static(path.resolve(__dirname, './dist')))

app.get('/', function(req, res) {
    const html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8')
    res.send(html)
})

app.get('/home', function(req, res) {
    const html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8')
    res.send(html)
})
//启动web服务器
app.listen(4397, res => {
    console.log(chalk.yellow('Start Service On 4397'));
});
```

package.json
```jsonc
{
  "name": "项目名称",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "chalk": "^4.1.0",
    "compression": "^1.7.4",
    "express": "^4.17.1"
  }
}
```

```bash
    npm i
    node app.js
```