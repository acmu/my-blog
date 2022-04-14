快手面试官：实现个继承吧，我：？！😵‍💫



> 这是我上次找工作被问到的题目，回答的不怎么好，本文深入总结下。



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

![image-2022041392336714 AM](/Users/yuan/Library/Application Support/typora-user-images/image-2022041392336714 AM.png)

可以正常使用继承的方法，这里我们使用了`new`操作符来完成`[[Prototype]]`属性的设置，其实还可以使用`Object.create`、`Object.setPrototypeOf`和`__proto__`来完成。

还有一些类相关的知识你也要了解：

1. `instanceof`就是一直在原型链上找，如果没有就返回false
2. 除了 null ，所有的对象都继承于 Object
3. `hasOwnProperty` 不会走原型链

### 封装

在类中，我们一般约定以下划线开头的变量就是私有变量，实例不可以访问这些私有变量，但这只是人为的约定，代码层面还是可以访问的，ECMAScript 规范也在推行语言层面的私有变量了，但还需要些时间，当下的JS中可以使用闭包实现私有变量，还可以使用`defineProperty`实现`getter`和`setter`。

### 多态

多态的实现有两种：子类覆盖父类方法、函数重载，JS 在继承中只要重新一个同名方法即可覆盖父类方法，函数重载的话需要我们手动去判断类型之后在调用对应类型的方法。

参考文章链接：

1. [Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
2. [菜鸟教程 Java 继承](https://www.runoob.com/java/java-inheritance.html)



原创文章耗费时间与精力，希望大家能关注、点赞鼓励一下 （＾ω＾），感谢~ 💖