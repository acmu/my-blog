

分析源码：

https://github.com/Charles7c/charles7c.github.io



值得学习：

主要看 docs/.vitepress/config.ts 文件

```ts
import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';
import { metaData } from './config/constants';
import { head } from './config/head';
import { markdown } from './config/markdown';
import { themeConfig } from './config/theme';

export default withMermaid(
  defineConfig({
    lang: metaData.lang,
    title: metaData.title,
    description: metaData.description,

    cleanUrls: true,
    lastUpdated: true, // 显示最后更新时间

    head, // <head>内标签配置
    markdown: markdown, // Markdown配置
    themeConfig, // 主题配置
  }),
);
```



withMermaid 是什么？

支持 Mermaid 画图的工具，Mermaid可以让文字渲染出图片，如：

![image-2023022812048213 PM](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2023-02/28_13:20_ozh710.png)

head 的内容？

head里面可以加 scirpt，link，meta等等



配置代码提示：

1. jsdoc type hints
2. defineConfig function helper
3. ts type



