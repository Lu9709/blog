# 数据请求与缓存失效之SWR
### SWR原理

“SWR” 这个名字来自于`stale-while-revalidate`：一种由[HTTP RFC 5861](https://tools.ietf.org/html/rfc5861)推广的 HTTP，这种策略首先从缓存中**返回数据（过期的）**，同时发送**fetch 请求（重新验证）**，最后得到最新数据。

使用组件将会**不断地**、**自动**获得**最新数据流**，UI 也会一直保持快速响应。

[GitHub - vercel/swr: React Hooks for Data Fetching](https://github.com/vercel/swr)

[用于数据请求的 React Hooks 库 – SWR](https://swr.bootcss.com/)

### SWR基本使用
安装`swr`和`axios`，安装命令`pnpm install swr axios`，使用`useSWR`去请求数据，详细参数内容见[链接](https://swr.vercel.app/zh-CN/docs/options)。

```javascript
const { data, error, isValidating, mutate } = useSWR(key, fetcher, options)
```

#### 参数
+ `key`: 请求的唯一 `key string`（或者是 `function` / `array` / `null`） [（高级用法）](https://swr.vercel.app/docs/conditional-fetching)
+ `fetcher`:（可选）一个请求数据的 `Promise` 返回函数 [（详情）](https://swr.vercel.app/docs/data-fetching)
+ `options`:（可选）该`SWR hook`的选项对象

#### 返回值
+ `data`: 通过 `fetcher` 用给定的 `key` 获取的数据（如未完全加载，返回 `undefined`）
+ `error`: `fetcher` 抛出的错误（或者是 `undefined`）
+ `isValidating`: 是否有请求或重新验证加载
+ `mutate(data?, options?)`: 更改缓存数据的函数 [（详情）](https://swr.vercel.app/docs/mutation)

使用案例如下图所示。

```javascript
import axios from 'axios'

const fetcher = url => axios.get(url).then(res => res.data)

function App () {
  const { data, error } = useSWR('/api/data', fetcher)
  // ...
}
```

### 制作首页
导入所需要的`svg`导入至`src/assets/icons`。

```tsx
import p from '../assets/images/pig.svg'
import add from '../assets/icons/add.svg'
export const Home: React.FC = () => {
  return <>
    <div flex justify-center items-center>
      <img mt-20vh mb-20vh width="128" height="130" src={p} />
    </div>
    <div px-16px>
      <button h-48px w="100%" bg="#5C33BE" b-none text-white
        rounded-8px
      >开始记账</button>
    </div>
    <button p-4px w-56px h-56px bg="#5C33BE" rounded="50%" b-none text-white
      text-6xl fixed bottom-16px right-16px>
      <img src={add} max-w="100%" max-h="100%" />
    </button>
  </>
}
```

在`src/shims.d.ts`中添加unocss所需要的类型属性。

```typescript
import * as React from 'react'
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    flex?: boolean
    relative?: boolean
    text?: string
    grid?: boolean
    before?: string
    after?: string
    shadow?: boolean
    w?: string
    h?: string
    bg?: string
    rounded?: string
    fixed?: boolean
  }
}
```

