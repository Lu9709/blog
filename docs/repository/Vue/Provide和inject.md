# Provide和inject

如果有一些深嵌套的组件，要想取得父组件的某些内容，需要Prop传递到整个组件链，比较烦人。

`provide` 和`inject` 可以解决这个问题，父组件作为所有子组件依赖项提供程序，不管组件层次结构深度。即祖先提供东西，后代注入东西，作用范围大、隔N代共享信息。

`provide` 选项来提供数据，子组件有一个 `inject` 选项来开始使用这个数据。若是子组件要修改父组件提供的数据，需要在父组件通过函数方法的方式进行提供，子组件修改函数传入参数来进行。

+ provide: `Object | ()=>Object`
+ inject: `Array<string> | { [key: string]: string | Symbol | Object }`

对于对象还有两个参数

    - from 表示其源的property
    - default 默认值

父组件

```vue
<template>
  <router-view/>
</template>

<script lang="ts">
  import {ref,provide} from  'vue'
  export default {
    name: 'App',
    setup() {
      const asideVisible = ref(false)
      provide('asideVisible', asideVisible)
    }
  }
</script>

```

子组件

```vue
<script>
import {inject,Ref} from 'vue'
  export default {
    setup(){
      const asideVisible = inject<Ref<boolean>>('asideVisible')
      const toggleMenu = ()=>{
        asideVisible.value = !asideVisible.value
      }
      return {toggleMenu}
    }
  }
</script>
```

其他例子

