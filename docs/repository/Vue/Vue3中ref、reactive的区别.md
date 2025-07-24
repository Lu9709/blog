# Vue3中ref、reactive的区别

Vue3 响应式系统的核心机制中 `ref` 和 `reactive` 都能实现响应式，但它们**内部实现原理**、**使用场景**、**数据结构处理方式**完全不同。

### ref

`ref` 返回的是一个带有 `value` 属性的"响应式对象"，其本质是一个**类（Class）实例**，通过 **getter/setter** 劫持 `.value` 访问，通过`track`收集依赖 和 `trigger` 触发依赖更新。

**关键点**：

* `ref` 是一个对象，`.value` 是响应式**入口**。
* 在模版中使用时，Vue 会**自动解包** `.value` (通过 `proxyRefs` 机制)。
* 支持**基本类型**和**对象**。
* 通过 `track` 和 `trigger` **追踪依赖**。

:::code-group
```js [ref源码]
/**
 * @internal
 */
class RefImpl<T = any> {
  _value: T
  private _rawValue: T

  dep: Dep = new Dep()

  public readonly [ReactiveFlags.IS_REF] = true
  public readonly [ReactiveFlags.IS_SHALLOW]: boolean = false

  constructor(value: T, isShallow: boolean) {
    // 存储原始值
    this._rawValue = isShallow ? value : toRaw(value)
    // 如果是对象，则用 reactive 转换
    this._value = isShallow ? value : toReactive(value)
    this[ReactiveFlags.IS_SHALLOW] = isShallow
  }

  get value() {
    if (__DEV__) {
      // 收集依赖
      this.dep.track({
        target: this,
        type: TrackOpTypes.GET,
        key: 'value',
      })
    } else {
      this.dep.track()
    }
    return this._value
  }

  set value(newValue) {
    const oldValue = this._rawValue
    const useDirectValue =
      this[ReactiveFlags.IS_SHALLOW] ||
      isShallow(newValue) ||
      isReadonly(newValue)
    newValue = useDirectValue ? newValue : toRaw(newValue)
    // 值发生变化时
    if (hasChanged(newValue, oldValue)) {
      this._rawValue = newValue
      // 设置新值（对象会被 reactive 转换）
      this._value = useDirectValue ? newValue : toReactive(newValue)
      // 触发更新
      if (__DEV__) {
        this.dep.trigger({
          target: this,
          type: TriggerOpTypes.SET,
          key: 'value',
          newValue,
          oldValue,
        })
      } else {
        this.dep.trigger()
      }
    }
  }
}
```
:::

### reactive

`reactive` 是基于 ES6 Proxy 实现深度响应式，通过 `new Proxy(target, handler)` 创建代理对象，对整个对象进行**深度代理**，拦截所有属性的读写操作。

**关键点**：
* 使用 `Proxy` **代理整个对象**。
* **深度响应式**：嵌套对象自动转换为 `reactive`。
* 依赖追踪基于**目标对象**和**属性键**。
* **不支持基本类型**（因为不能用 Proxy 包裹）。

:::code-group
```js [reactive源码]
function reactive(target: object) {
  // 如果为只读对象 则返回只读对象
  if (isReadonly(target)) {
    return target
  }
  // 创建代理对象
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap,
  )
}
```
```js [createReactiveObject源码]
function createReactiveObject(
 target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<Target, any>,
) {
  // …………
  // 只能观察到特定的值类型
  const targetType = getTargetType(target)
  if (targetType === TargetType.INVALID) {
    return target
  }
  // target 已经有相应的 Proxy，则直接返回
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }
  // 创建代理
  const proxy = new Proxy(
    target,
    // 根据类型选择处理器
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers,
  )
  // 缓存代理对象
  proxyMap.set(target, proxy)
  return proxy
}
```

```js [处理核心逻辑mutableHandlers伪代码]
const mutableHandlers: ProxyHandler<object> = {
  get(target, key, receiver) {
    // 追踪依赖
    track(target, TrackOpTypes.GET, key)
    // 获取原始值
    const res = Reflect.get(target, key, receiver)
    // 如果是对象，递归转为响应式
    if (isObject(res)) {
      return reactive(res)
    }
    return res
  },
  set(target, key, value, receiver) {
    // 获取旧值
    const oldValue = target[key]
    // 设置新值
    const result = Reflect.set(target, key, value, receiver)
    // 触发更新
    if (hasChanged(value, oldValue)) {
      trigger(target, TriggerOpTypes.SET, key)
    }
    return result
  },
  // 其他操作拦截：deleteProperty, has, ownKeys 等
}
```
:::

**注意点**：
:::warning 不能重新赋值整个对象
因为 `reactive` 返回的是一个 `Proxy`，你赋值的新对象没有经过 `createReactiveObject` 处理。
```js
let obj = reactive({ count: 0 });
obj = { count: 1 }; // × 新对象不是响应式的
```
:::

:::warning 不能用于基本类型
因为基本类型无法被 Proxy 包裹。
```js
const num = reactive(1); // × 无效
````
:::
::: tip ref 能在 reactive 中自动解包
```js
const state = reactive({
  count: ref(0), // 自动解包
  user: ref(null)
})
console.log(state.count) // 直接访问，无需 .value
```
:::

**额外关注点**：
::: tip 重新赋值方法
1. 可以通过 `Object.assign` 将新对象的属性合并到原响应式对象中。
   ```js
   const state = reactive({ count: 0, user: { name: 'John' } })
    // 安全重新赋值 - 保持响应性
    Object.assign(state, { 
      count: 5, 
      user: { name: 'Alice', age: 30 }
    })

    console.log(state.count) // 5
    console.log(state.user.name) // 'Alice'
   ```
2. 手动设置属性
    ```js
    const state = reactive({ count: 0, items: [] })
    // 重新设置所有属性
    state.count = 10
    state.items = [1, 2, 3]
    state.newProperty = 'value' // 可以添加新属性
    ```
3. 使用 ref 包装 reactive 对象（高级用法）
   ```js
    import { ref } from 'vue'
    // 使用 ref 包装 reactive 对象
    const stateRef = ref({
      count: 0,
      settings: { darkMode: true }
    })
    // 完全重新赋值
    stateRef.value = {
      count: 5,
      settings: { darkMode: false }
    }
    ```
:::

### 实际使用场景
::: code-group
```js [基本类型使用]
// ref 适用
const count = ref(0) // √ 正确
count.value++

// reactive 不适用
const count = reactive(0) // × 错误，不会生效
```

```js [对象类型使用]
// ref 使用对象
const userRef = ref({ name: 'John', age: 30 })
userRef.value.name = 'Mike' // 通过 .value 访问

// reactive 使用对象
const user = reactive({ name: 'John', age: 30 })
user.name = 'Mike' // 直接访问属性
```
```js [重新赋值]
// ref 支持重新赋值
const state = ref({ count: 0 })
state.value = { count: 1 } // √ 保持响应性

// reactive 不支持整个替换
const state = reactive({ count: 0 })
state = { count: 1 } // × 丢失响应性

// 正确做法：修改属性或使用 Object.assign
Object.assign(state, { count: 1 }) // √s
```
```vue [模版中使用]
<!-- ref 自动解包 -->
<script setup>
const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>

<!-- reactive 直接使用 -->
<script setup>
const state = reactive({ count: 0 })
</script>

<template>
  <button @click="state.count++">{{ state.count }}</button>
</template>
```
::: code-group

### 总结

| 对比唯独 | ref | reactive |
| --- | --- | --- |
| 基本类型 | 支持 | 不支持（只能用于对象、数组等引用类型） |
| 对象类型 | 支持 | 支持 |
| 内部实现机制 | 基于`class`+`getter/setter` | 基于`Proxy`深层代理 |
| 模板中是否自动解包 | 是 | 是 |
| 是否可以重新赋值 | 是 | 否，会丢失响应性 |
| 嵌套属性响应性 | 不自动（需手动reactive包裹） | 自动（Proxy 递归代理） |
| 是否可被 toRefs 解构 | 不需要 | 推荐使用`toRefs`解构保持响应性 |
| 适用场景 | 简单变量、基本类型、独立状态 | 对象结构、复杂嵌套数据、组件状态树 |

### 参考链接

> [Vue 源码 reactive](https://github.com/vuejs/core/blob/main/packages/reactivity/src/reactive.ts)
>
> [Vue 源码 ref](https://github.com/vuejs/core/blob/main/packages/reactivity/src/ref.ts)
