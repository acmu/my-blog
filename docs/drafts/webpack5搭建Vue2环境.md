---
title: 明远视角：前端脚手架开发入门
date: 2022-11-10 23:12:20
tags: 周刊
---





webpack5搭建Vue2开发环境



由于工作需求，我要搭建个Vue 组件库，本文是我在使用webpack5搭建Vue2开发环境上的探索与记录。



### 新建项目

```
mkdir webpack5-vue2-boilerplate && cd webpack5-vue2-boilerplate
npm init -y
```

创建 `package.json`

安装 webpack

```
npm install --save-dev webpack webpack-cli
```

新建文件 `src/index.js`

```js
console.log('zmy')
```

这时可以直接调用 `npx webpack` 了，就会把文件生成在 `dist` 目录中。这样什么都没配置为啥可以运行成功呢？是因为 webpack 有自己的默认配置，默认入口是 `src/index.js`，出口就是`dist`目录。

一般使用 `webpack.config.js` 文件配置，我们新建一个：

```js
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
```

再运行一下，和刚才结果是一致的。

接着安装 Vue 相关内容，注意这里要指定vue2相关版本：

```
npm install --save-dev vue@2 vue-loader@15 vue-template-compiler@2
```

我们写的 `.vue` 文件需要使用 `vue-loader` 转换成JS，`vue-template-compiler` 要和 `vue-loader` 搭配使用。

增加 reslove 配置



最好直接看结果代码，加注释，之后进行分析吧，别这样一步一步走了







