# Directive指令

除了内置外，Vue也允许注册自定义指令，用于对普通DOM元素进行底层操作。

全局注册自定义指令

```javascript
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
```

注册局部指令，组件中接收directives的选项

```javascript
directives:{
	focus:{
  	//指令的定义
    inserted:function(el){
    	el.focus()
    }
  }
}
```

Directive指令也接收钩子函数

+ bind 第一次绑定元素时调用，仅一次
+ inserted 被绑定元素插入父节点时调用
+ update 所在组件的VNode更新时调用
+ componentUpdated 组件的VNode及其子组件全部跟新后调用
+ unbind 指令与元素解绑时调用，仅一次(类似于destroyed)

钩子函数的参数

+ el 指令所绑定的元素，用于直接操作DOM
+ bind 
    - name 指令名字，不包含v-前缀
    - value 绑定值
    - oldValue 绑定前的值
    - expression 字符串形式的指令表达式
    - arg 传给指令的参数
    - modifiers 一个包含修饰符的对象
+ vnode Vue生成的虚拟节点
+ oldVnode 上一个虚拟节点

指令的作用

+ 主要用于DOM操作

Vue实例/组件用于数据绑定、时间监听、DOM更新

Vue指令主要目的就是原生DOM操作

+ 减少重复

如果某个DOM操作比较复杂或经常使用，就可以封装为指令

```javascript
<template>
  <div>
  {{data}}
  <button id="app" v-on2:click=add>
  add
  </button>
  </div>
</template>
<script>
export default {
  name: "App",
  data(){
    return {
      data:1
    }
  },
  methods:{
    add(){
    this.data ++
    },
  },
  directives:{
    on2:{
      bind(el,binding,info){
        console.log('bind');
        var s = JSON.stringify
        for(var key in binding){
         console.log(`${s(key)}:${s(binding[key])}`)
        }
        el.addEventListener(info.arg,info.value)
      },
      inserted(){
        console.log('inserted');
      },
      update(){
        console.log('update');
      },
      componentUpdated(){
        console.log('componentUpdated');
      },
      unbind(el,info){
        console.log('unbind');
          el.removeEventListener(info.args,info.value)
      }
    }
  }
};
</script>
```

