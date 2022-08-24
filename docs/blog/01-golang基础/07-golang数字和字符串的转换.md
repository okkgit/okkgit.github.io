---
sidebar: auto
---

## 字符串转数字
- 这里简单的转换使用`strconv`

~~~go
func main() {
	// 将字符串认为是一个数字，转化成一个float64类型的
	// 一般参数64不变
	f, _ := strconv.ParseFloat("1.23", 64)
	fmt.Println(float64(f))

	// 使用ParseInt解析整形的数字
	// 0 表示自动腿短字符串使用进制
	// 64表示返回整形以64位存储
	f2, _ := strconv.ParseInt("123", 0, 64)
	fmt.Println(float64(f2))

	f3, _ := strconv.ParseUint("1243", 0, 64)
	fmt.Println(float64(f3))

	i, _ := strconv.Atoi("45")
	fmt.Println(i)
	fmt.Println(strconv.Itoa(123))
}
~~~
