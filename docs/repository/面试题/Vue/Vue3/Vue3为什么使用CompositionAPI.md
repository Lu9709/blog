# Vue3为什么使用Composition API？

答案参考尤雨溪的博客，[Vue Function-based API PRF](https://zhuanlan.zhihu.com/p/68477600)

1. Composition API比mixins、高阶组件、extends、Renderless Component等更好，原因有三：
    1. 模版中的数据来源不清晰。
    2. 命名空间冲突。
    3. 性能。
2. 更适合TypeScript

