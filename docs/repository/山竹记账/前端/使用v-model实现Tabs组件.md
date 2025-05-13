# 使用v-model实现Tabs组件
### 新增item相关路由
给StartPage页面的开始记账和添加按钮添加路由，详细内容具体见[链接](https://github.com/Lu9709/mangosteen-font/commit/0f5eead7bd3c9c00190935c7ad6aa3098eef6649)。

### 制作MainLayout组件
设置navbar和中间内容的布局组件，详细内容具体见[链接](https://github.com/Lu9709/mangosteen-font/commit/21b1cd913240c58502ab9f1837e9e7cb222b14a8)。

### 创建记一笔的页面
创建记一笔的页面，详细内容具体见[链接](https://github.com/Lu9709/mangosteen-font/commit/f46f91af7c8e96e062b9b67e72c1fff2e7d4fff5)。

### 实现Tabs组件
父子组件之间通信一般通过`props`和`$emit`来实现，默认情况下`v-model`在组件都是使用`modelValue`作为prop，并以`update:modelValue`作为对应的事件。但Vue3现在可以通过`v-model`指定一个参数来更改这些名字，具体详细资料可见[Vue3官网v-model的参数](https://cn.vuejs.org/guide/components/events.html#usage-with-v-model)。如下所示，可以通过props实现通信，也可以通过`v-model`指定参数来实现。

```tsx
import { defineComponent, PropType } from 'vue'
import s from './Tabs.module.scss'
export const Tabs = defineComponent({
  props: {
    selected: {
      type: String as PropType<string>
    },
    onUpdateSelected: {
      type: Function as PropType<(name: string) => void>,
      required: false
    }
  },
  setup: (props, context) => {
    return () => {
      const tabs = context.slots.default?.()
      if (!tabs) return () => null
      // 如果tabs默认值没有的话则是undefined，则返回null
      for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].type !== Tab) {
        // 判断Tabs里面的子集是否为Tab组件
          return new Error('<Tabs> only accepts <Tab> as children')
        }
      }
      return <div class={s.tabs}>
        <ol class={s.tabs_nav}>
          {
            tabs.map(item =>
              <li class={item.props?.name === props.selected ? s.selected : ''}
                // props 
                // onClick={()=> props.onUpdateSelected?.(item.props?.name)}
                // v-model emit 传递 update:selected 事件
                onClick={()=> context.emit('update:selected', item.props?.name)}
                >
                {item.props?.name}
              </li>
                    )
          }
        </ol>
        <div>
          {tabs.find(item => item.props?.name === props.selected)}
        </div>
      </div>
    }
  }
})

export const Tab = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
      <div>{context.slots.default?.()}</div>
    )
  }
})
```

然后在`ItemCreate.tsx`组件中使用。

```tsx
import { defineComponent, PropType, ref } from 'vue'
import { MainLayout } from '../../layouts/MainLayout'
import { Icon } from '../../shared/Icon'
import { Tab, Tabs } from '../../shared/Tabs'
import s from './ItemCreate.module.scss'
export const itemCreate = defineComponent({
  props: {},
  setup: (props, context) => {
    const refKind = ref('支出')
    return () => (
      <MainLayout>{{
        title: () => '记一笔',
        icon: () => <Icon name='left' class={s.navIcon}/>,
        default: () => <>
          {/* props */}
          {/* <Tabs selected={refKind.value} onUpdateSelected={name => refKind.value = name }> */}
          {/* v-model */}
          <Tabs v-model:selected={ refKind.value }>
            <Tab name="支出">
              icon 支出列表
            </Tab>
            <Tab name="收入">
              icon 收入列表
            </Tab>
          </Tabs>
        </>
      }}</MainLayout>
    )
  }
})
```

创建Tabs，详细内容具体见[链接](https://github.com/Lu9709/mangosteen-font/commit/f3cd3209320b8325070378b01e29864c7b6f8091)。

