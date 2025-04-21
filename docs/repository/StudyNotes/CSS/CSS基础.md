css由李爵士的挪威同事赖先生提出，css指的是层叠样式表(Cascading Style Sheets)

层叠具体：

* 样式层叠 可以多次对同一选择器进行样式声明
* 选择器层叠 可以用不同的选择器对同一个元素进行样式声明
* 文件层叠 可以用多个文件进行层叠

由于css有很多特性，可以通过[caniuse.com](https://caniuse.com/)网站得知是否兼容浏览器

css的标准制定者为W3C，查看[css 2.1标准](http://www.ayqy.net/doc/css2-1/cover.html)

### 语法

```
// 语法一：样式语法
选择器{
  属性名：属性值；
  /*注释*/
}
// 语法二：at语法
@charset "UTF-8"; //设置字符集
@import url(2.css)
@media (min-width:100px) and (max-width:200px){ //媒体查询
	语法一
}
```
### 写法

**内联式css**，把css代码直接写在html标签内

```
<p style= "color:red">content</p>
```
嵌入式css

```
<style type="text/css">
p{
  color:red;
}
</style>
```
外部式css，由外部导入

```
<link rel="stylesheet" href="style.css" type="text/css">
```
### 基本单位

#### 长度单位

* px是固定单位，其他几种都是相对单位。当我们把电脑屏幕的分辨率调为1440\*900时，css里设置的1px实际的物理尺寸就是屏幕宽度的1/1440。
* em：默认字体大小的倍数。比如给元素设置`font-size: 2em`，这里的默认字体大小实际上是继承自父亲的大小，`font-size: 2em`表示当前元素字体大小是父亲的2倍。当给元素设置`width: 2em`，这里的默认字体大小是该元素自身的实际字体大小。
* rem：根元素(html 节点)字体大小的倍数。比如一个元素设置`width: 2rem`表示该元素宽度为html节点的font-size大小的2倍。 如果html未设置font-size的大小，默认是16px。
* 1vw 代表浏览器视口宽度的1%。
* 1% 对不同属性有不同的含义。`font-size: 200%` 和`font-size: 2em` 一样，表示字体大小是默认（继承自父亲）字体大小的2倍。`line-height: 200%` 表示行高是自己字体大小的2倍。`width: 100%`表示自己content的宽度等于父亲content宽度的1倍。

需要注意的是chrome浏览器下文字最小是12px，设置低于12px的值最终也会展示12px

#### 颜色

十六进制 #FF6600 或者 #F60

RGBA 颜色 rgb(0,0,0) 或者 rgba(0,0,0,1) a为透明度(1透过,0全透过)

hsl 颜色 hsl(360,100%,100%) h 0~360 0正红 赤橙黄绿青蓝紫 360正红 s为鲜艳度(色相、亮度、饱和度) l为高亮度

### 调试CSS

使用开发者工作看警告或看编辑器。

Border调试法：给出问题的元素添加border,若没出现则选择器错或语法错，出现则看预期是否符合。

border是占像素的，`outline:1px solid red;`不占空间可将边框在外展示

### 文档流

文档流(Normal Flow)，由于元素分内联元素inline/块级元素block/内联块状元素inline-block

常用的块级元素：

```
<div>、<p>、<h1>-<h6>、<ol>、<ul>、<dl>、<table>、<address>、<blockquote> 、<form>
```
常用的内联元素：

```
<a>、<span>、<br>、<i>、<em>、<strong>、<label>、<q>、<var>、<cite>、<code>
```
常用的内联块级元素：

```
<img>、<input>
```
* 流动方向

inline元素从左到右，到达最右边才会换行(span 空间不够不会把自己截成两边,默认合并)

block元素从上到下，每一个都另起一行(div)

inline-block也是从左到右

* 宽度

inline 宽度为内部 inline 元素的和，不能用 width 指定

block 默认自动计算宽度，可用 width 指定(不可用width:100%)

inline-block 结合前两者特点，可用 width,自动压榨自己宽度

* 高度

inline 高度由 line-height 间接确定，跟 height 无关(字体！！！)

block 高度由内部文档流元素决定，可以设 height

inline-block 跟 block 类似，可以设置 height

### overflow溢出

即内容的宽度或高度大于容器的，会溢出

**解决方法**：可用 overflow 来设置是否显示滚动条

* auto 是灵活设置
* scroll 是永远显示(在内联元素中默认只在第一屏显示)
* hidden 是直接隐藏溢出部分
* visible 是直接显示溢出部分
* overflow 可以分为 overflow-x 和 overflow-y

### 脱离文档流

由于block高度是由内部文档流元素决定的，可以设height

可以通过`float`/`postion:absolute/fixed`脱离文档流

