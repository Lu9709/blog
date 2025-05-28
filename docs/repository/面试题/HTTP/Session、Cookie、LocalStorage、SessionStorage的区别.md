# Session、Cookie、LocalStorage、SessionStorage的区别

* Cookie V.S. LocalStorage
  1. 主要区别是 Cookie 会被发送到服务器，而 LocalStorage 不会
  2. Cookie 一般最大 4k，LocalStorage 可以用 5Mb 甚至 10Mb（各浏览器不同）
* LocalStorage V.S. SessionStorage
  1. LocalStorage 一般不会自动过期（除非用户手动清除）
  2. SessionStorage 在回话结束时过期（如关闭浏览器之后，具体由浏览器自行决定）
* Cookie V.S. Session
  1. Cookie 存在浏览器的文件里，Session 存在服务器的文件里
  2. Session 是基于 Cookie 实现的，具体做法就是把 SessionID 存在 Cookie 里