---
title: browser js
date: 2009-09-09 09:09:09
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

## 小知识

### isNaN vs Number.isNaN

```js
isNaN('d');
// true
Number.isNaN('d');
// false
```

isNaN 对于不是数值类型的值来说，会先强制转为数值类型，那么很容易造成不是 NaN 的值，但是转为数值之后就是 NaN 了，一般来讲这不是你期望看到的答案，所以推荐使用 Number.isNaN 替代 isNaN

### toFixed() 和 toPrecision() 的区别

[JavaScript 中 toFixed() 和 toPrecision() 的区别](https://www.c-sharpcorner.com/blogs/difference-between-tofixed-and-toprecision-in-javascript1)

toPrecision 是到多少位精度如`(21.29).toPrecision(2) === '21'`，代表只保留 2 位精度数字

toFixed 是到小数点后多少位

这两个函数，如果数字多了都会四舍五入，如果数字不够，都会在后面补 0（但是这里的四舍五入由于浮点数原因，可能会出错，如`(2.55).toFixed(1) === '2.5'`）

### Math.round(x) 的坑

[JavaScript 中精度问题以及解决方案](https://www.runoob.com/w3cnote/js-precision-problem-and-solution.html)

还有另外一个与 JavaScript 计算相关的问题，即 Math.round(x)，它虽然不会产生精度问题，但是它有一点小陷阱容易忽略。下面是它的舍入的策略：

如果小数部分大于 0.5，则舍入到下一个绝对值更大的整数。如果小数部分小于 0.5，则舍入到下一个绝对值更小的整数。如果小数部分等于 0.5，则舍入到下一个正无穷方向上的整数。所以，对 Math.round(-1.5)，其结果为 -1，这可能不是我们想要的结果。

当然，上面提到的 big.js 等库，都提供了自己的 round 函数，并且可以指定舍入规则，以避免这个问题。

## mdn api

[Array.prototype.includes()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)

Syntax includes(searchElement) includes(searchElement, fromIndex)

Technically speaking, `includes()` uses the [`sameValueZero`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#same-value-zero_equality) algorithm to determine whether the given element is found.

Same-value-zero equality Similar to same-value equality, but +0 and -0 are considered equal.

## 原生 JS

### 用 js 加入 css 代码

```js
const styles = `
        #__make-link {
            position: fixed;
            right: 32px;
            top: 32px;

            padding: 8px 16px;
            min-width: 200px;
            border-radius: 8px;
            font-size: 12px;
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        }

        #__make-link.suc {
            border: 2px solid #2ecc71;
        }

        #__make-link.err {
            border: 2px solid #e74c3c;
        }
`;
var styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
```

可正常运行，但看到生成的 css 代码中有 `<br>` 换行标签，不太优雅（不知道为啥）

还可以直接设置 dom 的 style 属性，但这种方式把 css 和 js 耦合了，更不好，暂时没有比较好的方案

（背景：写插件时，要在 background js 中控制页面，这里只能使用 js）

## 资源

[mdn 的 js 教程](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
