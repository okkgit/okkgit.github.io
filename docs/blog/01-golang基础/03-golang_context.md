---
sidebar: auto
---

# Context

## Context是干什么的

- 程序开启新的goroutine去处理相应的任务，这个任务又开启新的goroutine。。。。

- 需要实现一个功能- 父协程应该可以控制子协程什么时候退出，或相关消息。。。

- context其实就是官方对这累需求的统一封装，希望大家都遵循这种统一的方式

- e.g.

  ```go
  var wg sync.WaitGroup
  
  func worker(ctx context.Context) {
  LOOP:
  	for {
  		fmt.Println("worker")
  		time.Sleep(time.Second)
  		select {
  		case <-ctx.Done(): // 等待上级通知
  			break LOOP
  		default:
  		}
  	}
  	wg.Done()
  }
  
  func main() {
  	ctx, cancel := context.WithCancel(context.Background())
  	wg.Add(1)
  	go worker(ctx)
  	time.Sleep(time.Second * 3)
  	cancel() // 通知子goroutine结束
  	wg.Wait()
  	fmt.Println("over")
  }
  ```

## Context接口

```go
type Context interface {
    // 返回当前Context被取消时间，完成工作的截止时间
    Deadline() (deadline time.Time, ok bool)
    // 返回一个chan，工作完成或者上下文取消后关闭，多次调用会返回一个Chan
    Done() <-chan struct{}
    // 返回失败原因，在Done返回的Channel被关闭时才会返回非空的值
    // Context被取消就会返回Canceled错误
    // Context超时会返回DeadlineExceeded错误
    Err() error
    // Context中返回键对应的值，对于同一个上下文来说，多次调用Value 
    //并传入相同的Key会返回相同的结果，该方法仅用于传递跨API和进程间跟请求域的数据
    Value(key interface{}) interface{}
}
```

## 创建根Context

### Background()和TODO()

- `Background()`, 一般使用在main函数内， 作为上下文树最顶层的Context，根context
- TODO(), 创建一个暂时还不知道具体场景的Context
- 本质上这俩没啥区别

## 创建派生Context, With系函数

- 四个派生With函数

```go
func WithCancel(parent Context) (ctx Context, cancel CancelFunc)
func WithDeadline(parent Context, deadline time.Time) (Context, CancelFunc)
func WithTimeout(parent Context, timeout time.Duration) (Context, CancelFunc)
func WithValue(parent Context, key, val interface{}) Context
```

### WithChancel

返回带有新Done通道的父节点的副本。当调用返回的cancel函数或当关闭父上下文的Done通道时，将关闭返回上下文的Done通道，无论先发生什么情况。

```go
ctx, cancel := context.WithCancel(context.Background())
defer cancel() // 当我们取完需要的整数后调用cancel
go func(ctx context.Context) {
    select {
        case <-ctx.Done():
        	return, return 结束该协程防止泄露
    } 
}(ctx)
```

### WithDeadline

功能与withchancel基本一样，多了时间控制，超过参数某时刻则关闭通道,

```go
d := time.Now().Add(50 * time.Millisecond)
ctx, cancel := context.WithDeadline(context.Background(), d)
……
defer cancel() // 尽管有超时控制，也要添加手动关闭
```

### WithTimeout

功能与WithDeadline一致，入口参数变为时间段

```go
ctx, cancel := context.WithTimeout(context.Background(), time.Millisecond*50)
......
defer cancel() // 尽管有超时控制,也要添加手动关闭
```

WithValue

::: danger 不同于前三个With系函数

- 返回的时原来context的副本
- 用来给Context添加key-value。(仅对API和进程间传递请求域的数据使用上下文值，而不是使用它来传递可选参数给函数。)
- 键必须是可比较的
- key不应该使用类似`string`等内置类型， 应该使用 `type` 关键字自定义的类型
- 一般配合前面三个一起使用

:::

父协程给派生Context添加key-value

```go
Type MyString string
ctx, cancel := context.WithTimeout(context.Background(), time.Millisecond*50)
defer cancel()
// 在系统的入口中设置trace code传递给后续启动的goroutine实现日志数据聚合
ctx = context.WithValue(ctx, MyString("TRACE_CODE"), "12512312234")
```

断言方式读取Cntext内的key-value

```go
traceCode, ok := ctx.Value(key).(string) // 在子goroutine中获取trace code
if !ok {
    fmt.Println("invalid trace code")
}
```

## 使用Context注意（约定习惯）

- 推荐使用参数方式显示传递（不要使用全局变量）
- ctx应该作为函数的第一个参数
- 不知道给参数为Context接口的函数传递什么的时候，传递context.TODO(), 不应该nil
- 不要使用WithValue传递可选参数
- Context是线程安全的