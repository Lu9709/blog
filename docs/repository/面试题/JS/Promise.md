# Promise

### 是什么？

`Promise` 是JavaScript中的一种**异步编程解决方案**。它是一种用于**处理异步操作的对象**，可以将异步操作以更加直观的和可读的方式近些编写和管理。

使用 `Promise` 可以**避免回调地狱**，通过**链式调用**和**异常处理机制**，使异步代码更加清晰和可控。

`Promise` 的几种状态：

+ 待定（`pending`）初始状态，既没有被兑现，也没有被拒绝。
+ 已兑现（`fulfilled`）操作成功完成。
+ 已拒绝（`rejected`）操作失败。
+ 已敲定（`settled`）已经被兑现（`fulfilled`）或被拒绝（`rejected`）。

**状态变化**：

初始状态为 `pending`，表示异步操作尚未完成。当异步操作成功完成时，`Promise` 进入 `fulfilled` 状态；当异步操作失败或出现错误时，`Promise` 进入 `rejected` 状态。状态的改变是不可逆的，一旦从 `pending` 进入 `fulfilled` 或 `rejected`，就不可再变为其他状态。

### Promise相关技术

1. `then` 方法：`Promise` 对象的 `then` 方法用于注册回调函数，在异步操作成功时执行成功的回调函数，或在异步操作失败时执行失败的回调函数。`then` 方法可以通过链式调用，将多个异步操作串联起来。
2. `catch` 方法：`Promise` 对象的 `catch` 方法用于捕获异常和处理异步操作的失败情况。它可以在 `then` 方法链的末尾添加一个失败的回调函数，用于处理任何发生的错误。
3. `Promise.all` 方法：`Promise.all` 方法接收一个 `Promise` 对象的数组作为参数，返回一个新的 `Promise` 对象。该新的 `Promise` 对象在数组中所有的 `Promise` 对象都成功完成后才会进入成功状态，并返回所有`Promise`对象的结果组成的数组；如果数组中任意一个 `Promise` 对象失败，则新的`Promise` 对象会进入失败状态。
4. `Promise.race` 方法：`Promise.race` 方法接收一个 `Promise` 对象的数组作为参数，返回一个新的 `Promise` 对象。该新的 `Promise` 对象在数组中任意一个 `Promise` 对象完成（无论成功还是失败）后就会进入相应的状态，并返回该 `Promise` 对象的结果。
5. `Promise.resolve` 方法：`Promise.resolve` 方法返回一个已经处于 `fulfilled` 状态的 `Promise` 对象，可以指定该对象的最终结果。
6. `Promise.reject` 方法：`Promise.reject` 方法返回一个已经处于 `rejected` 状态的 `Promise` 对象，可以指定该对象的失败原因。
7. 异步函数（Async Function）：异步函数是使用 `async` 关键字定义的函数，它内部可以使用 `await` 关键字来等待一个 `Promise` 对象的状态变化。异步函数返回一个 `Promise` 对象，并通过 `Promise` 的 `resolve` 或 `reject` 方法来指定最终的结果。

