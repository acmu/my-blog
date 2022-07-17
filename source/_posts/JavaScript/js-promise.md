---
title: JavaScript 异步与 Promise
date: 2022-07-17 22:52:20
tags: JavaScript
---

## 异步是什么？

异步是相对于同步而言的，那同步是什么呢？简单说就是干完a事情，之后再干b事情，这挺正常的，人的思维都是这样做事的，那为什么还需要异步呢？举个现实中的例子，比如你已经下单定了外卖，你会什么也不干，一直等到外卖到了之后再做事情吗？显然不会的，你会在外卖到了之前做一些与吃外卖无关的事情，比如看书、刷剧啥的，之后外卖到了，再去吃外卖。

## 异步解决什么问题？

更快的完成更多的任务

多线程也能更快的完成任务，但这种方式要比异步更复杂，因为会引发多个线程同时更改数据的问题，就需要加锁来解决

## JS中的异步

### 回调函数

那如何实现异步呢？JS中首先使用了回调函数的方式，此方式可以理解为我在下单外卖后，定了一个todo列表（如其中有：取外卖、吃饭、扔垃圾等），之后我就去干其他的事情了，但我的耳朵会一直监听手机铃声，如果铃声响了，并且我也是空闲的状态下，就会去执行todo列表（也就是回调函数），但我如果有其他事情（比如在上厕所），那么就会做完其他事情之后再去执行todo列表。

回到代码，我们知道回调函数会引起回调地狱的问题，所以在写法、可读与维护上都不太好

### Promise

增加了错误处理，内置实现了 Promise.all race 等操作，对于串行请求操作更方便了，回调需要更深层的缩进来实现串行请求，而Promise是在同一层级的链式调用，在下面写代码就行了，而不需要在里面。

Promise的问题是太多模板代码了，写上去一堆then。

### Generator

利用了协程的机制，使代码可以执行到一半时，把控制权交给其他函数，之后还可以再拿回来。并且使用回调函数或Promise可以交还执行权，实现自动执行。

### async

async函数是Generator的语法糖，它内置的执行器，并且有更好的语义。

## 实现自己的 Promise

### 分析基本

可以先写一个简单的实现，同步版本：

```js
// MyPromise 实现（同步版本）
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject);
  }

  status = PENDING;

  value = null;
  reason = null;

  resolve = value => {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;
    }
  };

  reject = reason => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = reason;
    }
  };

  then = (onFulfilled, onRejected) => {
    if (this.status === FULFILLED) {
      onFulfilled(this.value);
    } else if (this.status === REJECTED) {
      onRejected(this.reason);
    }
  };
}

// 测试代码
const promise = new MyPromise((resolve, reject) => {
  // resolve('success');
  reject('error');
});

promise.then(
  value => {
    console.log('resolve', value);
  },
  error => {
    console.log('reject', error);
  },
);
```

之后再实现一个异步版本：（增加onFulfilledCallback等回调函数的存储，在then的时候如果状态是pending，那么就存下来，之后在resolve的时候再去执行）

```js
// MyPromise 实现（异步版本，可注册多个 then）
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject);
  }

  status = PENDING;

  value = null;
  reason = null;

  onFulfilledCallbacks = [];
  onRejectedCallbacks = [];

  resolve = value => {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;
      while (this.onFulfilledCallbacks.length) {
        this.onFulfilledCallbacks.shift()(value);
      }
    }
  };

  reject = reason => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = reason;
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason);
      }
    }
  };

  then = (onFulfilled, onRejected) => {
    if (this.status === FULFILLED) {
      onFulfilled(this.value);
    } else if (this.status === REJECTED) {
      onRejected(this.reason);
    } else if (this.status === PENDING) {
      this.onFulfilledCallbacks.push(onFulfilled);
      this.onRejectedCallbacks.push(onRejected);
    }
  };
}

// 测试代码
const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success');
  }, 2000);
});

promise.then(value => {
  console.log(1);
  console.log('resolve', value);
});

promise.then(value => {
  console.log(2);
  console.log('resolve', value);
});

promise.then(value => {
  console.log(3);
  console.log('resolve', value);
});
```

最终版本：then方法的链式调用、增加错误捕获：

```js
// MyPromise 实现（then链式调用）
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject);
  }

  status = PENDING;

  value = null;
  reason = null;

  onFulfilledCallbacks = [];
  onRejectedCallbacks = [];

  resolve = value => {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;
      while (this.onFulfilledCallbacks.length) {
        this.onFulfilledCallbacks.shift()(value);
      }
    }
  };

  reject = reason => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = reason;
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason);
      }
    }
  };

  then = (onFulfilled, onRejected) => {
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        const x = onFulfilled(this.value);
        resolvePromise(x, resolve, reject);
      } else if (this.status === REJECTED) {
        onRejected(this.reason);
      } else if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(onFulfilled);
        this.onRejectedCallbacks.push(onRejected);
      }
    });
    return promise2;
  };
}

function resolvePromise(x, resolve, reject) {
  if (x instanceof MyPromise) {
    x.then(resolve, reject);
  } else {
    resolve(x);
  }
}

// 测试代码
const promise = new MyPromise((resolve, reject) => {
  resolve('success');
});

function other() {
  return new MyPromise((resolve, reject) => {
    resolve('other');
  });
}
promise
  .then(value => {
    console.log(1);
    console.log('resolve', value);
    return other();
  })
  .then(value => {
    console.log(2);
    console.log('resolve', value);
  });
```

在then中返回自身会产生错误，在代码中不要这样操作：

```js
const promise = new Promise((resolve, reject) => {
  resolve(100)
})
const p1 = promise.then(value => {
  console.log(value)
  return p1
})
```



参考：

1. https://www.runoob.com/js/js-async.html
2. https://es6.ruanyifeng.com/#docs/generator-async
3. https://juejin.cn/post/6945319439772434469

