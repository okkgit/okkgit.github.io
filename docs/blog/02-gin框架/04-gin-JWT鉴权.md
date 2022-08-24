--- 
sidebar: auto
--- 

# gin-JWT

## 什么是JWT
- JWT全称JSON Web Token是一种跨域认证解决方案，属于一个开放的标准，它规定了一种Token实现方式，目前多用于前后端分离项目和OAuth2.0业务场景下。

## JWT的作用
- 传统用户认证通常是使用 session-cookie 完成的
    - 用户登录将账户密码发送给服务器
    - 服务器验证通过后保存用户session数据和一个对应的sessin_id
    - 将session_id写回给浏览器的cookie里面
    - 后续所有的浏览器请求需要在cookie内携带session_id
    - 服务端通过session_id找到找到用户信息
- JWT给予token清量认证模式, 验证完成后生成一个JSON对象，通过签名后获得token，后续客户端访问携带token,服务店解密后即完成验证

## 使用jwt-go实现 JWT的生成和解析

- 使用自定义结构体并内嵌`jwt.StandardClaims`来决定JWT内存储的信息
```go
type MyClaims struct {
    Username string `json:"username"` // 自己设计添加自定义字段
    jwt.StandarClaims  // 内嵌 jwt.StandarClaims, 相当于python继承父类
}
```
- 定义JWT过期时间常量, 和Secret（一串自定任意字节，用来加密用的）
```go
const TokenExpireDuration = time.Hour * 2
var MySecret = []byte("一串自定任意字节，用来加密用的")
```

## 生成JWT的代码
~~~go
func GenToken(username string) (string, error) {
    // 创建一个自定义格式结构的实例
    c := MyClaims {
        username,
        jwt.StandardClaims{
			ExpiresAt: time.Now().Add(TokenExpireDuration).Unix(), // 过期时间
			Issuer:    "my-project",                               // 签发人
		},
    }
    // 使用指定签名方法创建签名对象
    token := jwt.NewWithClaims(jwt.SingniMethodHS256, c)
    // 使用自定义字符串密匙创建token
    return token.SignedString(MySecret)
}
~~~

## 解析JWT
~~~go
func ParseToken(tokenString string) (*MyClaims, error) {
    // 解析token
    token, err := jwt.ParseWithClaims(tokenString, &MyClaims, func(token *jwt.Token) (i interface, err error) {
        return MySecret, nil
    })
    if err != nil {
        return nil, err
    }
    if cliams, ok := token.Claims.(*MyClaims); ok && token.Valid {
        return claims, nil
    }
    return nil, errors.New("invalid token")
}
~~~

## 在gin中使用token

- 浏览器通过这个函数获取token
~~~go
func autoHandler(c *gin.Context) {
    var user UserInfo
    err := c.ShouldBind(&user) // gin框架获取表单信息
    if err != nil {
        c.JSON(http.StatusOk, gin.H{
            "code": 200,
            "msg":"无效的参数",
        })
        return // 这里return一下不继续后面的代码
    }
    // 检验用户名和密码是否正确 , 这里师范一下，正常是要是hash的方式
    if user.Username == "waynegopher" && user.Passwd == "正确的密码" {
        // 使用封装的函数穿件Token
        tokenString, _ := GenToken(user.Username)
        c.JSON(http.StatusOK, gin.H{
            "code": 200,
            "msg": "success",
            "data": gin.H{"token":tokenString},
        })
        return 
    }
    c.JSON(http.StatusOK, gin.H{
        "code": 200,
        "msg": "鉴权失败",
    })
    return
}
~~~

## 使用中间件完成核验Token
- 用户获取到了token后每次访问会携带token。服务器每次都要验证token。
- 很显然每次都验证token，所以使用功能中间件来实现。
    - 客户端携带Token有三种方式 1.放在请求头 2.放在请求体 3.放在URI
    - 这里假设Token放在Header的Authorization中，并使用Bearer开头
	- 这里的具体实现方式要依据你的实际业务情况决定


```go
// 创建一个验证token的中间件
func JWTAuthMiddleware() func(c *gin.Context) {
    authHeader := c.Request.Header.Get("Authorization")
    if authHeader == "" {
        c.JSON(http.StatusOK, gin.H{
            "code":  200,
            "msg": "请求头中auth为空,",     // 或者根据业务跳转到登录页面完成鉴权
        })
        c.Abort()
        return
    }
    // 按照空格分割
    parts := strings.SplitN(authHeader, " ", 2)
    if !(len(parts) == 2 && parts[0] == "Bearer") {
        c.JSON(http.StatusOK, gin.H{
            "code": 200,
            "msg": "请求auth格式错误"
        })
        c.Abort()
        return
    }
    // 这个时候 parts[1] 即为 所需要的的tokenString
    mc, err := ParseToken(parts[1])
    if err != nil {
        c.JSON(http.StatusOK, gin.H{
            "code": 2005,
            "msg": "无效的token",
        })
        c.Abort() // 阻止调用后续的处理程序
        return
    }
    c.Set("username", mc.Username) // 在上下文中创建用户信息
    c.Next() // 调用执行其他的处理程序
}
```
### 可以考虑使用第三方封装的中间件
- 可以使用github上封装好的 https://github.com/appleboy/gin-jwt。


## 使用这个中间件
~~~go
// 创建一个路由并使用，并给这个路由配置中间件
r.GET("/home", JWTAutoMiddleware(), handerFunc)

func handerFunc(c *gin.Context) {
    username := c.MustGet("username").(string)
    c.JSON(http.StatusOK, gin.H{
        "code": 200,
        "msg": "success",
        "data": gin.H{"username": username}
    })
}
~~~