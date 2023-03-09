就是看 guide

## Asset Management

这节学习如何导入图片等资源

没有webpack之前，大家都使用 grunt 或 gulp 等处理资源从 src 到 dist 或build目录，但 webpack 会动态解析依赖地图，如果没有使用的资源，那么就不会被解析

webpack 更厉害的是，它可以引入任何类型文件，只要有loader 就行

### 加载css

下面以css为例，看看如何引入到js的

```
npm install --save-dev style-loader css-loader
```

改配置

```diff
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
```

Module loaders 可以链式的写，使用顺序是从后往前的，先使用 css-loader 得到结果后，传给 style-loader 再使用 style-loader。

这里使用正则来决定文件被哪些 loader 处理。

css 文件 import 之后 就可以正常展示了，可以从html源码看到，head 标签中 加上了 style，（注意：不要直接看网页源码，因为它是通过js动态加上的）

css 应该被最小化代码，你还可以使用 scss postcss 等写出更优雅的css

### 加载图片

```
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                // v5 版本自带的
                type: 'asset/resource',
            },
```

使用这个就可以轻松的加载图表，如：`import MyImage from './my-image.png'`，js就拿到图片的url

css 里你用了css-loader的话，使用 `url('./my-image.png')` 也能拿到

html 里用了 html-loader 的话，使用 `<img src="./my-image.png" />` 也是一样



`asset/resource` 同样也可处理字体



### 加载数据

如 json、xml、csv 等，json 是默认集成的，你直接 `import Data from './data.json'` 就能获取到数据，但 xml 等需要 xml-loader。

这种处理对于数据可视化很有用，如d3。

还可以自定义parser实现转换成 json 数据，如 `toml`, `yaml` or `json5` 文件（json5 支持注释）



### 全局资源

webpack 可以根据你使用资源的不同文件去生成不同目录的资源，而不是全都一堆放到 assets 里面。
