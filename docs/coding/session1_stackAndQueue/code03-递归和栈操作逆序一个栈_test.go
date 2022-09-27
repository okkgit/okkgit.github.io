package session

import (
	"fmt"
	"io"
	"testing"
)

/*
- 使用递归来完成栈的逆序

- 思路
	- 封装一个获取栈底的函数
	- 封装逆序
*/

type Code3Stack struct {
	data []int
}

func (c *Code3Stack) Push(value int) {
	c.data = append(c.data, value)
}

func (c *Code3Stack) Show() []int {
	return c.data
}

func (c *Code3Stack) Pop() (int, error) {
	if len(c.data) == 0 {
		return 0, io.EOF
	}
	res := c.data[len(c.data)-1]
	c.data = c.data[:len(c.data)-1]
	return res, nil
}

func (c *Code3Stack) IsEmpty() bool {
	return len(c.data) == 0
}

// =>
func Code3PopLast(stack *Code3Stack) (int, error) {
	if stack.IsEmpty() {
		return 0, io.EOF
	}
	value, _ := stack.Pop()
	if stack.IsEmpty() {
		return value, nil
	} else {
		last, _ := Code3PopLast(stack)
		stack.Push(value)
		return last, nil
	}
}

func Code3Re(stack *Code3Stack) {
	if stack.IsEmpty() {
		return
	}
	value, _ := Code3PopLast(stack)
	Code3Re(stack)
	stack.Push(value)
}

func TestCode3(t *testing.T) {
	stack := Code3Stack{data: []int{1, 2, 3}}
	fmt.Println(stack.Show())
	Code3Re(&stack)
	fmt.Println(stack.Show())
}
