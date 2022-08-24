---
sidebar: auto
---

# crypto/* 散列系列函数

## SHA1散列（hash）
- 用于生成二进制文件或文本块的短标识

~~~go
func main() {
	h := sha1.New()
	h.Write([]byte("hello"))
	bs := h.Sum(nil)
	fmt.Println(string(bs))
	fmt.Printf("%x\n", bs)
}
~~~

## 另外其他编码方式使用与这里类似
