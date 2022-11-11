---
title: JavaScript 的对象与继承
date: 2022-11-05 09:19:02
tags: JavaScript
---

本文来自一次组内分享。

对象和继承一直都是 JavaScript 里重要的概念，JavaScript 也是一门被误解的语言，尤其是在继承方面，本文就带大家更深入的了解对象与继承的相关知识。

## 对象

对象是 JavaScript 中的一种数据类型（为什么 Array RegExp 等等，不是数据类型呢？），对象由属性和属性值组成，属性的类型只能是字符串或 Symbol，属性又分为两种类型，数据属性 和 访问器属性，每个属性都有 4 个描述符

数据属性 和 访问器属性 共同的描述符：

1. [[Configurable]]：属性是否可以通过 delete 删除，是否可以修改它的描述符，以及是否可以在数据属性与访问器属性之间切换
2. [[Enumerable]]：是否 for in 循环、Object.keys() 可访问

不同的描述符：

数据属性：

1. [[Value]]：属性值
2. [[Writable]]：是否可以修改 [[Value]]

访问器属性：

1. [[Get]]：获取函数，在读取属性时调用
2. [[Set]]：设置函数，在写入属性时调用

[[xxx]] 这种双中括号代表什么？类似的还有 @@toPrimitive 又代表什么？

1. [[xxx]] 这种双中括号的表示一般在规范文档中，代表是引擎的内部属性
2. @@toPrimitive 这种类似表示，代表的是 Symbol.hasInstance

可使用 Object.defineProperty() 与 Object.getOwnPropertyDescriptor() 设置与获取属性的描述符，默认我们直接对象定义的，都是 true 是数据属性：

以下两种表示是一样的：

```js
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

console.log(Object.getOwnPropertyDescriptor(obj, 'a'));
```

还可以用这样简写的方式定义访问器属性：

```js
const obj = {
  get a() {
    return 1;
  },
};
```

这种控制台显示 ... 的就是计算属性，点击之后会调用 getter

![image-2022110591023096 AM](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2022-11/05_09:10_5GpVXc.png)

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

person.introduce()
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
  this.introduce = function() {
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

没有显式地创建对象，那对象哪里来的？是 new “惹的祸”，new 干了什么？想要知道这个，你就得先了解原型链

### **原型链机制**

如下代码的输出是什么？

```js
const obj = {
  __proto__: {
    x: 1,
  },
};
console.log(obj.x);
```

解释：没有在对象上定义 x 属性，但为什么能获取到呢？因为**对象在获取属性时，如果当前的对象没有，那么就会向当前对象的原型对象去寻找，如果还没有就继续向原型对象寻找，直到没有原型对象为止。**这就是原型链，根据原型为链条寻找属性的机制。代码中的 __proto__ 属性就是这里说的原型

#### __proto__ vs [[Prototype]] vs prototype

1. __proto__ 属性：每个对象都有此属性，代表原型，是非标准的历史遗留属性，现在并不推荐使用
2. [[Prototype]] 内部属性：每个对象都有此属性，代表原型，是ES规范中的描述，和 __proto__ 属性 功能完全一样，更推荐现代语法使用，但内部属性是不能直接在 JavaScript 语言层面访问的，还好语言标准提供了 Object.getPrototypeOf() 和 Object.setPrototypeOf() 获取和设置原型
3. prototype 属性：每个函数都有 prototype 属性，他只有在此函数作为构造函数时才有意义，下文会讲

#### 原型链图示

```js
const obj = {
  z: 3,
  __proto__: {
    x: 1,
  },
};
const obj2 = { y: 2 };
console.log(obj, obj2);
```

![image-2022110591310248 AM](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2022-11/05_09:13_7fWFTR.png)

可以看到如上代码设置了原型对象的对象，会比普通对象中间多一层

### new 干了什么

知道了原型链机制，那么现在就可以分析 new 干了什么

1. 创建一个新对象 foo
2. 将新对象 foo 的 [[Prototype]] 内部属性赋值为构造函数的 prototype 属性
3. 使用新对象 foo 的上下文执行构造函数（即构造函数中的this会指向新对象，并为这个新对象添加属性）
4. 如果构造函数返回非空对象，则返回构造函数返回的对象；否则，返回新对象  foo

**这里很重要，下面还会继续用**，要理解好。构造函数的 prototype 属性，这是什么呢？没事，我们可以先暂时略过这条，后面再看

知道了原理，可以先忽略第2条，实现一个自己的 new，其实很简单：

```js
// 这里为了保持简单，省略了构造函数有返回值的情况，因为这种情况也并不常见
function myNew(fun, ...args) {
  const foo = {};
  fun.apply(foo, args);
  return foo;
}
```

测试一下：

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.introduce = function() {
    console.log('I am ' + this.name);
  };
}
const p1 = new Person('ming', 25);
p1.introduce();
console.log(p1)

// 这里为了保持简单，省略了构造函数有返回值的情况，因为这种情况也并不常见
function myNew(fun, ...args) {
  const foo = {};
  fun.apply(foo, args);
  return foo;
}

const p2 = myNew(Person, 'ming2', 25)
p2.introduce()
console.log(p2)
```

（此时的 myNew 并不完整，后文还会再补充）



接下来说回构造函数创建对象，其实此模式也存在问题：其定义的方法会在每个实例都创建一遍，不能复用（联想到大鹏分享的，冗余占用了内存呀）

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.introduce = function() {
    console.log('I am ' + this.name);
  };
}
const p1 = new Person('ming', 25);
const p3 = new Person('ming3', 25);

// 每个实例都有一个自己的 introduce 函数
console.log(p1.introduce === p3.introduce);
```

那聪明的你就想到了，我们不用每次都新生成一个函数呀，可以用同一个函数的引用

```js
function introduce() {
  console.log('I am ' + this.name);
}
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.introduce = introduce;
}
const p1 = new Person('ming', 25);
const p3 = new Person('ming3', 25);

console.log(p1.introduce === p3.introduce);
```

这的确是个好办完，但唯一的缺点就是 introduce 占用了全局的命名空间，但解决这个问题也简单，只要把 introduce 等等众多方法放到 一个对象 myFuncs 中就行了，但是 myFuncs 也占用了一个全局的命名空间呀，那就不把 myFuncs 放在全局命名空间中了，那放在那里好呢？此时你想到函数也是对象呀，那么可以在函数上面添加属性

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.introduce = Person.myFuncs.introduce;
}
Person.myFuncs = {
  introduce() {
    console.log('I am ' + this.name);
  },
};
const p1 = new Person('ming', 25);
const p3 = new Person('ming3', 25);

console.log(p1.introduce === p3.introduce);
```


但每次都这样写有些麻烦，还能不能更简略些？可以的，语言层面已经帮你实现了



### 原型模式

不用你写函数的 myFuncs 属性了，语言规定，每个函数都有一个 prototype 属性（对就是上文说道的），他就是我们的 myFuncs 属性，只是换了个名字而已，还带有两个特殊逻辑：

1. prototype 属性值是一个对象，对象中有一个 constructor 属性，属性值是构造函数
   这个 constructor 属性到底有什么用呢？🧐

   我在看了半天 [mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor#browser_compatibility) 后得出结论：它没什么用 😅。

   它有一个比较常见的用法是用于判断对象的类型，但它很容易被赋值或删除，相比于 instanceof 和 Symbol.toStringTag 来说并不可靠，其实这两个也并非绝对可靠。

   

   这里说的 Symbol.toStringTag 是什么？

2. 这里就是上文说的暂时忽略的第2条：在执行 new 的时候，会『把新对象 foo 的 [[Prototype]] 内部属性赋值为构造函数的 prototype 属性』，这样由于原型机制，我们也不用多余执行 this.introduce = Person.myFuncs.introduce 这段代码了，但是要记得把 Person.prototype.introduce 赋值



故可以得出如下代码：

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.introduce = function() {
  console.log('I am ' + this.name);
};

const p1 = new Person('ming', 25);
const p3 = new Person('ming3', 25);

console.log(p1.introduce === p3.introduce);
```

这样的代码你是不是在哪里见过？

如 Vue 2 的插件模式。你也可以自己写个好玩的代码：

```js
Object.prototype.test = 'haha'
```

这样每个对象的原型上都有了 test 属性



这里发现，上文的 myNew 实现并不完整，应补充 [[Prototype]] 内部属性赋值的内容：

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.introduce = function() {
  console.log('I am ' + this.name);
};

const p1 = new Person('ming', 25);
p1.introduce();
console.log(p1);

function myNew(fun, ...args) {
  const foo = {};
  Object.setPrototypeOf(foo, fun.prototype);
  fun.apply(foo, args);
  return foo;
}

const p2 = myNew(Person, 'ming2', 25);
p2.introduce();
console.log(p2);
```

这里与上文相比，还有个改动就是 introduce 等方法不是实例属性了，而是原型属性（即多个实例会用相同的原型），实例属性与原型属性有什么区别？

注意：如果你看过 [setPrototypeOf 的 mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) 就能发现，它的性能并不好，推荐使用 Object.create() 代替，这个下文会讲



## 继承

java 中可以用简单的关键字就实现继承了，但 JavaScript 中并不简单，因为我们要用原型链机制去模拟继承。

在 JavaScript 的历史长河中，模拟继承的实现也有很多种方式，下面我们分别看下。

### 原型链

通过上面的原型指向（[[Prototype]] 内部属性赋值）已经有些许的继承味道了，所以可以得出如下代码：

```js
function Animal() {
  this.name = 'animal';
}
Animal.prototype.sayName = function() {
  console.log('name is ' + this.name);
};

function Dog() {
  this.name = 'dog';
}
Dog.prototype = new Animal();
Dog.prototype.eat = function() {
  console.log(this.name + ' eat');
};

const dog = new Dog();
dog.eat();
dog.sayName();
```

**把子类构造函数的 prototype 赋值为父类的实例。**你能说出 sayName 的调用是如何执行的吗？

优点：实例 与 原型的关系可用 instanceof、[isPrototypeOf()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isPrototypeOf) 判断（文档中为什么是 Object.prototype.isPrototypeOf() 呢？这个和 Object.defineProperty() 有什么区别呢）



原型链的问题：

1. 子类型在实例化时不能给父类型的构造函数传参

2. 父类的实例中包含引用值

   ```js
   function Animal() {
     this.colors = ['red', 'blue', 'green'];
   }
   
   function Dog() {}
   Dog.prototype = new Animal();
   
   const dog1 = new Dog();
   const dog2 = new Dog();
   
   dog1.colors.push('black');
   
   console.log(dog1.colors);
   console.log(dog2.colors);
   ```
   
   因为多个 Dog 的实例的原型都是同一个，也就是 Dog.prototype 即 一个Animal的实例，那么如果Animal的实例有引用类型，就会导致多个 Dog 的实例的原型使用同一个引用类型



### 盗用构造函数

相比于原型链，此方法多了一步：在子类构造函数中调用父类构造函数（把父类构造函数那过来给子类的构造函数中使用了，所以叫 盗用构造函数 嘛）

```js
function Animal() {
  this.colors = ['red', 'blue', 'green'];
}

function Dog() {
  Animal.call(this); // 重点：新增代码
}
// 重点：删除了 Dog.prototype 的赋值

const dog1 = new Dog();
const dog2 = new Dog();

dog1.colors.push('black');

console.log(dog1.colors);
console.log(dog2.colors);
```

相比于原型链：

1. 可以传递参数
2. 引用类型在每个子类的实例上都有，解决了使用多个子类的实例使用共同的引用类型问题



盗用构造函数的问题：

1. dog1 instanceof Animal 为 false
2. 定义函数只能在子类的构造函数中，又回到了上文的函数不能复用的问题



其实这个更像是借助构造函数实现了对象的组合



### 组合继承

原型链 + 盗用构造函数 的组合

```js
function Animal(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}
Animal.prototype.sayName = function() {
  console.log('name is ' + this.name);
};

function Dog(name, age) {
  Animal.call(this, name); // 重点：用于继承 Animal 构造函数中的属性（方法最好不要写在构造函数中，否则会难以复用）
  this.age = age;
}

Dog.prototype = new Animal(); // 重点：这里用于继承 Animal.prototype 中的方法
Dog.prototype.eat = function() {
  console.log(this.name + ' eat');
};

const dog1 = new Dog('foo', 3);
dog1.colors.push('black');
dog1.eat();
dog1.sayName();
console.log(dog1);

const dog2 = new Dog('bar', 5);
console.log(dog2);
```

注意：

1. 方法一般定义在 构造函数.prototype 上，这里是在每个实例指向的原型，可以在多个实例中复用
2. 属性一般定义在构造函数的 this 赋值上，这里会在每个实例中都存在
3. 静态属性和静态方法其实就是构造函数的属性而已



组合继承弥补了原型链和盗用构造函数的不足，**是 JavaScript 中使用最多的继承模式**。而且组合继承也保留了 instanceof 操作符和 isPrototypeOf()方法 识别对象的能力



组合继承虽然很强大，但仍存在问题的：

1. 子类实例的原型中冗余存储了一份数据，也就是由于父类构造函数被调用 2 次所造成的

![image-2022110591651230 AM](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2022-11/05_09:16_Wg751S.png)

如果想要完美的解决这个问题，就得先了解下其他内容



### 原型式继承

这和上面的 3 种继承方式关系不大，学习这个时，可以先忘掉刚学内容

Douglas Crockford 曾写过一篇文章，介绍了一种不涉及严格意义上构造函数的继承方法。

![image-2022110591711716 AM](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2022-11/05_09:17_mn2XAH.png)

JSON、JSLint 创造者，JavaScript语言精粹 作者



他的出发点是即使不自定义类型也可以通过原型实现对象之间的信息共享。最终给出了一个函数：

```js
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}
```

这样使用

```js
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

let person = {
  name: 'Nicholas',
  friends: ['Shelby', 'Court', 'Van'],
};

let anotherPerson = object(person);
anotherPerson.name = 'Greg';
anotherPerson.friends.push('Rob');

let yetAnotherPerson = object(person);
yetAnotherPerson.name = 'Linda';
yetAnotherPerson.friends.push('Barbie');

console.log(person.friends); // "Shelby,Court,Van,Rob,Barbie"

console.log(anotherPerson)
console.log(yetAnotherPerson)
```

原型式继承适用于这种情况：你有一个对象，想在它的基础上再创建一个新对象。你需要把这个对象先传给 object()，然后再对返回的对象进行适当修改。

本质上，object()是对传入的对象执行了一次浅复制 （和扩展运算符类型，只不过他是在原型上，以及你可以在新对象中覆盖原型）



我的理解：创建一个对象，并把原型设置为参数，之后返回对象



Object.create() 就是这玩意，只不过多了个参数



原型式继承非常适合不需要单独创建构造函数，但仍然需要在对象间共享信息的场合。但要记住，属性中包含的引用值始终会在相关对象间共享，跟使用原型模式是一样的。



### 寄生式继承

原型式继承 + 对象属性赋值 + 工厂模式（就是在原型式继承的基础上，用工厂函数包起来，之后可以自定义一些属性）

```js
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

function createAnother(original) {
  let clone = object(original);
  clone.sayHi = function() {
    console.log('Hi');
  };
  return clone;
}

let person = {
  name: 'Nicholas',
  friends: ['Shelby', 'Court', 'Van'],
};
let anotherPerson = createAnother(person);
anotherPerson.sayHi();
```

寄生式继承同样适合主要关注对象，而不在乎类型和构造函数的场景。

### 寄生式组合继承

寄生式继承 + 组合继承

```js
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

function inheritPrototype(subType, superType) {
  let prototype = object(superType.prototype);
  prototype.constructor = subType;
  subType.prototype = prototype;
}

function SuperType(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}
SuperType.prototype.sayName = function() {
  console.log(this.name);
};

function SubType(name, age) {
  SuperType.call(this, name);
  this.age = age;
}

// 这里没有 new 了，所以不会再冗余生成一遍属性，而且还能把方法继承下来
inheritPrototype(SubType, SuperType);

SubType.prototype.sayAge = function() {
  console.log(this.age);
};

const a = new SubType('foo', 20)

console.log(a)
```

寄生式组合继承可以算是引用类型继承的最佳模式。

## 总结

虽然我们整天在写 JavaScript 代码，但有些很基础的东西却了解的不够深入，遇到些疑难杂症就束手无策了，所以应该练好基本功。

虽然现在都用 class 和 extend 关键字来实现类与继承了，但其底层原理就是用本文的内容实现的，你可以把它们认为是高级的语法糖。对于他们的使用也有启发意义，比如类里可以定义 getter 和 setter、私有属性为什么那么难实现？

还可以自己用代码找出 String 的 api 

对于看文档时，api之间的联系也能更清晰，如 File api 他是继承自 Blob 的，这样查阅 api 更有联系，容易记住



学习了这些内容，在回看这段简单的代码是如何执行的？

```js
const str = 'Mozilla';

console.log(str.substring(1, 3));
```