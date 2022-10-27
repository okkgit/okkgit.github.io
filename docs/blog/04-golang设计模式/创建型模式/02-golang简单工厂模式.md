---
sidebar: auto
---

# golang设计模式-简单工厂模式

## 应用场景
- 通过传递不同的参数返回不同的实例
- 巧的是，golang通常使用的 NewXxx的方法来床架新的结构实例，本身就是一个简单的工厂模式
- 简单工厂模式专门定义一个类来负责创建其他类的实例，被创建的实例通常都具有共同的父类（接口）。
## 个人理解
- 一个可以根据不同参数创建不同实例的类，
- 通常能创建出来不同的实例通常有一个相同父类
- New函数返回一个接口，这个接口的实现可以有多种

## 最佳实践
~~~go
package simplefactory

import "fmt"

//API 定义api接口
type API interface {
	Say(name string) string
}

//NewAPI 根据参数返回不同的接口，这个接口其实就是不同的实例
func NewAPI(t int) API {
	if t == 1 {
		return &hiAPI{}
	} else if t == 2 {
		return &helloAPI{}
	}
	return nil
}

// 实现 API接口的结构体
type hiAPI struct{}
func (*hiAPI) Say(name string) string {
	return fmt.Sprintf("Hi, %s", name)
}

//实现 API接口的结构体
type helloAPI struct{}

func (*helloAPI) Say(name string) string {
	return fmt.Sprintf("Hello, %s", name)
}
~~~