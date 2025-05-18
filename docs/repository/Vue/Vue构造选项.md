# Vue构造选项
Vue的实例被命名为vm,vm对象封装了对视图的所有操作,包括<u>数据读写</u>、<u>事件绑定</u>、<u>DOM更新</u>。vm的构造函数是Vue,按照ES6的说法，vm所属于的类为Vue,构造函数接收参数options,为构造选项。

### options的五类属性
#### 数据
+ data
+ props
+ propsData
+ computed
+ methods
+ watch

#### DOM
+ el
+ template
+ render
+ renderError

#### 资源
+ directives
+ filters
+ components

#### 生命周期钩子
+ beforeCreate
+ created
+ beforeMount
+ mounted
+ beforeUpdate
+ updated
+ activated
+ deactivated
+ beforeDestroy
+ destroyed
+ errorCaptured

#### 组合
+ extends
+ mixins
+ parent
+ provide
+ inject

#### 其他
+ name
+ delimiters
+ functional
+ model
+ inheritAttrs
+ comments

### el
只能在new创建实例的时候使用,提供一个在页面上已存在的 DOM 元素作为 Vue 实例的挂载目标。也可以使用`vm.$mount()`来挂载

### data
支持对象和函数,组件的定义只接收function,return对象,Vue实例会把data里的property转化为getter/setter使得data能够响应数据变化。

举例如`const vm = new Vue({data:{n:0}})`  
若是修改了vm.n 那么UI的n就会响应

### methods
用于存放方法,支持事件处理函数或普通函数,但会有bug每次渲染了都会调用一次。不应该使用箭头函数来定义method函数,因为this不会指向Vue实例。

### props
props可以是数组或对象,用于接收来自父组件的数据。props对对象允许配置高级选项,如类型检测、自定义验证和设置默认值。

type的类型为String、Number、function、date、object、array、boolean、symbol

可以设置默认值`default:any`,定义props是否为必填项`required:Boolean`,还可以自定义验证函数判定prop的传入`validator：Function`

```plain
// 简单语法
Vue.component('props-demo-simple', {
  props: ['size', 'myMessage']
})

// 对象语法，提供验证
Vue.component('props-demo-advanced', {
  props: {
    // 检测类型
    height: Number,
    // 检测类型 + 其他验证
    age: {
      type: Number,
      default: 0,
      required: true,
      validator: function (value) {
        return value >= 0
      }
    }
  }
})
```

### components
组件是可服用的Vue实例,有三种创建方式

+ 直接导入

```plain
import XXX from 'xxx.vue'
new Vue({ components:{Demo},template:`<Demo/>`})
```

+ 页面中

```plain
Vue.component('button-counter', {
    data() {
        return {
            n: 10
        }
    },
    template: `
      <div id="red">
      {{ n }}
      <button @click='add'>*2</button>
      </div>
    `,
    methods: {
        add() {
            this.n *= 2
        }
    }
})
new Vue({
template:`
<button-counter></button-counter>
`
})
```

+ 两者结合

```plain
import Demo from './Demo'
new Vue({
components({'button', {
    template: `
      <div>2312</div>
    `}},
template:`<button/>`
})
```

