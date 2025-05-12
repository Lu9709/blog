# Vue3对比Vue2做了哪些改动

[官方文档](https://v3-migration.vuejs.org/breaking-changes/)写了（[中文在这](https://v3.cn.vuejs.org/guide/migration/introduction.html#%E9%9D%9E%E5%85%BC%E5%AE%B9%E7%9A%84%E5%8F%98%E6%9B%B4)）

1. `createApp()` 代替了 `new Vue()`
2.  `v-model` 替代了以前的 `v-model` 和 `.sync`，可以通过 `v-model`上加一个参数代替。
3. 根元素可以有不止一个元素了。
4. 新增 `Teleport` 传送门。
5. `destroyed` 被改名为 `unmounted`了(`before`当然也改了)
6. `ref` 属性支持函数。
7. `v-if` 和 `v-for` 优先级改变。
    * vue2：`v-for` 优先级更高。
    * vue3：`v-if` 优先级更高。
8. `v-bind` 合并行为（按声明顺序覆盖行为）。
9. `v-on.native` 修饰符移除，改用 `emits` 选项 。