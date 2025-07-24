# **Vue3中Watch和WatchEffect的区别**

### 原理分析
::: code-group
```js [watch 伪代码]
function watch(source, cb, options) {
  // 1. 规范化source为getter函数
  const getter = isArray(source)
    ? () => source.map(s => traverse(s))
    : isFunction(source)
      ? source
      : () => traverse(source)
  // 2. 创建scheduler调度器
  const scheduler = () => {
    // 获取新值
    const newValue = runner()
    // 执行回调并传入新旧值
    cb(newValue, oldValue, onInvalidate)
    // 更新旧值
    oldValue = newValue
  }
  // 3. 创建effect
  const runner = effect(getter, {
    lazy: true,
    scheduler,
    onTrack: options.onTrack,
    onTrigger: options.onTrigger
  })
  // 4. 记录初始值
  let oldValue
  if (options.immediate) {
    scheduler()
  } else {
    oldValue = runner()
  }
}
```
```js [watchEffect 伪代码]
function watchEffect(effect, options) {
  // 1. 直接使用传入的函数作为getter
  const getter = () => effect(onInvalidate)
  // 2. 创建scheduler调度器
  const scheduler = () => {
    if (effect.active) getter()
  }
  // 3. 创建effect
  const runner = effect(getter, {
    lazy: false, // 关键区别：立即执行
    scheduler,
    onTrack: options.onTrack,
    onTrigger: options.onTrigger
  })
  // 4. 返回停止函数
  return () => stop(runner)
}
```
:::

**关键差异点**
1. **依赖收集方式**:
   - `watch` 需要**显式声明**侦听源，通过 `source` 参数指定。
   - `watchEffect` **自动收集**回调中所有响应式依赖。
2. **执行时机**:
   - `watch` 默认**惰性执行**（需要 `{ immediate: true }` 强制初始执行）
   - `watchEffect` **立即执行**(初始化时自动运行一次)。
3. **参数获取**:
   - `watch` 可获取新值和旧值。
   - `watchEffect` 无法直接获取旧值(需要自行缓存)

### 使用场景对比

**watch 适用场景**

1. **需要访问旧值**
  ```js
  const count = ref(0)
  watch(count, (newVal, oldVal) => {
    console.log(`从 ${oldVal} 变为 ${newVal}`)
  })
  ```
2. **精确控制依赖源**
  ```js
  // 只侦听特定属性
  watch(
    () => state.user.name,
    (name) => console.log('用户名变更:', name)
  )
  ```
3. **惰性执行**
  ```js
  // 只在数据变化时执行（节省初始渲染性能）
  watch(data, fetchApi, { immediate: false })
  ```
4. **多源侦听**
  ```js
  watch([refA, () => objB.prop], ([a, b], [prevA, prevB]) => {
    // 处理多个依赖变化
  })
  ```

**watchEffect 适用场景**

1. **自动依赖收集**
  ```js
  watchEffect(() => {
    // 自动收集所有使用的响应式依赖
    console.log(`Count: ${count.value}, User: ${user.name}`)
  })
  ```
2. **简单副作用**
  ```js
  // 自动更新DOM标题
  watchEffect(() => {
    document.title = `${unread.value} 条未读消息`
  })
  ```
3. **异步操作清理**
  ```js
  watchEffect((onInvalidate) => {
    const timer = setTimeout(doWork, 1000)
    onInvalidate(() => {
      clearTimeout(timer) // 清理未完成的异步操作
    })
  })
  ```

### 性能优化技巧
1. **减少不必要侦听**
  ```js
  // 优化前：整个对象侦听
  watch(obj, () => {...})
  // 优化后：特定属性侦听
  watch(() => obj.importantProp, () => {...})
  ```
2. **使用 flush 选项控制时机**
  ```js
  // DOM更新后执行
  watchEffect(() => {...}, { flush: 'post' })
  // 同步执行（谨慎使用）
  watch(source, callback, { flush: 'sync' })
  ```
3. **手动停止长期侦听**
  ```js
  const stop = watchEffect(() => {...})
  // 组件卸载时停止
  onUnmounted(stop)
  ```
4. **避免重复创建侦听器**
  ```js
  // 错误：每次渲染创建新侦听器
  const setup() {
    watch(someRef, () => {...})
  }
  // 正确：只创建一次
  const setup() {
    const stop = watch(someRef, () => {...})
    onUnmounted(stop)
  }
  ```

### 总结

| 特性 | watch | watchEffect |
| --- | --- | --- |
| **依赖收集** | 显示声明依赖源 | 自动收集回调中所有响应式依赖 |
| **执行时机** | 默认惰性(首次不执行)，数据变化后执行 | 立即执行(初始化时运行) |
| **参数获取** | 可获取新值和旧值 | 无法直接获取旧值 |
| **调试能力** | 支持`onTrack`/`onTrigger`回调 | 同样支持调试钩子 |
| **适合异步操作** | 支持 | 不支持 |
| **多源侦听** | 支持数组形式侦听多个源 | 自动收集多个依赖 |
| **适用场景** | 需要旧值/精确控制依赖源/惰性执行 | 简单逻辑/自动依赖收集/立即执行 |