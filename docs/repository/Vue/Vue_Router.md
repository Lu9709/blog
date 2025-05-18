# Vue Router

路由（routing）：就是通过互联的网络把信息从源地址传输到目的地址的活动；路由根据路由表——一个存储到各个目的地的最佳路径的表——来引导分组转送。做成硬件之后就是路由器。路由也可以理解为分发请求的对象。

### route-link
`route-link`标签中的`to`用于存放url链接跳转页面。

### router-view
`router-view`将显示与 url 对应的组件，即**渲染指定路由对应的组件**。你可以把它放在任何地方，以适应你的布局。

### hash模式
若是点击一条超链接`<a href="#1">go to 1</a>`，在URL里会添加#开的字段，hash(#)是URL的锚点代表网页中的一个位置，改变#后的部分，浏览器滚动至相应位置，不会重新加载网页，可通过`window.location.hash`来获取该字段，然后可以通过添加监听hashchange事件来进行路由的更换。

```javascript
window.addEventListener("hashchange", () => {
  console.log("hash 变了");  
  router(); 
});
```

[Hash代码链接](https://github.com/Lu9709/Vue-Router-demo-1/tree/master)

优点: 任何情况下都能做到前端路由，只须改#后面的值，无需刷新。

缺点: SEO不友好，服务器接收不到hash，因为浏览器是不会把#后面的内容发给服务器。

### history模式
先将链接设置为`<a class="link" href="/1">go to 1</a>`,URL里会添加/的字段，可以通过`window.location.pathname`来获取/后的字段。还可以通过通过`history.back()`、`history.go()`、`history.forward()`完成后退前进等操作。

在HTML5新增了`pushState`、`replaceState`,通过`window.history.pushState(stateObject,title,url)`将路由添加到历史堆栈中去，`replaceState()`修改历史堆栈的记录，可通过`history.state`查看当前状态记录，但这只是修改了URL的路径，不会加载刷新页面，`window.onpopstate`对状态监听，但只会在浏览器的前进、后退按钮或者Javascript的`history.back()`、`history.go()`、`history.forward()`方法中触发。

[history代码链接](https://github.com/Lu9709/Vue-Router-demo-1/tree/history)

优点: 后端可以将所有前端路由渲染到同一个页面。

缺点: 如果后端没有做对应路由，刷新时会有404，IE8以下不支持。

### memory模式
该模式就是将路由存在一个对象里，在URL里看不到对应的路径，适用于手机端。 通过在localStorage内添加对象，通过点击链接后在得到localStorage得到存的值。

window.localStorage.setItem("router",href) //存对对象 let number = window.localStorage.getItem("router") //获取对象 

[memory代码链接](https://github.com/Lu9709/Vue-Router-demo-1/tree/memory)

### 默认路由
若是用户第一次登录网页的时候，可以设置一个默认网页链接。

### 404 路由 / 保底路由
若用户输入的网址在路由表内找不到，则返回一个专门处理找不到该内容的404页面。常规参数指挥匹配被`/`分隔URL片段中的字符。若要匹配任意路径，可以使用通配符`*`

```javascript
{
  // 会匹配所有路径
  path: '*'
}
{
  // 会匹配以 `/user-` 开头的任意路径
  path: '/user-*'
}
```

使用通配符时，$route.params会添加一个pathMatch的参数。包含URL通过通配符被匹配的部分。

```vue
// 给出一个路由 { path: '/user-*' }
this.$router.push('/user-admin')
this.$route.params.pathMatch // 'admin'
// 给出一个路由 { path: '*' }
this.$router.push('/non-existing')
this.$route.params.pathMatch // '/non-existing'
```

### 响应路由参数变化
由于很多时候路由匹配映射到同一个组件，但若是有ID不同的用户，可以通过路径参数冒号`:`、问号`?`、井号`#`来处理URL查询参数。`#`滚动页面指定位置。

| **模式** | **匹配路径** | **$route.params** |
| :---: | :---: | :---: |
| `/user/:username` | `/user/lz` | `{username:'lz'}` |

| **模式** | **匹配路径** | **$route.query** |
| :---: | :---: | :---: |
| `/foo/:user?/:userId?` | `/foo/user=1&userId=2` | `{user:'1',userId:'2'}` |


复用组件时，若要对路由参数变化做修改可以watch`$route`对象

```javascript
const User = {
  template: '...',
  watch: {
    $route(to, from) {
      // 对路由变化作出响应...
    }
  }
}
```

### 嵌套路由
要在嵌套的出口渲染组件，在VueRouter的参数中使用children配置

```javascript
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id',
      component: User,
      children: [
        {
          // 当 /user/:id/profile 匹配成功，
          // UserProfile 会被渲染在 User 的 <router-view> 中
          path: 'profile',
          component: UserProfile
        },
        {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          path: 'posts',
          component: UserPosts
        }
      ]
    }
  ]
})
```

### 重定向和别名
```javascript
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: '/b' },
    // 从/a重定向到/b
    { path: '/a',component:A,alias: '/b' },
    // 路径/a的别名为/b,访问/b时实际还是访问的/a
    { path:'/a',redirect:{name:'xxx'}},
    // 重定向为命名路由
    { path:'/a',redirect:to=>{
      // 方法接收 目标路由 作为参数
      // return 重定向的 字符串路径/路径对象
    }}
  ]
})
```

### Vue-Router
Vue-Router源码比较难理解，在我的理解里是主要有三部分RouterView、RouterLink、VueRouter，RouterView里的render函数用返回的是`h(component, data, children)`，而h()则是声明用来创建元素的,其实RouterView的作用就是渲染组件。

而在RouterLink的render的返回值是`h(this.tag, data, this.$slots.default)`,则是创建一个a标签，并还对a标签的一些事件进行了监听，进而调用一些方法如replace或push。

在VueRouter的封装中，对路由进行了一系列操作，如选择模式、匹配路由等。 在html中可直接使用Vue-Router的模板 `<router-link to="/xx"></router-link>`相当于一个a标签，to相当于href属性。

`<router-view></router-view>`则是展示的内容。

### 总结
hash模式和history模式是可分享路由，memory模式是单机路由。

