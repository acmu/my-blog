---
title: 使用 npm link 调试包
date: 2022-11-09 23:12:20
tags: JavaScript
---

本文讨论的是 npm v6 版本。

## 示例

我要调试的包是 mc-charts，主工程是 tms-c3，即我要都 tms-c3 中使用 npm link 调试 mc-charts 包。

共两步：

1. 在 mc-charts 包执行 npm link。
2. 在 tms-c3 中执行 npm link mc-charts（注意：这里一定是包名，即 package.json 中的 name 字段，而不是文件目录名）。

以下实际演示一遍：

第一步：进入 mc-charts 包目录下（路径是/Users/yuan/repo/mc-charts），他的 package.json 的 name 字段是 mc-charts，这时我在此包下执行 npm link：

```
/usr/local/lib/node_modules/mc-charts -> /Users/yuan/repo/mc-charts
```

输出内容表示在 /usr/local/lib/node_modules 目录下新建了一个软链接，指向了 mc-charts 包的目录

第二步：在主工程是 tms-c3 （路径是/Users/yuan/repo/tms-c3）中执行 npm link mc-charts

```
/Users/yuan/repo/tms-c3/node_modules/mc-charts
-> /usr/local/lib/node_modules/mc-charts
-> /Users/yuan/repo/mc-charts
```

为了方便展示，进行了换行。这里表示在主工程 tms-c3 的 node_modules 下新建了一个软链接，他指向了 /usr/local/lib/node_modules/mc-charts，但此时 /usr/local/lib/node_modules/mc-charts 又指向了 /Users/yuan/repo/mc-charts，所以就能达到调试的目的。

## 简化版本

还有简化版本：npm link pkgFloder（包的路径地址）

tms-c3 目录下执行：

```
npm link ../mc-charts/
```

输出：

```
/usr/local/lib/node_modules/mc-charts -> /Users/yuan/repo/mc-charts

/Users/yuan/repo/tms-c3/node_modules/mc-charts
-> /usr/local/lib/node_modules/mc-charts
-> /Users/yuan/repo/mc-charts
```

这时你项目的 node_modules 中就已经有了 mc-charts 包了，首先在 package.json 里的 dependencies 加上 mc-charts 包，版本随便写就行，最后在代码中 import 即可使用了。如果你有 watch 文件变更的需求，npm link 也是支持的。

## 删除 link

如果要取消 link，直接删除 `/Users/yuan/repo/tms-c3/node_modules/mc-charts` 和 `/usr/local/lib/node_modules/mc-charts` 这两个文件即可，或者可以使用 npm unlink 命令（网络上说 unlink 命令可行，但我并没有在 npm 官方文档找到此命令）

[npm unlink 命令参考](https://gist.github.com/electricg/68f1d42e29a322b5f3bc34748bac1f8e)：

Link scoped pakcages:

```
cd ~/projects/node-redis    # go into the scoped package directory
npm link                    # creates global link
cd ~/projects/node-bloggy   # go into some other package directory
npm link @myorg/redis       # link-install the scoped package
```

Unlink scoped packages:

```
cd ~/projects/node-bloggy  # go into some other package directory
npm unlink @myorg/redis    # unlink-uninstall the scoped package
npm install @myorg/redis   # re-install the scoped package
cd ~/projects/node-redis   # go into the scoped package directory
npm unlink                 # deletes global link
```

## 原理

如果你了解软链接与硬链接，那么可以轻松的猜到：link 命令就是创建的软链接而已，我们可以自己使用 shell 的 ln 命令实现。

为什么只是创建了软链接就能调试包了呢？这还要看 node 的查包逻辑了，你 import 了 mc-charts 包，它会先去 node_modules 中找，找到的刚好是软链接，所以就能调试了。

参考：

npm link 命令 v6 版本[使用文档](https://docs.npmjs.com/cli/v6/commands/npm-link)
