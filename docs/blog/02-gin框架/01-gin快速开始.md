---
sidebar: auto
---

# golang-Gin web 框架
使用`httprouter`性能超级好的API框架。
[官方中文文档](https://gin-gonic.com/zh-cn/docs/)

## 安装

```sh
go get -u github.com/gin-gonic/gin
```

- helloworld

```go
package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	// 创建一个默认的路由引擎
	r := gin.Default()
	// GET：请求方式；/hello：请求的路径
	// 当客户端以GET方法请求/hello路径时，会执行后面的匿名函数
	r.GET("/hello", func(c *gin.Context) {
		// c.JSON：返回JSON格式的数据
		c.JSON(200, gin.H{
			"message": "Hello world!",
		})
	})
	// 启动HTTP服务，默认在0.0.0.0:8080启动服务
	r.Run()
}
```

## RESTful API 介绍

- 一种设计风格 [阅读阮一峰的文章了解详情](http://www.ruanyifeng.com/blog/2011/09/restful.html)
- 四个http请求方法代表不同的动作
  - GET 获取资源
  - POST 创建资源
  - PUT 修改资源
  - DELETE 删除资源

- 不同的请求方法对应的结果不同（尽管URL是一样的）

### gin 框架支持RESTful API

```go
func main() {
	r := gin.Default()
	r.GET("/book", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "GET",
		})
	})

	r.POST("/book", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "POST",
		})
	})

	r.PUT("/book", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "PUT",
		})
	})

	r.DELETE("/book", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "DELETE",
		})
	})
}
```

## gin框架渲染html模板文件

- 可能需要按照业务创建一个存放html模板文件的地方例如 `temlpate/index.html`

  ```html
  <body>
      {{.title}}
  </body>
  ```

- gin渲染html

  ```go
  func main() {
  	r := gin.Default()
  	r.LoadHTMLGlob("templates/**/*")
  	//r.LoadHTMLFiles("templates/posts/index.html", "templates/users/index.html")
  	r.GET("/posts/index", func(c *gin.Context) {
  		c.HTML(http.StatusOK, "posts/index.html", gin.H{
  			"title": "posts/index",
  		})
  	})
  
  	r.GET("users/index", func(c *gin.Context) {
  		c.HTML(http.StatusOK, "users/index.html", gin.H{
  			"title": "users/index",
  		})
  	})
  
  	r.Run(":8080")
  }
  ```

## 定义模板函数

```go
func main() {
	router := gin.Default()
    // 定义注册模板函数
	router.SetFuncMap(template.FuncMap{
		"safe": func(str string) template.HTML{
			return template.HTML(str)
		},
	})
	router.LoadHTMLFiles("./index.tmpl")

	router.GET("/index", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.tmpl", "<a href='www.baidu.com'>这是段被安全化的html</a>")
	})

	router.Run(":8080")
}
```

- 在html模板中调用函数

```html
<div>{{ . | safe }}</div>
```

## 静态文件处理（静态资源服务器）

- 渲染前调用 `gin.Static`方法注册

  ```go
  func main() {
  	r := gin.Default()
  	r.Static("/static", "./static")
  	r.LoadHTMLGlob("templates/**/*")
     // ...
  	r.Run(":8080")
  }
  ```

  

## 通过gin库实现模板继承

- gin默认仅支持单继承，
- 要使用`block template`功能，可以通过`"github.com/gin-contrib/multitemplate"`库实现

## gin 返回json的两种方法

```go
func main() {
	r := gin.Default()

	// gin.H 是map[string]interface{}的缩写
	r.GET("/someJSON", func(c *gin.Context) {
		// 方式一：自己拼接JSON
		c.JSON(http.StatusOK, gin.H{"message": "Hello world!"})
	})
	r.GET("/moreJSON", func(c *gin.Context) {
		// 方法二：使用结构体
		var msg struct {
			Name    string `json:"user"`
			Message string
			Age     int
		}
		msg.Name = "小王子"
		msg.Message = "Hello world!"
		msg.Age = 18
		c.JSON(http.StatusOK, msg)
	})
	r.Run(":8080")
}
```

## gin 返回xml两种方法

- 基本上和json是一样的

```go
func main() {
	r := gin.Default()
	// gin.H 是map[string]interface{}的缩写
	r.GET("/someXML", func(c *gin.Context) {
		// 方式一：自己拼接JSON
		c.XML(http.StatusOK, gin.H{"message": "Hello world!"})
	})
	r.GET("/moreXML", func(c *gin.Context) {
		// 方法二：使用结构体
		type MessageRecord struct {
			Name    string
			Message string
			Age     int
		}
		var msg MessageRecord
		msg.Name = "小王子"
		msg.Message = "Hello world!"
		msg.Age = 18
		c.XML(http.StatusOK, msg)
	})
	r.Run(":8080")
}
```

## gin 返回YAML渲染

```go
r.GET("/someYAML", func(c *gin.Context) {
	c.YAML(http.StatusOK, gin.H{"message": "ok", "status": http.StatusOK})
})
```

