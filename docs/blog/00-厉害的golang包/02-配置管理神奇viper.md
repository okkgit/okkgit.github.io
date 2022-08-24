---
sidebar: auto
---

# Viper配置文件工具

viper 是go语言完整的配置解决方案，适用所有配置文件类型，总之很强
- 支持默认值
- JSON、TOML、YAML、HCL......等格式配置文件
- 读取环境变量，远程配置系统（ETCD或Consul）,命令行,buffer
- 显示配置信息

## 安装

```go
go get github.com/spf13/viper
```

## 配置来源的优先级

- 配置优先级从高到低
    - 显示调用Set设置值
    - 命令行参数（flag）
    - 环境变量
    - 配置文件
    - key/value存储
    - 默认值

## 创建默认值
```go
viper.SetDefault("ContentDir", "content")
viper.SetDefault("LayoutDir", "layouts")
viper.SetDefault("Taxonomies", map[string]string{"tag": "tags", "category": "categories"})
```

## 读取配置文件
使用Viper搜索和读取配置文件的示例。不需要任何特定的路径，但是至少应该提供一个配置文件预期出现的路径。

```go
viper.SetConfigFile("./config.yaml") // 制定配置文件的路径
viper.SetConfigName("config") // 配置文件名称(无扩展名)
viper.SetConfigType("yaml") // 如果配置文件的名称中没有扩展名，则需要配置此项

// 多次调用查找配置文件
viper.AddConfigPath("/etc/appname/")   // 查找配置文件所在的路径
viper.AddConfigPath("$HOME/.appname")  // 多次调用以添加多个搜索路径
viper.AddConfigPath(".")               // 还可以在工作目录中查找配置

// 查找读取配置文件
err := viper.ReadInConfig() // 查找并读取配置文件
if err != nil { // 处理读取配置文件的错误
	panic(fmt.Errorf("Fatal error config file: %s \n", err))
}
```
- 通过下面方法查找制定目录的制定名字（不包含后缀）的配置文件
~~~go
viper.SetConfigName("config")
viper.AddConfigPath("./conf")
~~~
- 处理找不到文件的特定情况
~~~go
if err := viper.ReadInConfig(); err != nil {
    if _, ok := err.(viper.ConfigFileNotFoundError); ok {
        // 配置文件未找到错误；如果需要可以忽略
    } else {
        // 配置文件被找到，但产生了另外的错误
    }
}
~~~

## 写入配置文件
针对在运行是需要修改配置文件的需求。
- WriteConfig 将当前viper配置写入预定义目录, 如果不存在报错
- SafeWriteConfig 同上，不存在也报错，但存在的话并不会覆盖
- WriteConfigAs 当前配置写入制定路径，存在则覆盖
- SafeWriteConfigAs 同上，但不会覆盖
~~~go
iper.WriteConfig() // 将当前配置写入“viper.AddConfigPath()”和“viper.SetConfigName”设置的预定义路径
viper.SafeWriteConfig()
viper.WriteConfigAs("/path/to/my/.config")
viper.SafeWriteConfigAs("/path/to/my/.config") // 因为该配置文件写入过，所以会报错
viper.SafeWriteConfigAs("/path/to/my/.other_config")
~~~

## 可以使用回调函数监听配置文件的修改
- 需要再调用WatchConfig() 方法之前，已经分配了配置文件的路径
~~~go
viper.WatchConfig()
viper.OnConfigChange(func(e fsnotify.Event) {
    fmt.Println("Config file changed:", e.Name)
})
~~~

## 从io.Reader读取配置文件
~~~go
viper.SetConfigType("yaml") // 或者 viper.SetConfigType("YAML")

// 任何需要将此配置添加到程序中的方法。
var yamlExample = []byte(`
Hacker: true
name: steve
hobbies:
- skateboarding
- snowboarding
- go
clothing:
  jacket: leather
  trousers: denim
age: 35
eyes : brown
beard: true
`)

viper.ReadConfig(bytes.NewBuffer(yamlExample))

viper.Get("name") // 这里会得到 "steve"
~~~

## 覆盖设置
~~~go
viper.Set("Verbose", true)
viper.Set("LogFile", LogFile)
~~~

## 注册和使用别名
~~~go
viper.RegisterAlias("loud", "Verbose")  // 注册别名（此处loud和Verbose建立了别名）

viper.Set("verbose", true) // 结果与下一行相同
viper.Set("loud", true)   // 结果与前一行相同

viper.GetBool("loud") // true
viper.GetBool("verbose") // true
~~~

## 使用环境变量
- Viper将ENV变量视为区分大小写
~~~go
SetEnvPrefix("spf") // 将自动转为大写
BindEnv("id")

os.Setenv("SPF_ID", "13") // 通常是在应用程序之外完成的

id := Get("id") // 13
~~~

## 使用Flags
- Viper 具有绑定到标志的能力。具体来说，Viper支持Cobra库中使用的Pflag。
~~~go
serverCmd.Flags().Int("port", 1138, "Port to run Application server on")
viper.BindPFlag("port", serverCmd.Flags().Lookup("port"))
~~~

- 直接使用已经绑定好的 Cobra库中Pflag
~~~go
pflag.Int("flagname", 1234, "help message for flagname")

pflag.Parse()
viper.BindPFlags(pflag.CommandLine)

i := viper.GetInt("flagname") // 从viper而不是从pflag检索值
~~~

- 在 Viper 中使用 pflag 并不阻碍其他包中使用标准库中的 flag 包。pflag 包可以通过导入这些 flags 来处理flag包定义的flags。这是通过调用pflag包提供的便利函数AddGoFlagSet()来实现的。
~~~go
package main

import (
	"flag"
	"github.com/spf13/pflag"
)

func main() {

	// 使用标准库 "flag" 包
	flag.Int("flagname", 1234, "help message for flagname")

	pflag.CommandLine.AddGoFlagSet(flag.CommandLine)
	pflag.Parse()
	viper.BindPFlags(pflag.CommandLine)

	i := viper.GetInt("flagname") // 从 viper 检索值

	...
}
~~~

## flag接口，绑定其他flag工具
- FlagValue表示单个flag。这是一个关于如何实现这个接口的非常简单的例子
~~~go
// 一个实现接口的flag函数签名
type myFlag struct {}
func (f myFlag) HasChanged() bool { return false }
func (f myFlag) Name() string { return "my-flag-name" }
func (f myFlag) ValueString() string { return "my-flag-value" }
func (f myFlag) ValueType() string { return "string" }
~~~
实现这个接口后，很容易绑定到viper
~~~go
viper.BindFlagValue("my-flag-name", myFlag{})
~~~

- FlagValueSet代表一组 flags 。这是一个关于如何实现这个接口的非常简单的例子:
~~~go
type myFlagSet struct {
	flags []myFlag
}

func (f myFlagSet) VisitAll(fn func(FlagValue)) {
	for _, flag := range flags {
		fn(flag)
	}
}
~~~

- 实现 FlagValueSet 接口来后将一组flags注册到Viper
~~~go
fSet := myFlagSet {
    flags: []myFlag{myFlag{}, myFlag{}},
}
viper.BindFlagValues("my-flags", fSet)
~~~

## 远程key/value存储支持
- 在Viper中启用远程支持，需要在代码中匿名导入viper/remote这个包。
~~~go
import _ "github.com/spf13/viper/remote"
~~~
- Viper将读取从Key/Value存储（例如etcd或Consul）中的路径检索到的配置字符串（如JSON、TOML、YAML、HCL、envfile和Java properties格式）
- 注意配置的优先级：
    - 磁盘上的配置文件>命令行标志位>环境变量>远程Key/Value存储>默认值
- Viper使用crypt从K/V存储中检索配置，这意味着如果你有正确的gpg密匙，你可以将配置值加密存储并自动解密。加密是可选的。
- 你可以将远程配置与本地配置结合使用，也可以独立使用。
- crypt有一个命令行助手，你可以使用它将配置放入K/V存储中。crypt默认使用在http://127.0.0.1:4001的etcd。
~~~sh
go get github.com/bketelsen/crypt/bin/crypt
crypt set -plaintext /config/hugo.json /Users/hugo/settings/config.json
~~~

## 获取远程配置文件示例
### ETCD
~~~go
viper.AddRemoteProvider("etcd", "http://127.0.0.1:4001","/config/hugo.json")
// 因为在字节流中没有文件扩展名，所以这里需要设置下类型。
// 支持的扩展名有 "json", "toml", "yaml", "yml", 
// "properties", "props", "prop", "env", "dotenv"
viper.SetConfigType("json") 
err := viper.ReadRemoteConfig()
~~~
### Consul
- 需要 Consul Key/Value存储中设置一个Key保存包含所需配置的JSON值。例如，创建一个keyMY_CONSUL_KEY将下面的值存入Consul key/value 存储：
~~~go
{
    "port": 8080,
    "name": "enc",
}
~~~
~~~go
viper.AddRemoteProvider("consul", "localhost:8500", "MY_CONSUL_KEY")
viper.SetConfigType("json") // 需要显示设置成json
err := viper.ReadRemoteConfig()

fmt.Println(viper.Get("port")) // 8080
fmt.Println(viper.Get("name")) // enc
~~~

### firestore
~~~go
viper.AddRemoteProvider("firestore", "google-cloud-project-id", "collection/document")
viper.SetConfigType("json") // 配置的格式: "json", "toml", "yaml", "yml"
err := viper.ReadRemoteConfig()
~~~

## 远程Key/Value存储示例-加密
~~~go
viper.AddSecureRemoteProvider("etcd","http://127.0.0.1:4001","/config/hugo.json","/etc/secrets/mykeyring.gpg")
viper.SetConfigType("json") err := viper.ReadRemoteConfig()
~~~

## 监控etcd中的更改-未加密
~~~go
// 或者你可以创建一个新的viper实例
var runtime_viper = viper.New()

runtime_viper.AddRemoteProvider("etcd", "http://127.0.0.1:4001", "/config/hugo.yml")
runtime_viper.SetConfigType("yaml") 

// 第一次从远程读取配置
err := runtime_viper.ReadRemoteConfig()

// 反序列化
runtime_viper.Unmarshal(&runtime_conf)

// 开启一个单独的goroutine一直监控远端的变更
go func(){
	for {
	    time.Sleep(time.Second * 5) // 每次请求后延迟一下

	    // 目前只测试了etcd支持
	    err := runtime_viper.WatchRemoteConfig()
	    if err != nil {
	        log.Errorf("unable to read remote config: %v", err)
	        continue
	    }

	    // 将新配置反序列化到我们运行时的配置结构体中。你还可以借助channel实现一个通知系统更改的信号
	    runtime_viper.Unmarshal(&runtime_conf)
	}
}()
~~~

## 从Viper获取值
- 根据获取值类型不同使用以下方法
|函数签名|返回值类型|
|-|-|
|Get(key string) | interface{}|
|GetBool(key string) | bool|
|GetFloat64(key string) | float64|
|GetInt(key string) | int|
|GetIntSlice(key string) | []int|
|GetString(key string) | string|
|GetStringMap(key string) | map[string]interface{}|
|GetStringMapString(key string) | map[string]string|
|GetStringSlice(key string) | []string|
|GetTime(key string) | time.Time|
|GetDuration(key string) | time.Duration|
|IsSet(key string) | bool|
|AllSettings() | map[string]interface{}|

::: warring
- GET系方法在找不到值时会返回对应的零值
- 判断是否存在需要使用 `IsSet()`方法
:::

### 访问嵌套的键值
- 例如json可能对象套对象的格式
~~~json
{
    "host":{
        "address": "localhost",
        "port": 8080
    }
}
~~~
- 这时候访问port既可以使用
~~~go
vipper.GetInt("host.port")
~~~

### 提取子树
- 有如下 yaml 配置文件
~~~yaml
app:
    cache1:
        max-items: 100
        item-size: 64
    cache2:
        max-items: 200
        item-size: 80
~~~
- 获取子树
~~~go
subv := viper.Sub("app.cache1")
~~~
- `subv`这个时候就是代表对应子树
~~~yaml
max-items: 100
item-size: 64
~~~

### 使用子树
针对如下创建缓存的函数，并且输入参数是 基于subv格式的
~~~go
func NewCache(cfg *Viper) *Cache {...}
~~~
- 使用子树就可以轻松创建多个不同配置的缓存了
~~~go
cfg1 := viper.Sub("app.cache1")
cache1 := NewCache(cfg1)

cfg2 := viper.Sub("app.cache2")
cache2 := NewCache(cfg2)
~~~

## 反序列化，导出配置
- 可以将配置的值或部分值值解析到结构体、map等。
~~~go
// 两个方法实现
Unmarshal(rawVal interface{})  error
UnmarshalKey(key string, rawVal interface{})  error
~~~

- 栗子
~~~go
type config struct {
	Port int
	Name string
	PathMap string `mapstructure:"path_map"`
}

var C config

err := viper.Unmarshal(&C)
if err != nil {
	t.Fatalf("unable to decode into struct, %v", err)
}
~~~

- 修改键分隔符（解决想要键值内本身村在`.`的情况）
~~~go
v := viper.NewWithOptions(viper.KeyDelimiter("::"))

v.SetDefault("chart::values", map[string]interface{}{
    "ingress": map[string]interface{}{
        "annotations": map[string]interface{}{
            "traefik.frontend.rule.type":                 "PathPrefix",
            "traefik.ingress.kubernetes.io/ssl-redirect": "true",
        },
    },
})

type config struct {
	Chart struct{
        Values map[string]interface{}
    }
}

var C config

v.Unmarshal(&C)
~~~

### 解析到嵌套结构体
~~~go
/*
Example config:

module:
    enabled: true
    token: 89h3f98hbwf987h3f98wenf89ehf
*/
type config struct {
	Module struct {
		Enabled bool

		moduleConfig `mapstructure:",squash"`
	}
}

// moduleConfig could be in a module specific package
type moduleConfig struct {
	Token string
}

var C config

err := viper.Unmarshal(&C)
if err != nil {
	t.Fatalf("unable to decode into struct, %v", err)
}
~~~

## 序列化成为字符串
- 选用自定义的格式化器与 `AllSettings()`方法一起使用
~~~go
import yaml

func yamlStringSetting() string {
    c = viper.AllSetting()
    bs, err := yaml.Marshal(c)
    if err != nil {
        ...
    }
    return bs
}

## 使用多个Viper实例
- 一般默认viper使用的是类似单例模式
- 如果用户需要使用不同多套的配置则可以手动创建实例
~~~go
a := viper.New()
b := viper.New()
a.SetDefault("usernae", "a")
b.SetDefault("usernae", "b")
~~~

## 使用Viper较完整的实例
- 存在config.yaml配置文件
~~~yaml
port: 8123
version: "v1.2.3"
~~~

### gin框架中简单使用viper的实例

~~~go
package main

import (
    "fmt"
    "net/http"

    "github.com/gin-gonic/gin"
    "github.com/spf13/viper"
)

func main() {
    viper.SetConfigFile("config.yaml")
    viper.AddConfigPath(".")// 指定查找配置文件的目录
    err := viper.ReadInConfig()
    if err != nil {
        panic(fmt.Errorf("配置文件读取失败, err%s", err))
    }

    // 开启监控配置文件变化
    Viper.WatchConfig()

    // gin框架helloworld
    r := gin.Default()
    r.GET("/version", func(c *gin.Context) {
        c.String(http.StatusOK, viper.GetString("version"))
    })
	if err := r.Run(
		fmt.Sprintf(":%d", viper.GetInt("port"))); err != nil {
		panic(err)
	}
}

### 使用中可能会用先加载到本地结构体中
~~~go
package main

import (
	"fmt"
	"net/http"

	"github.com/fsnotify/fsnotify"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

type Config struct {
	Port    int    `mapstructure:"port"`
	Version string `mapstructure:"version"`
}

var Conf = new(Config)

func main() {
	viper.SetConfigFile("./conf/config.yaml") // 指定配置文件路径
	err := viper.ReadInConfig()               // 读取配置信息
	if err != nil {                           // 读取配置信息失败
		panic(fmt.Errorf("Fatal error config file: %s \n", err))
	}
	// 将读取的配置信息保存至全局变量Conf
	if err := viper.Unmarshal(Conf); err != nil {
		panic(fmt.Errorf("unmarshal conf failed, err:%s \n", err))
	}
	// 监控配置文件变化
	viper.WatchConfig()
	// 注意！！！配置文件发生变化后要同步到全局变量Conf
	viper.OnConfigChange(func(in fsnotify.Event) {
		fmt.Println("夭寿啦~配置文件被人修改啦...")
		if err := viper.Unmarshal(Conf); err != nil {
			panic(fmt.Errorf("unmarshal conf failed, err:%s \n", err))
		}
	})

	r := gin.Default()
	// 访问/version的返回值会随配置文件的变化而变化
	r.GET("/version", func(c *gin.Context) {
		c.String(http.StatusOK, Conf.Version)
	})

	if err := r.Run(fmt.Sprintf(":%d", Conf.Port)); err != nil {
		panic(err)
	}
}
~~~