---
sidebar: auto
---

# golang文件路径 

## 标准库 filepath

### 拼接路径 Join
~~~go
p = filepath.Join("a", "b", "c", "d")
~~~

### 上一级目录
~~~go
p = filepath.Dir("a/b/c/d") // "a/b/c"
~~~

### 最后一级目录
~~~go
p := filepath.Base("a/b/c/d") // "d"
~~~

### Split 获取目录和文件
~~~go
dir, name := filepath.Split("a/b/c/d") // "a/b/c" , "d" 
~~~

### 判断是否为绝对路径
~~~go
bool_val := filepath.IsAbs("/a/b/c") // true
~~~

### 获取后缀命名
~~~go
fmt.Print(filepath.Ext("hello.txt")) // ".txt"
~~~

### 获取文件名（不包含后缀）
~~~go
fmt.print(strings.TrimSuffix("hello.txt", ".txt"))
~~~

### 获取相对路径
~~~go
baseP := "/a/b"
P := "a/b/c/d/e"
p, err = filepath.Rel(baseP, P) // "c/d/e"
if err ...
~~~

## 目录相关

### 创建删除子目录
~~~go
// 不能创建多层级目录
err := os.Mkdir("dir", 0755)
// 创建支持多层级目录, 类似 shell mkdir -p 
err := os.MkdirAll("a/b/c/d", 0755)
// 如果临时使用这个目录建议使用defer删除
defer os.RemoveAll("dir")
~~~

### 列出目录的所有内容
~~~go
// c 为 制定目录的 []os.FileInfo 类型
c, err := ioutil.ReadDir("/etc")
for _, entry := range c {
    fmt.Println(" ", entry.Name(), entry.IsDir())
}
~~~

### 更换当前工作目录
~~~go
err := os.Chdir("/") // 更改当前工作目录
~~~

### 递归遍历子目录 walk
~~~go
// 对于walk函数的callback函数
func callback(p string, info os.FileInfo, err error) error {
    if err != nil {
        return err 
    }
    fmt.Println(" ", p, info.IsDir())
    return nil
}
// walk遍历所有目录
func main() {
    filepath.Walk("a/b", callback)
}
~~~

## 临时文件

- 临时文件在运行时用到，程序结束就不再使用的情况
- 临时文件意味着不会随着时间推移污染文件系统

### 使用ioutil创建临时文件
~~~go
// 创建并打开文件， 可以对文件读写
// 第一个参数 "", 会在操作系统默认位置创建文件 unix系统一般使用 "/tmp"
// 历史文件会以 "sample" 为前缀, 后缀会随机给并保证不重复
// 全名可以通过， f.Name() 获得
f, err := ioutil.TempFile("", "sample")
fmt.Print(f.Name())
// 创建的是临时文件，系统会在适合的时间删除
// 但是手动删除是个好习惯
defer os.Remove(f.Name())
// 这个文件可以跟正常文件对象一样操作
_, err := f.Write([]byte{1, 2, 3})
~~~

### 临时文件夹
- 在多个文件的时候，最好创建一临时文件夹
- 历史文件夹创建函数 `ioutil.TempDir()` 
- 参数同 `iotil.TempFile()`，但名字为文件夹的名字
~~~go
dirName, err := ioutil.TempDir("", "sampledir")
fmt.Println("Temp dir name :", dname)
defer os.RemoveAll(dirName)
fname := filepath.Join(dirName, "file1")
err := ioutil.WriteFile(fname, []byte{1, 2}, 0666)
if err != nil {...}
~~~

