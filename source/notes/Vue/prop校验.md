---
title: 草稿
date: 2009-09-09 09:09:09
tags: 草稿
---

[这个文档](https://zhuanlan.zhihu.com/p/94215454)比较好

**主要内容：**

1. prop 传值是 undefined 和 不传是一样的，只有这种情况下，才会返回 default 的值
2. required 为 true 时，不管 为 null 还是 undefined 都能通过这个校验，只是 type 校验会出错而已（疑问：那这个校验有个毛用呀？）

如果真的想要传值为 空，我一个想法是：传值为 undefined，而不不写 default 字段，那么子组件拿到的就是 undefined 了，就可以判断了
