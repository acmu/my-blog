---
title: ESLint 和 Prettier 规范代码
date: 2020-08-02 11:26:20
tags: 工程化
---

![头图](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2021-12/28_13:01_rXggN1.png)

## 为什么要用 ESLint？

它可以帮助开发者发现一些显而易见的错误，如：使用了未定义的变量等，还可以结合一些第三方的规则去检测你的代码是否规范，如：react 的 prop-types 、 hooks 等，还能一定程度上美化代码，如：字符串使用单引号还是双引号、一行代码末尾是否要加分号等。

## 为什么要用 Prettier？

刚刚有说到，[ESLint](https://eslint.org/) 只能一定程度上美化代码，而  [Prettier](https://prettier.io/) 能完成美化代码的全部工作，如：一行超过 80 个字符就截断换行、更好看的三元运算符展示、给 JSX 加括号展示等，并且它不止于 JavaScript，还可以美化 CSS、Markdown 等多种语言。

并且很多大的项目都已经使用上了，如 [React](https://github.com/facebook/react)、[AntD](https://github.com/ant-design/ant-design/) 等等，尤其是对于团队大、开发人多的情况，这种代码的自动化审查工具，能让 Code Review 更友好，能让同事更关注你的实现的业务与代码逻辑本身，而非还换不换行、加不加逗号，这种小事，而且还能一定程度上实现团队内代码风格的统一。（这里为什么说“一定程度”，是因为有很多代码风格是工具检查不了的，比如有的人会给变量 const 有的会给 let、有的用 switch 有的是 if else 等等，所以想要规范这些，最好是团队内有个代码风格指南文档，明确指出：这样是好的，那样是不行的）

## 使用 ESLint & Prettier

安装：

```javascript
npm i -D eslint prettier babel-eslint eslint-plugin-prettier eslint-config-prettier
```

如果你还使用 JSX 还需另外安装：

```javascript
npm i -D eslint-plugin-react-hooks eslint-plugin-react
```

eslint 和 prettier 只会在开发环境用到，`babel-eslint` 是 `eslint-plugin-prettier` 使用 Prettier 格式代码`eslint-config-prettier` 关闭 ESLint 与 Prettier 冲突的配置项 .prettierignore & .eslintignore

```javascript
/dist
/build
/node_modules
```

.prettierrc.js

```javascript
module.exports = {
    singleQuote: true,
    trailingComma: 'all',
    proseWrap: 'never',
    arrowParens: 'avoid',
};
```

.eslintrc.js （不使用 JSX，只是 JS 文件）

```javascript
// const ERROR = 'error';
const WARN = 'warn';
const OFF = 'off';

module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
        jest: true,
    },
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    parser: 'babel-eslint',
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': WARN,
        'no-console': OFF,
        'no-debugger': OFF,
    },
};
```

.eslintrc.js （使用 JSX）

```javascript
const ERROR = 'error';
const WARN = 'warn';
const OFF = 'off';

module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
        jest: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:prettier/recommended',
    ],
    parser: 'babel-eslint',
    plugins: ['react', 'react-hooks', 'prettier'],
    rules: {
        'prettier/prettier': WARN,
        'no-console': OFF,
        'no-debugger': OFF,
        'react-hooks/rules-of-hooks': ERROR,
        'react-hooks/exhaustive-deps': WARN,
    },
};
```

npm script 中加上这两句（代表格式所有的如下结尾的文件）：

```javascript
  "scripts": {
    // ...
    "prettier": "prettier --write '**/*.{js,jsx,less,md}'"
  }
```
