# Shadow DOM
> Shadow DOM 为封装而生，即可以让一个组件可以拥有自己的DOM树，这个DOM树不能在主文档中被任意访问，可能拥有局部样式规则，还有其他特性。

#### 使用方法

可以使用 [Element.attachShadow()](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/attachShadow) 方法来将一个`shadow root`附加到任何一个元素上。它接受一个配置对象作为参数，该对象有一个`mode`属性，值可以是`open`或者`closed`

* `open` shadow root 元素可以从 js 外部访问根节点

  ```js
  element.shadowRoot; // 返回一个 ShadowRoot 对象
  ```
* `closed` 拒绝从 js 外部访问关闭的 shadow root 节点
  
  ```js
  element.shadowRoot; // null
  ```
#### 代码案例

```html
<style>
  p {
    color: red;
  }
</style>
<body>
  <div id="shadow"></div>
</body>
<script>
  shadow.attachShadow({ mode: 'open' })
  shadow.shadowRoot.innerHTML = `
  <style> p { font-weight: bold; } </style>
      <p>Hello, John!</p>
  `
  alert(document.querySelectorAll('p').length);
  // 0 可以看到整个body内部无法发现p标签
  alert(shadow.shadowRoot.querySelectorAll('p').length);
  // 1 由于设置了 mode 为 open 所以可以访问 id 为 shadow 的标签内部的内容
</script>
```
#### 应用场景

* 后端后返回html需要展示，使其不污染全局的样式，这种情况也可以使用`iframe`

#### 参考链接

> [shadow dom - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components/Using_shadow_DOM)
> 
> [影子DOM（shadow DOM） - javascript.info](https://zh.javascript.info/shadow-dom)