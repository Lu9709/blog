# 创建useSwipe的Hooks
### 创建404路由
```tsx
export const NotFoundPage: React.FC = () => {
  return <div>当前路径不存在</div>
}
```

修改`router.tsx`的`errorElement`的错误跳转页。

```tsx
import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayouts'
import { NotFoundPage } from '../pages/NotFoundPage'
import { WelcomeRoutes } from './WelcomeRoutes'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      WelcomeRoutes
    ]
  }
])
```

给`WeclomeRoutes`添加TS类型，用于约束。

```tsx
import type { RouteObject } from 'react-router-dom'
import { WelcomeLayout } from '../layouts/WelcomeLayout'
import { Welcome1 } from '../pages/Welcome1'
import { Welcome2 } from '../pages/Welcome2'
import { Welcome3 } from '../pages/Welcome3'
import { Welcome4 } from '../pages/Welcome4'

export const WelcomeRoutes: RouteObject = {
  path: 'welcome',
  element: <WelcomeLayout />,
  children: [
    { path: '1', element: <Welcome1 /> },
    { path: '2', element: <Welcome2 /> },
    { path: '3', element: <Welcome3 /> },
    { path: '4', element: <Welcome4 /> },
  ]
}
```

### 解决 TS 报错
详细代码见[链接](https://github.com/Lu9709/mangosteen-font-react/commit/130470ee72576bc20e298424c26e02640c4223c0)。

### 修改 eslintrc
详细代码见[链接](https://github.com/Lu9709/mangosteen-font-react/commit/ae437fbc30ac027e1856e298125d8774aec25919)。

### 可以通过滑动跳至下一页
创建`useSwipe`的`hooks`然后在`WelcomeLayout`组件中使用。

```tsx
zimport type { RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'

interface Config {
  onTouchStart?: (e: TouchEvent) => void
  onTouchMove?: (e: TouchEvent) => void
  onTouchEnd?: (e: TouchEvent) => void
}
export const useSwipe = (elementRef: RefObject<HTMLElement>, config?: Config) => {
  const [direction, setDirection] = useState<'' | 'left' | 'right'>('')
  const x = useRef(-1)
  const onTouchStart = (e: TouchEvent) => {
    config?.onTouchStart?.(e)
    x.current = e.touches[0].clientX
  }
  const onTouchMove = (e: TouchEvent) => {
    config?.onTouchMove?.(e)
    const newX = e.touches[0].clientX
    const d = newX - x.current
    if (Math.abs(d) < 3)
      setDirection('')
    else if (d > 0)
      setDirection('right')
    else
      setDirection('left')
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

