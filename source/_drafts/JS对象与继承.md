---
title: JavaScript的对象与继承
date: 2022-04-14 11:48:06
tags: 周刊
---



7.28 晚上分享



setPrototypeof 为什么不推荐使用？给个例子把，自己写下



分享较少但重要的知识，要更有趣一些，更吸引人一些



继承代码由 babel 转换的

```js
class Foo {
  a() {
    console.log('foo');
  }
}

class Bar extends Foo {
  a() {
    console.log('bar');
  }
}

const bar = new Bar();
bar.a();

```

编译后代码

```js
"use strict";

function _typeof(obj) {
  "@babel/helpers - typeof";
  return (
    (_typeof =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (obj) {
            return typeof obj;
          }
        : function (obj) {
            return obj &&
              "function" == typeof Symbol &&
              obj.constructor === Symbol &&
              obj !== Symbol.prototype
              ? "symbol"
              : typeof obj;
          }),
    _typeof(obj)
  );
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true }
  });
  Object.defineProperty(subClass, "prototype", { writable: false });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf
    ? Object.setPrototypeOf.bind()
    : function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };
  return _setPrototypeOf(o, p);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError(
      "Derived constructors may only return object or undefined"
    );
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(
      Reflect.construct(Boolean, [], function () {})
    );
    return true;
  } catch (e) {
    return false;
  }
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf.bind()
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", { writable: false });
  return Constructor;
}

var Foo = /*#__PURE__*/ (function () {
  function Foo() {
    _classCallCheck(this, Foo);
  }

  _createClass(Foo, [
    {
      key: "a",
      value: function a() {
        console.log("foo");
      }
    }
  ]);

  return Foo;
})();

var Bar = /*#__PURE__*/ (function (_Foo) {
  _inherits(Bar, _Foo);

  var _super = _createSuper(Bar);

  function Bar() {
    _classCallCheck(this, Bar);

    return _super.apply(this, arguments);
  }

  _createClass(Bar, [
    {
      key: "a",
      value: function a() {
        console.log("bar");
      }
    }
  ]);

  return Bar;
})(Foo);

var bar = new Bar();
bar.a();

```

步骤解析（忽略函数定义）：

1.  **执行 Foo 的 iife，执行 _createClass 函数**
2. 分别定义原型属性和静态属性，进入 _defineProperties 函数
3. 计算 descriptor 的值（enumerable、configurable等），给Foo.prototype赋值属性
4. 把 Foo.prototype 的 wrtiable 设置为 false
5. 最终 Foo 设置完成
6.  **执行 Bar 的 iife，执行_inherits函数**
7. 定义 subClass.prototype 为Object.create(superClass.prototype) 并且加上 constructor 属性
8. 把 Bar.prototype 的 wrtiable 设置为 false
9. **调用 _setPrototypeOf**
10. 根据环境的不同 设置原型链（直接Object.setPrototypeOf，或 使用`o.__proto__` 属性）  Bar 的原型 指向 Foo
11. 获取 _super 调用 _createSuper
    1. 调用 _isNativeReflectConstruct
       1. 判断是否有原生的 Reflect Proxy
    2. hasNativeReflectConstruct 为 true
    3. 返回了一个函数，用于赋值给 super
12. 使用 _createClass 创建 Bar 的属性
13. new Bar
    1. 会进入到 Bar 函数的定义中执行 _classCallCheck （一种检测）
    2. 执行到 _super.apply 中
       1. 调用 _getPrototypeOf 获取 Bar 的 原型 Foo
       2. result = Reflect.construct
          1. 又到了 Foo 的构造函数中



为什么控制台输出的有些是浅色的？

![image-20220714114140252 AM](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2022-07/14_11:41_C14gSO.png)



以问题为导向，文章通过解决问题来完成



用代码本身的功能去探索代码的实现



上传文件时，会用到 File 对象吧，File 也是继承与 Blob 的



1. `'Mozilla'.substring(1, 3)` 如我们可以调用字符串的方法，但是你要知道字符串原始类型是不能添加方法的

```js
const a = 'foo'
a.bar = 'bar'
console.log(a.bar)
// undefined
```

但是我们却能调用方法，这个方法是哪里来的呢？

是用 String 包装的，变成了对象类型

```js
const a = new String('foo')
a.bar = 'bar'
console.log(a.bar)
// bar
console.log(typeof a)
// object
```

那 string 对象类型就能调用 substring 方法了吗？我们可以使用 `Object.getOwnPropertyNames` 查看所有属性（包括非枚举的）

```js
const a = new String('foo');
a.bar = 'bar';
console.log(Object.getOwnPropertyNames(a));
// ['0', '1', '2', 'length', 'bar']
```

也仍然没有 substring 方法（其实它是在下面讲的原型链上）

```js
const a = new String('foo');
a.bar = 'bar';
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(a)));
// (50) ['length', 'constructor', 'anchor', 'at', 'big', 'blink', 'bold', ... ]
```





就算是用了es6的 class 你也应该理解 es5 中实现继承的方式（因为这是他的实现原理），如：

```js
class Person {
  constructor() {
    // 添加到 this 的所有内容都会存在于不同的实例上
    this.locate = () => console.log('instance');
  }

  // 在类块中定义的所有内容都会定义在类的原型上]
  locate() {
    console.log('prototype');
  }
}

let p = new Person();
p.locate();
Person.prototype.locate();
```

类方法等同于对象属性，因此可以使用字符串、符号或计算的值作为键（计算的值都行），也支持 set 和 get （这不就是对象嘛）



注意 类定义中之所以没有显式支持添加数据成员，是因为在共享目标(原型和类)上添 加可变(可修改)数据成员是一种反模式。一般来说，对象实例应该独自拥有通过 this 引用的数据。

反模式（anti-pattern）指的则是在实践中明显出现，但低效或有待优化的设计模式，是用来解决问题的带有共同性的不良方法。



类定义语法支持在原型和类本身上定义生成器方法



派生类的方法可以通过 super 关键字引用它们的原型。这个关键字只能在派生类中使用，而且仅 限于类构造函数、实例方法和静态方法内部。

不要在调用super()之前引用this，否则会抛出ReferenceError

super(); // 相当于super.constructor()



调用 super()会调用父类构造函数，并将返回的实例赋值给 this。



如果没有定义类构造函数，在实例化派生类时会调用 super()，而且会传入所有传给派生类的参数。



new.target 可实现抽象基类



有些内置类型的方法会返回新实例。默认情况下，返回实例的类型与原始实例的类型是一致的:

```js
class SuperArray extends Array {}
let a1 = new SuperArray(1, 2, 3, 4, 5);
let a2 = a1.filter(x => !!(x % 2));
console.log(a1); // [1, 2, 3, 4, 5]
console.log(a2); // [1, 3, 5]
console.log(a1 instanceof SuperArray); // true
console.log(a2 instanceof SuperArray); // true

```



如果想覆盖这个默认行为，则可以覆盖 Symbol.species 访问器，这个访问器决定在创建返回的 实例时使用的类:

```js
class SuperArray extends Array {
  static get [Symbol.species]() {
    return Array;
  }
}
let a1 = new SuperArray(1, 2, 3, 4, 5);
let a2 = a1.filter(x => !!(x % 2));
console.log(a1); // [1, 2, 3, 4, 5]
console.log(a2); // [1, 3, 5]
console.log(a1 instanceof SuperArray); // true
console.log(a2 instanceof SuperArray); // false

```







把不同类的行为集中到一个类是一种常见的 JavaScript 模式。虽然 ES6 没有显式支持多类继承，但 通过现有特性可以轻松地模拟这种行为。



注意 很多JavaScript框架(特别是React)已经抛弃混入模式，转向了组合模式(把方法 提取到独立的类和辅助对象中，然后把它们组合起来，但不使用继承)。这反映了那个众 所周知的软件设计原则:“组合胜过继承(composition over inheritance)。”这个设计原则被 很多人遵循，在代码设计中能提供极大的灵活性。





https://km.sankuai.com/page/472264435

JavaScript对象：面向对象还是基于对象？

红宝书 4 的 类模块

babel ts 类编译后的代码



Object.prototype.toString 要这样调用，但 Object.keys 直接这样调用

查看 mdn api 的时候

![image-20220708120039363 PM](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2022-07/08_12:00_KIzd2h.png)



基于原型继承，什么有原型？js的基本类型有什么？对了其中有 Object，是Object就有原型

怎么看原型？通过 `__proto__`或 getPrototypeOf 能获取到原型

怎么设置原型？通过 `__proto__`或 setPrototypeOf（慎用动态更改原型的方法，有性能问题） 或 Object.create（第二个参数是 defineProperty 的描述符）

基于原型的继承，概念十分简单，但是没什么人用。历史原因，js要模仿java，所以引入了new的机制，把继承变复杂了

new 做了什么？



类的作用：你在控制台输出一个对象，为什么这样展示呢？

![image-2022070683156867 PM](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2022-07/06_20:31_tTPhgR.png)



面向对象是一种流行的编程思想（思考方式），它可以帮助开发者把复杂的逻辑简单清晰的表达出来，抽象出类似的概念，减少重复代码。面向对象的三个基本特征是：封装、继承、多态。

很多语言原生支持面向对象，如 Java、C++ 等，JavaScript 也是支持面向对象的，但它的实现方式有些不同，导致写起来需要技巧，也便成为了面试常考的题目，本文希望能简单清晰地讲明白JavaScript 中的面向对象，让你在工作或面试中不再迷惑。

干说理论知识是有些难懂的，我们以简单的 Java 代码为例，看下这些特征是如何体现在代码上的，之后再用 JavaScript 代码模拟 Java 代码实现面向对象。

## Java 面向对象

### 继承

要求：在代码中描述2名教师和5名学生。教师有姓名属性，吃饭、教学动作，学生有姓名属性，吃饭、听课动作。

如果没有继承，那你该如何实现？

```
教师1姓名 = 't1'
教师1吃饭 = () => {
	log('教师1吃饭')
}
教师1教学 = () => {
	log('教师1教学')
}

教师2姓名 = 't2'
教师2吃饭 = () => {
	log('教师2吃饭')
}
教师2教学 = () => {
	log('教师2教学')
}

学生1姓名 = 't1'
学生1吃饭 = () => {
	log('学生1吃饭')
}
学生1听课 = () => {
	log('学生1听课')
}

...

// 高端的程序员往往采用最朴素的编程方式 😂
```

这样在编写代码与维护上显然是噩梦，这时就可以采用继承的思想抽象出人的类，教师与学生都继承自人，人有姓名，也可以吃饭：

Main.java

```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
      Teacher t1 = new Teacher("教师1");
      t1.eat();
      t1.teach();
      Student s1 = new Student("学生1");
      s1.eat();
      s1.listen();
    }
}

class Person {
  public String name;
  public Person(String name) {
    this.name = name;
  }
  public void eat() {
    System.out.println(name+"吃饭");
  }
}

class Teacher extends Person {
  public Teacher(String name){
    super(name);
  }
  public void teach() {
    System.out.println(name+"教学");
  }
}

class Student extends Person {
  public Student(String name) {
    super(name);
  }
  public void listen() {
    System.out.println(name+"听课");
  }
}

// 教师1吃饭
// 教师1教学
// 学生1吃饭
// 学生1听课
```

代码可在 [onecompiler](https://onecompiler.com/) 上在线编译，通过把重复的属性与方法提取出来，使得代码更清晰简单了。

### 封装

封装可以隐藏信息与实现细节、减少耦合：

Main.java

```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
      Person t1 = new Person();
      t1.setName("人类1");
      System.out.println(t1.getName());
    }
}

class Person {
  private String name;
  public void setName(String name) {
    this.name = name;
  }
  public String getName() {
    return name;
  }
}

// 人类1
```

本例中把 name 封装在 Person 类中，除非提供 setName 与 getName，否者不能获取 name 属性。

### 多态

多态是同一个行为具有多个不同表现形式的能力，如你都是执行打印行为，当在彩色打印机上时，输出就是彩色的，当在黑白打印机时，输出就是黑白的。

Main.java

```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
      Person g = new Girl();
      g.eat();
    }
}

class Person {
  public void eat() {
    System.out.println("正常吃饭");
  }
}

class Girl extends Person {
  public void eat() {
    System.out.println("吃轻食，减肥");
  }
}

// 吃轻食，减肥
```

虽然 g 的类型是 Person，但调用 eat 方法还是 Girl 的 eat 方法。这种方式也叫重写，还有另一种东西叫重载，注意不要把这两个搞混了，重写是子类继承父类，并且子类重新编写父类的同名方法，重载不需要继承，只需要一个父类即可实现，重载是父类有多个同名方法，但是这些同名方法的参数类型或参数个数不同。

## JavaScript 面向对象

你不要觉得 JavaScript 面向对象很少被使用，这是错误的，如：`[1,2].forEach`、`Number.MAX_VALUE`、Vue 插件等都使用了面向对象原理。

这样还可以把同类型的方法聚集到一起，分类管理更方便，比如：`(1).toFixed(2)` ，1是 number 的实例，toFixed 是 number 的方法，`Number.isNaN` 是静态方法。

### 继承

JavaScript 是基于原型链继承的，就是每个对象都有一个属性，这个属性指向他的原型链对象，如果在当前对象上找不到某个方法或属性，那么就会去它的原型链上继续寻找，直到原型链为 null 时结束寻找，如果没找到就抛出错误。那这个原型链属性怎么获取呢？通过`__proto__`获取，每一个对象都有`__proto__`，我们知道在 JavaScript 中，数组、函数、正则都是对象，通过如下代码可知，他们都继承于 Object：

```js
([]).__proto__.__proto__ === ({}).__proto__
// true
(f => f).__proto__.__proto__ === ({}).__proto__
// true
(/MingYuan/).__proto__.__proto__ === ({}).__proto__
// true
```

数组的原型的原型和 Object 的原型相等，那么可得到：数组的原型是 Object，即数组继承于Object。

咦，那 JavaScript 实现继承岂不是太简单了，只要把 `__proto__` 赋值为要继承的对象不就好了吗？理论上确实是这么简单，但实际上，只会在测试代码时使用`__proto__`，并不推荐在生产环境这样使用，有两点原因：

1. `__proto__` 会产生性能问题。
2. `__proto__` 并不是 ES 标准定义的属性，只不过很多浏览器厂商是这样实现的。

`__proto__` 属性标准应该是`[[Prototype]]`，`[[xxx]]`代表xxx是v8引擎的内部属性，浏览器控制台可以查看到引擎内部属性，但在代码中并不能获取与更改。

那如何标准的操作`[[Prototype]]`属性呢？使用`Object.getPrototypeOf`获取属性，使用`Object.setPrototypeOf`设置属性。那使用`setPrototypeOf`实现继承就行了呗？可以，但是不推荐，推荐的是使用`new`操作符实现继承（这是由于历史原因，JavaScript为了推广使用，需要模仿Java风格代码），在说`new`操作符之前，需要讲下`prototype`属性，注意这个和`[[Prototype]]`属性是两个不同的属性，不要搞混。每一个函数都有`prototype`属性（箭头函数没有），你如果只是正常的函数调用，`prototype`属性是啥用都没有的，但当你使用`new 函数` 的方式，这个函数和`prototype`属性就有了特殊意义，这个函数这里叫做`构造函数`，一般是首字母大写的驼峰命名，代表类名：

```js
// Person 类的构造函数
function Person(name) {
  // 类的属性
  this.name = name
}
// 类的方法
Person.prototype.eat = function () {
  console.log(this.name + ' eat')
}
// 实例化 p1
const p1 = new Person('MingYuan')
p1.eat()
console.log(p1)
```

构造函数内，可添加类的属性，`prototype`上可添加类的方法，这样我们就创建了一个 `Person` 类，使用`new`便可以实例化出`p1`对象，`p1`可调用`eat`方法。

那么`new`操作符究竟干了啥？

1. 新建一个对象
2. 把新对象的`[[Prototype]]`属性指向构造函数的`prototype`属性
3. 用新对象的上下文执行构造函数
4. 返回新对象

```js
function myNew(constructorFunction, ...args) {
  const res = {}
  Object.setPrototypeOf(res, constructorFunction.prototype)
  constructorFunction.apply(res, args)
  return res
}

const p2 = myNew(Person, 'MingYuan2')
p2.eat()
console.log(p2)
```

`myNew`生成的内容和`new`操作符完全一样：

![image-20220321160226310](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2022-03/21_16:02_dsVCXY.png)

有人实现`myNew`还会看构造函数的返回值，如果是对象还有特殊操作，可能规范中定义了这样的行为，但我个人认为这样做没有意义，为什么要在构造函数中返回一个对象呢？构造函数就不应该有返回值的呀。

以上我们声明了一个 Person 类并实例化了一个对象，接下来我们实现一下继承。

```js
function Person(name) {
  this.name = name
}
Person.prototype.eat = function () {
  console.log(this.name + '吃饭')
}

function Teacher(name) {
  this.name = name
}

// 这是 Teacher 的原型，他是 Person 的一个实例
const teacherPrototype = new Person('')
Teacher.prototype = teacherPrototype
// 定义 Teacher 的方法
Teacher.prototype.teach = function() {
  console.log(this.name + '教学')
}

const t1 = new Teacher('教师1')

console.log(t1)
t1.teach()
t1.eat()
```

输出如下：

![image-2022041392336714 AM](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2022-04/14_12:33_MuaEQ9.png)

可以正常使用继承的方法，这里我们使用了`new`操作符来完成`[[Prototype]]`属性的设置，其实还可以使用`Object.create`、`Object.setPrototypeOf`和`__proto__`来完成。

还有一些类相关的知识你也要了解：

1. `instanceof`就是一直在原型链上找，如果没有就返回false
2. 除了 null ，所有的对象都继承于 Object
3. `hasOwnProperty` 不会走原型链

### 封装

在类中，我们一般约定以下划线开头的变量就是私有变量，实例不可以访问这些私有变量，但这只是人为的约定，代码层面还是可以访问的，ECMAScript 规范也在推行语言层面的私有变量了，但还需要些时间，当下的JS中可以使用闭包实现私有变量，还可以使用`defineProperty`实现`getter`和`setter`。

### 多态

多态的实现有两种：子类覆盖父类方法、函数重载，JS 在继承中只要重新一个同名方法即可覆盖父类方法，函数重载的话需要我们手动去判断类型之后在调用对应类型的方法。

参考：

1. [Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
2. [菜鸟教程 Java 继承](https://www.runoob.com/java/java-inheritance.html)



JavaScript高级程序设计（第4版）-第8章 对象、类与面向对象编程



阅读笔记：

之前都是用 a=  new Object  a.x a.y a.foo 等方式来声明对象的，但后期都用对象字面量声明的

对象的属性类型分为2中，数据属性和访问器属性，数据属性包含4个特性：configurable、enumerable、writable、value。你直接字面量定义属性，除value外，他们的值默认都是 true，但你用Object.defineProperty 定义的话，他们的值如果不特殊指定，默认都是false。

还有一旦configurable设置为false，那么他就不能被再次设置了。

你可以用 Object.getOwnPropertyDescriptor 获取到这些值。

访问器属性的4个特性是：configurable、enumerable、get、set（没有writable和value了），get和set可以只定义一个，那么用另一种方式访问时就会报错。

在es5之前，使用`Object.prototype.__defineSetter__()`和`Object.prototype.__defineGetter__()`这两种非标准的api来实现访问器属性。

可使用`Object.defineProperties`定义多个属性，还可以用`Object.getOwnPropertyDescriptors`获取多个属性。

可使用`Object.assign`合并对象，它会改变目标对象，也有返回值，就是改变后的目标对象，它会先调用源对象的getter之后调用目标对象的setter赋值的。它在赋值中抛错时不会回滚以前的操作。

解构在内部使用函数ToObject()（不能在运行时环境中直接访问）把源数据结构转换为对象。这意味着在对象解构的上下文中，原始值会被当成对象。这也意味着（根据ToObject()的定义）, null和undefined不能被解构，否则会抛出错误。

不必非要在声明的时候才能解构，已定义的也可以结构：

```js
let a, b;
let obj = {
  a: 'dfs',
  b: 34,
};
// 一定要加括号，并且括号前面一定要有分号
({ a, b } = obj);
console.log(a, b);
```



8.2 创建对象

可以用 object 构造函数和对象字面量的方式创建对象，但对于生成多个类似的对象还是很麻烦，es6引入了类，但怎么看它都是es5.1的原型继承的语法糖，所以有必要看下原型继承才能更深刻的理解类。

8.2.2 工厂模式

```js
const createPerson = (name, age, job) => {
  return {
    name,
    age,
    job,
    sayName() {
      console.log(this.name);
    },
  };
};

let p1 = createPerson('zmy', 24, 'fe');
p1.sayName();
console.log(p1)

```

这种工厂模式虽然可以解决创建多个类似对象的问题，但没有解决对象标识问题（即新创建的对象是什么类型）。

8.2.2 构造函数模式

```js
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = function() {
    console.log(this.name);
  };
}

let p1 = new Person('zmy', 24, 'fe');
p1.sayName()
console.log(p1)
```

constructor 本来是用于标识对象类型的。不过，一般认为instanceof操作符是确定对象类型更可靠的方式。

构造函数与普通函数唯一的区别就是调用方式不同。除此之外，构造函数也是函数。并没有把某个函数定义为构造函数的特殊语法。任何函数只要使用new操作符调用就是构造函数，而不使用new操作符调用的函数就是普通函数。

这种方式定义每个实例都有自己的 sayName 函数，虽然他们的功能都一样，但他们仍然是2个函数的实例，在引用上不相等

```js
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = function() {
    console.log(this.name);
  };
}

let p1 = new Person('a',2,'b')
let p2 = new Person('c',2,'d')

console.log(p1.sayName === p2.sayName) // false
```

为了解决这个问题，可以把函数定义在外部：

```js
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = sayName;
}
function sayName() {
  console.log(this.name);
}

let p1 = new Person('a', 2, 'b');
let p2 = new Person('c', 2, 'd');

console.log(p1.sayName === p2.sayName); // true
```

但这样 sayName 就被定义在了全局作用域中，而且又只会被 Person 使用，污染了全局作用域。解决这个问题，就要通过原型模式。

```js
function Person() {}
Person.prototype.name = 'zz';
Person.prototype.sayName = function() {
  console.log(this.name);
};

let p1 = new Person();
let p2 = new Person();
console.log(p1.sayName === p2.sayName); // true
```

这里，所有属性和sayName()方法都直接添加到了Person的prototype属性上，构造函数体中什么也没有。但这样定义之后，调用构造函数创建的新对象仍然拥有相应的属性和方法。与构造函数模式不同，使用这种原型模式定义的属性和方法是由所有实例共享的。因此person1和person2访问的都是相同的属性和相同的sayName()函数。

理解原型

每个函数都有 prototype 属性，是一个对象，prototype 属性内都有 constructor 属性，指向构造函数。每个对象都有内部属性[[Prototype]]（也叫`__proto__`），这是他的原型，JS中如果没有这个属性，那么就会去原型上寻找

isPrototypeOf、Object.getPrototypeOf、setPrototypeOf 都可以判断原型或设置原型，但Object.setPrototypeOf有性能问题，不推荐使用，应使用Object.create来替换

constructor属性只存在于原型对象，因此通过实例对象也是可以访问到的。

虽然可以通过实例读取原型对象上的值，但不可能通过实例重写这些值。如果在实例上添加了一个与原型对象中同名的属性，那就会在实例上创建这个属性，这个属性会遮住原型对象上的属性。遮住了之后即使赋值 null undefined 也不能恢复原型的访问，只能delete，才能恢复原型的访问。hasOwnProperty可以检查属性是否在实例上。

Object.getOwnPropertyDescriptor()方法只对实例属性有效。要取得原型属性的描述符，就必须直接在原型对象上调用Object.getOwnPropertyDescriptor()。

in 操作符单独使用，不论属性在实例上还是原型上，只要有就返回true，如要要判断属性是否只在原型上，可以搭配hasOwnProperty使用

要获得对象上所有可枚举的实例属性，可以使用Object.keys()方法。如果想列出所有实例属性，无论是否可以枚举，可以使用Object.getOwnPropertyNames()

Object.keys()和Object. getOwnPropertyNames()在适当的时候都可用来代替for-in循环。

在ECMAScript 6新增符号类型之后，相应地出现了增加一个Object.getOwnPropertyNames()的兄弟方法的需求，因为以符号为键的属性没有名称的概念。因此，Object.getOwnProperty-Symbols()方法就出现了，这个方法与Object.getOwnPropertyNames()类似，只是针对符号而已：

for-in循环、Object.keys()、Object.getOwnPropertyNames()、Object.getOwnProperty-Symbols()以及Object.assign()在属性枚举顺序方面有很大区别。for-in循环和Object.keys()的枚举顺序是不确定的，取决于JavaScript引擎，可能因浏览器而异。Object.getOwnPropertyNames()、Object.getOwnPropertySymbols()和Object.assign()的枚举顺序是确定性的。先以升序枚举数值键，然后以插入顺序枚举字符串和符号键。在对象字面量中定义的键以它们逗号分隔的顺序插入。

在JavaScript有史以来的大部分时间内，迭代对象属性都是一个难题。ECMAScript 2017新增了两个静态方法，用于将对象内容转换为序列化的——更重要的是可迭代的——格式。这两个静态方法Object.values()和Object.entries()接收一个对象，返回它们内容的数组。Object.values()返回对象值的数组，Object.entries()返回键/值对的数组。

有读者可能注意到了，在前面的例子中，每次定义一个属性或方法都会把Person.prototype重写一遍。为了减少代码冗余，也为了从视觉上更好地封装原型功能，直接通过一个包含所有属性和方法的对象字面量来重写原型成为了一种常见的做法，如下面的例子所示：

```js
function Person() {}
Person.prototype = {
  name: 'zmy',
  sayName() {
    console.log(this.name)
  }
}
```

但这样就没有 constructor 属性了，当然也可以手动加上，但默认的 constructor 是不可枚举的，所以最好的方案是用 defineProperty 加上。

重写构造函数上的原型之后再创建的实例才会引用新的原型。而在此之前创建的实例仍然会引用最初的原型（函数的prototype是在new的时候用的，new完之后再给就没啥用了）。如下：

```js
function Person() {}

let p1 = new Person();
Person.prototype = {
  name: 'zmy',
  sayName() {
    console.log(this.name);
  },
};

p1.sayName(); // 报错
```

原型模式之所以重要，不仅体现在自定义类型上，而且还因为它也是实现所有原生引用类型的模式。所有原生引用类型的构造函数（包括Object、Array、String等）都在原型上定义了实例方法。比如，数组实例的sort()方法就是Array.prototype上定义的，而字符串包装对象的substring()方法也是在String.prototype上定义的

原型上的所有属性是在实例间共享的，这对函数来说比较合适。另外包含原始值的属性也还好，如前面例子中所示，可以通过在实例上添加同名属性来简单地遮蔽原型上的属性。真正的问题来自包含引用值的属性。来看下面的例子：

```js
function Person() {}
Person.prototype = {
  name: 'zmy',
  list: [1, 2],
  sayName() {
    console.log(this.name);
  },
};

let p1 = new Person();
let p2 = new Person();

p1.list.push(3);
console.log(p2.list);
// [1, 2, 3]
```



原型链虽然是实现继承的强大工具，但它也有问题。主要问题出现在原型中包含引用值的时候

原型链的第二个问题是，子类型在实例化时不能给父类型的构造函数传参。



横向的找一些优秀的作者、优秀的文章，自己理解总结就行


