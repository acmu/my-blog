# Output Management



我 们已经手动处理了引入的资源，但当你的应用变大并且使用hash文件和输出多个文件时，就很难手动维护 index.html 了，下面介绍用插件来维护。

HtmlWebpackPlugin

# Development



mode: 'development', 

能预置很多开发环境的内容



```diff
devtool: 'inline-source-map',
```

可以使用 source map



实时打包文件有3中方式

1. webpack 的 watch mode，即参数加上 --watch
2. 使用 webpack-dev-server（这里打包生成的文件是在内存的，所以文件系统看不见）
3. 使用 webpack-dev-middleware，能更自定义化，可以结合 express 使用

一些编辑器的自动保存功能可能影响 webpack 的watch，所以需要视情况关闭掉自动保存

# Code Splitting

Code splitting 是 webpack 最吸引人的功能，它可以帮你按需加载或并行加载，实现更小的打包体积和控制资源加载优先级，如果正确配置，那对于你网页的加载时间有重要影响。

如果我们有2个入口，他们都引用了 lodash，那么打包的话，这两个包都会有 lodash，就会打包重复的内容

如何防止重复：使用 entry 的 dependOn 配置，这里可以把公共包抽取出来，或者直接使用`SplitChunksPlugin` 他能帮你自动抽取。



动态加载方案

推荐使用 import() 语法，他基于Promise，是ES标准，为了兼容，webpack 还支持 require.ensure 方法。



Prefetching/Preloading modules

```js
import(/* webpackPrefetch: true */ './path/to/LoginModal.js');
```

通过 import() 加资源注释的方式，实现资源 prefetch。

 `<link rel="prefetch" href="login-modal-chunk.js">` 



错误使用 webpackPreload 可能造成性能问题，慎用。


当你使用了代码分割技术，那就应该可视化的看一下效果，可以使用 [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) 等工具查看



# Caching

当生成了 dist 文件后就该部署了，浏览器会访问我们的文件，它可以使用缓存来减少不必要的网络开销，但错误的使用也会产生头疼的问题 。

可以在 `output.filename` 设置中括号形式生成哈希（substitutions），如 `[contenthash]` 

```diff
filename: '[name].[contenthash].js',
```

但是当你多次build之后，发现每次build的hash都不一样，尽管你没有更改源代码（高版本webpack可能没有这个问题）

这是因为入口的样板导致的，你应该做如下操作。

配置这些可以自动抽出公共包，放到 vendor 中

```js
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
```

但这时，你如果新引用一个文件进来，会导致全部文件的hash改变，这是因为 module.id 改变了，所以你应该还设置

```diff
     moduleIds: 'deterministic',
```

这样，不管你新增还是删除其他引用的文件，内容不变的，hash就不变

# Authoring Libraries

创作一个库

lodash 要放在 devDep 里面，否则我们的库就会臃肿（bloated）

```diff
library: "webpackNumbers",
```

加了这个，umd使用这个变量即可引用，但也想要 esm cjs 这种引入，怎么办？

```
        globalObject: 'this',
        library: {
            name: 'webpackNumbers',
            type: 'umd',
        },
```

这样配置

但这时，你打包出来的内容很大，因为有lodash在，如何解决？lodash应该被主工程依赖，而不是我们的写的工具包，即他应该是 peer dep，所以可以这样配置

```
    externals: {
        lodash: {
            commonjs: 'lodash',
            commonjs2: 'lodash',
            amd: 'lodash',
            root: '_',
        },
    },
```

如果 lodash 被这样使用了

```js
import A from 'library/one';
import B from 'library/two';

// ...
```

那么可以用正则匹配来解决

```js
module.exports = {
  //...
  externals: [
    'library/one',
    'library/two',
    // Everything that starts with "library/"
    /^library\/.+$/,
  ],
};
```

最后，你可以发布到 npm 了，并且在 unpkg 上可以看到

如果你的包里有css，那么使用  MiniCssExtractPlugin 可以压缩css。

（这里刷新了我的认知，npm写上 peer dep 其实用处不大，主要还是得 externals 配置上）

# Environment Variables

```bash
npx webpack --env goal=local --env production --progress
```

这里可以给webpack传入环境变量

```js
  console.log('Goal: ', env.goal); // 'local'
  console.log('Production: ', env.production); // true
```

这个环境变量是在 `webpack.config.js` 中使用的，不是在编译的源码里用的（那如何在编译的源码拿到呢？）

# Build Performance

使用最新版本的 webpack node npm 等



让loader处理更少的文件，使用 include 限制处理范围只到 src

少用  loader/plugin  他们都需要启动时间



resolve 配置，减少模块解析



尽量使用 dll 即 `DllPlugin` 他能减少编译时间



减小代码量：使用更小的三方库、多分chunk，每个chunk尽量小



多线程加快loader



持续利用缓存



以下推荐用于开发环境：

编译在内存能加快速度，省的去与硬盘操作

大多情况  `eval-cheap-module-source-map`  是最好选择

不要使用生产环境的工具



对于 ts 只用 tsc 编译，不要检查类型，使用`fork-ts-checker-webpack-plugin` 这个检类型



生产环境：Source maps 很贵，是否真的需要？

