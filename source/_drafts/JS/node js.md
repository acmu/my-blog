---
title: node js
date: 2009-09-09 09:09:09
tags: 草稿
---

[toc]

child_process 模块 有 exec 方法，可以执行 shell 命令

```js
const { exec } = require('child_process');

const qianyiBranch = 'feature/automation-route-qianyi';
const originBranch = 'feature/WUEOQ-2020-21161848/automation-route';

const cmdList = [
    'pwd',
    `git checkout ${qianyiBranch}`,
    `git pull origin ${originBranch}`,
];

exec(cmdList.join(' && '), (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ->\n${stdout}`);
    if (stderr) {
        console.log(`stderr: ->\n${stderr}`);
    }
});
```

Node.js 多进程我们都知道 Node.js 是以单线程的模式运行的，但它使用的是事件驱动来处理并发，这样有助于我们在多核 cpu 的系统上创建多个子进程，从而提高性能。

[Node.js 多进程](https://www.runoob.com/nodejs/nodejs-process.html)

[Node 事件循环](https://www.runoob.com/nodejs/nodejs-event-loop.html)

## node 菜鸟教程学习

[教程链接](https://www.runoob.com/nodejs/nodejs-tutorial.html)

node -v 查看 node 版本，npm -v 查看 npm 版本，如果都执行成功了，那么你的 node 环境就配置成功了

Node.js REPL(Read Eval Print Loop:交互式解释器) 可以方便调试代码

Node.js 异步编程的直接体现就是回调。

Node.js 是单进程单线程应用程序，但是因为 V8 引擎提供的异步执行回调接口，通过这些接口可以处理大量的并发，所以性能非常高。

Node.js 基本上所有的事件机制都是用设计模式中观察者模式实现。

大多数时候我们不会直接使用 EventEmitter，而是在对象中继承它。包括 fs、net、 http 在内的，只要是支持事件响应的核心模块都是 EventEmitter 的子类。

EventEmitter 的 error 事件是特殊的事件，如果触发了这个，并且没有事件处理函数时，那么就会异常终止程序，所以尽量要添加 error 的监听函数

流的形式可以解压和压缩文件

### node 全局对象

`__dirname` `__filename` `console`

`global` `process`

### console

| 方法 | 描述 |
| --- | --- |
| log | 很简单了 |
| info warn error | 不同样式而已 |
| dir | 方便层级展示 |
| time timeEnd | 方便计时 |
| trace | 看调用栈（挺高级的，在 node 上可以看到 node 的内核调用，在浏览器就只能看到自己代码的调用）<br /><img src="https://raw.githubusercontent.com/acmu/pictures/master/uPic/2021-12/28_17:37_wcTSEP.png" alt="image-20211130155209287" style="zoom:50%;" /> |
| assert | 两个参数，第一个是表达式，第二个是表达式为 false 时输出的信息 |

### time timeEnd 小测验

把 n+=1 的操作执行 1e9 次，用 time 和 timeEnd 计时，发现 node 执行需要 800 ms 而浏览器执行需要 1900 ms，浏览器是 node 的两倍多

### process

他提供了当前进程与操作系统交互的一种方法，这里面有很多有用是信息（如使用的 node 版本，node 依赖的其他库的版本：zlib、v8 啥的，当前进程的 pid，寻找模块的路径）

`process.memoryUsage()` 输出内存使用情况

### util

`util.callbackify` 可以把一个返回 promise 的函数转换成遵循异常优先的回调风格的函数

`util.promisify` 把 callback error 风格的转换成 promise，即可以使用 await

`util.inherits` 实现原型继承

`util.inspect` 方便的输出字符串，检查对象

`util.isArray` `util.isRegExp` `util.isDate` 判断类型

### 文件系统 fs

[POSIX 是什么？](https://www.eet-china.com/mp/a65068.html)

POSIX：可移植操作系统接口（Portable Operating System Interface of UNIX，缩写为 POSIX ）

早期贝尔实验室对学校开放了 unix 源码，后面就有很多 unix-like 的衍生系统版本，导致没有标准，定义混乱，posix 就是 IEEE（电气与电子工程师协会 Institute of Electrical and Electronics Engineers，简称 IEEE） 发布的标准

linux 和 mac os 都符合这套标准，windows 也在努力符合了

fs 模块中的方法均有异步和同步的版本，推荐使用异步版本

在 node 中，中文字符占 3 字节，符合 ascii 码的占 1 字节，使用如下代码可测试出来：（要有 input 文件）

```js
var fs = require('fs');
var buf = new Buffer.alloc(14 + 6 + 1);

console.log('准备打开已存在的文件！');
fs.open('input.txt', 'r+', function (err, fd) {
    if (err) {
        return console.error(err);
    }
    console.log('文件打开成功！');
    console.log('准备读取文件：');
    fs.read(fd, buf, 0, buf.length, 0, function (err, bytes) {
        if (err) {
            console.log(err);
        }
        console.log(bytes + '  字节被读取');

        // 仅输出读取的字节
        if (bytes > 0) {
            console.log(buf.slice(0, bytes).toString());
        }
    });
});
```

输出：

```
准备打开已存在的文件！
文件打开成功！
准备读取文件：
21  字节被读取
www.runoob.com里赛2
```

浏览器也有 buffer 是不是可以同样试一下？

`fs.close()` 关闭文件描述符，就可以关闭文件的引用了（linux 系统需要，py 也有 close，用 with 语句的时候自动 close 掉）

难怪说 fs 是遵循 posix 风格的，比如`fs.chmod` 函数，用命令行的时候，不也是叫这个吗 😂

获取 POST 请求内容 POST 请求的内容全部的都在请求体中，http.ServerRequest 并没有一个属性内容为请求体，原因是等待请求体传输可能是一件耗时的工作。比如上传文件，而很多时候我们可能并不需要理会请求体的内容，恶意的 POST 请求会大大消耗服务器的资源，所以 node.js 默认是不会解析请求体的，当你需要的时候，需要手动来做。

[net 模块](https://www.runoob.com/nodejs/nodejs-net-module.html) 有时间看下，内容比较多，以及后面的 dns domain 等

net 还可以创建客户端与服务器的连接，类似这种

服务器

```js
var net = require('net');
var server = net.createServer(function (connection) {
    console.log('client connected');
    connection.on('end', function () {
        console.log('客户端关闭连接');
    });
    connection.write('Hello World!\r\n');
    connection.pipe(connection);
});
server.listen(8080, function () {
    console.log('server is listening');
});
```

客户端

```js
var net = require('net');
var client = net.connect({ port: 8080 }, function () {
    console.log('连接到服务器！');
});
client.on('data', function (data) {
    console.log(data.toString());
    client.end();
});
client.on('end', function () {
    console.log('断开与服务器的连接');
});
```

还有这里的服务器不是基于 tcp 的，因为浏览器访问不了

Zlib 一个用于压缩的模块（py 里也有）

dns 模块，用于解析域名（解析域名这种操作都能在代码的库里，nb 呀）

domain 可以把异步的报错分组处理，并且还能保留上下文（想法挺好的，但现在废弃了）

node web 客户端也要用 http 模块（这是不是相当于爬虫了）

Express 可以写下上传文件的 demo，还有 cookie 管理等

### 多进程

js 是单线程的，所以没有多线程这一说，那他怎么并行呢？就是使用进程，`child_process` 模块可以为多进程提供支持

child_process.fork 是 spawn()的特殊形式，用于在子进程中运行的模块，如 fork('./son.js') 相当于 spawn('node', ['./son.js']) 。与 spawn 方法不同的是，fork 会在父进程与子进程之间，建立一个通信管道，用于进程之间的通信。

node 连接 mysql 的库就叫 mysql 🥲，这是一个用 js 写的 mysql 驱动

node 查看所有文件并输出目录格式（支持忽略文件和目录）

```js
/**
 * 使用 node 的文件操作，完成遍历所有文件，如果这是一个目录就进入目录继续遍历
 *
 * 使用什么样的结构展示结果？
 */

const promisify = require('util').promisify;
const fs = require('fs');
const path = require('path');
const lodash = require('lodash');

const ignoreDirs = [
    '.git',
    '.vscode',
    'node_modules',
    'runoob-greeting',
    '.pics',
];

const readdir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);

class Resulte {
    constructor({ pwd, files, dirs }) {
        this.pwd = pwd;
        this.files = files;
        this.dirs = dirs;
    }
}
const str1 = '├── ';
const str2 = '└── ';
const str3 = '│   ';
const str4 = '    ';

async function findFile(dirname, resList) {
    const list = await readdir(dirname, { withFileTypes: true });
    const dirs = [];
    const files = [];
    debugger;
    list.forEach(i => {
        if (i.isDirectory()) {
            if (!ignoreDirs.includes(i.name)) {
                dirs.push(i.name);
            }
        } else {
            files.push(i.name);
        }
    });
    resList.push(new Resulte({ pwd: dirname, dirs, files }));

    await Promise.all(
        dirs.map(async d => {
            await findFile(path.join(dirname, d), resList);
        }),
    );
}

const logAll = ({ item, prefix, resList, logList, isLastDir }) => {
    const { pwd, dirs, files } = item;

    if (prefix.length) {
        logList.push(prefix.slice(0, -4) + (isLastDir ? str2 : str1) + pwd);
    } else {
        logList.push(prefix + pwd);
    }

    dirs.forEach((d, idx) => {
        const item = lodash.find(resList, ['pwd', path.join(pwd, d)]);
        const isLastDir = idx === dirs.length - 1 && files.length === 0;
        logAll({
            item,
            prefix: prefix + (isLastDir ? str4 : str3),
            resList,
            logList,
            isLastDir,
        });
    });
    files.forEach((f, idx) => {
        const isLastFile = idx === files.length - 1;
        logList.push(prefix + (isLastFile ? str2 : str1) + f);
    });
};

async function writeRes(data) {
    try {
        let out = JSON.stringify(data, null, 2);
        if (typeof data === 'string') {
            out = data;
        }
        await writeFile('output.txt', out);
        console.log('write success😄');
    } catch (error) {
        console.log(error);
    }
}

(async () => {
    const resList = [];
    await findFile('/Users/yuan/cdemo/code-zero', resList);
    // console.log(resList);
    const logList = [];
    logAll({
        item: resList[0],
        prefix: '',
        resList,
        logList,
        isLastDir: false,
    });

    let res = '';
    logList.forEach(i => {
        res += i + '\n';
    });

    await writeRes(res);
})();
```

输出类似如下

```
/Users/yuan/cdemo/code-zero
├── /Users/yuan/cdemo/code-zero/学习笔记
│   ├── /Users/yuan/cdemo/code-zero/学习笔记/English
│   │   └── usually.md
│   ├── /Users/yuan/cdemo/code-zero/学习笔记/HTML CSS 基础知识
│   │   ├── canvas.md
│   │   ├── html.md
│   │   ├── scss.md
│   │   └── 选择器.md
│   ├── /Users/yuan/cdemo/code-zero/学习笔记/JS
│   │   ├── browser js.md
│   │   ├── node js.md
│   │   ├── 常用api.md
│   │   └── 类.md
│   ├── /Users/yuan/cdemo/code-zero/学习笔记/Linux
│   │   ├── 2021-11-21.md
│   │   └── 内容备份.md
│   ├── /Users/yuan/cdemo/code-zero/学习笔记/Typora
│   │   ├── 使用方法.md
│   │   └── 图片处理.md
│   ├── /Users/yuan/cdemo/code-zero/学习笔记/Vue
│   │   ├── /Users/yuan/cdemo/code-zero/学习笔记/Vue/源码
│   │   │   ├── 01 记忆.md
│   │   │   └── 02 文档学习.md
│   │   └── prop校验.md
│   ├── /Users/yuan/cdemo/code-zero/学习笔记/browser
│   │   ├── Chrome.md
│   │   ├── devTools.md
│   │   └── 知识.md
│   ├── /Users/yuan/cdemo/code-zero/学习笔记/git
│   │   └── 常用.md
│   ├── /Users/yuan/cdemo/code-zero/学习笔记/npm常用库
│   │   └── read.md
│   ├── /Users/yuan/cdemo/code-zero/学习笔记/兴趣语言
│   │   ├── /Users/yuan/cdemo/code-zero/学习笔记/兴趣语言/go
│   │   │   └── Untitled.md
│   │   ├── /Users/yuan/cdemo/code-zero/学习笔记/兴趣语言/rust
│   │   │   └── Untitled.md
│   │   └── /Users/yuan/cdemo/code-zero/学习笔记/兴趣语言/汇编语言
│   │       └── 2021-11-17.md
│   ├── /Users/yuan/cdemo/code-zero/学习笔记/哲学思考
│   │   └── 2021-11-25.md
│   ├── /Users/yuan/cdemo/code-zero/学习笔记/图解系统
│   │   └── 01 进程、线程基础知识.md
│   ├── /Users/yuan/cdemo/code-zero/学习笔记/效率工具
│   │   ├── Charles.md
│   │   ├── DS_store.md
│   │   ├── yarn.md
│   │   └── 谷歌搜索技巧.md
│   ├── /Users/yuan/cdemo/code-zero/学习笔记/数据结构与算法
│   │   └── 2021-11-16.md
│   ├── /Users/yuan/cdemo/code-zero/学习笔记/有趣文章
│   │   └── 2021-11-15.md
│   ├── /Users/yuan/cdemo/code-zero/学习笔记/科技爱好者
│   │   └── 知识记录.md
│   ├── /Users/yuan/cdemo/code-zero/学习笔记/编程教学
│   │   ├── 01 学习资源.md
│   │   ├── 02 安装环境.md
│   │   ├── 03 基本类型.md
│   │   ├── 04 高级部分.md
│   │   └── 学习记录.md
│   └── /Users/yuan/cdemo/code-zero/学习笔记/面试
│       ├── 手写promise.md
│       └── 手写继承.md
├── .gitignore
├── LICENSE.md
├── README.md
└── USEME.md
```

使用到的 api `fs.readdir` `fs.writeFile`
