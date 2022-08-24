---
title: vuepress
tags:
    - 配置
    - 主题
    - 关键信息
---

# vuepress 单页的配置使用说明

- 在每页markdown开始地方 `---` 内编写 yaml 配置文件，针对当前也页面单独的配置 
```yaml
# 单页这一页禁用导航栏 true, false, auto
navbar: false
# 上一篇下一篇， 可以明确的重写路径，或者禁用
prev: ./some-other-page
next: false
# 设置这页侧边栏的深度
sidebarDepth: 2
# 用来优化搜索结果， 搜索框通常只会搜索，标题，h2，h3，以及tags
tags:
    - 配置
    - 主题
    - 关键信息
```
