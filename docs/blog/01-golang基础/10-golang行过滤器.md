---
sidebar:auto
---

# 行过滤器
- 对 stdin 上的输入进行处理
- 例如 linux 的 grep, sed 命令

- 使用 bufio.NewScanner() 包装 无缓冲的os.Stdin
    - 使用 Scan() 方法前进到下一个令牌
    - 令牌默认是换行
    - 使用 Text() 方法
~~~go
func main() {
	scanner := bufio.NewScanner(os.Stdin)
	for scanner.Scan() {
		ucl := strings.ToUpper(scanner.Text())
		fmt.Println(ucl)
	}

	if err := scanner.Err(); err != nil {
		fmt.Fprintln(os.Stderr, "error:", err)
		os.Exit(1)
	}
}
~~~