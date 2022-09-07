let fs = require("fs")
let path = require("path")
var util = require('util');

var blog_path = './docs/blog';

header = `---
sidebar: auto
title: blog 目录
---

# blog 目录
`

let body = []

let root = "./docs/blog"
function loadbody(dirpath, deep = 1, max_deep = 2) {
    if (max_deep < deep) {
        return
    }
    let items = fs.readdirSync(dirpath)
    items.forEach(function (item) {
        var itemPath = path.join(dirpath, item)
        var stats = fs.statSync(itemPath)
        var text = item.replace(/^\d+\-/, "")
        text = text.replace(/\.md$/, "")
        if (stats.isDirectory()) {
            // 生成 # 号，根据文件夹层级深度
            var head = ""
            for (let i = 0; i <= deep; i++) {
                head += "#"
            }
            var msg = util.format("%s %s", head, text)
            body.push("\n", util.format(msg))
            loadbody(itemPath, deep + 1, max_deep)
        } else if (stats.isFile() && item.toLowerCase().endsWith(".md")) {
            var url = itemPath.replace(/\\/g, "/").replace("docs/", "")
            var msg = util.format("- [%s](/%s)", text, url)
            body.push(msg)
        }
    })
}

loadbody("./docs/blog", 1, 3)

let data = header + "\n" + body.join("\n")
fs.writeFile("./docs/blog/catalog.md", data, (err) => {
    if (err) {
        console.log("生成目录文件出错")
    } else {
        console.log("生成目录成功")
    }
})