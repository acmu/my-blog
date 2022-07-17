---
title: JavaScript Symbol 解读
date: 2022-07-17 15:32:36
tags: JavaScript
---

作为一名高级前端工程师，你一定见过类似这个的东西`Symbol.toPrimitive`、`@@toPrimitive`，他其实就是本文要讲的 Symbol，让我们一起了解下吧

## 定义

Symbol 是一个内置对象，构造函数（这是一个特殊的构造函数，因为他不能使用 new，只能直接调用）返回 Symbol 原始类型，用于返回一个唯一值（这个唯一值是什么并不重要，重要的是他和所有的其他值都不相等），如：

```js
const a = Symbol('desc');
```

就只有 a 能访问到 `Symbol('desc')`的值，就算你再定义一个相同的值，他们也是不相同的

```js
const b = Symbol('desc');
console.log(b === a);
// false
```

可以发现 'desc' 根本就没啥实际用处，确实是这样，他在这里只是起到了注释的作用

Symbol 的一大用处就是作为对象的 key（对象的 key 只能是 Symbol 或字符串这两种类型），它可以避免和已有的 key 或新增的 key 冲突。Symbol 上还有一些静态属性，他们被称为众所周知的（well-known）Symbol，用于在一些特殊操作时底层的调用

你如果想定义一个想让其他变量也能获取的 Symbol，也是可以的，要通过 `Symbol.for("key")` 静态方法，他会先在 Symbol 全局注册表上注册一个 key，然后返回，下次你在调用的时候就直接返回已有值了

```js
// 在全局注册表中注册 zmy 这个 key
const a = Symbol.for('zmy');
// 在全局注册表中获取 zmy key 的值
const b = Symbol.for('zmy');
console.log(a === b);
// true
// 还可以有 keyFor 或 description 获取对应的描述
console.log(a.description, Symbol.keyFor(a));
// zmy zmy
```

### 为什么 Symbol 不能用 new 创建？

我们可以用 String 类比举例一下：

```js
console.log(typeof String(97));
// string
console.log(typeof new String(97));
// object
```

String 构造函数直接调用是为了强制转换的，new String 是为了获得 string 对象的，首先你肯定不想获得 Symbol 对象，你要的是 Symbol 原始类型，所以语言层面上 new Symbol 会报错，这是合理的，因为我们就算有了 Symbol 对象也没有用武之地，但你可以使用`Object(Symbol('f'))`强制获取到对象封装的 Symbol

## well-known Symbol

把它翻译成众所周知的 Symbol 我还是觉得不太合适，因为一般开发者都不会了解这些 Symbol，所以就用英文原文吧。在 well-known Symbol 之前，都是用字符串来实现调用的，如 `JSON.stringify` 函数会调用对象的 `toJSON()`方法，String 强制转换会调用 `toString()` 方法等。可是随着操作符的逐渐增加，这样使用特殊字符串方法并不好，所以出现了常用 Symbol 来解决这个问题

[ES 标准](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-well-known-symbols) 一共定义了 13 个（标准中也定义了 @@toPrimitive 其实就是 Symbol.toPrimitive，只不过 @@toPrimitive 是在标准中描述的方式，Symbol.toPrimitive 是能在语言中实际用到的功能），下面我们看些常用的

### Symbol.toPrimitive

如果你想要把一个对象类型转为原始类型，那就要使用到 Symbol.toPrimitive 这个 key，如：

```js
const obj = {};
// 如果没有定义 Symbol.toPrimitive 这个 key，那么走的是默认行为
console.log(String(obj));
// [object Object]

// 如果给对象定义了 Symbol.toPrimitive key，他的属性值是方法
// 那么在把对象转为原始类型的时候就会使用这个方法
obj[Symbol.toPrimitive] = function (hint) {
    // hint 的取值有3种：string、number和default
    if (hint === 'string') {
        return 'mq';
    } else if (hint === 'number') {
        return 97;
    } else {
        return null;
    }
};
console.log(String(obj));
// mq
console.log(Number(obj));
// 97
```

当然，由于历史原因，你肯定也听说过用 toString 或 valueOf 也能实现以上逻辑，是的，但现代语法还是推荐首先使用 Symbol.toPrimitive 来解决，例子如下：

**对象转 string**

```js
const a = {
    // 1. 首先使用它
    [Symbol.toPrimitive]() {
        return 'symbol nb';
    },
    // 2. 如果没有 @@toPrimitive 那么使用这个
    toString() {
        return 'str';
    },
    // 不用这个
    valueOf() {
        return 'value of';
    },
};
console.log(String(a));
```

**对象转 number**

```js
const a = {
    // 1. 首先使用它
    [Symbol.toPrimitive]() {
        // 一定要返回数字类型，否则是 NaN
        return 789;
    },
    // 2. 接着是这个
    valueOf() {
        return 123;
    },
    // 3. 最后这个
    toString() {
        return 567;
    },
};
console.log(Number(a));
```

所以这你也应该能理解为什么`+moment()`的值和 `moment().valueOf()`的值一样了吧

### Symbol.toStringTag

由于 JavaScript 类型系统的混乱，你一定用过`Object.prototype.toString`来判断类型，那么 Symbol.toStringTag 就和这个函数有关

```js
// 使用 toString 函数可以判断出数组类型
console.log(Object.prototype.toString.call([]));
// [object Array]

// 那么如果你自己定义了一个校验类，想让他在 toString 时能返回特定类型该怎么办呢？
class ValidatorClass {}
console.log(Object.prototype.toString.call(new ValidatorClass()));
// [object Object]

// 定义他的 Symbol.toStringTag 属性可以改变这个行为
// 此属性是一个字符串
ValidatorClass.prototype[Symbol.toStringTag] = 'Validator';
console.log(Object.prototype.toString.call(new ValidatorClass()));
// [object Validator]

// 顺便一提 dom 上有这个属性
const btn = document.createElement('button');
console.log(Object.prototype.toString.call(btn));
// [object HTMLButtonElement]

// 可以看到 btn 的原型上是有 Symbol(Symbol.toStringTag) 这个 key 的
console.log(Object.getOwnPropertySymbols(Object.getPrototypeOf(btn)));
// [Symbol(Symbol.toStringTag)]

console.log(btn[Symbol.toStringTag]);
// HTMLButtonElement
```

上述代码使用 [`Object.getOwnPropertySymbols()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols) api，他可以返回一个对象的所有类型为 Symbol 的 key。所有对象初始时都是没有 Symbol 属性的（但是你可以去原型上找 Symbol）

```js
console.log(Object.getOwnPropertySymbols([]));
// []
console.log(Object.getOwnPropertySymbols({}));
// []
console.log(Object.getOwnPropertySymbols(Object.getPrototypeOf([])));
// [Symbol(Symbol.iterator), Symbol(Symbol.unscopables)]
console.log(Object.getOwnPropertySymbols(Object.getPrototypeOf('zmy')));
// [Symbol(Symbol.iterator)]
console.log(Object.getOwnPropertySymbols(Object.getPrototypeOf(() => {})));
// [Symbol(Symbol.hasInstance)]
```

当然，有了这个属性之后你可以干些坏事了 🤫

```js
console.log(Object.prototype.toString.call(/1/));
// [object RegExp]
console.log(Object.prototype.toString.call([]));
// [object Array]

Array.prototype[Symbol.toStringTag] = 'RegExp';
// 这里虽然参数是数组，但由于你改了 toStringTag，所以“变成”了正则类型
console.log(Object.prototype.toString.call([]));
// [object RegExp]
```

### Symbol.hasInstance

它可以定义`instanceof`操作符的行为，是一个函数，有一个参数，是 `instanceof`操作符前的变量

```js
// 因为 instanceof 操作符后面跟着是构造函数，所以要定义成静态属性
// 也就是要定义在构造函数 MyArray[Symbol.hasInstance] 上
// 而不是原型 MyArray.prototype[Symbol.hasInstance] 上
class MyArray {
    static [Symbol.hasInstance](instance) {
        return Array.isArray(instance);
    }
}
console.log([] instanceof MyArray);
// true
console.log({} instanceof MyArray);
// false
```

还可以直接调用它来实现 `instanceof` 操作符的行为

```js
class Animal {
    constructor() {}
}
const cat = new Animal();
console.log(Animal[Symbol.hasInstance](cat));
// true
```

所以你不用认为那些关键字是啥很厉害的东西，就像这里只是一个函数调用而已

### Symbol.species

这是一个比较有趣的属性，你如果定义了一个自定义数组类，那么他使用 filter 等方法虽说返回的是新对象，但类型是不变的，如果你想要改变类型，就得使用 Symbol.species

```js
class MyArray extends Array {}

const a1 = new MyArray(1, 2, 3, 4, 5);
const a2 = a1.filter(x => x % 2);
console.log(a1 instanceof MyArray);
// true
console.log(a2 instanceof MyArray);
// true
```

就像这里，a2 虽然是 filter 出来的新对象，但他仍然是 MyArray 的实例

```js
class MyArray extends Array {
    static get [Symbol.species]() {
        return Array;
    }
}
const a1 = new MyArray(1, 2, 3, 4, 5);
const a2 = a1.filter(x => x % 2);

console.log(a2 instanceof MyArray);
// false
console.log(a2 instanceof Array);
// true
```

如果把 Symbol.species 属性设置成 Array 的话，那么即使 a1 是 MyArray 的实例，那么他 filter 出来的 a2 也不是 MyArray 的实例，而是 Symbol.species 属性值的实例

### Symbol.iterator

如果想让你的对象能被 for of 遍历，那么就得使用 Symbol.iterator 属性，他是一个 Generator 函数

```js
// 字符串和数组上都有 Symbol.iterator 属性，所以他们能被 for of 遍历
Object.getOwnPropertySymbols(Object.getPrototypeOf([]));
// [Symbol(Symbol.iterator), Symbol(Symbol.unscopables)]
Object.getOwnPropertySymbols(Object.getPrototypeOf('str'));
// [Symbol(Symbol.iterator)]

const iterable = {};
iterable[Symbol.iterator] = function* () {
    yield 'zmy';
    yield 'learn';
    yield 'symbol';
};

for (const i of iterable) {
    console.log(i);
}
// zmy
// learn
// symbol

// 还可以使用 spread 运算符
const list = [...iterable];
console.log(list);
// ['zmy', 'learn', 'symbol']
```

字符串与数组自带 Symbol.iterator 属性，可以调用生成迭代器

```js
const s = 'zmy';
const g = s[Symbol.iterator]();
console.log(g.next());
console.log(g.next());
console.log(g.next());
console.log(g.next());
// {value: 'z', done: false}
// {value: 'm', done: false}
// {value: 'y', done: false}
// {value: undefined, done: true}
```

这时如果 next 函数返回 Promise 怎么办呢？就需要使用 asyncIterator 和 for await of 了

对于迭代器与生成器推荐看这篇了解一下：[ES9 中的异步迭代器（Async iterator）和异步生成器（Async generator）](https://juejin.cn/post/6844903735534026765)

### Symbol.asyncIterator

```js
async function* asyncGenerator() {
    yield await Promise.resolve(1);
    yield await Promise.resolve(2);
    yield await Promise.resolve(3);
}

const asyncIterator = asyncGenerator();
console.log(typeof asyncIterator[Symbol.asyncIterator]);
// 'function'

async function run() {
    for await (const value of asyncIterator) {
        console.log(value);
    }
}
run();
// 1
// 2
// 3

// for...await...of可以遍历具有Symbol.asyncIterator方法的数据结构
// 并且会等待上一个成员状态改变后再继续执行
```

### Symbol.unscopables

值是对象，属性名加布尔值，用 with 的时候，如果为 ture，就不能取值

```js
const object1 = {
    property1: 42,
};

object1[Symbol.unscopables] = {
    property1: true,
};

with (object1) {
    console.log(property1);
    // expected output: Error: property1 is not defined
}
```

### Symbol.isConcatSpreadable

内部 @@isConcatSpreadable 属性，是布尔值，代表 Array.prototype.concat() 调用时是否拍平数组

```js
const alpha = ['a', 'b', 'c'];
const numeric = [1, 2, 3];
let alphaNumeric = alpha.concat(numeric);

console.log(alphaNumeric);
// expected output: Array ["a", "b", "c", 1, 2, 3]

numeric[Symbol.isConcatSpreadable] = false;
alphaNumeric = alpha.concat(numeric);

console.log(alphaNumeric);
// expected output: Array ["a", "b", "c", Array [1, 2, 3]]
```

### Symbol.match 等 string 相关 Symbol

Symbol.match、Symbol.matchAll、Symbol.replace、Symbol.search、Symbol.split，和上文类似，都是在对应 String.prototype 的函数一些特殊处理，有需要再查阅即可

## 实现私有属性

Symbol 的另一个作用实现私有属性，可参考[私有属性的 6 种实现方式，你用过几种？](https://mp.weixin.qq.com/s/SusZu6rdVijZ-6seg9oa0Q)

参考：

1. mdn symbol：https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
