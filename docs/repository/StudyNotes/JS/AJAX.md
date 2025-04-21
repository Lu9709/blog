AJAX是浏览器上的功能,在微软IE提出,浏览器可以发送请求,收响应。JS通过它实现请求,收请求。

AJAX是**异步的JavaScript和XML**。使用**XMLHttpRequest对象与服务器通信**。它可以使用JSON、XML、HTML和text文本格式发送和接受数据。

**'异步'特性：不刷新页面的情况下与服务器通信，交换数据，更新页面**。

## 步骤一：创建对象实例

```
if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    httpRequest = new XMLHttpRequest();
} else if (window.ActiveXObject) { // IE 6 and older
    httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
}
```
## 步骤二：创建请求，并指定请求方法、URL及验证信息

```
httpRequest.open('GET', 'http://www.example.org/some.file', true);
```
此时是指为请求做好准备。

**open(*****method*****,*****url*****,*****async,user,password*****)**

规定请求的类型、URL 以及是否异步处理请求。

* **method**：请求的类型；GET|POST|PUT|DELETE
* **url**：文件在服务器上的位置
* **async**：true（异步）或 false（同步）
* **user**：用户名用于认证
* **password**：密码用于认证

## 步骤三：执行响应任务

```
httpRequest.onreadystatechange = nameOfTheFunction;
nameOfTheFunction(){
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
      // Everything is good, the response was received.
  } else {
      // Not ready yet.
  }
};
```
设置对象的**onreadystatechange**告诉请求对象调用哪个函数，并要检查请求状态，状态改变时调用函数。

**XMLHttpRequest.DONE(对应值为4)**

**onreadystatechange**事件有两个属性**readyState**和**status**

**readyState**获取AJAX状态值，状态码如下所示：

* 0 (未初始化) or (**请求还未初始化**) 尚未调用open方法
* 1 (正在加载) or (**已建立服务器链接**) 调用open方法，尚未调用send方法
* 2 (加载成功) or (**请求已接受**) 调用send方法，尚未收到响应
* 3 (交互) or (**正在处理请求**) 已经收到部分响应，正在下载内容
* 4 (完成) or (**请求已完成并且响应已准备好**) 已经收到所有响应，可执行

**status**则获取HTTP状态码，其由三位数字组成，第一位数与含义如下：

1xx：表示服务器收到web浏览器的请求，正在处理

2xx：成功，表示用户请求被正确接受、理解和处理

3xx：重定向，表示请求没有成功，客户需要采取进一步动作

4xx：客户端错误，表示客户端提交的请求错误

5xx：服务器错误，表示服务器不能完成对请求的处理

**三个方法访问数据：**

* **httpRequest.response** – 返回一个ArrayBuffer、Blob、Document、DOMString，具体类型由responseType决定
* **httpRequest.responseText** – 服务器以文本字符的形式返回
* **httpRequest.responseXML** – 以 XMLDocument 对象方式返回，之后就可以使用JavaScript来处理

## 步骤四：发送请求

* send(string) 用于 POST 请求 string为提交数据。
* send() 用于GET请求

```
httpRequest.send();
```
## Get请求

GET的请求方法是 GET 请求，用于向服务器查询某些信息。必要时，需要在 GET 请求的 URL后面添加查询字符串参数。 查询字符串中的每个名和值都必须使用encodeURIComponent()编码，所有名/值对必须以和号（&）分隔

encodeURIComponent 转义除了如下所示外的所有字符：A-Z a-z 0-9 - \_ . ! ~ \* ' ( )

```
xhr.open("get", "example.php?name1=value1&name2=value2", true);
function addURLParam(url, name, value) {
  url += (url.indexOf("?") == -1 ? "?" : "&");
  url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
  return url;
}
```
## Post请求

Post请求需要设置Cotent-Type，告诉服务器数据类型为什么类型

常用请求头为：

* `application/x-www-form-urlencoded` 普通字段的表单数据
* `multipart/form-data` 文件或二进制数据
* `appliction/json`

通过`XMLHttpRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded")`

发送JSON数据

```
const xhr = new XMLHttpRequest()
xhr.open("POST","url",true)
xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
xhr.onreadyStateChange = function () {
  if(xhr.readyState === 4 && xhr.status === 200){
    console.log(request.responseText);
  }
}
xhr.send(JSON.stringify(data))
```
## 手写AJAX

完整版：

```
 var request = new XMLHttpRequest()
 request.open('GET', '/a/b/c?name=ff', true);
 request.onreadystatechange = function () {
   if(request.readyState === 4 && request.status === 200) {
     console.log(request.responseText);
   }};
 request.send();
```
简单版：

load事件不需要检查readyState属性。

```
 var request = new XMLHttpRequest()
 request.open('GET', '/a/b/c?name=ff', true)
 request.onload = ()=> console.log(request.responseText)
 request.send()
```
## 总结

以AJAX为例`request.send()`之后，并不能直接得到response，必须等到readyState为4后，浏览器回头调用`request.onreadystatechange`函数，才能得到`request.respone`。

