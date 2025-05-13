# React Router 6
### 引入React Router
#### 初始化路由
安装初始化`npm install react-router-dom`，安装的是最新版本的ReactRouter6.4.2，然后在`src/routes`文件夹下创建`router.tsx`，创建初始化路由。

[Home v6.4.2](https://reactrouter.com/en/main)

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>root</div>,
  },
  {
    path: '/1',
    element: <div>1</div>
  }
])

const div = document.getElementById('root') as HTMLElement

const root = ReactDOM.createRoot(div)
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>)
```

#### 404路由
创建一个文件夹`components`用于存放404页面，然后在`main.tsx`的`errorElement`添加404页面组件。

```tsx
import * as React from 'react'
import { useRouteError } from 'react-router-dom'
export const ErrorPage: React.FC = () => {
  const error: any = useRouteError()
  console.error(error)

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  )
}
```

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ErrorPage } from './components/ErrorPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>root</div>,
    errorElement: <ErrorPage/>
  },
  {
    path: '/1',
    element: <div>1</div>
  }
])

const div = document.getElementById('root') as HTMLElement

const root = ReactDOM.createRoot(div)
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>)
```

#### 嵌套路由
即当前路由下的chlidern内在添加路由，若是要展示的字路由的内容需要使用到`[<Outlet/>](https://reactrouter.com/en/main/components/outlet)`，但是如果主容器不需要追加东西则不需要使用`<Outlet/>`，子路由也能添加默认路由。路由跳转顺序是按照路由数组顺序来的。如下代码所示嵌套路由中添加了`/welcome/1，2，3，4`。

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ErrorPage } from './components/ErrorPage'
import { NavLink, Outlet, createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet/>,
    errorElement: <ErrorPage/>,
    children: [
      { index: true, element: <div>空</div> },
      {
        path: 'welcome',
        element: <Outlet/>,
        children: [
          {
            path: '1',
            element: (
            <div>1<NavLink to="/welcome/2">下一页</NavLink></div>
            )
          },
          {
            path: '2',
            element: (
            <div>2<NavLink to="/welcome/3">下一页</NavLink></div>
            )
          },
          {
            path: '3',
            element: (
            <div>3<NavLink to="/welcome/4">下一页</NavLink></div>
            )
          },
          {
            path: '4',
            element: (
            <div>4<NavLink to="/xxxx">开始记账</NavLink></div>
            )
          },
        ]
      }
    ]
  }
])
```

#### 重定向
需要使用到`useNavigate`，由于路由表内`redictTo`无法使用，于是利用了路由的`errorElement`的策略，使用404的路由来进行重定向的操作。

```tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
export const RedirectToWelcome1: React.FC = () => {
  const nav = useNavigate()
  useEffect(() => {
    nav('/welcome/1')
  }, [])
  return null
}
```

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RedirectToWelcome1 } from './components/RedirectToWelcome1'
import { NavLink, Outlet, createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet/>,
    errorElement: <RedirectToWelcome1/>,
    children: [
      { index: true, element: <div>空</div> },
      {
        path: 'welcome',
        element: <Outlet/>,
        errorElement: <RedirectToWelcome1/>,
        children: [
          {
            path: '1',
            element: (
            <div>1<NavLink to="/welcome/2">下一页</NavLink></div>
            )
          },
          {
            path: '2',
            element: (
            <div>2<NavLink to="/welcome/3">下一页</NavLink></div>
            )
          },
          {
            path: '3',
            element: (
            <div>3<NavLink to="/welcome/4">下一页</NavLink></div>
            )
          },
          {
            path: '4',
            element: (
            <div>4<NavLink to="/xxxx">开始记账</NavLink></div>
            )
          },
        ]
      }
    ]
  }
])
```

### 目录结构改变
重构代码，将路由代码区分开，详细内容见[链接](https://github.com/Lu9709/-mangosteen-font-react/commit/153b145390bc83a8e4c988209731696194c6ede6)。

### 添加动画React Spring
使用`React Spring`添加页面滑动时候的动画，如果是`/welcome/1`则不移动，若是其他的则从右侧水平滑动进入。并使用`useOutlet`返回当前子路由的元素并存入map中。

```tsx
import { useLocation, useOutlet } from 'react-router-dom'
import { animated, useTransition } from 'react-spring'
import type { ReactNode } from 'react'
import { useRef } from 'react'
export const WelcomeLayout: React.FC = () => {
  const map = useRef<Record<string, ReactNode>>({})
  const location = useLocation() // 获取当前地址栏的信息
  const outlet = useOutlet()
  map.current[location.pathname] = outlet
  const transitions = useTransition(location.pathname, {
    from: { transform: location.pathname === '/welcome/1' ? 'translateX(0%)' : 'translateX(100%)' },
    enter: { transform: 'translateX(0%)' },
    leave: { transform: 'translateX(-100%)' },
    config: { duration: 300 }
  })
  return transitions((style, pathname) => {
    return <animated.div key={pathname} style={style}>
        {map.current[pathname]}
    </animated.div>
  })
}

```

关于React-Spring的内容可点击如下链接查看。

[react-spring](https://react-spring.dev/)

