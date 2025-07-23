# 什么是JSX

JSX 是 ECMAScript 一个类似 XML 的语法扩展。基本上它只是为 `React.createElement()` 函数提供语法糖，从而让在我们在 JavaScript 中，使用类 HTML 模板的语法，进行页面描述。

它需要通过 Babel 进行编译，需要借助 [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/babel-plugin-transform-react-jsx) 插件来实现。

在下面的示例中，`<h1>` 内的文本标签会作为 JavaScript 函数返回给渲染函数。

```jsx
class App extends React.Component {
  render() {
    return(
      <div>
        <h1>{'Welcome to React world!'}</h1>
      </div>
    )
  }
}
```
以上示例 render 方法中的 JSX 将会被转换为以下内容：

```js
React.createElement("div", null, React.createElement(
  "h1", null, 'Welcome to React world!'));
```