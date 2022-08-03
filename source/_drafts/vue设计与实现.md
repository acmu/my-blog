读书笔记

### 响应式

#### 微型响应式

```js
// 用来存储副作用函数，借助了 Set 的天然去重效果
const bucket = new Set();

// 要代理的数据
const data = { text: 'hello world' };

// 代理操作
const obj = new Proxy(data, {
  get(target, key) {
    bucket.add(effect);
    return target[key];
  },

  set(target, key, newVal) {
    target[key] = newVal;
    bucket.forEach(fn => fn());
    // 返回 true 目的是代表赋值操作正常
    return true;
  },
});

// 你希望要响应式的操作放到 effect 里面
function effect() {
  document.body.innerText = obj.text;
}

// 执行 getter，让 effect 被收集起来
effect();

// 执行 setter
setTimeout(() => {
  obj.text = 'hello vue';
}, 1000);

```

这实现了最简单的响应式数据，更改 obj.text 对应的 html 内容页会改变

（这里为什么用 Set 结构？因为监听器中不应该有两个相同的，如果这样就重复调用了）

#### 更完善的响应式

自定义effect函数名

问题：副作用函数必须命名 effect

解决：提供一个注册副作用函数的机制

```js
let activeEffect;

function effect(fn) {
  activeEffect = fn;
  fn();
}

effect(() => {
  document.body.innerText = obj.text;
});

```

现在匿名函数也能注册副作用了

```js
// 用来存储副作用函数，借助了 Set 的天然去重效果
const bucket = new Set();

// 要代理的数据
const data = { text: 'hello world' };

let activeEffect;

function effect(fn) {
  activeEffect = fn;
  // 自动执行 getter
  fn();
}

// 代理操作
const obj = new Proxy(data, {
  get(target, key) {
    // 注意：这里要改成 activeEffect
    bucket.add(activeEffect);
    return target[key];
  },

  set(target, key, newVal) {
    target[key] = newVal;
    // 把副作用函数全部执行一遍
    bucket.forEach(fn => fn());
    // 返回 true 目的是代表赋值操作正常
    return true;
  },
});

// 你希望要响应式的操作放到 effect 里面
effect(() => {
  document.body.innerText = obj.text;
});

// 执行 setter
setTimeout(() => {
  obj.text = 'hello vue';
}, 1000);

```



问题：如果访问一个不存在的属性，也会触发副作用

```js
effect(() => {
  // 注意：输出内容，判断是否执行了
  console.log('effect run')
  document.body.innerText = obj.text;
});

setTimeout(() => {
  // 注意：这里 notExist，obj 不存在这个属性
  obj.notExist = 'hello vue';
}, 1000);
```

notExist 不应该和副作用建立响应式，因为它没有 getter，所以我们需要重新设计桶



重新看下副作用函数

```js
effect(function effectFn() {
  document.body.innerText = obj.text;
});
```

有3个重要数据：

1. 被操作的对象 obj
2. 被操作对象的key text
3. 副作用函数 effectFn



通过以上3个点，要建立如下结构：

```
obj（对象）
	text（对象的key）
		effectFn（包含对象key的getter的副作用函数）
```

举例下：

```js
effect(function effectFn1() {
  obj.text;
});
effect(function effectFn2() {
  obj.text;
});
```

关系：

```
obj
	text
		effectFn1
		effectFn2
```

举例下：

```js
effect(function effectFn1() {
  obj.text1;
  obj.text2;
});
```

关系

```
obj
	text1
		effectFn1
	text2
		effectFn1
```

其实就是要做到 text1 只执行 effectFn1 而不会执行 text2 相关的依赖副作用函数



那么我们来实现一下这个数据结构

```js
// 用 WeakMap 实现桶
const bucket = new WeakMap();

const data = { text: 'hello world' };

let activeEffect;

function effect(fn) {
  activeEffect = fn;
  fn();
}

// 代理操作
const obj = new Proxy(data, {
  get(target, key) {
    // 防止没有 getter，只有 setter 的操作
    if (!activeEffect) return target[key];

    // 构造数据结构（如果没有就新建，如果有就用）
    let depsMap = bucket.get(target);
    if (!depsMap) {
      bucket.set(target, (depsMap = new Map()));
    }

    let deps = depsMap.get(key);
    if (!deps) {
      depsMap.set(key, (deps = new Set()));
    }

    deps.add(activeEffect);

    return target[key];
  },

  set(target, key, newVal) {
    target[key] = newVal;

    const depsMap = bucket.get(target);
    if (!depsMap) return;
    const effects = depsMap.get(key);

    effects && effects.forEach(fn => fn());
  },
});

effect(() => {
  console.log('effect run');
  document.body.innerText = `${obj.text}-${obj.notExist}`;
});

// 执行 setter
setTimeout(() => {
  obj.text = 'hello vue';
}, 1000);
```



之后还可以把 get 和 set 中的大坨代码抽象出 track 和 trigger 函数

```js
const bucket = new WeakMap();
let activeEffect;
function effect(fn) {
  activeEffect = fn;
  fn();
}
const data = { text: 'hello world' };
// 代理操作
const obj = new Proxy(data, {
  get(target, key) {
    track(target, key);
    return target[key];
  },
  set(target, key, newVal) {
    target[key] = newVal;
    trigger(target, key);
  },
});

function track(target, key) {
  if (!activeEffect) return target[key];

  let depsMap = bucket.get(target);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  deps.add(activeEffect);
}

function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  effects && effects.forEach(fn => fn());
}

effect(() => {
  console.log('effect run');
  document.body.innerText = `${obj.text}-${obj.notExist}`;
});

// 执行 setter
setTimeout(() => {
  obj.text = 'hello vue';
}, 1000);
```



#### 分支切换与 cleanup

分支切换是什么？

```js
const data = { ok: true, text: 'hello world' };
// const obj = new Proxy(data, { 省略代理代码 })

effect(function effectFn() {
  console.log('effect run');
  document.body.innerText = obj.ok ? obj.text : 'not';
});
```



要写这里了



50 page



当前全部代码：

```js
const bucket = new WeakMap();
let activeEffect;
function effect(fn) {
  activeEffect = fn;
  fn();
}

const data = { ok: true, text: 'hello world' };
// const obj = new Proxy(data, { 代理代码 })

// 代理操作
const obj = new Proxy(data, {
  get(target, key) {
    track(target, key);
    return target[key];
  },
  set(target, key, newVal) {
    target[key] = newVal;
    trigger(target, key);
  },
});

function track(target, key) {
  if (!activeEffect) return target[key];

  let depsMap = bucket.get(target);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  deps.add(activeEffect);
}

function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  effects && effects.forEach(fn => fn());
}

// --- END

effect(function effectFn() {
  console.log('effect run');
  document.body.innerText = obj.ok ? obj.text : 'not';
});

// 执行 setter
setTimeout(() => {
  obj.ok = false;
  obj.text = '243234'
}, 1000);

```





#### 嵌套的 effect 与 effect 栈



#### 避免无限递归循环



#### 调度执行



#### 计算属性 computed 与 lazy



#### watch 的实现原理











```js

```







```js

```







```js

```







```js

```







```js

```







```js

```







```js

```







```js

```







```js

```







```js

```







```js

```







```js

```







```js

```







```js

```





