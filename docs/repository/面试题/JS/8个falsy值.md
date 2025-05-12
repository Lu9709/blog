# 8个falsy值


### 假值

**假值**（falsy，有时写为 falsey）是在[布尔](https://developer.mozilla.org/zh-CN/docs/Glossary/Boolean)上下文中认定为 false 的值。

| **值** | **类型** | **描述** |
| --- | --- | --- |
| [null](https://developer.mozilla.org/zh-CN/docs/Glossary/Null) | Null | 关键词 [null](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/null) — 任何值的缺失。 |
| [undefined](https://developer.mozilla.org/zh-CN/docs/Glossary/Undefined) | Undefined | [undefined](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined) — 原始类型值。 |
| false | Boolean | 关键字 [false](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Lexical_grammar#%E5%85%B3%E9%94%AE%E5%AD%97) |
| [NaN](https://developer.mozilla.org/zh-CN/docs/Glossary/NaN) | Number | [NaN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN) — 不是一个数字。 |
| 0 | Number | [Number](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number) — 零，也包括 0.0、0x0 等。 |
| -0 | Number | [Number](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number) — 负的零，也包括 -0.0、-0x0 等。 |
| 0n | BigInt | [BigInt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt) — 零，也包括 0x0n 等。需要注意没有 [BigInt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt)<br/> 负的零 —— 0n 的相反数还是 0n |
| "" | String | 空[字符串](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)值，也包括`''` 和 ` `` `。 |
| [document.all](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/all) | Object | 唯一具有假值的 JavaScript 对象是内置的 [document.all](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/all)。<br/>非ie浏览器的第九个**<font style="color:rgb(27, 27, 27);">falsy</font>**值：`document.all`（已经弃用） |


```javascript
if (false)
if (null)
if (undefined)
if (0)
if (0n)
if (NaN)
if ('')
if ("")
if (``)
if (document.all)
```
### 参考链接

[假值 - MDN Web 文档术语表：Web 相关术语的定义 | MDN](https://developer.mozilla.org/zh-CN/docs/Glossary/Falsy)
