---
sidebar:auto
---

# golang 内存分配和 gc 垃圾回收

## 相关基本概念

### 栈上内存分配
- 函数调用完成，会自动释放内存（所以不存在，内存分配和垃圾）

### 堆分配
- 在c语言里面返回一个函数内部变量的指针是存在问题的
- 函数栈针销毁后，这个地址是非法的
- 应该将变量放到堆里面才可以
- golang可以这么干，是做了逃逸分析

### 逃逸分析
- golang 会自动的将应该放在堆上的变量放在堆里
- `go build -gcflags="-m" main.go` 显示分析过程，会打印逃逸分析

### 内存管理的三个角色
- `Mutator` 就是程序员写的应用程序，不断修改对象引用关系
- `Allocator`内存分配器，负责管理从操作系获取内存
    - c语言 malloc 底层有内存分配器的实现（glibc）
    - tcmalloc 是 malloc 多线程改进版
    - 另外 golang 使用的实现类似 tcmalloc
- `Collector`垃圾收集器，负责清理死对象，释放内存空间

## 进程虚拟内存的布局
- 栈内存从高地址向低地址增长
- 堆地址从低地址向搞地质增长
- 当堆地址的顶部和栈顶碰撞，则会 OOM (out of memory)
- 多线程的时候，主线程在（相对）最高地址乡下
- 每个线程会维护一段小的栈
- 多个线程共享一个堆内存

## Allocator 内存分配器

### 两种类型的分配器
- 线性分配器，使用很少（被free的内存就浪费了）
- 空闲链表分配器
    - 将free的内存用链表链接起来，再分配内存的时候优先考虑链表上的内存
    - 分配算法
        - `Fist-Fit` 从头便利链表，第一个满足要求的内存块
        - `Next-Fit` 使用环形链表，上一次分配成功的内存地址开始便利链表
        - `Best-Fit` 从头便利，使用要分配内存最匹配的内存块
        - `Segregated-Fit` 内存分级，先把内存按照常用大小分块，再分配

### c内存分配
- malloc,判断需要内存是否大于128k
    - 小于，brk 系统调用 则调整堆空间顶位置，会产生堆内存增长
    - 大于，mmap 系统调用 任意未使用内存分配
- 空闲链表分配器

## go语言内存分配相关
- 新版本使用稀疏堆向os申请 比如64M一块一块的内存空间
- 使用 mmpa 系统调用申请
- 每使用玩一个64M块就使用 mmap 系统调用申请 新的一块64 MB虚拟内存
- 列表保存每块虚拟内存的开始和结束位置



### 分配器再go中维护一个多级结构
- `mcache -> mcentral -> mheap`
- mcache, 与 P 绑定，本地内存分配操作，不需要加锁
- mcenteral, 中心分配缓存，分配时需要上锁， 不同 spanClass 使用不同的锁（小力度锁）
    - spanCLass分类，就是内存拆成不同大小的块（66种大概， 8bytes 到 32 KB）
- mheap, 全局唯一，从 OS 申请内存，修改定义结构时需要加锁，全局锁。

### 1 分配大小分类
- `Tiny`  size < 16 bytes && 没有指针
    - 每个 P 绑定 mcache ，它包含 tiny指针， tinyoffset等。
    - 首先从 tiny 和 tiny offset里面找
    - tiny 指针指向一个 elem ，一个elem可以存放多个微对象。
    - 每次申请小对象就往elem里面塞，直到塞不进去为止
    - 如果elem满了， mcache.alloc 就会从mcenteral 获取内存，
        - mcenteral：种类有 spanClass * 2 个
            - 奇数位 nospan 类型
            - 偶数位 span 类型
    - mcachem没有时会触发 mcache.Refill流程：
        - 尝试从mcenter 的 non-empty链表查找（mcenteral.cacheSpan）
        - 尝试sweep mcentral 的 empty, 插入到 non-empty
        - 增长mcentral，尝试从 arena 获取内存（mcentral.grow)
            - arena 内存可以理解为 go 预先申请的那 64 MB 内存
        - arena 如果还没有，就会向 os 申请， （mheap.alloc)
            
- `Small` 有指针对象  ||  16 bytes <= size <= 32 KB
    - 相对简单，秩序要去 mcenter 里面找对应大小为止就可以了
    - 没有了就去全局拿

- `Large` size > 32 KB
    - 直接越过 mcache、mcentral、直接从 mheap 进行相应数量 page 分配
    - 大内存分配改过几个版本了简单说就是 空闲链表 转化为 尽量高度低的树。
    - 这里 go 向操作系统索要内存就不一定是 64 MB为单位了

## golang GC 垃圾回收

### 垃圾分类（哈哈哈）
- 语义垃圾（内存泄漏）
    - 逻辑上没用到，但是其实还被应用着，GC 不会认为它是垃圾，无能为力（程序bug）
    - 比如： 
    ~~~ go
        arr:= make([]MyStructOnHeap, 5)
        // 这里后面的内存不会被释放, 就是
        arr = arr[:2]
    ~~~
- 语法垃圾：
    - 应用程序无法到达的垃圾，GC的主要管理目标

### mark 标记流程
- 三色抽象， 会把对象分为3类
    - 黑：已经扫描完成，子节点扫描完毕 gcmarkbits = 1 在队列外
    - 白：已经扫描完成子节点未扫描完毕 gcmarkbits = 1 在队列内
    - 灰：未扫描 collector 不知道任何相关信息

- 从root开始扫描，root可能是全局变量，栈上指针 。。
- 广度优先遍历算法，将元素入队列，标记灰色，其子节点都入队列后，标记为黑，并移除队列
- 当遍历完成所有有用的对象被标记为黑色，剩下的白色对象被标记为垃圾 

### 垃圾回收代码流程
    - gcStart 启动所有p后台的 gcMarkWorker 以及所有根节点 gcRootPrepare,并使gcMarkWorker进入休眠状态
    - schedule 调度流程里面有一个 findRunnableGCWorker,会唤醒合适数量的的gcMarkWorker
    - gcMarkWork 广度优先遍历 对象，设置标灰，并放入 gcwork 的队列里面
    - gcMarkWork 调用 gcMarkDown 排空 wbBuf,就会唤醒后台沉睡 清理，和还内存给os的协程。

- 实战gc优化关注点
    - 因为gc标记主要是 广度优先算法，抓住重点减少gc数量
        - 多做复用
        - 减少对象数量



