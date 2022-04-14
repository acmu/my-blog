---
title: html
date: 2009-09-09 09:09:09
tags: 草稿
---

## 内联元素没有 margin-top

如上，只有 left 和 right，没有 top 和 bottom，如果想要使用，就得 display: inline-block（为什么这样呢？）

### 捕获机制

真正的 content 在上层，点击时，会拦截下层的点击，但如果点击 content 的 margin，那么不会拦截

left 0 right 0 相对于的是四个角

### div 默认底色

div 默认底色是透明的，不是白色背景的，当你把 div 用 position fixed 的方式来展示的话，就会发现，所以一般需要给上白色底色

### js 触发 dom 事件

```js
document.querySelector('#ii').click();
```

js 是可以触发按钮点击的
