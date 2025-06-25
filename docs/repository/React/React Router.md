# React Router

> React Router 是一个用于 React 应用的路由库，允许在单页应用（SPA）中管理页面导航，无需刷新页面即可切换视图。
>

### React Router 核心概念

#### 路由类型

* **BrowserRouter**：基于 HTML5 的 History API 实现的(`history.pushState`等)。
* **HashRouter** ：基于 URL hash（如 `/#/about`），兼容性好但 SEO 不友好。
* **MemoryRouter** ：不操作 URL，适用于测试或非浏览器环境。

#### 核心组件

| 组件 | 作用 | 示例 |
| --- | --- | --- |
| **BrowserRouter** | 使用 HTML5 history API 的路由器 | `<BrowserRouter basename="/app">` |
| **HashRouter** | 使用 URL hash 的路由器 | `<HashRouter>` |
| **Routes** | 路由容器（v6+） | `<Routes>` |
| **Route** | 定义路由映射 | `<Route path="/" element={<Home/>}>` |
| **Link** | 声明式导航 | `<Link to="/about">About</Link>` |
| **NavLink** | 带激活状态的导航链接 | `<NavLink activeClassName="active">` |
| **Navigate** | 重定向组件 | `<Navigate to="/login" replace />` |
| **Outlet** | 嵌套路由的占位符 | `<Outlet />` |
| **useNavigate** |	编程式导航钩子|	`const navigate = useNavigate()` |

#### 核心Hook

| Hook | 用途 |
| --- | ---|
| **useParams** | 获取路径参数 |
| **useLocation** | 获取当前路径信息 |
| **useSearchParams** | 获并操作URL查询参数(分页导航、搜索) |
| **useNavigate** | 实现编程式导航 |
| **useMatch** | 判断当前是否匹配某个路径 |

::: code-group
```jsx [useParams]
import { useParams } from 'react-router-dom';
function UserProfile() {
  const { id } = useParams();
  return <div>User ID: {id}</div>;
}
```

```jsx [useLocation]
import { useLocation } from 'react-router-dom';
function UserProfile() {
  const location = useLocation();
  return <div>Location: {location.pathname}</div>;
}
```

```jsx [useSearchParams]
import { useSearchParams } from 'react-router-dom';

function SearchAndPaging() {
  const [searchParams, setSearchParams] = useSearchParams();
  // setSearchParams 可以动态修改查询字符串，并触发路由更新，适合搜索、分页、筛选等功能
  const search = searchParams.get('search') || '';
  const page = searchParams.get('page') || '1';
  
  const handleSearch = (e) => {
    setSearchParams({ search: e.target.value, page: 1 });
  };

  const changePage = (newPage) => {
    setSearchParams({ search, page: newPage });
  };

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="搜索..."
      />

      <button onClick={() => changePage(Number(page) + 1)}>
        下一页 ({page})
      </button>
    </div>
  );
}
```

```jsx [useNavigate]
import { useNavigate } from "react-router-dom";
function App() { 
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate("/about")}>About</button>
  )
}
```

```jsx [useMatch]
import { useMatch } from "react-router-dom";
function App() {
  const match = useMatch("/about");
  if (match) {
    return <h1>About 页面</h1>;
  }
  return <h1>Home 页面</h1>;
}
```
:::
### 如何配置基本路由

::: code-group
```jsx [传统方式 Routes + Route]
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/users" element={<Users />}>
        <Route index element={<UserList />} />
        <Route path=":id" element={<UserDetail />} />
      </Route>
      <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
```
```jsx [createBrowserRouter 配置]
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'user/:id', element: <UserDetail /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
```
:::

### 动态路由参数

使用 `:param` 定义动态路径参数，通过 `useParams` 获取：

```jsx
<Route path="/user/:id" element={<UserProfile />} />

// UserProfile.js
import { useParams } from 'react-router-dom';
function UserProfile() {
  const { id } = useParams();
  return <div>User ID: {id}</div>;
}
```

### 嵌套路由

使用 `Outlet` 渲染子路由。

```jsx
<Routes>
  <Route path="/dashboard" element={<Dashboard />}>
    <Route path="profile" element={<Profile />} />
    <Route path="settings" element={<Settings />} />
  </Route>
<Routers>

// Dashboard.js
import { Outlet } from 'react-router-dom';
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Outlet />
    </div>
  );
}
```

### 编程式导航

```jsx
import { useNavigate } from 'react-router-dom';
function Home() {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate('/dashboard')}>
      跳转至 Dashboard 页面
    </button>
  )
}
```

### 懒加载 + 异步加载组件

```jsx
import { lazy, Route, Suspense} from 'react';
const LazyComponent = lazy(() => import('./LazyComponent'));

<Route path="/dashboard" element={<Dashboard />}>
  <Suspense fallback="加载中...">
    <LazyComponent /> 
  </Suspense>
</Route>
```

### 重定向与 404 页面

使用 `*` 路径匹配未定义路由：

```jsx
<Routes>
  <Route path="*" element={<NotFound />} />
</Routes>
```


### React Router v6 和 v5 的主要区别？

* v6 使用 `Routes` 替代 `Switch`，支持相对路径。
* v6 提供数据 API（如 `loader` 和 `action`），简化数据获取。
* v6 移除 `Redirect`，改用 `Navigate` 组件实现重定向。
* v6 移除 `exact` 属性，路由匹配更智能。
* v6 添加了 `useParams` 和 `useLocation` Hooks。
* v6 Hooks（如 `useNavigate`）替代 v5 的 `useHistory`。
