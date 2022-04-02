---
title: Qt5 QImage像素操作
date: 2019-10-05
tags:
 - 

categories:
 - 数字图像处理,Qt

---

这学期学数图，作业需要做界面，于是开始学习Qt。
# QRgb
Qt中，QRgb是unsigned int的别名
Qt中用一个unsigned int存储像素值，格式为0xFFRRGGBB
可以使用$qRgb(int r, int g, int b)$函数来方便地构造像素值

```c
	qDebug() << hex <<qRgb(0, 0, 0) << '\n';
```
输出为0xff000000
# QImage
QImage类有三种修改像素值的方法
## 0、setPixel()
函数声明：void setPixel(int i, int j, qRgb rgb)
直接填入行列像素值即可
但用此函数修改大量像素值的效率必然是极低的
## 1、scanLine()
函数声明： unsigned char *scanLine(int i)
i为行号，从0开始
返回值为第i行第一个字节的地址
实际使用时可以把返回值强制类型转换为$qRgb*$，通过qRgb函数进行赋值
## 2、bits()
直接返回图像第一个字节的地址
用法与scanLine类似
一开始考虑到字节对齐，我是这样写的

```c
	QImage img(fileName);
	int r = 30, ox = 50, oy = 50;
	QRgb *pixs = (QRgb*)img.bits();
	int W = (img.width() + 3) / 4 * 4;
	pixs[i * W + j] = qRgb(0, 0, 0);
```
但输出的图像上的像素位置不对，把W改为img.width()后位置正确
我的猜测:QImage中的像素是按行存储的，并没有存储字节对齐的部分。

