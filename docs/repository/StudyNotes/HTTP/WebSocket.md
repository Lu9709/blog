# WebSocket

### 什么是Websocket

* **定义**：WebSocket 是一种**基于TCP的全双工通信协议**，允许客户端和服务器**双向实时通信**。
* **协议标识**：使用 `ws://` (非加密)或 `wss://` (加密，基于TLS)

### WebSocket原理

#### 握手阶段（HTTP -> WebSocket）

1. 客户端通过一次 HTTP 请求发起 Websocket 连接请求（包含 `Upgrade: websocket` 头）
  ```http
  GET /chat HTTP/1.1
  Host: example.com
  Upgrade: websocket
  Connection: Upgrade
  Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
  Sec-WebSocket-Version: 13
  ```
2. 服务器响应返回 HTTP 状态码 `101 Switching Protocols` 表示连接成功
  ```http
  HTTP/1.1 101 Switching Protocols
  Upgrade: websocket
  Connection: Upgrade
  Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
  ```
3. 握手完成后，双方通过同一 TCP 连接进行双向通信。

#### 数据传输过程

一旦建立连接后，客户端和服务器端之间可以进行数据传输，直到一方关闭连接。

**消息格式**：

1. 数据以**帧**（frame）形式传输，支持文本（UTF-8）或二进制数据。
2. 帧包含操作码（opcode，如文本、关闭）、有效载荷（payload）等。

### WebSocket的使用方式

**WebSocket** 对象作为一个构造函数，用于新建 WebSocket 实例。

**webSocket.readyState**：属性返回实例对象的当前状态，共有四种：

* `CONNECTING`：值为0，表示正在连接。
* `OPEN`：值为1，表示连接已打开。
* `CLOSING`：值为2，表示连接正在关闭。
* `CLOSED`：值为3，表示连接已关闭或无法打开。

#### 前端部分代码示例
   
```js
// websocket 构造函数
const socket = new WebSocket('ws://example.com/socket');

// 实例对象的 onopen 属性，用于指定连接成功后的回调函数。
socket.onopen = function (event) {
  socket.send('Hello Server!');
};

// 如果要指定多个回调函数，可以使用addEventListener方法。
socket.addEventListener('open', function (event) {
  ws.send('Hello Server!');
});

// 实例对象的 onmessage 属性，用于指定收到服务器数据后的回调函数。
socket.onmessage = function (event) {
  // 需要根据数据类型进行判断解析
  console.log('收到消息:', event.data);
};

// 实例对象的 onerror 属性，用于指定报错时的回调函数。
socket.onerror = function (event) {
  console.error('发生错误:', event);
};

// 实例对象的 onclose 属性，用于指定连接关闭后的回调函数
socket.onclose = function (event) {
  console.log('连接已关闭');
};

// 实例对象的 send() 方法用于向服务器发送数据, 可以发送Blob、ArrayBuffer、字符串、对象等。
socket.send('some message')
```

#### Node.js部分后端代码示例

```js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8000 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s' message);
  });

  ws.send('something');
});
```

### WebSocket的优缺点

#### 优点

1. **全双工通信**：建立一次连接后，服务端/客户端可同时**双向发送数据**。
2. **低延迟**：相比HTTP轮询，WebSocket保持长连接，减少了建立连接的开销。
3. **高效性**：WebSocket协议头部较小，数据传输效率高于HTTP。
4. **灵活性**：支持文本和二进制数据，适用于多种场景。
5. **跨平台支持**：现代浏览器和服务器框架（如Node.js）广泛支持WebSocket。

#### 缺点

1. **复杂性**：相比HTTP，WebSocket需要管理连接状态（如心跳机制、断线重连），增加了开发和维护成本。
2. **资源占用**：长连接会持续占用服务器资源，可能导致高并发场景下的性能出现问题。
3. **浏览器支持问题**：不是所有的浏览器都支持 WebSocket 协议，所以在使用 WebSocket 协议时需要注意浏览器的兼容性问题。
4. **无内置缓存**：不像HTTP，WebSocket不原生支持缓存机制，需额外实现。
5. **安全性问题**：需要妥善处理跨站WebSocket劫持（CSWSH）等安全问题，配置正确的Origin验证。


### WebSocket与传统HTTP轮询对比

| 对比项 | WebSocket | HTTP轮询 | 
| :---: | :---: | :---: |
| 通信方式 | 全双工，长连接 | 半双工，短连接 |
| 带宽消耗 | 较小 | 较大（每次请求重复头部） |
| 服务器开销 | 低（1个持久连接） | 高（频繁创建连接）|
| 使用场景 | 适用于实时数据推送 | 低频数据获取 (如每 5 分钟更新) |


### 断网重连

* 客户端监听 `onclose` 和 `onerror` 事件检测到连接断开后，尝试重连。
* 可以设置重连间隔和最大重连次数。

```js
let ws = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5; // 最大重连次数
const reconnectDelay = 2000; // 重连间隔时间

function connect() {
  ws = new WebSocket('ws://localhost:8080');

  ws.onopen = () => {
    console.log('Connected');
    reconnectAttempts = 0; // 重置重试次数
  };

  ws.onclose = () => {
    console.log('Disconnected');
    // 尝试重连
    if (reconnectAttempts < maxReconnectAttempts) {
      setTimeout(() => {
        reconnectAttempts++;
        connect();
      }, reconnectDelay);
    } else {
      console.log('Max reconnect attempts reached');
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
}

connect();
```

### 心跳机制

* 客户端和服务器端都需要定时发送心跳包（如每 30 秒），以确认连接状态。
  - 客户端发送心跳包：`{ type: 'ping' }`
  - 服务器端响应心跳包：`{ type: 'pong' }`
* 若心跳包丢失，认为连接断开，触发重连机制。

```js
let heartBeatInterval = null;
let pongTimeout = null;
let heartBeatTimeout = 30000; // 每30秒发送一次ping
let pongTimeoutTime = 10000 // 等待10秒内的pong

function startHeartBeat(socket) {
  if (heartBeatInterval) clearInterval(heartBeatInterval);

  heartBeatInterval = setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'ping' }));
      console.log('发送心跳包...');
      pongTimeout = setTimeout(() => {
        socket.close()
      }, pongTimeoutTime)
    }
  }, heartBeatTimeout); // 每5秒发送一次
}

function connect() {
  const socket = new WebSocket('ws://localhost:8080');

  socket.onopen = () => {
    console.log('WebSocket 已连接');
    startHeartBeat(socket);
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'pong') {
      console.log('收到服务器心跳响应');
      // 接受pong，清除pong超时
      clearTimeout(pongTimeout);
    } else {
      console.log('收到业务消息:', data);
    }
  };

  socket.onclose = () => {
    console.log('WebSocket 已关闭');
    if (heartBeatInterval) {
      clearInterval(heartBeatInterval);
      heartBeatInterval = null;
    }
    // 可在此处调用重连逻辑
  };

  return socket;
}
```

### 心跳和重连机制完整版

```js
let ws = null;
let heartbeatInterval = null;
let pongTimeout = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectDelay = 2000; // 2秒后重试
const heartbeatIntervalTime = 30000; // 每30秒发送一次ping
const pongTimeoutTime = 10000; // 等待10秒内的pong

function connect() {
  ws = new WebSocket('ws://localhost:8080');

  ws.onopen = () => {
    console.log('Connected');
    reconnectAttempts = 0;
    startHeartbeat();
  };

  ws.onmessage = (event) => {
    if (event.data === 'pong') {
      clearTimeout(pongTimeout);
      return;
    } else {
      // 处理其他消息
    }
  };

  ws.onclose = () => {
    console.log('Disconnected');
    // 尝试重连时候需要暂停心跳
    stopHeartbeat();
    if (reconnectAttempts < maxReconnectAttempts) {
      setTimeout(() => {
        reconnectAttempts++;
        connect();
      }, reconnectDelay);
    } else {
      console.log('Max reconnect attempts reached');
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
}

function startHeartbeat() {
  stopHeartbeat();
  heartbeatInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send('ping');
      pongTimeout = setTimeout(() => {
          console.log('No pong received, closing connection');
          ws.close();
      }, pongTimeoutTime);
    }
  }, heartbeatIntervalTime);
}

function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
  if (pongTimeout) {
    clearTimeout(pongTimeout);
    pongTimeout = null;
  }
}

connect();
```

### 参考链接

> [WebSocket - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)
> 
> [WebSocket 教程 - 阮一峰](https://www.ruanyifeng.com/blog/2017/05/websocket.html)





