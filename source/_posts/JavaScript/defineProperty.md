---
title: defineProperty 详细解读
date: 2022-07-10
tags: JavaScript
---



对象在 JS 中很重要，如 Number Function 等等都是以对象为基础扩展的，[defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 作为定义对象属性的 api，同样不可小觑。本文会详细解读 Object.defineProperty()，带你看透对象的本质。

![image-2022071191209134 PM](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2022-07/11_21:12_gQBBo9.png)

## 定义

defineProperty 是 Object 的静态方法，可以在对象上新增一个属性，或者更改对象上已有的属性：

```js
const obj = {};

Object.defineProperty(obj, 'foo', {
  value: 42,
  writable: false
});

obj.foo = 77;
// 严格模式下会报错

console.log(obj.foo);
// 非严格模式下输出 42
```

对象 obj 定义了一个属性 foo，这个属性不能更改，否则会报错（我们现在写的代码几乎都是在严格模式下的，所以本文不考虑非严格模式下的情况）

## 语法

```js
Object.defineProperty(obj, prop, descriptor)
```

obj：你要定义的对象

prop：你要定义的属性，可以是 symbol 类型

descriptor：对于属性的描述



这里最重要的就是 descriptor 了

## descriptor 解读

我们正常的创建、修改、删除和枚举属性是这样的：

```js
// 新增属性（定义对象时直接赋值，或者在定义对象后动态赋值）
const obj = { a: 1 };
console.log(obj);
obj.b = 2;
console.log(obj);

// 修改属性
obj.a = 3;
console.log(obj);

// 删除属性
delete obj.a;
console.log(obj);

// 枚举属性（四种方式：Object.keys、for in 操作、Object.assign、扩展操作符）
console.log(Object.keys(obj));
```

但你可能不希望属性被修改与删除，那就需要 defineProperty 出场了

![image-2022071182854317 PM](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2022-07/11_20:28_pyNAWY.png)

```js
const obj = { a: 1 };

Object.defineProperty(obj, 'e', {
  value: 'zmy',
});

// 查看属性，虽然控制台输出能看到 e，但 e 是浅色的
console.log(obj);
// 枚举属性 没有 e
console.log(Object.keys(obj));
// 修改属性，报错
obj.e = 'mq';
// 删除属性，报错
delete obj.e
```

这里，在 obj 上新定义了 e 属性，但它不能修改，不能删除也不能枚举。下面我们看看为什么会这样。

### 数据属性和访问器属性

在继续之前你需要知道：根据描述符的种类把属性分为两种，数据（data）属性和访问器（accessor）属性。

数据属性描述符：

1. value：属性的值，默认 undefined

2. writable：属性是否可改变，默认 false

访问器属性：

1. get：函数，返回值是属性的值，可用this

2. set：函数，有一个参数，赋值时被调用，可用this

还有两个描述符，是数据属性和访问器属性都有的：

1. configurable：如果是false，那么：这个属性不能在数据属性和访问器属性之间切换了、属性不能被删除、其他的属性描述符不能被更改了（但当writable描述符是true时，属性的值可以改，writable描述符也可以改为false），默认false
2. enumerable：是否可枚举（四种方式：Object.keys、for in 操作、Object.assign、扩展操作符），默认false

描述符只能是 value 和 writable 组合或 get 和 set 组合，不能混用（会报错）

```js
const zmy = {};

Object.defineProperty(zmy, 'a', {
  value: 1,
  writable: true,
});

Object.defineProperty(zmy, 'b', {
  get() {
    return 2;
  },
});

Object.defineProperty(zmy, 'c', {
  get() {
    return 2;
  },
  writable: true,
});
// Uncaught TypeError: Invalid property descriptor. Cannot both specify accessors and a value or writable attribute,
```

但属性可以在数据属性和访问器属性之间来回切换：

```js
const zmy = {};

Object.defineProperty(zmy, 'a', {
  value: 1,
  configurable: true,
});
console.log(zmy.a);
// 1

Object.defineProperty(zmy, 'a', {
  get() {
    return 2;
  },
});
console.log(zmy.a);
// 2
console.log(Object.getOwnPropertyDescriptor(zmy, 'a'))
// {set: undefined, enumerable: false, configurable: true, get: ƒ}

Object.defineProperty(zmy, 'a', {
  value: 3,
});
console.log(zmy.a);
// 3
```

如上 a 属性从数据属性变为访问器属性又变为数据属性，这里注意：我在新增a属性时，configurable设置为true（因为如果是默认的false值，就不能在数据属性和访问器属性之间互相切换了），但第二次修改 a 属性时，并没有特殊设置configurable 的值，它依旧是 true，因为使用了新建时已有的 configurable 的值

### 定义 descriptor 时的注意点

定义 descriptor 时最好是给出所有配置，因为这些配置项也可以是继承而来，如下：

```js
Object.prototype.writable = true;
const zmy = {};

const descriptor = { value: 8 };
Object.defineProperty(zmy, 'a', { value: 8 });
console.log(zmy.a);
// 8
zmy.a = 7
console.log(zmy.a);
// 7
console.log(descriptor);
```

这里由于 defineProperty 的 descriptor 中并没有显示指出 writable，所以它应该是默认值 false 的，故下面的 `zmy.a = 7` 应该报错，但事实却没有，因为我们在第一行改了`Object`的原型，导致所有对象都可以找到`writable`这个属性，所以在defineProperty时就被使用了，这里的 `writable` 实际为 `true` 而不是默认值 `false`（把第一行修改`Object`原型代码注释，就会正常报错）

当然解决这个问题还有其他方法：

1. 如果你的环境下`Object.freeze`可用，那么就 freeze 住`Object`实例的原型
2. descriptor对象使用`Object.create(null)`获得，因为这样获得的对象不继承于Object

### configurable 为 false 的注意点

configurable 为 false 的时候代表不可配置的：

```js
const zmy = {};
Object.defineProperty(zmy, 'q', {
  value: 5,
  configurable: false,
});

zmy.q = 6
// Uncaught TypeError: Cannot assign to read only property 'q' of object

Object.defineProperty(zmy, 'q', {
  value: 5,
  writable: true,
});
//  Uncaught TypeError: Cannot redefine property: q
```

如上，改值和改描述符都报错，但有个特殊情况：

```js
const zmy = {};
Object.defineProperty(zmy, 'q', {
  value: 5,
  writable: true,
  configurable: false,
});

// 可以更改值
zmy.q = 6;
console.log(zmy.q);
// 6

// 可以正常的把 writable 由 true 变为 false
Object.defineProperty(zmy, 'q', {
  value: 5,
  writable: false,
});

// 但是把 writable 由 false 变为 true 是会报错的
Object.defineProperty(zmy, 'q', {
  value: 5,
  writable: true,
});
// Uncaught TypeError: Cannot redefine property: q
```

当 configurable 为 false，但是 writable 为 true 时，可以改变属性的 value，可以把 writable 由 true 变为 false，但是把 writable 由 false 变为 true 是会报错的。

（为啥要搞这么麻烦的事呢，我猜一个原因是`Object.getOwnPropertyDescriptors([])` ，这里 length 属性 configurable就是false，但 writable 为 true，又因为我们是能手动改数组的长度的，所以很符合这种情况）

如果定义的值和原值一样，不会报错：

```js
const zmy = {};
Object.defineProperty(zmy, 'q', {
  value: 5,
  configurable: false,
});

// 没有报错，但是如果改成 5 以外的其他值，是都会报错的
Object.defineProperty(zmy, 'q', {
  value: 5,
});
```

### 属性值为 undefined 

把属性值变成 undefined 可以删除值 （configurable 等如果是 undefined 就代表是 false）

```js
const zmy = {};
let a = 1;
Object.defineProperty(zmy, 'q', {
  set(val) {
    a = val;
  },
  get() {
    return a;
  },
  configurable: true
});

zmy.q = 23
// 可以正常赋值

Object.defineProperty(zmy, 'q', {
  set: undefined
})

zmy.q = 45
// 报错，因为没有 set
```

### enumerable 举例

1. Object.assign 和 扩展操作符：只有enumerable为true时可见，包括 symbol 类型
2. for in 操作  和 Object.key：只有enumerable为true时可见，不包括 symbol 类型

```js
const o = {};
Object.defineProperty(o, 'a', {
  value: 1,
  enumerable: true
});
Object.defineProperty(o, 'b', {
  value: 2,
  enumerable: false
});
Object.defineProperty(o, 'c', {
  value: 3
}); // enumerable 默认为 false
o.d = 4; // enumerable 默认为 true
Object.defineProperty(o, Symbol.for('e'), {
  value: 5,
  enumerable: true
});
Object.defineProperty(o, Symbol.for('f'), {
  value: 6,
  enumerable: false
});

for (const i in o) {
  console.log(i);
}
// logs 'a' and 'd' (in undefined order)

Object.keys(o); // ['a', 'd']

o.propertyIsEnumerable('a'); // true
o.propertyIsEnumerable('b'); // false
o.propertyIsEnumerable('c'); // false
o.propertyIsEnumerable('d'); // true
o.propertyIsEnumerable(Symbol.for('e')); // true
o.propertyIsEnumerable(Symbol.for('f')); // false

const p = { ...o }
// 或者使用 assign，和 扩展操作符一样的
// const p = {}
// Object.assign(p, o)
p.a // 1
p.b // undefined
p.c // undefined
p.d // 4
p[Symbol.for('e')] // 5
p[Symbol.for('f')] // undefined
```

## 总结

本文讲解了defineProperty的定义与语法，并对descriptor的配置进行了代码实践。

我认为 defineProperty 是对象中非常重要的 api，你懂了这个再看其他的api仿佛打通了任督二脉，也就不会那么难了

![image-2022071183144923 PM](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2022-07/11_20:31_8IXXKP.png)

如：

1. `Object.defineProperties()`就是同时定义多个属性
2. `Object.getOwnPropertyDescriptor()`就是获取到对象属性的描述符`Object.getOwnPropertyDescriptors()`也同理啦
3. `Object.getOwnPropertyNames()`就是获取到所有的属性，包括`enumerable`为false的属性也能获取到，但不能获取到symbol类型的属性，那我想要获取到所有symbol类型的属性（包括`enumerable`为false的）该怎么办呢？用`Object.getOwnPropertySymbols()`即可
4. `Object.prototype.propertyIsEnumerable()`就不用我说了吧

还有很多，剩下的你可以自己去探索一下啦

