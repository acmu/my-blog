

读书笔记



第4章



微型响应式

```js
const bucket = new Set();

const data = { text: 'hel wo' };

const obj = new Proxy(data, {
  get(target, key) {
    bucket.add(effect);
    return target[key];
  },

  set(target, key, newVal) {
    target[key] = newVal;
    bucket.forEach(fn => fn());
    return true;
  },
});

function effect() {
  const app = document.querySelector('#app');
  app.innerText = obj.text;
}

effect();

setTimeout(() => {
  obj.text = 'hel vue';
}, 1000);

const btn = document.querySelector('.btn');

let num = 1;

btn.addEventListener('click', () => {
  obj.text = num++;
});

```

这实现了最简单的响应式数据，更改obj.text 对应的 html 内容页会改变（这里为什么用 Set 结构？因为监听器中不应该有两个相同的，如果这样就重复调用了）



更完善的响应式

副作用必须命名 effect，这不好，要改善，提供一个注册副作用函数的机制

```js
let activeEffect;

function effect(fn) {
  activeEffect = fn;
  fn();
}

effect(() => {
  document.querySelector('#app').innerText = obj.text;
});

```

现在匿名函数也能注册副作用了

```js
const bucket = new Set();

const data = { text: 'hel wo' };

let activeEffect;

function effect(fn) {
  activeEffect = fn;
  fn();
}

const obj = new Proxy(data, {
  get(target, key) {
    if (activeEffect) {
      bucket.add(activeEffect);
    }
    return target[key];
  },

  set(target, key, newVal) {
    target[key] = newVal;
    bucket.forEach(fn => fn());
    return true;
  },
});

effect(() => {
  document.querySelector('#app').innerText = obj.text;
});

setTimeout(() => {
  obj.text = 'hel vue';
}, 1000);

let num = 1;

document.querySelector('.btn').addEventListener('click', () => {
  obj.text = num++;
});

```

但是如果我们访问一个不存在的属性，也会触发副作用

```js
const bucket = new Set();
const data = { text: 'hel wo' };
let activeEffect;

function effect(fn) {
  activeEffect = fn;
  fn();
}
const obj = new Proxy(data, {
  get(target, key) {
    if (activeEffect) {
      bucket.add(activeEffect);
    }
    return target[key];
  },

  set(target, key, newVal) {
    target[key] = newVal;
    bucket.forEach(fn => fn());
    return true;
  },
});

effect(() => {
  console.log('effect run')
  document.body.innerText = obj.text;
});

setTimeout(() => {
  obj.notExist = 'hel vue';
}, 1000);

```

notExist 是不应该和副作用建立响应式的，因为它没有被 get，所以我们需要重新设计桶

还是看一下副作用函数

```js
effect(function effectFn() {
  document.body.innerText = obj.text;
});
```

有3个重要数据：

1. 被操作的对象 obj
2. 被操作的key text
3. 副作用函数 effectFn

我们要建立这样的结构：

```
obj
	text
		effectFn
```

举例下

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

代码：

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

其实就是要做到 text1 只执行 effectFn1 而不会执行 text2 相关的依赖



那么我们来实现一下这个数据结构

```js
const bucket = new WeakMap();

const data = { text: 'hel wo' };
let activeEffect;

function effect(fn) {
  activeEffect = fn;
  fn();
}

const obj = new Proxy(data, {
  get(target, key) {
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
    return target[key];
  },

  set(target, key, newVal) {
    target[key] = newVal;

    const depsMap = bucket.get(target);
    if (!depsMap) return;

    const effects = depsMap.get(key);
    effects && effects.forEach();
  },
});

effect(function effectFn1() {
  obj.text1;
  obj.text2;
});

setTimeout(() => {
  obj.aaa = 'hel vue';
}, 1000);

```



之后再抽象出 track 和 trigger 函数

```js
const bucket = new WeakMap();
let activeEffect;
function effect(fn) {
  activeEffect = fn;
  fn();
}
const data = { text: 'hello world' };

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
  if (!activeEffect) return;
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

effect(function effectFn1() {
  obj.text1;
  obj.text2;
});

setTimeout(() => {
  obj.aaa = 'hello vue';
}, 1000);

```



4.4 分支切换与 cleanup

