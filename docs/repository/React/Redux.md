# Redux

> Redux 是一个状态管理库/状态容器

### 三大原则

**单一数据源**：整个应用的 全局 `state` 被储存在一棵 `object tree` 中，并且这个 `object tree` 只存在于唯一一个 `store` 中。

**State 是只读的**：唯一改变 `state` 的方法就是触发 `action`，`action` 是一个用于描述已发生事件的普通对象。

**使用纯函数来执行修改**：为了描述 `action` 如何改变 `state tree` ，你需要编写纯reducers。（函数的返回结果只依赖于它的输入，而且它没有副作用）。

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