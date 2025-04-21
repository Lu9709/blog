# 设计模式

* 不用new构造函数
* 重载,$(支持多种参数)
* 闭包隐藏细节
* getter/setter
* 别名($.fn是 $.prototype的别名)
* 适配器模式

# 如何获取元素

jQuery的基本设计思想和主要用法，就是"选择某个网页元素，然后对其进行某种操作"。

将选择表达式放入构造函数`jQuery()`，它的简写为`$()`，然而它不返回这些元素，而是返回一个对象，称为jQuery构造出来的对象。
这个对象可以操作对应的元素。
表达式可以为CSS选择器

```
$(document) //选择整个文档对象
$('#name') //选择id为name的网页元素
$('div.my')//选择class为my的div元素
$('input[name=first]') // 选择name属性等于first的input元素
```

jQuery特有的表达式

```
$('a:first') //选择网页中第一个a元素
$('ul>li') //选择ul里的li元素
$('tr:odd') //选择表格的奇数行
$('div:animated') // 选择当前处于动画状态的div元素
```
# 如何查找元素

通过获取的结果集进行筛选，选择符合条件的结果

```
$('#xxx').find('.red') //查找#xxx里class为red的元素
$('#xxx').parent() //获取#xxx的爸爸
$('#xxx').children() //获取#xxx的儿子
$('#xxx').siblings() //获取#xxx的兄弟
$('#xxx').index() //获取#xxx在兄弟之间排行老几(从0开始)
$('#xxx').next() //获取弟弟
$('#xxx').pre() //获取哥哥
$('.red').each(fn) //遍历并对每个元素执行fn
```
# 链式操作是怎样的

原理：关键就在于对象里的方法有：`return this`。这就是说调用了方法之后把对象给返回了回来，这样可以继续调用这个对象了。

```
window.jQuery = function (selector){
  const elements = document.querySelectorAll(selector);
  return {
    addClass(className){
      for (let i = 0; i < elements.length; i++) {
        elements[i].classList.add(className);
      }
      return this;
    }
  }
}
// jQuery(".test")
//   .addClass("blue")
//   .addClass("red")
```

在选中网页中的元素后，可以对它进行一些操作，并且让所有操作可以连接在一起，以链条的形式写出来，如下所示。

```
$('div').find('ul').eq(2).html('helloworld').end()
```

拆解开来如下所示:

```
$('div')
  .find('h1') //找到h1元素
  .eq(2) //找到其中第三个hl元素
  .html('HelloWorld') //将它的内容改成HelloWorld
  .end() //退回到选中所有的h1元素那一步
```
# 如何创建元素

只需要将新元素直接传入jQuery的构造函数就可以了。因为利用了函数的重载，可以接受不同的参数，可以鉴别是选择器还是标签。

```
$('<p>Hello</p>');
$('<li class="new">new list item</li>');
$('<div><span>1</span></div>').appendTo(document.body)
//创建div然后插入到body里
$('body').append(div或$div)
//添加小儿子(末尾添加)
$('body').prepend(div或$div)
//添加大儿子(开头添加)
$('body').after(div或$div)
//添加弟弟
$('body').before(div或$div)
添加哥哥
```
# 如何删除元素

删除元素使用`.remove()`和`.detach()`。两者的区别在于，前者不保留被删除元素的事件，后者保留，有利于重新插入文档时使用。

清空元素内容（但是不删除该元素）使用`.empty()`。

# 如何移动元素

有两种方法可以操作元素在网页中的位置移动。这两种方法操作视角不同，返回的元素不一样

* 直接移动该元素

```
$('div').insertAfter($('p'));//把div元素移动p元素后面
```

* 移动其他元素,使目标元素达到想要的位置

```
$('p').after($('div'));//把p元素加到div元素前面
```

这样的操作方法，总共有四对。

* `.insertAfter()`和`.after()`：在现存元素的外部，从后面插入元素
* `.insertBefore()`和`.before()`：在现存元素的外部，从前面插入元素
* `.appendTo()`和`.append()`：在现存元素的内部，从后面插入元素
* `.prependTo()`和`.prepend()`：在现存元素的内部，从前面插入元素

# 如何修改元素的属性

可以使用同一个函数，来完成取值和赋值达到修改元素。

```
$('div').text() //读写文本内容
$('div').HTML() //读写HTML内容
$('div').attr('title',?) //读写属性
$('div').style({color:'red'}) // 读写style
$('div').addClass('red') // 添加类名/removeClass/hasClass
$('div').on('click',fn) //鼠标点击触发
$('div').off('click',fn) //鼠标点击后移除
```
