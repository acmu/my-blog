





为什么 data 里面 obj 依赖了 this.list 但 list 最开始是空的，list后面获取了数据，但 data 没有更新，必须改成 computed， 原因是啥？







vue 的 css scoped 原理与逻辑





深层对象的改变 会引起 computed 重新计算吗？如果引起的话，那是不是 相当于 watch 的 deep？computed是怎么改变的？





vue 传函数props的作用？有必要吗？

methods是指子组件抛出 ref，可以让父组件调用呀。。。

这两种方式都可以搞下





vue 中 computed 和 method 的区别

vue 中 watcher 的 immediate 属性

vue 写一个 computed 属性，让他被 watch，这样就可以watch一些零散的值了





watcher immediate 的用处（到底什么情况下，才算是非immediate 的？怎么界定的？他是为了编辑的时候，直接给默认值，而不触发watcher而使用的吗？）



设置了同样的值，多次执行，watch 还会执行吗？
