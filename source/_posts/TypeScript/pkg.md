---
title: NPM 发布 TS 包
date: 2020-09-13 18:18:49
tags: TS
---

![](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2021-12/30_11:33_V4AWDN.png)

本文使用简单的 TypeScript（即 TS），讲解 NPM 包的发布流程，包括代码格式化、lint、单元测试等

## 为什么要用 TS

-   更健壮的代码以及更易维护。
-   使用这个包的人，可以使用 ts 或 js。但如果你只用 js 写的话，当你的包变流行之后，ts 使用者就需要类型定义，这时再加的话，就耗时间、易出错还难更新。

-   当你在代码文件中写了类型定义，使用者就不需要单独去下载 `@types/xxx` 类型定义了。
-   强类型定义也算是一种文档的自我描述，使代码易读。

-   即使使用者不用 ts，但一些编辑器也会根据类型定义给你更好的代码提示。

## 开始项目

````shell
# 建目录
mkdir my-awesome-greeter && cd my-awesome-greeter

# 使用 git
git init
echo "# My Awesome Greeter" >> README.md
git add . && git commit -m "Initial commit"

# 添加 github 远程仓库，下面地址可以替换成你自己的远程仓库
git remote add origin git@github.com:Acmu/zmy-greet.git
git push -u origin master

# 初始化 npm 项目，把 name 改为你想要上传的包名，比如我的是 zmy-greet
npm init -y

# 添加 gitignore
echo "node_modules" >> .gitignore

# 安装 ts
npm install --save-dev typescript

# 为了使 ts 可以正常编译，需要添加配置文件
touch tsconfig.json
# 内容如下
```
{
  "compilerOptions": {
    "target": "es5", // 编译目标代码为 es5 的，为了兼容更多的浏览器
    "module": "commonjs", // 使用 cjs 模块解析机制
    "declaration": true, // 当打包时，生成类型定义文件
    "outDir": "./lib", // 打包的地址为 ./lib
    "strict": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "**/__tests__/*"] // 不编译 node_modules 和 __tests__ 文件夹，因为他们只在开发时使用
}
```

# 编写代码
mkdir src && touch src/index.ts
````

代码内容如下：

```typescript
export const Greeter = (name: string) => `Hello ${name}`;
t;
```

添加 build 命令以及运行：

![img](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2021-12/30_11:27_cArxJ1.png)

![img](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2021-12/30_11:27_nyjAiS.png)

这时就能看到生成的 lib 文件夹以及 .d.ts 声明文件了。

这时，应该把 lib 文件夹也忽略掉。

![img](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2021-12/30_11:14_ipOthB.png)

lib 前的反斜线代表只忽略根路径下的 lib，如果其他子文件夹有 lib 是不会忽略的，而 node_modules 就是不管在哪里都会被忽略

添加格式化和 lint

```typescript
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-plugin-prettier eslint-config-prettier
```

添加配置文件

```javascript
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
  },
};

// .prettierrc
{
  "printWidth": 100,
  "trailingComma": "all",
  "singleQuote": true,
  "proseWrap": "never",
  "arrowParens": "avoid"
}

// .prettierignore
node_modules
/lib

// .eslintignore
node_modules
/lib
```

再添加格式化命令

```javascript
    "format": "prettier --write '**/*.{js,jsx,ts,tsx}'",
    "lint": "eslint . --ext '.js,.jsx,.ts,.tsx'"
```

这时可以运行一下

```javascript
npm run lint
npm run format
```

![img](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2021-12/30_11:27_6WHReR.png)

当我们把包上传到 npm 仓库时，肯定只希望上传打包后的文件，而不是源代码，可以通过两种方式来实现，分别是编写 `.npmignore` 文件，和使用 `package.json` 中的 files 字段，后者更好一些，因为前者要写的东西可能会有很多。`package.json` 中的 files 可以这样写：

```javascript
  "files": [
    "lib/**/*"
  ],
```

现在就只有 lib 文件夹下的才会上传到 npm 仓库啦，README.md 和 package.json 已经默认加入了。

增加测试：

```javascript
npm install --save-dev jest @types/jest ts-jest
```

编写配置文件 `jest.config.js` 如下

```javascript
module.exports = {
    roots: ['<rootDir>/src'],
    testMatch: [
        '**/__tests__/**/*.+(ts|tsx|js)',
        '**/?(*.)+(spec|test).+(ts|tsx|js)',
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
};
```

增加 test 命令

```javascript
    "test": "jest",
```

增加测试文件 `src/__test__/Greeter.test.ts` 如下

```javascript
import { Greeter } from '../index';

test('My Greeter', () => {
    expect(Greeter('Carl')).toBe('Hello Carl');
});
```

执行 test 命令查看

![img](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2021-12/30_11:27_j5QlA8.png)

这里可以下载 vscode jest 插件，进行测试用例的实时结果查看

![img](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2021-12/30_11:27_GFmmkE.png)

使用 npm [特殊命令](https://docs.npmjs.com/misc/scripts)：

对于一个优秀的包，我们应该将操作尽可能的自动化，接下来看几个特殊的命令：

| 命令 | 操作 | 备注 |
| --- | --- | --- |
| prepare | npm run build | 在打包和发布之前运行，适合 build |
| prepublishOnly | npm test && npm run lint | 在 prepare 之前，并且只有 npm publish 时才运行，这里应该执行测试和 lint，保证我们不会发布不好的代码 |
| preversion | npm run lint | 在新建 tag 之前运行 |
| version | npm run format && git add -A src | 在改了 tag 之后，但 commit 之前 |
| postversion | git push && git push --tags | 在改了 tag 之后，commit 之后 |

最后如下，再添加上 main 和 types 字段

![img](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2021-12/30_11:27_Ni3P1w.png)

登陆你的 npm 账号，执行 npm publish 命令，注意要使用 npm 默认源哦

![img](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2021-12/30_11:27_yuuO9X.png)

这样就发布成功了，也执行了 prepare 和 prepublishOnly 命令，下面使用 npm version patch 升级个版本看一下：

![img](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2021-12/30_11:27_W8oIL8.png)

也看到如预期执行了命令，最后再 npm publish 一下，就能更新版本了。

![img](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2021-12/30_11:14_BhTAE6.png)

![img](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2021-12/30_11:28_dE1WDJ.png)

最后使用包如下：

![img](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2021-12/30_11:14_Vix3LL.png)

### 结语

学到了给 ts 写 lint 配置、jest 简单 ts 配置、npm 的特殊命令，是一个比较规范的包发布流程。

### 参考

[这篇文章](https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c)

[对应仓库](https://github.com/Acmu/zmy-greet)
