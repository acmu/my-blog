---
title: 明远周刊（第 1 期）🤩
date: 2021-12-27 15:13:20
tags: 周刊
---

整理汇总一周看到的文章与学到的知识（2021-12-10 ~ 2021-12-16）

## 文章

### [React 中的 TS 类型过滤原来是这么做的！](https://mp.weixin.qq.com/s/EkcFlwTu6u9gC-8nvU0olQ)

#### 内容

如何理解这段 ts 类型代码？

```typescript
type FilterConditionally<Source, Condition> = Pick<
    Source,
    {
        [K in keyof Source]: Source[K] extends Condition ? K : never;
    }[keyof Source]
>;
```

有几个基础知识要知道：

```typescript
interface Example {
    a: string;
    b: string;
    c: number;
    d: boolean;
}

type Keys = keyof Example;
// 等价于 type Keys = 'a' | 'b' | 'c' | 'd'
```

Keyof 会拿到 key 的字符串

```typescript
type Keys = 'a' | 'b' | 'c' | 'd';
type Obj = {
    [T in Keys]: string;
};
// Obj 的类型：
// type Obj = {
//     a: string;
//     b: string;
//     c: string;
//     d: string;
// }
```

in 可以拿到类型列表中的每一个元素，但根据用法，还必须要声明一个类型 T

```typescript
interface A {}
interface B extends A {}

type C = B extends A ? number : string;
// type C = number

type D = A extends B ? number : string;
// type D = number
```

还可以使用条件判断来得出类型

```typescript
type MarkUnwantedTypesAsNever<Source, Condition> = {
    [K in keyof Source]: Source[K] extends Condition ? K : never;
};
```

这里使用了泛型，其实泛型就相当于 JS 中的函数一样，你给我参数，我给你返回值，只不过 TS 的返回值是类型而已，这个结论同样也适用于非泛型，因为那种情况就相当于没有传入参数，就直接返回了一个类型

```typescript
interface Example {
    a: string;
    b: string;
    c: boolean;
    d: number;
}

type Foo = MarkUnwantedTypesAsNever<Example, string>;
// type Foo = {
//     a: "a";
//     b: "b";
//     c: never;
//     d: never;
// }
```

根据如上分析，即可理解

```typescript
type Value = { name: 'zero2one' }['name'];
// type Value = "zero2one"
```

索引访问接口

```typescript
type Value = {
    name: 'zero2one';
    age: 23;
}['name' | 'age'];
// type Value = "zero2one" | 23
```

访问多个

```typescript
type Value = {
    name: 'zero2one';
    age: never;
}['name' | 'age'];

// 等价于 type Value = "zero2one"
```

never 不能被访问到

这是可以加上索引访问了

```typescript
type MarkUnwantedTypesAsNever<Source, Condition> = {
    [K in keyof Source]: Source[K] extends Condition ? K : never;
}[keyof Source];
```

即可得到

```typescript
type MarkUnwantedTypesAsNever<Source, Condition> = {
    [K in keyof Source]: Source[K] extends Condition ? K : never;
}[keyof Source];

interface Example {
    a: string;
    b: string;
    c: number;
    d: boolean;
}

type Foo = MarkUnwantedTypesAsNever<Example, string>;
// type Foo = "a" | "b"
```

最后需要看一下 Pick，这是 ts 内置的

```typescript
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

作用是筛选出类型 T 中指定的某些属性

```typescript
interface A {
    a: 1;
    b: 2;
    c: 3;
    d: 4;
}

type C = Pick<A, 'a' | 'c'>;
// type C = {
//     a: 1;
//     c: 3;
// }
```

最终即可实现

```typescript
type FilterConditionally<Source, Condition> = Pick<
    Source,
    {
        [K in keyof Source]: Source[K] extends Condition ? K : never;
    }[keyof Source]
>;

interface Example {
    a: string;
    b: string;
    c: number;
    d: boolean;
}

type Foo = FilterConditionally<Example, string>;
// type Foo = {
//     a: string;
//     b: string;
// }
```

#### 感悟

写的很好，尤其是这些例子设计，循序渐进。看的时候感觉一般，写的挺简单的，但让自己再输出一遍时，才知道不是那么一回事，能写出让读者觉得很简单的文章，还是很难的，需要一定功底。

这里我在复述时，想自己去优化一下，但发现内容几乎没有什么可以优化的地方了。可以看下作者的其他文章。

### [关于小程序的一切，读这一篇就够了～](https://mp.weixin.qq.com/s/xz_otxPXEnnUxQuC-ASkpg)

#### 内容

小程序并不是不需要安装，只是它容量小，下载的速度很快而已。小程序的架构都是基于双线程，分别是 js 执行线程、页面渲染线程，两者的交互需要 jsBridge，使用了发布订阅模式

#### 感悟

发布订阅模式好强呀，好多地方都用到了，比如 DOM 的监听事件、webpack 的 tapable 等等

本文还展示了些源码，看不懂，其实看的时候可以快速略过的

### [从 vue3 和 vite 源码中，我学到了一行代码统一规范团队包管理器的神器](https://mp.weixin.qq.com/s/Y2MxoZmqtUj-I-jbBK-9Ow)

#### 内容

使用 npm 的 preintsall 钩子加 node 的 process 获取命令行的输入，如果不是 pnpm，那么就报错退出 process.exit(1)

#### 感悟

标题有些长，废话有些多，标题说的也模糊，我本来以为是管理三方包版本的文章呢，唉，是我想多了

### [Dan Abramov 接受油管 UP 主的面试挑战，结果差点没写出来居中](https://mp.weixin.qq.com/s/ilGcZlc5T1iKGVegigwbkg)

#### 内容

一些通用问题：自我介绍、let const、redux 使用场景（现在的话，会使用 react-query, relay, apollo 等一些现代的 react 请求状态库）。

dangerouslySetInnerHTML 这个 API 的使用时机：在服务端返回 html 字符串时，并且能确保这是安全的，那么就使用，如果是不安全的，那么要对 HTML 消毒（santize）

数据结构的使用（二叉树镜像反转），可以扩展出反转链表啥的。

找兔子问题

#### 感悟

很有趣的文章，没想到国外的面试和国内的没啥区别。兔子问题还是挺难的，我不会，没有什么思路，可以学习下

## 鸡汤

年轻人真的很厉害，现在就有种感觉：学不过他们了，有一些你刚刚学会并使用的东西，并且引以为傲的东西，已经被人家总结在文档中了。

用什么语言或方法不重要，能解决问题最重要，做事要抓住根本。就像公司并不是所有的人都是研发，还有一大部分的销售，对于公司来讲，赚钱很重要。所以也不要总是沉浸在学习新语言、新知识的自我娱乐中，只要能解决问题，什么语言都可以。
