```jsx
import { useEffect,useState,useRef } from "react";
import "./styles.css";
export default function App() {
  const [visible, setNextVisible] = useState(true)
  const onClick = ()=>{ setNextVisible(!visible) }
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      {visible ? <Baizhe/> : null}
      <div> <button onClick={onClick}>toggle</button> </div>
    </div>
  );
}
function Baizhe(props){
  const [n, setNextN] = useState(0)
  const first = useRef(true)
  useEffect(()=>{
    if(first.current === true ){ return }
    console.log('did update')
  })
  useEffect(()=>{
    console.log('did mount')
    first.current = false
    return ()=>{
      console.log('did unmount')
    }
  }, [])
  const onClick = ()=>{
    setNextN(n+1)
  }
  return (
    <div>Frank
      <button onClick={onClick}>+1</button>
    </div>
  )
}
```

