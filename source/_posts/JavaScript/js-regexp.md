---
title: JavaScript 正则理解
date: 2022-07-17 22:30:37
tags: JavaScript
---

正则表达式可以帮我们匹配字符串，大多数语言都有自己对于正则表达式的实现，这里我们看下JavaScript的实现。

## 正则的标准

它由正则表达式主体和修饰符组成

### 修饰符

| 修饰符 | 描述                                                     |
| :----- | :------------------------------------------------------- |
| i      | 执行对大小写不敏感的匹配。                               |
| g      | 执行全局匹配（查找所有匹配而非在找到第一个匹配后停止）。 |
| m      | 执行多行匹配。                                           |

### 正则表达式主体

也叫「模式」pattern

方括号或圆括号，匹配你想要的字符范围

| 表达式             | 描述                                                    |
| :----------------- | :------------------------------------------------------ |
| [abc]              | 查找方括号之间的任何字符。                              |
| [^abc]             | 查找任何不在方括号之间的字符。                          |
| [0-9]              | 查找任何从 0 至 9 的数字。                              |
| [a-z]              | 查找任何从小写 a 到小写 z 的字符。                      |
| [A-z]              | 查找任何从大写 A 到小写 z 的字符。（根据ASCII码顺序的） |
| (red\|blue\|green) | 查找任何指定的选项。（非单个字符，可以是连续的）        |

有一些字符集是很常用的，如`[0-9]`代表数字，每次都这样写就比较麻烦，所以正则提供了元字符，如下（小写代表匹配，大写代表排除）：

| 元字符                                                       | 描述                                        |
| :----------------------------------------------------------- | :------------------------------------------ |
| .                                                            | 查找单个字符，除了换行和行结束符。          |
| \w                                                           | word 查找数字、大小写字母、下划线。         |
| \W                                                           | 非 word                                     |
| \d                                                           | digit 查找数字                              |
| \D                                                           | 非 digit                                    |
| \s                                                           | whitespace 查找空白字符。                   |
| \S                                                           | 非 whitespace                               |
| \b                                                           | Word boundary 匹配单词边界。                |
| \B                                                           | 非 Word boundary                            |
| \0                                                           | 查找 NULL 字符。                            |
| \n                                                           | 查找换行符。                                |
| \f                                                           | 查找换页符。                                |
| \r                                                           | 查找回车符。                                |
| \t                                                           | 查找制表符。                                |
| \v                                                           | 查找垂直制表符。                            |
| [\xxx](https://www.runoob.com/jsref/jsref-regexp-octal.html) | 查找以八进制数 xxx 规定的字符。             |
| [\xdd](https://www.runoob.com/jsref/jsref-regexp-hex.html)   | 查找以十六进制数 dd 规定的字符。            |
| [\uxxxx](https://www.runoob.com/jsref/jsref-regexp-unicode-hex.html) | 查找以十六进制数 xxxx 规定的 Unicode 字符。 |

以上元字符有些是常用字符的集合，有些是不好表示的字符的替代展示

上文讲的，都是对于单个字符，如果你想要这个模式出现10次，怎么办呢，难道要写10遍吗？不用那么麻烦的，只需要使用到量词即可

### 量词

| 量词                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [n+](https://www.runoob.com/jsref/jsref-regexp-onemore.html) | 匹配任何包含至少一个 n 的字符串。例如，/a+/ 匹配 "candy" 中的 "a"，"caaaaaaandy" 中所有的 "a"。 |
| [n*](https://www.runoob.com/jsref/jsref-regexp-zeromore.html) | 匹配任何包含零个或多个 n 的字符串。例如，/bo*/ 匹配 "A ghost booooed" 中的 "boooo"，"A bird warbled" 中的 "b"，但是不匹配 "A goat grunted"。 |
| [n?](https://www.runoob.com/jsref/jsref-regexp-zeroone.html) | 匹配任何包含零个或一个 n 的字符串。例如，/e?le?/ 匹配 "angel" 中的 "el"，"angle" 中的 "le"。 |
| [n{X}](https://www.runoob.com/jsref/jsref-regexp-nx.html)    | 匹配包含 X 个 n 的序列的字符串。例如，/a{2}/ 不匹配 "candy," 中的 "a"，但是匹配 "caandy," 中的两个 "a"，且匹配 "caaandy." 中的前两个 "a"。 |
| [n{X,}](https://www.runoob.com/jsref/jsref-regexp-nxcomma.html) | X 是一个正整数。前面的模式 n 连续出现至少 X 次时匹配。例如，/a{2,}/ 不匹配 "candy" 中的 "a"，但是匹配 "caandy" 和 "caaaaaaandy." 中所有的 "a"。 |
| [n{X,Y}](https://www.runoob.com/jsref/jsref-regexp-nxy.html) | X 和 Y 为正整数。前面的模式 n 连续出现至少 X 次，至多 Y 次时匹配。例如，/a{1,3}/ 不匹配 "cndy"，匹配 "candy," 中的 "a"，"caandy," 中的两个 "a"，匹配 "caaaaaaandy" 中的前面三个 "a"。注意，当匹配 "caaaaaaandy" 时，即使原始字符串拥有更多的 "a"，匹配项也是 "aaa"。 |
| [n$](https://www.runoob.com/jsref/jsref-regexp-ndollar.html) | 匹配任何结尾为 n 的字符串。                                  |
| [^n](https://www.runoob.com/jsref/jsref-regexp-ncaret.html)  | 匹配任何开头为 n 的字符串。                                  |
| [?=n](https://www.runoob.com/jsref/jsref-regexp-nfollow.html) | 匹配任何其后紧接指定字符串 n 的字符串。                      |
| [?!n](https://www.runoob.com/jsref/jsref-regexp-nfollow-not.html) | 匹配任何其后没有紧接指定字符串 n 的字符串。                  |

`+`是`{1,}`，`*`是`{0,}`，`?`是`{0,1}`，这些也只是个数范围的简写罢了

`^n`是匹配以n开头，`n$`是匹配以n结尾

`a(?=n)`是匹配后面为n的a字符串，`a(?!n)`反之，这个叫做先行断言（lookahead assertion）

`(?<=n)a`是匹配前面为n的a字符串，`(?<!n)a`反之，这个叫做后行断言（lookbehind assertion），这种方式并不是所有浏览器都支持

`^n`可以用后行断言表示，`n$`可以用先行断言表示，这两个也算是另一种形式的简写啦

**贪婪匹配与非贪婪匹配**

`+`和`*`都是可以匹配多个的，那么他们默认是贪婪匹配，就是尽可能的多匹配内容，那么你想让他们尽可能的少匹配内容时，只要`+`和`*`的后面加上`?`即可，他们就变成了非贪匹配

## JavaScript 中的正则使用

### RegExp 对象

**test 方法**

查看字符串是否符合你的正则

`/\d/.test('sdfd1')`

**toString 方法**

查看正则表示的字符串模式

`new RegExp('\\d','g').toString()`

**exec 方法**

```js
const regex1 = RegExp('foo*', 'g');
const str1 = 'table football, foosball';
let array1;

while ((array1 = regex1.exec(str1)) !== null) {
  console.log(`Found ${array1[0]}. Next starts at ${regex1.lastIndex}.`);
  // expected output: "Found foo. Next starts at 9."
  // expected output: "Found foo. Next starts at 19."
}
```

### 字符串的方法

**search 方法**

`'df1'.search(/\d/)`

**match 方法**

`'The rain in SPAIN stays mainly 3 in2 the plain1'.match(/\d/g)` 结果是 `['3', '2', '1']`

**replace 方法**

`'haha6 nb 345 lihai5'.replace(/\d/g, 'zmy')` 结果`'hahazmy nb zmyzmyzmy lihaizmy'`

**split 方法**

`'haha6 nb 345 lihai5'.split(/\d/)` 结果`['haha', ' nb ', '', '', ' lihai', '']`，注意：边界内容会变成空字符串



在线测试工具：https://regexr.com/

参考：

1. https://www.runoob.com/jsref/jsref-obj-regexp.html
