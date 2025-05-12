# JS的立即执行函数是什么？

>概念题：「是什么、怎么做、解决了什么问题、优点是、缺点是、怎么解决缺点」
> 

### 是什么

声明一个**匿名函数**，然后**立即去执行它**。这种做法就是**立即执行函数**。

### 怎么做
```javascript
(function() { console.log('匿名函数') }()）
(function() { console.log('匿名函数') })()
!function() { console.log('匿名函数') }()
+function() { console.log('匿名函数') }()
-function() { console.log('匿名函数') }()
~function() { console.log('匿名函数') }()
void function() { console.log('匿名函数')} ()
new function() { console.log('匿名函数') }()
var x = function () {return '匿名函数'}()
```

### 解决了什么问题

在 ES6 之前，只能通过它来「**创建局部作用域**」。

### 优点

兼容性好。

### 缺点

丑，写起来很丑。

### 怎么解决缺点

使用ES6的 `block` 和 `let` 语法，来创建局部作用域，如下所示。

```javascript
{
  let a = '匿名函数'
  console.log(a) // 匿名函数 能够读取到a
}
console.log(a)
// Uncaught ReferenceError: a is not defined
// 不能能够读取到a
```

