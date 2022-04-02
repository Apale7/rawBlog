---
title: 正则表达式-＞NFA-＞DFA(C++实现)
date: 2020-10-01
tags:
 - 正则表达式
 - c++
 - 编译器

categories:
 - 编译原理

---

这学期在学编译原理，上周刚学完词法分析，作业是手动构造DFA并完成词法分析。然而优秀的人当然要以高标准要求自己，于是花了两天实现了输入正则表达式构造NFA和NFA转DFA的算法。

算法包括以下几个步骤：
+ 正则表达式->后缀表达式
+ 用后缀表达式构造NFA
+ 用NFA构造DFA
+ 最小化DFA(暂未完成)
# 正则表达式->后缀表达式
## 正则表达式的定义
算法中实现的正则表达式仅包含$()|*$运算符。为了方便实现，显式地增加了连接运算符^， 如abc*d会被修改为a ^ b ^ c * ^d。$字符在式子中的含义是空串。
预处理部分的代码:

```c
char Lex::statusCode(char a)//非运算符返回本身，其他返回'a'
{//inputSet是不包含运算符的字符集
    if (inputSet.find(a) != inputSet.end())
        return 'a';
    return a;
}

void Lex::preprocess()
{//charSet是字符集，包含运算符
    assert(reg.size());
    int l = 0;
    for (const auto &item : reg)
    {
        assert(charSet.find(item) != charSet.end());//判断是否所有字符都合法
        if (item == '(') ++l;
        else if (item == ')') --l;
        assert(l >= 0);//判断括号是否匹配
    }
    assert(l == 0);//判断括号是否匹配
    //对于每两个相邻的字符，statusCode分别为a( aa )a *a *( )(时
    //需要在中间加上^
    for (int i = 0; i < reg.size() - 1; ++i)
    {
        int a = statusCode(reg[i]), b = statusCode(reg[i + 1]);
        if (a == 'a' && b == '(' || a == 'a' && b == 'a' || a == ')' && b == 'a' || a == '*' && b == 'a' ||
            a == '*' && b == '(' || a == ')' && b == '(')
            reg.insert(i + 1, "^");
    }
    std::cout << reg << '\n';
    reg = toSuffix(reg);//转换为后缀表达式
    std::cout << reg << '\n';
}

```

### 运算符优先级
从大到小: * ^ | (，右括号特殊处理(转后缀表达式时右括号不入栈，不需要优先级)
确定优先级后即可将中缀形式的正则表达式转换为后缀形式。
(a | b) * ^ a ^ b ^ b 将被转换为
a b | * a ^ b ^ b ^
```c
bool isOperator(char c)
{//判断是不是运算符
    switch (c)
    {
        case '*':
        case '|':
        case '^':
            return true;
        default:
            return false;
    }
}


int getPriority(int c)
{//运算符的优先级
    int level = 0; // 优先级
    switch (c)
    {
        case '(':
            level = 1;
            break;
        case '|':
            level = 2;
            break;
        case '^':
            level = 3;
            break;
        case '*':
            level = 4;
            break;
        default:
            break;
    }
    return level;
}

string toSuffix(const string &expr)
{
    stack<char> op;
    string suffix;
    for (const auto &c: expr)
    {
        if (isOperator(c))
        {//是运算符
            if (op.empty())//栈空，直接入栈
                op.emplace(c);
            else
            {//优先级更大的运算符全部出栈
                while (!op.empty())
                {
                    int t = op.top();
                    if (getPriority(c) <= getPriority(t))
                    {
                        op.pop();
                        suffix.push_back(t);
                    }
                    else
                        break;
                }
                op.emplace(c);
            }
        }
        else
        {
            if (c == '(')//左括号直接入栈
                op.emplace(c);
            else if (c == ')')
            {//遇到右括号，一直出栈，直到遇到左括号
                while (op.top() != '(')
                {
                    suffix.push_back(op.top());
                    op.pop();
                }
                op.pop();
            }
            else
            	suffix.push_back(c);//操作数直接放入表达式中
        }
    }
    while (!op.empty())
    {//取出剩余的运算符
        suffix.push_back(op.top());
        op.pop();
    }
    return suffix;
}
```
# 后缀表达式构造NFA
## 定义NFA类
数据成员: 开始状态、结束状态和图
+ 参考龙书上的算法，这里构造出的NFA只会有一个开始状态和一个结束状态
+ start和end其实没啥用(但还是写在这里了)，因为该算法构造出的NFA的开始状态一定是0，结束状态一定是最后一个状态
+ 图中包含了NFA五元组中的**状态集合**和**转换函数**
+ 图用vector<unordered_map<char, vector<int>>>存储
+ 字符集存储在之前提到的inputSet中

```c
struct NFA
    {
        vector<unordered_map<char, vector<int>>> G;
        int start, end;

        NFA()
        {
            G.resize(1);
            start = end = 0;
        }

        size_t size() const
        {
            return G.size();
        }

        unordered_map<char, vector<int>> &operator[](int n)
        {
            assert(n < G.size());
            return G[n];
        }

        NFA &operator+=(NFA b)
        {//合并两个图
            int offset = size();
            for (int i = 0; i < b.size(); ++i)
            {
                G.push_back(b[i]);
                for (auto &k: G.back())
                    for (auto &v: k.second)
                        v += offset;
            }
            return *this;
        }
    };
```
需要注意的是operator+=。因为算法中需要连接两个图，所以重载operato+=来完成合并。因为两个图的节点编号都是从0开始的，所以b连接到a后面时，b中所有边指向的节点编号都要加上一个offset(a的size)
## 构造NFA
(以下图片截自龙书第二版)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201001175823965.png#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201001175834620.png#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201001175847162.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0FwYWxlXzg=,size_16,color_FFFFFF,t_70#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201001175854831.png#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201001175901855.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0FwYWxlXzg=,size_16,color_FFFFFF,t_70#pic_center)
按照上面的五张图的方式建图，即可完成NFA的构造
//代码中$是空串
```c
void Lex::buildNFA()
{
    stack<NFA> stk;
    for (auto &c: reg)
    {
        if (!isOperator(c))//前两张图片
        {
            NFA a;
            a.G.resize(2);
            a.end = 1;
            a[0][c] = {a.end};
            stk.emplace(a);//每次新产生的子NFA都放入栈中
        }
        else
        {//后三张图片
            switch (c)
            {
                case '|':
                {
                    NFA tmp;
                    NFA b = stk.top();
                    stk.pop();
                    NFA a = stk.top();
                    stk.pop();
                    size_t size1 = tmp.size();
                    tmp += a;
                    tmp[tmp.start]['$'].emplace_back(a.start + size1);

                    size_t size2 = tmp.size();
                    tmp += b;
                    tmp[tmp.start]['$'].emplace_back(b.start + size2);
                    tmp[a.end + size1]['$'] = {int(tmp.size())};
                    tmp[b.end + size2]['$'] = {int(tmp.size())};
                    tmp.end = tmp.size();
                    tmp.G.emplace_back(unordered_map<char, vector<int>>());
                    stk.emplace(tmp);//每次新产生的子NFA都放入栈中
                    break;
                }
                case '*':
                {
                    NFA tmp;
                    NFA a = stk.top();
                    stk.pop();
                    size_t size1 = tmp.size();
                    tmp += a;
                    tmp[tmp.start]['$'].emplace_back(a.start + size1);
                    tmp[a.end + size1]['$'].emplace_back(a.start + size1);
                    size_t s = tmp.size();
                    tmp[a.end + size1]['$'].emplace_back(s);
                    tmp.end = s;
                    tmp.G.emplace_back(unordered_map<char, vector<int>>());
                    tmp[tmp.start]['$'].emplace_back(s);
                    stk.emplace(tmp);//每次新产生的子NFA都放入栈中
                    break;
                }
                case '^':
                {
                    NFA b = stk.top();
                    stk.pop();
                    NFA a = stk.top();
                    stk.pop();
                    a.G.pop_back();
                    size_t s = a.size();
                    a += b;
                    a.end = b.end + s;
                    stk.emplace(a);//每次新产生的子NFA都放入栈中
                    break;
                }
                default:
                    assert(0);
            }
        }
    }
    nfa = stk.top();
}
```
# 用NFA构造DFA
## DFA类的定义

```c
struct DFA
{
    map<int, map<char, int>> G;//图
    unordered_set<int> end;//结束状态集合
    bool match(const string &s,char (*type)(char c))
    {
        int now = 0;
        for (auto &i: s)
        {
            char c = type(i);
            if (G[now].count(c))
                now = G[now][c];
            else
                return false;
        }
        return end.count(now);
    }
};
struct DStat
{
    set<int> stats;
    int id;

    bool operator<(const DStat &d) const
    {
        return stats < d.stats;
    }

    bool operator==(const DStat &d) const
    {
        return stats == d.stats;
    }
};
```

## 子集构造法
定义: 
$move(T, a)$: NFA中，一个状态集合T中通过一个字符a可以转移到的状态集合为
$\epsilon-closure(s)$: 由状态s通过任意数量空边能转移到的状态集合
$\epsilon-closure(T)$: 一个状态集合T中的所有状态通过任意数量的空边能转移到的状态集合为
对于NFA中的一个状态集合T，它经过一个字符a能转移到的状态集合即为
$$\epsilon-closure(move(T, a))$$
而初始状态下，NFA可以位于$\epsilon-closure(start)$的所有状态
下面是龙书中的伪代码和对应的我的实现:
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201001181139124.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0FwYWxlXzg=,size_16,color_FFFFFF,t_70#pic_center)

```c
void Lex::buildDFA()
{
    vector<DStat> Dstats;
    Dstats.emplace_back(e_closure(nfa.start));
    set<DStat> vis;
    vis.insert(Dstats[0]);
    for (int i = 0; i < Dstats.size(); ++i)
    {
        for (auto c: inputSet)
        {
            if (c == '$')
                continue;
            auto U = e_closure(move(Dstats[i], c));
            if (U.stats.empty())
                continue;
            if (vis.find(U) == vis.end())
            {
                Dstats.emplace_back(U);
                if (U.stats.find(nfa.end) != U.stats.end())
                    dfa.end.insert(std::find(Dstats.begin(), Dstats.end(), U) - Dstats.begin());//U在DStat中的下标
                vis.insert(U);
            }
            dfa.G[i][c] = std::find(Dstats.begin(), Dstats.end(), U) - Dstats.begin();//U在DStat中的下标
        }
    }
    for (int i = 0; i < Dstats.size(); ++i)
    {
        std::cout << i << ": {";
        for (auto &j:Dstats[i].stats)
            std::cout << j << ' ';
        std::cout << "}\n";
    }
    for (auto &i: dfa.G)
        for (auto &j: i.second)
        {
            std::cout << i.first << ' ' << j.first << ' ' << j.second << '\n';
        }
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/2020100118114910.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0FwYWxlXzg=,size_16,color_FFFFFF,t_70#pic_center)

```c
Lex::DStat Lex::e_closure(int s)
{
    DStat stat;
    stat.stats.insert(s);
    stack<int> stk;
    stk.emplace(s);
    stat.stats.insert(s);
    while (!stk.empty())
    {
        int i = stk.top();
        stk.pop();
        for (auto &v: nfa[i]['$'])
        {
            if (stat.stats.find(v) != stat.stats.end()) continue;
            stk.emplace(v);
            stat.stats.insert(v);
        }
    }
    return stat;
}

Lex::DStat Lex::e_closure(Lex::DStat T)
{//这里实现和伪代码不太一样，我直接对多个e_closure(s)取并了
    DStat stat;
    for (auto &i: T.stats)
    {
        auto tmp = e_closure(i);
        for (auto &v: tmp.stats)
            stat.stats.insert(v);
    }
    return stat;
}

Lex::DStat Lex::move(const Lex::DStat &T, char a)
{
    DStat stat;
    for (auto &i: T.stats)
        if (nfa[i].find(a) != nfa[i].end())
            for (auto &v: nfa[i][a])
            {
                if (stat.stats.find(v) == stat.stats.end())
                {
                    stat.stats.insert(v);
                }
            }
    return stat;
}
```
至此就完成了DFA的构造

为了检验代码的正确性，我用如下正则表达式构造了识别数字的DFA，并通过了leetcode65 有效数字

  + ($|+|-)aa*($|.a*)($|e($|+|-)aa*)|($|+|-)a*(a|.aa*)($|e($|+|-)aa*)
   ![在这里插入图片描述](https://img-blog.csdnimg.cn/2020100118242139.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0FwYWxlXzg=,size_16,color_FFFFFF,t_70#pic_center)
   从内存消耗没有击败100%这一点也能看出算法还有进一步优化的空间(DFA的最小化)
   
**博客中仅为部分代码。详细代码见[github](https://github.com/Apale7/CompilersPrinciple)中的Lex和utils**
# 最小化DFA
(下次一定写

