### 什么是AJAX

::: tip 说明
AJAX(Asynchronous JavaScript And XML)指的是在一种用于在**不在刷新页面的情况**下，**向服务器发送请求并获取数据的技术**。
::: 

### AJAX的原理

通过JavaScript的 `XMLHttpRequest` 对象，向服务器发送**异步请求**，**获取数据并动态更新页面内容**，**实现局部刷新**而**不需要刷新整个页面**的效果。

### 手写AJAX

```javascript
const ajax = (method,url,data,success,fail) => {
  var request = new XMLHttpRequest() // 创建请求对象
  request.open(method,url) // 创建请求，并指定请求方法、URL、验证信息
  // open方法的参数：method、url、async(是否异步)、user、password
  // get方法需要将参数拼接到url上通过encodeURIComponent()
  request.onreadystatechange = function () { // 执行响应任务
    if (request.readyState === 4) {
      if (request.status >= 200 && request.status < 300 || request.status === 304) {
        success(request)
      } else {
        fail(request)
      }
    }
  }
  // 发送请求
  request.send(data) // post请求时，需要传递参数
}
```
HTTP 304 Not Modified 说明无需再次传输请求的内容，也就是说可以使用缓存的内容。

