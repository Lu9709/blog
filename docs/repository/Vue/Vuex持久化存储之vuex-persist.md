# Vuex持久化存储之vuex-persist
VueX解决了多视图之间的数据共享问题。但是运用过程中状态存储并不能持久化，一旦刷新页面，数据就丢失了。

引入组件vue-persist插件，它就是为VueX持久化而生的一个插件。它将状态直接保存至cookie或localStorage内。

安装插件：

```javascript
npm install --save vuex-persist
or
yarn add vuex-persist
```

引入：

```javascript
import VuexPersistence from 'vuex-persist'
```

创建一个对象进行配置：

```javascript
const vuexLocal = new VuexPersistence({
    storage: window.localStorage
})
```

简单示例：

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)
 
const vuexLocal = new VuexPersistence({
    storage: window.localStorage
})

const store = new Vuex.Store({
  state: { ... },
  mutations: { ... },
  actions: { ... },
  plugins: [vuexLocal.plugin]
}) 
```

[详细见参考](https://www.jianshu.com/p/a4faae6a3184)

[npm官网详解](https://www.npmjs.com/package/vuex-persist)

