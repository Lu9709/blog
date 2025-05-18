# computed和watch
### computed
计算属性的意思，它会根据你所以来的数据动态显示新的计算结果。

计算属性将被混入到 Vue 实例中。所有 getter 和 setter 的 this 上下文自动地绑定为 Vue 实例。

计算属性的结果会被缓存，只有依赖的响应式property变化才会重新计算。

+ 示例

```javascript
import Vue from "vue";
Vue.config.productionTip = false;
let id = 0;
const createUser = (name, gender) => {
  id += 1;
  return { id: id, name: name, gender: gender };
};
new Vue({
  data() {
    return {
      users: [
        createUser("Tom", "male"),
        createUser("John", "female"),
        createUser("Jack", "male"),
        createUser("Gray", "female")
      ],
      gender: ""
    };
  },
  computed:{
    displayUsers() {
      const hash = {
        male: "male",
        female: "female"
      };
      const { users, gender } = this;
      if (gender === "") {
        return users;
      } else if (typeof gender === "string") {
        return users.filter(u => u.gender === hash[gender]);
      } else {
        throw new Error("gender 的值是意外的值");
      }
    }
  },
  template: `
 <div>
 <button @click="gender=''">Show All</button>
 <button @click="gender='male'">Male</button>
 <button @click="gender='female'">Female</button>
  <ul>
    <li v-for="(x,index) in displayUsers" :key="index">{{x.name}}-{{x.gender}}</li>
  </ul>
 </div>

 `
}).$mount("#app");
```

**使用目的**

因为如果模板中放着很多逻辑式会让模板本身过于笨重，会对页面可维护性造成影响。computed刚好适用于这种情况。

### watch
watch的用途是当数据变化时,执行一个函数(watch是异步的)。watch第一次的值是不监听的,一般用于观察 Vue 实例上的一个表达式或者一个函数计算结果的变化。回调函数得到的参数为**新值**和**旧值**。表达式只接受简单的键路径。对于更复杂的表达式，用一个函数取代。若是要是要监听第一次的值可以使用`immediate:true`将立即以表达式的当前值触发回调。

watch有两个选项:

+ deep 是否监听对象内的变化
+ immediate 是否在第一次渲染执行这个函数
+ **示例1**

```javascript
new Vue({
  data: {
    n: 0,
    history: [],
    inUndoMode: false
  },
  watch: {
    n: function(newValue, oldValue) {
      console.log(this.inUndoMode);
      if (!this.inUndoMode) {
        this.history.push({ from: oldValue, to: newValue });
      }
    }
  },
  template: `
    <div>
      {{n}}
      <hr />
      <button @click="add1">+1</button>
      <button @click="add2">+2</button>
      <button @click="minus1">-1</button>
      <button @click="minus2">-2</button>
      <hr/>
      <button @click="undo">撤销</button>
      <hr/>

      {{history}}
    </div>
  `,
  methods: {
    add1() {
      this.n += 1;
    },
    add2() {
      this.n += 2;
    },
    minus1() {
      this.n -= 1;
    },
    minus2() {
      this.n -= 2;
    },
    undo() {
      const last = this.history.pop();
      this.inUndoMode = true;
      const old = last.from;
      this.n = old; // watch n 的函数会异步调用
      this.$nextTick(() => { //dom更新完后在执行
        this.inUndoMode = false;
      });
    }
  }
}).$mount("#app");
```

+ **示例2 **模拟computed,<font style="background-color:#FADB14;">不建议</font>

```javascript

new Vue({
  data: {
    user: {
      email: "xxx@qq.com",
      nickname: "Tom",
      phone: "123456"
    },
    displayName: ""
  },
  watch: {
    "user.email": {
      handler: "changed",
      immediate: true // 第一次渲染是也触发 watch
    },
    "user.nickname": {
      handler: "changed",
      immediate: true // 第一次渲染是也触发 watch
    },
    "user.phone": {
      handler: "changed",
      immediate: true // 第一次渲染是也触发 watch
    }
  },
  // 不如用 computed 来计算 displayName
  template: `
    <div>
       {{displayName}}
       <button @click="user.nickname=undefined">remove nickname</button>
    </div>
  `,
  methods: {
    changed() {
      console.log(arguments);
      const user = this.user;
      this.displayName = user.nickname || user.email || user.phone;
    }
  }
}).$mount("#app");

```

+ **示例3**

```javascript
let vm = new Vue({
  data: {
    n: 0,
    obj: {
      a: "a"
    }
  },
  template: `
    <div>
      {{n}}
      <button @click="n += 1">n+1</button>
      <button @click="obj.a += 'hi'">obj.a + 'hi'</button>
      <button @click="obj = {a:'a'}">obj = 新对象</button>
    </div>
  `,
  watch: {
    obj:{
      handler: function () { 
      console.log("obj 变了")
    },
      deep: true 
   // deep 属性设定在任何被侦听的对象的property改变时都要执行handler的回调，不论其被嵌套多深
    },
    "obj.a": function() {
      console.log("obj.a 变了");
    }
  }
}).$mount("#app");
vm.$watch('n',function(){console.log('n出现了')},{immediate:true})
 	// immediate 属性设定该回调将会在侦听开始之后被立即调用
```

**注意事项**

简单类型看值的变化,复杂类型(对象)看地址。

**<font style="color:#F5222D;">不应该使用箭头函数来定义watch函数。</font>**理由是箭头函数绑定了父级作用域的上下文,所以 this 将不会按照期望指向 Vue 实例。

```plain
searchQuery: newValue => this.updateAutocomplete(newValue)
this.updateAutocomplete === undefined // true
```

**watch语法**

+ o1:function(value,oldvalue){},
+ o2(){}
+ o3:[f1,f2]
+ o4:'methodName'
+ o5:{handler:fn,deep:true,immediate:true},

'object.a':function(){}

}

+ vm.$watch('xxx',fn,{deep:...,immediate:...})

**参考来自 **[**Vue-文档**](https://cn.vuejs.org/v2/api/#watch)

