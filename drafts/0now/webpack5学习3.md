# Output Management



我们已经手动处理了引入的资源，但当你的应用变大并且使用hash文件和输出多个文件时，就很难手动维护 index.html 了，下面介绍用插件来维护。



HtmlWebpackPlugin 可以自动生成 html

`output.clean = true` 可以自动清除dist 目录无用的文件

Manifest 能知道 依赖图，使用 WebpackManifestPlugin 可以看详情

