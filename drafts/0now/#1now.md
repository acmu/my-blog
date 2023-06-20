# CommonJS require 循环依赖



写个网址导航？



 























当 require 循环调用时，模块不能完全执行，如下示例：

`a.js`:

```js
console.log('a starting');
exports.done = false;
const b = require('./b.js');
console.log('in a, b.done = %j', b.done);
exports.done = true;
console.log('a done');
```

`b.js`:

```js
console.log('b starting');
exports.done = false;
const a = require('./a.js');
console.log('in b, a.done = %j', a.done);
exports.done = true;
console.log('b done');
```

`main.js`:

```js
console.log('main starting');
const a = require('./a.js');
const b = require('./b.js');
console.log('in main, a.done = %j, b.done = %j', a.done, b.done);
```

我们执行 `main.js`，结果如下：

```
main starting
a starting
b starting
in b, a.done = false
b done
in a, b.done = true
a done
in main, a.done = true, b.done = true
```

分析输出内容：

第1行：`main.js`正常执行，输出`main starting`

第2行：由于`main.js`  `require('./a.js')` 所以执行`a.js`的代码，那么输出`a starting`

第3行：之后 a 引用了 b，所以输出 `b starting`

第4行：b 又引用了 a，注意这里因为a还引用了 b，如果继续走下去，那么就会无限循环，node对于这种情况做了特殊处理，当发现循环时，那么只拿到a当时导出的对象，给b，之后继续执行代码，所以这里输出`in b, a.done = false`， 因为 a 文件代码还没有执行完成，所以 a.done 是 false

第5行：b执行完成。输出 `b done`，这时 b.done 是 true 了

第6行：回到a文件，输出`in a, b.done = true`，这时 a.done 是 true 

第7行：a执行完成，输出`a done`

第8行：回到 main 文件，输出 `in main, a.done = true, b.done = true`




参考：https://nodejs.org/api/modules.html#modules_cycles