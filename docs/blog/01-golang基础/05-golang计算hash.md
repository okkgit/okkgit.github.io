---
sidebar: auto
--- 

# golang计算Hash

- golang标准库提供了非常简单的实现方法
- `crypto/md5`
- `crypto/sha1`
- 。。。

~~~go
md5Producer := md5.New()
md5Producer.Write([]byte(s))
res := md5pProducer.Sum([]byte(""))

sh1Producer := sh1.New()
Sha1Inst.Write([]byte(TestString))
res = Sha1Inst.Sum([]byte(""))

h := md5.New()
io.WriteString(h, "The fog is getting thicker!")
io.WriteString(h, "And Leon's getting laaarger!")
fmt.Printf("%x", h.Sum(nil))

// 最简单的用法
data := []byte("Th ese pretzels are making me thirst y.")
fmt.Printf("%x", md5.Sum(data))
~~~

### golang crypto下有很多加密相关的包
- 一般都包含 `Sum()` 方法
- 方法签名
~~~go
// 不同加密方法的不同size
const Size = 16
// 函数签名中 Size 来自对应包内的 const
func Sum(data []byte) [Size]byte
~~~