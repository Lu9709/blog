# call、apply、bind_的用法和this
### CALL

`call` 方法使用一个指定的 `this` 值和单独给出的**一个或多个参数**来调用一个函数。

```javascript
function add(a, b) {
  return a + b;
}
add.call(this, 1, 2) // 3
```
### APPLY

`apply` 方法和 `call` 方法类似，但是可以接受一个**含多参数的数组**。

```javascript
function f(x, y){
  console.log(x + y);
}
f.call(null, 1, 1) // 2
f.apply(null, [1, 1]) // 2
```
### BIND

`bind` 方法用于将函数体内的 `this` 绑定到某个对象，然后返回一个**新函数**。

```javascript
var counter = {
  count: 0,
  add: function () {
    this.count++;
  }
};
var otherCounter = {
  count: 999
}
var func = counter.add.bind(counter);
counter.count // 0
func();
counter.count // 1
var funcOther = counter.add.bind(otherCounter);
funcOther();
otherCounter.count // 1000
```
### this

1. fn()

    this => window/global

2. obj.fn()

    this => obj

3. fn.call(xx)

    this => xx

4. fn.apply(xx)

    this => xx

5. fn.bind(xx)

    this => xx

6. new Fn()

    this => 新的对象

7. fn = ()=> {}

    this => 外面的 this

[参考的文章](https://zhuanlan.zhihu.com/p/23804247)

### 题目
:::code-group
```javascript [题目一]
var a = {
  name:'inside-name',
  sayName:function(){
    console.log("this.name:"+this.name);
  }
};
var name = 'outside-name'
function sayName(){
  var b = a.sayName;
  b(); // this.name = ?
  a.sayName(); // this.name = ?
  (a.sayName)(); // this.name = ?
  (b=a.sayName)() // this.name = ?
}
sayName();
```

```javascript [call 改写]
var a = {
  name:'inside-name',
  sayName:function(){
    console.log("this.name"+this.name);
  }
};
var name = 'c-name'
function sayName(){
  var b = a.sayName;
  b.call(undefined); // this.name=outside-name
  a.sayName.call(a); // this.name=inside-name
  (a.sayName).call(a); // this.name=inside-name
  b.call(undefined) // this.name=outside-name
}
sayName.call(undefined) // =>window
```
:::

::: code-group
```javascript [题目二]
var length =10;
function fn(){
  console.log(this.length);
}
var obj = {
  length:5,
  method:function(fn){
    fn();
    arguments[0]();
  }
};
obj.method(fn,1)
```


```javascript [call改写]
var length =10;
function fn(){
  console.log(this.length);
}
var obj = {
  length:5,
  method:function(fn){
    fn.call(undefined)//this就是undefined
    arguments[0].call(arguments);
    // this是arguments,就是[fn,1]
  }
};
obj.method.call(obj,fn,1)// 10 2
```

:::