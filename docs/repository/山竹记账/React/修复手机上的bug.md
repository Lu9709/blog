# 修复手机上的bug
### 修改Welcome界面
修改`WeclomeLayout.tsx`，去除底部的`footer`，放置于顶部，并修改其他`Welcome`页面，即使页面被浏览器挡住，也不会影响交互，详细代码见[链接](https://github.com/Lu9709/mangosteen-font-react/commit/b80804b200b79d05ab6463afd75b83d8850765a7)。

```tsx
import { Link, useLocation, useNavigate, useOutlet, } from 'react-router-dom'
import { animated, useTransition } from 'react-spring'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import logo from '../assets/images/logo.svg'
import { useSwipe } from '../hooks/useSwipe'
import { useLocalStore } from '../stores/useLocalStore'
const linkMap: Record<string, string> = {
  '/welcome/1': '/welcome/2',
  '/welcome/2': '/welcome/3',
  '/welcome/3': '/welcome/4',
  '/welcome/4': '/home',
}
export const WelcomeLayout: React.FC = () => {
  const animating = useRef(false)
  const map = useRef<Record<string, ReactNode>>({})
  const location = useLocation() // 获取当前地址栏的信息
  const outlet = useOutlet()
  map.current[location.pathname] = outlet
  const [extraStyle, setExtraStyle] = useState<{ position: 'relative' | 'absolute' }>({ position: 'relative' })
  const transitions = useTransition(location.pathname, {
    from: { transform: location.pathname === '/welcome/1' ? 'translateX(0%)' : 'translateX(100%)' },
    enter: { transform: 'translateX(0%)' },
    leave: { transform: 'translateX(-100%)' },
    config: { duration: 300 },
    onStart: () => {
      setExtraStyle({ position: 'absolute' })
    },
    onRest: () => {
      animating.current = false
      setExtraStyle({ position: 'relative' })
    }
  })
  const main = useRef<HTMLElement>(null)
  const { direction } = useSwipe(main, { onTouchStart: e => e.preventDefault() })
  const nav = useNavigate()
  useEffect(() => {
    if (direction === 'left') {
      if (animating.current)
        return
      animating.current = true
      nav(linkMap[location.pathname])
    }
  }, [direction, location.pathname, linkMap])
  const { setHasReadWelcomes } = useLocalStore()
  const onSkip = () => {
    setHasReadWelcomes(true)
  }
  return (
    <div className="bg-#5f34bf" h-screen flex flex-col items-stretch pb-16px>
      <Link fixed text-white top-16px right-16px text-32px to="/welcome/xxx">跳过</Link>
      <header shrink-0 text-center pt-64px>
        <img src={logo} w-64px h-69px />
        <h1 text="#D4D4EE" text-32px>山竹记账</h1>
      </header>
      <main shrink-1 grow-1 relative ref={main}>
        {transitions((style, pathname) =>
      <animated.div key={pathname} style={{ ...style, ...extraStyle }} w="100%" h="100%" p-16px flex>
        <div grow-1 bg-white flex justify-center items-center rounded-8px>
          {map.current[pathname]}
        </div>
      </animated.div>
                    )}
      </main>
    </div>
  )
}
```

### 优化动画切换手势的逻辑
修改`Hooks`的`useSwipe`，添加上下左右滑动的逻辑，详细代码见[链接](https://github.com/Lu9709/mangosteen-font-react/commit/526285b287206e6e56849c9c11e29110ee20ff87)。

```tsx
import type { RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'

interface Config {
  onTouchStart?: (e: TouchEvent) => void
  onTouchMove?: (e: TouchEvent) => void
  onTouchEnd?: (e: TouchEvent) => void
}
export const useSwipe = (elementRef: RefObject<HTMLElement>, config?: Config) => {
  const [direction, setDirection] = useState<'' | 'left' | 'right' | 'up' | 'down'>('')
  const x = useRef(-1)
  const y = useRef(-1)
  const onTouchStart = (e: TouchEvent) => {
    config?.onTouchStart?.(e)
    x.current = e.touches[0].clientX
    y.current = e.touches[0].clientY
  }
  const onTouchMove = (e: TouchEvent) => {
    config?.onTouchMove?.(e)
    const newX = e.touches[0].clientX
    const newY = e.touches[0].clientY
    const dx = newX - x.current
    const dy = newY - y.current
    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) < 3)
        setDirection('')
      else if (dx > 0)
        setDirection('right')
      else
        setDirection('left')
    } else {
      if (Math.abs(dy) < 3)
        setDirection('')
      else if (dy > 0)
        setDirection('down')
      else
        setDirection('up')
    }
  }
  const onTouchEnd = (e: TouchEvent) => {
    config?.onTouchEnd?.(e)
    setDirection('')
  }
  useEffect(() => {
    if (!elementRef.current)
      return
    elementRef.current.addEventListener('touchstart', onTouchStart)
    elementRef.current.addEventListener('touchmove', onTouchMove)
    elementRef.current.addEventListener('touchend', onTouchEnd)
    return () => {
      if (!elementRef.current)
        return
      elementRef.current.removeEventListener('touchstart', onTouchStart)
      elementRef.current.removeEventListener('touchmove', onTouchMove)
      elementRef.current.removeEventListener('touchend', onTouchEnd)
    }
  }, [])
  return { direction }
}

```

### 修复手机上的表单样式bug 
修改`SignInpage.tsx`文件，输入验证码的`input`和`button`标签添加上`max-w="[calc(40%-8px)]"`，详细代码见[链接](https://github.com/Lu9709/mangosteen-font-react/commit/cd4a34410d5219cbfd24ed18ef7d825014da1b22)。

### 跳过已阅的广告
点击跳过或者开启应用时，记录用户已经读过广告。

使用`stores`的`useLocalStore`。

在`WelcomeLayout.tsx`的`onSkip`函数中添加跳转`nav('/welcome/xxx')`，并将原先的`Link`标签修改为`span`，添加关于`onSkip`的`onClick`事件。

然后修改`Weclome4.tsx`页面内容，如下所示。

```tsx
import { useNavigate } from 'react-router-dom'
import p from '../assets/images/welcome4.svg'
import { useLocalStore } from '../stores/useLocalStore'

export const Welcome4: React.FC = () => {
  const { setHasReadWelcomes } = useLocalStore()
  const nav = useNavigate()
  const onSkip = () => {
    setHasReadWelcomes(true)
    nav('/welcome/xxx')
  }
  return (
    <div text-center>
      <img w-129px h-83px src={p} />
      <h2 text-32px mt-48px >
      云备份 <br />
        再也不怕数据丢失
      </h2>
      <div mt-64px>
        <span text-32px color="#6035BF" font-bold onClick={onSkip}>开启应用</span>
      </div>
    </div>
  )
}

```

