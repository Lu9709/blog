# SSE

### SSE是什么

**SSE（Server-Sent Events）** 是 HTML5 提供的一种标准 API，允许服务器通过 HTTP 协议向客户端持续推送数据，适用于需要**单向实时通信**的场景。

**核心特点**：

* **单向通行**：服务器 → 客户端（客户端不能向服务器发送数据）。
* **基于HTTP**：使用标准HTTP/1.1或HTTP/2协议，兼容性强。
* **数据格式**：默认传输 UTF-8 文本数据，二进制需编码（可编码 JSON）。
* **自动重连**：内置连接恢复机制。
* **简单易用**：浏览器原生支持，无需额外库。

### SSE的原理

1. 客户端建立连接通过 `EventSource` 构造函数连接到服务器上某一个事件流接口。
2. 服务器保持HTTP连接开放，需设置响应头 `Content-Type: text/event-stream`，定期发送事件数据(格式为 `data: 消息\n\n`)。
3. 浏览器监听事件并做出响应。

### SSE的实现

如下为简单SSE实现代码案例：

后端使用 `node.js`、`express`。

::: code-group

```html [前端代码]
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SSE Notification Demo</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      #notify {
        border: 1px solid #ccc;
        padding: 10px;
        height: 300px;
        overflow-y: scroll;
      }
    </style>
  </head>
  <body>
    <h1>SSE Notification Demo</h1>
    <div id="notify"></div>

    <script>
      const notify = document.getElementById('notify');
      // 创建 EventSource 对象
      const eventSource = new EventSource('http://localhost:3000/stream');

      // 连接建立时触发
      eventSource.onopen = () => {
          notify.innerHTML += '<p>Connected to server!</p>';
      };

      // 接收到数据时触发 
      eventSource.onmessage = (event) => {
          notify.innerHTML += `<p>Notification: ${event.data}</p>`;
          notify.scrollTop = notify.scrollHeight;
      };

      eventSource.onerror = () => {
          notify.innerHTML += '<p>Connection error, attempting to reconnect...</p>';
      };
    </script>
  </body>
</html>
```

```js [后端代码]
// server.js
const express = require('express');
const app = express();
const PORT = 3000; // 服务端口

// 提供静态资源目录（index.html 所在目录）
app.use(express.static('public'));

// SSE 路由
app.get('/stream', (req, res) => {
  // 设置响应头 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  // 设置响应头为 text/event-stream 事件流
  res.setHeader('Content-Type', 'text/event-stream');
  // 设置响应头 不缓存
  res.setHeader('Cache-Control', 'no-cache');
  // 设置响应头 长连接
  res.setHeader('Connection', 'keep-alive');

  // 模拟每秒发送一次当前时间
  const intervalId = setInterval(() => {
    const data = {
      time: new Date().toLocaleTimeString(),
    };
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 1000);

  // 客户端断开连接时清除定时器
  req.on('close', () => {
    clearInterval(intervalId);
    console.log('客户端已断开连接');
  });
});

// 监听 服务端口
app.listen(PORT, () => {
  console.log(`SSE 服务运行在 http://localhost:${PORT}`);
});
```
:::

### SSE的优缺点

| **优点** | **缺点** |
| --- | --- |
| **协议简单**: 基于HTTP，无需其他协议 | **单向通信**: 客户端无法通过SSE向服务器发送数据 |
| **断线重连**: 内置断线重连机制(默认3秒间隔) | **仅支持文本**：二进制数据需编码传输 |
| **低延迟**: 减少轮询开销，实时性高 | **兼容性限制**: 不支持IE及旧版浏览器 |
| **支持事件类型**: 可自定义事件 | **连接限制**: 浏览器最多支持**6**个并发连接 |


### SSE vs WebSocket 对比

| 特性 | SSE | WebSocket |
|:---:|:---:|:---------:|
| 通信方向 | 单向(服务器 -> 客户端) | 双向全双工 |
| 协议 | HTTP(长连接) | 独立协议(`ws://`/`wss://`) |
| 数据格式 | 仅文本 | 文本/二进制 |
| 断线重连 | 默认支持 | 需要自己实现 |
| 兼容性 | 主流浏览器(IE除外) | 广泛支持 |

### 参考链接

> [Server-Sent Events 教程 - 阮一峰](https://www.ruanyifeng.com/blog/2017/05/server-sent_events.html)
>
> [使用服务器发送事件 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Server-sent_events/Using_server-sent_events)