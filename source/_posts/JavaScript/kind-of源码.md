---
title: 周下载量超1亿的库是如何判断JS类型的？
date: 2022-11-16 23:12:20
tags: JavaScript
---

最近我偶然发现了一个库：[kind-of](https://www.npmjs.com/package/kind-of)，他的作用是判断 JS 数据类型，经常被一些基础库所使用，如 [clone-deep](https://www.npmjs.com/package/clone-deep) 等，周下载量超 1 亿。

![image-2022111662009862 PM](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2022-11/16_18:20_GtoHmO.png)

如何判断 JS 数据类型也是一道常见面试题，本文就来看看 kind-of 是如何解决的。

## 用法

```js
kindOf(null);
//=> 'null'

kindOf(true);
//=> 'boolean'

kindOf(new WeakMap());
//=> 'weakmap'

kindOf(new Set());
//=> 'set'

kindOf(new Uint8Array());
//=> 'uint8array'
```

传入对应类型数据，调用就会返回对应字符串。

## 源码

由于源码简单，我们直接打开 https://unpkg.com/kind-of 就能看到源码（这里看到的代码和你使用 npm 安装后的代码是一样的）。觉得太长的，可以先略过代码，直接去看下面的分析。

```js
var toString = Object.prototype.toString;

module.exports = function kindOf(val) {
    if (val === void 0) return 'undefined';
    if (val === null) return 'null';

    var type = typeof val;
    if (type === 'boolean') return 'boolean';
    if (type === 'string') return 'string';
    if (type === 'number') return 'number';
    if (type === 'symbol') return 'symbol';
    if (type === 'function') {
        return isGeneratorFn(val) ? 'generatorfunction' : 'function';
    }

    if (isArray(val)) return 'array';
    if (isBuffer(val)) return 'buffer';
    if (isArguments(val)) return 'arguments';
    if (isDate(val)) return 'date';
    if (isError(val)) return 'error';
    if (isRegexp(val)) return 'regexp';

    switch (ctorName(val)) {
        case 'Symbol':
            return 'symbol';
        case 'Promise':
            return 'promise';

        // Set, Map, WeakSet, WeakMap
        case 'WeakMap':
            return 'weakmap';
        case 'WeakSet':
            return 'weakset';
        case 'Map':
            return 'map';
        case 'Set':
            return 'set';

        // 8-bit typed arrays
        case 'Int8Array':
            return 'int8array';
        case 'Uint8Array':
            return 'uint8array';
        case 'Uint8ClampedArray':
            return 'uint8clampedarray';

        // 16-bit typed arrays
        case 'Int16Array':
            return 'int16array';
        case 'Uint16Array':
            return 'uint16array';

        // 32-bit typed arrays
        case 'Int32Array':
            return 'int32array';
        case 'Uint32Array':
            return 'uint32array';
        case 'Float32Array':
            return 'float32array';
        case 'Float64Array':
            return 'float64array';
    }

    if (isGeneratorObj(val)) {
        return 'generator';
    }

    // Non-plain objects
    type = toString.call(val);
    switch (type) {
        case '[object Object]':
            return 'object';
        // iterators
        case '[object Map Iterator]':
            return 'mapiterator';
        case '[object Set Iterator]':
            return 'setiterator';
        case '[object String Iterator]':
            return 'stringiterator';
        case '[object Array Iterator]':
            return 'arrayiterator';
    }

    // other
    return type.slice(8, -1).toLowerCase().replace(/\s/g, '');
};

function ctorName(val) {
    return typeof val.constructor === 'function' ? val.constructor.name : null;
}

function isArray(val) {
    if (Array.isArray) return Array.isArray(val);
    return val instanceof Array;
}

function isError(val) {
    return (
        val instanceof Error ||
        (typeof val.message === 'string' &&
            val.constructor &&
            typeof val.constructor.stackTraceLimit === 'number')
    );
}

function isDate(val) {
    if (val instanceof Date) return true;
    return (
        typeof val.toDateString === 'function' &&
        typeof val.getDate === 'function' &&
        typeof val.setDate === 'function'
    );
}

function isRegexp(val) {
    if (val instanceof RegExp) return true;
    return (
        typeof val.flags === 'string' &&
        typeof val.ignoreCase === 'boolean' &&
        typeof val.multiline === 'boolean' &&
        typeof val.global === 'boolean'
    );
}

function isGeneratorFn(name, val) {
    return ctorName(name) === 'GeneratorFunction';
}

function isGeneratorObj(val) {
    return (
        typeof val.throw === 'function' &&
        typeof val.return === 'function' &&
        typeof val.next === 'function'
    );
}

function isArguments(val) {
    try {
        if (
            typeof val.length === 'number' &&
            typeof val.callee === 'function'
        ) {
            return true;
        }
    } catch (err) {
        if (err.message.indexOf('callee') !== -1) {
            return true;
        }
    }
    return false;
}

/**
 * If you need to support Safari 5-7 (8-10 yr-old browser),
 * take a look at https://github.com/feross/is-buffer
 */

function isBuffer(val) {
    if (val.constructor && typeof val.constructor.isBuffer === 'function') {
        return val.constructor.isBuffer(val);
    }
    return false;
}
```

## 分析

注意这是使用了 `module.exports` 即 CJS 的模式，可在 node 中直接使用，但不能在浏览器中使用。

入口是 kindOf 函数，大致过程：

1. 用 `===` 比较出了 null 和 undefined（用 void 0 表示 undefined 更准确，因为 undefined 是变量，值可以被改变）
2. 用 `typeof` 比较出了 boolean、string、number、symbol
3. 如果 `typeof` 值是函数
    1. 判断生成器函数 generatorfunction（通过构造函数名是否为 GeneratorFunction 判断）
    2. 否则是普通函数 function
4. 通过自定义函数判断出 array、buffer、arguments、date、error、regexp 类型
    1. array：通过 Array.isArray 和 原型链继承 Array 判断
    2. buffer：构造函数上的 isBuffer 方法
    3. arguments：lenth 属性和 callee 方法
    4. date：原型链继承 Date 或 拥有 toDateString、getDate、setDate 方法
    5. error：原型链继承 Error 或拥有 message 属性和构造函数上的 stackTraceLimit 属性
    6. regexp：原型链继承 Error 或拥有特定属性或方法（拥有了特定属性或方法，就判断它为一个类型是不严谨的，但这里也只是兜底逻辑，并且也是符合鸭子类型的思想的）
5. 通过构造函数的命名判断出了 promise、map、set、int8array 等类型
6. 通过 `Object.prototype.toString.call(val)` 判断 setiterator 等
7. 最后兜底逻辑是返回 toString 的类型值

看下来是比较简单的，主要使用了 4 中方法判断类型：

1.  `===`
2.  `typeof`
3.  原型链继承 `instanceof`
4.  鸭子类型法（只要有这些属性或方法，就是某种类型）
5.  `Object.prototype.toString.call(val)`

弄懂了这个库也就对 JS 的类型更深入了，以后判断类型的时候也可以直接使用此库了。

类似功能的还有 [typeof](https://github.com/CodingFu/typeof) 和 [type-of](https://github.com/ForbesLindesay/type-of) 等，kind-of 相比于他们的优势是类型检测更全面以及性能更好。

其实我们应该多多去了解这些很常用基础库的使用与原理，这既可以解决通用问题，也可以拓展知识面。比如 [is-primitive](https://www.npmjs.com/package/is-primitive)、[is-number](https://www.npmjs.com/package/is-number) 等等。
