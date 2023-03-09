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

（这里为什么用 Set 结构？因为监听器中不应该有两个相同的函数，如果on了两次同一个的函数，那么触发的时候就应该只触发一次）

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

effect 函数中存在三元表达式，根据 obj.ok 的值会执行不同的分支

分支切换可能产生遗留的副作用函数，ok 为 true

```js
data
	ok
  	effectFn
  text
  	effectFn
```

ok 为 false

```js
data
	ok
  	effectFn
```

这时就不应该在追踪 text 了，但我们现在的实现还是在追踪，这是遗留的副作用函数，它会导致不必要的更新

```js
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

obj.ok 为 false 后，obj.text 的更新就不应该执行 effectFn，但我们当前的实现不能满足

解决：每次副作用函数执行时，先把副作用函数从与之关联的依赖集合中删除。当副作用函数执行完毕后，会重新建立连接，因为副作用函数的执行就调用了 getter。

与副作用函数关联的依赖集合怎么求？

给 effectFn 函数增加 deps 属性，保存副作用函数相关联的依赖集合

```js
function effect(fn) {
  const effectFn = () => {
    // 注意
    activeEffect = effectFn;
    fn();
  };
  // 新增
  effectFn.deps = [];
  effectFn();
}


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
  // 新增
  activeEffect.deps.push(deps);
}
```

之后可根据effectFn.deps删除掉联系

```js
function effect(fn) {
  const effectFn = () => {
    // 新增
    cleanup(effectFn);
    activeEffect = effectFn;
    fn();
  };
  effectFn.deps = [];
  effectFn();
}

function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i];
    deps.delete(effectFn);
  }
  effectFn.deps.length = 0;
}
```

但现在如果你执行，会发现产生了无限循环，原因是 trigger 函数中的`effects.forEach(fn => fn())`，可以简短的代码表示根因，如下：

```js
const set = new Set([1]);

set.forEach(() => {
  set.delete(1);
  set.add(1);
  console.log('遍历中');
});
```

Set 的 forEach 对应新加入的项目会一直遍历

解决：新复制一个set，使用新set遍历

```js
const set = new Set([1]);
// 新增
const newSet = new Set(set)
newSet.forEach(() => {
  set.delete(1);
  set.add(1);
  console.log('遍历中');
});
```

那么，可以这样改trigger代码

```js
function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  // 新增
  const effectsToRun = new Set(effects);
  effectsToRun.forEach(fn => fn());
}
```

#### 嵌套的 effect 与 effect 栈

effect 可以嵌套，如下：

```js
effect(function effectFn1() {
  effect(function effectFn2() {
    // ...
  })
})
```

测下嵌套的效果：

```js
const data = { foo: true, bar: true };
// const obj = new Proxy(data, { 代理代码 })
let temp1, temp2;

effect(function effectFn1() {
  console.log('effectFn1 run');
  effect(function effectFn2() {
    console.log('effectFn2 run');
    temp2 = obj.bar;
  });
  temp1 = obj.foo;
});

setTimeout(() => {
  obj.foo = false;
}, 1000);

// 输出
// effectFn1 run
// effectFn2 run
// effectFn2 run （1 秒后）
```

这是错误的，期望的联系如下：

```
data
	bar
		effectFn2
	foo
		effectFn1
```

那么更改了 foo，应该执行 effectFn1，但是当前实现却执行了 effectFn2。

问题出在 activeEffect，他只是一个变量，当执行到effectFn2时，会覆盖effectFn1，当effectFn2执行完成后，再回到effectFn1执行时，activeEffect却不能还原回来，不能模拟函数调用栈，那么更改如下：

```js
let activeEffect;
// 新增
const effectStack = [];

function effect(fn) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    // 新增
    effectStack.push(effectFn);
    fn();
    // 新增
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
  };
  effectFn.deps = [];
  effectFn();
}

// 最后输出
// effectFn1 run
// effectFn2 run
// （1 秒后）
// effectFn1 run
// effectFn2 run
```



当前全部代码：

```js
const bucket = new WeakMap();
let activeEffect;
// 新增
const effectStack = [];

function effect(fn) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    // 新增
    effectStack.push(effectFn);
    fn();
    // 新增
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
  };
  effectFn.deps = [];
  effectFn();
}

function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i];
    deps.delete(effectFn);
  }
  effectFn.deps.length = 0;
}

const data = { foo: true, bar: true };
// const obj = new Proxy(data, { 代理代码 })
let temp1, temp2;

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
  // 新增
  activeEffect.deps.push(deps);
}

function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  // 新增
  const effectsToRun = new Set(effects);
  effectsToRun.forEach(fn => fn());
}

// --- END

effect(function effectFn1() {
  console.log('effectFn1 run');
  effect(function effectFn2() {
    console.log('effectFn2 run');
    temp2 = obj.bar;
  });
  temp1 = obj.foo;
});

setTimeout(() => {
  obj.foo = false;
}, 1000);

// 最后输出
// effectFn1 run
// effectFn2 run
// （1 秒后）
// effectFn1 run
// effectFn2 run 
```

#### 避免无限递归循环

如下代码会报错：`Uncaught RangeError: Maximum call stack size exceeded`

```js
const data = { foo: true, bar: true };
// const obj = new Proxy(data, { 代理代码 })

effect(function effectFn1() {
  obj.foo++;
});
```

`obj.foo++` 相当于 `obj.foo  = obj.foo + 1`，既读取 foo 又设置 foo

解决：（不太懂。。。）

```js
function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  const effectsToRun = new Set();
  effects &&
    effects.forEach(effectFn => {
      // 新增
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn);
      }
    });
  effectsToRun.forEach(effectFn => effectFn());
}
```



至此的全部代码如下：

```js
const bucket = new WeakMap();
let activeEffect;
// 新增
const effectStack = [];

function effect(fn) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    // 新增
    effectStack.push(effectFn);
    fn();
    // 新增
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
  };
  effectFn.deps = [];
  effectFn();
}

function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i];
    deps.delete(effectFn);
  }
  effectFn.deps.length = 0;
}

const data = { foo: true, bar: true };
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
  // 新增
  activeEffect.deps.push(deps);
}

function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  const effectsToRun = new Set();
  effects &&
    effects.forEach(effectFn => {
      // 新增
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn);
      }
    });
  effectsToRun.forEach(effectFn => effectFn());
}

// --- END

effect(function effectFn1() {
  obj.foo++;
});

```





