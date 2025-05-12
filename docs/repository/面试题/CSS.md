# CSS

### BFC是什么

> 论述题：「是什么、怎么做、解决了什么问题、优点是、缺点是、怎么解决缺点」
>

**是什么**

将**BFC**翻译成中文「格式化上下文」即可，千万别解释。

**怎么做**

背诵 BFC 触发条件，虽然列举了所有触发条件，但只用背这几个就行了，详见[MDN](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)的这篇文章。

 • 浮动元素（元素的 `float` 不是 `none`）

 • 绝对定位元素（元素的 `position` 为 `absolute` 或 `fixed`）

 • 行内块 `inline-block` 元素 

• `overflow` 值不为 `visible` 的块元素 

• 弹性元素（`display` 为 `flex`或 `inline-flex` 元素的直接子元素）

**解决了什么问题**

1. 清除浮动（为什么不用 `.clearfix` 呢？）
2. 防止 `margin` 合并
3. 某些古老的布局方式会用到（已过时）

**优点**

🈚️

**缺点**

有副作用

**怎么解决缺点**

使用最新的 `display: flow-root` 来触发BFC就没有副作用了，但是很多人不知道。

[格式化上下文BFC](https://www.yuque.com/baizhe-kpbhu/gayz3l/lh1nop)

### 如何实现垂直居中

1. 绝对定位 + `top: 0; bottom: 0; left: 0; right: 0; margin: auto`
2. 绝对定位 + `top: 50%; left: 50%; transform: translate(-50%, -50%)`
3. flex布局 + `justify-content: center; align-items: center`
4. table布局 + `display: table-cell; vertical-align: middle`
5. grid布局 + `display: grid; place-items: center`
6. 伪元素
  ::: code-group 
  ```html [html]
  <div class="div">
    <div class="center"></div>
  </div>
  ```

  ```css [css]
   .div {
    width: 600px;
    height: 200px;
    background-color: #f5f5f5;
    text-align: center;
    border: 1px solid red;
  }
  .div .center {
    display: inline-block;
    background-color: red;
    width: 50px;
    height: 50px;
    vertical-align: middle;
  }
  .div::after {
    content: '';
    vertical-align: middle;
    height: 100%;
    display: inline-block;
    position: relative;
  }
  ```
  :::

7. grid布局 + `place-items: center`
  ```css
   .parent {
    /* 1. 元素设置为Grid 元素 */
    display: grid;
    /* 通过 items 属性实现*/
    /* align-items: center; */
    /* justify-items: center; */
    /* items 的缩写 */
    /* place-items: center; */

    /* 或者通过 content 属性 */
    /* align-content: center; */
    /* justify-content: center; */
    /* content 的缩写 */
    /* place-content: center; */
    }
    .child {
      /* 或者通过 margin auto 实现 */
      /* margin: auto; */
      /* 或者通过 self 属性 */
      /* align-self: center;
      justify-self: center; */
      /* self 的缩写 */
      place-self: center;
    }
  ```
8. 行内块元素水平垂直居中
  ```css
  .parent {
    /* 1. 设置行高等于容器高度 */
    line-height: 500px;
    /* 通过 text-align: center; 实现水平居中 */
    text-align: center;
  }
  .child {
    /* 将子级元素设置为水平块级元素 */
    display: inline-block;
    /* 通过 vertical-align: middle; 实现垂直居中 */
    vertical-align: middle;
  }

  ```

[七种方式实现垂直居中](https://www.yuque.com/u202856/gbe1wh/dq4yge?)

### css选择器优先级如何确定
1. 选择器**越具体**，其**优先级越高**。
2. 相同优先级，出现在后面的，覆盖前面的。
3. 属性后面加 `!important` 的**优先级最高**，但是要少用。


**权重记忆口诀**：从0开始，一个**行内样式** `+1000`，一个**id选择器** `+100`，一个**属性选择器**(`a[title]` 属性有`title` 的 `a` 标签)、**class**或**伪类**(`a:hover`)为 `+10`，一个**元素选择器**(`div`)或者**伪元素**(`::before`)为 `+1`，通配符为`+0(*)`,`!important`优先级最高。

`!important` > **行内样式** > **内联样式and外联样式**

建议写博客总结，面试甩链接。

这里有 CSS 2.1 规格文档的权威算法：（但并不适用于 CSS 3）

[属性赋值，层叠（Cascading）和继承](http://www.ayqy.net/doc/css2-1/cascade.html#specificity)

[CSS选择器优先级](https://www.yuque.com/baizhe-kpbhu/gayz3l/iv0azd)

### 如何清除浮动
实践题，建议写博客，甩[链接](https://www.yuque.com/baizhe-kpbhu/gayz3l/xgw7c6)。

方法一: 给父元素加上 `.clearfix`

```css
.clearfix::after {
  content: '';
  display: block; /* 或者 table */
  clear: both;
}
.clearfix {
  zoom: 1; /* IE 兼容 */
}
```

方法二: 给父元素加上 `overflow: hidden`

[CSS-clearfix消除浮动](https://www.yuque.com/baizhe-kpbhu/gayz3l/xgw7c6)

### 两种盒模型（box-sizing）的区别
答题思路为：先说一，再说二，再说相同点，最后说不同点。

第一种盒模型是 `content-box`，即 `width` 指定的是 `content` 区域宽度，而不是实际宽度。

> 实际宽度 = **width + padding + border**
>

第二种盒模型是 `border-box`，即 `width` 指定的是左右边框外侧的距离。

>  实际宽度 = **width**
>

相同点是都是用来指定宽度的，不同是 `border-box` 更好用。

