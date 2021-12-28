---
title: rust
date: 2009-09-09 09:09:09
tags: 草稿
---

[官网](https://www.rust-lang.org/learn/get-started)

[学习教程](https://www.runoob.com/rust/rust-tutorial.html)

使用 `cargo --version` 或 `rustc -V` 即可查看 rust 的版本，如果运行正常，即安装成功

rust 安装最好还是使用 curl 安装，之后开全局的科学上网，等待一会即可安装成功，之后在 vscode 上也要安装 rust 扩展，rust 扩展又会要求安装一些工具，还是等待即可，最后安装完成即可（rust 的安装比较费劲，主要是网络很慢，有时还会超时失败，而且要安装很多东西，有些费劲）

测试是否正常：

建一个新的文件夹，如 runoob-greeting，之后进入执行`cargo new greeting ` 再执行

```
cd ./greeting
cargo build
cargo run
```

即可，就能正常运行 rust 了
