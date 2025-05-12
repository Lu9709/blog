# Vue2组件通信方式

1. 父子组件：使用「**props和事件**」进行通信。
2. 爷孙组件：
    1. 使用两次父子组件通信来实现。
    2. 使用「**provide + inject**」来通信 ，[参考链接](https://www.yuque.com/baizhe-kpbhu/xdlosh/axf3fu)。
3. 任意组件：使用 `eventBus = new Vue()` 来通信。
    1. 主要API是 `eventBus.$on` 和 `eventBus.$emit`。
    2. 缺点是事件多了就很乱，难以维护。
4. 任意组件：使用Vuex通信（Vue3可用Pinia代替Vuex）。

