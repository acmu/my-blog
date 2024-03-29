

# TypeScript 装饰器





## Decorator 理解

一个[stage3的提案](https://github.com/tc39/proposal-decorators)，5年多了，还没有标准化。。。

它主要就是对类的增强（类构造函数、方法、属性），语法是 `@函数` 。

增强指：拿到类的构造函数，之后可以在原型上添加属性



## Reflect Metadata 理解



这不是MDN上的Reflect，这是 [Reflect Metadata 提案](https://rbuckton.github.io/reflect-metadata/)，可通过 Reflect.defineMetadata 等方法在对象上定义元数据（定义的元数据可通过 Reflect.getMetadata 获取）



```
import "reflect-metadata";
```

此库是一个[Metadata Proposal](https://rbuckton.github.io/reflect-metadata/)提案的Polyfill，此提案建立在装饰器之上，装饰器还没有正式纳入规范，处于stage3，使用此库可提前享受提案的功能。



他可以增强类或属性，在上面定义一些值，之后再获取



此概念常用于控制反转与依赖注入。



我的理解（可能有误）：

Decorator 只能拿到引用，他要想改数据的话只能改原型，但改原型会影响到类的实例，所以弄出个 metadata，可以定义属性而不影响类的实例





参考：

1. [reflect-metadata的研究](https://juejin.cn/post/6844904152812748807)
2. [Reflect Metadata](https://jkchao.github.io/typescript-book-chinese/tips/metadata.html)
3. [Nest 的实现原理？理解了 reflect metadata 就懂了](https://juejin.cn/post/7125066863150628900)



可参考：

1. https://www.typescriptlang.org/docs/handbook/decorators.html





## InversifyJS 理解



让你开发时能遵从面向对象好的的原则。



参考

1. [IoC和DI的基本概念及InversifyJS入门](https://juejin.cn/post/6844904119392534535)
2. [【翻译】InversifyJS 中文文档](https://juejin.cn/post/6932771619966287885)

