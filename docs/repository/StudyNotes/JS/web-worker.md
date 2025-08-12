# web-worker

> JavaScript 语言是单线程的，所有任务只能在一个线程上执行，不能同时做两件事。
>
> WebWorker 为 Web 内容在后台线程中运行脚本提供了一种简单的方法。线程可以执行任务而不干扰用户界面。
> 
> 此外，它们可以使用 `XMLHttpRequest`（尽管 `responseXML` 和 `channel` 属性总是为空）或 `fetch`（没有这些限制）执行 I/O。
> 
> 一旦创建，一个 worker 可以将消息发送到创建它的 JavaScript 代码，通过将消息发布到该代码指定的事件处理器（反之亦然）。



::: tip Web Worker 有以下注意点：

1. **同源限制**

分配给 Worker 线程运行的脚本文件，必须与主线程的脚本文件同源。

2. **DOM 限制**

Worker 线程所在的全局对象，与主线程不一样，无法读取主线程所在网页的 DOM 对象，也无法使用 `document`、`window`、`parent` 这些对象。但是，Worker 线程可以使用 `navigator` 对象和 `location` 对象。

3. **通信联系**

Worker 线程和主线程不在同一个上下文环境，它们不能直接通信，必须通过消息完成。

4. **脚本限制**

Worker 线程不能执行 `alert()` 方法和 `confirm()` 方法，但可以使用 `XMLHttpRequest` 对象发出 AJAX 请求。

5. **文件限制**

Worker 线程无法读取本地文件，即不能打开本机的文件系统（`file://`），它所加载的脚本，必须来自网络。

:::

### 基本用法

#### 主线程

主线程采用 `new` 命令，调用 `Worker()` 方法创建 Worker 线程，并传入脚本路径。

```js
const worker = new Worker('worker.js');
```
`Worker()` 构造函数的参数是一个脚本文件，该文件就是 Worker 线程所要执行的任务。由于 Worker 不能读取本地文件，所以这个脚本**必须**来自网络。如果下载没有成功（比如404错误），Worker 就会失败。

然后，主线程调用 `worker.postMessage()` 方法，向 Worker 线程发送消息。

```js
worker.postMessage('hello');
worker.postMessage({ method: 'echo', args: ['Work'] });
```

`worker.postMessage()` 方法的参数，就是主线程传给 Worker 的数据。它可以是各种数据类型，包括二进制数据。

接着，主线程通过 `worker.onmessage` 指定监听函数，接收子线程发回来的消息。

```js
worker.onmessage = function (event) {
  console.log('Received message ' + event.data);
  doSomething();
}

function doSomething() {
  // 执行任务
  worker.postMessage('Work done!');
}
```

上面代码中，事件对象的`data`属性可以获取 Worker 发来的数据。

Worker 完成任务以后，主线程就可以把它关掉。

```js
worker.terminate();
```


#### worker线程

Worker 线程内部需要有一个监听函数，监听`message`事件。

```js
// 写法一
self.addEventListener('message', function (e) {
  postMessage('You said: ' + e.data);
});

// 写法二
addEventListener('message', function (e) {
  postMessage('You said: ' + e.data);
}, false);
```

除了使用 `self.addEventListener()` 指定监听函数，也可以使用 `self.onmessage` 指定。监听函数的参数是一个事件对象，它的 `data` 属性包含主线程发来的数据。`self.postMessage()`方法用来向主线程发送消息。

根据主线程发送来的数据，Worker 线程调用不同的方法，案例如下:

```js
var data = e.data;
  switch (data.cmd) {
    case 'start':
      self.postMessage('WORKER STARTED: ' + data.msg);
      break;
    case 'stop':
      self.postMessage('WORKER STOPPED: ' + data.msg);
      self.close(); // 终止 Worker 线程 / Terminates the worker.
      break;
    default:
      self.postMessage('Unknown command: ' + data.msg);
  };
}, false);
```

#### Worker 加载脚本

Worker 内部如果要加载其他脚本，有一个专门的方法 `importScripts()`，该方法可以同时加载多个脚本。

```js
// 加载 script.js
importScripts('script.js');
// 加载 script1.js 和 script2.js
importScripts('script1.js', 'script2.js');
```

#### 错误处理

主线程可以监听 Worker 是否发生错误。如果发生错误，Worker 会触发主线程的 `error` 事件。

```js
worker.onerror(function (event) {
  console.log([
    'ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message
  ].join(''));
});

// 或者
worker.addEventListener('error', function (event) {
  // ...
});
```

Worker 内部也可以监听 `error` 事件。

#### 关闭 Worker

使用完毕，为了节省系统资源，必须关闭 Worker。

```js
// 主线程
worker.terminate();

// Worker 线程
self.close();
```

### 使用场景

Web Worker 适用于任何耗时、密集型的 JavaScript 任务，如大数据计算、文件处理、图像编码、加密解密等，核心目标是“不阻塞 UI，提升用户体验“。

Web Worker 的核心使用场景（按类别）
| 类别 | 使用场景 ｜ 描述 |
| --- | --- | --- |
| 计算密集型任务 | 斐波那契、质数计算、物理模拟、AI 推理 | 避免主线程卡死 |
| 数据处理 | CSV/Excel 解析、JSON 转换、日志分析 | 大文件解析不卡页面 |
| 图像/视频处理 | 图片压缩、滤镜、WebRTC 编码 | 结合 Canvas/WebGL |
| 加密/解密 | AES、RSA、哈希计算 | 安全且不阻塞 UI |
| 数据可视化预处理 | 聚合、降采样、坐标转换 | 为 ECharts/Three.js 准备数据 |
| WebSocket 消息处理 | 解码、解析、格式化实时消息流 | 避免影响渲染 |
| WebAssembly 配合使用 | 高性能计算、游戏引擎、音视频编解码 | WASM 在 Worker 中运行 |
| 复杂状态计算 | 表格公式计算、电子表格引擎 | 类似 Excel 的后台计算 |
| 模拟与预测 | 游戏 AI、天气预测、金融模型 | 长时间运行任务 |
| 垃圾回收辅助 | 大对象清理、内存管理 | 减少主线程压力 |

### 参考链接

> [Web Worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers)
>
> [Web Worker 教程](https://www.ruanyifeng.com/blog/2018/07/web-worker.html)
