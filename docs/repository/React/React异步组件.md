# React异步组件

> `lazy` 能够在组件第一次被渲染之前延迟加载组件的代码
> `Suspense` 允许组件在加载其子组件时等待。

**`React.Lazy`的定义**

`React.lazy` 接受一个函数，该函数必须返回一个 `Promise`。

`Promise` 解析后，必须提供一个包含**默认导出**（`default`）的模块对象，例如 `{ default: SomeComponent }`。

**实现异步组件**

1. 通过 `import()` 函数**动态加载组件**。
2. 使用 `React.lazy` 接受一个函数，函数需要动态调用 `import()`。
3. 然后在 `Suspense` 组件中渲染该组件，`fallback` 属性指定在**加载组件时显示的组件**。


代码案例如下所示：

```jsx
import React, { Suspense } from 'react';
const LazyComponent = React.lazy(() => import('./LazyComponent'));
const MyComponent = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  )
}
const delayForDemo = (promise) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 2000);
  }).then(() => promise);
}
```

参考链接：[React Lazy](https://zh-hans.react.dev/reference/react/lazy)