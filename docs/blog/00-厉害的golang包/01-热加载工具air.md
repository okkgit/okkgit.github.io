---
sidebar: auto
---

# golang程序热加载，gin的debug模式

- 简单讲就是类似flask框架的 app.run(debug=True)
- Air能够实时监听项目的代码文件，在代码发生变更之后自动重新编译并执行
- 为了方便开发，每次修改业务，不用每次手动重启服务
- air 使用所有项目，且不限于语言的哦

## Air 开源工具

- 支持彩色日志输出
- 自定义构建二进制命令
- 支持忽略子目录
- 启动后可以监听新目录
- 构建过程友好

## 安装air

- 首先需要配置好 GOBIN 环境变量，并放入全局 PATH
- 使用go安装
```go
go get -u github.com/cosmtrek/air
```

## 使用 air

- 在自己需要使用的工程目录下
```sh
# 如果不提供配置文件或文件不存在则使用默认配置
air -c .air.conf
```

- 一般建议在项目目录下创建 `.air.conf` 文件
- 修改.air.conf文件,
- 直接运行 `air -c .air.conf`,
- 如果配置文件名字为`.air.conf`,可以直接运行`air`

## 完整的`.air.conf`文件模板
- 根据需求自行更改
```conf
# [Air](https://github.com/cosmtrek/air) TOML 格式的配置文件

# 工作目录
# 使用 . 或绝对路径，请注意 `tmp_dir` 目录必须在 `root` 目录下
root = "."
tmp_dir = "tmp"

[build]
# 只需要写你平常编译使用的shell命令。你也可以使用 `make`
# Windows平台示例: cmd = "go build -o tmp\main.exe ."
cmd = "go build -o ./tmp/main ."
# 由`cmd`命令得到的二进制文件名
# Windows平台示例：bin = "tmp\main.exe"
bin = "tmp/main"
# 自定义执行程序的命令，可以添加额外的编译标识例如添加 GIN_MODE=release
# Windows平台示例：full_bin = "tmp\main.exe"
full_bin = "APP_ENV=dev APP_USER=air ./tmp/main"
# 监听以下文件扩展名的文件.
include_ext = ["go", "tpl", "tmpl", "html"]
# 忽略这些文件扩展名或目录
exclude_dir = ["assets", "tmp", "vendor", "frontend/node_modules"]
# 监听以下指定目录的文件
include_dir = []
# 排除以下文件
exclude_file = []
# 如果文件更改过于频繁，则没有必要在每次更改时都触发构建。可以设置触发构建的延迟时间
delay = 1000 # ms
# 发生构建错误时，停止运行旧的二进制文件。
stop_on_error = true
# air的日志文件名，该日志文件放置在你的`tmp_dir`中
log = "air_errors.log"

[log]
# 显示日志时间
time = true

[color]
# 自定义每个部分显示的颜色。如果找不到颜色，使用原始的应用程序日志。
main = "magenta"
watcher = "cyan"
build = "yellow"
runner = "green"

[misc]
# 退出时删除tmp目录
clean_on_exit = true
```


