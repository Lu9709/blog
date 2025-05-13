# Axios实践之标签请求

### 封装后退按钮
封装后退按钮，其他地方的顶部的返回`Icon`组件替换为`BackIcon`，如果路由参数带有`return_to`则跳转至`return_to`的路由，否则为返回，详细代码见[链接](https://github.com/Lu9709/mangosteen-font/commit/97092ef038401caa899eda51ced2d661584e15b0)。

```tsx
import { defineComponent, PropType } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from './Icon'
export const BackIcon = defineComponent({
  setup: (props, context) => {
    const route = useRoute()
    const router = useRouter()
    const onClick = () => {
      const { return_to } = route.query
      if (return_to) {
        router.push(return_to.toString())
      } else {
        router.back()
      }
    }
    return () => (
      <Icon name="left" onClick={onClick}/>
    )
  }
})
```

### 创建标签
修改`Tag.tsx`组件添加`RouterLink`，添加跳转路径并带上标签kind的类型`to={`/tags/create?kind=${props.kind}`}`。

还封装一个接受错误调用的函数。

```tsx
import { AxiosError } from 'axios';

export const onFormError = (
  error: AxiosError<ResourceError>,
  fn: (errors: ResourceError) => void
) => {
  if (error.response?.status === 422) {
    fn(error.response.data);
  }
  throw error;
};
```

在修改`TagForm.tsx`，接受路由跳转过来的`kind`参数，然后在调用创建标签接口。

```tsx
import { defineComponent, onMounted, PropType, reactive, toRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '../../shared/Button'
import { Form, FormItem } from '../../shared/Form'
import { http } from '../../shared/Http'
import { onFormError } from '../../shared/onFormError'
import { hasError, Rules, validate } from '../../shared/validate'
import s from './Tag.module.scss'
export const TagForm = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    onMounted(() => {
      const route = useRoute()
      console.log(route.query.kind!.toString(),'route')
    })
    const route = useRoute()
    const router = useRouter()
    const formData = reactive({
      name: '',
      sign: '',
      kind: route.query.kind!.toString()
    })
    const errors = reactive<{ [k in keyof typeof formData]?: string[] }>({})
    const rules: Rules<typeof formData> = [
      { key: 'name', type: 'required', message: '必填' },
      { key: 'name', type: 'pattern', regex: /^.{1,4}$/, message: '只能填 1 到 4 个字符' },
      { key: 'sign', type: 'required', message: '必填' },
    ]
    const onSubmit = async (e: Event) => {
      e.preventDefault()
      Object.assign(errors, {
        name: [],
        sign: []
      })
      Object.assign(errors, validate(formData, rules))
      if(!hasError(errors)) {
        const response = await http.post('/tags', formData, {
          params: { _mock: 'TagCreate' }
        }).catch((error) => {
          onFormError(error, (data) => Object.assign(errors ,data.errors) )
        })
        router.back()
      }
    }
    return () => (
      <Form onSubmit={onSubmit}>
        <FormItem label='标签名（最多 4 个字符）'
          type='text' v-model={formData.name}
          error={errors['name']?.[0]}
        />
        <FormItem label={'符号' + formData.sign}
          type='emojiSelect' v-model={formData.sign}
          error={errors['sign']?.[0]}
        />
        <FormItem>
          <p class={s.tips}>记账时长按标签即可进行编辑</p>
        </FormItem>
        <FormItem>
          <Button type="submit" class={[s.button]}>确定</Button>
        </FormItem>
      </Form>
    )
  }
})
```

详细内容见[链接](https://github.com/Lu9709/mangosteen-font/commit/c1685878594ac8c4973e90659a8ddaadf30cf7e4)。

### 长按编辑
#### 触发长按编辑
由于标签点击的时候，用户的交互可能是长按或者是长按滑动，则需要监听标签的移动事件、开始点击触发的时间和结束放开的时间。修改`Tags.tsx`组件，创建时间和当前选中的标签的Ref，使用`onTouchStart`、`onTouchEnd`、`onTouchMove`的事件来进行逻辑判断。

```tsx
import { defineComponent, PropType, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Button } from '../../shared/Button'
import { http } from '../../shared/Http'
import { Icon } from '../../shared/Icon'
import { useTags } from '../../shared/useTags'
import s from './Tags.module.scss'
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
    const timer = ref<number>()
    const currentTag = ref<HTMLDivElement>()

    const onLongPress = ()=>{
      console.log('长按')
    }
    const onTouchStart = (e: TouchEvent) => {
      currentTag.value = e.currentTarget as HTMLDivElement
      timer.value = setTimeout(()=>{
        onLongPress()
      }, 500)
    }
    const onTouchEnd = (e: TouchEvent) => {
      clearTimeout(timer.value)
    }
    const onTouchMove = (e: TouchEvent) => {
      const pointedElement = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY)
      if(currentTag.value !== pointedElement &&
         currentTag.value?.contains(pointedElement) === false){
        clearTimeout(timer.value)
      }
    }
    return () => <>
      <div class={s.tags_wrapper} onTouchmove={onTouchMove}>
        <RouterLink to={`/tags/create?kind=${props.kind}`} class={s.tag}>
          <div class={s.sign}>
            <Icon name="add" class={s.createTag} />
          </div>
          <div class={s.name}>新增</div>
        </RouterLink>
        {tags.value.map(tag =>
      <div class={[s.tag, props.selected === tag.id ? s.selected : '']}
        onClick={() => onSelect(tag)}
        onTouchstart={onTouchStart}
        onTouchend={onTouchEnd}
        >
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

#### 长按跳转编辑页面
根据`onTouchStart`事件按下的那一刻，获取当前选中的Tag的id，在`onLongPress`方法中传入，并添加跳转路由。

```tsx
const router = useRouter()
const onLongPress = (tagId: Tag['id'])=>{
	router.push(`/tags/${tagId}/edit?kind=${props.kind}&return_to=${router.currentRoute.value.fullPath}`)
}
 const onTouchStart = (e: TouchEvent, tag: Tag) => {
  currentTag.value = e.currentTarget as HTMLDivElement
  timer.value = setTimeout(()=>{
    onLongPress(tag.id)
  }, 500)
}
```

### 编辑标签
#### 添加mock
```tsx
export const mockTagEdit: Mock = config =>{
  const createTag = (attrs?: any) =>
    ({
      id: createId(),
      name: faker.lorem.word(),
      sign: faker.internet.emoji(),
      kind: 'expenses',
      ...attrs
    })
  return [200, {resource: createTag()}]
}
export const mockTagShow: Mock = config =>{
  const createTag = (attrs?: any) =>
    ({
      id: createId(),
      name: faker.lorem.word(),
      sign: faker.internet.emoji(),
      kind: 'expenses',
      ...attrs
    })
  return [200, {resource: createTag()}]
}
```

在`http.tsx`拦截器内添加`mockTagShow`的mock选项。

```tsx
const mock = (response: AxiosResponse) => {
  // 还可以把线上地址先上去
  if (location.hostname !== 'localhost'
    && location.hostname !== '127.0.0.1'
    ) { return false }
  switch (response.config?.params?._mock) {
    case 'tagIndex': 
      [response.status, response.data] = mockTagIndex(response.config)
      return true
    case 'session':
      [response.status, response.data] = mockSession(response.config)
      return true
    case 'itemCreate':
      [response.status, response.data] = mockItemCreate(response.config)
      return true
    case 'tagShow': 
      [response.status, response.data] = mockTagShow(response.config)
      return true
   case 'tagEdit':
      [response.status, response.data] = mockTagEdit(response.config)
      return true
  }
  return false
}
```

#### 修改TagEdit页面
然后修改`TagEdit.tsx`页面的内容，获取页面路由上的`params`中的`tag.id`值，然后将`tag.id`的值传递给`TagForm.tsx`组件。

```tsx
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { MainLayout } from '../../layouts/MainLayout'
import { BackIcon } from '../../shared/BackIcon'
import { Button } from '../../shared/Button'

import s from './Tag.module.scss'
import { TagForm } from './TagForm'
export const TagEdit = defineComponent({
  setup: (props, context) => {
    const route = useRoute()
    const numberId = parseInt(route.params.id!.toString())
    if (Number.isNaN(numberId)) {
      return () => <div>id 不存在</div>
    }
    return () => (
      <MainLayout>{{
        title: () => '编辑标签',
        icon: () => <BackIcon />,
        default: () => <>
          <TagForm id={numberId}/>
          <div class={s.actions}>
            <Button level='danger' class={s.removeTags} onClick={() => { }}>删除标签</Button>
            <Button level='danger' class={s.removeTagsAndItems} onClick={() => { }}>删除标签和记账</Button>
          </div>
        </>
      }}</MainLayout>
    )
  }
})
```

#### 修改TagForm.tsx组件
然后在去修改`TagForm.tsx`组件中内容，添加一个`props`用于传递`Tag`的`id`值，如果存在说明是要修改标签的内容信息，则在`onMounted`的时候调用接口获取这个`tag`的详细内容，具体详细代码见[链接](https://github.com/Lu9709/mangosteen-font/commit/6efd50855e1d3e3e238aef4ab0a5b61589cceb05)。

```tsx
// 初始化时候
onMounted(async () => {
	if(!props.id) { return }
	const response = await http.get<Resource<Tag>>(`/tags/${props.id}`, {
    _mock: 'tagShow'
  })
	Object.assign(formData,response.data.resource)
})
// 提交表单的时候
const onSubmit = async (e: Event) => {
  e.preventDefault()
  Object.assign(errors, {
    name: [],
    sign: []
  })
  Object.assign(errors, validate(formData, rules))
  if(!hasError(errors)) {
    const promise = await formData.id ?
    http.patch(`/tags/${formData.id}`, formData, {
      params: { _mock: 'tagEdit' }
    }) : 
    http.post('/tags', formData, {
      params: { _mock: 'tagCreate'}
    })
    await promise.catch((error) => {
      onFormError(error, (data) => Object.assign(errors ,data.errors) )
    })
    router.back()
  }
}
```

### 删除标签
在`TagEdit.tsx`中添加`vant`的`Dialog`弹窗，并导入其样式，将删除标签和删除标签数据根据`withItem`来进行判断，调用删除接口，后端接口可能还需要调整根据`withItems`参数来删除数据库中的数据，详细内容见[链接](https://github.com/Lu9709/mangosteen-font/commit/3f117e43c3b1d6497fd262eb79db0dfb92df8b35)。

```tsx
const onError = () => {
	Dialog.alert({ title:'提示',message:'删除失败' })
}
const onDelete = async (options?: { withItems?: boolean }) => {
  await Dialog.confirm({
    title:'确认',
    message:'你真的要删除吗？'
  })
  await http.delete('/tags', {
    withItems: options?.withItems ? 'true' : 'false'
  }).catch(onError)
  router.back()
}
```

