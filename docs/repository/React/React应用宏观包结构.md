# React 应用宏观包结构

### 基本包结构

1. **react**
  > react 基本包，只提供 react 组件(`ReactElement`)的必要函数，一般来说需要和渲染器(`react-dom`,`react-native`)一同使用。
  > 在编写 `react` 应用的代码时，大部分调用此包的API。

2. **react-dom**
  > react 渲染器之一，是react与web平台连接的桥梁(浏览器、nodejs环境中使用)，将 `react-reconciler` 中的运行结果输出到web界面上，在编写 `react` 应用的代码时，能用到此包的一个入口函数 `ReactDOM.render(<App/>, document.getElementById('root'))`。

3. **react-reconciler**
  > react 得以运行的核心包(综合协调 `react-dom`、`react`、`scheduler` 各包之间的调用与配合)。
  > 管理 react 应用状态的输入和结果输出，将输入信号最终转换成输出信号传递给渲染器。

  * 接受输入(`schedulerUpdateOnFiber`)，将 `fiber` 树生成逻辑封装到一个回调函数中(涉及 `fiber` 树形结构，`fiber.updateQueue` 队列, 调和算法等)
  * 把此回调函数(`performSyncWorkOnRoot` 或 `performConcurrentWorkOnRoot`)送入 `scheduler` 进行调度
  * `scheduler` 会控制回调函数执行的时机, 回调函数执行完成后得到全新的 `fiber` 树
  * 再调用渲染器(如`react-dom`, `react-native`等)将 `fiber` 树形结构最终反映到界面上

4. **scheduler**
  > 调度机制的核心实现, 控制由 `react-reconciler` 送入的回调函数的执行时机, 在 `concurrent` 模式下可以实现任务分片。

### 架构分层

为了便于理解，可将 react 应用整体结构分为接口层(api)和内核层(core)2 个部分。

#### 接口层(api)

`react` 包, 平时在开发过程中使用的绝大部分api均来自此包(不是所有). 在 `react` 启动之后, 正常可以改变渲染的基本操作有 3 个.

* class 组件中使用`setState()`
* function 组件里面使用 hook,并发起 `dispatchAction` 去改变 hook 对象
* 改变 `context`(其实也需要 `setState` 或 `dispatchAction` 的辅助才能改变)
  
以上 `setState` 和 `dispatchAction`都由 `react` 包直接暴露. 所以要想 `react` 工作, 基本上是调用 `react` 包的 `api` 去与其他包进行交互。

#### 内核层(core)

整个内核部分，由三部分构成

1. 调度器
    `scheduler` 包，核心职责只有一个，就是**执行回调**。
     * 把 `react-reconciler` 提供的回调函数, 包装到一个任务对象中.
     * 在内部维护一个任务队列, 优先级高的排在最前面.
     * 循环消费任务队列, 直到队列清空.
2. 构造器
    `react-reconciler` 包， 有 3 个核心职责:
    * 装载渲染器, 渲染器必须实现 `HostConfig` [协议](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/README.md#practical-examples)(如: `react-dom`), 保证在需要的时候, 能够正确调用渲染器的 api, 生成实际节点(如: dom节点).
    * 接收 `react-dom` 包(初次 `render` )和 `react` 包(后续更新 `setState` )发起的更新请求.
    * 将 `fiber` 树的构造过程包装在一个回调函数中, 并将此回调函数传入到 `scheduler` 包等待调度.
3. 渲染器
    * `react-dom` 包, 有 2 个核心职责:
    * 引导 `react` 应用的启动(通过 `ReactDOM.render` ).
    * 实现 `HostConfig` 协议, 能够将 `react-reconciler` 包构造出来的 `fiber` 树表现出来, 生成 dom 节点(浏览器中), 生成字符串(ssr).
  
### 内核关系

![React内核关系](attachments/React内核关系.png)