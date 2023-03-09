就是看 guide

## getting started

### Basic Setup

安装 webpack webpack-cli

设置 "private": true,

这时可以直接用示例代码执行 webpack，代码就能直接打包到 dist 中。

可以看到，打包的代码很简洁，比 v4 版本好多了（这里我做了格式化）

```js
document.body.appendChild(
    (function () {
        const e = document.createElement('div');
        return (e.innerHTML = _.join(['Hello', 'webpack'], ' ')), e;
    })()
);
```

这里以 lodash 引入的问题为例，引出了下面的 Creating a Bundle

### Creating a Bundle

分离dist和 src，即在 dist中写 index.html，（虽然现在 index.html 是手写的，但后面我们会自动生成）

使用 `npx webpack` 打包

默认入口是 `src/index.js` 出口是 `dist/main.js` 

打开 index.html 已经能正常显示效果啦

### Modules

import 和 export 语句在 es2015 就官方化了，现代浏览器都支持了，但有些浏览器还是不认识，但不用担心，webpack可以把import 和 export 编译成他们认识的样子

webpack 本身并不编译代码，如果你想编译的话，请使用babel

### Using a Configuration

`webpack.config.js` 是配置文件，有了之后要这样执行`npx webpack --config webpack.config.js`

如果你的配置文件就叫`webpack.config.js`，那其实命令行是不用写`--config`的，这里写是为了展示如何配置其他名称的文件。

配置文件要比使用 CLI 方便的多，它这里可以配置更复杂的 loader、plugin、resolve 等。

### NPM Scripts

如果想通过 npm run 往 script 里面加参数，那么要使用 `npm run build -- --color` 两个横线分割

如 `npm run build -- --color` ，并且pkg中的`scripts` 里包含 `"build": "webpack"`

就等于

`npx webpack --color`



注意：不要使用  webpack 编译不可信的代码，这可能使你的电脑或服务器遭到恶意攻击







