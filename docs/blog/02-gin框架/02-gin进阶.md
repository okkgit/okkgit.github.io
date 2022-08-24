---
sidebar: auto
---

# gin 进阶

## gin文件上传

### 客户端上传文件的html网页

~~~html
<body>
<form action="/upload" method="post" enctype="multipart/form-data">
    <input type="file" name="f1">
    <input type="submit" value="上传">
</form>
</body>
~~~

### gin从客户端获取单个文件

```go
func main() {
	router := gin.Default()
	// 处理multipart forms提交文件时默认的内存限制是32 MiB
	// 可以通过下面的方式修改
	// router.MaxMultipartMemory = 8 << 20  // 8 MiB
	router.POST("/upload", func(c *gin.Context) {
		// 单个文件
		file, err := c.FormFile("f1")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": err.Error(),
			})
			return
		}

		log.Println(file.Filename)
		dst := fmt.Sprintf("C:/tmp/%s", file.Filename)
		// 上传文件到指定的目录
		c.SaveUploadedFile(file, dst)
		c.JSON(http.StatusOK, gin.H{
			"message": fmt.Sprintf("'%s' uploaded!", file.Filename),
		})
	})
	router.Run()
}
```

## gin后端获取多个文件

```go
func main() {
	router := gin.Default()
	// 处理multipart forms提交文件时默认的内存限制是32 MiB
	// 可以通过下面的方式修改
	// router.MaxMultipartMemory = 8 << 20  // 8 MiB
	router.POST("/upload", func(c *gin.Context) {
		// Multipart form
		form, _ := c.MultipartForm()
		files := form.File["file"]

		for index, file := range files {
			log.Println(file.Filename)
			dst := fmt.Sprintf("C:/tmp/%s_%d", file.Filename, index)
			// 上传文件到指定的目录
			c.SaveUploadedFile(file, dst)
		}
		c.JSON(http.StatusOK, gin.H{
			"message": fmt.Sprintf("%d files uploaded!", len(files)),
		})
	})
	router.Run()
}
```

## gin重定向

```go
r.GET("/test", func(c *gin.Context) {
	c.Redirect(http.StatusMovedPermanently, "http://www.sogo.com/")
})
```

## gin重定向到路由

```go
r.GET("/test", func(c *gin.Context) {
    // 指定重定向的URL
    c.Request.URL.Path = "/test2"
    // 使用HandleContext(c) 来实现路由重定向
    r.HandleContext(c)
})
r.GET("/test2", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"hello": "world"})
})
```

## gin路由

### 普通路由

```go
r.GET("/index", func(c *gin.Context) {...})
r.POST("/login", func(c *gin.Context) {...})
// 匹配全部请求的路由
r.Any("/test", func(c *gin.Context) {...})
// 404 的路由
r.NoRoute(func(c *gin.Context) {
    c.HTML(http.StatusNotFound, "views/404.html", nil)
})
```

## gin路由组

```go
func main() {
	r := gin.Default()
	userGroup := r.Group("/user") // 创建路由组
	{
		userGroup.GET("/index", func(c *gin.Context) {...})
		userGroup.GET("/login", func(c *gin.Context) {...})
		userGroup.POST("/login", func(c *gin.Context) {...})
	}
	shopGroup := r.Group("/shop")
	{
		shopGroup.GET("/index", func(c *gin.Context) {...})
		shopGroup.GET("/cart", func(c *gin.Context) {...})
		shopGroup.POST("/checkout", func(c *gin.Context) {...})
	}
	r.Run()
}
```

## gin中间件

- 业务请求过程中，添加钩子函数，这个函数就是中间件，中间件适合处理一些公共的业务， 比如登录验证，鉴权，数据分页，记录日志，耗时同价等。

### 定义中间件

- gin的中间件必须是一个gin.HandlerFunc类型，例如这个统计耗时的中间件。

```go
func TimeUse() gin.HandlerFunc {
    return func(c *gin.Context) {
        start := time.Now()
        // 可以通过c.Set 在上下文中设置值，后续可以拿到这个值
        c.Set("name", "zhangsan")
        c.Next() // 这个调用表示调用处理剩余的处理程序
        // 如果不想调用其他后续处理程序
        // c.Abort()
        // 这个中间件的功能
        log.Println(time.Since(start))
    }
}
```

## 注册中间件，使能中间件

- 允许每个路由添加任意多个中间件

### 为全局路由注册

```go {3}
fucn main() {
    r := gin.New()
	r.Use(TimeUse())
    r.GET("/test", func(c *gin.Context) {
        name = c.MustGet("name").(string) // 这个值是在中间件中在上下文中写入的
        c.JSON(http.StatusOK, gin.H{
            "message": "helloworld"
        }))
    })
    r.Run()
}
```

### 为某个路由注册中间件

```go
// 直接写在路由的后面，可以写多个中间件
r.GET("/test", TimeUse(), func(c *gin.Context) {
    ......
})
```

### 为路由组注册中间件

方法一

```go
shopGroup := r.Group("/shop", TimeUse())
```

方法二

```go
shopGroup := r.Group("/shop")
shopGroup.Use(StatCost())
```

## gin.Default() 使用了默认中间件

- 默认使用了 `Logger`和`Recovery`中间件
  - Logger 将日志写入gin.DefaultWriter
  - Recovery 会recover任何panic。遇到panic，响应500码。
- 可以使用`gin.New()`创建一个没有使用任何中间件的路由。

::: danger 在中间件中创建 goroutine

- 在中间件中启动协程，不应该使用原始上下文 c 
- 必须使用只读副本，`c.Copy()`

:::

