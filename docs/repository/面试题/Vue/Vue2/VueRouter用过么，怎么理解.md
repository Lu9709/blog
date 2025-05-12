# VueRouter用过么，怎么理解

1. Vue Router是Vue.js的**官方路由**。它与Vue.js核心深度集成，让用Vue.js**构建单页应用**变得轻而易举。
2. 核心概念的名字和作用：`router-link`、`router-view`、[嵌套路由](https://www.yuque.com/baizhe-kpbhu/xdlosh/fcmd3z#stCJk)、**Hash模式**和**History模式**、[导航守卫](https://www.yuque.com/baizhe-kpbhu/xdlosh/vprnsy)、[懒加载](https://www.yuque.com/baizhe-kpbhu/xdlosh/vprnsy#ieEcn)（`() => import()`）
3. 常见追问：
    1. **Hash模式**和**History模式**的区别？
        * 一个用的Hash（基于URL的**hash锚点部分**来实现路由）
         ::: tip 优缺点
         优点：**不刷新页面实现路由跳转**；

         缺点：**SEO不友好**；
         :::
         一个用的History API（基于HTML5 history API来实现路由，还可以使用 `pushState`和 `replaceState` 方法，使得路由变化不会导致页面的刷新）
         ::: tip 优缺点
         优点：后端可以将所有前端路由**渲染到同一个页面**；

         缺点：如果后端**没有做对应路由**，**刷新时会有404**，IE8以下不支持；
         :::
        * 一个不需要后端 `nginx` 配合（就是将所有的html的请求重定向到 `index.html`），一个需要。
    2. 导航守卫如何实现登录控制?
        ```javascript
        router.beforeEach((to, from, next) => {
          if (to.path === '/login') return next()
          if (to受控页面 && 没有登录) return next('/login?return_to'+ encodeURIComponent(to.path))
          next()
        })
        ```
::: warning 路由模式还有一个 Memory 模式
Memory模式不依赖URL，而是通过**内存管理路由状态**，适合**服务器端渲染**或**非浏览器环境**下的应用(Node环境或SSR)。
:::

::: info 路由的匹配语法
* 动态路径参数：以 `:` 开头。
* 可选参数：`?` 结尾。
* 可重复的参数，匹配具有多个部分的路由：`*` 或 `+` 结尾。
* 自定义正则：以 `:` 开头，后接正则表达式 `([^/]+)`。
:::

**路由模式vue2迁移变更**

新的 `history` 配置取代 `mode`。

`mode: 'history'` 配置已经被一个更灵活的 `history` 配置所取代。根据你使用的模式，你必须用适当的函数替换它。

* "history": `createWebHistory()`
* "hash": `createWebHashHistory()`
* "abstract": `createMemoryHistory()`

**完整的导航解析流程**

1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 `DOM` 更新。
12. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。

::: tip 路由守卫的作用
1. 权限校验（登陆验证，角色权限）
2. 数据预取（动态处理页面标题，取消未完成的请求，防止误操作离开页面）
3. 错误处理
:::

**参考链接**

[Vue Router官方文档](https://router.vuejs.org/zh/guide/)

[Vue Router博客](https://www.yuque.com/baizhe-kpbhu/xdlosh/fcmd3z)

[巧用Vue-Router路由守卫实现路由权限控制和加载进度](https://blog.csdn.net/sinat_36521655/article/details/106125910)

