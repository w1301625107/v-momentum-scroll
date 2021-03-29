# v-momentum-scroll

用于需要模拟惯性的地方。基于[前端也要懂物理 —— 惯性滚动篇 ](https://my.oschina.net/o2team/blog/4307027)改造。


## [example here](https://w1301625107.github.io/v-momentum-scroll/demo/index.html)

## Install 
### npm 安装

```bash
npm i v-momentum-scroll --save
```

Include plugin in your `main.js` file.

```js
import Vue from 'vue'

import MomentumScroll from 'v-momentum-scroll';

Vue.use(MomentumScroll);
```

### 使用链接引入
```html
<script src="https://unpkg.com/v-momentum-scroll/dist/v-momentum-scroll.umd.js"></script>
```

```html
<body>
  <div id="app">
    <!-- 需要明确的宽度和高度，同时position值不能为static  -->
    <!-- 默认为position值relative,宽高各100px,不然会导致异常显示  -->
    <v-momentum-scroll style="width:200px;height:200px">
      <ul class="list"
            ref="scroller">
          <li class="list-item"
              v-for="(item,index) in list"
              :key="index">
            {{item}}
          </li>
        </ul>
    </v-momentum-scroll>
  </div>
</body>
  <!-- 先引入vue -->
  <script src="https://unpkg.com/vue/dist/vue.js"></script>
  <!-- v-momentum-scroll.js -->
  <script src="./v-momentum-scroll.umd.js"></script>
  <script>
    new Vue({
      el: '#app',
      computed: {
        list() {
          const list = [];
          for (let i = 1; i <= 50; i++) {
            list.push(i);
          }
          return list;
        },
      },
    })
  </script>
</html>
```
## usage

```html
<template>
  <v-momentum-scroll class="wrapper">
    <!-- 需要滚动的东西 -->
  </v-momentum-scroll>
</template>
```

```css
// 需要明确的宽度和高度，同时position值不能为static
// 默认为position值relative,宽高各100px,不然会导致异常显示
.wrapper {
  height: 60% !important;
  width: 60% !important;
}
```

## props

|      param      | required |  type   |  default  | describe                                                       |
| :-------------: | :------: | :-----: | :-------: | :------------------------------------------------------------- |
|    hitBorder   |    ❌      | function  |         |     滚动到边界时触发的函数，Function({direction:'bottom'\|'top',type:'noBounce'\|'weekBounce'\|'strongBounce',offsetY:number(滚动的高度)}),当范围值为 HTMLElement 时会滚动到相应位置   | 



## methods
通过使用vue的ref来调用组件内部的方法。

| method | args | describle|
| :---  |:-----:|:---------|
| bounceTo|el:HTMLElement,callback:Function | 变速滚动到指定元素|
| scrollTo | el:HTMLElement,speed:number,callback:Function | 匀速滚动到指定元素|
| getOffsetTop | el:HTMLElement | 获取元素在v-momentum-scroll中的offsetTop|


## changelog
1.0.1
- 修复无法滚动到0的问题

1.0.0
- init
