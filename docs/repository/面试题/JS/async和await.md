# async和await

### 是什么？

`async` 和 `await` 是JavaScript中用于**处理异步操作的关键字**。

`async` 关键词用于**声明一个异步函数**（async function），它使函数**始终返回一个** `Promise` **对象**。异步函数内部可以使用 `await` 关键字来**等待一个** `Promise` **对象的状态变化**。

`await` 关键字**只能在异步函数内部使用**，用于**等待一个返回** `Promise` **对象的表达式**。当遇到 `await` 关键字时，**异步函数会暂停执行**，直到**等待** `Promise` **对象状态变为** `resolved`（已完成）或 `reject`（已拒绝）。

+ 在 `Promise` 对象的状态变为 `resolved` 时，`await` 表达式会返回 `Promise` 对象的结果值；
+ 在 `Promise` 对象的状态变为 `rejected` 时，`await` 表达式会抛出一个异常，可以通过`try...catch`块来捕获和处理。

### 作用？

使用 `async` 和 `await` 可以使异步代码的编写和处理更加简洁，避免了回调函数的嵌套和 `Promise` 的链式调用。

### 怎么做？
```javascript
async function fetchData() {
  try {
    const result = await fetch('xxxxxx') // 等待fetch请求的结果
    const data = result.json() // 等待解析JSON数据
    console.log(data) // 处理异步操作成功的情况
  } catch (error) {
    console.error(error) // 处理异常操作失败的情况
  }
}
```

