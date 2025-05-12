# JS基本数据类型

| string | number | boolean | symbol | bigint | undefined | null | object |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 字符串 | 数字 | 布尔 | 符号 | 大整数 | `undefined` | `null` | 对象 |


> `symbol` 和 `bigint` 是新的，其他的6种类型是ES6之前的。
>

#### 什么时候用 `undefined`？什么时候用 `null`？
如果非对象为空用 `undefined`，如果是对象为空用 `null`。

#### 为什么不用 `number` 而用 `bigint`？
`number` 是**双精度浮点数**，是64位的，位数不够的时候可以用 `bigint`(`bigint` 为**任意精度数字**类型，只接受**整数**)。

#### 简单数据类型（值类型）
| **类型** | **描述** |
| --- | --- |
| number | 用于表示数值，包括整数和浮点数。JavaScript中所有的数字都是以浮点数的形式存储的，遵循IEEE 754标准。 |
| string | 用于表示文本，可以是单引号或双引号包裹的一系列字符。 |
| boolean | 用于表示逻辑值，只有两个可能的值：`true` 和 `false` |
| null | 用于表示一个空值或不存在的对象引用。虽然`null`被视为一个对象，但在类型检查中它被认为是基本类型。 |
| undefined | 用于表示尚未赋值的变量，或函数返回没有明确返回值时的结果。 |
| symbol | ES6（ECMAScript 2015）引入的新类型，用于创建唯一的符号标识符，主要在对象的键中使用。 |
| bigint | ES10（ECMAScript 2019）引入的新类型，用于表示大于`Number.MAX_SAFE_INTEGER`（即2^53 - 1）的整数。 |


#### 复杂数据类型（引用类型）
| **类型** | **描述** |
| --- | --- |
| [Object](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object) | 最通用的复杂数据类型，它可以包含键值对集合，以及方法和属性。 |
| [Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array) | 本质上是一种特殊的对象，用于存储有序的元素列表。 |
| [Function](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function) | 在JavaScript中，函数也是对象，可以作为数据进行传递。 |
| [Date](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date) | 表示日期和时间的对象。 |
| [Map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map) | `Map`对象保存**键值对**，并且能够记住键的**原始插入顺序**。任何值（对象或者[原始值](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive)）都可以作为键或值。 |
| [Set](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set) | `Set`对象允许你存储任何类型（无论是[原始值](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive)还是对象引用）的**唯一值**。 |
| [WeakMap](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) | `WeakMap`是一种**键值对的集合**，其中的键必须是对象或[非全局注册的符号](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol#%E5%85%A8%E5%B1%80%E5%85%B1%E4%BA%AB%E7%9A%84_symbol)，且值可以是任意的 [JavaScript 类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures)，并且不会创建对它的键的强引用。 |
| [WeakSet](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) | `WeakSet`是可被**垃圾回收的值的集合**，包括对象和[非全局注册的符号](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol#%E5%85%A8%E5%B1%80%E5%85%B1%E4%BA%AB%E7%9A%84_symbol)。WeakSet 中的值只能出现一次。它在 WeakSet 的集合中是唯一的。 |

