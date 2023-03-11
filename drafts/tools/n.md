npm 的 n 包可以帮助 mac 管理 node 版本，还有nvm也是通用的操作



但使用过程中可能出现权限不足的问题，如：

```
cp: /usr/local/lib/node_modules/npm/npm/lib/explore.js: No such file or directory
cp: /usr/local/lib/node_modules/npm/npm/lib/fetch-package-metadata.md: No such file or directory
cp: /usr/local/lib/node_modules/npm/npm/lib/prune.js: No such file or directory
cp: /usr/local/lib/node_modules/npm/npm/lib/repo.js: No such file or directory
... 等等很多内容
```

那么你可以使用这个命令改变权限

```
sudo chown -R $(whoami) /usr/local/
```

[参考这里](https://github.com/tj/n/issues/416)