---
title: 草稿
date: 2009-09-09 09:09:09
tags: 草稿
---

[官方文档](https://momentjs.com/docs/#/get-set/date/)

## 获取时间戳

moment().valueOf() 或 +moment()

## 加减时间

[字符意义](https://momentjs.com/docs/#/manipulating/add/)

moment().subtract(1, 'months');

## 获取字符串的时间戳

moment('2021-12-08', 'YYYY-MM-DD')

[字符意义](https://momentjs.com/docs/#/parsing/string-format/)

moment('2021-12-08', 'YYYY-MM-DD').format('YYYY-MM-DD HH mm ss')

'2021-12-08 00 00 00'

这种没写时分秒的，会默认都是 0
