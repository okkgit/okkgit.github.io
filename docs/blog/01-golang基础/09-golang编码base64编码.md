---
sidebar: auto
---

# Golang Base64编码解码

## base64编解码

~~~go
func main() {
	// 标准 base64 编码
	str := "hello world"
	sEnc := base64.StdEncoding.EncodeToString([]byte(str))
	fmt.Println(sEnc)

	// URL 兼容 base64
	sEnc2 := base64.URLEncoding.EncodeToString([]byte(str))
	fmt.Println(sEnc2)

	// 解码
	// 强烈不建议忽视错误，这里为了简便没写

	// 标准
	sDec, _ := base64.StdEncoding.DecodeString(sEnc)
	fmt.Println(string(sDec))

	// URL
	sDec2, _ := base64.StdEncoding.DecodeString(sEnc2)
	fmt.Println(string(sDec2))
}
~~~