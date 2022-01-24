---
title: scss 常用
date: 2009-09-09 09:09:09
tags: 草稿
---

### 变量定义

```scss
$myFont: Helvetica, sans-serif;
$myColor: red;
$myFontSize: 18px;
$myWidth: 680px;

body {
    font-family: $myFont;
    font-size: $myFontSize;
    color: $myColor;
}

#container {
    width: $myWidth;
}
```

### 变量运算

```scss
$myFontSize: 18px;

.a {
    width: 12px + $myFontSize;
}
```

### mixin 使用

这是带参数的，没有参数的不写括号即可

```scss
@mixin rtl($property, $ltr-value, $rtl-value) {
    #{$property}: $ltr-value;

    [dir='rtl'] & {
        #{$property}: $rtl-value;
    }
}

.sidebar {
    @include rtl(float, left, right);
}
```

转换后的 css

```css
.sidebar {
    float: left;
}
[dir='rtl'] .sidebar {
    float: right;
}
```

还可以用 Sass 来写

```scss
@mixin rtl($property, $ltr-value, $rtl-value) #{$property}: $ltr-value [dir=rtl]
    & #{$property}: $rtl-value .sidebar @include rtl(float, left, right);
```

其实就是用缩进代替大括号

[参考链接](https://sass-lang.com/documentation/at-rules/mixin)
