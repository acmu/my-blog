





单向数据流：数据从父组件的改变传给子组件

@事件

当父组件只需要拿到子组件状态时，那么事件监听即可，但如果要控制子组件状态时，两种方案：

1. 状态直接放在父组件
1. 父组件传给子组件校验函数，约定校验以及之后的操作

子组件 父组件都存在着类似的数据时，那么就一个很麻烦且难的问题：数据同步

如：父组件存了子组件告诉我的数据，但是子组件可能被卸载了，有重新加载了，但是父组件存的还是原来的数据，而且也没有做到控制子组件，就会造成数据不一致的情况

ref 不好

ref 还要等到 dom 渲染完成后，被 js 引用了，才能调用，这也是不好的原因之一

而且他挂着引用，应该同时也不会释放内存，导致不能被垃圾回收掉

对 还有的让你传一下 default-expand-all default value，也 tmd 很 zz







```
<el-tree
  :data="data"
  show-checkbox
  node-key="id"
  :default-expanded-keys="[2, 3]"
  :default-checked-keys="[5]"
  :props="defaultProps">
</el-tree>

```

组件还要加上 default-checked-keys，无法理解，直接用 value 不就得了，这就是 value 没有完全受控的弊端

https://element.eleme.io/#/zh-CN/component/tree
