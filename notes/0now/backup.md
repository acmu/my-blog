### [从零打造一个 Web 地图引擎](https://juejin.cn/post/7054729902871805966)

#### 坐标系

国内地图都要使用火星坐标系（GCJ-02），它是由GPS坐标系（WGS-84）国际标准非线性加密而来（出于国内安全考虑）。

#### 经纬度

经纬度以度数表示，一般可直接以小数点表示，但亦可把度数的小数点分为角分（1角分等于六十分之一度）和角秒（一角秒等于六十分之一角分）

度分秒表示（度:分:秒）－49°30'00"-123d30m00s
度分表示（度:分）－49°30.0'-123d30.0m
度数表示－49.5000°-123.5000d（一般会有四位小数）

（这里能用浮点数表示了，那地图上展示的是这种吗？）

GPS等设备获取的都是地图坐标系，单位是度，方便在地图上定位，但不方便在平面上展示以及距离或位置等计算。

经纬度是通过角度来区分的，经度竖着的半圆，在本初子午线那里为 0，左边为西经，右边为东经，各延伸至 180 度，每 15 度一个时区，一个时区之间相差 1 小时，纬度是横着的整个圆，以赤道分为北纬和南纬，各延伸至 90 度，

所以正确的类似这样：41°24'12.2"N 2°10'26.5"E，那高德地图等是怎么转换成浮点数的呢？

小数度数 (DD)：41.40338，2.17403

度分秒 (DMS)：41°24'12.2"N 2°10'26.5"E 

度和十进制分 (DMM)：41 24.2028，2 10.4418



分 和 秒 转换为小数，其实就是 `分*1/60 + 秒*1/3600` [转换网址](http://www.minigps.net/fc.html)



那 116 和 41 这种又是怎么来的呢？



[经纬度](https://baike.baidu.com/item/%E7%BB%8F%E7%BA%AC%E5%BA%A6/1113442)

经度
经度分为360度，每15度1个时区，其中0度的叫本初子午线，是第一个进入新一天的地方，然后向西每过1个时区就相差1小时。例如是早上5点，那么向西一个时区就是早上4点，再过1个时区就是早上3点，依此类推，向东则相反，一直到本初子午线，也就是说本初子午线两侧刚好相差23个小时
从赤道向两级，纬度越来越高。赤道是划分南北两半球的分界线
经纬度1度=60分=3600秒，这个六十进制是古巴比伦人定制的，我们今天仍然在使用，只要关于角度和圆都是一样。
纬度
赤道的纬度为0°，将行星平分为南半球和北半球。
纬度是指某点与地球球心的连线和地球赤道面所成的线面角，其数值在0至90度之间。位于赤道以北的点的纬度叫北纬，记为N，位于赤道以南的点的纬度称南纬，记为S。
纬度数值在0至30度之间的地区称为低纬地区，纬度数值在30至60度之间的地区称为中纬地区，纬度数值在60至90度之间的地区称为高纬地区。
赤道、南回归线、北回归线、南极圈和北极圈是特殊的纬线。
纬度1秒的长度
地球的子午线总长度大约40008km。平均：
纬度1度 = 大约111km
纬度1分= 大约1.85km
纬度1秒= 大约30.8m



#### 瓦片

介绍瓦片规范，如谷歌XYZ规范：谷歌地图、高德地图、国家地理信息公共服务平台（天地图）等在使用，坐标原点在左上角，地图上展示的信息都是由瓦片构成的。

瓦片原理：把地球投影成一个巨大的正方形世界二维平面图，然后按照四叉树分层切割。层级的范围是[0.18]，在18层时就已经有`2^18 * 2^18`个瓦片了，可通过高德的瓦片api获取对应的图片，如：

```
https://webrd01.is.autonavi.com/appmaptile?x=109280&y=53979&z=17&lang=zh_cn&size=1&scale=1&style=8
```

这是一个定义了 x、y、z 瓦片，x、y代表坐标，z代表层级



#### 经纬度转web墨卡托

他们之间可以互换，网上有代码，如

```js
// 角度转弧度
const angleToRad = (angle) => {
    return angle * (Math.PI / 180)
}

// 弧度转角度
const radToAngle = (rad) => {
    return rad * (180 / Math.PI)
}

// 地球半径
const EARTH_RAD = 6378137

// WGS-84经纬度 转 Web墨卡托投影
const lngLat2Mercator = (lng, lat) => {
    // 经度先转弧度，然后因为 弧度 = 弧长 / 半径 ，得到弧长为 弧长 = 弧度 * 半径 
    let x = angleToRad(lng) * EARTH_RAD; 
    // 纬度先转弧度
    let rad = angleToRad(lat)
    let sin = Math.sin(rad)
    let y = EARTH_RAD / 2 * Math.log((1 + sin) / (1 - sin))
    return [x, y]
}

// Web墨卡托投影 转 WGS-84经纬度
const mercatorTolnglat = (x, y) => {
    let lng = radToAngle(x) / EARTH_RAD
    let lat = radToAngle((2 * Math.atan(Math.exp(y / EARTH_RAD)) - (Math.PI / 2)))
    return [lng, lat]
}
```



#### web墨卡托转瓦片坐标

选取一个高德地图的经纬度点，是火星坐标系的经纬度，把经纬度转换为Web墨卡托投影坐标，

为了简单，先直接把火星坐标当做WGS-84坐标，

Web墨卡托投影，编号为EPSG:3857，单位是米

Web墨卡托投影 再转换 瓦片坐标，这里涉及到分辨率的概念，需要知道一像素代表了多少米，一张瓦片的大小一般是256*256像素，我们知道地球的半径是 6378137米，那么可以算下地球的周长，我们又知道每一层需要多少个瓦片，也就能知道整张瓦片的大小



坐标点偏移，WGS-84 是中心点为原点，而Web墨卡托是以左上角为原点，所以需要进行偏移。



把经纬度坐标转换为Web墨卡托投影坐标







首先你要有瓦片，瓦片就是一块一块的地图图片，之后你要了解经纬度以及映射

经纬度还有两种标准

这两种可以互换，首先要做到根据经纬度和 zoom 层级显示正确的一个瓦片

之后作者又把 米 的定位和经纬度互换（这块有点没懂）

之后把当前页全部填满瓦片



#### 拖动与缩放

使用canvas动画库增加好看效果



**思考**

栅格地图和矢量地图

栅格地图：不能展示出 hover 的效果，地图皮肤的切换也十分费力

矢量地图：懒加载数据，前端自己渲染地图结果，自定义性高，可实现 hover、自定义皮肤等高级功能，滚轮 zoom 也更顺滑



[高德谷歌腾讯天地图地图瓦片 url](https://blog.csdn.net/sinat_41310868/article/details/105959659)

[查找坐标或按纬度和经度搜索](https://support.google.com/maps/answer/18539?hl=zh-Hans&co=GENIE.Platform%3DDesktop)







设计方法（UI设计师可以看看）：[如何设计网站配色方案](https://web360.org/website-color-schemes/)、[Designing Beautiful Shadows in CSS](https://www.joshwcomeau.com/css/designing-shadows/)。







[WebGL 教程 mdn](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial)

[入门 WebGL，看这一篇就够了](https://xie.infoq.cn/article/511aa64f69530ed3061829351)



对知识进行分类：核心、兴趣和盲区。

多学原理，即那些好多年都不变的东西，如果你只是学知识，而且变化快，很可能有颠覆性变化。



[7个高频正则](https://mp.weixin.qq.com/s/EMoXGCAJfMF1KbctRGXq0A)







模板

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zmy Doc</title>

  <style>

  </style>



</head>

<body>

  <p>123</p>

  <script>

  </script>

</body>

</html>
```





设计模式也挺重要的，这是一种思想
