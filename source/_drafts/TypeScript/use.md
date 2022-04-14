---
title: 执行ts代码
date: 2009-09-09 09:09:09
tags: 草稿
---

如何快速执行 ts 代码呢？

首先要有 [ts-node](https://typestrong.org/ts-node/docs/) 帮助我们直接执行代码

然后要有 ts 配置文件 `tsconfig.json`

```json
{
    "compilerOptions": {
        "alwaysStrict": true,
        "strictBindCallApply": true,
        "strictFunctionTypes": true,
        "target": "ES2020"
    },
    "files": ["a.ts"]
}
```

这里的 `compilerOptions` 是参考 力扣 的

![image-20211230121755011](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2021-12/30_12:17_Mdfzev.png)

`files` 就是在根目录下写的一个 `a.ts` 一定要在这里写代码，因为`tsconfig.json`会检测有没有这个 ts 文件，如果没有，还会编辑器报错 🥲

之后使用 `npx ts-node a.ts` 即可执行代码啦
