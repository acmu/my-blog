---
title: git 知识
date: 2009-09-09 09:09:09
tags: 草稿
---





配置用户名与邮箱

```
这是全局配置
git config --global user.name "Your Name"
git config --global user.email "email@example.com"

这是局部配置
git config user.name "Your Name"
git config user.email "email@example.com"
```





## 普通提交

```sh
git add .

git commit -m 'msg'

git push
```



```
基于当前分支新建分支
git branch 分支名

切换分支
git checkout 分支名

基于当前分支新建分支并切换到新建的分支
git checkout -b 分支名

一般本地新建的分支不在远端上，需要推送到远端

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



## cherry-pick

https://git-scm.com/docs/git-cherry-pick

```
git cherry-pick commit_id
```

这样就只会把这一个 commit_id 的内容变成当前分支的一个commit





## 疑问

冲突到底是怎么产生的？解决冲突时应该注意什么？

revert 使用？
