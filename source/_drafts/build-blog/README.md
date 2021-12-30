---
title: 构建博客
date: 2009-09-09 09:09:09
tags: 草稿
---

gitee 图片同步 github（图片备份、容灾）：

[参考](https://www.bahuangshanren.tech/github%E4%B8%8Egitee%E5%8F%8C%E5%90%91%E8%87%AA%E5%8A%A8%E5%90%8C%E6%AD%A5/)

可以使用 github action + 定时任务 做，action 好 nb 呀，真的要学一学了

可参考的博客主题：

https://www.yuexunjiang.me/

https://qianfanguojin.top/

https://zihengcat.github.io/archives/

这些都是用 hexo 搭建的，并且有相关搭建教程文章

初步想法：使用 github 开源仓库，用 pages 部署（或 netlfy 啥的），用 GitHub 评论接入评论系统

可参考：

Vue2 文档

Vue3 文档

labulad 的 githhub

初步想使用 vue 3 的文档，但是缺少评论系统，自己看着是否能接入一下。

最后还是使用的 hexo 直接写的

## 博客诞生记

必须要有博客了，记录学习与输出

主要使用 [vue2 官方文档](https://github.com/vuejs/cn.vuejs.org)（本来想用 vuepress 的，但感觉太新了，可能有坑）、github pages，先让我的文档能在网页上看到再说

可参考的 [算法刷题](https://github.com/labuladong/fucking-algorithm) 但是这个的样式还是有些欠缺

如何删除掉无用的东西以及更改页面？

首先 yarn 安装所以依赖，之后 yarn start，即可看到网页，可以在 themes/vue/layout/layout.ejs 中删除无用的东西，之后发现 themes/vue/layout/partials/main_menu.ejs 中是目录结构（这里所有多余的 css 先暂不删除，以后可慢慢优化）

改完后使用 yarn build，即可看到会 build 出 public 文件夹，GitHub 配置的应该也要是这个文件夹，还有 hexo deploy 命令，可以看下这个使用的哪个配置文件，是干嘛的

## 其他

使用这个生成目录

还是直接使用 vue 文档的生成器？

1. 把图片搞定了、评论搞定了
2. 搞一个自己的博客
3. 搞博客的 pv 分析

[这里](https://github.com/settings/applications)可以查看你已授权的 GitHub app

# Code Zero - 编程重启

_推荐使用 Typora 打开_

**我的学习笔记 ⌨️**

目录：

1. xxx
2. xxx

## 路线图 road map

罗列出近期（2021-11-01 ~ 2021-12-30）的重点：

| 内容                     | 级别   |
| ------------------------ | ------ |
| py 基本使用              | \*\*   |
| 操作系统 图解            | \*\*   |
| 分享 tms 业务            | \*\*\* |
| 分享 地图使用            | \*\*\* |
| node c c++ java 复习总结 | \*     |
| go rust 学习开阔         | \*     |

学习知识要结构化、系统化、循序渐进的学习，这样才有乐趣~

学习链接：

[py3 多线程](https://www.runoob.com/python3/python3-multithreading.html)

[ECharts 教程](https://www.runoob.com/echarts/echarts-tutorial.html)

[TypeScript 教程](https://www.runoob.com/typescript/ts-tutorial.html)

[Java 教程](https://www.runoob.com/java/java-tutorial.html)

[Node 教程](https://www.runoob.com/nodejs/nodejs-tutorial.html)

为什么 JS 是单线程？

### 学习方向

要学习的语言：

1. JS TS Node
2. Python
3. Java
4. Go Rust c cpp 汇编

要学习的方向：

1. 操作系统
2. 网络
3. vue
4. 业务
5. 地图

要写的文章：

1. v8 运行
    1. 如何运行 v8
2. js 中的二进制（二进制如何表示数的）
    1. 整数、浮点数表示
    2. 位运算
3. JS 中的队列
4. 图解系统

    1. 可以多查一下不知道的知识，之后再写进去
    2. 要分模块 分部分写，这样比较小

5. 用代码去验证知识

要探索的：

1. 请求抓包
2. linux 文件系统、权限

### 学习锚点

[py 菜鸟教程看到这里](https://www.runoob.com/python3/python3-namespace-scope.html)

菜鸟教程真的很不错，简单清晰易懂，只讲重点，并且有示例（可以尽情的学习 go rust [TS](https://www.runoob.com/typescript/ts-tutorial.html)、[node](https://www.runoob.com/nodejs/nodejs-tutorial.html)了，可以类比学习，如 js py 就有很多相似之处）
