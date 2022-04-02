---
title: C++运算符重载
date: 2018-02-22
tags:
 - 

categories:
 - C++语法

---

<p>        刚刚逛了半天京东。。。干脆以购物车为例。</p><p>        现在我们有一个类叫做购物车(shopping cart简称SC)。想不出什么功能，就简单点：就一个输出总费用</p><p>的功能，大概这样。然后我现在车里有个iPad Air 2。</p><pre class="cpp">#include&lt;iostream&gt;
using namespace std;

class SC
{
	int price;
public:
	SC(int p=0)
	{
		price = p;
	}
	~SC(){}
	void show()
	{
		cout&lt;&lt;price&lt;&lt;endl;
	}
};

int main()
{
	SC iPadAir2(2458);	 
}</pre><br /><p>        现在我要往车里加东西，在类里面添加一个求和的功能。</p><pre class="cpp">	int add(SC a)
	{
		price += a.price;
		return price;
	}</pre><br /><p>        为了使用的时候少打add跟括号，现在重载+运算符，把add改成operator+即可。<br /></p><pre class="cpp">	int operator+(SC a)
	{
		price += a.price;
		return price;
	}</pre><p>        现在可以直接使用SC1 + SC2了。</p><p></p><p>        在这里，operator+函数是类的成员函数。</p><p>        下面，假设我觉得一台ipad不够用，我要给家人一人买一台，需要加一个乘法功能。</p><pre class="cpp">	int operator*(int n)
	{
		return price*n;
	}</pre><p>        现在，cout&lt;&lt;iPadAir2*3;是没有问题的，但输出3*iPadAir2会报错。原因是:operator*是类的成员函数，重载后</p><p>左操作数必须是调用对象，但常理上iPadAir2*3与3*iPadAir2应该是等价的，用友元函数就可以很好地解决这个问题。</p><pre class="cpp">	friend int operator*(int n,SC &amp;a)
	{
		a = a*n;
		return a.price;
	}</pre><br /><p>        类的友元函数是非成员函数，但其访问权限与成员函数相同。</p><p>        友元常用于重载&lt;&lt;运算符，便于用cout对类进行输出。若不使用友元，而使用成员函数重载&lt;&lt;替代show函数，</p><p>函数代码如下：</p><pre class="cpp">	void operator&lt;&lt;(ostream &amp;c)
	{
		cout&lt;&lt;price&lt;&lt;endl;
	}</pre><p>        这样的缺陷是，因为调用对象必须为左操作数，故使用时必须写作iPadAir2&lt;&lt;cout; 十分怪异。</p><p>        利用友元反转操作数顺序即可达到预期效果：<br /></p><pre class="cpp">	friend void operator&lt;&lt;(ostream &amp;c,SC a)
	{
		cout&lt;&lt;a.price&lt;&lt;endl;
	}</pre><p>        现在还存在的一个问题是，无法像输出基本类型时那样一次输出多个数，即不能cout&lt;&lt;iPadAir2&lt;&lt;iPadAir2;</p><p>        现在看一下&lt;&lt;运算符的定义: 其左边必须是一个ostream对象，如cout&lt;&lt;1;显然满足这一点。我们都知道，<br /></p><p>        cout&lt;&lt;1&lt;&lt;2;是可行的，这意味着2前面的&lt;&lt;运算符左边的cout&lt;&lt;1是一个ostream对象，于是乎只要将</p><p>operator&lt;&lt;()函数的返回类型改为对ostream对象的引用即可。</p><pre class="cpp">	friend ostream&amp; operator&lt;&lt;(ostream &amp;c,SC a)
	{
		cout&lt;&lt;a.price&lt;&lt;endl;
	}</pre>        睡了睡了，明天再看。<br /><p><br /></p><p>        <br /></p><p>        <br /></p><br /><p>                                     </p>
