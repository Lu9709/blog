# 制作TagEdit和ItemList页面

### 制作TagEdit页面
由于TagEdit页面和TagCreate页面大致内容一致，只有底部有多的button按钮，于是将中间的表单内容提取出来，到时候将编辑和新增功能的API给提取出来，调用接口即可，具体代码可以见[链接](https://github.com/Lu9709/mangosteen-font/commit/12e0bd0557da9d7c7559d55f77a6a8e7321184cd)。

```tsx
import { defineComponent, PropType, reactive, toRaw } from 'vue'
import { Button } from '../../shared/Button'
import { EmojiSelect } from '../../shared/EmojiSelect'
import { Rules, validate } from '../../shared/validate'
import s from './Tag.module.scss'
export const TagForm = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const formData = reactive({
      name: '',
      sign: ''
    })
    const errors = reactive<{ [k in keyof typeof formData]?: string[] }>({})
    const rules: Rules<typeof formData> = [
      { key: 'name', type: 'required', message: '必填' },
      { key: 'name', type: 'pattern', regex: /^.{1,4}$/, message: '只能填 1 到 4 个字符' },
      { key: 'sign', type: 'required', message: '必填' },
    ]
    const onSubmit = (e: Event) => {
      console.log(toRaw(formData))
      Object.assign(errors, {
        name: undefined,
        sign: undefined
      })
      Object.assign(errors, validate(formData, rules))
      e.preventDefault()
    }
    return () => (
      <form class={s.form} onSubmit={onSubmit}>
        <div class={s.formRow}>
          <label class={s.formLabel}>
            <span class={s.formItem_name}>标签名</span>
            <div class={s.formItem_value}>
              <input v-model={formData.name}
                class={[s.formItem, s.input, errors['name'] ? s.error : '']}/>
            </div>
            <div class={s.formItem_errorHint}>
              <span>{errors['name'] ? errors['name'][0] : '　'}</span>
            </div>
          </label>
        </div>
        <div class={s.formRow}>
          <label class={s.formLabel}>
            <span class={s.formItem_name}>符号 {formData.sign}</span>
            <div class={s.formItem_value}>
              <EmojiSelect v-model={formData.sign} 
                class={[s.formItem, s.emojiList, errors['sign'] ? s.error : '']} />
            </div>
            <div class={s.formItem_errorHint}>
              <span>{errors['sign'] ? errors['sign'][0] : '　'}</span>
            </div>
          </label>
        </div>
        <p class={s.tips}>记账时长按标签即可进行编辑</p>
        <div class={s.formRow}>
          <div class={s.formItem_value}>
            <Button class={[s.formItem, s.button]}>确定</Button>
          </div>
        </div>
      </form>
    )
  }
})
```

### 扩展Tabs组件，支持classPrefix
为了方便用户可以修改Tabs的样式，于是可以给Tabs组件添加类名，并在`App.scss`内进行添加Tabs的样式，具体代码可见[链接](https://github.com/Lu9709/mangosteen-font/commit/efb5507e90a3fd15e078fdcec2dda3cf3ecc3800)。

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
    },
    classPrefix: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => {
      const tabs = context.slots.default?.()
      if (!tabs) return () => null
      for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].type !== Tab) {
          return new Error('<Tabs> only accepts <Tab> as children')
        }
      }
      const cp = props.classPrefix
      return <div class={[s.tabs, cp + '_tabs']}>
        <ol class={[s.tabs_nav, cp + '_tabs_nav']}>
          {
            tabs.map(item =>
              <li class={[
                item.props?.name === props.selected ? [s.selected, cp + '_selected'] : '',
                cp + '_tabs_nav_item'
              ]}
                // onClick={()=> props.onUpdateSelected?.(item.props?.name)}
                onClick={() => context.emit('update:selected', item.props?.name)}
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

### 重构time函数变为Time类
由于原先的time函数并不满足需求，所以进行了重构，具体详细代码见[链接](https://github.com/Lu9709/mangosteen-font/commit/751baf08c0051583bb7a9bfca3ea7ee8762f2b86)。

```tsx
export class Time {
  date: Date;
  constructor(date = new Date()) {
    this.date = date;
  }
  format(pattern = 'YYYY-MM-DD') {
    // 目前支持的格式有 YYYY MM DD HH mm ss SSS
    const year = this.date.getFullYear()
    const month = this.date.getMonth() + 1
    const day = this.date.getDate()
    const hour = this.date.getHours()
    const minute = this.date.getMinutes()
    const second = this.date.getSeconds()
    const msecond = this.date.getMilliseconds()
    return pattern.replace(/YYYY/g, year.toString())
      .replace(/MM/, month.toString().padStart(2, '0'))
      .replace(/DD/, day.toString().padStart(2, '0'))
      .replace(/HH/, hour.toString().padStart(2, '0'))
      .replace(/mm/, minute.toString().padStart(2, '0'))
      .replace(/ss/, second.toString().padStart(2, '0'))
      .replace(/SSS/, msecond.toString().padStart(3, '0'))
  }
  firstDayOfMonth() {
    return new Time(new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0));
  }
  firstDayOfYear() {
    return new Time(new Date(this.date.getFullYear(), 0, 1, 0, 0, 0));
  }
  lastDayOfMonth() {
    return new Time(new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0, 0, 0, 0));
  }
  lastDayOfYear() {
    return new Time(new Date(this.date.getFullYear() + 1, 0, 0, 0, 0, 0));
  }
  getRaw() {
    return this.date
  }
  add(amount: number, unit: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond') {
    let date = new Date(this.date.getTime());
    switch (unit) {
      case 'year': {
        date.setFullYear(date.getFullYear() + amount)
        break;
      }
      case 'month': {
        const d = date.getDate()
        date.setDate(1)
        date.setMonth(date.getMonth() + amount); 
        const d2 = new Date(date.getFullYear(), date.getMonth() + 1, 0, 0, 0, 0).getDate()
        date.setDate(Math.min(d, d2))
        break;
      }
      case 'day':
        date.setDate(date.getDate() + amount);
        break;
      case 'hour':
        date.setHours(date.getHours() + amount);
        break;
      case 'minute':
        date.setMinutes(date.getMinutes() + amount);
        break;
      case 'second':
        date.setSeconds(date.getSeconds() + amount);
        break;
      case 'millisecond':
        date.setMilliseconds(date.getMilliseconds() + amount);
        break;
      default:
        throw new Error('Time.add: unknown unit');
    }
    return new Time(date)
  }
}
```

### 封装Form、FormItem组件
封装`Form`和`FormItem`便于使用，根据`type`来设置`FormItem`内的内容，也可以不设置，直接通过插槽直接导入。目前设置了`input`、`emojiSelect`、`date`，之后还能在继续添加具有拓展性。`date`是一个自定义的时间弹窗框，具体详细代码见[链接](https://github.com/Lu9709/mangosteen-font/commit/70985d71176cc842007278ba5725de46f92f955f)。

```tsx
import { DatetimePicker, Popup } from 'vant';
import { computed, defineComponent, PropType, ref } from 'vue'
import { EmojiSelect } from './EmojiSelect';
import s from './Form.module.scss'
import { Time } from './time';
export const Form = defineComponent({
  props: {
    onSubmit: {
      type: Function as PropType<(e: Event) => void>
    }
  },
  setup: (props, context) => {
    return () => (
      <form class={s.form} onSubmit={props.onSubmit}>
        {context.slots.default?.()}
      </form>
    )
  }
})
export const FormItem = defineComponent({
  props: {
    label: {
      type: String
    },
    modelValue: {
      type: [String, Number]
    },
    type: {
      type: String as PropType<'text' | 'emojiSelect' | 'date'>
    },
    error: {
      type: String
    }
  },
  setup: (props, context) => {
    const refDateVisible = ref(false)
    const content = computed(() => {
      switch (props.type) {
        case 'text':
          return <input
            value={props.modelValue}
            onInput={(e: any) => context.emit('update:modelValue', e.target.value)}
            class={[s.formItem, s.input, props.error === '　' ? '' : s.error]} />
        case 'emojiSelect':
          return <EmojiSelect
            modelValue={props.modelValue?.toString()}
            onUpdateModelValue={value => context.emit('update:modelValue', value)}
            class={[s.formItem, s.emojiList, props.error === '　' ? '' : s.error]} />
        case 'date':
          return <>
            <input readonly={true} value={props.modelValue}
              onClick={() => { refDateVisible.value = true }}
              class={[s.formItem, s.input]} />
            <Popup position='bottom' v-model:show={refDateVisible.value}>
              <DatetimePicker value={props.modelValue} type='date' title='选择年月日'
                onConfirm={(date: Date) => {
                  context.emit('update:modelValue', new Time(date).format())
                  refDateVisible.value = false
                }}
                onCancel={()=> refDateVisible.value = false}
              />
            </Popup>
          </>
        case undefined:
          return context.slots.default?.()
      }
    })
    return () => {
      return <div class={s.formRow}>
        <label class={s.formLabel}>
          {props.label && <span class={s.formItem_name}>{props.label}</span>}
          <div class={s.formItem_value}>
            {content.value}
          </div>
          {props.error && <div class={s.formItem_errorHint}><span>{props.error}</span></div>}
        </label>
      </div>
    }
  }
})
```

