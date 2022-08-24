---
sidebar: auto
---

# golang 获取环境变量

- 环境变量作为程序传递配置信息的常见方式

## 设置环境变量

~~~go
func main() {
    os.Setenv("FOO", "1")
    // 不存在环境变量，将返回空字符串
    os.Getenv("FOO")
    // 遍历所有环境变量
    for _, e := range os.Environ() {
        // 每个值是一个字符串， 以 “=” 分隔 的 key = value
        pair := strings.SplitN(e, "=", 2)
        fmt.Println(pair[0])
    }
}
~~~

