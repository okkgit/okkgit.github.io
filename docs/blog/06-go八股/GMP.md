---
# sidebarDepth: 0
# sidebar: false
# navbar: false
# prev: false
# next: false
tags:
    - GMP
    - GPM
    - 调度
    - go
---

# go程序编译过程
- 编译
  - 文本到文件
- 链接

linux可执行文件
- ELF header
- Sectuib header
- Sesctions

# go进程的启动与初始化
golang是一种有runtime的语言，runtime的组成
1. Scheduelr GMP后台执行的调度循环
2. Netpoll 网络相关时间的读写等
3. Memory 内存分配
4. Garbage 回收垃圾内存

- entry point找到程序入口

```go
go func() {
    println(123)
}()
```
这段代码其实是想runtime提交了一个计算任务

- 调度流程本身就是一个生产-消费流程
- 各类线程执行执行调度循环（尝试获取任务）
- 空闲的线程，进入空闲线程队列，没有可用线程进空闲线程里面找

## 生产端逻辑
队列(优先级 高中低)
- runnext, 每个p上一个，局部性原理(长度为1队列)
- local run queue（类数组， max is 256）
- golobal run queue（链表，大小无线）

- goroutine创建步骤
  - 分配内存等。。。。
  - 插入到队列
    - 放到runnext，非空后续执行
    - 如果runnext有值，将其踢给local
    - 如果local满，拿走local一半外加被踢走的G,放到global队列

## 消费端逻辑
- 多个线程反复执行一个循环从队列里免拿值 
  - schedule-> runtime.execute -> runtime.gogo -> runtime.goexit -><