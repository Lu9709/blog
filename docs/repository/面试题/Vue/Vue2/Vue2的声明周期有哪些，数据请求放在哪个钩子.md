# Vue2的声明周期有哪些，数据请求放在哪个钩子

查看[Vue2文档图片](https://v2.cn.vuejs.org/v2/guide/instance.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%BE%E7%A4%BA)，红色空心框中的文字皆为生命周期钩子。

1. create x 2（before + ed）- SSR
2. mount x 2
3. update x 2
4. destroy x 2

还有三个写在[钩子列表](https://v2.cn.vuejs.org/v2/api/#%E9%80%89%E9%A1%B9-%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%92%A9%E5%AD%90)里：

1. `activated` - 与 `keep-alive` 使用在一起，被 `keep-alive` 缓存的组件激活时调用。
2. `deactivated` - `keep-alive` 缓存的组件失活时调用。
3. `errorCaptured` - 组件发生错误的时候进行调用。

请求放在 `mounted` 里面，因为放在其他地方都不合适（xjb扯，有些请求可以放在其他的钩子里）。

放在 `created` 里如果有使用SSR，会在前端和后端都执行一次（SSR会去执行 `created` 中的请求），`mounted` 并不会。

`update` 钩子里请求，可能过于频繁。

