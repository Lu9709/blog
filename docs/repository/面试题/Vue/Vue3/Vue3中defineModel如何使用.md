# Vue3中 defineModel 如何使用

`defineModel` 声明一个**双向绑定** `prop`，通过父组件的 `v-model` 来使用，无需声明 `props` 和 `emit`，只能在 `<script setup>` 中使用。

源码中这个宏声明了一个 `model prop` 和一个相应的值更新事件。如果第一个参数是一个字符串字面量，它将被用作 `prop` 名称；否则，`prop` 名称将默认为 `modelValue`。

### 作用

`defineModel()` 是对 `modelValue` + `update:modelValue` 的封装，简化了组件中实现 `v-model` 的过程。 

`defineModel()` 等价于 `defineProps({ modelValue })` + `defineEmits(['update:modelValue'])`。

::: code-group
```vue [子组件]
<template>
  <input
    :value="model"
    @input="$event => model = $event.target.value"
    placeholder="输入内容..."
  />
</template>
<script setup>
// 声明一个支持 v-model 的 model
const model = defineModel(); // 默认使用 modelValue
</script>
```
```vue [父组件]
<template>
  <CustomInput v-model="message" />
  <p>当前值: {{ message }}</p>
</template>

<script setup>
import { ref } from 'vue';
import CustomInput from './components/CustomInput.vue';

const message = ref('Hello Vue 3');
</script>
```
:::

### 进阶用法

1. 可以为 `defineModel()` **指定字段名**，并添加**类型定义**、**设置默认值**。
::: code-group 
```vue [子组件]
<template>
  <input
    :value="username"
    @input="$event => username = $event.target.value"
    placeholder="输入内容..."
  />
</template>
<script setup>
// 声明一个支持 v-model 的 model
const username = defineModel('username', { type: String, default: '' });
```
```vue [父组件]
<template>
  <CustomInput v-model:username="username" />
  <p>当前UserName: {{ username }}</p>
</template>

<script setup>
import { ref } from 'vue';
import CustomInput from './components/CustomInput.vue';

const username = ref('John'); 
</script>
```
:::

2. 解构 `defineModel()` ，获取 `v-model` 指令使用的修饰符。
   
当存在修饰符的时候，我们需要在**读取或将其同步**回父组件时对其值进行**转换**。我们可以通过使用 `get` 和 `set` 转换器选项来实现。

```js
const [modelValue, modelModifiers] = defineModel({
  // get() 省略了，因为这里不需要它
  set(value) {
    // 如果使用了 .trim 修饰符，则返回裁剪过后的值
    if (modelModifiers.trim) {
      return value.trim()
    }
    // 否则，原样返回
    return value
  }
})
```

### 参考链接

> [Vue3 中 defineModel 用法](https://cn.vuejs.org/api/sfc-script-setup.html#definemodel)
