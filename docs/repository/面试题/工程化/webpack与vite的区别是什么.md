# webpack与vite的区别是什么?

1. 开发环境区别
   
    * `vite` 自己实现了 server，不对代码打包，充分利用浏览器对 `<script type="module">` 的支持
      > 假设 `main.js` 引入了 `vue`
      >
      > 该 server 会把 `import { createApp } from 'vue'` 改为 `import { createApp } from "/node_modules/.vite/vue.js"` 这样浏览器就知道去哪里找 `vue` 了

    * `webpack-dev-server` 常使用 `babel-loader` 基于内存打包，比 `vite` 慢很多很多很多
      > 该 server 会把 `vue` 的代码（递归地）打包进 `main.js`
      
2. 生产环境区别
    * `vite` 使用 <font style="background-color: #faf3dd">rollup</font> + <font style="background-color: #e9f3f7">esbuild</font> 来打包 JS 代码
    * <font style="background-color: #faf3dd">webpack</font> 使用 <font style="background-color: #e9f3f7">babel</font> 来打包 JS 代码，比 `esbuild` 慢很多很多很多
      > `webpack` 能使用 `esbuild` 吗？可以，你要自己配置（很麻烦）

3. 文件处理时机
   
    * `vite` 只会在你请求某个文件的时候处理该文件

    * `webpack` 会提前打包好 `main.js`，等你请求的时候直接输出打包好的 JS 给你

目前已知 vite 的缺点有：
1. 热更新常常失败，原因不清楚
2. 有些功能 rollup 不支持，需要自己写 rollup 插件
3. 不支持非现代浏览器
4. 文件处理时机

**参考链接**
[Webpack 与 Vite构建工具](https://www.cnblogs.com/crispyChicken/p/18719685)