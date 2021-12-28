---
title: browser js
date: 2019-09-09 09:09:09
tags: 草稿
---

写一个函数，找出 js 的内置变量

使用 `Object.defineProperty(object1, 'property1', { value: 42,writable: false });` 定义属性的描述符

使用 `Object.getOwnPropertyDescriptor(object1, 'property1');` 获取属性的描述符

`console.log('123 %s-%d', 234, 3656)` 这个在浏览器控制台是能正常输出的，但好像现在都不偏向使用这个了，比如 js 用模板字符串替代了，py 用 fstring 替代了。

浏览器 log 出颜色来：`console.log('%c Oh my heavens! ', 'background: #222; color: #bada55');`

`console.log('132%c234','background: #fbe')`

`console.log('132%c234','background: #ddd')`

都不错

Js 怎么实现队列？

只使用 push，前端的 dequeue 使用 offset 即可，[这里是代码](https://github.com/datastructures-js/queue)

### 资源

[mdn 的 js 教程](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
