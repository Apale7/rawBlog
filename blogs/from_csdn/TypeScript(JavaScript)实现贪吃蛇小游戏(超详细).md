---
title: TypeScript(JavaScript)实现贪吃蛇小游戏(超详细)
date: 2020-01-07
tags:
 - 

categories:
 - 杂

---

## 总体思路
<strong>HTML中用一个canvas显示游戏画面和一个p标签显示当前分数
通过JavaScript修改canvas
<strong>

#### HTML部分
非常简约的界面。
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>python</title>
    <link href="python.css" type="text/css" rel="stylesheet">
</head>
<body>
<div id="mpContainer">
    <canvas id="map" width="480" height="480"></canvas>
</div>
<div id="scoreContainer"><strong id="score">score: 0</strong></div>
<script type="text/javascript" src="init.js"></script>
</body>
</html>
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200106232116960.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0FwYWxlXzg=,size_16,color_FFFFFF,t_70)
#### JavaScript部分
我是用TypeScript写的，下面的代码只放TypeScript
##### 地图绘制
使用DOM提供的绘制矩形的函数在canvas上涂色

```js
let c: any = document.getElementById("map");
let cxt: any = c.getContext("2d");
cxt.fillStyle = "rgb(0,0,0)";
cxt.fillRect(x, y, siz, siz);
```
其中x，y是矩形左上角的坐标，矩形大小为siz*siz
为了方便后面的使用， 我自己稍微又封装了一下，后面调用setColor直接修改坐标x, y处的颜色为color

```js
const colorTable: string[] = ["rgb(240,240,240)", "rgb(0,0,0)", 
"rgb(0,255,0)", "rgb(255,0,0)", "rgb(255,255,0)"];

enum Color {
    white,
    black,
    green,
    red,
    yellow
}

function setColor(cxt: any, color: Color, x: number, y: number, siz: number, mp: Color[][]): void {
    cxt.fillStyle = colorTable[color];
    cxt.fillRect(x * siz, y * siz, siz, siz);
    mp[y][x] = color;
}
```
在我的设计中，一个siz(px)*siz(px)的区域为一格，所以x * siz, y * siz
mp是一个二维数组，用于记录地图的信息，因为读取canvas上的像素值不太好写，干脆直接记录下来
为了与网页背景色区分开，white的rgb值略为减小了一点点

#### 初始化地图
mp数组与canvas都进行初始化，蛇一开始的长度为3格，放置于地图正中，方向向右

```js
let c: any = document.getElementById("map");
let cxt: any = c.getContext("2d");
let w = 24;
let h = 24;
let mp: Color[][] = [];
for (let i = 0; i < h; i++) {
    mp.push([]);
    for (let j = 0; j < w; j++) {
        mp[i].push(Color.white);
    }
}
setColor(cxt, Color.white, 0, 0, w * size, mp);
for (let i = 0; i < h; i++) {
    if (i == 0 || i == h - 1)
        for (let j = 0; j < w; j++) {
            setColor(cxt, Color.black, i, j, size, mp);
        }
    else {
        setColor(cxt, Color.black, i, 0, size, mp);
        setColor(cxt, Color.black, i, w - 1, size, mp);
    }
}
setColor(cxt, Color.green, int(w / 2 - 1), int(h / 2), size, mp);
setColor(cxt, Color.green, int(w / 2), int(h / 2), size, mp);
setColor(cxt, Color.green, int(w / 2 + 1), int(h / 2), size, mp);
createFood(w, h, cxt, mp);
```

#### 蛇的控制
蛇每次移动时，地图上只有两个格子可能会变(先不考虑食物)，即头和尾
蛇每次往前走，产生新的蛇头，擦去上一次的蛇尾
**特殊情况1**
蛇头吃到食物，此时不擦去蛇尾
**特殊情况2**
新的蛇头与旧的蛇尾重合
这种情况肯定是不会死的，因为旧的蛇尾会擦除，等价于空地
但处理的时候很可能会会漏掉这一点，需留意

显然用队列维护蛇的信息最为合适：
队尾就是蛇头(每次push进新的蛇头)
队首就是蛇尾(每次pop掉)

仿照STL queue用TypeScript写的队列
队列不细讲了，会用push和pop就行了
```js
class queue<T> {
    buf: Array<T>;
    head: number;
    tail: number;

    constructor() {
        this.buf = new Array<T>();
        for (let i = 0; i < 50; i++) {
            this.buf.push(null);
        }
        this.head = 0;
        this.tail = 0;
    }

    empty(): boolean {
        return this.head == this.tail;
    }

    front(): T {
        if (this.empty())
            return undefined;
        return this.buf[this.head];
    }

    back(): T {
        if (this.empty())
            return undefined;
        return this.buf[(this.tail - 1 + this.buf.length) % this.buf.length];
    }

    push(x: T): void {
        this.buf[this.tail] = x;
        if ((this.tail + 1) % this.buf.length == this.head)
            this.resize();
        this.tail = (this.tail + 1) % this.buf.length;
    }

    pop(): T {
        if (this.empty())
            return null;
        let n = this.head;
        this.head = (this.head + 1) % this.buf.length;
        return this.buf[n];
    }

    resize(): void {
        let oldN = this.buf.length;
        let n = Math.floor(this.buf.length / 2);
        for (let i = 0; i < n; i++) {
            this.buf.push(null);
        }
        for (let i = oldN - 1; i >= this.head; i--) {
            this.buf[i + n] = this.buf[i];
        }
        this.head += n;
    }
}
```
蛇的每一个点只需要横纵坐标信息

```js
class pair<T, Y> {
    x: T;
    y: Y;

    constructor(x: T = null, y: Y = null) {
        this.x = x;
        this.y = y;
    }
}
```
表示方向的枚举类型

```js
enum Dir {
    up,
    down,
    left,
    right
}
```
因为当接收到的命令与蛇当前运动方向完全相反时，什么都不做
到时判断cmdDir^snakeDir是否为0即可

**Snake类的设计**
记录当前运动方向
记录蛇中的每一个点(用上文实现的队列)
地图的宽、高
一个boolean变量记录是否吃到食物

具体函数见注释

```js
class Snake {
    private w: number;
    private h: number;
    private snake: queue<pair<number, number>>;
    private nowDir: Dir;
    private big: boolean;
    static d: pair<number, number>[] = [new pair<number, number>(0, -1), new pair<number, number>(0, 1), new pair<number, number>(-1, 0), new pair<number, number>(1, 0)];

    constructor(w: number, h: number) {
        this.w = w;
        this.h = h;
        this.snake = new queue<pair<number, number>>();
        this.big = false;
        this.nowDir = Dir.right;//默认一开始往右走
        this.snake.push(new pair<number, number>(int(w / 2) - 1, int(h / 2)));//蛇初始的三个点
        this.snake.push(new pair<number, number>(int(w / 2), int(h / 2)));
        this.snake.push(new pair<number, number>(int(w / 2) + 1, int(h / 2)));
    }

    command(dir: Dir): void {//此函数接收控制信息
        if ((dir ^ this.nowDir) == 1)//命令与蛇的方向相反
            dir = this.nowDir;
        let head = this.snake.back();//通过dir和旧的蛇头产生新的蛇头
        this.snake.push(new pair<number, number>(head.x + Snake.d[dir].x, head.y + Snake.d[dir].y));
        this.nowDir = dir;
    }

    setBig(flag: boolean): void {//蛇吃到食物时调用此函数
        this.big = flag;
    }

    getHead(): pair<number, number> {//返回蛇头坐标供绘图
        return this.snake.back();
    }

    getTail(): pair<number, number> {//返回蛇尾坐标供绘图
        if (this.big) {//吃到了食物
            this.big = false;
            return new pair<number, number>(-1, -1);//返回一个不存在的坐标，因为此时不需要擦掉蛇尾
        }
        let t = this.snake.front();
        this.snake.pop();//没吃到食物则pop掉
        return t;
    }
}
```
#### 食物的生成
逻辑很简单，随机xy坐标，判断是不是空地，是则涂红，不是则重新随机
但很坑的地方就是JS本身的Math.Random不支持设置随机种子，每次生成的食物序列都是一样的
于是手写了随机数生成器。

```js
let seed = new Date().getTime();

function rnd(): number {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / (233280.0);
}

function rand(mod: number) {
    return Math.floor(rnd() * mod);
}
```
然后就可以愉快地随机生成食物了

```js
function createFood(w: number, h: number, cxt: any, mp: Color[][]): void {
    let x = rand(w);
    let y = rand(h);
    while (mp[y][x] != Color.white) {
        x = rand(w);
        y = rand(h);
        c = cxt.getImageData(x, y, 1, 1).data;
    }
    setColor(cxt, Color.red, x, y, size, mp);
}
```

#### 蛇的移动
首先需要接收键盘信息
dir是一个全局变量
```js
document.onkeydown = function (event) {
    let e: string = event.key;
    switch (e) {
        case "ArrowLeft":
            dir = Dir.left;
            break;
        case "ArrowRight":
            dir = Dir.right;
            break;
        case "ArrowUp":
            dir = Dir.up;
            break;
        case "ArrowDown":
            dir = Dir.down;
            break;
        default:
    }
    move();//接收信息后马上移动
};
```
然后根据接收到的信息更新蛇的信息并绘图即可

```js
function move(): void {
    snake.command(dir);
    head = snake.getHead();
    tail = snake.getTail();
    if (head.x == tail.x && head.y == tail.y)//新头等于旧尾，直接return
        return;
    if (mp[head.y][head.x] == Color.green || mp[head.y][head.x] == Color.black) {
        alert("Game Over!");//撞墙或自己，游戏结束
        clearInterval(id);
        location.reload();
        return;
    }
    if (mp[head.y][head.x] == Color.red) {
        document.getElementById("score").innerHTML = "score: " + ++score;//更新分数
        createFood(w, h, cxt, mp);
        snake.setBig(true);
    }
    setColor(cxt, Color.green, head.x, head.y, size, mp);//绘制新蛇头
    if (tail.x == -1)//吃到食物则不擦除蛇尾
        return;
    setColor(cxt, Color.white, tail.x, tail.y, size, mp);//擦除旧蛇尾
}
```

move函数需要周期性执行，于是使用setInterval

```js
let id = setInterval(move, 180);//每180ms执行一次move
//记录id，游戏结束时关闭
```
可以注意到因为每次敲击键盘后我都执行了move函数，所以按得很快的时候蛇也会走得很快，而不是匀速运动
如果不这样做，蛇可以匀速运动，但你不能做到快速响应每一次键盘命令。这个问题我还没有想到更好的解决方法。
下面是完整的TS代码：

```js
function int(x: number): number {
    return Math.floor(x);
}

class queue<T> {
    buf: Array<T>;
    head: number;
    tail: number;

    constructor() {
        this.buf = new Array<T>();
        for (let i = 0; i < 50; i++) {
            this.buf.push(null);
        }
        this.head = 0;
        this.tail = 0;
    }

    empty(): boolean {
        return this.head == this.tail;
    }

    front(): T {
        if (this.empty())
            return undefined;
        return this.buf[this.head];
    }

    back(): T {
        if (this.empty())
            return undefined;
        return this.buf[(this.tail - 1 + this.buf.length) % this.buf.length];
    }

    push(x: T): void {
        this.buf[this.tail] = x;
        if ((this.tail + 1) % this.buf.length == this.head)
            this.resize();
        this.tail = (this.tail + 1) % this.buf.length;
    }

    pop(): T {
        if (this.empty())
            return null;
        let n = this.head;
        this.head = (this.head + 1) % this.buf.length;
        return this.buf[n];
    }

    resize(): void {
        let oldN = this.buf.length;
        let n = Math.floor(this.buf.length / 2);
        for (let i = 0; i < n; i++) {
            this.buf.push(null);
        }
        for (let i = oldN - 1; i >= this.head; i--) {
            this.buf[i + n] = this.buf[i];
        }
        this.head += n;
    }
}

class pair<T, Y> {
    x: T;
    y: Y;

    constructor(x: T = null, y: Y = null) {
        this.x = x;
        this.y = y;
    }
}

enum Dir {
    up,
    down,
    left,
    right
}

class Snake {
    private w: number;
    private h: number;
    private snake: queue<pair<number, number>>;
    private nowDir: Dir;
    private big: boolean;
    static d: pair<number, number>[] = [new pair<number, number>(0, -1), new pair<number, number>(0, 1), new pair<number, number>(-1, 0), new pair<number, number>(1, 0)];

    constructor(w: number, h: number) {
        this.w = w;
        this.h = h;
        this.snake = new queue<pair<number, number>>();
        this.big = false;
        this.nowDir = Dir.right;
        this.snake.push(new pair<number, number>(int(w / 2) - 1, int(h / 2)));
        this.snake.push(new pair<number, number>(int(w / 2), int(h / 2)));
        this.snake.push(new pair<number, number>(int(w / 2) + 1, int(h / 2)));
    }

    command(dir: Dir): void {
        if ((dir ^ this.nowDir) == 1)
            dir = this.nowDir;
        let head = this.snake.back();
        this.snake.push(new pair<number, number>(head.x + Snake.d[dir].x, head.y + Snake.d[dir].y));
        this.nowDir = dir;
    }

    setBig(flag: boolean): void {
        this.big = flag;
    }

    getHead(): pair<number, number> {
        return this.snake.back();
    }

    getTail(): pair<number, number> {
        if (this.big) {
            this.big = false;
            return new pair<number, number>(-1, -1);
        }
        let t = this.snake.front();
        this.snake.pop();
        return t;
    }
}

const colorTable: string[] = ["rgb(240,240,240)",
    "rgb(0,0,0)", "rgb(0,255,0)", "rgb(255,0,0)", "rgb(255,255,0)"];

enum Color {
    white,
    black,
    green,
    red,
    yellow
}

const size: number = 20;

function setColor(cxt: any, color: Color, x: number, y: number, siz: number, mp: Color[][]): void {
    cxt.fillStyle = colorTable[color];
    cxt.fillRect(x * siz, y * siz, siz, siz);
    mp[y][x] = color;
}

let seed = new Date().getTime();

function rnd(): number {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / (233280.0);
}

function rand(mod: number) {
    return Math.floor(rnd() * mod);
}

function createFood(w: number, h: number, cxt: any, mp: Color[][]): void {
    let x = rand(w);
    let y = rand(h);
    while (mp[y][x] != Color.white) {
        x = rand(w);
        y = rand(h);
        c = cxt.getImageData(x, y, 1, 1).data;
    }
    setColor(cxt, Color.red, x, y, size, mp);
}

let c: any = document.getElementById("map");
let cxt: any = c.getContext("2d");
let w = 24;
let h = 24;
let mp: Color[][] = [];
for (let i = 0; i < h; i++) {
    mp.push([]);
    for (let j = 0; j < w; j++) {
        mp[i].push(Color.white);
    }
}
setColor(cxt, Color.white, 0, 0, w * size, mp);
for (let i = 0; i < h; i++) {
    if (i == 0 || i == h - 1)
        for (let j = 0; j < w; j++) {
            setColor(cxt, Color.black, i, j, size, mp);
        }
    else {
        setColor(cxt, Color.black, i, 0, size, mp);
        setColor(cxt, Color.black, i, w - 1, size, mp);
    }
}
setColor(cxt, Color.green, int(w / 2 - 1), int(h / 2), size, mp);
setColor(cxt, Color.green, int(w / 2), int(h / 2), size, mp);
setColor(cxt, Color.green, int(w / 2 + 1), int(h / 2), size, mp);
createFood(w, h, cxt, mp);
let snake = new Snake(w, h);
let dir = Dir.right;
let head = new pair<number, number>();
let tail = new pair<number, number>();
document.onkeydown = function (event) {
    let e: string = event.key;
    switch (e) {
        case "ArrowLeft":
            dir = Dir.left;
            break;
        case "ArrowRight":
            dir = Dir.right;
            break;
        case "ArrowUp":
            dir = Dir.up;
            break;
        case "ArrowDown":
            dir = Dir.down;
            break;
        default:
    }
    move();
};
let score = 0;

function move(): void {
    snake.command(dir);
    head = snake.getHead();
    tail = snake.getTail();
    if (head.x == tail.x && head.y == tail.y)
        return;
    if (mp[head.y][head.x] == Color.green || mp[head.y][head.x] == Color.black) {
        alert("Game Over!");
        clearInterval(id);
        location.reload();
        return;
    }
    if (mp[head.y][head.x] == Color.red) {
        document.getElementById("score").innerHTML = "score: " + ++score;
        createFood(w, h, cxt, mp);
        snake.setBig(true);
    }
    setColor(cxt, Color.green, head.x, head.y, size, mp);
    if (tail.x == -1)
        return;
    setColor(cxt, Color.white, tail.x, tail.y, size, mp);
}

let id = setInterval(move, 180);

```
也附一份编译后的js代码：

```js
function int(x) {
    return Math.floor(x);
}
var queue = /** @class */ (function () {
    function queue() {
        this.buf = new Array();
        for (var i = 0; i < 50; i++) {
            this.buf.push(null);
        }
        this.head = 0;
        this.tail = 0;
    }
    queue.prototype.empty = function () {
        return this.head == this.tail;
    };
    queue.prototype.front = function () {
        if (this.empty())
            return undefined;
        return this.buf[this.head];
    };
    queue.prototype.back = function () {
        if (this.empty())
            return undefined;
        return this.buf[(this.tail - 1 + this.buf.length) % this.buf.length];
    };
    queue.prototype.push = function (x) {
        this.buf[this.tail] = x;
        if ((this.tail + 1) % this.buf.length == this.head)
            this.resize();
        this.tail = (this.tail + 1) % this.buf.length;
    };
    queue.prototype.pop = function () {
        if (this.empty())
            return null;
        var n = this.head;
        this.head = (this.head + 1) % this.buf.length;
        return this.buf[n];
    };
    queue.prototype.resize = function () {
        var oldN = this.buf.length;
        var n = Math.floor(this.buf.length / 2);
        for (var i = 0; i < n; i++) {
            this.buf.push(null);
        }
        for (var i = oldN - 1; i >= this.head; i--) {
            this.buf[i + n] = this.buf[i];
        }
        this.head += n;
    };
    return queue;
}());
var pair = /** @class */ (function () {
    function pair(x, y) {
        if (x === void 0) { x = null; }
        if (y === void 0) { y = null; }
        this.x = x;
        this.y = y;
    }
    return pair;
}());
var Dir;
(function (Dir) {
    Dir[Dir["up"] = 0] = "up";
    Dir[Dir["down"] = 1] = "down";
    Dir[Dir["left"] = 2] = "left";
    Dir[Dir["right"] = 3] = "right";
})(Dir || (Dir = {}));
var Snake = /** @class */ (function () {
    function Snake(w, h) {
        this.w = w;
        this.h = h;
        this.snake = new queue();
        this.big = false;
        this.nowDir = Dir.right;
        this.snake.push(new pair(int(w / 2) - 1, int(h / 2)));
        this.snake.push(new pair(int(w / 2), int(h / 2)));
        this.snake.push(new pair(int(w / 2) + 1, int(h / 2)));
    }
    Snake.prototype.command = function (dir) {
        if ((dir ^ this.nowDir) == 1)
            dir = this.nowDir;
        var head = this.snake.back();
        this.snake.push(new pair(head.x + Snake.d[dir].x, head.y + Snake.d[dir].y));
        this.nowDir = dir;
    };
    Snake.prototype.setBig = function (flag) {
        this.big = flag;
    };
    Snake.prototype.getHead = function () {
        return this.snake.back();
    };
    Snake.prototype.getTail = function () {
        if (this.big) {
            this.big = false;
            return new pair(-1, -1);
        }
        var t = this.snake.front();
        this.snake.pop();
        return t;
    };
    Snake.d = [new pair(0, -1), new pair(0, 1), new pair(-1, 0), new pair(1, 0)];
    return Snake;
}());
var colorTable = ["rgb(240,240,240)",
    "rgb(0,0,0)", "rgb(0,255,0)", "rgb(255,0,0)", "rgb(255,255,0)"];
var Color;
(function (Color) {
    Color[Color["white"] = 0] = "white";
    Color[Color["black"] = 1] = "black";
    Color[Color["green"] = 2] = "green";
    Color[Color["red"] = 3] = "red";
    Color[Color["yellow"] = 4] = "yellow";
})(Color || (Color = {}));
var size = 20;
function setColor(cxt, color, x, y, siz, mp) {
    cxt.fillStyle = colorTable[color];
    cxt.fillRect(x * siz, y * siz, siz, siz);
    mp[y][x] = color;
}
var seed = new Date().getTime();
function rnd() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / (233280.0);
}
function rand(mod) {
    return Math.floor(rnd() * mod);
}
function createFood(w, h, cxt, mp) {
    var x = rand(w);
    var y = rand(h);
    while (mp[y][x] != Color.white) {
        x = rand(w);
        y = rand(h);
        c = cxt.getImageData(x, y, 1, 1).data;
    }
    setColor(cxt, Color.red, x, y, size, mp);
}
var c = document.getElementById("map");
var cxt = c.getContext("2d");
var w = 24;
var h = 24;
var mp = [];
for (var i = 0; i < h; i++) {
    mp.push([]);
    for (var j = 0; j < w; j++) {
        mp[i].push(Color.white);
    }
}
setColor(cxt, Color.white, 0, 0, w * size, mp);
for (var i = 0; i < h; i++) {
    if (i == 0 || i == h - 1)
        for (var j = 0; j < w; j++) {
            setColor(cxt, Color.black, i, j, size, mp);
        }
    else {
        setColor(cxt, Color.black, i, 0, size, mp);
        setColor(cxt, Color.black, i, w - 1, size, mp);
    }
}
setColor(cxt, Color.green, int(w / 2 - 1), int(h / 2), size, mp);
setColor(cxt, Color.green, int(w / 2), int(h / 2), size, mp);
setColor(cxt, Color.green, int(w / 2 + 1), int(h / 2), size, mp);
createFood(w, h, cxt, mp);
var snake = new Snake(w, h);
var dir = Dir.right;
var head = new pair();
var tail = new pair();
document.onkeydown = function (event) {
    var e = event.key;
    switch (e) {
        case "ArrowLeft":
            dir = Dir.left;
            break;
        case "ArrowRight":
            dir = Dir.right;
            break;
        case "ArrowUp":
            dir = Dir.up;
            break;
        case "ArrowDown":
            dir = Dir.down;
            break;
        default:
    }
    move();
};
var score = 0;
function move() {
    snake.command(dir);
    head = snake.getHead();
    tail = snake.getTail();
    if (head.x == tail.x && head.y == tail.y)
        return;
    if (mp[head.y][head.x] == Color.green || mp[head.y][head.x] == Color.black) {
        alert("Game Over!");
        clearInterval(id);
        location.reload();
        return;
    }
    if (mp[head.y][head.x] == Color.red) {
        document.getElementById("score").innerHTML = "score: " + ++score;
        createFood(w, h, cxt, mp);
        snake.setBig(true);
    }
    setColor(cxt, Color.green, head.x, head.y, size, mp);
    if (tail.x == -1)
        return;
    setColor(cxt, Color.white, tail.x, tail.y, size, mp);
}
var id = setInterval(move, 180);

```
以及css：

```css
#scoreContainer {
    float: left;
    text-align: left;
}
#mpContainer {
    text-align: right;
    width: 70%;
    float: left;
    margin: 0;
}
#score {
    color: coral;
    text-align: left;
}
body {
    text-align: left;
}
```



