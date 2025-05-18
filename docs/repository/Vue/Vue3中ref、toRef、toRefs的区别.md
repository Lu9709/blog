# Vue3中ref、toRef、toRefs的区别
## ref
接受一个內部置并返回一个响应式且可变的ref对象。ref对象有一个`.value`property指向该内部值。**是对数据的复制，修改响应式数据不影响旧数据，页面会重新渲染。**

ref接受的参数可以是基本数据类型，也可以接受复杂数据类型(对象)。ref分配为对象时会被`reactive`函数处理为深层的响应式对象。也可以把`ref(params)`理解为`reactive({value:params})`

```javascript
<template>
  <div class="ref">
    <h1>Ref.Count:{{count}}</h1>
    <button @click="countClick">click</button>
  </div>
</template>
<script>
import {ref} from "vue";

export default {
  name: 'RefComponent',
  setup() {
    const number = 111
    const count = ref(number)
    const countClick = () =>{
      console.log(count,number)
      count.value++
    }
    return {
      count,countClick
    }
  },
}
</script>
```

## toRef
用于响应式对象上的某一个property新创建和一个`ref`。然后ref可以被传递，它会保持对其源property的响应式连接。(即使源property不存在，也会返回一个可用的ref，便于可选prop操作)。

**是对数据的****<font style="color:rgb(51, 51, 51);">引用，修改响应式数据会影响其源的数据；数据改变，页面不会重新渲染。</font>**

```javascript
<template>
  <div>fooRef:{{ fooRef }}</div>
  <button @click="toRefClick">fooRef++</button>
</template>
<script setup>
import { toRef } from 'vue'
const state = {
  foo: 1,
  boo: 1,
}
const fooRef = toRef(state, 'foo')
const toRefClick = () => {
  fooRef.value++
  console.log(state.foo)
  console.log(fooRef.value)
}

</script>
```

## toRefs
将响应式对象转换为普通对象，其中结果对象的每个 property 都是指向原始对象相应 property 的 `ref`。

1. 接收一个对象作为参数，它会遍历对象身上所有属性，然后调用单个toRef
2. 将对象的多个属性变成响应式数据，并且要求响应式数据和原始数据关联，且更新响应式数据的时候不会更新界面，用于批量设置多个数据为响应式

```javascript
<template>
  <div>stateRef.boo:{{ stateRef.boo }}</div>
  <button @click="toRefClick">stateRef++</button>
</template>
<script setup>
import { toRefs } from 'vue'
const state = {
  foo: 1,
  boo: 1,
}
const stateRef = toRefs(state)
const toRefClick = () => {
  stateRef.boo.value++
  console.log(state.boo)
  console.log(stateRef.boo.value)
}
</script>
```

