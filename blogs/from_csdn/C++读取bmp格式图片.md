---
title: C++读取bmp格式图片
date: 2019-09-06
tags:
 - 

categories:
 - 数字图像处理

---

类的格式按照bmp的文件头、信息头、调色板和数据域写好即可
因为图片是按字节读的，所以要强制让编译器不对结构体进行字节对齐，否则会出错
因为bmp格式规定存储时每行的像素数要补齐至4的整数倍，所以读入和写出时要加一些对应的操作
——————————————————————————————————————————————
2019.9.6更新
增加了边缘检测、均值滤波和中值滤波
详情见注释
```c
#include <bits/stdc++.h>

#pragma GCC optimize(3)
using namespace std;

typedef unsigned short w;
typedef unsigned int dw;

class bmp
{
#pragma pack(1)//取消编译器的字节对齐
    struct FileHead
    {
        w type;
        dw size;
        w reserved1, reserved2;
        dw offset;
    } fileHead{};

#pragma pack(1)
    struct InfoHead
    {
        dw size, width, height;
        w planes; //图像的位面数
        w bitNum; //每个像素的位数
        dw compression; //压缩类型
        dw imgSize; //单位为字节
        dw xPelsPerMeter, yPelsPerMeter;
        dw colorNum; //使用的色彩数
        dw colorImportantNum; //重要的颜色数
    } infoHead{};

#pragma pack(1)
    struct Palette
    {
        w b, g, r, reversed;
    } palette{};
    struct Sum;
#pragma pack(1)

    struct Pixel
    {
        unsigned char b, g, r;//24位位图按照BGR的顺序存放， 32位BGRA
//        friend ostream &operator<<(ostream &out, const Pixel a)
//        {
//            return out << '[' << (unsigned) a.b << ' ' << (unsigned) a.g << ' ' << (unsigned) a.r << ']';
//        }
        Pixel(unsigned char b = 0, unsigned char g = 0, unsigned char r = 0) : b(b), g(g), r(r)
        {}

        Pixel &operator=(const Sum &a)
        {
            b = (unsigned char) a.b;
            g = (unsigned char) a.g;
            r = (unsigned char) a.r;
        }

        bool operator<(const Pixel &a) const
        {
            if (b == a.b)
            {
                if (g == a.g)
                    return r < a.r;
                return g < a.g;
            }
            return b < a.b;
        }
    };

    struct Sum  //用来维护二维前缀和的结构体
    {           // 因为pixel的rgb都是1字节，求和会溢出，所以另开一个
        int b, g, r;

        Sum(int b = 0, int g = 0, int r = 0) : b(b), g(g), r(r)
        {}

        template<typename T>
        //既可以+=Sum， 也可以+=Pixel
        Sum &operator+=(const T &a)
        {
            b += a.b;
            g += a.g;
            r += a.r;
            return *this;
        }

        Sum operator+(const Sum &a)
        {
            return {b + a.b, g + a.g, r + a.r};
        }

        Sum operator-(const Sum &a)
        {
            return {b - a.b, g - a.g, r - a.r};
        }

        template<typename T>
        Sum &operator-=(const T &a)
        {
            b -= a.b;
            g -= a.g;
            r -= a.r;
            return *this;
        }

        Sum &operator/=(const int k)
        {
            b /= k;
            g /= k;
            r /= k;
        }
    };

    inline int pos(int i, int j)
    {
        return i * realWidth + j;
    }

    ifstream in;
    ofstream out;
    int realWidth{};
public:
    bmp() = default;

    ~bmp()
    {
        delete[] img;
    }

    unsigned int n{};
    Pixel *img = nullptr;

    bool open(const string &file)
    {
        in.open(file, ios::in | ios::binary);
        if (!in)
            return 0 & puts("无法打开文件");
        return true;
    }

    void read()
    {
        if (!in)
        {
            puts("未打开文件");
            return;
        }
        in.read((char *) &fileHead, sizeof(fileHead));
        in.read((char *) &infoHead, sizeof(infoHead));
        realWidth = ((infoHead.width - 1) / 4) * 4 + 4;
        n = infoHead.height * realWidth;
        img = new Pixel[infoHead.height * realWidth];
        in.read((char *) img, sizeof(Pixel) * n);
        in.close();
    }

    Pixel &operator[](int id)
    {
        return img[id];
    }

    const InfoHead &getInfoHead() const
    {
        return infoHead;
    }

    const FileHead &getFileHead() const
    {
        return fileHead;
    }

    void write(const string &file)
    {
        out.open(file, ios::out | ios::binary);
        out.write((char *) &fileHead, sizeof(fileHead));
        out.write((char *) &infoHead, sizeof(infoHead));
        out.write((char *) img, sizeof(Pixel) * n);
        out.close();
    }

    void toGrayImg()
    {
        unsigned char val;
        for (int i = 0; i < n; ++i)
        {
            val = 0.587 * img[i].g + 0.299 * img[i].r + 0.114 * img[i].b;
            img[i] = Pixel(val, val, val);//rgb都设为一样就是灰度图了
        }
    }

    void meanFiltering(int k)//k是半径, 如k取2, 求均值的范围为3 * 3
    {
        --k;
        //均值滤波， 对每个大小为(2 * k + 1) * (2 * k + 1)的子矩阵求和再平均，把中心的值改为均值。
        Sum *dp = new Sum[realWidth * infoHead.height];//这里用了二维前缀和来加速
#define summ(x1, y1, x2, y2) (dp[pos(x2, y2)]+(x1 && y1 ? dp[pos(x1-1, y1-1)] : 0)-(x1 ? dp[pos(x1-1, y2)] : 0)-(y1 ? dp[pos(x2, y1-1)] : 0))
        for (int i = 0; i < infoHead.height; ++i)//预处理二维前缀和
        {
            for (int j = 0; j < infoHead.width; ++j)
            {
                dp[pos(i, j)] += img[pos(i, j)];
                if (i)
                    dp[pos(i, j)] += dp[pos(i - 1, j)];
                if (j)
                    dp[pos(i, j)] += dp[pos(i, j - 1)];
                if (i && j)
                    dp[pos(i, j)] -= dp[pos(i - 1, j - 1)];
            }
        }
        Sum val;
        for (int i = 0; i < infoHead.height; ++i)
        {
            for (int j = 0; j < infoHead.width; ++j)
            {
                if (i < k || j < k || i + k > infoHead.height - 1 || j + k > infoHead.width - 1) continue;
                val = summ(i - k, j - k, i + k, j + k);
                val /= (k * 2 + 1) * (k * 2 + 1);
                img[pos(i, j)] = Pixel((unsigned char) val.b, (unsigned char) val.g, (unsigned char) val.r);
            }
        }
        delete[] dp;
    }

    Pixel getMedian(int x, int y, int k)
    {
        vector<Pixel> a;
        a.clear();
        for (int i = x - k; i <= x + k; ++i)
            for (int j = y - k; j <= y + k; ++j)
                a.push_back(img[pos(i, j)]);
//        nth_element(a.begin(), a.begin() + ((2 * k + 1) * (2 * k + 1)) / 2, a.end());
        sort(a.begin(), a.end());
        return a[((2 * k + 1) * (2 * k + 1)) / 2];
    }

    void solve()//增加噪声，用于检验中值滤波和均值滤波
    {
        for (int i = 0; i < infoHead.height; ++i)
        {
            for (int j = 0; j < infoHead.width; ++j)
            {
                if (rand() < 1000)
                    img[pos(i, j)] = Pixel(255, 255, 255);
            }
        }
    }

    void medianFiltering(int k)//k是半径
    {//中值滤波，用子矩阵的中位数替换中心的值
        Pixel *IMG = new Pixel[infoHead.height * ((infoHead.width - 1) / 4 * 4 + 4)];
        --k;
        for (int i = k; i + k < infoHead.height; ++i)
        {
            for (int j = k; j + k < infoHead.width; ++j)
            {
                IMG[pos(i, j)] = getMedian(i, j, k);
            }
        }
        for (int i = k; i + k < infoHead.height; ++i)
        {
            for (int j = k; j + k < infoHead.width; ++j)
            {
                img[pos(i, j)] = IMG[pos(i, j)];
            }
        }
        delete[]IMG;
    }

    void toEdge()//边缘检测
    {//采用梯度下降法，对x方向和y方向分别求差分，每个像素处保存一个向量(x, y)， 向量的模小于阈值的像素涂黑，其余涂白
        int *difR = new int[realWidth * infoHead.height], *difC = new int[realWidth * infoHead.height];
        for (int i = 1; i < infoHead.height; ++i)
        {
            for (int j = 0; j < infoHead.width; ++j)
            {
                difR[pos(i, j)] = img[pos(i, j)].b - img[pos(i - 1, j)].b;
            }
        }

        for (int i = 0; i < infoHead.height; ++i)
        {
            for (int j = 1; j < infoHead.width; ++j)
            {
                difC[pos(i, j)] = img[pos(i, j)].b - img[pos(i, j - 1)].b;
            }
        }

        for (int i = 0; i < n; ++i)
        {
            if (sqrt(difR[i] * difR[i] + difC[i] * difC[i]) < 6)
                img[i] = Pixel(255, 255, 255);
            else
                img[i] = Pixel(0, 0, 0);
        }
        delete[] difC;
        delete[] difR;
    }
};


int main()
{
    bmp pic;
    pic.open("test.bmp");
    pic.read();
//    printf("%u %u\n", pic.getInfoHead().imgSize, pic.getInfoHead().width);
//    pic.toGrayImg();
//    pic.solve();
//    pic.write("g01.bmp");
    pic.toEdge();

//    pic.meanFiltering(2);
    pic.medianFiltering(2);
    pic.write("test.bmp");
    return 0;
}
```
原图
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190906233954832.bmp?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0FwYWxlXzg=,size_16,color_FFFFFF,t_70)
直接边缘检测的效果
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190906234034669.bmp?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0FwYWxlXzg=,size_16,color_FFFFFF,t_70)
中值滤波后的效果
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190907005648898.bmp?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0FwYWxlXzg=,size_16,color_FFFFFF,t_70)

