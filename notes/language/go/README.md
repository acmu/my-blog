---
title: go
date: 2009-09-09 09:09:09
tags: 草稿
---

[官网](https://go.dev/)

[学习文档](https://www.runoob.com/go/go-tutorial.html)

可以使用`go build` 来生过二进制文件（这像不像 c++和 java 的编译？）

Go 语言接受了函数式编程的一些想法，支持匿名函数与闭包。再如，Go 语言接受了以 Erlang 语言为代表的面向消息编程思想，支持 goroutine 和通道，并推荐使用消息而不是共享内存来进行并发编程。

使用 `go version` 即可查看 go 的版本，如果运行正常，即安装成功

go 的安装很简单，下载安装包，执行安装即可

Hello world 代码

```go
package main

import "fmt"

func main() {
   /* 这是我的第一个简单的程序 */
   fmt.Println("Hello, World!")
}
```

执行 go run hello.go

go 还是你狠，为了格式化代码，大括号的位置竟然都能语法报错了

```go
package main

import "fmt"

func main()
{  // 错误，{ 不能在单独的行上
    fmt.Println("Hello, World!")
}
```

go 也不鼓励行尾写分号
