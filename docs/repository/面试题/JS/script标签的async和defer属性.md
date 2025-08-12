# \<script\>标签的async与defer属性有什么不同

> `async` 与 `defer` 都是用于优化**外部脚本**，它们都能让脚本 **异步下载不阻塞 HTML 解析**，但执行时机有本质区别：

### defer

`defer`(延迟脚本)

* **下载**：后台异步下载，不阻塞 HTML 解析。

* **执行**：在所有 HTML 解析完成后（DOM 树就绪）、`DOMContentLoaded` 事件触发前，按文档顺序依次执行。

* **顺序**：多个 `defer` 脚本严格按 HTML 中的声明顺序执行。

* **适用场景**：需要操作 DOM 或有依赖关系的脚本（如库文件 + 业务逻辑）。


### async

`async`(异步脚本)

* **下载**：后台异步下载，不阻塞 HTML 解析。

* **执行**：下载完成后立即暂停 HTML 解析并执行脚本。

* **顺序**：多个 `async` 脚本执行顺序不确定（取决于下载完成顺序）。

* **适用场景**：独立第三方脚本（如 Google Analytics），不操作 DOM 且无依赖关系。


### 总结

`async` 用于独立、无依赖的脚本，谁先下载完谁先执行；

`defer` 用于依赖 DOM 或需要顺序执行的脚本，在 DOM 解析完成后按顺序执行。

两者都不阻塞页面渲染，是优化页面性能的关键手段。 

### 参考链接

[script 标签 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/script)
