# NavBar与Overlay组件

### Center组件
设置一个常用组件方便居中。

```tsx
import { defineComponent, PropType } from 'vue'
import s from './Center.module.scss'
export type directionType = '-' | '|' | 'horizontal' | 'vertical'
const directionMap = {
  '-': 'horizontal',
  '|': 'vertical',
  'horizontal': 'horizontal',
  'vertical': 'vertical'
}
export const Center = defineComponent({
  props: {
    direction: {
      type: String as PropType<'-' | '|' | 'horizontal' | 'vertical'>,
      default: 'horizontal'
    }
  },
  setup: (props, context) => {
    const extraClass = directionMap[props.direction]
    return () => (
      <div class={[s.center, extraClass]}>{
        context.slots.default?.()
      }</div>
    )
  }
})
```

```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  &.horizontal {
    flex-direction: row;
  }
  &.vertical {
    flex-direction: column;
  }
}
```

然后在StartPage中使用Center组件，具体详细代码见[链接](https://github.com/Lu9709/mangosteen-font/commit/69ae04e6db720ab77ee644315e336ca9bf54f5a2)。

```tsx
import { defineComponent } from 'vue';
import { Button } from '../shared/Button';
import { Center } from '../shared/Center';
import { FloatButton } from '../shared/FloatButton';
import { Icon } from '../shared/Icon';
import s from './StartPage.module.scss';
export const StartPage = defineComponent({
  setup: (props, context) => {
    const onClick = () => {
      console.log('hi')
    }
    return () => (
      <div>
        <nav>menu</nav>
        <Center class={s.pig_wrapper}>
          <Icon name='pig' class={s.pig}/>
        </Center>
        <div class={s.button_wrapper}>
          <Button class={s.button} onClick={onClick}>测试</Button>
          <FloatButton iconName='add'/>
        </div>
      </div>
    )
  }
})
```

```css
.button {
  width: 100%;
  &_wrapper {
    padding: 16px;
  }
}
.pig{
  width: 128px;
  height: 128px;
  &_wrapper{
    padding: 160px 0;
  }
}
```

### Navbar组件
移动svg标签至资源文件夹，`mv /workspaces/oh-my-env/temp/*.svg src/assets/icons`

```typescript
import { defineComponent, PropType } from 'vue';
import s from './Navbar.module.scss';
export const Navbar = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const {slots} = context
    return () => (
      <div class={s.navbar}>
        <span class={s.icon_wrapper}>
          {slots.icon?.()}
        </span>
        <span class={s.title_wrapper}>
          {slots.default?.()}
        </span>
      </div>
    )
  }
}) 
```

```css
.navbar{
  background: linear-gradient(to bottom, var(--navbar-bg-start), var(--navbar-bg-end));
  color: var(--navbar-text);
  fill: var(--navbar-text);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 40px 16px 12px;
}
.title_wrapper{
  font-size: 24px;
  margin-left: 12px;
}
.icon_wrapper{
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  > * {
    max-width: 100%;
    max-height: 100%;
  }
} 
```

然后在`startPage`页面中使用`Navbar`组件，具体详细代码见[链接](https://github.com/Lu9709/mangosteen-font/commit/6e50a455eb9ab5b61954be88a610cce15b009235)。

```typescript
import { defineComponent } from 'vue';
import { Button } from '../shared/Button';
import { Center } from '../shared/Center';
import { FloatButton } from '../shared/FloatButton';
import { Icon } from '../shared/Icon';
import { Navbar } from '../shared/Navbar';
import s from './StartPage.module.scss';
export const StartPage = defineComponent({
  setup: (props, context) => {
    const onClick = () => {
      console.log('hi')
    }
    return () => (
      <div>
        <Navbar>{
          {
            default: () => '山竹记账',
            icon: () => <Icon name='menu' class={s.navIcon}/>
          }
        }</Navbar>
        <Center class={s.pig_wrapper}>
          <Icon name='pig' class={s.pig}/>
        </Center>
        <div class={s.button_wrapper}>
          <Button class={s.button} onClick={onClick}>开始记账</Button>
          <FloatButton iconName='add'/>
        </div>
      </div>
    )
  }
})
```

### Overlay组件
由于需要设置遮罩层，还需要在顶部设置安全距离。并且浮层的`z-index`需要设置好，与其他浮层之间的距离应该保留一些距离，这些需要在`var.scss`内进行配置。页面与组件之间若是需要相互通信，可以使用`props`或使用`emit`。

```typescript
import { defineComponent, PropType } from 'vue';
import { RouterLink } from 'vue-router';
import { Icon, IconName } from './Icon';
import s from './Overlay.module.scss';
type NavbarItem = {
  routerLink: string
  iconName: IconName
  content: string
}
const NavbarList: NavbarItem[] = [
  { routerLink: '/statistics', iconName: 'charts', content: '统计图表' },
  { routerLink: '/export', iconName: 'export', content: '导出数据' },
  { routerLink: '/notify', iconName: 'notify', content: '记账提醒' },
]
export const Overlay = defineComponent({
  props: {
    onClose: {
      type: Function as PropType<() => void>
    }
  },
  setup: (props, context) => {
    const close = () => {
      props.onClose?.()
    }
    // 可以通过props传递的点击遮罩层的关闭事件 ()内可以传递参数
    // 也可以通过emit的方式来传递
    // const { emit } = context
    // const close = () => {
    //   emit('close')
    //}
    const onClickSignIn = () => { }
    return () => <>
      <div class={s.mask} onClick={close}></div>
      <div class={s.overlay}>
        <section class={s.currentUser} onClick={onClickSignIn}>
          <h2>未登录用户</h2>
          <p>点击这里登录</p>
        </section>
        <nav>
          <ul class={s.action_list}>
            {
              NavbarList.map(item => (
                <li>
                  <RouterLink to={item.routerLink} class={s.action}>
                    <Icon name={item.iconName} class={s.icon} />
                    <span>{item.content}</span>
                  </RouterLink>
                </li>
              ))
            }
          </ul>
        </nav>
      </div>
    </>
  }
}) 

```

```css
.mask {
  position: fixed;
  z-index: var(--z-index-overlay);
  background: var(--overlay-mask-bg);
  top: var(--top-safe-area-height);
  left: 0;
  width: 100%;
  height: calc(100% - var(--top-safe-area-height));
}
.overlay {
  position: fixed;
  z-index: calc(var(--z-index-overlay) + 1);
  background: var(--overlay-bg);
  top: var(--top-safe-area-height);
  left: 0;
  width: 16em;
  height: calc(100% - var(--top-safe-area-height));
}
.currentUser {
  padding: 32px 16px;
  background: var(--overlay-user-bg);
  color: var(--overlay-user-text);
}
.action {
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 12px 16px;
  &_list {
    padding-top: 16px;
    font-size: 20px;
  }
  > .icon {
    margin-right: 12px;
  }
}
```

然后在startPage页面中引入Overlay组件，具体详细代码见[链接](https://github.com/Lu9709/mangosteen-font/commit/1608cb7a023d17855f7469476855af2a866302e8)。

```tsx
import { defineComponent, ref } from 'vue';
import { Button } from '../shared/Button';
import { Center } from '../shared/Center';
import { FloatButton } from '../shared/FloatButton';
import { Icon } from '../shared/Icon';
import { Navbar } from '../shared/Navbar';
import { Overlay } from '../shared/Overlay';
import s from './StartPage.module.scss';
export const StartPage = defineComponent({
  setup: (props, context) => {
    const refOverlayVisible = ref(false)
    const onClickMenu = () => {
      refOverlayVisible.value = !refOverlayVisible.value
    }
    const onClick = () => {
      console.log('hi')
    }
    return () => (
      <div>
        <Navbar>{
          {
            default: () => '山竹记账',
            icon: () => <Icon name='menu' class={s.navIcon} onClick={onClickMenu} />
          }
        }</Navbar>
        <Center class={s.pig_wrapper}>
          <Icon name='pig' class={s.pig} />
        </Center>
        <div class={s.button_wrapper}>
          <Button class={s.button} onClick={onClick}>开始记账</Button>
          <FloatButton iconName='add' />
        </div>
        {
        refOverlayVisible.value && <Overlay onClose={() => refOverlayVisible.value = false} />
        }
      </div>
    )
  }
})
```

