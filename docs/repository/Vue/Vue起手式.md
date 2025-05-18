# Vue起手式
### @Vue/cli用法
+  全局安装yarn global add @vue/cli 
+  创建目录vue create 路径 
+  选择配置 
+  进入目录，运行yarn serve开启webpack-dev serve 
+  CRM官网 

### Vue完整版 vs. Vue非完整版
| | Vue完整版 | Vue非完整版 |
| --- | --- | --- |
| 特点 | 有compiler | 没有compiler |
| 视图 | 写在HTML内或template模板内 | 写在render函数里用h来创建标签 |
| CDN导入 | vue.js | vue.runtime.js |
| webpack导入 | 需要配置alias | 默认使用此版 |
| @vue/cli引入 | 需要额外配置 | 默认使用此版 |


CDN导入时，两个版本的文件名不同，生成环境的后缀名为.min.js。

两个版本之间相差了个compiler(编译器)，推荐使用非完整版，然后配合webpack的vue-loader和vue文件。这样的好处是：

+ 提升用户体验，减小JS文件体积，使用非完整版，只支持h函数
+ 提升开发体验，直接在vue文件里写HTML标签，不写h函数
+ vue-loader会去处理HTMl标签转为h函数

### template 和 render
+ template  
如果你需要在客户端编译模板 (比如传入一个字符串给 template 选项，或挂载到一个元素上并以其 DOM 内部的 HTML 作为模板)，就将需要加上编译器，即完整版。

```plain
// 需要编译器
new Vue({
  template: '<div>{{ hi }}</div>'
})
```

+ render  
当使用 vue-loader 或 vueify 的时候，*.vue 文件内部的模板会在构建时预编译成 JavaScript。你在最终打好的包里实际上是不需要编译器的，所以只用运行时版本即可。

```plain
// 不需要编译器
new Vue({
  render (h) {
    return h('div', this.hi)
  }
})
```

### 使用codesandbox.io在线创建Vue项目
可以登录，创建vue项目，登录后只能创建50个项目，不登录可以创建无数个。并且用户也可以在该网站下载代码。

### SEO友好
搜索引擎不停curl网页，根据curl命令结果猜测页面内容，如果页面都是用JS创建div的，则获取不到内容。内容搜索引擎优化，将一些内容(title,description,keyword,h1,a)先写好。

