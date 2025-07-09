## 基本安装

创建一个目录，初始化`npm`，然后在本地安装`webpack`和`webpack-cli`

```bash
npm init -y
npm install webpack webpack-cli --save-dev
```
若要调用本地目录下的`webpack`

```text
./node_modules/.bin/webpack --version
// 或用npx webpack 自动查找 但不够稳定
```
## 模式

通过设置`mode`参数来启用相应模式下的`webpack`内置的优化

* `development` 开发者用里面有注释
* `production` 一般用于产品发布

## 输出(output)

`output` 属性告诉 `webpack` 在哪里输出它所创建的 `bundles`，以及如何命名这些文件，默认值为 `./dist`

## 入口(entry)

入口起点`(entry point)`指示 `webpack` 应该使用哪个模块，来作为构建其内部依赖图的开始。进入入口起点后，`webpack` 会找出有哪些模块和库是入口起点（直接和间接）依赖的。

```js
const path = require('path');

module.exports = {
  mode:'development', //production
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```
## 文件名中hash的用途

用途：

* 便于添加缓存
* 便于跟新

方法：

在HTTP响应头中的`Cache-Control`通用消息头字段，被用于在http请求和响应中，通过指定指令来实现缓存机制。缓存指令是单向的，这意味着在请求中设置的指令，不一定被包含在响应中。

`Cache-Control: max-age=<seconds>`可以设置缓存的时间

但`index.html`不能缓存，如果首页缓存了就不会更新`css，js`等。

```js
const path = require('path');

module.exports = {
  mode:'development',
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  }
};
```
## 生成HTML

安装`html-webpack-plugin`插件

```bash
npm install --save-dev html-webpack-plugin
```
配置`webpack.config.js`

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode:'development',
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash].js',
  },
  plugins: [new HtmlWebpackPlugin()],
};

```
`template`可以指定生成的`html`使用模板的`title`，在模板的`title`内修改为`<%= htmlWebpackPlugin.options.title %>`

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode:'development',
  entry: './src/index.js',
  output: {
    filename: 'index.[contenthash].js',
  },
  plugins: [new HtmlWebpackPlugin({
    title: 'My App',
    template: 'src/assets/admin.html'
  })],
};
```
## 生成CSS

使用`css-loader`、`style-loader`，安装命令。

```bash
npm install --save-dev css-loader style-loader
```
配置`webpack.config.js`

```js
module: {
  rules: [
    {
      test: /\.css$/i,
      use: ["style-loader", "css-loader"],
    },
  ],
},
```
如果发现`.css`文件结尾的文件，`style-loader`把`css`字符串转为`style`标签放到`header`，c`ss-loader`把`css`转化为`JS`，将`css`抽成了`JS`。

使用`MiniCSSextactPlugins`把`CSS`抽成文件,  在`html`内`link src='xx.js'`。

安装命令如下：

```bash
npm install --save-dev mini-css-extract-plugin
```
配置`webpack.config.js`

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/public/path/to/',
            },
          },
          'css-loader',
        ],
      },
    ],
  },
};
Function
```
## 拆分webpack.config

生产环境和开发环境分成两个`webpack.config`，并改变`mode`

* 生产mode

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'index.[contenthash].js',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'My App',
      template: 'src/assets/admin.html'
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/public/path/to/',
            },
          },
          'css-loader',
        ],
      },
    ],
  },
};
```
* 开发development

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'index.[contenthash].js',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'My App',
      template: 'src/assets/admin.html'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader','css-loader']
      },
    ],
  },
};
```
 并在`package`里修改。

```json
{
  "name": "webpack",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "rm -rf dist && webpack --config webpack.config.prod.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack-dev-server"
  },
```
或者把两个文件拆开来(继承的思想)创建一个`webpack.config.base.js`

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.[contenthash].js',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'My App',
      template: 'src/assets/admin.html'
    }),
  ],
  module: {
    rules: [],
  },
};
```
`webpack.config.js`

```js
const base = require('./webpack.config.base')
module.exports = {
  ...base,
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader','css-loader']
      },
    ],
  },
};
```
`webpack.config.pro.js`

```js
const base = require('./webpack.config.base')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  mode: 'production',
  ...base,
  plugins: [
    ...base.plugins,
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/public/path/to/',
            },
          },
          'css-loader',
        ],
      },
    ],
  },
};
```
## 引入SCSS

`node-sass`已经过时，使用`dart-sass`

安装

```bash
npm install sass-loader sass webpack --save-dev
```
`webpack.config.base.js`

```js
module: {
  rules: [
    {
      test: /\.s[ac]ss$/i,
      use: [
        "style-loader",
        "css-loader",
        {
          loader: "sass-loader",
          options: {
            // Prefer `dart-sass`
            implementation: require("dart-sass"),
          },
        },
      ],
    },
  ]
},
```
## 引入Less

安装命令：

```bash
npm install less less-loader --save-dev
```
`webpack.config.base.js`内配置如下所示。

```js
module: {
  rules: [
    {
      test: /\.less$/i,
      use: [
        {
          loader: "style-loader",
        },
        {
          loader: "css-loader",
        },
        {
          loader: "less-loader",
          options: {
            lessOptions: {
              strictMath: true,
            },
          },
        },
      ],
    },

```
## 引入Stylus

安装命令：

```bash
npm install --save-dev stylus stylus-loader
```
`webpack.config.base.js`

```js
{
  test: /\.styl(us)?$/,
    loader:'style-loader!css-loader!stylus-loader'
},
```
## 引入图片

安装

```bash
npm install file-loader --save-dev
```

```js
{
  test: /\.(png|jpe?g|gif)$/i,
    use: [
    {
      loader: 'file-loader',
    },
  ],
},
```
`index.js`

```js
import photo from "./assets/1.jpg" // photo的路径
const div = document.createElement('test')
div.innerHTML=`<img src="${photo}" alt="空">`
const app = document.querySelector('#app')
app.appendChild(div)
```
## 懒加载

`x.js`

```js
export default function (){
  console.log("I am Lazy")
}
```
`index.js`

```js
const app = document.querySelector('#app')
const button = document.createElement('button')
button.innerText = '懒加载'
app.appendChild(button)
button.onclick = () => {
  const promise = import('./x')
  promise.then((module) => {
    const fn = module.default
    fn()}, () => {
    console.log('error')
  })
```
## 使用webpack-dev-server

安装命令：

```bash
npm install --save-dev webpack-dev-server
```
配置`webpack.config.js`内添加

```js
module.exports = {
  devServer: {
    contentBase: './dist',
  }
}
```
在`package.json`内的`"scripts"`内添加快捷键

```js
"start": "webpack-dev-server ",
```
# 创建快捷键

每次打包时删除`dist`内的文件可以在`package.json`内`script`内部写`"build":"rm -rf &&  webpack"`

下次使用直接`yarn build/npm run build`

```json
{
  "name": "webpack",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "rm -rf dist && webpack",
    "test": "echo \"Error: no test specified\" && exit 1"
	}
}
```
## loader与plugins的区别

**loader加载器(单一)用于load文件**

本质上，`webpack loader` 将所有类型的文件，转换为应用程序的依赖图（和最终的 `bundle`）可以直接引用的模块。

* `test`用于标识应该被对应的`loader`进行转换成的某个或某些文件
* `use` 进行转换时，使用那个`loader`

**plugins(插件)执行范围更广的任务，多样，功能大**

* 需要先`require()`它
* 可以选项`(option)`自定义
* 把它添加到`plugins`数组中
* 需要`new`创建一个实例
