# Vue2是如何实现双向绑定的

1. 说明一般使用 `v-model`/`.sync` 来实现，`v-model` 是 `v-bind:value` 和 `v-on:input` 的**语法糖**。
    1. `v-bind:value` 实现了 data => UI 的**单向绑定**。
    2. `v-on:input` 实现了 UI => data 的**单向绑定**。
    3. 加起来就是**双向绑定**。
2. 这两个单项绑定是如何实现的呢？
    1. 前者通过 `Object.defineProperty` 这个API给 `data` 创建 `getter` 和 `setter`，用于监听 `data` 的改变，`data` 一变就改变UI。
    2. 后者通过 `template compiler` 给DOM添加事件监听，DOM `input` 的值变化了就会去修改 `data`。

**参考链接**

[vue的双向绑定原理及实现](https://www.cnblogs.com/canfoo/p/6891868.html)

[.sync 修饰符](https://www.yuque.com/baizhe-kpbhu/xdlosh/eq6egy)

