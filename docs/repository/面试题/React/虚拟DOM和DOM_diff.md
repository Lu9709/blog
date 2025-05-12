### 虚拟DOM的原理是什么？
#### 是什么
虚拟DOM就是虚拟节点。React用JS对象来**模拟**DOM节点，然后将其渲染成真实的DOM节点。

#### 怎么做
**第一步是模拟**，用JSX语法写出来的div其实是一个虚拟节点：

```html
<div id="x">
  <span class="red">hi</span>
</div>
```

这代码会得到这样一个对象：

```json
{
  tag: 'div',
  props: {
    id: 'x'
  },
  children: [
    {
      tag: 'span',
      props: {
        className: 'red'
      },
      children: [
        'hi'
  		]
		}
  ]
}
```

能够做到这一点是因为JSX语法会被转译为`createElement`函数调用（也叫h函数），如下：

```javascript
React.createElement("div", { id: "x" },
	React.createElement("span", { class: "red" }, "hi")
)
```

**第二步是将虚拟节点渲染为真实节点**

```javascript
function render(vdom) {
  // 如果是字符串或者数字，创建一个文本节点
  if (typeof vdom === "string" | typeof vdom === "number") {
    return document.createTextNode(vdom)
  }
  const { tag, props, children } = vdom
  // 创建真实DOM
  const element = document.createElement(tag)
  // 设置属性
  setProps(element, props)
  // 遍历子节点，并获取创建真实DOM，插入到当前节点
  children
    .map(render)
    .forEach(element.appendChild.bind(element))
  vdom.dom = element
  // 返回 DOM 节点
	return element
  function setProps // 略
  function setProp // 略
}
```

> 注意，如果**节点**发生**变化**，并不会直接把新虚拟节点渲染到真实节点，而是先经过**diff算法**得到一个**patch**再**更新**到真实节点上。
>

#### 解决了什么问题
1. DOM操作性能问题。通过虚拟DOM和diff算法减少不必要的DOM操作，保证性能不太差。
2. DOM操作不方便问题。以前各种DOM API要记，现在只有`setState`。

#### 优点
1. 为React带来了跨平台能力，因为虚拟节点除了渲染为真实节点，还可以渲染其他东西。
2. 让DOM操作的整体性能更好，能（通过diff）减少不必要的DOM操作。

#### 缺点
1. 性能要求极高的地方，还是得用真实DOM操作（目前没遇到这种需求）
2. React为虚拟DOM创造了**合成事件**，跟原生DOM事件不太一样，工作中要额外注意：
    1. 所有React事件都绑定到根元素，自动实现事件委托
    2. 如果混用合成事件和原生DOM事件，有可能会出bug

#### 如何解决缺点
不用React，用Vue3

#### 总结
> 虚拟DOM就是虚拟节点，用JS对象模拟虚拟DOM，把其渲染成真实DOM节点，如果有事件发生修改了虚拟DOM的节点，则是通过diff算法比较两棵新旧虚拟DOM树的差异得到一个patch，然后再把patch更新到真实DOM树上。
>

### React DOM diff算法是怎么样的？
#### 是什么
DOM diff就是对比两棵虚拟DOM树的算法。当组件变化时，会render出一个新的虚拟DOM，diff算法对比新旧虚拟DOM之后，得到一个patch，然后React用patch来更新真实DOM。

#### 怎么做
首先，对比两棵树的**根节点**

1. 如果根节点的类型改变，比如`div`变成`p`，那么直接认为整棵树都变了，不再对比子节点。此时直接删除对应的真实的DOM树，创建新的真实的DOM树
2. 如果根节点的类型没变，就看看属性变了没有
    1. 如果没变，就保留对应的真实节点
    2. 如果变了，就只更新该节点的属性，不重新创建节点
        1. 更新style时，如果多个css属性只有一个改变了，那么React只更新改变的。

然后，同时遍历两棵树的**子节点**，每个节点的对比过程同上，不过存在如下两种情况。

1. 情况一

```html
<ul>
  <li>A</li>
  <li>B</li>
</ul>

<ul>
  <li>A</li>
  <li>B</li>
  <li>C</li>
</ul>
```

React依次对比A-A、B-B、空-C，发现C是新增的，最终会创建真实C节点插入页面。

2. 情况二

```html
<ul>
  <li>B</li>
  <li>C</li>
</ul>

<ul>
  <li>A</li>
  <li>B</li>
  <li>C</li>
</ul>
```

React对比B-A，会删除B文本创建A文本；对C-B，会删除C文本，创建B文本；（注意，并不是边对比边删除新建，而是把操作汇总到patch里再进行DOM操作）对比空-C，会新建C文本。

你会发现其实只需要创建A文本，保留B和C即可，为什么React做不到呢？

因为**React需要你加key才能走到：**

```html
<ul>
  <li key="b">B</li>
  <li key="c">C</li>
</ul>
<ul>
  <li key="a">A</li>
  <li key="b">B</li>
  <li key="c">C</li>
</ul>
```

React先对比key发现key只增加了一个，于是保留b和c，新建a。

以上是<font style="background-color:#FADB14;">React的diff算法</font>。

### Vue DOM diff算法是怎么样的？
假设有旧的Vnode数组和新的Vnode数组，而且有四个变量充当指针分别指到两个数组的头尾。

重复下面的对比过程，知道两个数组种任一数组的头指针超过尾指针，循环结束：

+ **头头对比**：对比两个数组的头部，如果找到，把新节点patch到旧节点，头指针后移
+ **尾尾对比**：对比两个数组的尾部，如果找到，把新节点patch到旧节点，尾指针前移
+ **旧尾新头对比**：交叉对比，旧尾新头，如果找到，把新节点patch到旧节点，旧尾指针前移，新头指针后移
+ **旧头新尾对比**：交叉对比，旧尾新头，如果找到，把新节点patch到旧节点，新尾指针前移，旧头指针后移
+ **利用Key对比**：用新指针对应节点的key去旧数组寻找对应的节点，这里分三种情况，当没有对应的key，那么创建新的节点，如果有key并且是相同的节点，把新节点patch到旧节点，如果有key但是不是相同的节点，则创建新节点。

若上述循环结束后，两个数组中可能存在未遍历完的情况：

+ 先对比旧数组的头尾指针，如果旧数组遍历完了（可能新数组没遍历完，有漏添加的问题），添加新数组中漏掉的节点。
+ 再对比新数组的头尾指针，如果新数组遍历完了（可能就数组没遍历完，有漏删除的问题），删除旧数组中漏掉的节点。

### React DOM diff和Vue DOM diff的区别
1. React是**从左向右遍历对比**，Vue是**双端交叉对比**。
2. React需要维护三个变量，Vue则需要维护四个变量。
3. Vue整体效率比React更高，举例说明：假设有N个子节点，我们只是把最后子节点移到第一个，那么
    1. React需要进行借助Map进行key搜索找到匹配项，然后复用节点
    2. Vue会发现移动，直接服用节点

### 参考文章
[Virtual DOM | Marvin](https://canyuegongzi.github.io/web/vue/2.html)

[Diff算法 | Marvin](https://canyuegongzi.github.io/web/vue/3.html)

