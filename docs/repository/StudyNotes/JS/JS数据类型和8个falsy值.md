### JavaScript基本类型

基本类型为`null`、`undefined`、`number`、`symbol`、`boolean`、`string`、`bigInt`(简单数据类型) | `object`(复杂数据类型)。

`Number`：为双精度浮点数64位类型。

`BigInt`：为任意精度数字类型。

引用数据类型为`Object`、`Array`、`Function`等。

### 简单数据类型（值类型）

|  |  |
| --- | --- |
| **类型** | **描述** |
| number | 用于表示数值，包括整数和浮点数。JavaScript中所有的数字都是以浮点数的形式存储的，遵循IEEE 754标准。 |
| string | 用于表示文本，可以是单引号或双引号包裹的一系列字符。 |
| boolean | 用于表示逻辑值，只有两个可能的值：`true` 和 `false` |
| null | 用于表示一个空值或不存在的对象引用。虽然`null`被视为一个对象，但在类型检查中它被认为是基本类型。 |
| undefined | 用于表示尚未赋值的变量，或函数返回没有明确返回值时的结果。 |
| symbol | ES6（ECMAScript 2015）引入的新类型，用于创建唯一的符号标识符，主要在对象的键中使用。 |
| bigint | ES10（ECMAScript 2019）引入的新类型，用于表示大于`Number.MAX\_SAFE\_INTEGER`（即2^53 - 1）的整数。 |

### 复杂数据类型（引用类型）

|  |  |
| --- | --- |
| **类型** | **描述** |
| [Object](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object) | 最通用的复杂数据类型，它可以包含键值对集合，以及方法和属性。 |
| [Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array) | 本质上是一种特殊的对象，用于存储有序的元素列表。 |
| [Function](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function) | 在JavaScript中，函数也是对象，可以作为数据进行传递。 |
| [Date](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date) | 表示日期和时间的对象。 |
| [Map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map) | `Map`对象保存**键值对**，并且能够记住键的**原始插入顺序**。任何值（对象或者[原始值](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive)）都可以作为键或值。 |
| [Set](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set) | `Set`对象允许你存储任何类型（无论是[原始值](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive)还是对象引用）的**唯一值**。 |
| [WeakMap](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) | `WeakMap`是一种**键值对的集合**，其中的键必须是对象或[非全局注册的符号](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol#%E5%85%A8%E5%B1%80%E5%85%B1%E4%BA%AB%E7%9A%84_symbol)，且值可以是任意的 [JavaScript 类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures)，并且不会创建对它的键的强引用。 |
| [WeakSet](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) | `WeakSet`是可被**垃圾回收的值的集合**，包括对象和[非全局注册的符号](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol#%E5%85%A8%E5%B1%80%E5%85%B1%E4%BA%AB%E7%9A%84_symbol)。WeakSet 中的值只能出现一次。它在 WeakSet 的集合中是唯一的。 |

### 假值

**假值**（falsy，有时写为 falsey）是在[布尔](https://developer.mozilla.org/zh-CN/docs/Glossary/Boolean)上下文中认定为 false 的值。

|  |  |  |
| --- | --- | --- |
| **值** | **类型** | **描述** |
| [null](https://developer.mozilla.org/zh-CN/docs/Glossary/Null) | Null | 关键词 [null](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/null) — 任何值的缺失。 |
| [undefined](https://developer.mozilla.org/zh-CN/docs/Glossary/Undefined) | Undefined | [undefined](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined) — 原始类型值。 |
| false | Boolean | 关键字 [false](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Lexical_grammar#%E5%85%B3%E9%94%AE%E5%AD%97) |
| [NaN](https://developer.mozilla.org/zh-CN/docs/Glossary/NaN) | Number | [NaN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN) — 不是一个数字。 |
| 0 | Number | [Number](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number) — 零，也包括 0.0、0x0 等。 |
| -0 | Number | [Number](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number) — 负的零，也包括 -0.0、-0x0 等。 |
| 0n | BigInt | [BigInt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt) — 零，也包括 0x0n 等。需要注意没有 [BigInt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 负的零 —— 0n 的相反数还是 0n |
| "" | String | 空[字符串](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)值，也包括`''`和````。 |
| [document.all](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/all) | Object | 唯一具有假值的 JavaScript 对象是内置的 [document.all](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/all)。非ie浏览器的第九个**falsy**值：`document.all`（已经弃用） |

```
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
<https://developer.mozilla.org/zh-CN/docs/Glossary/Falsy>