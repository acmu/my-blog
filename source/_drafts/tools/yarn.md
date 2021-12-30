---
title: yarn 常用api
date: 2019-09-09 09:09:09
tags: JS生态
---

yarn add 的[使用](https://classic.yarnpkg.com/en/docs/cli/add)

| cmd | desc |
| --- | --- |
| add | 加入 depend 里 |
| add --dev/-D | 加入 devDepend 里 |
| `yarn add package-name@1.2.3` | 准确版本 |
| `yarn global add http-server ` | 全局安装<br />注意 global 一定要在 add 的前面 |

`yarn global list` 查看全局安装了多少包

`yarn list --depth=0` 可以只看第一层的包（是扁平化的第一层，不是单纯的`package.json` 中的第一层）

`yarn list --pattern "gulp|grunt"` 可以只查看完全匹配 `gulp` 或`grunt`相关的包
