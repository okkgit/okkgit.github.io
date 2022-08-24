---
sidebar: auto
---

# golang单例模式

## 常见的错误

### 多线程不安全
::: danger 错误示范
- 创建该singleton类型的实例存在相互覆盖的可能
~~~go
type singleton struct {}
var instance *singleton
func GetInstance() *singleton {
	if instance == nil {
		instance = &singleton{}   // 不是并发安全的
	}
	return instance
}
~~~
:::

## 正确但不推荐的单例模式

### 使用激进的锁
- 在高度并发环境，同时只有一个协程能获得这个单例对象，存在性能瓶颈
::: warning 激进的锁让函数并行变成串行，可能存在问题件
~~~go
var mu Sync.Mutex
func GetInstance() *singleton {
    mu.Lock()                    // 如果实例存在没有必要加锁
    defer mu.Unlock()

    if instance == nil {
        instance = &singleton{}
    }
    return instance
}
~~~
:::

### Check-Lock-Check 模式
- 最小锁定的思想
~~~go
func GetInstance() *singleton {
    // 不太完美 因为这里不是完全原子的
    // 高并发依旧存在问题
    if instance == nil {     
        mu.Lock()
        defer mu.Unlock()

        if instance == nil {
            instance = &singleton{}
        }
    }
    return instance
}
~~~
- 使用原子包 `sync/atomic`(比较繁琐了)
~~~go
import "sync"
import "sync/atomic"
var initialized uint32
... // 此处省略
func GetInstance() *singleton {
    if atomic.LoadUInt32(&initialized) == 1 {  // 原子操作 
		    return instance
	  }
    mu.Lock()
    defer mu.Unlock()
    if initialized == 0 {
         instance = &singleton{}
         atomic.StoreUint32(&initialized, 1)
    }
    return instance
}
~~~

## 单例模式最佳实践
### 先说方法, 使用官方封装好的Once包实现原子操作
- 简单看下官方Once 实现方法
~~~go
// Once is an object that will perform exactly one action.
type Once struct {
	// done indicates whether the action has been performed.
	// It is first in the struct because it is used in the hot path.
	// The hot path is inlined at every call site.
	// Placing done first allows more compact instructions on some architectures (amd64/x86),
	// and fewer instructions (to calculate offset) on other architectures.
	done uint32
	m    Mutex
}

func (o *Once) Do(f func()) {
	if atomic.LoadUint32(&o.done) == 0 { // check
		// Outlined slow-path to allow inlining of the fast-path.
		o.doSlow(f)
	}
}

func (o *Once) doSlow(f func()) {
	o.m.Lock()                          // lock
	defer o.m.Unlock()
	
	if o.done == 0 {                    // check
		defer atomic.StoreUint32(&o.done, 1)
		f()
	}
}
~~~

## 最佳实践 :100:
~~~go
import sync
// 单利的 业务结构体
type single struct {}
// 单利的对象
var s *single
// 定义一个 Once 对象
var once sync.Once
func GetSingle() *single {
    // 使用once实现单利模式
    once.Do(func() {
        s = &single{}
    })
    return s
}
~~~

## tip 学习代码的最佳实践非常有用
- 多学习最佳实践