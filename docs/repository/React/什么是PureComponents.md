# 什么是PureComponents?

`React.PureComponent` 与 `React.Component` 完全相同，只是它为你处理了 `shouldComponentUpdate()` 方法。当**属性或状态发生变化**时，`PureComponent` 将对属性和状态进行**浅比较**。

另一方面，一般的组件不会将当前的属性和状态与新的属性和状态进行比较。因此，在默认情况下，每当调用 `shouldComponentUpdate` 时，默认返回 `true`，所以组件都将重新渲染。


### PureComponent vs. React.memo

**PureComponent**：
* 适用于类组件，自动比较 `props` 和 `state`。
* 依赖类继承（`extends React.PureComponent`）。
  
**React.memo**：
* 适用于函数组件，仅比较 `props`（无 `state` ）。