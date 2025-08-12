# Redux

> Redux 是一个状态管理库/状态容器

### 三大原则

**单一数据源**：整个应用的 全局 `state` 被储存在一棵 `object tree` 中，并且这个 `object tree` 只存在于唯一一个 `store` 中。

**State 是只读的**：唯一改变 `state` 的方法就是触发 `action`，`action` 是一个用于描述已发生事件的普通对象。

**使用纯函数来执行修改**：为了描述 `action` 如何改变 `state tree` ，你需要编写纯reducers。（函数的返回结果只依赖于它的输入，而且它没有副作用）。

::: tip **总结**
* **Redux 是一个管理全局应用状态的库**
  * Redux 通常与 React-Redux 库一起使用，把 Redux 和 React 集成在一起
  * Redux Toolkit 是编写 Redux 逻辑的推荐方式
* **Redux 使用 "单向数据流"**
  * State 描述了应用程序在某个时间点的状态，视图基于该 state 渲染
  * 当应用程序中发生某些事情时：
    * 视图 dispatch 一个 action
    * store 调用 reducer，随后根据发生的事情来更新 state
    * store 将 state 发生了变化的情况通知 UI
    * 视图基于新 state 重新渲染
* **Redux 有这几种类型的代码**
  * Action 是有 `type` 字段的纯对象，描述发生了什么
  * Reducer 是纯函数，基于先前的 state 和 action 来计算新的 state
  * 每当 dispatch 一个 action 后，store 就会调用 root reducer
:::

### connect是什么

`connect` 是一个函数，它帮你把 Redux 中的 `state` 和 `dispatch` 方法变成组件的 `props`，让组件可以读取和修改 Redux 的状态。 

::: code-group
```jsx [传统写法]
import { connect } from 'react-redux';

function MyComponent({ name, setName }) {
  return (
    <div>
      <p>Hello, {name}</p>
      <button onClick={() => setName('Tom')}>Set Name</button>
    </div>
  );
}

// 1. 映射 state 到 props
const mapStateToProps = (state) => ({
  name: state.name,
});

// 2. 映射 dispatch 到 props
const mapDispatchToProps = (dispatch) => ({
  setName: (name) => dispatch({ type: 'SET_NAME', payload: name }),
});

// 3. 使用 connect 连接组件与 Redux Store
export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);
```
```jsx [Hooks写法]
import { useSelector, useDispatch } from 'react-redux';

function MyComponent() {
  const name = useSelector((state) => state.name);
  const dispatch = useDispatch();

  return (
    <div>
      <p>Hello, {name}</p>
      <button onClick={() => dispatch({ type: 'SET_NAME', payload: 'Tom' })}>
        Set Name
      </button>
    </div>
  );
}
```
:::
### mapStateToProps() 和 mapDispatchToProps() 之间有什么区别?

`mapStateToProps`: 把 Redux 的状态（state）映射成组件的 props

`mapDispatchToProps`: 把 dispatch 方法映射成组件的 props，用来派发 action

### Redux 如何处理异步操作？

通过中间件处理：

Redux Thunk：处理简单异步
Redux Saga：处理复杂异步流


### 参考链接

[Redux 中文文档](https://cn.redux.js.org/tutorials/essentials/part-1-overview-concepts)