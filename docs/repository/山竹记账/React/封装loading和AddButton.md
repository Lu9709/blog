# 封装Loading和AddButton

### 新增三个组件
#### loading
```tsx
export const Loading: React.FC = () => {
  return <div>加载中……</div>
}
```

#### Icon
```tsx
export const Icon: React.FC = () => {
  return <div>Icon </div>
}
```

#### AddItemFloatButton
```tsx
import add from '../assets/icons/add.svg'
export const AddItemFloatButton: React.FC = () => {
  return (
    <button p-4px w-56px h-56px bg="#5C33BE" rounded="50%" b-none text-white
      text-4xl fixed bottom-16px right-16px>
      <img text-red src={add} max-w="100%" max-h="100%" />
    </button>
  )
}
```

将这三个组件用于`Home.tsx`页面，详细代码见[链接](https://github.com/Lu9709/mangosteen-font-react/commit/02c868b663773610cf094396b5db784c4e2ed581)。

### 封装Icon
Icon的处理方法有很多种如下：

1. 雪碧图
2. iconfont
3. svg sprite

其中svg sprite的原理就是通过插件将所有的svg放入一个大的svg内，然后在将这个大的svg放在`<body>`里，若是要使用则通过如下方式进行使用。

```tsx
// react 
<svg>
	<use xlinkHref='pig'></use>
</svg>
// vue
<svg>
	<use xlink:href='pig'></use>
</svg>
```

#### 引入svgsprites插件
安装`svgo`、`svgostore`，安装命令`pnpm install svgo svgostore`

创建`vite_plugins`文件夹，创建`svgsprites.ts`文件，一个中间件用于处理svg。

```tsx
import path from 'path'
import fs from 'fs'
import store from 'svgstore' // 用于制作 SVG Sprites
import { optimize } from 'svgo' // 用于优化 SVG 文件
import type { Plugin, ViteDevServer } from 'vite'

interface Options {
  id?: string
  inputFolder?: string
  inline?: boolean
}
export const svgsprites = (options: Options = {}): Plugin => {
  const virtualModuleId = `virtual:svgsprites${options.id ? `-${options.id}` : ''}`
  const resolvedVirtualModuleId = `\0${virtualModuleId}`
  const { inputFolder = 'src/assets/icons', inline = false } = options

  const generateCode = () => {
    const sprites = store(options)
    const iconsDir = path.resolve(inputFolder)
    for (const file of fs.readdirSync(iconsDir)) { // 遍历读取的icons的文件夹下的路径
      if (!file.endsWith('.svg')) // 如果文件后缀名不是 .svg 的则跳过
        continue
      const filepath = path.join(iconsDir, file) // 将svg文件的路径拼接成绝对路径
      const svgId = path.parse(file).name // 将路径地址转换为对象取得文件名
      const code = fs.readFileSync(filepath, { encoding: 'utf-8' }) // 读取文件夹的路径并转为编码utf-8
      sprites.add(svgId, code)
    }
    // 优化svg的属性内容，去除无用属性
    const { data: code } = optimize(sprites.toString({ inline }), {
      plugins: [
        'cleanupAttrs', 'removeDoctype', 'removeComments', 'removeTitle', 'removeDesc', 'removeEmptyAttrs',
        { name: 'removeAttrs', params: { attrs: '(data-name|fill)' } },
      ],
    })
    return code
  }
  // 生成或更新svg内容
  const handleFileCreationOrUpdate = (file: string, server: ViteDevServer) => {
    if (!file.includes(inputFolder))
      return
    const code = generateCode()
    server.ws.send('svgsprites:change', { code })
    const mod = server.moduleGraph.getModuleById(resolvedVirtualModuleId)
    if (!mod)
      return
    server.moduleGraph.invalidateModule(mod, undefined, Date.now())
  }

  return {
    name: 'svgsprites',
    configureServer(server) {
      server.watcher.on('add', (file) => {
        handleFileCreationOrUpdate(file, server)
      })
      server.watcher.on('change', (file) => {
        handleFileCreationOrUpdate(file, server)
      })
    },
    resolveId(id: string) {
      if (id === virtualModuleId)
        return resolvedVirtualModuleId
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        const code = generateCode()
        return `!function(){
  const div = document.createElement('div')
  div.innerHTML = \`${code}\`
  const svg = div.getElementsByTagName('svg')[0]
  const updateSvg = (svg) => {
    if (!svg) { return }
    svg.style.position = 'absolute'
    svg.style.width = 0
    svg.style.height = 0
    svg.style.overflow = 'hidden'
    svg.setAttribute("aria-hidden", "true")
  }
  const insert = () => {
    if (document.body.firstChild) {
      document.body.insertBefore(div, document.body.firstChild)
    } else {
      document.body.appendChild(div)
    }
  }
  updateSvg(svg)
  if (document.body){
    insert()
  } else {
    document.addEventListener('DOMContentLoaded', insert)
  }
  if (import.meta.hot) {
    import.meta.hot.on('svgsprites:change', (data) => {
      const code = data.code
      div.innerHTML = code
      const svg = div.getElementsByTagName('svg')[0]
      updateSvg(svg)
    })
  }
}()`
      }
    },
  }
}
```

由于是自行导入的插件，需要自行在`tsconfig.node.json`文件内将`vite_plugins`归属于配置文件。

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts", "vite_plugins"]
}
```

然后在`vite.config.ts`中导入插件。

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Unocss from 'unocss/vite'
import { viteMockServe } from 'vite-plugin-mock'
import { svgsprites } from './vite_plugins/svgsprites'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  define: {
    isDev: command === 'serve'
  },
  plugins: [
    Unocss(),
    react(),
    viteMockServe(),
    svgsprites()
  ]
}))
```

然后将其全局导入在`main.tsx`中。

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router'
import 'virtual:uno.css'
import './global.scss'
import 'virtual:svgsprites'

const div = document.getElementById('root') as HTMLElement

const root = ReactDOM.createRoot(div)
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)
```

然后在`AddItemFloatButton.tsx`中使用svg插件，详细代码见[链接](https://github.com/Lu9709/mangosteen-font-react/commit/6c3cf3fde315dff26985249c2d4b052eb3ec5e97)。

```typescript
export const AddItemFloatButton: React.FC = () => {
  return (
    <button p-4px w-56px h-56px bg="#5C33BE" rounded="50%" b-none text-white
    fixed bottom-16px right-16px>
    <svg style={{ fill: 'red', width: '1.2em', height: '1.2em' }}>
      <use xlinkHref='#menu' />
    </svg>
    </button>
  )
}
```

#### 封装Icon组件
```typescript
import c from 'classnames'
import s from './Icon.module.scss'
interface Props {
  className?: string
  name: string
}
export const Icon: React.FC<Props> = ({ name, className }) => {
  return (
    <svg className={c(className, s.icon)}>
      <use xlinkHref={`#${name}`}></use>
    </svg>
  )
}
```

添加Icon的默认样式，使用了新出的伪类，可以将属性优先级降至最低。这个伪类可能过新，会导致有些浏览器会出现问题。

```typescript
:where(.icon){
  fill: currentColor;
  width: 1.2em;
  height: 1.2em;
}
```

添加样式属性配置，详细代码见[链接](https://github.com/Lu9709/mangosteen-font-react/commit/0a57c2001e701b255e231cdba88b906c37bcd681)。

```typescript
import * as React from 'react'
declare module 'react' {
  /** 省略 **/
  interface SVGProps<T> extends SVGAttributes<T>, ClassAttributes<T> {
    w?: string
    h?: string
  }
}
```

**unocss**有`layers`可以用于调整css属性。

即将原有css样式放入layer的层级 ，即css样式放置最前，修改`uni.config.ts`文件，详细代码见[链接](https://github.com/Lu9709/mangosteen-font-react/commit/cdd636b1ec4cd670220eaf547a8f5e6152b38039)。

```tsx
import {
  defineConfig, presetAttributify, presetIcons,
  presetTypography, presetUno, transformerAttributifyJsx
} from 'unocss'

export default defineConfig({
  theme: {
  },
  shortcuts: {
  },
  safelist: [],
  preflights: [
    {
      layer: 'components',
      getCSS: () => `
        .j-icon{
          fill: currentColor;
          width: 1.2em;
          height: 1.2em;
        }
      `
    },
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      extraProperties: { 'display': 'inline-block', 'vertical-align': 'middle' },
    }),
    presetTypography(),
  ],
  transformers: [
    transformerAttributifyJsx()
  ],
})

```

返璞归真，在`main.ts`文件中将css样式文件引入修改至引入unocss样式文件之前，详细代码见[链接](https://github.com/Lu9709/mangosteen-font-react/commit/7a71852457582bde8a8ab15091474bcba47386b6)。

### 封装loading组件
在iconfont找到一个loading的的svg，然后使用styled添加动画，使其旋转。

```tsx
import styled from 'styled-components'
import c from 'classnames'
import { Icon } from './Icon'

const Div = styled.div`
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  svg {
    animation: spin 1.25s linear infinite;
  }
`

interface Props {
  className?: string
  message?: string
}

export const Loading: React.FC<Props> = ({ className, message }) => {
  return (
    <Div className={c('flex flex-col justify-center items-center', className)}>
      <Icon name="loading" className='w-128px h-128px' />
      <p p-8px text-lg>{message || '加载中……'}</p>
    </Div>
  )
}

```

然后修改mock文件中`/api/v1/me`接口的`timeout`时间，然后在文件中导入，详细代码见[链接](https://github.com/Lu9709/mangosteen-font-react/commit/4e05af761e3a1b1d3d6b82930a9be2d6c9735f64)。

