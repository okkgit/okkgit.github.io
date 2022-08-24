---
sidebar: auto
---

# golang 单元测试

::: tip
测试很重要！！！
:::

## 待测的文件 `main.go`
~~~go
package testdemo

import "fmt"

func IntMin(a, b int) int {
    if a < b {
        return a
    } else {
        return b
    }
}
~~~

## 测试文件编写 `main_test.go`
~~~go
package testdemo

import (
    "fmt"
    "testing"
)

// 通常测试函数的名字以Test开头
func TestIntMinBasic(t *testing.T) {
    ans := IntMin(2, -2)
    if ans != -2 {
        t.Errorf("IntMin(2, -2) = %d; want -2", ans)
    }
}

// 使用 `t.Run()` 来创建子测试

func TestIntMinTableDriven(t *testing.T) {
    var tests := []struct {
        a, b, want int
    }{
        {0,1,0},
        {0,-1,-1},
        {110,10,10},
        {101,31,31},
    }

    for _, tt := range tests {
        testname = fmt.Sprintf("%d, %d", tt.a, tt.b)
        t.Run(testname, func(t *testing.T) {
            ans := IntMin(tt.a, tt.b)
            if ans != tt.want {
                t.Errof("got %d , want %d", ans, tt.want)
            }
        })
    }
}
~~~

::: tip
- 上面的测试仅仅是官方库的版本
- 一般生产环境中使用测试框架
:::

## 测试框架的使用 TODO
