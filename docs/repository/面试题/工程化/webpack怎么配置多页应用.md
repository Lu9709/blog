# webpack如何配置多页应用？


如下 `webpack.config.js` 配置，会生成`app.html`和`admin.html`两个页面，每个页面只包含对应的`js`文件。

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    app: './src/app.js',
    admin: './src/admin.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['app']
    }),
    new HtmlWebpackPlugin({
      filename: 'admin.html',
      chunks: ['admin']
    })
  ]
}
```

::: warning 「重复打包」的问题

假设 `app.js` 和 `admin.js` 都引入 `vue.js`，那么 `vue` 会被重复打包两次。

需要使用 `optimization.splitChunks` 将共同依赖单独打包成 `common.js` (`HtmlWebpackPlugin` 会自动引入 `common.js`)

:::

**如何支持无限多页面**


```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs')
const path = require('path')

const filenames = fs.readdirSync('./src/pages')
  .filter(file => file.endsWith('.js'))
  .map(file => file.replace(/\.js$/, ''))
  // .map(file => path.basename(file, '.js'))

const entries = filenames.reduce((pre, cur) => ({
  ...result, [cur]: `./src/pages/${cur}.js`
}), {})

const plugins = filenames.map(file => new HtmlWebpackPlugin({
  filename: `${file}.html`,
  chunks: [file]
}))

module.exports = {
  entry: {
    ...entries
  },
  plugins: [
    ...plugins
  ]
}
```