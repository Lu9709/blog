# HTTP

| 状态码 | 内容 |
| --- | --- |
| 1\*\* | 信息，服务器收到请求，需要请求者继续执行操作 |
| 2\*\* | 成功，操作被成功接收并处理 |
| 3\*\* | 重定向，需要进一步的操作以完成请求 |
| 4\*\* | 客户端错误，请求包含语法错误或无法完成请求 |
| 5\*\* | 服务器错误，服务器在处理请求的过程中发生了错误 |

### HTTP状态码列表

100 continue 客户端继续请求

200 ok 请求成功。一般用于GET与POST请求

300 Multiple Choices 多种选择，进一步操作

400 Multiple Choices 客户端错误

500 Internal Server Error 服务端错误GET  请求指定的页面信息，并返回实体主体。

### HTTP请求方法

* HEAD     类似于get请求，只不过返回的响应中没有具体的内容，用于获取报头

* POST     向指定资源提交数据进行处理请求（例如提交表单或者上传文件）。数据被包含在请求体中。POST请求可能会导致新的资源的建立和/或已有资源的修改。

* PUT  从客户端向服务器传送的数据取代指定的文档的内容。

* DELETE   请求服务器删除指定的页面。

* CONNECT  HTTP/1.1协议中预留给能够将连接改为管道方式的代理服务器。

* OPTIONS  允许客户端查看服务器的性能。

* TRACE    回显服务器收到的请求，主要用于测试或诊断。

### HTTP 缓存

**ETag**、**CacheControl**、**Expires**

1. `ETag` 是通过对比浏览器和服务器资源的特征值（如MD5）来决定是否要发送文件内容，如果一样就只发送 304（not modified）
2. `Expires` 是设置过期时间（绝对时间），但是如果用户的本地时间错乱了，可能会有问题
3. `CacheControl: max-age=3600` 是设置过期时长（相对时间），跟本地时间无关。

### HTTP缓存策略

#### GET 和 POST 的区别

* GET在浏览器回退时是无害的，而POST会再次提交请求。
* GET产生的URL地址可以被加入收藏栏，而POST不可以。
* GET请求会被浏览器主动cache，而POST不会，除非手动设置。
* GET请求只能进行url编码，而POST支持多种编码方式。
* GET请求参数会被完整保留在浏览器历史记录里，而POST中的参数不会被保留。
* GET请求在URL中传送的参数是有长度限制的，而POST么有。
* 对参数的数据类型，GET只接受ASCII字符，而POST没有限制。
* GET比POST更不安全，因为参数直接暴露在URL上，所以不能用来传递敏感信息。
* GET参数通过URL传递，POST放在Request body中。

正确答案

语义——GET 用于获取资源，POST 用于提交资源

#### Cookie V.S. LocalStorage V.S. SessionStorage V.S. Session

cookie浏览器访问服务器，服务器传给浏览器的一段数据，每次访问都要带上这段数据。

session浏览器和服务器的会话。

* Cookie V.S. LocalStorage
1. 主要区别是 Cookie 会被发送到服务器，而 LocalStorage 不会
2. Cookie 一般最大 4k，LocalStorage 可以用 5Mb 甚至 10Mb（各浏览器不同）
3. Cookie存用户信息，LocalStroage存不重要的数据
* LocalStorage V.S. SessionStorage
4. LocalStorage 一般不会自动过期（除非用户手动清除），而 SessionStorage 在回话结束时过期（如关闭浏览器）
* Cookie V.S. Session
1. Cookie 存在浏览器的文件里，Session 存在服务器的文件里
2. Session 是基于 Cookie 实现的，具体做法就是把 SessionID 存在 Cookie 里

HTTP1/HTTP2的区别

查博客 多路复用/服务端推送

