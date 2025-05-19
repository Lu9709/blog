# 如何提高webpack构建速度

1. 使用 `DllPlugin` 将**不常变化的代码提前打包**，并**复用**，如 vue、react
2. 使用 `thread-loader` 或 `HappyPack` (过时) 进行**多进程打包**
3. 处于开发环境时，在 `webpack config` 中使用 `cache` 设为 true（打包时查看缓存，若有直接使用，提高打包速度），也可以使用 `cache-loader`（仓库弃用）
4. 处于生产环境时，关闭不必要的环节，比如可以关闭 `source map`
5. 网传的 HardSourceWebpackPlugin 插件，但是官方已经不维护了，谨慎使用

[构建性能 ｜ webpack 中文文档](https://webpack.docschina.org/guides/build-performance/)


**其他知识点**

1. **Source Map**

    `source map` 是一种映射关系，将编译后的代码映射回原始代码，方便调试（本质上是一个JSON文件，如`app.js.map`）。

    ::: code-group
    ```javascript  [webpack.config.js]
    module.exports = {
      devtool: 'source-map', // 生成独立的 .map 文件
    };
    ```
    ```javascript  [vite.config.js]
    export default defineConfig({
      build: {
        sourcemap: true, // 生成 Source Map
      },
    });
    ```
    :::

webpack中 `devtool` 有以下几种配置：

* `eval` 具有最好的性能，但并不能帮助转译代码。
* `cheap-source-map` 如果能接受稍差一些的映射质量，可以使用  变体配置提高性能。
* `eval-source-map` 使用变体配置进行增量编译。

2. **thread-loader**

    `thread-loader` 是 webpack 的一个**多线程加载器**，可以将耗时的构建任务分配到多个 Node.js **子进程**中并行执行，从而提升构建性能。
