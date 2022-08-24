---
sidebar: auto
---

# golang atomic 原子操作

- 原子操作包括五种
    - 曾或减
    - 比较并交换
    - 载入
    - 存储
    - 交换
## 增减原子操作
- 使用的是`atomic`包内Add系列函数
- 参数为 uint32类型，减法要进行转换
~~~go
// 对 (ui32 - NN)
atomic.AddUint32(&ui32, ^uint32(-NN-1))
~~~

## 比较并交换
CompareAndSwapInt32函数在被调用之后会先判断参数addr指向的被操作值与参数old的值是否相等。
仅当此判断得到肯定的结果之后，该函数才会用参数new代表的新值替换掉原先的旧值。否则，后面的替换操作就会被忽略。
~~~go
func CompareAndSwapInt32(addr *int32, old, new int32) (swapped bool)
~~~

## 载入
~~~go
v := atomic.LoadInt32(&value)
~~~
函数atomic.LoadInt32接受一个*int32类型的指针值，并会返回该指针值指向的那个值
有了“原子的”这个形容词就意味着，在这里读取value的值的同时，当前计算机中的任何CPU都不会进行其它的针对此值的读或写操作。
这样的约束是受到底层硬件的支持的。

## 存储
~~~go
atomic.StoreInt32()
~~~
- 原子的存储某值过程中，任何CPU都不会进行针对同一个值的读或写操作。
- 不会出现针对此值的读操作因被并发的进行而读到修改了一半的值的情况了。
- 原子的值存储操作总会成功，因为它并不会关心被操作值的旧值是什么。
- 接受两个参数。第一个参数的类型是指针，指向被操作值的指针。而第二个参数则是int32类型的欲存储的新值。

## 交换
- 简单说就是，原子的替换久的值并返回旧的值
- 单例模式啊这是
~~~go
a := int32(20)
var b = atomic.SwapInt32(&a, int32(59))
~~~


## 最佳实践 :100:
### 使用原子操作代替锁
- 在golang sync.Once 包中如何实现一次操作的如下
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
