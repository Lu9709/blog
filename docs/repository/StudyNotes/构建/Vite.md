# Vite

> Vite 是一个 Vue 官方团队出品的构建工具，主要由**两部分**组成：
> 
> * 一个**开发服务器**，它基于原生的 **ES module** 提供 丰富的内建功能，如 HMR（Hot Module Replacement，模块热替换）。
> * 一套丰富的**插件生态系统**，它基于 **Rollup** 打包，用于生产环境的高度优化的静态资源。


### 命令行接口

#### vite

在当前目录下启动 Vite 开发服务器。 `vite dev` 和 `vite serve` 是 `vite` 的别名。

#### 构建

`vite build [root]` 构建生产版本。

#### 其他

`vite optimize [root]` 优化依赖项。

`vite preview [root]` 预览生产版本。

### 使用插件

#### 添加插件

创建一个 `vite.config.js` 文件，并使用 `plugins` 选项添加插件，`plugins` 也可以接受包含**多个插件**作为单个元素的预设。

例如为传统浏览器提供支持，添加 `@vitejs/plugin-legacy` 插件：

```
$ npm add -D @vitejs/plugin-legacy
```

:::code-group
```js [vite.config.js]
import legacy from '@vitejs/plugin-legacy'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
})
```
:::

#### 强制插件排序

为了与某些 Rollup 插件兼容，需要强制修改插件排序，或构建时使用。

可以使用 `enforce` 修饰符来强制插件位置：

* `pre`: 在 Vite 核心插件之前调用该插件。
* 默认: 在 Vite 核心插件之后调用该插件。
* `post`: 在 Vite 构建完成之后调用该插件。

#### 按需应用

默认情况下插件在开发和生产模式中都会调用。如果插件只在某些模式下需要，则可以使用 `apply` 属性配置为 `'build'` 或 `'serve'` 模式时调用：

:::code-group
```ts [vite.config.js]
import typescript2 from 'rollup-plugin-typescript2'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...typescript2(),
      apply: 'build',
    },
  ],
})
```
:::

#### 创建插件

支持自己创建自定义插件。

:::code-group
```js [转自定义文件类型]
const fileRegex = /\.(my-file-ext)$/

export default function myPlugin() {
  return {
    name: 'transform-file',

    transform(src, id) {
      if (fileRegex.test(id)) {
        return {
          code: compileFileToJS(src),
          map: null // 如果可行将提供 source map
        }
      }
    },
  }
}
```
:::

### 依赖预构建

默认情况下，Vite 在本地加载之前预构建了项目依赖。

#### 原因

1. **CommonJS 和 UMD 兼容性**：在开发阶段，Vite 的开发服务器将所有代码视为原生ES模块。因此 Vite 必须**先将 CommonJS 或 UMD 形式提供的依赖项转换为 ES 模块**。（Vite 会进行智能导入分析，导出为动态分配或具名导入也能正常使用） 
2. **性能**：Vite 将具有内部模块的**ESM依赖**转换为**单个模块**。

**自动依赖搜寻**：如果没有找到现有的缓存，Vite会扫描源代码，并自动寻找引入的依赖项。

**自定义行为**：可以通过**optimizeDeps**选项来配置，明确包含或排除依赖项（`include`、`exclude`）。

**缓存**：Vite会缓存已编译的模块，因此，如果模块未更改，则无需再次编译。

### 静态资源处理

**将资源引入为URL**:

* 显式URL引入
  ```js
  import imgUrl from './img.png'
  document.getElementById('hero-img').src = imgUrl
  ```
  生产构建后`/src/img.png`会变为`assets/img.2edashg.png`。

* 显式URL引入
  
  未被包含在内部列表或 `assetsInclude` 中的资源，可以使用 `?url` 后缀显式导入为一个 URL。
  
* 显式内联处理
  
  可以分别使用 `?inline` 或 `?no-inline` 后缀，明确导入带内联或不带内联的静态资源。

* 将资源引入为字符串

  资源可以使用 `?raw` 后缀声明作为字符串引入。

* 导入脚本作为Worker

  脚本可以通过 `?worker` 或 `?sharedworker` 后缀导入为 web worker。

* public 目录

  默认配置是`<root>public`，可以通过 `publicDir` 选项配置。

**new URL（url，import，meta.url）**：

`import.meta.url` 是一个 ESM 的原生功能，会暴露当前模块的 URL。

### 构建生产版本

当需要将应用部署到生产环境时，只需运行 `vite build` 命令。默认情况下，它使用 `<root>/index.html` 作为其构建入口点，并生成能够静态部署的应用程序包。

### 环境变量与模式

Vite 在特殊的 `import.meta.env` 对象下暴露了一些常量。这些常量在开发阶段被定义为**全局变量**，并在构建阶段被静态替换，以使树摇（tree-shaking）更有效。

#### 内置常量

一些内置常量在所有情况下都可用：

* `import.meta.env.MODE: {string}` 应用运行的模式。

* `import.meta.env.BASE_URL: {string}` 部署应用时的基本 URL。他由 `base` 配置项决定。

* `import.meta.env.PROD: {boolean}` 应用是否运行在生产环境（使用 `NODE_ENV='production'` 运行开发服务器或构建应用时使用 `NODE_ENV='production'` ）。

* `import.meta.env.DEV: {boolean}` 应用是否运行在开发环境 (永远与 `import.meta.env.PROD` 相反)。

* `import.meta.env.SSR: {boolean}` 应用是否运行在 server 上。

#### 环境变量

可以通过 `.env` 文件来定义环境变量, 默认情况下，Vite 会加载 `.env` 文件，但是你可以使用 `--env` 选项来指定要加载的环境变量。

环境加载优先级中，`env.production` 比通常文件的优先级较高。

```text
.env                # 所有情况下都会加载
.env.local          # 所有情况下都会加载，但会被 git 忽略
.env.[mode]         # 只在指定模式下加载
.env.[mode].local   # 只在指定模式下加载，但会被 git 忽略
```

### 构建流程

* **开发环境**：Vite 启动一个开发服务器，利用浏览器的原生 ES 模块支持，按需加载模块。Vite 通过拦截浏览器请求，将模块转换为浏览器可识别的格式。
* **生产环境**：Vite 使用 Rollup 进行打包，生成优化的静态资源。

### 参考链接

> [Vite 官方文档](https://cn.vite.dev/)