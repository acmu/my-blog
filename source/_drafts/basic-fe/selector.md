---
title: 选择器
date: 2009-09-09 09:09:09
tags: 草稿
---

用了很长时间的 css 了，只知道 .a > 空格 等简单的选择器，遇到一点复杂的情况就写了一坨代码在那，这样不好

上文档：[css 参考](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference)

/_ 存在 class 属性并且属性值包含以空格分隔的"logo"的 a 元素 _/

a[class~="logo"] {

padding: 2px;

}

对于非 disabled 的特殊样式

​ &:not([class~="disabled"]) {

​ &:hover {

​ color: blue;

​ }

​ }

​ &[class~="disabled"] {

​ &:hover {

​ color: red;

​ }

​ }

:last-of-type

:last-child

前面必须要写标签名，如果不写，应该默认是 div

<img src="https://raw.githubusercontent.com/acmu/pictures/master/uPic/2021-12/28_17:10_vIDtt9.png" alt="image-20211111112804508" style="zoom:50%;" />

你可以这样理解，这才是正确的顺序，而不是

p.a:nth-last-child(1)

```css
.a + .a {
    margin-left: 8px;
}
```

这种可以写类名，不必非要是 tagName
