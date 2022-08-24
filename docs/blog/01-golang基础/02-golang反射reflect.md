---
sidebar: auto
---
# golang Reflect 反射

- 通过反射可以获取丰富的类型信息，并可以利用这些类型信息做非常灵活的工作。

## golang反射

- 运行时更新和检查变量的值、调用变量的方法和变量支持的内在操作
- 编译时并不知道这些变量的具体类型，这种机制被称为反射

## Reflect 包

- 两个重要的类型 `Type` 和 `Value` 
- 意接口值在反射中都可以理解为由 `reflect.Type` 和 `reflect.Value`
- `reflect.TypeOf` 和 `reflect.ValueOf` 两个函数来获取任意对象的 `Value` 和 `Type`

|类型|作用|
|----|----|
|reflect.ValueOf()|获取输入参数接口中的数据的值，如果为空则返回0 <- 注意是0|
|reflect.TypeOf()|动态获取输入参数接口中的值的类型，如果为空则返回nil <- 注意是nil|

## 反射的类型对象（reflect.Type）

```go
func main() {
    var a int
    typeOfA := reflect.TypeOf(a)
    fmt.Println(typeOfA.Name(), typeOfA.Kind())
}
```
## `Type` 和 `Kind` 的区别
- 一般 类型 `Type`, 变量的种类 `Kind`
- `Type`
  - 指的是golang 原生类型（int,float,bool...）和通过type关键字定义的类型
- `Kind`
  - 指的是对象归属的品种，在 reflect 包中有定义
```go
const (
    Invalid Kind = iota  // 非法类型
    Bool                 // 布尔型
    Int                  // 有符号整型
    Int8                 // 有符号8位整型
    Int16                // 有符号16位整型
    Int32                // 有符号32位整型
    ……
)
```

::: tip Type 和 Kind 的区别
```go
// 定义一个Enum类型
type Enum int
const (
    Zero Enum = 0
)
func main() {
    // 声明一个空结构体
    type cat struct {
    }
    // 获取结构体实例的反射类型对象
    typeOfCat := reflect.TypeOf(cat{})
    // 显示反射类型对象的名称和种类
    fmt.Println(typeOfCat.Name(), typeOfCat.Kind())
    // 获取Zero常量的反射类型对象
    typeOfA := reflect.TypeOf(Zero)
    // 显示反射类型对象的名称和种类
    fmt.Println(typeOfA.Name(), typeOfA.Kind())
}
```
- 输入结果如下
```txt
cat struct
Enum int
```
:::

## 指针与指针指向的元素`reflect.Elem()`

- `reflect.Elem()`: 对指针获取反射对象,称为取元素

::: tip reflect.Elem
```go
func main() {
    // 声明一个空结构体
    type cat struct {
    }
    // 创建cat的实例
    ins := &cat{}
    // 获取结构体实例的反射类型对象
    typeOfCat := reflect.TypeOf(ins)
    // 显示反射类型对象的名称和种类
    fmt.Printf("name:'%v' kind:'%v'\n", 
        typeOfCat.Name(), typeOfCat.Kind())
    // 取类型的元素
    typeOfCat = typeOfCat.Elem()
    // 显示反射类型对象的名称和种类
    fmt.Printf("element name: '%v', element kind: '%v'\n", 
        typeOfCat.Name(), typeOfCat.Kind())
}
```
- 输入结果如下
```txt
name:'' kind:'ptr'
element name: 'cat', element kind: 'struct'
```
:::

## 使用反射获取结构体的成员类型

- 如果`reflect.TypeOf()`获取的类型时结构体
- 可以通过 `reflect.Type` 的 `NumField()` 和 `Field()` 方法获取成员详细信息
- reflect.Type 中的 Field() 方法和 NumField 一般都是配对使用，用来实现结构体成员的遍历操作。

|方法	| 说明|
|----|----|
|Field(i int) StructField|根据索引获取字段信息，不是结构体或索越界panic|
|NumField() int|获取结构体字段个数， 非结构体panic|
|FieldByName(name string) (StructField, bool)|根据字符串获取字段信息，没有找到返回false，非结构体引发panic|
|FieldByIndex(index []int) StructField	|多层成员访问，根据 []int 提供的每个结构体的字段索引，返回字段的信息，没有找到时返回零值。非结构体panic|
|FieldByNameFunc(match func(string) bool) (StructField,bool)|根据匹配函数匹配需要的字段，非结构体panic|
|NumMethod() int|	返回该类型的方法集中方法的数目|
|Method(int) Method|	返回该类型方法集中的第i个方法|
|MethodByName(string)(Method, bool)|	根据方法名返回该类型方法集中的方法|
```go
func printMethod(x interface{}) {
	t := reflect.TypeOf(x)
	v := reflect.ValueOf(x)

	fmt.Println(t.NumMethod())
	for i := 0; i < v.NumMethod(); i++ {
		methodType := v.Method(i).Type()
		fmt.Printf("method name:%s\n", t.Method(i).Name)
		fmt.Printf("method:%s\n", methodType)
		// 通过反射调用方法传递的参数必须是 []reflect.Value 类型
		var args = []reflect.Value{}
		v.Method(i).Call(args)
	}
}
```

## StructField 字段详细信息
```go
type StructField struct {
    Name string          // 字段名
    PkgPath string       // 字段路径
    Type      Type       // 字段反射类型对象
    Tag       StructTag  // 字段的结构体标签
    Offset    uintptr    // 字段在结构体中的相对偏移
    Index     []int      // Type.FieldByIndex中的返回的索引值
    Anonymous bool       // 是否为匿名字段
}
```

::: tip 获取Tag案例
```go {17,22}
func main() {
    // 声明一个空结构体
    type cat struct {
        Name string
        // 带有结构体tag的字段
        Type int `json:"type" id:"100"`
    }
    // 创建cat的实例
    ins := cat{Name: "mimi", Type: 1}
    // 获取结构体实例的反射类型对象
    typeOfCat := reflect.TypeOf(ins)
    // 遍历结构体所有成员
    for i := 0; i < typeOfCat.NumField(); i++ {
        // 获取每个成员的结构体字段类型
        fieldType := typeOfCat.Field(i)
        // 输出成员名和tag
        fmt.Printf("name: %v  tag: '%v'\n", fieldType.Name, fieldType.Tag)
    }
    // 通过字段名, 找到字段类型信息
    if catType, ok := typeOfCat.FieldByName("Type"); ok {
        // 从tag中取出需要的tag
        fmt.Println(catType.Tag.Get("json"), catType.Tag.Get("id"))
    }
}
```
- 输出如下
```txt
name: Name  tag: ''
name: Type  tag: 'json:"type" id:"100"'
type 100
```
:::



## 结构体 Tag

- `func (tag StructTag) Get(key string) string`
  - 根据 Tag 中的键获取对应的值
- `func (tag StructTag) Lookup(key string) (value string, ok bool)`
  - 根据 Tag 中的键，查询值是否存在。

::: danger
编写 Tag 时，必须严格遵守键值对的规则。结构体标签的解析代码的容错能力很差，一旦格式写错，编译和运行时都不会提示任何错误 
- 错误例子例子，（tag要注意空格，新版本有一定优化，但希望注意标准）
- 正确应该时`json:"type"id:"100"`，删去空格即可
```go {4}
func main() {
    type cat struct {
        Name string
        Type int `json: "type" id:"100"`
    }
    typeOfCat := reflect.TypeOf(cat{})
    if catType, ok := typeOfCat.FieldByName("Type"); ok {
        fmt.Println(catType.Tag.Get("json"))
    }
}
```
:::

## `reflect.ValueOf()`和`reflect.Value`
reflect.ValueOf()返回的是reflect.Value类型，其中包含了原始值的值信息。reflect.Value与原始值之间可以互相转换


|方法|	说明|
|-|-|
|Interface() interface {}|	以 interface{} 类型返回，可以类型断言转换为指定类型|
|Int() int64|	将值以 int 类型返回，所有有符号整型均可以此方式返回|
|Uint() uint64|	将值以 uint 类型返回，所有无符号整型均可以此方式返回|
|Float() float64|	将值以双精度（float64）类型返回，所有浮点数均可以此方式返回|
|Bool() bool|	将值以 bool 类型返回|
|Bytes() []bytes|	将值以字节数组 []bytes 类型返回|
|String() string|	将值以字符串类型返回|

```go
func reflectValue(x interface{}) {
	v := reflect.ValueOf(x)
	k := v.Kind()
	switch k {
	case reflect.Int64:
		// v.Int()从反射中获取整型的原始值，然后通过int64()强制类型转换
		fmt.Printf("type is int64, value is %d\n", int64(v.Int()))
	case reflect.Float32:
		// v.Float()从反射中获取浮点型的原始值，然后通过float32()强制类型转换
		fmt.Printf("type is float32, value is %f\n", float32(v.Float()))
	case reflect.Float64:
		// v.Float()从反射中获取浮点型的原始值，然后通过float64()强制类型转换
		fmt.Printf("type is float64, value is %f\n", float64(v.Float()))
	}
}
```

## 通过反射设置变量的值
- 应注意函数传参如果是值的话不能修改，如果是指真的话注意搭配`Elem()`
```go
func reflectChangeVal(x interface{}){
    v := reflect.ValueOf(x)
	// 反射中使用 Elem()方法获取指针对应的值
	if v.Elem().Kind() == reflect.Int64 {
        v.Elem().SetInt(200)
	}
}
```

## 判断是否为空`isNil` `isValid()`
- `func (v Value) IsNil() bool`
  - IsNil()报告v持有的值是否为nil。v持有的值的分类必须是通道、函数、接口、映射、指针、切片之一；否则IsNil函数会导致panic。
- `func (v Value) IsValid() bool`
  - IsValid()返回v是否持有一个值。如果v是Value零值会返回假，此时v除了IsValid、String、Kind之外的方法都会导致panic。
::: tip IsNil()常被用于判断指针是否为空；IsValid()常被用于判定返回值是否有效。
```go
func main() {
	// *int类型空指针
	var a *int
	fmt.Println("var a *int IsNil:", reflect.ValueOf(a).IsNil())
	// nil值
	fmt.Println("nil IsValid:", reflect.ValueOf(nil).IsValid())
	// 实例化一个匿名结构体
	b := struct{}{}
	// 尝试从结构体中查找"abc"字段
	fmt.Println("不存在的结构体成员:", reflect.ValueOf(b).FieldByName("abc").IsValid())
	// 尝试从结构体中查找"abc"方法
	fmt.Println("不存在的结构体方法:", reflect.ValueOf(b).MethodByName("abc").IsValid())
	// map
	c := map[string]int{}
	// 尝试从map中查找一个不存在的键
	fmt.Println("map中不存在的键：", reflect.ValueOf(c).MapIndex(reflect.ValueOf("娜扎")).IsValid())
}
```
:::