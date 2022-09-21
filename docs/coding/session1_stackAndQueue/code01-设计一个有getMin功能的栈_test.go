package session

/*
- 构建一个栈有 pop push getMin 方法， getMin能随时获取当前栈内最小值
- 一个结构连个栈， 一个栈存最小值，一个栈存数据，pop 和 push是单独判断即可
*/

import (
	"fmt"
	"io"
	"testing"
)

type StackGetMin struct {
	Stack    []int
	StackMin []int
}

func (s *StackGetMin) Pop() (int, error) {
	if len(s.Stack) == 0 || len(s.StackMin) == 0 {
		return 0, io.EOF
	}
	res := s.Stack[len(s.Stack)-1]
	s.Stack = s.Stack[:len(s.Stack)-1]
	if s.StackMin[len(s.StackMin)-1] == res {
		s.StackMin = s.StackMin[:len(s.StackMin)-1]
	}
	return res, nil
}

func (s *StackGetMin) Push(value int) {
	s.Stack = append(s.Stack, value)
	if len(s.StackMin) == 0 || s.StackMin[len(s.StackMin)-1] >= value {
		s.StackMin = append(s.StackMin, value)
	}
}

func (s *StackGetMin) GetMin() (int, error) {
	if len(s.StackMin) > 0 {
		return s.StackMin[len(s.StackMin)-1], nil
	}
	return 0, io.EOF
}

func TestStackGetMin(t *testing.T) {
	lst := []int{8, 5, 6, 7, 4, 5, 2, 3}
	stack := &StackGetMin{}
	for _, v := range lst {
		stack.Push(v)
	}
	for {
		_, err := stack.Pop()
		if err != nil {
			break
		}
		min, err := stack.GetMin()
		if err == io.EOF {
			break
		}
		fmt.Printf("最小值栈:%v\n数据栈:%v\n最小值:%v\n\n", stack.StackMin, stack.Stack, min)
	}
}
