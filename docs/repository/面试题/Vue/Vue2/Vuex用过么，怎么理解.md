# Vuex用过么，怎么理解

1. Vuex是一个**专门为Vue.js应用程序开发的状态管理模式 + 库**
2. 核心概念名称和作用：store/State/Mutation/Action/Module
    1. `store` 是个大容器，包含以下所有内容。
    2. `State` 用来**读取状态**，带有一个 `mapState` 辅助函数。
    3. `Getter` 用来**读取派生状态**（即计算状态），附有一个 `mapGetters` 辅助函数。
    4. `Mutation` 用于**同步提交状态变更**，附有一个 `mapMutation` 辅助函数。
    5. `Action` 用于**异步变更状态**，但它提交的是 `mutation`，而不是直接变更状态，附有一个 `mapActions` 辅助函数。
    6. `Module` 用来给 `store` 划分模块，方便维护代码。

常见追问：`Mutation` 和 `Action` 为什么要分开？

答案：为了让代码更易维护。（可是Pinia就把 `Mutation`和 `Action` 合并了，这样是为了减少一个概念，更方便于代码理解）

::: tip 关于Pinia的内容
1. 使用 `defineStore` 定义一个Store，第二个参数接受 Setup 函数或 Option 对象。
2. 从Store解构需要使用 `storeToRefs`，避免破坏响应式。
3. 变更 `state` 状态：
    * 访问 `state`：直接使用实例 `store.xxx`
    * 重置 `state`：`$reset`
    * 替换 `state`：`$patch`
    * 订阅 `state`：`$subscribe` 和 Vuex的订阅类似。
4. 选项式API和SetupStores写法有区别。
5. `store` 是一个用 `reactive` 包装的对象，这意味着不需要在 `getters` 后面写 `.value`。
:::

**参考链接**

[Vuex](https://vuex.vuejs.org/zh/)
[Pinia](https://pinia.vuejs.org/zh/introduction.html)