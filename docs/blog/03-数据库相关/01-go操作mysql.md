---
---

# mysql
- 涉及概念默认的InnoDB引擎基于B+树的存储方式(索引和数据存在一起)
    - 聚簇索引会设为主键，（每主键，最左原则上，没最左索引，则隐含使用rowid 6bit）
    - 数据存储在b+树上按照主键顺序存放。
    - 使用自增每次插入就直接最后添加（一页满了16k，就添加一块）
    - 

## mysql相关概念

## golang操作mysql
- golang 针对 sql数据库做了框架，希望开发这按照官方的框架接口来时先数据驱动，实现不同数据库使用相同代码的无缝奇幻
- `database/sql`包定义了SQL或类SQL数据库的泛用接口
- 官方库里面并没有实现任何数据库的驱动
- 使用数据库至少注入一种数据库驱动

### 安装mysql数据库驱动
~~~sh
go get -u github.com/go-sql-driver/mysql
~~~

### 使用mysql数据库驱动
~~~go
import (
	"database/sql"

	_ "github.com/go-sql-driver/mysql" // 注入驱动，匿名导入即可
)
func main() {
   // DSN:Data Source Name
	dsn := "user:password@tcp(127.0.0.1:3306)/dbname"
    // 使用sql.Open函数验证参数格式，并未实际创建连接
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		panic(err)
	}
	defer db.Close()
}
~~~

### 初始化 连接池 连接池
- sql.Open函数
    - 验证参数格式，并未实际创建连接，可以调用Ping方法验证连接
    - 返回的db对象线程安全
    - db对象已经实现了连接池，open函数仅需要调用一次
    - 很少需要关闭得到的 db 对象
- 在 init 函数中创建初始化
~~~go
// init db
var db *sql.DB
func initDB() error {
    dsn := "user:password@tcp(127.0.0.1:3306)/sql_test?charset=utf8mb4&parseTime=True"
    // db 和 err 不适用 := 方法，因为 db 为全局变量
    var err error
    db, err = sql.Open("mysql", dsn)
    if err != nil {
		return err
	}
    err = db.Ping()
	if err != nil {
		return err
	}
    return nil
}

func main() {
	err := initDB() // 调用输出化数据库的函数
	if err != nil {
		fmt.Printf("init db failed,err:%v\n", err)
		return
	}
}
~~~

### 设置最大连接数
~~~go
// n 小于 0 不限制连接数，
func (db *DB) SetMaxOpenConns(n int)
~~~

### 最大闲置连接数
- 有些连接使用完毕了不一定直接关掉，可以让其空闲，这里设置最大空闲数量
~~~go
// 如果n<=0，不会保留闲置连接
func (db *DB) SetMaxIdleConns(n int)
~~~

## golang增删改查(CRUD)mysql

### 首先创建数据库
~~~sql
CREATE DATABASE sql_test;
use sql_test;
CREATE TABLE `user` (
    `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) DEFAULT '',
    `age` INT(11) DEFAULT '0',
    PRIMARY KEY(`id`)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;
~~~

### 查
定义一个结构体保存查询的数据
~~~go
type user struct {
	id   int
	age  int
	name string
}
~~~

### 单行查询
- `db.QueryRow()`
    - 该函数不会反回 error 
    - 调用该函数必须调用Scan()方法，不然不会释放连接，推荐使用链式调用
~~~go
// 函数签名
func (db *DB) QueryRow(query string, args ...interface{}) *Row
~~~

~~~go
// 实例
func qureyrow() {
    s = "select id, name, age from user where id=?"
    var u user 
    err := db.QueryRow(s, 1).Scan(&u.id, &u.name, &u.age)
    if err != nil {
		fmt.Printf("scan failed, err:%v\n", err)
    }
    ......
}
~~~

### 多行查询
- `db.Query()`
    - 反回的 rows 对象必须关闭来关闭连接
    - 使用 `for rows.Next() {rows.Scan()}` 遍历每一行数据
~~~go
func (db *DB) Query(query string, args ...interface{}) (*Rows, error)
~~~
使用案例
~~~go
func qurey(){
    sqlStr := "select id, name, age from user where id > ?"
	rows, err := db.Query(sqlStr, 0)
	if err != nil {
        fmt.Printf("query failed, err:%v\n", err)
		return
	}
	// 非常重要：关闭rows释放持有的数据库链接
	defer rows.Close()

	// 循环读取结果集中的数据
	for rows.Next() {
        var u user
		err := rows.Scan(&u.id, &u.name, &u.age)
		if err != nil {
            fmt.Printf("scan failed, err:%v\n", err)
			return
		}
		fmt.Printf("id:%d name:%s age:%d\n", u.id, u.name, u.age)
	}
}
~~~

### 曾删改
- 都使用 `db.Exec()`
    - 反悔的 Result 对象
        - ret.LastInsertId() 最后插入行id
        - ret.RowsAffected() 受影响的行数 

~~~go
// 函数签名
func (db *DB) Exec(query string, args ...interface{}) (Result, error)
~~~

~~~go
// 插入数据
func insertRowDemo() {
	sqlStr := "insert into user(name, age) values (?,?)"
	ret, err := db.Exec(sqlStr, "王五", 38)
	if err != nil {
		fmt.Printf("insert failed, err:%v\n", err)
		return
	}
	theID, err := ret.LastInsertId() // 新插入数据的id
	if err != nil {
		fmt.Printf("get lastinsert ID failed, err:%v\n", err)
		return
	}
	fmt.Printf("insert success, the id is %d.\n", theID)
}
~~~

## mysql预处理
### 什么是mysql预处理
- 普通的没有预处理的sql语句执行过程
	- 客户端进行站位符替换得到完整sql
	- 发送完整sql给mysql
	- mysql执行完返回

- 预处理过程
	- sql分成两部分， 命令和数据
	- 先发送出命令部分，mysql服务器对其进行sql预处理
	- 数据部分发送给mysql，有服务器完成占位符替换操作
	- mysql 服务端执行完整sql语句将结果返回客户端

### 优势
- 让服务端重复执行的sql，sql语句也是要编译后才运行的，
- 预处理的好处就是，一次编译多次运行，提高性能
- 可以避免sql注入的问题

### golang实现sql预处理查询
~~~go
func (db *DB) Prepre(query string) (*Stmt, error)
~~~
- 使用该函数创建的状态 stmt，使用这个可以同时执行多个查询命令。
~~~go
func prepareQuery() {
	sql := "select id, name, age form user where id > ?"
	stmt, err := db.Prepare(sql)
	if err != nil {
		return
	}
	defer stmt.Close()
	rows, err := stmt.Query(0)
	if err != nil {
		return 
	}
	defer rows.Close()
	for rows.Next() {
		var u user
		err := rows.Scan(&u.id, &u.name, &u.age)
		if err != nil {
			return
		}
		fmt.Printf(">>>%#v", u)
	}
}
~~~

### 使用预处理的-增删改
~~~go
// 预处理插入示例
func prepareInsertDemo() {
	sqlStr := "insert into user(name, age) values (?,?)"
	stmt, err := db.Prepare(sqlStr)
	if err != nil {
		fmt.Printf("prepare failed, err:%v\n", err)
		return
	}
	defer stmt.Close()
	_, err = stmt.Exec("小王子", 18)
	if err != nil {
		fmt.Printf("insert failed, err:%v\n", err)
		return
	}
	_, err = stmt.Exec("沙河娜扎", 18)
	if err != nil {
		fmt.Printf("insert failed, err:%v\n", err)
		return
	}
	fmt.Println("insert success.")
}
~~~

## Sql注入问题
::: danger 
任何时候都不要使用自行拼接字符串的方式组合SQL语句
- 存在sql注入问题的语句
~~~go
func Demo(name) {
	sqlStr := fmt.Sprintf("select id, name, age from user where name='%s'", name)
	var u user
	err := db.QueryRow(sqlStr).Scan(&u.id, &u.name, &u.age)
	......
}
~~~
- 下面的语句就会出现注入问题
~~~go
Demo("xxx' or 1=1#")
Demo("xxx' union select * from user #")
Demo("xxx' and (select count(*) from user) <10 #")
~~~
:::

## golang实现mysql的事务
- 事务：一个最小的不可再分的工作单元
- 比如银行转账，需要同时更新两个账户的余额

### 事务的ACID
- acid：原子性、一致性、隔离性、持久性
- mysql仅Inodb引擎支持事务
|特性|解释|
|-|-|
|原子性|事务的执行要全成功，要么全失败，事务可以通过回滚恢复|
|一致性|事务执行前后，数据库的完整性没有破坏|
|隔离性|允许多个事务并发对数据的读写，分级（读未提交、读提交、可重复度、串行化）|
|持久性|事务执行完就已经落盘，不会因为机器故障就导致丢失|

### golang实现事务的三个方法
- 分别是，开始事务、提交事务、回滚事务
~~~go
func (db *DB) Begin() (*Tx, error)
func (tx *Tx) Commit() error
func (tx *Tx) Rollback() error
~~~
- 事物操作能够确保两次更新操作要么同时成功要么同时失败，不会存在中间状态。
~~~go
func shiwu() {
	tx, err := db.Begin() // 开启事务
	if err != nil {
		if tx != nil {
			tx.Rollbak() // 回滚
		}
		fmt.Print("err")
		return
	}
	sqlStr1 := "Update user set age=30 where id=?"
	ret1, err := tx.Exec(sqlStr1, 2)
	if err != nil {
		tx.Rollbak()
		fmt.Print("err")
		return
	}
	affRow1, err := ret1.RowsAffected()
	if err != nil {
		tx.Rollback() // 回滚
		fmt.Printf("exec ret1.RowsAffected() failed, err:%v\n", err)
		return
	}
	sqlStr2 := "Update user set age=40 where id=?"
	ret2, err := tx.Exec(sqlStr2, 3)
	if err != nil {
		tx.Rollback() // 回滚
		fmt.Printf("exec sql2 failed, err:%v\n", err)
		return
	}
	affRow2, err := ret2.RowsAffected()
	if err != nil {
		tx.Rollback() // 回滚
		fmt.Printf("exec ret1.RowsAffected() failed, err:%v\n", err)
		return
	}
	fmt.Println(affRow1, affRow2)
	if affRow1 == 1 && affRow2 == 1 {
		fmt.Println("事务提交啦...")
		tx.Commit() // 提交事务
	} else {
		tx.Rollback()
		fmt.Println("事务回滚啦...")
	}
	fmt.Println("exec trans success!")
}
~~~