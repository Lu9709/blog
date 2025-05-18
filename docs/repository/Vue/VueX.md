# VueX
vuex是一个专门为Vue.js应用程序开发的状态管理模式

### state
由于Vue使用单一状态树，state则用来存储数据源，每个应用仅包含一个store实例，可以获取属性值。Vue组件获取VueX的状态只需要在computed通过store实例来获取.初始化store时要在state初始化所有的属性。

```plain
// 创建一个 Counter 组件
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return store.state.count
    }
  }
}
```

VueX也可以通过store选项，将它从根组件注入到每个子组件调用`Vue.use(Vuex)`,组件能通过`this.$store`访问到实例的内容。

```plain
const app = new Vue({
  el: '#app',
  // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
  store,
})
```

为了获取更多的状态，可以使用mapstate来生成计算属性，也可以使用对象展开运算符。

```plain
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // 箭头函数可使代码更简练
    count: state => state.count,
    // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: 'count',
    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
  // computed:{
  //...mapState({})
  // }
}
```

### getters
类似于Vue中的computed，可以将state进行处理生成新的数据状态，依赖值发生改变就会重新计算,Getter接收state作为第一个参数。也可通过`store.getters`来暴露。

```plain
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    },
   //getter可以返回一个函数
   getTodoById: (state) => (id) => {
    	return state.todos.find(todo => todo.id === id)
  }
})
```

`mapGetters`可以将store的getter映射到局部计算属性

```plain
import { mapGetters } from 'vuex'
export default {
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
  // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
      doneCount:'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

### mutations
可以更改Vuex的store的状态通过mutation的commit方式来触发，mutation接收一个字符串事件类型和一个回调函数。`store.commit`可以传入额外参数被成为载荷`payload`,载荷应该为一个对象。mutation提交的方式有三种，如下所示。

```plain
mutations: {
  increment (state, n) {
    state.count += n
  }
}
//提交方式
//store.commit('increment',10)
//store.commit('increment', {
  amount: 10
})
//store.commit({
  type: 'increment',
  amount: 10
})

```

mutation必须是<font style="color:#F5222D;">同步函数</font>，<font style="color:#F5222D;">导致的变化变更由此刻完成(即可变更)</font>，在组件中可以使用`this.$store.commit('xxx')`提交mutation，或使用`mapMutations`。

```plain
import { mapMutations } from 'vuex'
export default {
  methods: {
    ...mapMutations([
      'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`

      // `mapMutations` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 	`this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    })
  }
}
```

### actions
actions类似于mutation，但它用于<font style="color:#F5222D;">提交mutation</font>，并不是直接变更状态，<font style="color:#F5222D;">用于执行异步的操作</font>。Action接收一个和store实例具有相同方法和属性的context对象，可以通过`context.commit`提交一个mutation。一般通过`store.dispatch`方法来触发action，也支持载荷方式和对象进行分发。

actions可以调用异步API和多个mutation，由于action执行的是异步函数返回为Promise，且`store.dispatch`后仍旧返回Promise，`mapActions`可以将组件的methods映射为`store.dispatch`调用，需要在根节点注入store.

可以使用async/await.

```plain
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
 // increment ({ commit }) {
 //	 commit('increment')
 // }
  }
})
// store.dispatch('increment')
// 以载荷形式分发
store.dispatch('incrementAsync', {
  amount: 10
})
// 以对象形式分发
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

### modules
由于所有状态会集中到一个比较大的对象，可以将及模块化。每个模块都有自己的state、mutation、action、getter。mutation和getter接收的第一个参数是模块<font style="color:#F5222D;">局部</font>的状态对象。对于模块内部的action、getter，根节点转台会作为第三个参数暴露出来`rootState`。 

为了让模块具有更高的封装都和复用性，可以添加`namespaced:true`使其成为带命名空间的模块，它的属性会自动根据模块注册的路径调整命名。

```plain
const moduleA = {

  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}
const moduleB = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}
const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})
```

若需要在带命名空间的模块注册全局 action，可添加`root: true`在actions定义的函数中

```plain
actions: {
 	someAction: {
   root: true,
   addxx(){}
 	}
 }
```

带命名空间绑定函数，可以在模块空间名作为字符串作为参数，进行绑定，或者通过<font style="color:rgb(71, 101, 130);">createNamespacedHelpers</font><font style="color:rgb(44, 62, 80);"> 来返回一个对象进行绑定。</font>

```plain
computed: {
  ...mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  })
},
//createNamespacedHelpers 
const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')
computed: {
  ...mapState({
    a: state => state.a,
    b: state => state.b
  })
},
```

### 模块动态注册
store创建后可以使用`store.registerModule`来注册模块,也可用`store.unregisterModule(moduleName)`来动态卸载模块。`store.hasModule(moduleName)`检测模块是否注册到store，preserveState可以将旧的state进行保留下来和现有的store的state进行合并，例如注册一个新模块时保留旧state:`store.registerModule('a', module, { preserveState: true })`

对于模块的重用的方法，为了避免模块数据内互相污染，可以通过<font style="color:#F5222D;">函数的方式</font>来声明模块方式。

