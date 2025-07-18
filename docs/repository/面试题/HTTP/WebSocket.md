# WebSocket 常见面试题汇总

1. WebSocket 是什么？
   
> WebSocket 是一种**基于TCP的全双工通信协议**，允许客户端和服务器双向实时通信。

2. WebSocket 与 HTTP 有什么区别？

> HTTP是单向请求(短连接)，WebSocket是双向通信(长连接)。

3. WebSocket 的优缺点有哪些？

| 优点 | 缺点 |
| :---: | :---: |
| 全双工：双向通信，降低延迟 | 复杂性：需管理连接状态，如心跳和重连 |
| 高效：协议头部小，减少数据开销 | 资源占用：长连接可能导致服务器负载高 |
| 灵活：支持文本和二进制数据 | 兼容性：某些网络环境或旧浏览器可能不支持 |

4. WebSocket 握手过程是怎样的？
   
> 使用 HTTP 请求发起连接，服务器返回 `101 Switching Protocols` 状态码，切换到 WebSocket 协议。
   
5. 如何处理断网重连？
   
> * 客户端监听 `onclose` 和 `onerror` 事件检测到连接断开后，尝试重连。
> * 可以设置**重连间隔**和**最大重连次数**。

6. 如何实现心跳检测？

> * 客户端(发送ping包)和服务器端(响应pong包)都需要**定时发送心跳包**（如每 30 秒），以确认连接状态。
> * 若心跳包丢失，认为连接断开，触发**重连机制**。


[详细内容](/repository/StudyNotes/HTTP/WebSocket)