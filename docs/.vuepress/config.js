module.exports = {
    // 基础路径，网页部署时如果代理到非根路径时配置
    // 例如 base = "/bar/", <img :src="$withBase('/foo.png')" alt="foo">
    // nginx 代理的时候也可以将这个静态网页代理到 xxxxx/bar
    base: "/",
    // 设置语言（不一定有用）
    lang: "zh-cn",
    // 页面抬头
    title: 'Wayne Vin',
    // 仅仅是描述
    description: 'Wayne \'s Home',
    head: [
        ['link', { rel: 'icon', href: '/boy.png' }]
    ],
    // dev 环境下的ip
    host: '0.0.0.0',
    // dev 环境下的端口号
    port: '8080',
    // 制定客户端临时文件路径
    // temp: 'path/to/@vuepress/core/.temp',
    // build 时候的输出目录, 默认 .vuepress/dist
    // dest: '.vuepress/dist' 
    // locales 多语言配置另行查看官网
    markdown: {
        // 代码块内，是否显示行号
        lineNumbers: true,
    },
    // 主题配置
    themeConfig: {
        // 是否启用导航栏
        navbar: true,
        // 禁用搜索框
        search: true,
        // 搜索框最多显示结果个数
        searchMaxSuggestions: 6,
        // 导航栏 logo
        logo: '/boy.png',
        // 最后一次 git 提交的 时间， （可以使用false 禁用）
        // lastUpdated: "更新时间",
        lastUpdated: false,
        // 底部下一篇链接，默认true
        nextLinks: true,
        // 底部上一篇链接，默认true
        prevLinks: true,
        // 页面滚动
        // smoothScroll: true,
        // 导航栏配置
        nav: [
            { text: 'Home', link: '/' }, // 导航栏按钮名字和链接
            { text: '笔记非博客', link: "/blog/博客笔记目录.md" },
            { text: '我的简历', link: "/CV/" },
            { text: 'CodeServer', link: 'https://www.dgman.work/codeserver' },
            { // 下拉狂
                text: '常用网站',
                ariaLabel: 'Web Menu',
                items: [
                    { text: "百度", link: "https://www.baidu.com" },
                    { text: "谷歌", link: "https://www.google.com" },
                ]
            }
        ],
        displayAllHeaders: true,
        // 侧边栏配置
        sidebar: 'auto',
        // [
        //     ["/", "HOME"], // 测边栏地址，侧边栏命名
        //     { // 侧边栏分组
        //         title: 'Group 1',   // 必要的
        //         path: '/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
        //         collapsable: false, // 可选的,折叠, 默认值是 true,
        //         sidebarDepth: 1,    // 可选的, 默认值是 1
        //         children: [
        //             ["/", "家"],
        //             '/'
        //         ]
        //     },
        // ],
        // 全局侧边栏深度, 默认1
        sidebarDepth: 1,
        // 侧边栏显示所有标题链接, 默认false
        displayAllHeaders: false,
        // 滚动查看页面时是否自动更新标题栏hash值，默认true
        activeHeaderLinks: true,
    },
    configureWebpack: {
        resolve: {
            // 映射静态路径
            // alias: { 
            //     '@alias': 'path/to/some/dir'
            // }
        }
    }
}