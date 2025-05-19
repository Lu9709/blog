# 常见loader和plugin有哪些？两者的区别是什么？


### 常见loader

1. `babel-loader`：把JS/TS变成JS（将ES6语法转换为ES5语法）
2. `ts-loader`：把TS变成JS，**并提示类型错误**
3. `markdown-loader`：把markdown变成html
4. `html-loader`：把html变成js字符串
5. `sass-loader`：把sass/scss变成css
6. `css-loader`：把CSS变成JS字符串
7. `style-loader`：把js字符串变成style标签
8. `postcss-loader`：把CSS成更优化的CSS
9. `vue-loader`：把单文件组件（SFC）变成JS模块
    > `.vue` 文件拆解为模板（Template）、脚本（Script）和样式（Style）三部分，并分别交给对应的 Webpack Loader 处理
    > * template -> js渲染函数
    > * script -> 通过 Babel 转译
    > * style -> css
10. `file-loader`：处理静态资源文件，引用文件路径
11. `url-loader`：可以将小文件转换为base64的url
12. `thread-loader`：用于多进程打包


`sass-loader`、`css-loader`、`style-loader` 一般一起使用。

参考链接：[webpack-loader文档](https://webpack.js.org/loaders/)

### 常见plugin

1. `html-webpack-plugin`：用于创建HTML页面并自动引入JS和CSS
2. `clean-webpack-plugin`：用于清除之前打包的残余文件（`rm -rf dist`也可以实现）
3. `mini-css-extract-plugin`：用于将JS中的CSS抽离成单独的CSS文件
4. `SplitChunksPlugin`：用于代码分包（Code Split）
5. `DllPlugin` + `DllReferencePlugin`：用于避免大依赖被频繁重新打包，大幅降低打包时间

    > 参考链接：[webpack使用-详解DllPlugin](https://webpack.js.org/plugins/)

6. `eslint-webpack-plugin`：用于在打包时检查代码中的错误
7. `DefinePlugin`：用于在 webpack config 里定义全局变量
8. `copy-webpack-plugin`：用于拷贝静态文件到dist
9. `TerserPlugin`：用于压缩JS代码


### 两者的区别

* `loader` 是文件加载器
  * 功能：能够对文件进行编译、优化、混淆、压缩等处理，比如 `babel-loader` / `vue-loader`
  * 运行时机：在创建最终产物之前运行
* `plugin` 是webpack的插件
  * 功能：能够实现更多功能，比如定义全局变量、Code Split、加速编译等
  * 运行时机：在整个打包过程（以及前后）都能运行
  

> webpack-bundle-analyzer 插件可以用于分析打包后的文件大小和依赖关系