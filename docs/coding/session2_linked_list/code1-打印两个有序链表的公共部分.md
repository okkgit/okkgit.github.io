---
sidebar: auto
---

# session2_linked_list

## 题目&&思路`code1-打印两个有序链表的公共部分`


## 代码
``` go
package session2

import (
	"fmt"
	"testing"
)

type Code1Linked struct {
	Val  int
	Next *Code1Linked
}

func NewCode1Linked(values []int) *Code1Linked {
	res := &Code1Linked{}
	head := res
	for _, v := range values {
		head.Next = &Code1Linked{Val: v}
		head = head.Next
	}
	return res.Next
}

func PrintPubOfOrderLinkedList(head1, head2 *Code1Linked) {
	for {
		switch {
		case head1 == nil, head2 == nil:
			return
		case head1.Val < head2.Val:
			head1 = head1.Next
		case head2.Val < head1.Val:
			head2 = head2.Next
		case head2.Val == head1.Val:
			fmt.Println(head1.Val)
			head1 = head1.Next
			head2 = head2.Next
		}
	}
}

func TestPrintPubOfOrderLinkedList(t *testing.T) {
	linked1 := NewCode1Linked([]int{1, 3, 4, 5, 6, 7})
	linked2 := NewCode1Linked([]int{1, 2, 6, 7, 10})
	PrintPubOfOrderLinkedList(linked1, linked2)
}

```
