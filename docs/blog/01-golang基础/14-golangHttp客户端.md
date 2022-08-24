---
sidebar: auto
---

# Http 客户端
- golang标注库贼强大
- `net/http` 包提供了 HTTP 出色的支持

## HTTP 发送get请求

~~~go
func main() {
    resp, err := http.Get("https://www.baidu.com")
    if err != nil {
        painc(err)
    }
    // 这里必须关闭才行， 关闭的是 reap.Body
    defer resp.Body.Close()

    scanner := bufio.NewScanner(resp.Body)
    for i := 0; scanner.Scan() && i < 5; i++ {
        fmt.Println(scanner.Text())
    }
    if err := scanner.Err(); err != nil {
        panic(err)
    }
}
~~~