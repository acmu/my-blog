import { defineConfig } from 'vitepress';

export default defineConfig({
    title: '📖 明远博客',
    description: 'Just playing around.',
    base: '/vitepress-starter/',
    // head: [
    //     [
    //         'script',
    //         {
    //             src: 'https://giscus.app/client.js',
    //             'data-repo': 'acmu/vitepress-starter',
    //             'data-repo-id': 'R_kgDOJBVHNQ',
    //             'data-category': 'Announcements',
    //             'data-category-id': 'DIC_kwDOJBVHNc4CUcwU',
    //             'data-mapping': 'pathname',
    //             'data-strict': '0',
    //             'data-reactions-enabled': '1',
    //             'data-emit-metadata': '0',
    //             'data-input-position': 'bottom',
    //             'data-theme': 'preferred_color_scheme',
    //             'data-lang': 'zh-CN',
    //             crossorigin: 'anonymous',
    //             async: '',
    //         },
    //     ],
    // ],

    head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],

    // 1
    // 2
    // 3
    // 4
    // 5
    // 6
    // 7
    // 8
    // 9
    themeConfig: {
        sidebar: [
            {
                text: '周刊',
                items: [
                    { text: '01期', link: '/weekly/01' },
                    { text: '02期', link: '/weekly/02' },
                    { text: '03期', link: '/weekly/03' },
                    { text: '04期', link: '/weekly/04' },
                    { text: '05期', link: '/weekly/05' },
                    { text: '06期', link: '/weekly/06' },
                    { text: '07期', link: '/weekly/07' },
                    { text: '08期', link: '/weekly/08' },
                    { text: '09期', link: '/weekly/09' },
                    { text: '10期', link: '/weekly/10' },
                ],
            },
            {
                text: '知识',
                items: [
                    { text: '浮点数与二进制', link: '/knowledge/01' },
                    {
                        text: 'ESLint 和 Prettier 规范代码',
                        link: '/knowledge/02',
                    },
                    { text: '力扣 504 七进制转换', link: '/knowledge/03' },
                    { text: 'NPM 发布 TS 包', link: '/knowledge/04' },
                    { text: '小鹤双拼推荐', link: '/knowledge/05' },
                    {
                        text: '在 Mac 中像 Windows 一样切换应用',
                        link: '/knowledge/06',
                    },
                    { text: 'Chrome 96 更新', link: '/knowledge/07' },
                    { text: '浏览器插件入门实践', link: '/knowledge/08' },
                ],
            },
            {
                text: 'JavaScript',
                items: [
                    {
                        text: 'defineProperty 详细解读',
                        link: '/JavaScript/101',
                    },
                    { text: 'JavaScript 对象解读', link: '/JavaScript/102' },
                    {
                        text: 'JavaScript 的对象与继承',
                        link: '/JavaScript/103',
                    },
                    {
                        text: 'JavaScript 异步与 Promise',
                        link: '/JavaScript/104',
                    },
                    { text: 'JavaScript 正则理解', link: '/JavaScript/105' },
                    {
                        text: '周下载量超1亿的库是如何判断JS类型的？',
                        link: '/JavaScript/106',
                    },
                    { text: 'JavaScript Symbol 解读', link: '/JavaScript/107' },
                    { text: '使用 npm link 调试包', link: '/JavaScript/108' },
                    { text: '可选链运算符', link: '/JavaScript/109' },
                ],
            },
        ],
    },
});
