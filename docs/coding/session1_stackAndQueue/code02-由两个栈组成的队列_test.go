package session

import (
	"fmt"
	"io"
	"testing"
)

/*
- 构建两个栈实现的队列
- 方案，需要理清入队列出队列时栈的操作， 满足pop栈为空的时候全部倒入pop, pop不为空的就暂时都放在push即可， 另外判断空队列
*/

// 准备一个栈，标准点写代码
type Code2Stack struct {
	data []int
}

func (c *Code2Stack) Push(value int) {
	c.data = append(c.data, value)
}

func (c *Code2Stack) Show() []int {
	return c.data
}

func (c *Code2Stack) Pop() (int, error) {
	if len(c.data) == 0 {
		return 0, io.EOF
	}
	res := c.data[len(c.data)-1]
	c.data = c.data[:len(c.data)-1]
	return res, nil
}

func (c *Code2Stack) IsEmpty() bool {
	return len(c.data) == 0
}

func (c *Code2Stack) Peek() (int, error) {
	if len(c.data) == 0 {
		return 0, io.EOF
	}
	res := c.data[len(c.data)-1]
	return res, nil
}

// 本题的主要结构
type QueueTwoStack struct {
	stackPop  *Code2Stack
	stackPush *Code2Stack
}

func NewQueueTwoStack() *QueueTwoStack {
	return &QueueTwoStack{
		stackPop:  &Code2Stack{},
		stackPush: &Code2Stack{},
	}
}

// 栈倒入
func (q *QueueTwoStack) pushToPop() {
	if q.stackPop.IsEmpty() {
		for {
			value, err := q.stackPush.Pop()
			if err == io.EOF {
				break
			}
			q.stackPop.Push(value)
		}
	}
}

func (q *QueueTwoStack) Add(value int) {
	q.stackPush.Push(value)
	q.pushToPop()
}

func (q *QueueTwoStack) Poll() (int, error) {
	if q.stackPop.IsEmpty() && q.stackPush.IsEmpty() {
		return 0, io.EOF
	}
	q.pushToPop()
	return q.stackPop.Pop()
}

func (q *QueueTwoStack) Peek() (int, error) {
	if q.stackPop.IsEmpty() && q.stackPush.IsEmpty() {
		return 0, io.EOF
	}
	q.pushToPop()
	return q.stackPop.Pop()
}

func (q *QueueTwoStack) ShowData() {
	fmt.Printf("popStack: %v, pushStack: %v\n", q.stackPop.Show(), q.stackPush.Show())
}

func TestQueueTwoStack(t *testing.T) {
	queue := NewQueueTwoStack()
	queue.Add(1)
	queue.ShowData()
	queue.Add(2)
	queue.ShowData()
	queue.Add(3)
	queue.ShowData()
	queue.Poll()
	queue.ShowData()
	queue.Poll()
	queue.ShowData()
	queue.Add(3)
	queue.ShowData()
	queue.Add(3)
	queue.ShowData()
	queue.Poll()
	queue.ShowData()
}
