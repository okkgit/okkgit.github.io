---
sidebar: auto
sidebarDepth: 2
---
# golang文件操作
## 判断文件是否存在
```go
func checkFileIsExist(filename string) bool {
	var exist = true
	if _, err := os.Stat(filename); os.IsNotExist(err) {
		exist = false
	}
	return exist
}
```

## 创建空文件,打开不存在的文件
```go
func main() {
    newFile, err := os.Create("filename.suffix")
    if err != nil {
        log.Fatal(err)
    }
    defer newFile.Close()
    log.Println(newFile)
}
```

## 打开文件，打开一个存在的文件对象
```go
func main() {
    // 如果仅读模式打开文件可以使用os.Open
    // f, err := os.Open("filePath")
    // 使用 os.OpenFile(), 
    // os.O_RDONLY // 只读
    // os.O_WRONLY // 只写
    // os.O_RDWR   // 读写
    // os.O_APPEND // 追加
    // os.O_CREATE // 没有会创建
    // os.O_TRUNC  // 覆盖打开
    f, err := os.OpenFile("filePath", os.O_APPEND|os.O_RDONLY, 0666)
    if err != nil {
        log.Fatal(err)
    }
    defer newFile.Close()
}
```
## 读文件
```go
func main() {
    f, err := os.Open("filepath")
    if err ...
    defer f.CLose()
    //带缓冲区的读取
    reader := bufio.NewReader(f)
    
    for {
        // 按行读
        // str, err := reader.ReadString("\n")
        // fmt.Println(str)
        // 缓冲区读取
        buf := make([]byte, 1024)
        n, err := reader.Read(buf) // 每次读取 1024个字节到 buf
        ...
        if err == io.EOF {
            break
        }
    }

    // 可以直接使用 ioutil 包直接读取完整的整个文件
    content, err := ioutil.ReadFile("filePath") // 不需要关闭， Close 已经被封装在内部
    if err ...
    fmt.Println(string(content))
}
```

## 写入 （向打开的文件写入字符串,字节）
```go
func main() {
    f, err := os.Open("filePath", os.O_APPEND, 0666)
    if err != nil {
        log.Fatal(err)
    }
    defer newFile.Close()
    // 使用 io 包写入字符串
    err := io.WriteString(f, "写入到文件内的字符串")
    if err ...
    // File 结构方法写入字符
    n, err := f.Wirte([]bytes("写入到文件内的字符串"))
    if err ...
    fmt.Printf("成功写入%d个字符", n)
    // File 结构方法写入字符串
    n, err := f.WriteString("写入到文件内的字符串")
    if err ...
    fmt.Printf("成功写入%d个字符串", n)
    // 使用带缓冲区的文件写入
    writer := bufio.NewWriter(f)
    writer.WriteString("写入到文件内的字符串")
    writer.Flush() // 从缓冲区写入到文件内
}
```

## 获取文件信息
```go
func main() {
    fileInfo, err := os.Stat("test.txt")
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("File name:", fileInfo.Name())
    fmt.Println("Size in bytes:", fileInfo.Size())
    fmt.Println("Permissions:", fileInfo.Mode())
    fmt.Println("Last modified:", fileInfo.ModTime())
    fmt.Println("Is Directory: ", fileInfo.IsDir())
    fmt.Printf("System interface type: %T\n", fileInfo.Sys())
    fmt.Printf("System info: %+v\n\n", fileInfo.Sys())
}
```

## 文件移动、文件重命名
```go
func main() {
    originalPath := "test.txt"
    newPath := "test2.txt"
    err := os.Rename(originalPath, newPath)
    if err != nil {
        log.Fatal(err)
    }
}
```

## 删除文件
```go
func main() {
    err := os.Remove("test.txt")
    if err != nil {
        log.Fatal(err)
    }
}
```



## 封装使用缓冲区的CopyFile函数
~~~go
func copyFile(srcFileName,destFileName string)(int64,error){
   srcFile,err := os.Open(srcFileName)
   if err != nil {
      return 0,err
   }
   defer srcFile.Close()
   reader := bufio.NewReader(srcFile)
   destFile,err := os.OpenFile(destFileName,os.O_CREATE|os.O_WRONLY,0666)
   if err != nil {
      return 0,err
   }
   writer := bufio.NewWriter(destFile)
   defer destFile.Close()
   n,err := io.Copy(writer,reader)
   // 如果不调用 Flush 将会出现目标文件没有内容
   writer.Flush()
   return n,err
}
~~~