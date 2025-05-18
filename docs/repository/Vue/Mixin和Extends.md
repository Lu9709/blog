# Mixin和Extends

### Mixin
mixin选项接收一个混入对象(包含实例选项)，智能合并到最终选项中。

全局混入会影响每个之后创建的Vue实例。

```javascript
//全局混入
Vue.mixins({...})
```

局部混入，可以实现创建一个包含实例选项的对象，混入对象的钩子将会在自身钩子**之前**调用。若是混入对象和数据发生冲突，以组件数据优先。

```javascript
let xxx = {
	data(){
		return {
    	n:0
    }
  },
  methods:{
		add(){
    	console.log('from mixin')
    }
	},
  created(){ console.log('混入对象钩子') }
}

new Vue(){
	mixins:[xxx],
	data(){
  	return {
    	name:'Tom',
      n:222
    }
  },
   methods:{
		add(){
    	console.log('from self')
    }
	},
  created(){ console.log('组件钩子调用') }
}
//mixin合并后为
new Vue(){
  data(){
  	return {
    	name:'Tom',
      n:222
    }
  },
  methods:{
		add(){
    	console.log('from self')
    }
	},
  created(){ 
    console.log('混入对象钩子')
    console.log('组件钩子调用') 
  }
}
// =>混入对象钩子
// =>组件钩子调用
vm.add() //=> from self
```

也可以使用[自定义选项合并策略](https://cn.vuejs.org/v2/guide/mixins.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E9%80%89%E9%A1%B9%E5%90%88%E5%B9%B6%E7%AD%96%E7%95%A5)，通过向`Vue.config.optionMergeStrategies`添加一个函数

```javascript
Vue.config.optionMergeStrategies.myOption = function (toVal, fromVal) {
  // 返回合并后的值
}
```

### Extends
和mixins类似,但更为抽象，允许声明扩展另一个组件 (可以是一个简单的选项对象或构造函数)，而无需使用 Vue.extend。这主要是为了便于扩展单文件组件。

全局使用Vue.extend({...})

局部使用options.extends()

```javascript
import Vue from 'vue';
const MyVue = Vue.extend({...})
export default MyVue
//全局使用
new MyVue({...})
//局部使用
new Vue({
	data(){
  	return {}
  },
  extends:MyVue
})
```

### parent
指定已创建的实例之父实例，在两者之间建立父子关系。子实例可以用 this.$parent 访问父实例，子实例被推入父实例的 $children 数组中。

