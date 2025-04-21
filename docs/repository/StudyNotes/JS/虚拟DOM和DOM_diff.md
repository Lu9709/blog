## 虚拟 DOM 是什么

虚拟DOM就是一个能代表DOM树的对象，通常里面含有标签名、标签属性、事件监听和子元素们。虚拟DOM相当于是真实DOM的映射。

### 虚拟DOM的实例

虚拟DOM在不同的框架，有不一样的形式。

**Vue虚拟DOM:**

```
const vNode = {
  tag:'div',
  data: {
    on:{
      click:()=>{}
    },
    class: 'main'
  },
  children:[
    {tag:'span' ...},
    {tag:'span' ...},
  ],
  ...
}
```

**React虚拟DOM:**

```
const vNode = {
  key: null,
  type:'div',
  ref: null,
  props: {
    children:[
      {type:'span' ...},
      {type:'span' ...},
    ],
    onClick:()=>{},
    className: 'main'
  }
  ...
}
```

### 创建虚拟DOM

* Vue 内置函数：`h(tag,data,children)` 是将Vue template文件通过vue-loader转为h形式。
* React 内置函数：`React.createElement(type,[props],[...children])`,是将JSX通过babel转为createElement的形式。

## 虚拟 DOM 的优点

#### 1. 能够减少不必要的DOM操作

* 减少DOM操作次数
虚拟DOM可以将多次操作合并为一次操作，比如要用JS添加1000个节点，则是要一个个添加的，但是用Vue/React可以一次性全部放在页面上。
* 减少DOM操作范围
虚拟DOM借助DOM diff可以把多余的操作省掉，比如你添加1000个节点，但实际只有10个新增的。根据比对减少了DOM操作的范围。

#### 2. 跨平台渲染

虚拟DOM的本质就是一个JavaScript对象，并不依赖真实环境，它不仅可以变成DOM，还可以变成小程序、iOS 应用、安卓应用。

## 虚拟 DOM 的缺点

需要额外的创建函数，如React用的是createElements用JSX来简化XML写法,Vue用的是h用Vue-loader来进行。两者都比较依赖打包工具。

## DOM diff 是什么

DOM diff就是虚拟DOM的对比算法，DOM diff应该是在作比较时分了三个层级：

#### 1.  tree diff(层级比较)

将两个新旧树逐层对比，找出那些节点需要跟新。

如果节点是组件就看Component diff，若是标签就看Element diff。

#### 2. Component diff(组件比较)

则先看组件类型，类型不同直接替换，类型相同则更新属性，然后在深入组件递归。

#### 3. Element diff(元素比较)

则先看标签名，标签名不同直接替换，相同则更新属性，然后也深入组件递归。

而Vue和React的diff算法思维上是类似的，但在源码实现上有区别：

* Vue基于snabbdom库，它有较好的速度以及模块机制。Vue Diff使用双向指针，边对比，边更新DOM。
* React主要使用diff队列保存需要更新哪些DOM，得到patch树，再统一操作批量更新DOM。

## DOM diff 的优点

通过DOM diff的算法可以有效的减少DOM操作，但如果是超批量的节点变更，还是用原生DOM来的比较快(Vue比较接近原生DOM，React则性能较差)。

## DOM diff 的问题（key）

DOM diff在同层级对比中有bug。
举个例子来说,如A、B、C为同一层的一组节点，要进行如下操作。

|  |  |  |  |
| --- | --- | --- | --- |
| 原来的节点 | A | B | C |
| 转换后的节点 | C | B | A |

在我们的理解里这不就是A、C互换了个位置，但在计算机的角度认为是，原来的A节点和C节点不同，就创建C节点并删除A节点，同理原来的C节点也是，创建了A节点删除了C节点，B节点没有变化则不变。但我们只是想调整节点的位置，而不是进行删除操作。

我们可以给节点设定唯一的key，因为同一层级的一组节点可以通过唯一的id进行区分，从而消除bug。key只能是number和string类型，**一定不要用index作为key值。** 因为index作为key删除时，index是会变动的，index永远都是连续的。

**没有id的解决方案**

* 创建id()函数，调用后自增
* 使用guid库或uuid库
* 使用数据库的id
