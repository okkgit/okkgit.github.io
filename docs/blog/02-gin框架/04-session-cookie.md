---
sidebar: auto
---

# session-cookie

## Cookie
- 需要理解http协议是无状态的
    - 每次请求是独立的，请求中不能直接体现状态信息
    - 在一次会话中我们希望服务器与客户端认识彼此

- internet 中 Cokie 指的是小量的数据信息， 有web服务器创建存储在客户机上面
- 网站通过为了辨别用户身份，需要进行session跟踪
- 把这个能跟踪的数据存储在客户端，就能当做钥匙让服务器知道是谁的请求，通常cookie是加密后的
 
## Cookie 的机制
- cookie 工作流程
    - 服务器验证等操作成功后创建cookie
    - 服务器将cookie 发送给客户端 user-agent(一般指浏览器或app)
    - 浏览器将 cookie 的 key/value存储到用户本地
    - 以后浏览器就可以携带cookie，来证明自己是谁
- 特点
    - 浏览器请求一个站点时会自动把该站点的cookie一并发送给服务器
    - 服务端设置cookie并加密， 可以验证客户端是否更改过cookie
    - cookie针对的是单域名，不用域名之间独立
    - cookie 可以配置过期时间，过期的自动被删除

## golang操作cookie :100:
- 标准库net/http中定义了Cookie，
    - 表示 http响应里面的 `Set-Cookie` 参数
    - 或者是 http请求里面的 `Cookie` 参数它

~~~go
type Cookie struct {
    Name       string
    Value      string
    Path       string
    Domain     string
    Expires    time.Time
    RawExpires string
    // MaxAge=0表示未设置Max-Age属性
    // MaxAge<0表示立刻删除该cookie，等价于"Max-Age: 0"
    // MaxAge>0表示存在Max-Age属性，单位是秒
    MaxAge   int
    Secure   bool
    HttpOnly bool
    Raw      string
    Unparsed []string // 未解析的“属性-值”对的原始文本
}
~~~

### go标准库设置Cookie
- net/http中提供了如下SetCookie函数，它在w的头域中添加Set-Cookie头，该HTTP头的值为cookie。
~~~go
func SetCookie(w ResponseWriter, cookie *Cookie)
~~~
- 也可以通过 Request 对象来设置Cookie
~~~go
func (r *Request) AddCookie(c *Cookie)
~~~

### go标准库获取Cookie
- 通过 Request 对象获 Cookie 
~~~go
// 解析并返回该请求的所有Cookie
func (r *Request) Cookies() []Cookie
// 获取名字为name的Cookie, 没找到则会返回 nil, ErrNoCookie
func (r *Requset) Cookie(name string) (*Cookie, error)
~~~

## gin框架中Cookie的操作 :100:
~~~go
func main() {
    r := gin.Default()
    r.GET("/withcookie", func(c *gin.Context) {
        // 获取Cookie
        cookie, err := c.Cookie("cookie_gin")
        if err != nil {
            cookie := "notSet"
            // 这一串设置一个cookie就挺突然地
            c.SetCookie("gin_cookie", "test", 3600, "/", "localhost", false, true)
        }
    })
    r.run()
}

## Session相关
- session 由来
- 思考一下，如果有很多信息存储在cookie中，每次访问都要携带....实际上cookie限制最长4096字节了
- 而且cookie信息被篡改怎么办，客户端说自己是张三你就是张三吗？
- 这种情况下能存储更多信息Session并且存储在服务端
- Session工作流程：
    - 为每个用户创建特定存储信息的session，并且每个用户的session有其唯一 ID
        - session 是存储在服务器的一个数据结构，用来跟踪用户状态，可以保存在集群、数据库、文件中
        - 唯一 ID 通常是 Session ID , 会写入用户的Cookie中
    - 服务端将带有session id的cookie发送给客户端
        - 使用加密技术确保cookie没有被修改过（保证安全）
        - cookie中仅含有session_id 就可以实现功能了（提高网络性能）
        