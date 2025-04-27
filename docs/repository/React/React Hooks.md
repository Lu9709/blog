# React Hooks

### useState(状态) [:link:](https://zh-hans.react.dev/reference/react/useState)

它允许你向组件添加一个**状态变量**。

按照惯例使用**数组解构**来命名状态变量，例如 `[something, setSomething]`。

```jsx
const [n,setN] = React.useState(0)
const [user,setUser] = React.useState({name:'F'})
```
#### 语法
`useState` 返回一个只包含两个项的数组：

+ 该状态变量 当前的 `state`，最初设置为你提供的 初始化 `state`。
+ `set` 函数，它允许你在响应交互时将 `state` 更改为任何其他值。

::: warning 注意事项：
+ 调用 `set` 函数 不会 改变已经执行的代码中当前的 `state`。

```jsx
function MyComponent() {
  const [name, setName] = useState('Taylor');
  
  function handleClick() {
    setName('Robin');
    console.log(name); // Still "Taylor"!
  }
}
```
+ 不可以局部更新，使用**扩展操作符**来进行合并属性。
+ `setState(obj)`,`obj` 地址要变化，才会认为数据变化。

```jsx
const App = ()=>{
  const [user,setUser] = useState({name:'lz',age:'18'})
  setUser({
    ...user,
    name:'tm'
  })
}
```
:::

`useState` 接受函数，便于计算处理。但为了**避免重复创建初始状态**，你可以将它**作为初始化函数传递**给 `useState`，但如果初始化需要经过大量计算来初始化状态，则可以使用函数来初始化状态。

```jsx
const [state,setState] = useState(()=>{
  return initialState
}) // 该函数返回初始state,且只执行一次

// 惰性初始化（适用于计算成本较高的初始状态）
const [data, setData] = useState(() => {
  return computeInitialData();
});
```

`setState` 接受函数 `setN(i=>i+1)`，<font style="color: red">优先使用这种形式</font>，例子中目标是使得x点击后加而，使用两次 `set(x+1)` 的结果是1，这是因为每次 `setX(x+1)` 返回的是一个新的对象并没有改变x的值。

```jsx
//例子
const App = () => {
  const [x, setX] = useState(0)
  const click = () =>{
    setX(x+1)
    setX(x+1) 
    // setX(i => i + 1)
    // setX(i => i + 1)
  }
  return (
    <>
    <h1>{x}</h1>
    <button onClick={click}>add + 2</button>
    </>
  )
}
```

#### 特性与行为

1. 初始状态
    + `initialState` 可以是一个值或一个函数（惰性初始化）
2. 状态更新
    + 调用 `setState` 会触发组件重新渲染。
    + 如果状态是对象或数组，需要手动合并新旧状态。
3. 异步更新
    + `setState` 是异步的，React 会批量处理状态更新以提高性能。
    + 如果需要基于当前状态更新，应使用函数式更新。
4. 不可变性
    + React 状态是不可变的，不能直接修改状态值。
    + 必须通过 `setState` 创建新的状态对象或值。

#### 使用场景

+ 简单状态管理：如计数器、开关状态（布尔值）。
+ 复杂状态管理：如表单数据、列表项、对象状态。
+ 动态交互：根据用户输入或事件更新 UI。

### useEffect(副作用) [:link:](https://zh-hans.react.dev/reference/react/useEffect)

#### 语法
`useEffect` 是在浏览器渲染完成后执行,<font style="color: red;">所谓对环境的改变</font>即<font style="color: red;">副作用</font>，<font style="color: red;">处理自己产生的垃圾</font>，可以理解为`afterRender`，<font style="color: red;">每次render后执行的事</font>。

```jsx
useEffect(() => {
  // 执行副作用逻辑

  return () => {
    // 清理逻辑（可选）
  };
}, [dependencies]); // 依赖数组（可选）
```

如果有多个`useEffect`，会按照<font style="color: red;">出现次序执行</font>

#### 特性与行为

* 默认行为
  `useEffect` 默认会在**每次渲染后执行**。
  ```jsx
  useEffect(() => {
    console.log("组件渲染后执行");
  });

* `[]` 空数组
  如果依赖数组为空，`useEffect` 只会在组件**首次渲染时执行一次**，相当于类组件中的 `componentDidMount`
  ```jsx
  useEffect(() => {
    console.log("组件首次渲染");
  }, []);
  ```

* `[n]` 依赖数组

  如果提供了**依赖数组**，`useEffect` 会在**依赖值发生变化时重新执行**。
  ```jsx
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(`count 更新为 ${count}`);
  }, [count]);
  ```

* 清除函数
  
  `useEffect` 可以返回一个清理函数，在组件卸载或下一次副作用执行前运行。
  ```jsx
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("定时器运行中...");
    }, 1000);

    return () => {
      clearInterval(intervalId); // 清理定时器
      console.log("定时器已清理");
    };
  }, []);
  ```

#### 使用场景

1. 数据获取(组件加载时从API获取)
2. 订阅事件(监听浏览器事件或其他外部事件)
3. 手动DOM操作
4. 定时器设置/清除

#### 模拟生命周期

- `componentDidMount`，即 `useEffect(()=>{},[])`
- `componentDidUpdate`，即 `useEffect(()=>{})` 默认是所有的 `state` 变化,可以指定 `useEffect(()=>{},[n])`
- `componentWillUnmount`，即 `useEffect(()=>{return ()=>console.log('xxx') })` 举例若是设置了一个定时器可以通过return的时候销毁定时器。

### useLayoutEffect [:link:](https://zh-hans.react.dev/reference/react/useLayoutEffect)

`useLayoutEffect` 在浏览器渲染前执行(比 `useEffect` 先执行),`useLayoutEffect`里的任务最好影响了 `Layout`,为了用户体验,优先使用 `useEffect`。


#### 使用场景

在浏览器重新绘制屏幕前计算布局。

```jsx
function App() {
  const [n,seN] = useState(0)
  const time = useRef(null)
  const onclick = ()=>{
    seN(n+1)
    time.current = performance.now()
  }
  useLayoutEffect(()=>{
    if(time.current){
      console.log(performance.now()-time.current)
    }
  })
  return(<div>{n}<button onClick={onclick}>+1</button></div>)
}
ReactDOM.render(<><App/> </>, document.getElementById('root'));
```


### useContext(上下文)

**全局变量**是全局的上下文。上下文是局部的全局变量(模块内值的改变其他模块是不知道的，通过重新渲染得到)，更新是**逐上而下**的。

`useContext` 可以让你**读取**和**订阅**组件中的 `context`。

::: code-group
```jsx [案例一]
const context = React.createContext(null) //创建上下文
function App() {
  const [x, setX] = useState(0)
  return (
    <context.Provider value={{x, setX}}> //圈定作用域
      <Father/>
    </context.Provider>
  )
}
function Father() {
  const  {x,setX} = useContext(context)//作用域内使用上下文
  return (<><p>我是father{x}</p><Child/></>)
}
function Child() {
  const {x,setX} = useContext(context)
  return (<>我是儿子{x}<button onClick={()=>setX(x+1)}>+1</button></>)
}
ReactDOM.render(<><App/></>,document.getElementById('root');
```

```jsx [案例二]
const Context = React.createContext(null);
export default function App() {
  const [x, setX] = useState(0);
  return (
    <Context.Provider value={{ x, setX }}>
      <Father />
    </Context.Provider>
  );
}

const Father = () => {
  const { x, setX } = useContext(Context); //作用域内使用上下文
  return (
    <>
      <p>我是father{x}</p>
      <Child />
    </>
  );
};

const Child = () => {
  return (
    <Context.Consumer>
      {(value) => (
      <>
        我是儿子{value.x}
        <button onClick={() => value.setX(value.x - 1)}>-1</button>
      </>
    )}
    </Context.Consumer>
  );
};

```

:::

#### React.createContext()
```plain
const MyContent = React.creatContext(defalutValue)
```

创建一个`Context`对象。当React渲染一个`Context`对象时会读取组件中提供`Provide`中的`context`值，若是无法匹配则使用`defalutValue`的默认值。

### useReducer(Redux)
```jsx
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

步骤：

1. 创建初始值`initialState`
2. 创建所有操作`reuder(state,action)`
3. 传给`useReducer`，得到读写的API
4. 调用写`({type:'操作类型')`

`useReducer`相当与`useState`的升级版

```jsx
import {useReducer} from  'react'
const initialState = {x:0};
const reducer=(state,action)=>{
  if(action.type === 'add'){
    return {x:state.x + action.number}
  }else if(action.type === 'multi'){
    return {x:state.x * (action.number)}
  }
}
function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  const onClick1=()=>{
    dispatch({type:'add',number:1})
  }
  const onClick2=()=>{
    dispatch({type:'multi',number:2})
  }
  return (
    <>
    {state.x}
    <button onClick={onClick1}>+1</button>
    <button onClick={onClick2}>*2</button>
    </>
  );
}

export default App;
//例子二
import {useReducer} from 'react'
const initialState = {
  name: 'lz',
  age: '13',
  gender: 'male'
};
const reducer = (state, action) => {
  switch (action.type) {
    case 'update':
      return {...state, ...action.state}
    case 'reset':
      return initialState
    default :
      throw new Error('错误')
  }
}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const onSubmit = (e) => {
    e.preventDefault()
  }
  const onReset = () => {
    dispatch({type: 'reset'})
  }
  return (
    <>
      <form onSubmit={onSubmit} onReset={onReset}>
        <div>
          <label> name:
       		<input value={state.name} onChange={e =>
         	 dispatch({type: 'update', state: {name: e.target.value}})}/>
          </label>
     		</div>
       	<div>
          <label> age:
          <input value={state.age} onChange={e =>
               dispatch({type: 'update', state: {age: e.target.value}})}/>
          </label>
        </div>
        <div>
          <label> gender:
            <input value={state.gender} onChange={e =>
              dispatch({type: 'update', state: {gender: e.target.value}})}/>
          </label>
        </div>
      <button type='submit'>onSubmit</button>
      <button type='reset'>onReset</button>
    </form>
  </>
);
}

export default App;
```

用`useReducer`代替`Redux`

步骤：

1. 将数据集中在一个`store`对象
2. 将所有操作集中在`reducer`
3. 创建一个`Context`
4. 创建对数据的读写API
5. 将第四步的内容放到第三步
6. 用`Context.Provider`将`Context`提供给所有组件
7. 各个组件用`useContext`获取读写API

[代码参考](https://codesandbox.io/s/priceless-jennings-gyls6)

### React.meno
React默认会有多余的reder，但props不变就没必要执行一个函数组件。下面的例子中点击后n变化了,m没有变化但是也重新渲染了,为了提高组件性能可以使用`React.memo`将组件包裹起来,可检查`props`变更,若是不变化则<font style="color: red;">复用之前的渲染结果</font>。默认浅层对比，可传入第二个参数来实现。

```jsx
function App() {
  const [n, setN] = React.useState(0);
  const [m, setM] = React.useState(0);
  const onClick = () => {
    setN(n + 1);
  };
  return (
    <div className="App">
    <div>
    <button onClick={onClick}>update n {n}</button>
    </div>
    <Child2 data={m}/>
    {/* <Child data={m}/> */}
    </div>
  );
}
function Child(props) {
  console.log("child 执行了");
  console.log('假设这里有大量代码')
  return <div>child: {props.data}</div>;
}
const Child2 = React.memo(props=> {
  console.log("child 执行了");
  console.log('假设这里有大量代码')
  return <div>child: {props.data}</div>;
})
```

但有个bug，如果有函数的话,这个组件就会重新`render`,因为两个新旧函数的地址不一样,使用`useMemo`可解决这个问题。

```jsx
function App() {
  const [n, setN] = React.useState(0);
  const [m, setM] = React.useState(0);
  const onClick = () => {setN(n + 1);};
  const onClickChild = () => {console.log(m);};
  return (
    <div className="App">
    <div>
    <button onClick={onClick}>update n {n}</button>
    </div>
    <Child2 data={m} onClick={onClickChild} />
    {/* Child2 居然又执行了 */}
    </div>
  );
}
function Child(props) {
  console.log("child 执行了");
  console.log("假设这里有大量代码");
  return <div onClick={props.onClick}>child: {props.data}</div>;
}
const Child2 = React.memo(Child);
```

### userMemo
第一个参数必须<font style="color: red;">以箭头函数的形式</font>`()=>value`,第二个参数为依赖。当依赖发生调用的时候，才会计算出新的value。依赖不变使用旧值。(类似与Vue2的computed)

参照上个例子可以添加一行，当n更新时不会打印出Child组件的内容。

```jsx
const onClickChild = useMemo(
  ()=>{return ()=>console.log(m)}
  ,[m])
```

### useCallback
相当于一个语法糖`useCallback(x=>console.log(x),[m])`等价于`useMemo(()=>x=>console.log(x),[m])`

上面的代码可以改写为

```jsx
const onClickChild = useCallback(()=>console.log(m),[m])
```

### useRef(引用)
用途:引用DOM对象或普通对象。

目的是需要一个值,在组件不断<font style="color: red;">render时保持不变</font>，useRef能保证是<font style="color: red;">同一个值</font>。

```jsx
function App() {
  const [n, setN] = React.useState(0);
  const [_, set_] = React.useState(null)
  const count = React.useRef(0)// 初始化 {current:0}
  const onClick1 = () => {
    setN(n + 1);
  };
  const onClick2 = ()=> {
    set_(Math.random())
    initial.current +=1
    console.log(initial.current)
  }
  React.useEffect(
    ()=>{
      count.current +=1
      console.log(count.current)//读取
    }
  )
  return (
    <div className="App">
    <button onClick={onClick1}>update n {n}</button>
    <button onClick={onClick2}>update count.current {count.current}</button>
    </div>
  );
}
```

useRef不能做到自动`render`,需要自己加,监听ref,当`ref.current`变化时,调用`set`。

Vue3的`ref`可以做到当`count.value`变化时,Vue3会自动render

#### React.forwardRef
函数组件不支持ref,类组件支持

```jsx
function App() {
  const buttonRef = useRef(null);
  return (
    <div className="App">
    <Button2 ref={buttonRef}>按钮</Button2>
    </div>
  );
}
const Button2 = props => {
  return <button className="red" {...props} />;
};
```

要使用ref，需要用`forwardRef`，可以把`Button3`的ref传递给`forwardRef`，根据参数返回一个button组件。

```jsx
function App() {
  const buttonRef = React.useRef(null);
  return (
    <div className="App">
    <Button3 ref={buttonRef}>按钮</Button3>
    </div>
  );
}

const Button3 = React.forwardRef((props, ref) => {
  return <button className="red" ref={ref} {...props} />;
});
```

### useImperativeHandle
可以让你在使用 ref 时自定义暴露给父组件的实例值。[useImperativeHandle ](https://zh-hans.reactjs.org/docs/hooks-reference.html#useimperativehandle)应当与 [forwardRef](https://zh-hans.reactjs.org/docs/react-api.html#reactforwardref) 一起使用。

```jsx
useImperativeHandle(ref, createHandle, [deps])
```

### 自定义Hook
```jsx
function useList() {
  const [list, setList] = useState(null)
  useEffect(() => {
    ajax("/list").then(list => {
      setList(list);
    })
  }, [])
  return {
    list:list,
    deleteIndex: index => {
      setList(list.slice(0, index).concat(list.slice(index+1)))
    }
  }
}
function ajax() {
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve([
        {id:"1",name:"John"},
        {id:"2",name:"Tom"},
        {id:"3",name:"Jim"},
        {id:"4",name:'lu'}
      ])
    })
  })
}
function App() {
    const {list, deleteIndex} = useList(null)
    return (
      <div>
      <h1>List</h1>
        {
          list ?
          <ol>
          {
            list.map((item, index) => (
              <li key={item.id}>{item.name}
                <button onClick={() => {deleteIndex(index)}}>delete</button>
              </li>
              )
            )
          }
          </ol>
        : "load"
      }
      </div>
  )
}
```

[Github例子链接](https://github.com/Lu9709/react-demo-hook-1)

### StaleClosure
过时闭包——[参考链接](https://dmitripavlutin.com/react-hooks-stale-closures/)

