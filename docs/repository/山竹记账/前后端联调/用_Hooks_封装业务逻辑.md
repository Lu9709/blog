# 用Hooks封装业务逻辑
### 加载第一页的Tags内容
定义分页的TS类型。

```tsx
type Resources<T = any> = {
  resources: T[]
  pager: {
    page: number,
    per_page: number,
    count: number
  }
}
```

然后重构`mock.tsx`中的`mockTagIndex`方法，增加了构造分页的参数为page(页码数)、per_page(每页个数)、count(总个数)。并将`createTag`和`createPager`的两个方法合并为`createBody`。

```tsx

export const mockTagIndex: Mock = (config) => {
  const { kind, page } = config.params
  const per_page = 25
  const count = 26
  let id = 0
  const createId = () => {
    id += 1
    return id
  }
  const createPaper = (page = 1) => ({
    page, per_page, count
  })
  const createTag = (n = 1, attrs?: any) =>
    Array.from({ length: n }).map(() => ({
      id: createId(),
      name: faker.lorem.word(),
      sign: faker.internet.emoji(),
      kind: config.params.kind,
      ...attrs
    }))
  const createBody = (n = 1, attrs?: any) => ({
    resources: createTag(n),
    pager: createPaper(page)
  })
  if (kind === 'expenses' && (page === 1 || !page)) {
    return [200, createBody(25)]
  } else if (kind === 'expenses' && page === 2){
    return [200, createBody(1)]
  } else {
    return [200, createBody(20)]
  }
}
```

然后在`ItemCreate.tsx`页面请求TagIndex的参数上带上`_mock`的参数，详细内容见[链接](https://github.com/Lu9709/mangosteen-font/commit/64e7ae8397a03ef0dfe8e2b6ad0aeed22fe58fed)。

```tsx
const response = await http.get<Resources<Tag>>('/tags', {
	kind: 'income',
	_mock: 'tagIndex'
})
```

### 封装Tags
封装了Tags用于接受页面数，返回请求分页的得到的响应值，还定义了一个Fetcher的类型。

```tsx
import { AxiosResponse } from "axios"
import { onMounted, ref } from "vue"

type Fetcher = (page: number) => Promise<AxiosResponse<Resources<Tag>>>
export const useTags = (fetcher: Fetcher) => {
  const page = ref(0)
  const hasMore = ref(false)
  const tags = ref<Tag[]>([])
  const fetchTag = async () => {
    const response = await fetcher(page.value)
    const { resources, pager } = response.data
    tags.value.push(...resources)
    hasMore.value = (pager.page - 1) * pager.per_page + resources.length < pager.count
    page.value += 1
  }
  onMounted(fetchTag)
  return { page, hasMore, tags, fetchTag }
}
```

然后修改`ItemCreate.tsx`的支出和收入，使用`useTags`的Hooks方法，详细内容见[链接](https://github.com/Lu9709/mangosteen-font/commit/d3de6d7f3f05412f82e96bc943cda6ab69dda9ae)。

```tsx
const { tags: expensesTags, hasMore: expensesHasMore , fetchTag: expensesFetchTag } = useTags((page)=> {
  return http.get<Resources<Tag>>('/tags', {
    kind: 'expenses',
    page: page + 1,
    _mock: 'tagIndex'
  })
})
const { tags: incomeTags, hasMore: incomeHasMore, fetchTag: incomeFetchTag } = useTags((page)=> {
  return http.get<Resources<Tag>>('/tags', {
    kind: 'expenses',
    page: page + 1,
    _mock: 'tagIndex'
  })
})
```

### 封装useTags组件
再次封装一个`Tags.tsx`组件，用于`ItemCreate.tsx`页面，具体详细内容见[链接](https://github.com/Lu9709/mangosteen-font/commit/a5bbcb591dbb1a5a16d6f0d81f3420ae88a074b9)。

```tsx
import { defineComponent, onUpdated, PropType } from 'vue';
import { Button } from '../../shared/Button';
import { http } from '../../shared/Http';
import { Icon } from '../../shared/Icon';
import { useTags } from '../../shared/useTags';
import s from './Tags.module.scss';
export const Tags = defineComponent({
  props: {
    kind: {
      type: String as PropType<string>,
      required: true
    }
  },
  setup: (props, context) => {
    const { tags, hasMore, page, fetchTags } = useTags((page) => {
      return http.get<Resources<Tag>>('/tags', {
        kind: props.kind,
        page: page + 1,
        _mock: 'tagIndex'
      })
    })
    return () => <>
      <div class={s.tags_wrapper}>
        <div class={s.tag}>
          <div class={s.sign}>
            <Icon name="add" class={s.createTag} />
          </div>
          <div class={s.name}>
            新增
          </div>
        </div>
        {tags.value.map(tag =>
          <div class={[s.tag, s.selected]}>
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
          <Button class={s.loadMore} onClick={fetchTags}>加载更多</Button> :
          <span class={s.noMore}>没有更多</span>
        }
      </div>
    </>
  }
})
```

然后修改Tabs组件，通过选中的name来显示收入和支出的Icon。切换收入和支出的时候，只是节点隐藏。

```tsx
<div>
  {tabs.map(item => 
		<div v-show={item.props?.name === props.selected}>{item}</div>
	)}
</div>
```

其实还有一个bug，即当前在支出点击加载更多滚动到底部然后切换到收入，会发现收入页面已经滚动到底部了，要解决这个bug，可以通过计算支出滚动到高度，在切换收入时，将高度复原。

