# HTTP缓存有哪些方案？

### 强缓存（无需向服务器验证）

**原理**：浏览器**直接判断缓存**是否过期，未过期则直接使用缓存。

**实现方式**：

1. **Expires**（HTTP/1.0）
   ```http
   Expires: Tue, 20 May 2025 13:14:00 GMT
   ```
   * **缺点**：依赖客户端本地时间，可能导致缓存失效不准确。

2. **Cache-Control**（HTTP/1.1，优先级高于Expires）
    ```http
    Cache-Control: max-age=31536000, public
    ```
    关键指令：
     * `max-age=秒`：缓存有效期（如 max-age=3600 表示 1 小时）。
     * `public`：允许代理服务器缓存。
     * `private`：仅允许浏览器缓存。
     * `no-cache`：强制协商缓存（跳过强制缓存）。
     * `no-store`：完全禁用缓存。

**适用场景**：静态资源（如图片、CSS、JS文件）

### 协商缓存（需向服务器验证）

**原理**：浏览器**携带缓存标识**向服务器**验证资源**是否变更，未变更则返回 `304 Not Modified`。

**实现方式**：

1. **Last-Modified/If-Modified-Since**（HTTP/1.0）
   
  ```http
  # 响应头（服务器返回）
  Last-Modified: Wed, 21 Oct 2023 07:28:00 GMT

  # 请求头（浏览器发送）
  If-Modified-Since: Wed, 21 Oct 2023 07:28:00 GMT
  ```
  * **缺点**：精度仅到秒级，文件内容未改变但修改时间变化时会失效。

2. **ETag/If-None-Match**（优先级高于Last-Modified，HTTP/1.1）

    ```http
    # 响应头（服务器返回）
    Etag: "517c8e7b-264"
    # 请求头（浏览器发送）
    If-None-Match: "517c8e7b-264"
    ```
    * **优势**：基于内容哈希值（如 SHA-1），精准判断内容变化。

### 缓存破坏

1. **文件名哈希**（推荐）
   ```html
   <script src="/app.3a7f5b8.js"></script>
   ```
   > 文件内容变化 → 哈希值变化 → URL 不同 → 触发重新下载。
2. **查询参数**
   ```html
   <script src="/app.js?v=2.0.1"></script>
   ```
   > 注意：部分代理服务器可能忽略查询参数导致缓存失效不彻底。


### 总结

| | 缓存（强缓存）| 内容协商（弱缓存）|
| --- | --- | --- |
| HTTP 1.1 | `Cache-Control:max-age=3600` | `ETag: ABC` <br> `If-None-Match: ABC` <br> 响应状态码：304或200 |
| HTTP 1.0 | `Expires: Tue, 20 May 2025 13:14:00 GMT` | `Last-Modified: Tue, 20 May 2025 09:14:00 GMT` <br> `If-Modified-Since: Tue, 20 May 2025 09:14:00 GMT` <br> 响应状态码：304或200 |

还有 [Pragma](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Reference/Headers/Pragma)，MDN不推荐使用这个。