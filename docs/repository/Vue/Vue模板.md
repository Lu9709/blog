# Vue模版
### 模板Template三种写法
**一、Vue完整版，写在HTML里**

```javascript
<div id="red">
  {{ n }}
  <button @click='add'>*2</button>
</div>
new Vue({
 el:'#xxx',
 data:{n:0}, //data可以改成函数
 methods:{add(){}}
})
```

**二、Vue完整版，写在template里**

```javascript
// div#app会被替换
<div id=app>
</div>

new Vue({
 data() {
    return {  n: 10  }
},
template: `
  <div id="red">
  {{ n }}
  <button @click='add'>*2</button>
  </div>
`,
methods: {
    add() { this.n *= 2 }
}
}).$mount('#app')
```

**三、Vue非完整版，配合'xxx.vue'文件**

```javascript
<template>
  <div id ="red">
    {{n}}
    <button @click = 'add'>-1</button>
  </div>
</template>
<script>
export default {
  data(){
    return {
      n:0
    }
  },
  methods:{
    add(){
      this.n -=1
    }
  }
}

</script>
<style scoped>
#red{
  background-color: red;
}
</style>

//在另外地方写
import xxx from './xxx.vue'
new Vue({
  render:h=>h
}).$mount('#app')
```

### 展示内容

+ 表达式
+ 
  ```javascript
  {{object.a}} //表达式

  {{n+1}} //可以写任何运算

  {{fn(n)}} //可以调用函数
  ```
  如果值为 `undefined` 或 `null` 就不显示

+ HTML内容

  `<div v-html='x'/>`(假设 `data.x` 值为`<strong>hi</strong>`)即可显示粗体的hi

  `<div v-pre>{{n}}</div>`, `v-pre`不会对模板进行编译

### [绑定属性](https://cn.vuejs.org/v2/api/#v-bind)
绑定属性可以使用`v-bing(:)`,可以动态绑定一个或多个attribute，或一个组件prop。绑定prop时，prop需要在子组件内声明。

```javascript
<img v-bing:src='imageSrc'>
// 简写
<img :src='imageSrc'>
// 绑定一个对象
<div :style="{border:'1px solid red',height:100}"></div>、、
//这里的100代表100px
```

### [绑定事件](https://cn.vuejs.org/v2/api/#v-on)
通过`v-on(@)`用于绑定事件的监听器。事件类型由参数指定，表达式可以是方法名或内联语句。也可使用修饰符例如`.stop`、`.prevent`、`.self`、`.native`、`.once`。

```javascript
<button v-on:click="add">+1</button> //点击之后Vue会运行add()
// 简写
<button @click="add">+1</button>
<button v-on:click="xxx(1)">xxx</button> //点击之后，Vue会运行xxx(1)
<button v-on:click="xxx(1)">xxx</button> //点击之后，Vue会运行 n+=1
```

### [条件判断](https://cn.vuejs.org/v2/api/#v-if)
`v-if`、`v-else-if`、`v-else`会根据表达式的值的真假来有条件的渲染元素。在切换时元素及数据绑定/组件被销毁并重建，若是为假会在DOM节点内删除改节点。

```javascript
<div v-if='x>0'>x大于0</div>
<div v-else-if="x===0">x为0</div>
<div v-else>x小于0</div>
```

### [循环](https://cn.vuejs.org/v2/api/#v-for)
`v-for`用于源数据多次渲染元素或模板。但需要设置key值。既可以使用in作为分隔符，也可以使用of。in遍历key，of遍历value。

```javascript
<ul>
  <li v-for:"(u,index) in users" :key="index">
    索引:{{index}}值:{{u.name}}
  </li>
</ul>

<ul>
  <li v-for:"(value,name) in users" :key="name">
  属性名:{{name}}值:{{value}}
  </li>
</ul>
```

### [隐藏](https://cn.vuejs.org/v2/api/#v-show)
`v-show`用于根据表达式真假来展示元素，它始终存在于DOM中，并保留着位置，只是设置了`display:none`

```javascript
<div v-show="n%2===0">  n是偶数</div>
//等价于
<div :style="{display:n%2===0?'block':'none'}"></div>
//table的display为table
//li的display为list-item
```

### 指令
指令就是以v-开头的东西，语法为v-指令名:参数=值，如`v-on:click=add`，如果值里没有特殊字符，则可以不加引号，但有些指令没有参数和值，如`v-pre`，有些指令没有值，如`v-on:click.prevent`

### 修饰符

有些指令支持修饰符

```javascript
@click.stop="add" //表示阻止事件传播/冒泡
@click.prevent="add" //表示阻止默认动作
@click.stop.prevent="add " //同时阻止
```

v-on支持

+ `.{keyCode | KeyAlias}` 只当事件从特定键触发回调
+ `.stop` 调用 `event.stopPropagation()`
+ `.prevent` 调用 `event.preventDefault()`
+ `.capture` 添加事件侦听器使用capture模式
+ `.self` 事件本身触发执行回调
+ `.once` 只触发一次回调
+ `.passive` passive模式添加监听
+ `.native` 监听根元素元素事件
+ 快捷键相关
    - `.ctrl`
    - `.alt`
    - `.shift`
    - `.meta`
    - `.exact`
+ 鼠标相关
    - `.left`
    - `.right`
    - `.middle`

v-bind支持

+ `.prop` 作为DOM property绑定而不是作为attribute绑定
+ `.camel` 将属性名驼峰化
+ .`sync` 语法糖，会拓展一个更新父组件绑定值的v-on监听

v-model支持

+ `.lazy` 取代input时间监听change事件
+ `.number` 输入字符串转为有效数字
+ `.trim` 输入首尾空格过滤

### .sync修饰符
在一些情况下我们可能要对prop进行"双向绑定",但这样会带来维护上的问题。Vue中的`.sync` 修饰符，就相当于语法糖一样的存在。它会被拓展为自动跟新父组件属性的`v-on` 监听器。  
示例如下

```plain
 <Child :money.sync="total"></Child>
```

会被拓展为

```plain
<Child :money="total" v-on=update:money="total=$event"></Child>
```

而子组件跟新money值时，需要触发当前实例上的事件，附加的参数传给监听器回调。

```plain
 <button @click="$emit('update:money',money-100)"><span>取钱</span></button>
```

具体示例如下所示

:::code-group
``` vue [App.vue]
<template>
  <div class="app">
    App.vue 我现在有 {{total}}
    <hr>
    <Child :money.sync="total"></Child>
<!--    <Child :money="total" v-on:update:money="total = $event"/>-->
  </div>
</template>

<script>
import Child from "./Child";
export default {
  data() {
    return { total: 10000

    };
  },
  components: { Child }
};

</script>

<style>
.app {
  border: 3px solid red;
  padding: 10px;
}
</style>
```

``` vue [Child.vue]
<template>
  <div class="child">
    {{ money }}
    <button @click="$emit('update:money',money-100)"><span>取钱</span></button>
  </div>
</template>
<script>
export default {
  props: ["money"]
}
</script>
<style>
.child {
  border: 1px solid red;
  padding: 10px;
}
</style>
:::
