---
sidebar: auto
---

# golang实现http服务端

- 使用标准库 `net/http` 包，实现简单的HTTP服务端 

## hello world

~~~go

func helloWorld(w http.ResponseWrite, r *http.Request) {
    fmt.Fprintf(w, "hello world! \n")
}

func mian() {
    // 注册路由
    http.HandFunc("/hello", helloWorld)
    // 启动默认的服务
    http.ListenAndServe(":9090", nil)
}
~~~

## Context
- 在路由处理函数中
~~~go
func hello(w http.ResponseWriter, req * http.Reqest) {
    // 默认 http 库会Wie每个路由创建一个Context
    // 获取Context 的方法如下
    ctx := req.Context()
    // 使用Contex来实现提前结束任务
    select {
    case <-time.After(time.Second * 10):
        fmt.Fprintln(w, "hello")
    case <-ctx.Done():
        err := ctx.Err()
        fmt.Println("server: " err)
        internalError := http.StatusInternalServerError
        http.Error(w, err.Error(), internalError)
    }
}

func mian() {
    http.HandleFunc("/hello", hello)
    http.ListenAndServe(":9090", nil)
}
~~~