# Vue3为什么使用Proxy

1. 弥补了 `defineProperty` 的两个不足。
    1. 动态创建的 `data` 属性需要使用 `Vue.set` 来赋值，Vue3用了Proxy就不需要了。
    2. 基于性能考虑，[Vue2篡改了数组的7个API](https://cn.vuejs.org/v2/guide/list.html#%E5%8F%98%E6%9B%B4%E6%96%B9%E6%B3%95)，Vue3用了Proxy就不需要了。
        * push()
        * pop()
        * shift()
        * unshift()
        * splice()
        * sort()
        * reverse()
2. `defineProperty` 需要提前递归遍历 `data` 做到响应式，而Proxy可以在真正用到深层数据的时候在做响应式（惰性）

