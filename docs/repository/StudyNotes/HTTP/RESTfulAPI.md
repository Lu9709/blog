# RESTful API

> RESTful API是一种设计风格，用于构建网络应用程序之间的通信接口。

全称为Representational State Transfer，表示为**表现层状态转移**，其实指的是“资源”的“表现层”。

它是基于HTTP协议的特性，通过一组统一的规则来设计URL和请求方式，让客户端和服务器之间能够清晰、简洁地交换数据。

### 核心原则（六大要素）

1. **客户端-服务器架构（Client-Server）**：客户端与服务器分离，互不依赖。
2. **无状态（Stateless）**：每个请求都是独立的，服务器不会保留之前的请求状态。
3. **可缓存（Cacheable）**：服务器可以使用缓存来提高性能，缓存可以使用HTTP头来控制。
4. **统一接口（Uniform Interface）**：RESTful API使用一致的接口，每个资源都有自己的URI。
5. **分层系统（Layered System）**：RESTful API可以分为多个层次，每个层次都有自己的职责。
6. **按需代码（Code-on-Demand）**：RESTful API可以提供代码，例如JavaScript。

### 版本

将对应的API版本号放入URL中。

```text
https://api.example.com/v1/
```

另一种做法是，将版本号放在HTTP头信息中。

```text
Accept: application/vnd.example.com;version=1
```

### 路径

路径又称"终点"（endpoint），表示**API的具体网址**。

在RESTful架构中，每个网址代表一种**资源**（resource），所以网址中**不能有动词**，**只能有名词**，而且所用的名词往往与数据库的表格名对应。

```text
https://api.example.com/users
https://api.example.com/animals
https://api.example.com/books
```


### HTTP 动词

HTTP 方法定义它对给定资源执行的**操作类型**。

* **GET（SELECT）**：从服务器检索资源（一项或多项）。
* **POST（CREATE）**：在服务器创建资源。
* **PUT（UPDATE）**：在服务器更新资源（客户端提供改变后的完整资源）。
* **PATCH（UPDATE）**：在服务器更新资源（客户端提供改变的属性）。
* **DELETE（DELETE）**：从服务器删除资源。

### 状态码（Status Codes）

服务器向用户返回的状态码和提示信息，常见的有以下一些。

* **200 OK - [GET]**：服务器成功返回用户请求的数据，该操作是**幂等**的（Idempotent）。
* **201 Created - [POST/PUT/PATCH]**：用户新建或修改数据成功。
* **202 Accepted - [*]**：表示一个请求已经进入后台排队（异步任务）
* **204 No Content - [DELETE]**：用户删除数据成功。
* **400 Invalid Request - [POST/PUT/PATCH]**：用户发出的请求有错误，服务器没有进行新建或修改数据的操作，该操作是幂等的。
* **401 Unauthorized - [*]**：表示用户没有权限（令牌、用户名、密码错误）。
* **403 Forbidden - [*]**: 表示用户得到授权（与401错误相对），但是访问是被禁止的。
* **404 Not Found - [*]**：用户发出的请求针对的是不存在的记录，服务器没有进行操作，该操作是幂等的。
* **405 Method Not Allowed - [*]**：服务器不允许客户端使用的请求方法。
* **406 Not Acceptable - [GET]**：用户请求的格式不可得（比如用户请求JSON格式，但是只有XML格式）。
* **410 Gone -[GET]**：用户请求的资源被永久删除，且不会再得到的。
* **422 Unprocesable entity - [POST/PUT/PATCH]**: 当创建一个对象时，发生一个验证错误。
* **500 INTERNAL SERVER ERROR - [*]**：服务器发生错误，用户将无法判断发出的请求是否成功。

### 参考资料

> [GitHub 文档 - REST API 入门](https://docs.github.com/zh/rest/using-the-rest-api/getting-started-with-the-rest-api?apiVersion=2022-11-28)
> [阮一峰的网络日志 - RESTful API 设计指南](https://www.ruanyifeng.com/blog/2014/05/restful_api.html)
> [阮一峰的网络日志 - 理解RESTful架构](https://www.ruanyifeng.com/blog/2011/09/restful.html)
