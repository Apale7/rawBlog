---
title: 用VSCode写LaTeX
date: 2019-11-27
tags:
 - 

categories:
 - 杂

---

### 1、安装vscode
略
### 2、下载vscode中文插件
左侧最下面商店按钮中搜索chinese，install
重启vscode后界面变为中文
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191127203716459.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0FwYWxlXzg=,size_16,color_FFFFFF,t_70)
### 3、安装LaTeX Workshop和LaTeX language support插件
商店搜索LaTeX，第一个和第二个
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191127203700526.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0FwYWxlXzg=,size_16,color_FFFFFF,t_70)
装完重启vscode
### 4、解压texlive.iso, 双击install-tl-advanced.bat安装
[texlive.iso下载链接](https://mirrors.tuna.tsinghua.edu.cn/CTAN/systems/texlive/Images/)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191127203746789.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0FwYWxlXzg=,size_16,color_FFFFFF,t_70)
大约40min后安装结束
安装路径为X，将X/bin/win32加入环境变量
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191127203849941.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0FwYWxlXzg=,size_16,color_FFFFFF,t_70)
### 5、使用
新建一个文件夹，新建文件，保存为xxx.tex
编写后按右上角的预览图标预览
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191127203924135.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0FwYWxlXzg=,size_16,color_FFFFFF,t_70)
测试代码

```
\documentclass{article}
\begin{document}
hello,world
\end{document}
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191127203936937.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0FwYWxlXzg=,size_16,color_FFFFFF,t_70)



