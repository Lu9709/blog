# 引入Vant UI制作数字按键

安装Vant依赖`pnpm add vant`，并按需引入需安装<font style="color:rgb(52, 73, 94);"> </font>[unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)<font style="color:rgb(52, 73, 94);"> 插件，执行</font>`pnpm add unplugin-vue-components -D`，然后在`vite.config.ts`内配置插件：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
// @ts-nocheck
import { svgstore } from './src/vite_plugins/svgstore'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx({
      transformOn: true,
      mergeProps: true
    }),
    svgstore(),
    Components({
      resolvers: [VantResolver()],
    }),
  ]
})
```

但是使用组件的时候，还需自行导入vant的样式，因为`unplugin-vue-components`无法自动改引入对应的样式，案例如下所示：

```typescript
import { DatetimePicker, Popup } from 'vant';
import 'vant/es/popup/style';
import 'vant/es/datetime-picker/style';
```

### 封装Time.tsx
由于用到的Date，为了方便处理时间，需要封装一个Time.tsx的方法，也可以直接使用其他库，比如[day.js](https://dayjs.gitee.io/docs/zh-CN/installation/installation)。

```typescript
export const time = (date = new Date()) => {
  const api = {
    format: (pattern = 'YYYY-MM-DD') => {
      // 目前支持的格式有 YYYY MM DD HH mm ss SSS
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()
      const msecond = date.getMilliseconds()
      return pattern.replace(/YYYY/g, year.toString())
        .replace(/MM/, month.toString().padStart(2, '0'))
        .replace(/DD/, day.toString().padStart(2, '0'))
        .replace(/HH/, hour.toString().padStart(2, '0'))
        .replace(/mm/, minute.toString().padStart(2, '0'))
        .replace(/ss/, second.toString().padStart(2, '0'))
        .replace(/SSS/, msecond.toString().padStart(3, '0'))
    }
  }
  return api
}
```

### 使用grid布局制作数字按键
使用grid布局的`grid-template-areas`来布局玩橙数字按键，之后可以通过`grid areas`来特定命名，具体见[MDN的grid-template-areas](https://developer.mozilla.org/zh-CN/docs/Web/CSS/grid-template-areas)。然后导入Vant的`Popup`和`DatetimePicker`组件和其样式。

数字累加的时候需要进行逻辑处理。

```tsx
import { defineComponent, PropType, ref } from 'vue'
import { Icon } from '../../shared/Icon'
import { time } from '../../shared/time'
import s from './InputPad.module.scss'
import { DatetimePicker, Popup } from 'vant';
import 'vant/es/popup/style';
import 'vant/es/datetime-picker/style';
export const InputPad = defineComponent({
  setup: (props, context) => {
    const buttons = [
      { text: '1', onClick: () => { appendText(1) } },
      { text: '2', onClick: () => { appendText(2) } },
      { text: '3', onClick: () => { appendText(3) } },
      { text: '4', onClick: () => { appendText(4) } },
      { text: '5', onClick: () => { appendText(5) } },
      { text: '6', onClick: () => { appendText(6) } },
      { text: '7', onClick: () => { appendText(7) } },
      { text: '8', onClick: () => { appendText(8) } },
      { text: '9', onClick: () => { appendText(9) } },
      { text: '.', onClick: () => { appendText('.') } },
      { text: '0', onClick: () => { appendText(0) } },
      { text: '清空', onClick: () => { refAmount.value = '0' } },
      { text: '提交', onClick: () => { } },
    ]
    const refAmount = ref('0')
    const now = new Date()
    const refDate = ref<Date>(now)
    const refDatePickerVisible = ref(false)
    const setDate = (date: Date) => { refDate.value = date; hideDatePicker() }
    const showDatePicker = () => refDatePickerVisible.value = true
    const hideDatePicker = () => refDatePickerVisible.value = false
    const appendText = (n: string | number) => {
      const nString = n.toString()
      const amountValue = refAmount.value
      const amountValueLength = amountValue.length
      const dotIndex = amountValue.indexOf('.')
      if (amountValueLength >= 13) {
        // 字符串超过13后不在添加
        return
      }
      if (dotIndex >= 0 && amountValueLength - dotIndex > 2) {
        // 若存在点且超过后两位则不在添加
        return
      }
      if (nString === '.') {
        if (dotIndex >= 0) {
          // 若以及存在点了，则不在添加
          return
        }
      } else if (nString === '0') { 
        if (dotIndex === -1) {
          // 若输入的为0，且点不存在，就不在添加
          return
        }
      } else { 
        if (refAmount.value === '0') {
          // 若输入的是0，则制空。
          refAmount.value = ''
        }
      }
      refAmount.value += nString
    }
    return () => <>
      <div class={s.dateAndAmount}>
        <span class={s.date}>
          <Icon name='date' class={s.icon} />
          <span>
            <span onClick={showDatePicker}>{time(refDate.value).format()}</span>
            <Popup position='bottom' v-model:show={refDatePickerVisible.value}>
              <DatetimePicker value={refDate.value} type="date" title="选择年月日"
                onConfirm={setDate} onCancel={hideDatePicker}
              />
            </Popup>
          </span>
        </span>
        <span class={s.amount}>{refAmount.value}</span>
      </div>
      <div class={s.buttons}>
        {buttons.map(button => <button onClick={button.onClick}>{button.text}</button>)}
      </div>
    </>
  }
})
```

```tsx
.dateAndAmount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  font-family: monospace; // 等高字体
  border-top: 1px solid var(--button-border-color);
  > .date {
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: start;
    color: var(--date-text);
    .icon {
      width: 24px;
      height: 24px;
      margin-right: 8px;
      fill: var(--amount-text);
    }
  }
  > .amount {
    font-size: 20px;
    color: var(--amount-text)
  }

}
.buttons {
  display: grid;
  grid-template-areas: 
    "n1 n2 n3 d"
    "n4 n5 n6 d"
    "n7 n8 n9 s"
    "n0 n0 nd s";
  // 布局划分
  grid-auto-rows: 48px;
  // 隐式创建横行高度
  grid-auto-columns: 1fr;
  // 隐式创建纵向宽度
  gap: 1px;
  background: var(--button-border-color);
  border-top: 1px solid var(--button-border-color);
  > button {
    border: none;
    background: var(--button-bg);
    &:nth-child(1) {
      grid-area: n1;
    }
    &:nth-child(2) {
      grid-area: n2;
    }
    &:nth-child(3) {
      grid-area: n3;
    }
    &:nth-child(4) {
      grid-area: n4;
    }
    &:nth-child(5) {
      grid-area: n5;
    }
    &:nth-child(6) {
      grid-area: n6;
    }
    &:nth-child(7) {
      grid-area: n7;
    }
    &:nth-child(8) {
      grid-area: n8;
    }
    &:nth-child(9) {
      grid-area: n9;
    }
    &:nth-child(10) {
      grid-area: nd;
    }
    &:nth-child(11) {
      grid-area: n0;
    }
    &:nth-child(12) {
      grid-area: d;
    }
    &:nth-child(13) {
      grid-area: s;
      background: var(--button-bg-important);
      color: var(--button-text-important);
    }
  }
}
```

