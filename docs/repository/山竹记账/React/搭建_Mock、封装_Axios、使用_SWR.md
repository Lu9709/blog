# 搭建Mock、封装Axios、使用SWR
### 使用swr发送关联请求
如果第一个请求有返回值meData则继续请求下一个接口。

```typescript
import axios from 'axios'
import useSWR from 'swr'
import p from '../assets/images/pig.svg'
import add from '../assets/icons/add.svg'
export const Home: React.FC = () => {
  // url 为现实地址 + 端口号
  const { data: meData, error: meError } = useSWR('/api/v1/me', (path) => {
    return axios.get(`url${path}`)
  })
  const { data: itemsData, error: itemsError } = useSWR(meData ? '/api/v1/items' : null, (path) => {
    return axios.get(`url${path}`)
  })
  console.log(meData, meError, itemsData, itemsError)

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

### 使用第三方Mock工具
为什么要使用Mock呢？

原因如下：

1. 后台接口还没完成，但前端要用到接口
2. 或者是篡改后台接口的结果

第三方的Mock工具有[apifox](https://www.apifox.cn/)或[apipost](https://www.apipost.cn/)，但使用这些第三方的工具可能<font style="color:#E8323C;">存在风险</font>，比如第三方工具<font style="color:#E8323C;">不维护了</font>，而且第三方工具可能还要收取一定的费用，最好的方法是在自己本地Mock数据。

### 搭建Mock服务器
安装vite提供的插件[vite-plugin-mock](https://github.com/vbenjs/vite-plugin-mock)，安装命令：`pnpm install vite-plugin-mock`。

还需要在`vite.config.ts`中导入`vite-plugin-mock`的`viteMockServe`。

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Unocss from 'unocss/vite'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Unocss(),
    react()
    react(),
    viteMockServe()
  ]
})
```

然后创建文件夹`mock`，编写Mock的数据并导出。

```typescript
import type { MockMethod } from 'vite-plugin-mock'
export default [
  {
    url: '/api/v1/me',
    method: 'get',
    response: () => {
      return {
        id: 1,
        email: 'baizhe.com'
      }
    },
  },
  {
    url: '/api/v1/items',
    method: 'get',
    response: () => {
      return {
        resources: [{
          id: 1,
          user_id: 1,
          amount: 1000,
        }],
        pager: {
          page: 1,
          per_page: 25,
          count: 100
        }
      }
    },
  },
] as MockMethod[]
```

但还需要在`tsconfig.json`的`include`选项中将`mock`文件夹添加进去，然后在重启服务就可使用本地的Mock服务器了，并将代码中请求地址的url删除，详细代码见[链接](import type { MockMethod } from 'vite-plugin-mock' export default [   {     url: '/api/v1/me',     method: 'get',     response: () => {       return {         id: 1,         email: 'baizhe.com'       }     },   },   {     url: '/api/v1/items',     method: 'get',     response: () => {       return {         resources: [{           id: 1,           user_id: 1,           amount: 1000,         }],         pager: {           page: 1,           per_page: 25,           count: 100         }       }     },   }, ] as MockMethod[])。

使用`useSWR`可以发现它里面一层有`useEffect`，在初始化的时候会帮助请求。

### 开发环境和生产环境访问不同的 API 接口
在`vite.config.ts`配置`defineConfig`，使其接受参数`command`，并定义`define`来根据执行的命令来区分运行的环境，关于配置的具体内容见[链接](https://vitejs.dev/config)。

```typescript

import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  define: {
    isDev: command === 'serve'
  },
  plugins: [
    Unocss(),
    react(),
    viteMockServe()
  ]
}))
```

然后还需要在`src/global.d.ts`文件中声明关于isDev的值：`var isDev: boolean`

### 封装Axios
将axios进行二次分装，由于已经配置了`isDev`来区分开发环境和生产环境，这样就可以配置不同环境下请求不同的`baseURL`了，并配置headers头`post`的`Content-Type`为`application/json`，并配置请求超时时间。

```typescript
import axios from 'axios'
// url 为现实地址 + 端口号
axios.defaults.baseURL = isDev ? '/' : 'url'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.timeout = 10000

export const ajax = {
  get: (path: string) => {
    return axios.get(path)
  },
  post: () => {},
  patch: () => {},
  delete: () => {}
}
```

### 设置远程资源的类型
在`src/global.d.ts`内配置类型。

```typescript
var isDev: boolean
interface Resource<T> {
  resource: T
}
interface Resources<T> {
  resources: T[]
  pager: {
    page: number
    per_page: number
    count: number
  }
}
interface User {
  id: number
  email: string
  name?: string
  created_at: string
  updated_at: string
}
interface Item {
  id: number
  user_id: number
  amount: number
  note?: string
  tag_ids: number[]
  happen_at: string
  created_at: string
  updated_at: string
  kind: 'expenses' | 'incomes'
  deleted_at?: string
}
```

并修改`ajax.ts`内的请求，添加接口返回类型接受为范型，在使用接口的地方注入返回数据的类型，详细代码见[链接](https://github.com/Lu9709/mangosteen-font-react/commit/208f38053d4f7731565c5e4c3e0ac9219d095131)。

```typescript
import axios from 'axios'

axios.defaults.baseURL = isDev ? '/' : 'http://121.196.236.94:8080/api/v1'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.timeout = 10000

export const ajax = {
  get: <T>(path: string) => {
    return axios.get<T>(path)
  },
  post: () => {},
  patch: () => {},
  delete: () => {}
}
```

### 封装useTitle Hooks
```typescript
import { useEffect } from 'react'

export const useTitle = (title?: string) => {
  useEffect(() => {
    if (title === undefined || title === null)
      return
    document.title = title
  }, [])
}
```

然后在`Home.tsx`中使用这个Hooks，详细代码见[链接](https://github.com/Lu9709/mangosteen-font-react/commit/bb729ecb6fcc5b060c0df3c48526f495855731bf)。

