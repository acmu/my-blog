---
title: JavaScript 对象解读
date: 2022-08-03 22:57:58
tags: JavaScript
---

对象一直都是 JavaScript 里重要的概念，如函数、正则等全部都是对象，本文将带大家深入的了解对象相关知识。

## 数据属性、访问器属性

对象是 JavaScript 中的一种数据类型，对象由属性和属性值组成（通常也叫 key 和 value），属性的数据类型只能是字符串或 Symbol，每个属性都有 4 个描述符，根据描述符的不同，属性又分为两种类型，数据属性和访问器属性。

数据属性的属性描述符：

1. [[Configurable]]：属性是否可以通过 delete 删除，是否可以修改它的描述符，以及是否可以在数据属性与访问器属性之间切换。
2. [[Enumerable]]：是否 for in 循环、Object.keys() 可访问。
3. [[Value]]：属性值
4. [[Writable]]：是否可以修改 [[Value]]

访问器属性的属性描述符：

1. [[Configurable]]：同上
2. [[Enumerable]]：同上
3. [[Get]]：函数，在读取属性时调用
4. [[Set]]：函数，在写入属性时调用

> 疑问：[[Get]] 这种双中括号代表什么？
>
> 答：[[Get]] 这种双中括号的表示一般在[规范文档](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-topropertydescriptor)中，代表是引擎的内部属性，除非语法上支持，否则 JS 代码是不能访问引擎的内部属性的。类似的还有`Date.prototype[@@toPrimitive]` 这种 @@ 表示的，代表 Symbol.toPrimitive。

如果你用过 vue 2，肯定 console.log 过 vue 的响应式变量，它就是通过访问器属性实现的。访问器属性的属性值在控制台出现后有 3 个点，点击 3 个点会调用[[Get]]函数。

下面我们实现一个访问器属性：

```js
const obj = {};
Object.defineProperty(obj, 'a', {
    configurable: true,
    enumerable: true,
    set: undefined,
    get() {
        console.log('call');
        return 123;
    },
});
console.log(obj);
```

![image-2022073141522184 PM](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2022-07/31_16:15_GxBhSe.png)

点击 3 个点之后会调用 get 函数，并获得返回值

![image-2022073141636960 PM](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2022-07/31_16:16_noD8TB.png)

从下面输出的 call 可以看出调用了 get 函数

`Object.defineProperty` 可以给对象的属性配置描述符，它同时包含了新建和修改的功能，如果对象没有此属性就会新建，如果对象以及有了属性，那么再定义就会修改。

其实我们平常用字面量创建的属性都是数据属性：

```js
// 以下两种表示，是一样的
const obj = {
    a: 1,
};

const obj2 = {};
Object.defineProperty(obj2, 'a', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: 1,
});

// 可用 getOwnPropertyDescriptor 获取到属性的描述符
console.log(Object.getOwnPropertyDescriptor(obj, 'a'));
```

## 调用的 api，也只是属性

在编写代码的过程中，免不了要调用数组、字符串等等的 api，他们不是什么神奇的东西，也只是普通属性而已。以常用的`Array.prototype.map()`api 为例：

```js
const arr = [];
console.log(Object.getOwnPropertyDescriptor(arr, 'map'));
// undefined
```

咦，你在骗我呀，我获取到的怎么是 undefined 呢？别急，因为 getOwnPropertyDescriptor 只能获取到当前对象的属性，但 map 属性是在当前对象的原型上的（因为是 Array.prototype 上的属性），所以应该去原型上获取：

```js
const arr = [];
console.log(Object.getOwnPropertyDescriptor(Object.getPrototypeOf(arr), 'map'));
// {writable: true, enumerable: false, configurable: true, value: ƒ}
```

可以看到 map api 是数据属性，并且不可枚举，但是可配置，我们可以试一下把它配置成可枚举的，这样 for in 或 Object.keys 就能访问到了：

```js
Object.defineProperty(Object.getPrototypeOf(arr), 'map', {
    enumerable: true,
});
for (var i in arr) {
    console.log(i);
}
// map
```

但 length 属性是不可配置的，即 configurable 为 false。

所以我们可以通过 JS 的[内置对象](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)拿到所有规定的全局变量，之后再寻找内置对象的原型并输出他的属性，就可以通过代码获取到 JS 所有的 api。

## 创建对象

### 字面量

使用字面量直接定义属性和方法

```js
let person = {
    name: 'ming',
    age: 25,
    introduce() {
        console.log('I am ' + this.name);
    },
};

person.introduce();
```

### 工厂模式

当你要定义多个对象的时候，直接复制多个还是有些麻烦，所以可以写一个工厂函数

```js
function createPerson(name, age) {
    return {
        name,
        age,
        introduce() {
            console.log('I am ' + this.name);
        },
    };
}

const p1 = createPerson('ming', 25);
const p2 = createPerson('foo', 20);

p2.introduce();
```

此模式的问题是无法使用 instanceof 等判断对象的类型

### 构造函数

构造函数就是一个普通函数，只不过一般约定构造函数的首字母是大写的，以及它只会和 new 搭配使用

```js
function Person(name, age) {
    this.name = name;
    this.age = age;
    this.introduce = function () {
        console.log('I am ' + this.name);
    };
}
const p1 = new Person('ming', 25);
p1.introduce();
```

它模仿了 Java 的写法，这里和 createPerson 的区别是：

1. 没有 return。
2. 属性和方法直接赋值给了 this。
3. 没有显式地创建对象。

如果想要继续深入继承部分的内容，那么这里就要深入理解下：

1. 这应该是个很明显的约定，构造函数是不应该 return 的，如果 return 了那不就回到了工厂模式嘛

2. this 是很微妙的存在，如果没有 this 会怎样？

    ```js
    let person = {
        name: 'ming',
        age: 25,
        introduce() {
            // 如果没有 this，这里只能使用 person
            console.log('I am ' + person.name);
        },
    };

    let animal = {
        name: 'bar',
        introduce() {
            // 这里不能复用，只能是一个新的函数
            console.log('I am ' + animal.name);
        },
    };
    ```

3. 没有显式地创建对象，那对象哪里来的？是 new “惹的祸”，new 干了什么？想要知道这个，你就得先了解原型链

#### **原型链机制**

如下代码输出什么？

```js
const obj = {
    __proto__: {
        x: 1,
    },
};
console.log(obj.x);
```

输出是 1，没有在对象 obj 上定义 x 属性，但为什么能获取到呢？因为**对象在获取属性时，如果当前的对象没有，那么就会向当前对象的原型对象去寻找，如果原型对象还没有就继续向上寻找，直到没有原型对象为止。**这就是原型链机制，根据原型为链条寻找属性的机制。代码中的 `__proto__` 属性就是这里说的原型。

#### `__proto__` vs `[[Prototype]]` vs `prototype`

你肯定见过这三兄弟，他们都和原型有关，他们的区别一定要搞清楚：

1.  `__proto__` 属性：每个对象都有此属性，代表原型，是非标准的历史遗留属性，虽然可用，但现在并不推荐使用。
2.  `[[Prototype]]` 内部属性：每个对象都有此属性，代表原型，是 ES 规范中的描述，**和 `__proto__` 属性完全一样**，更推荐现代语法使用，但内部属性是不能直接在 JavaScript 语言层面访问的，还好语言标准提供了 Object.getPrototypeOf() 和 Object.setPrototypeOf() 获取和设置原型。
3.  `prototype` 属性：每个函数都有 `prototype`属性，他只有在此函数作为构造函数时才有意义。不要忘记：函数也是对象，所以可以在对象上添加任意属性， `prototype` 属性就只是函数上的一个普通属性而已，只不过此属性在继承时有特殊的约定含义。

可通过控制台看到如下代码原型链图示：

```js
const foo = {
    x: 1,
};
const bar = {
    y: 2,
};
Object.setPrototypeOf(foo, bar);
console.log(bar, foo);
```

![image-2022080344043135 PM](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2022-08/03_16:40_t7FwLF.png)

把 foo 的原型指向了 bar，控制台中发现 foo 的原型多了一层。（注意：这里使用了 setPrototypeOf，仅用于演示，如果你看过 [setPrototypeOf 的 mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) 就能发现，它的性能并不好，推荐使用 Object.create() 代替）

#### 实现 new

知道了原型链机制，那么现在就可以分析 new 干了什么

1. 创建一个新对象 foo
2. 将新对象 foo 的 [[Prototype]] 内部属性赋值为构造函数的 prototype 属性
3. 使用新对象 foo 的上下文执行构造函数（即构造函数中的 this 会指向新对象，并为这个新对象添加属性）
4. 如果构造函数返回非空对象，则返回构造函数返回的对象；否则，返回新对象 foo

构造函数的 prototype 属性就特殊在这里，新对象 foo 的原型会指向构造函数的 prototype 属性。prototype 属性值是一个对象，对象中有一个 constructor 属性，属性值是构造函数，这个 constructor 属性到底有什么用呢？🧐

我在看了半天 [mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor#browser_compatibility) 后得出结论：它没什么用 😅。它有一个比较常见的用法是用于判断对象的类型，但它很容易被赋值或删除，相比于 instanceof 和 Symbol.toStringTag 来说并不可靠，其实这两个也并非绝对可靠。（这里说的 [Symbol.toStringTag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag) 指 Object.prototype.toString()）

知道了原理，我们实现一个自己的 new：

```js
function myNew(fun, ...args) {
    const foo = Object.create(fun.prototype);
    const res = fun.apply(foo, args);
    if (typeof res === 'object' && res !== null) {
        return res;
    }
    return foo;
}
```

测试一下：

```js
function Person(name, age) {
    this.name = name;
    this.age = age;
    this.introduce = function () {
        console.log('I am ' + this.name);
    };
}
const p1 = new Person('ming', 25);
p1.introduce();
console.log(p1);

function myNew(fun, ...args) {
    const foo = Object.create(fun.prototype);
    const res = fun.apply(foo, args);
    if (typeof res === 'object' && res !== null) {
        return res;
    }
    return foo;
}
const p2 = myNew(Person, 'ming2', 25);
p2.introduce();
console.log(p2);
```

new 的实现很重要，一定要理解好。

### 原型模式

构造函数模式创建对象的问题是函数难以复用，使用原型模式创建对象就可以解决这个问题：

```js
function Person(name, age) {
    this.name = name;
    this.age = age;
}
Person.prototype.introduce = function () {
    console.log('I am ' + this.name);
};

const p1 = new Person('ming', 25);
const p3 = new Person('ming3', 25);

console.log(p1.introduce === p3.introduce);
```

这样的代码你是不是在哪里见过？（Vue 2 的插件就是这样加上的）

当然我们写的对象字面量、数组字面量实例都是用这种方法创建出来的，不信你可以试试如下代码：

```js
Object.prototype.test = 'test';

// {} 字面量就相当于 new Object()
console.log({}.test);
// test

Array.prototype.testFn = function () {
    console.log('nb');
    console.log(this);
};

[1, 5].testFn();
// nb
// [1, 5]
```
