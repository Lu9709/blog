# 自制纯前端Mock系统
### 手动封装一个Mock
前端项目切换端口：`pnpm run dev --port=3001`

安装[@faker-js/faker](https://www.npmjs.com/package/@faker-js/faker)：`pnpm install --save-dev @faker-js/faker`，用于构造假数据。

重构`Http.tsx`文件，并将JSONValue的定义添加至`env.d.ts`，将所有请求类型的config都类型都写在了外面。并设计了一个mock函数，如果是线上地址、本地地址就使用mock的内容，且在请求的时候带上了`_mock`参数，用于区分是那个接口的内容。

```tsx
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { mockSession } from "../mock/mock";

type GetConfig = Omit<AxiosRequestConfig, 'url' | 'params' | 'method'>
type PostConfig = Omit<AxiosRequestConfig, 'url' |'data' | 'method'>
type PatchConfig = Omit<AxiosRequestConfig, 'url' | 'data'>
type DeleteConfig = Omit<AxiosRequestConfig, 'params'>

export class Http {
  instance: AxiosInstance
  constructor(baseURL: string) {
    this.instance = axios.create({ baseURL })
  }
  // read
  get<R = unknown>(url: string, query?: Record<string, string>, config?: GetConfig) {
    return this.instance.request<R>({ ...config, url: url, params: query, method: 'get' })
  }
  // create
  post<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: PostConfig) {
    return this.instance.request<R>({ ...config, url: url, data, method: 'post' })
  }
  // update
  patch<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: PatchConfig) {
    return this.instance.request<R>({ ...config, url: url, data, method: 'patch' })
  }
  // destroy
  delete<R = unknown>(url: string, query?: Record<string, JSONValue>, config?: DeleteConfig) {
    return this.instance.request<R>({ ...config, url: url, params: query, method: 'delete' })
  }
  // CRUD
  // create, read, update, delete
}
const mock = (response: AxiosResponse) => {
  // 还可以把线上地址先上去
  if (location.hostname !== 'localhost'
    && location.hostname !== '127.0.0.1'
    ) { return false }
  debugger
  switch (response.config?.params?._mock) {
    case 'session':
      [response.status, response.data] = mockSession(response.config)
      return true
  }
  return false
}
export const http = new Http('api/v1')

http.instance.interceptors.request.use(config => {
  const jwt = localStorage.getItem('jwt')
  if (jwt) {
    config.headers!.Authorization = `Bearer ${jwt}`
  }
  return config
})

http.instance.interceptors.response.use((response)=> {
  mock(response)
  return response
}, (error) => {
  if (mock(error.response)) {
    return error.response
  } else {
    throw error
  }
})

http.instance.interceptors.response.use(
  response => response,
  error => {
  if(error.response) {
    const axiosError = error as AxiosError
    if(axiosError.response?.status === 429) {
      alert('你太频繁了')
    }
  }
  throw error
})
```

session的Mock返回内容

```tsx
import { faker } from '@faker-js/faker'
import { AxiosRequestConfig } from 'axios';

type Mock = (config: AxiosRequestConfig) => [number, any]

faker.setLocale('zh_CN');

export const mockSession: Mock = (config) =>{
  return [200, {
    jwt: faker.random.word()
  }]
}
```

修改`sign_in`页面的登录提交的接口内容，带上`_mock`的内容。

```tsx
const onSubmit = async (e: Event) => {
      e.preventDefault()
      Object.assign(errors, {
        email: [], code: []
      })
      Object.assign(errors, validate(formData, [
        { key: 'email', type: 'required', message: '必填' },
        { key: 'email', type: 'pattern', regex: /^\w+@[a-z0-9]+\.[a-z]{2,4}$/, message: '必须是邮箱地址' },
        { key: 'code', type: 'required', message: '必填' },
        { key: 'code', type: 'pattern' , regex: /^\d{6}$/, message: '必须是六位数字'}
      ]))
      if(!hasError(errors)){
        const response = await http.post<{ jwt: string }>('/session',formData,{ 
          params: { _mock: 'session' }
        }).catch(onError)
        console.log(response)
        localStorage.setItem('jwt', response.data.jwt)
        // 两种写法
        // 1. 跳转的时候拿到存在localStorage的returnTo用于跳转
        // const returnTo = localStorage.getItem('returnTo')
        // 2. 拿去路由内的参数用于return_to跳转
        // 只需要其他地方使用 router.push('/sign_in?return_to='+ encodeURIComponent(route.fullPath))
        const returnTo = route.query.return_to?.toString()
        refreshMe()
        router.push(returnTo ||  '/')
      }
    }
```

然后在`sign_in`页面随便输入验证码然后登录，可以发现实际请求的接口返回的状态码是422，但是使用mock函数返回自己模拟的参数。

![](https://cdn.nlark.com/yuque/0/2022/png/2749296/1663598397690-182f424e-272f-4338-ab18-05c4e826dcc5.png)

### 完成Tag列表Mock
#### 全局声明Tag类型
在`env.d.ts`内声明Tag的类型。

```tsx
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

type JSONValue =  string | number | null | boolean | JSONValue[] | Record<string, JSONValue>;

type Tag = {
  id: number,
  user_id: number,
  name: string,
  sign: string,
  kind: expenses | income
}

```

#### 创建mockTagIndex的mock接口
```tsx
import { faker } from '@faker-js/faker'
import { AxiosRequestConfig } from 'axios';

type Mock = (config: AxiosRequestConfig) => [number, any]

faker.setLocale('zh_CN');

export const mockTagIndex: Mock = (config) => {
  let id = 0
  const createId = () => {
    id += 1
    return id
  }
  const createTag = (n = 1, attrs?: any) =>
    Array.from({ length: n }).map(() => ({
      id: createId(),
      name: faker.lorem.word(),
      sign: faker.internet.emoji(),
      kind: config.params.kind,
      ...attrs
    }))
    
  if (config.params.kind === 'expenses') {
    return [200, { resources: createTag(7) }]
  } else {
    return [200, { resources: createTag(20) }]
  }

}
```

#### 修改http.tsx
修改`http.tsx`的根据`_mock`的键值返回`tagIndex`的返回值。

```tsx
const mock = (response: AxiosResponse) => {
  // 还可以把线上地址先上去
  if (location.hostname !== 'localhost'
    && location.hostname !== '127.0.0.1'
    ) { return false }
  switch (response.config?.params?._mock) {
    case 'tagIndex': 
      [response.status, response.data] = mockTagIndex(response.config)
      console.log(response)
      return true
    case 'session':
      [response.status, response.data] = mockSession(response.config)
      return true
  }
  return false
}
```

#### 页面调试
在`ItemCreate`页面，初始化的时候调用获取Tag列表的接口。

```tsx
import { defineComponent, onMounted, PropType, ref } from 'vue'
import { MainLayout } from '../../layouts/MainLayout'
import { http } from '../../shared/Http'
import { Icon } from '../../shared/Icon'
import { Tab, Tabs } from '../../shared/Tabs'
import { InputPad } from './InputPad'
import s from './ItemCreate.module.scss'
export const itemCreate = defineComponent({
  props: {},
  setup: (props, context) => {
    const refKind = ref('支出')
    const refExpensesTags = ref<Tag[]>([])
    const refIncomeTags = ref<Tag[]>([])
    onMounted(async () => {
      const response = await http.get<{ resources: Tag[] }>('/tags', {
        kind: 'expenses',
        _mock: 'tagIndex'
      })
      refExpensesTags.value = response.data.resources
    })
    onMounted(async () => {
      const response = await http.get<{ resources: Tag[] }>('/tags', {
        kind: 'income',
        _mock: 'tagIndex'
      })
      refIncomeTags.value = response.data.resources
    })
    return () => (
      <MainLayout>{{
        title: () => '记一笔',
        icon: () => <Icon name='left' class={s.navIcon}/>,
        default: () => <>
          <div class={s.wrapper}>
            {/* <Tabs selected={refKind.value} onUpdateSelected={name => refKind.value = name }> */}
            <Tabs v-model:selected={refKind.value} class={s.tabs}>
              <Tab name="支出" class={s.tags_wrapper}>
                <div class={s.tag}>
                  <div class={s.sign}>
                    <Icon name="add" class={s.createTag} />
                  </div>
                  <div class={s.name}>
                    新增
                  </div>
                </div>
                {refExpensesTags.value.map(tag =>
                  <div class={[s.tag, s.selected]}>
                    <div class={s.sign}>
                      {tag.sign}
                    </div>
                    <div class={s.name}>
                      {tag.name}
                    </div>
                  </div>
                )}
              </Tab>
              <Tab name="收入" class={s.tags_wrapper}>
                <div class={s.tag}>
                  <div class={s.sign}>
                    <Icon name="add" class={s.createTag} />
                  </div>
                  <div class={s.name}>
                    新增
                  </div>
                </div>
                {refIncomeTags.value.map(tag =>
                  <div class={[s.tag, s.selected]}>
                    <div class={s.sign}>
                      {tag.sign}
                    </div>
                    <div class={s.name}>
                      {tag.name}
                    </div>
                  </div>
                )}
              </Tab>
            </Tabs>
            <div class={s.inputPad_wrapper}>
              <InputPad />
            </div>
        </div>
        </>
      }}</MainLayout>
    )
  }
})
```

详细代码参考可见[链接](https://github.com/Lu9709/mangosteen-font/commit/9e4eb82669371970f36b74b6c1216dc2f4fe5f0c)。

