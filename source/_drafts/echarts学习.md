



[中文官网](https://echarts.apache.org/zh/index.html)

图标还有另一个，是antv，但antv没有echarts时间长，所以echarts更稳定些



![image-2022063064910822 PM](https://raw.githubusercontent.com/acmu/pictures/master/uPic/2022-06/30_18:49_EDTHFh.png)

点击可以看到一些图表的示例，很帅



入门代码

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>235</title>
</head>

<body>
    <script src="https://cdn.bootcdn.net/ajax/libs/echarts/5.3.3/echarts.common.js"></script>

    <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <div id="main" style="width: 100%;height:400px;"></div>
    <script type="text/javascript">
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: 'ECharts 入门示例345'
            },
            tooltip: {},
            legend: {
                data: ['销量']
            },
            xAxis: {
                data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
            },
            yAxis: {},
            series: [
                {
                    name: '销量',
                    type: 'bar',
                    data: [523, 20, 36, 10, 10, 20]
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    </script>
</body>

</html>
```





[术语速查手册](https://echarts.apache.org/zh/cheat-sheet.html) 用图的方式带你认识各个部分的名称

看完 快速上手，之后直接概念篇就行，当你的页面中有 Tabs 组件时要注意可能图表没了，因为dom被删除了（这要看你使用的 tabs 的实现方式了），正确做法是想要展示的时候调用 init，想要销毁的时候调用 dispose



## echarts 实现x轴分组

[Echarts 实现不等分双X轴](https://blog.csdn.net/z291493823/article/details/105053565)

[Echarts x轴分组与不规则刻度线](https://www.jianshu.com/p/aff239940c84)

这其实不太合理，一个简单的替代方案是通过 x 轴刻度线的名称换行实现，相同的内容看起来比较接近，但还是不能合并到一起



### 2个折线

```js
option = {
  legend: {
    data: ['班次一', '班次二']
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '班次一',
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    },
    {
      name: '班次二',
      data: [50, 30, 24, 18, 35, 0, 0],
      type: 'line'
    }
  ]
};

```

怎么带有legend？

[这个](https://echarts.apache.org/examples/zh/editor.html?c=line-stack)更丰富，带有 legend 和 tooltip



[柱状图初探](https://echarts.apache.org/examples/zh/editor.html?c=bar-simple&code=PYBwLglsB2AEC8sDeAoWszGAG0iAXMmuhgE4QDmFApqYQOQCGAHhAM70A0x6L7ACsAjQwtQqhIkwATxDUGbABaMAJsADu9HrAC-xHd3TMAgqzbjtMuQwDGjURWClpXbSvuNCAbXoBZGFyw9AAqAK7UgfQA6tQqkcGKoZEAYuSRAMr2GaHQ9AC6-oaw0qbsFpJW8kEAbozY4VroBsRstBDU5rBe2hKSsNCMALZV9AAsAHQATIDOPrCAHHqAlHaufRiyIwBGjKTLfdSDIMpsZUQr6ABmwDahnfSt5B2Nfc0rbGCMNgDWDIw7ku5v3gAjJMAAycWCgsGwQEAVihAA4oQB2KGAwGogDMIIKkmeJF6kgGwwYExmsEA7YqAedDfiRXu8vkEfkVJHsDowjp0CX0Llcbnd2hxtE1mSR_p4uhjRuCAGxI8EATihMOl4JRMrlsHh0ryIvQlQYm222jx6C56CJIyRU1mVJp6DpnwYuV1sFZh2OZpIPOuCjaDyFuhdYu8kvVCqVKtgatgsvBWp1Af1QUNj2FxAKOgA3EA)



## mtdv

给了很多默认值

columns、rows

做了很多事

series 可自定义













