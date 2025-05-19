# webpack如何解决开发时的跨域问题？

在开发时，我们页面在 `localhost:8080`，JS直接访问后端接口（`http://localhost:3000`/ `https://test.com`）会报跨域错误。

为了解决这个问题，我们可以使用 `webpack.config.js` 中添加如下配置：

```javascript
module.exports = {
  // ...
  devServer: {
    proxy: {
      '/api': {
        target: 'http://test.com', // 或 https://localhost:3000
        changeOrigin: true, // 修改 Host 头
        rewrite: (path) => path.replace(/^\/api/, '') // 路径重写
      }
    }
  }
}
```

此时，在JS请求 `/api/users` 接口就会被自动代理到 `http://test.com/api/users`。

如果希望请求中的 Origin 从 8080 修改为 `test.com`，可以添加 `changeOrigin: true`（确保代理请求的 `Host` 头与目标服务器一致）

如果要访问的是 HTTPS API，那么就需要配置 HTTPS 证书，否则会报错；可以通过在 `target` 中添加 `secure: false` 来忽略证书验证。


