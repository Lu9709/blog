# 用Grid布局制作列表页
### 创建 ItemsPage 页面
在components下创建`TimeRangePicker`和`TopNav`两个组件。

然后创建`ItemsPage.tsx`页面，并创建`ItemsPage`文件夹，用于存放`ItemsPage`页面中的其他内容`ItemsList.tsx`和`ItemsSummary.tsx`。

```tsx
import styled from 'styled-components'
import { AddItemFloatButton } from '../components/AddItemFloatButton'
import { TimeRangePicker } from '../components/TimeRangePicker'
import { Topnav } from '../components/Topnav'
import { ItemsList } from './ItemsPage/ItemsList'
import { ItemsSummary } from './ItemsPage/ItemsSummary'

const Div = styled.div`
  background: linear-gradient(0deg, rgba(143,76,215,1) 0%, rgba(92,51,190,1) 100%);
`

export const ItemsPage: React.FC = () => {
  return (
    <div>
      <Div>
        <Topnav />
        <TimeRangePicker />
      </Div>
      <ItemsSummary />
      <ItemsList />
      <AddItemFloatButton />
    </div>
  )
}
```

然后在路由中引入`ItemsPage`的页面，详细代码见链接。

### 完成 Topnav 组件
```tsx
import { Icon } from './Icon'

interface Props {
  title?: string
}
export const TopNav: React.FC<Props> = ({ title = '山竹记账' }) => {
  return (
    <div text-white flex items-center p-16px>
      <Icon name="menu" className="w-24px h-24px mr-16px" />
      <h1 text-24px>{title}</h1>
    </div>
  )
}

```

### 完成时间范围选择组件 TimeRangePicker
```tsx
import s from './TimeRangePicker.module.scss'
export type TimeRange = 'thisMonth' | 'lastMonth' | 'thisYear' | 'custom'
interface Props {
  selected: TimeRange
  onSelected: (selected: TimeRange) => void
}
const timeRanges: { key: TimeRange; text: string }[] = [
  { key: 'thisMonth', text: '本月' },
  { key: 'lastMonth', text: '上月' },
  { key: 'thisYear', text: '今年' },
  { key: 'custom', text: '自定义时间' },
]
export const TimeRangePicker: React.FC<Props> = ({ selected, onSelected }) => {
  return (
    <ol flex text-white children-px-24px children-py-12px cursor-pointer>
      {timeRanges.map(tr => <li key={tr.key} className={tr.key === selected ? s.selected : ''}
                              onClick={() => onSelected(tr.key)}>
        {tr.text}
      </li>)}
    </ol>
  )
}
```

```css
.selected {
  position: relative;
  &::after{
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: white;
    opacity: 0.5;
  }
}
```

然后在页面中引入，详细代码见[链接](https://github.com/Lu9709/mangosteen-font-react/commit/e93a7ff7bff01e0893a1309889dc8f717a80dbfb)。

### 完成 ItemsSummary 组件
```css
export const ItemsSummary: React.FC = () => {
  return (
    <ol bg="#252A43" flex justify-between items-center m-16px rounded-8px py-12px px-16px
      children-px-24px text-center>
      <li text="#FE7275">
        <div>收入</div>
        <div>1000</div>
      </li>
      <li text="#53A867">
        <div>支出</div>
        <div>1000</div>
      </li>
      <li text-white>
        <div>净收入</div>
        <div>1000</div>
      </li>
    </ol>
  )
}
```

### 完成 ItemsList 组件
```tsx

interface Props {
  items: Item[]
}
export const ItemsList: React.FC<Props> = ({ items }) => {
  return <div>
    <ol >
      {items.map(item =>
    <li key={item.id} grid grid-cols="[auto_1fr_auto]" grid-rows-2 px-16px py-8px gap-x-12px
      border-b-1 b="#EEE">
      <div row-start-1 col-start-1 row-end-3 col-end-2 text-24px w-48px h-48px
        bg="#D8D8D8" rounded="50%" flex justify-center items-center>
        😘
      </div>
      <div row-start-1 col-start-2 row-end-2 col-end-3>
        旅行
      </div>
      <div row-start-2 col-start-2 row-end-3 col-end-4 text="#999999">
        2011年1月1日
      </div>
      <div row-start-1 col-start-3 row-end-2 col-end-4 text="#53A867">
        ￥999
      </div>
    </li>
                )}
    </ol>
    <div p-16px>
      <button j-btn>加载更多</button>
    </div>
  </div>
}

```

并在`uno.config.ts`配置的代码`shortcut`，便于用于同一样式的使用。

```typescript
import {
  defineConfig, presetAttributify, presetIcons,
  presetTypography, presetUno, transformerAttributifyJsx
} from 'unocss'

export default defineConfig({
  theme: {
  },
  shortcuts: {
    'j-btn': 'h-48px w-100% bg-#5C33BE b-none text-white rounded-8px'
  },
  safelist: [],
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

具体详情代码见[链接](https://github.com/Lu9709/mangosteen-font-react/commit/0ac8110acdcc06fe7f16ea12ed7035aa6ae29f33)。

