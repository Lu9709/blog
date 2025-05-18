# v-model
v-model指令一般用于[表单输入绑定](https://cn.vuejs.org/v2/guide/forms.html#%E5%9F%BA%E7%A1%80%E7%94%A8%E6%B3%95)`<input>`、`<textarea>`及`<select>`元素上进行双向绑定。根据控件类型自动选取正确的方法来更新元素。

### v-model的原理
`v-model`就是Vue的双向绑定的指令，能够根据控件的类型自动选取正确的方法来跟新元素。`v-model`本质上就是语法糖，它会监听用户的输入事件来跟新数据。

**举例如下：**

```vue
<template>
  <div>
    {{ data.value }}
    <br>
      <input type="text" v-model="data.value"> //等价于下面的写法
    // <input type="text" :value="data.value" @input="data.value = $event.target.value">
    // 组件中使用
    // <custom-input :value="text" @input="$event"></custom-input> 
  </div>
</template>
<script>
  export default {
    data() {
      return {
        data: {
          value: ""
        }
      }
    }
  }
</script>
```

其中`$event`是指对应的事件信息。对于原生元素（如 `button`、`input`）来说， `$event` 是原始的 `DOM` 事件。  
对于自定义组件（如 `child`）来说，`$event` 是其自身`$emit`里的第二个参数。

**关于**`**$emit()**`**解释如下所示：**

`vm.$emit( eventName, […args] )`

触发当前实例上的事件。附加参数都会传给监听器回调。

以上面那个例子进行更改。

```vue
<template>
  <div>
    {{ data.value }}
    <br>
      <my-input :value="data.value" @input="data.value=$event"></my-input>
    </div>
</template>
<script>
  export default {
    data() {
      return {
        data: {
          value: ""
        }
      }
    },
    components: {MyInput}
  }
</script>
```

组件中

```vue
<template>
  <input type="text" :value="data" @input="$emit('input',value=$event.target.value)">
  </template>
<script>
  export  default {
    name:"MyInput",
    props:{
      data:{
        type:String
      }
    },
  }
</script>
```

### 修饰符
+ `.lazy` 默认情况下，`v-model`是在每次`input`事件后进行数据同步。添加`lazy`后转为`change`事件后进行同步
+ `.number` 自动将输入值转为数值类型
+ `.trim` 自动过滤首尾空白字符

`v-model`用于`form`表单的例子

```vue
<template>
  <div id="app">
    <form @submit.prevent="onSubmit">
      <div>JOIN IN</div>
      {{user}}
      <hr>
        <label>name:   
          <input type="text" v-model.lazy.trim="user.name">
          </label>
        <label>password:
          <input type="password" v-model.lazy.number="user.password">
          </label>
        <button>submit</button>
      </form>
  </div>
</template>
<script>
  export default {
    name: "App",
    data(){
      return {
        user:{
          name:'',
          password:''
        }
      }
    },
    methods:{
      onSubmit(){
        console.log(this.user)
      }
    }
  };
</script>

```

