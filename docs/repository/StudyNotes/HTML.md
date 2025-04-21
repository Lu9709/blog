### HTML的起源

1990年左右，HTML是由Tim Berners-Lee创立之一种标记式语言。2004年，英女皇为他颁发大英帝国爵级司令勋章。2017年，被颁发图灵奖。可称它为李爵士。

他自己写了第一个浏览器、第一个服务器、并用自己的浏览器访问了自己写的服务器。发明了WWW，同时发明了HTML、HTTP、URL。

### HTML起手应该写什么

```html
<!DOCTYPE html>
<!--文档类型-->
<html lang="zh-CN">
  <!--html标签，lang最开始为en，改为中文-->
  <head>
    <meta charset="UTF-8">
    <!--文件字符编码-->
    <!--meta viewport 用于适配移动端设备-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <!--禁用缩放，兼容手机，宽度跟设备宽度一样，默认的缩放比例是1倍，最小缩放比例等于1，最大缩放比例等于1，用户不准缩放-->
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <!--告诉IE使用最新内核-->
    <title>Document</title>
    <!--标题-->
  </head>
  <body>
  </body>
</html>
```
### HTML语义化

语义化的含义就是用正确的标签做正确的事情，让页面的内容结构化，便于对浏览器、搜索引擎解析；在没有样式CCS情况下也以一种文档格式显示，并且是容易阅读的。搜索引擎的爬虫依赖于标记来确定上下文和各个关键字的权重，利于 SEO。使阅读源代码的人对网站更容易将网站分块，便于阅读维护理解。

### 常用表章节标签

```html
<h1>标题1</h1>
<h2>标题2</h2>
<h3>标题3</h3>
<h4>标题4</h4>
<h5>标题5</h5>
<h6>标题6</h6>
.........
<!-- 章节 -->
<section>章节</section>
<!--文章-->
<article>文章</article>
<!--段落-->
<p>段落</p>
<nav>导航栏</nav>
<!--顶部内容，一般用于广告-->
<header>这是广告位</header>
<footer>底部内容</footer>
<!--主要内容标签-->
<main>主要内容</main>
<!--旁支内容-->
<aside>旁支内容</aside>
<!--区域划分-->
<div>区域划分</div>
<!--可附标题内容元素-->
<figure>
  <img src="/media/cc0-images/elephant-660-480.jpg"
    alt="Elephant at sunset">
  <figcaption>An elephant at sunset</figcaption>//说明
</figure>

```
### 全局属性

所有标签都有的属性

1. class定义类名`<div class="name"></div>`
2. `contenteditable` 让用户可以直接编辑内容
3. hidden 隐藏标签
4. id 加上 id 以后可以调 css,加上 id 以后可以用 js
不到万不得已不要用id，用class。因为window里有很多已经定义好的全局属性，不可以和这些属性同名。
5. style 设置内联样式

对于style的优先级：JS>HTML的style标签>CSS

6. tabindex
正数,如tabindex=1/2/3,表示按顺序访问
tabindex=-1 表示不能通过tab访问
tabindex=0 表示最后访问
7. title
用来显示完整内容
应用场景：文字超长变省略号
单行文字溢出：
调整 css
+ `white-space: nowrap;` 不要换行
+ `text-overflow: ellipsis` 溢出的部分用...代替
+ `overflow: hidden;` 溢出的部分隐藏
我若希望鼠标移动到省略地方时，通过title="完整内容"，即可浮动显示内容

### 常用内容标签

* ol+li(ordered list + list item) 有序列表
* ul+li(unordered list + list item)无序列表
* dl+dt+dd dl自定义列表 dt定义列表术语 + dd 定义列表内容
* `<pre></pre>` (preview的缩写) 保留空格、回车键
* `<hr/>` 水平分隔线
* `<br/>` 换行符
* `<a href=""></a>` 超链接
* `<em>` 和 `<strong>` 表示强调
+ `<em>`表示语气上的强调
+ `<strong>` 表示内容本身很重要
* code 用于表示计算机源码
* quote 行内引用
* blockquote 块级引用

### CSS reset

由于css有默认的样式,但它不符合我们的需求。

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
*::before,
*::after {
  box-sizing: border-box;
}
a {
  color: inherit;
  text-decoration: none; //文本修饰
}
input,
button {
  font-family: inherit; //字体名
}
ol,
ul {
  list-style: none;
}
table {
  border-collapse: collapse; //表格边框合并 分离separate
  border-spacing: 0; //相邻单元格边框之间的距离
}
```
### a 标签的用法

#### 属性

* href的取值
1. 网址：
`<https://www.baidu.com>`
`<http://www.baidu.com>`
`<//www.baidu.com>` 推荐使用这一种写法，浏览器会自动补全。
2. 路径:
绝对路径：`/a/b/c`, （这里的根目录指的是http服务的根目录）
相对路径：`index.html`和`./index.html`
3. 伪协议:
javascript:代码;  （需要写冒号和分号）
应用场景：希望点击a标签之后页面不刷新也不返回到顶部，什么也不做。
mailto:邮箱,tel:手机号

```html
<a href="javascript:0;">链接文本</a>
<!-- 这就相当于执行一段没有意义的js代码 -->
<a href="mailto:123@qq.com">发送邮件</a>
<a href="tel:123456789">拨打电话</a>
```
4. id: href=#id名，可以跳转到id名为Id的标签(锚点链接)

```html
<p id="xxx"></p>
<a href="#xxx">跳到指定位置</a>
```

* target的取值
1. `\_blank` (浏览器内打开一个新窗口)
2. `\_top`（在顶级窗口打开）
3. `\_parent`（在当前链接的上一级）
4. `\_self` （在本窗口打开）默认值
* download
作用：不是打开页面，而是下载页面，href需设置好下载地址
问题：不是所有的浏览器都支持，尤其是手机浏览器可能不支持

#### 作用

* 跳转外部页面
* 跳转内部锚点
* 跳转到邮箱或电话等

### img 标签的用法

#### 作用

发出get请求，展示一张图片

#### 属性

src: 图片网络地址或者本地相对绝对地址
alt: 如果图裂了，无法加载，会显示这个alt属性的文字作为备用
width：如果只写宽度，高度会自适应
height：如果只写高度，宽度会自适应
一个合格的前端不能让图变形！所以就只写宽度或者高度！

#### 事件

onload 加载成功onerror 加载失败（可以在加载失败的时候替换一张图片提升用户体验）

```html
<img id="xxx" src="图片地址" alt="提示" width="800px" />
<script>
  xxx.onload = function () {
    console.log("图片加载成功");
  };
  xxx.onerror = function () {
    console.log("图片加载失败");
    xxx.src="另一张图片地址"
  };
</script>
```
#### 响应式

`max—width:100%`图片可以适应不同设备的屏幕大小

#### [可替换元素](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Replaced_element)

### table 标签的用法

#### 相关的标签

* `caption`表格标题
* `thead` (表格的头部)
* `tbody` (表格的主体)
* `tfoot` (表格的脚注)
* `tr` (table row 行)
* `td` (table data 数据)
* `th` (table head 表头)

```html
<table>
  <caption>表格标题：花名册</caption>
  <thead>
    <tr>
      <th>姓名</th>
      <th>性别</th>
      <th>年龄</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>拍岸</td>
      <td>男</td>
      <td>18</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td>hello</td>
      <td>hello</td>
      <td>hello</td>
    </tr>
  </tfoot>
</table>
```

#### 相关的样式

* table-layout 定义布局的表格单元格
参数：auto(自动,根据内容来计算宽度) fixed(定宽,宽度平均)
* border-collapse 为表格设置合并边框
* border-spacing 设置相邻单元格的边框间的距离

### form标签的用法

#### 作用

发get或post请求，然后刷新页面

#### 属性

* action 处理表单提交的URL
* autocomplete 自动填充
* method 提交表单的方式

post(表单数据包含表单体发送给服务器)

get(表单数据附加在action属性的URL内,以?为分隔符发送)

dialog(表单在`<dialog>`内提交时关闭对话框)

* target 和a标签的属性类似

#### 事件

表单触发提交必须要有`<input type="submit" value="提交" />`或`<button type="submit">提交</button>`

```html
<form action="/xxx" method="get">
	<label for="name">Enter your name: </label>
  <input type="text" name="name" id="name" >
  <input type="submit" value="提交">
  <button type="submit"><strong>提交</strong></button>
</form>
```
### input标签的用法

#### 作用

让用户输入内容,一般用于表单form内。

#### 属性

* 类型 type

```html
文本框：<input type="text" /> 定义供文本输入的单行输入字段。
<input type="text" name="控件名字" value="值" maxlength="最大输入字符长度" size="控件宽度" readonly="readonly"（只读） />

密码框：<input type="password" /> 定义密码字段。
<input type="password" name="控件名字" value="值" maxlength="最大输入字符长度" size="控件宽度" readonly="readonly"（只读） />

多选勾选控件：<input type="checkbox" /> 定义复选框
<input type="checkbox" name="控件名字" value="值" checked="checked"(已选中) disabled = "disabled"(禁用控件) />

单选勾选控件：<input type="radio" /> 定义单选按钮。
<input type="radio" name="控件名字" value="值" checked="checked"(已选中) disabled = "disabled"(禁用控件) />

提交表单按钮：<input type="submit" /> 定义提交表单数据至表单处理程序的按钮。
<input type="submit" value="按钮字样" />

重置表单按钮：
<input type="reset" value="按钮字样" />

上传文件按钮：
<input type="file" name="文件名称" />

隐藏域:
<input type="hidden" name="控件名字" value="值" />

按钮：<input type="button" /> 定义按钮。
     <input type="button" onclick="alert('Hello World!')" value="Click Me!" />

email：<input type="email" /> 用于应该包含电子邮件地址的输入字段。
<input type="email" name="email" />

搜索：<input type="search" /> 用于搜索字段（搜索字段的表现类似常规文本字段）。
<input type="search" name="googlesearch" />

电话：<input type="tel" /> 用于应该包含电话号码的输入字段。
<input type="tel" name="usrtel" />

链接输入：<input type="url" /> 用于应该包含 URL 地址的输入字段。
<input type="url" name="homepage" />

```
* 其他

name/autofocus/checked/disabled/maxlength/pattern/value/placeholder

#### 事件

onchange/onfocus/onblur

#### 验证器

```html
<input type='text' required/> //必须填写
```
#### 其他输入标签

* select + option

```html
<select name="pets" id="pet-select">
  <option value="">--Please choose an option--</option>
  <option value="dog">Dog</option>
  <option value="cat">Cat</option>
  <option value="hamster">Hamster</option>
  <option value="parrot">Parrot</option>
  <option value="spider">Spider</option>
  <option value="goldfish">Goldfish</option>
</select>
```
* textarea

```html
多行文本控件：
<textarea name="控件名称" cols="设置长度" rows="设置宽度" resize='none'>
  //resize:none不可以拖动
  文本内容
</textarea>
```
* label

```html
//表示用户界面中某个元素的说明 input标签必须给id属性 和label的for属性一致
<label for="cheese">Do you like cheese?</label>
<input type="checkbox" name="cheese" id="cheese">
```
#### 注意事项

* 一般不监听input的click事件
* form里面的input要有name
* form里面要放一个type=sumbit才能触发sumbit事件

### 其他标签

#### [video](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video)

用于在HTML或者XHTML文档中嵌入媒体播放器，用于支持文档内的视频播放。<source>提供视频源

```html
<video controls width="250">
  <source src="/media/cc0-videos/flower.webm"
    type="video/webm">
  <source src="/media/cc0-videos/flower.mp4"
    type="video/mp4" autoplay> //autoplay 自动播放
  Sorry, your browser doesn't support embedded videos.
</video>
```
#### [audio](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/audio)

用于在文档中嵌入音频内容，可以包含多个音频资源

```html
<figure>
  <figcaption>Listen to the T-Rex:</figcaption>
  <audio controls
    src="/media/cc0-audio/t-rex-roar.mp3">
    Your browser does not support the
    <code>audio</code> element.
  </audio> //controls 可控制播放
</figure>
```
#### [canvas](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/canvas)

可通过JS绘制图形或动画

```html
//html
<html>
  <canvas id="canvas" width="300" height="300">
  抱歉，您的浏览器不支持canvas元素
  （这些内容将会在不支持<canvas>元素的浏览器或是禁用了JavaScript的浏览器内渲染并展现）
  </canvas>
</html>
//js
<script>
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = 'green';
  ctx.fillRect(10, 10, 100, 100);
</script>
```
#### [svg](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/svg)

内嵌一个独立片段(拥有独立的视口和坐标系统)

```html
<svg xmlns="http://www.w3.org/2000/svg"
  width="150" height="100" viewBox="0 0 3 2">
  	<rect width="1" height="2" x="0" fill="#008d46" />
    <rect width="1" height="2" x="1" fill="#ffffff" />
    <rect width="1" height="2" x="2" fill="#d2232c" />
</svg>
```
[参考来自](https://www.jianshu.com/p/72a590b29cbc)和MDN

