

#### 调度执行

可调度性：当trigger动作触发副作用函数重新执行时，有能力决定副作用函数执行的时机、次数以及方式。

如何决定副作用函数的执行方式：

```js
const data = { foo: 1}
const obj = new Proxy(data, { /* ... */ })

effect(() => {
  console.log(obj.foo)
})

obj.foo++

console.log('结束了')
```

输出结果：

```
1
2
'结束了'
```

但是，我们想要这样的输出结果：

```
1
'结束了'
2
```

那就就可以给effect函数加上第二个参数：一个配置对象。

最终代码如下：

```js
const bucket = new WeakMap();
let activeEffect;
const effectStack = [];

function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    fn();
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
  };
  effectFn.options = options;
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
  activeEffect.deps.push(deps);
}

function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  const effectsToRun = new Set();
  effects &&
    effects.forEach(effectFn => {
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn);
      }
    });
  effectsToRun.forEach(effectFn => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn);
    } else {
      effectFn();
    }
  });
}

// --- END

const data = { foo: 1 };

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
// const obj = new Proxy(data, { 代理代码 })

effect(
  function effectFn1() {
    console.log(obj.foo);
  },
  {
    scheduler(fn) {
      setTimeout(fn);
    },
  },
);

obj.foo++;

console.log('over');
```

通过 scheduler 函数可以回调 fn 实现了把 2的输出放到了下一个事件循环中。

还有一种情况是一个事件循环内执行了两次 `obj.foo++` ，但我不想要中间的执行过程，只想要最终的执行结果，那么可以把执行函数放到微任务中一起执行，如果正在执行中了，那就取消掉后面要执行的内容。（对应63页代码）

#### 计算属性 computed 与 lazy

懒执行的 effect

```js
effect(
	// 这个函数会立即执行
	() => {
		console.log(obj.foo)
	}
)
```

有事我们不想立即执行，那就这样配置

```js
effect(
	// 这个函数会立即执行
	() => {
		console.log(obj.foo)
	},
  {
    lazy: true
  }
)
```

可以在 effect 函数中通过这个配置控制不立即执行，那要在什么时候执行呢？这抛给了使用者，因为返回了函数的引用，所以使用者拿到返回值后就可以执行了。

```js
function computed(getter) {
  const effectFn = effect(getter, {
    lazy: true,
  });
  const obj = {
    get value() {
      return effectFn();
    },
  };
  return obj;
}
```

这里实现了 computed，但这里只是懒计算（即使用时再调研，并没有做到值缓存），computed 中可以使用 dirty 和 value 进行缓存，在 schedule 时，dirty 赋值true。

但还有个小问题，就是计算属性被使用到 effect 中时，没有被重新渲染（即嵌套effect 的问题），还应该稍加改动，就是要手动调用 trigger 和 track。



#### watch 的实现原理

watch本质就是观测一个响应式数据，当数据发生变化时通知并执行相应的回调函数。利用了 effect 和 options.scheduler。

在 scheduler 里面写一个 traverse 递归遍历对象的所有内容，都加上track和trigger。（watch 的第一个参数是对象的情况）

watch 的第一个参数还可以是函数，那就会追踪函数中用到的响应式数据

但现在的实现只是调用时机对了，但拿不到新值和旧值。那就得用 lazy 选项。

可能还要立即执行，即 immediate，和控制执行时机 flush: pre/post/sync 等

#### 过期的副作用

watch 时要是请求的话，如果连续改了2次source，那么2个请求都发出去了，但是只有最后一个是有效的，所以要避免第一个的请求值被存储，我们把第一个叫做过期的副作用，watch 的 callback 提供的第三个参数，在这个 watcher 过期时调用。



## 第5章







```js

```



  

```js

```



