const fs = require("fs")
const path = require("path")
var util = require('util')



console.log("\n\n开始生成coding目录及文件 >>>>> \n")

const global_temp = `---
sidebar: auto
---

# %session%

## 题目&&思路\`%topic%\`
%doc%

## 代码
\`\`\` go
%code%
\`\`\`
`

var catalog_str = `---
sidebar: auto
---

# coding 学习笔记(目录)
`

function gen_coding() {
    let items = fs.readdirSync(__dirname)
    items.forEach(item => {
        var itemPath = path.join(__dirname, item)
        var stat = fs.statSync(itemPath)
        if (stat.isDirectory()) {
            deal_dir(itemPath, item)
        }
    })
}

function deal_dir(dir_path, dir_name) {
    catalog_str += "\n## " + dir_name
    fs.readdirSync(dir_path).forEach(item => {
        var itemPath = path.join(dir_path, item)
        var stat = fs.statSync(itemPath)
        var reg= /.+_test.go/
        if (stat.isFile() && reg.test(item)) {
            var topic = item.replace("_test.go", "")
            var file_name = topic+".md"
            var file_path = path.join(dir_path, file_name)
            deal_file(dir_name, topic, itemPath, file_path)

            catalog_str += util.format("\n- [%s](/coding/%s/%s)", topic, dir_name, file_name)
        }
    })
}

function deal_file(session, topic, go_path, md_path) {
    var file_str = global_temp
    file_str = file_str.replace("%session%", session)
    file_str = file_str.replace("%topic%", topic)
    var code = fs.readFileSync(go_path).toString("utf-8").replace("\r", "")
    var reg = /\/\*([^]*)\*\//
    var doc = ""
    matchs = code.match(reg)
    if (matchs != null && matchs.length >= 2) {
        doc = matchs[1]
    }
    code = code.replace(reg, "")
    file_str = file_str.replace("%code%", code)
    file_str = file_str.replace("%doc%", doc)
    console.log(session, topic, md_path)
    fs.writeFileSync(md_path, file_str)
}

gen_coding()
fs.writeFileSync(path.join(__dirname, "readme.md"), catalog_str)

