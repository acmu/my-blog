---
title: git 知识
date: 2009-09-09 09:09:09
tags: 草稿
---

## 普通提交

```sh
git add .

git commit -m 'msg'

git push
```

## 精致提交

可修改的（即 rebase）

只改 提交信息

```
git commit --amend
```

只改 提交内容

都改

[参考这里](https://github.com/zuopf769/how_to_use_git/blob/master/%E4%BD%BF%E7%94%A8git%20rebase%E5%90%88%E5%B9%B6%E5%A4%9A%E6%AC%A1commit.md)

```
git rebase -i HEAD~3
```

rebase 更强 可以改好多东西

但这些更改都是要在本地，如果 push 到了远程，就不能改了

## 疑问

冲突到底是怎么产生的？解决冲突时应该注意什么？
