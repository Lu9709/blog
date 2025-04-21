## MVC(Model-View-Controller)

* **M** -Model 数据模型 负责所有所数据
* **V** -View 视图 负责所有的UI界面
* **C** -Controller 负责UI界面和数据的交互
用伪代码解释如下

#### 1.Model

用于封装与应用程序的业务逻辑相关的数据以及对数据的处理方法。

```
Model = {
    data: { 需要用到的数据 }，
    create(): { 增 },
    delete(): { 删 },
    update() { 改 },
    get():{ 查 }
}
```

#### 2.View

能够实现数据有目的的显示。

```
View = {
    el:null,
    html: `......` //视图模板
    init(){ 初始化页面 },
    render(){ 渲染页面 }
}
```

#### 3.Controller

用于控制应用程序的流程。它处理事件并作出响应。“事件”包括用户的行为和数据 Model 上的改变。

```
Controller = {
   init(){
      v.init() // 初始化
      v.render() // 第一次渲染
      c.autoBindEvents() // 自动的事件绑定
      eventBus.on('m:update', () => { v.render() })
      // 当eventBus触发'm:update'，页面重新渲染
   },
   events:{ 事件以哈希表方式记录 }，
   method() {
      data = 改变后的新数据
      m.update(data)
   }，
   autoBindEvents() { 自动绑定事件 }
```

#### 优点

* 低耦合性
* 高重用性和可适用性
* 较低的生命周期成本
* 快速部署
* 可维护性
* 软件工程化管理

#### 缺点

* 增加了系统结构和实现的复杂性
* 视图与控制器间的过于紧密的连接
* 视图对模型数据的低效率访问

## EventBus

EventBus又称为事件总线,可以用来进行组件之间的监听和通信。

比如当Model模块中的数据发生更新，触发了EventBus上的某个事件，而Controller模块恰好在监听这个事件，当这个事件触发时，Controller模块就知道Model模块中的数据发生了更新了，从而做出一些反应。

EventBus的API

* EventBus.on() 监听事件:当什么触发时，执行一些内容
* EventBus.trigger() 触发事件：当一个事件执行，EventBus触发
* EventBus.off() 解绑事件：当事件存在时，其余参数完全匹配时间处理函数移除

```
eventBus.trigger('event') //触发事件
eventBus.on('event',()=>{ //监听事件
     do something()
 })
```

## 表驱动编程

表驱动法是一种编程模式(scheme)——从表里面查找信息而不使用逻辑语句(if和case)。事实上，凡是能通过逻辑语句来选择的事物，都可以通过查表来选择。

在JS中，表就是指的 **哈希表** 结构，使用表驱动编程，能使重复冗余的代码变的稳定简洁。

举例输入数字0~6得到想要的星期几

```
function weekday(day) {
    if(day===0){
  	  return '星期天';
    }
    else if(day===2){
  	  return '星期二';
    }
    else if(day===3){
  	  return '星期三';
    }
    else if(day===4){
  	  return '星期四';
    }
    else if(day===5){
  	  return '星期五';
    }
    else if(day===6){
  	  return '星期六';
    }
}
```

上面的代码就显的重复和冗余，但可以通过将数据存到表里来实现如下所示。

```
weekday = {
    '0':'星期天',
    '1':'星期一',
    '2':'星期二',
    '3':'星期三',
    '4':'星期四',
    '5':'星期五',
    '6':'星期六'
}
function week(data) {
    return weekday[data]
}
```

## 模块化

将一个复杂的程序依据一定的设计规范封装成几个块（文件）并进行组合。但模块的内部数据的实现是私有的，可以通过向外部暴露一些接口与外部其他模块进行通信。

模块化可以降低代码耦合度，减少重复代码，提高代码重用性，并且在项目结构上更加清晰，便于维护。

