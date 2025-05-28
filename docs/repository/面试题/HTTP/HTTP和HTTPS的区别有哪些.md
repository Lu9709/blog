# HTTP和HTTPS的区别有哪些

```text
HTTPS = HTTP + SSL/TLS
```
**TLS（传输层安全协议）** 是 **SSL（安全套接字层）** 的继任协议，SSL 是历史遗留的过时协议。

**区别列表**：
1. HTTP 是**明文传输**的，不安全；HTTPS 是**加密传输**的，非常安全。
2. HTTP 使用 **80** 端口，HTTPS 使用 **443** 端口。
3. HTTP 较**快**，HTTPS 较**慢**（加密解密需要时间）。
4. HTTPS 的**证书一般需要购买**（由可信的 CA 机构颁发，但也有免费的），HTTP 不需要证书。

**加密原理（HTTPS）**：

* **非对称加密**：握手阶段使用（如 RSA/ECC），验证身份并协商密钥。

* **对称加密**：数据传输阶段使用（如 AES），加密实际内容。

* **混合加密机制**：兼顾安全性与性能。
  
**参考文章**

> [图解SSL/TLS协议 - 阮一峰的网络日志 (ruanyifeng.com)](https://www.ruanyifeng.com/blog/2014/09/illustration-ssl.html)
>
> 
> [HTTPS原理以及握手阶段](https://juejin.cn/post/6844903892765900814)
