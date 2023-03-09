---
title: Canvas
date: 2009-09-09 09:09:09
tags: 草稿
---

## Canvas 画的线条是模糊

因为如果这个像素点它占据了 0.5 的话，那不能渲染 0.5 的像素点，因为 1 个像素点已经是最小的单位了，所以 canvas 做的操作是把这个像素点的颜色变淡，颜色变淡之后，我们看的直观感觉就是模糊了 [参考](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors#a_linewidth_example)

## Canvas 高清屏模糊

[解决 canvas 在高清屏中绘制模糊的问题](https://cloud.tencent.com/developer/article/1501018)
