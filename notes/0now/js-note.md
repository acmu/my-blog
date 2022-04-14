# JS 基础知识



## Map 类型 vs Object

Map 的 key 可以很丰富，可以是 number object 等



## 数字





## 字符串

### 正则



### `String.prototype.replace()`

**语法：**

```js
replace(regexp, newSubstr)
replace(regexp, replaceFunction)

replace(substr, newSubstr)
replace(substr, replaceFunciton)
```

**参数：**

`regexp`

一个正则，如果原字符串匹配到了，就用第二个参数替换

`substr`

一个字符串，如果原字符串匹配到了第一个，就用第二个参数替换

`newSubstr`

能替换的值，支持特殊字符

`replaceFunction`

在替换时，可执行这个函数，支持特殊字符

返回值：

不修改原值，返回替换后的值

**特殊字符：**

`$$`

插入`$`

`$&`

插入匹配了的子串

`$\``

插入匹配子串的前面部分

`$'`

插入匹配子串的后面部分

`$n`

n是数字，范围[1, 100]，匹配第几组

`$<Name>`

和 n 类似，只不过这里是组名

[正则表达式 命名捕获组](https://developer.aliyun.com/article/683079)



**使用函数的特殊字符**

match

匹配的子串

p1, p2, p3...

数字捕获组，有多少个，这里就有多少个参数

offset

子串起始下标

string

原始字符串

groups

如果有命名组，那么这里会存放对应的key，value



示例🌰

```js

const str = 'zmy_123_234';

// 直接替换，找到第一个匹配的就替换
console.log(str.replace('2', 'nb'));
// 使用全局替换
console.log(str.replace(/2/g, 'nb'));
// 正则 使用 $& 特殊字符
console.log(str.replace(/2/g, '$&nb'));
// 字符串 使用 $& 特殊字符
console.log(str.replace('2', '$&nb'));

// 定义正则命名捕获组
const a = /release-(?<major>\d*)-(?<minor>\d*)-(?<version>\d*)/;

// 替换
console.log('release-11-2-10'.replace(a, '$<major>,$2,$<version>'));

// 如果有命名捕获组，那么 groups 就不是 undefined
function replacer(match, p1, p2, p3, offset, string, groups) {
  // groups: {zmy: '#$*%'}
  // match: "abc12345#$*%"
  // offset: 0
  // p1: "abc"
  // p2: "12345"
  // p3: "#$*%"
  // string: "abc12345#$*%"
  return [p1, p2, p3].join(' - ');
}

let newString = 'abc12345#$*%'.replace(/([^\d]*)(\d*)(?<zmy>[^\w]*)/, replacer);
console.log(newString); // abc - 12345 - #$*%


```



反向引用是什么？

`replaceAll` 就等于 普通正则加了一个 g 描述符。



[mdn链接](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)







## 数组

### `Array.prototype.reverse()`

使用原地算法反转数组，会改变原数组

### join

直接调用 join，没有参数，是逗号

如果数组中的值是`undefined` `null` 或 `[]`，会被当成空字符串

sort

split

splice



## 类的原理

继承、面向对象

js 中的类





