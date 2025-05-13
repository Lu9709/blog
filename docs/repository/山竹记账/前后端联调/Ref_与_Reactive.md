# Ref与Reactive

### 使用Ref
一般`ref`用于简单的值，`reactive`用于复杂对象。其实两者都一样都是被代理挟持了。

#### 修改Time构造方法
修改`src/shared/time.tsx`的构造方法，使其能够兼容`string`和`Date`类型。

```tsx
export class Time {
  date: Date;
  constructor(date?: string | Date) {
    if (date === undefined) {
      this.date = new Date();
    } else if (typeof date === 'string') {
      this.date = new Date(date);
    } else {
      this.date = date
    }
  }
  // ......
}
```

#### 修改Tags添加选中
添加`emits: ['update:selected']`，创建`onSelect`方法向外传递选择的值，并匹配选中的tags的id和props传进来的id是否一致，并添加样式。

```tsx
// *** import
export const Tags = defineComponent({
  props: {
    kind: {
      type: String as PropType<string>,
      required: true
    },
    selected: Number
  },
  emits: ['update:selected'],
  setup: (props, context) => {
    const { tags, hasMore, page, fetchTag } = useTags((page)=> {
      return http.get<Resources<Tag>>('/tags', {
        kind: props.kind,
        page: page + 1,
        _mock: 'tagIndex'
      })
    })
    const onSelect = (tag: Tag) => {
      context.emit('update:selected', tag.id)
    }
    return () => <>
      <div class={s.tags_wrapper}>
        <div class={s.tag}>
          <div class={s.sign}>
            <Icon name="add" class={s.createTag} />
          </div>
          <div class={s.name}>新增</div>
        </div>
        {tags.value.map(tag =>
           <div class={[s.tag, props.selected === tag.id ? s.selected : '']}
            onClick={() => onSelect(tag)}>
            <div class={s.sign}>
              {tag.sign}
            </div>
            <div class={s.name}>
              {tag.name}
            </div>
          </div>
        )}
      </div>
      <div class={s.more}>
        {hasMore.value ?
          <Button class={s.loadMore} onClick={fetchTag}>加载更多</Button> :
          <span class={s.noMore}>没有更多</span>
        }
      </div>
    </>
  }
})
```

#### 修改InputPad
修改`InputPad.tsx`添加props属性`happenAt`、`amount`，还需要创建`refAmount`的值用于初始化props传进来的`amount`值。

由于还要将`happenAt`和`amount`的值传递给父组件，于是在`setDate`的方法中添加`context.emit('update:happenAt',date.toISOString());`将时间传递出去，并在提交的按钮的`onClick`方法中添加`context.emit('update:amount', parseFloat(refAmount.value) * 100)`。

#### ItemCreate收集值
创建`refTagId`、`refHappenAt`、`refAmount`用于收集组件的值，如下实例代码所示。

```tsx
// 创建
const refTagId = ref<number>()
const refHappenAt = ref<string>(new Date().toISOString())
const refAmount = ref<number>(0)
// 组件中使用
<Tags kind='expenses' v-model:selected={refTagId.value}/>
<InputPad v-model:happenAt={refHappenAt.value} v-model:amount={refAmount.value} />
```

#### 关于JS精度的问题
关于amount的类型由于要取到小数点后两位则使用了`parseFloat`在去整除，其实这是考虑到了JS精度的问题，具体内容可下方链接。

[JavaScript 中精度问题以及解决方案 | 菜鸟教程](https://www.runoob.com/w3cnote/js-precision-problem-and-solution.html)

本章节的详细代码见[链接](https://github.com/Lu9709/mangosteen-font/commit/9c3ca610c4ca2b17a4dd8b23b2eb39b11c0686c5)。

### 使用Reactive
#### 添加全局类型
```tsx
type Item = {
  id: number
  user_id: number
  amount: number
  tags_id: number[]
  happen_at: string
  kind: expenses | income
}


type Resource<T> = {
  resource: T
}

type ResourceError = {
  errors: Record<string, string[]>
}
```

#### 添加mock
```tsx
export const mockItemCreate: Mock = config => {
  return [200, {
    resource: {
      "id": 2264,
      "user_id": 1312,
      "amount": 9900,
      "note": null,
      "tags_id": [3508],
      "happen_at": "2020-10-29T16:00:00.000Z",
      "created_at": "2022-07-03T15:35:56.301Z",
      "updated_at": "2022-07-03T15:35:56.301Z",
      "kind": "expenses"
    }
  }]
}
```

#### 修改http响应拦截器
修改mock的http响应拦截器根据`status`值判断是否是返回成功。

```tsx
http.instance.interceptors.response.use((response)=> {
  mock(response)
  if(response.status >= 400) {
    throw { response }
  } else {
    return response
  }
}, (error) => {
  mock(error.response)
  if (error.response.status >= 400) {
    throw error
  } else {
    return error.response
  }
})
```

#### 修改ItemCreate中Ref为Reactive
调用定义的mock接口，并添加捕获错误的方法`onError`，并使用Vant的Dialog组件弹出报错。

```tsx
// import ***
export const itemCreate = defineComponent({
  props: {},
  setup: (props, context) => {
    const formData = reactive({
      kind: '支出',
      tags_id: [],
      amount: 0,
      happen_at: new Date().toISOString()
    })
    const router = useRouter()
    const onError = (error: AxiosError<ResourceError>) => {
      if (error.response?.status === 422) {
        Dialog.alert({
          title: '出错',
          message: Object.values(error.response.data.errors).join('\n')
        })
        throw error
      }
    }
    const onSubmit = async () => {
      await http.post<Resource<Item>>('/items', formData, { params: { _mock: 'itemCreate' } }
      ).catch(onError)
      router.push('/items')
    }
    return () => (
      <MainLayout>{{
        title: () => '记一笔',
        icon: () => <Icon name='left' class={s.navIcon}/>,
        default: () => <>
          <div class={s.wrapper}>
            {/* <Tabs selected={refKind.value} onUpdateSelected={name => refKind.value = name }> */}
            <Tabs v-model:selected={formData.kind} class={s.tabs}>
              <Tab name='支出'>
                <Tags kind='expenses' v-model:selected={formData.tags_id[0]}/>
              </Tab>
              <Tab name="收入" class={s.tags_wrapper}>
                <Tags kind='income' v-model:selected={formData.tags_id[0]}/>
              </Tab>
            </Tabs>
            <div class={s.inputPad_wrapper}>
              <InputPad 
                v-model:happenAt={formData.happen_at}
                v-model:amount={formData.amount}
                onSubmit={onSubmit} />
            </div>
        </div>
        </>
      }}</MainLayout>
    )
  }
})
```

### 使用prettier
安装`prettier`：`pnpm install prettier`

创建`prettier.json`可配置`prettier`的格式化配置项。

例如配置单引号，详细配置项内容见[官方文档](https://prettier.io/docs/en/configuration.html)。

```tsx
{
  "singleQuote": true
}
```

