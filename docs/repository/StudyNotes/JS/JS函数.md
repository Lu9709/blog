### 具名函数

```
function 函数名(形式参数1，形式参数2){
  语句
  return 返回值
}
```
### 匿名函数

即具名函数去掉函数名就是匿名函数，也叫函数表达式。

```
let a = function(x,y){ return x+y } //a 为指向地址
```
### 纯函数

即相同的输入，始终得到相同的输出，不依赖于程序执行时的其他数据变化，只依赖输入参数，且不会产生任何可观察的副作用。

**可观察的副作用，但不限于：**

• 进行一个 HTTP 请求

• Mutating data

• 输出数据到屏幕或者控制台

• DOM 查询/操作

• Math.random()

• 获取的当前时间

### 箭头函数

```
let f1 = x => x*x
let f2 = (x,y) => x+y
let f3 = (x,y) => {return x+y}
let f4 = (x,y) => ({name:x,age:y})
```
### 箭头函数和普通函数的区别

#### 1. 不绑定`this`

箭头函数不会创建自己的`this`，所以它没有自己的`this`，它只会从自己的作用域链的上一层继承this——来自MDN的说明。

* 箭头函数：箭头函数没有自己的`this`，它会**捕获**自己在**定义时所处的外层执行环境**的`this`，并继承这个`this`。(一般指向window)
* 普通函数：`this`代表当前对象。

```
var id = 'Gobal'

function f1(){
    setTimeout(function(){
       console.log(this.id)
    },2000)
}

function f2(){
    setTimeout(()=>{console.log(this.id)},2000)
}
f1.call({id:'Obj'}) //Global
f2.call({id:'Obj'}) //'Obj'
```
`f1`内使用普通函数，2秒后执行时，函数时在全局作用域执行的，所以`this`指向`Window`对象，`this.id`就是全局变量`id`。`f2`使用箭头函数，它继承了外层`f2`的执行环境中的`this`，而`f2`调用的this被call对象改变了则输出`'Obj'`

```
var id = 'GLOBAL';
var obj = {
  id: 'OBJ',
  a: function(){
    console.log(this.id);
  },
  b: () => {
    console.log(this.id);
  }
};

obj.a();    // 'OBJ'
obj.b();    // 'GLOBAL'
```
普通函数作为对象的方法调用时，`this`指向它所属的对象，箭头函数则继承它定义时所处的全局执行环境中的`this`,为`Window`对象。（**定义对象的{}无法形成单独的执行环境**）

#### 2. 不绑定arguments

箭头函数：不绑定arguments，但可以用`...rest`来代替。

普通函数：可以使用arguments

```
let f1 = (val) => {
  console.log(val)
  console.log(arguments) //报错
}
f1('helloWorld')
// 'helloWorld'

function f2(x,y){
  console.log(arguments)
  return x+y
}
f2(1,2)
// Arguments(2) [1, 2, callee: ƒ, Symbol(Symbol.iterator): ƒ]
// 3

let x = (...rest) => {
  console.log(rest)
}
x(1,2)
// Arguments(2) [1, 2, callee: ƒ, Symbol(Symbol.iterator): ƒ]
function outer(val1, val2) {
    let argOut = arguments;
    console.log(argOut);    // ①
    let fun = () => {
        let argIn = arguments;
        console.log(argIn);     // ②
        console.log(argOut === argIn);  // ③
    };
    fun();
}
outer(1, 2);
// 箭头函数的arguments是沿着作用域向上访问的即外层的outer的arguments对象
// ① Arguments(2) [1, 2, callee: ƒ, Symbol(Symbol.iterator): ƒ]
// ② Arguments(2) [1, 2, callee: ƒ, Symbol(Symbol.iterator): ƒ]
// ③ true
```
#### 3. 箭头函数没有原型prototype

```
let sayHi = () => {
    console.log('Hello World !')
};
console.log(sayHi.prototype); // undefined
```
#### 4. 箭头函数不能使用new操作符

**new关键字**会进行如下的操作：

1. 创建一个空对象（即`{}`）。
2. 为新创建的对象添加属性`\_\_proto\_\_`，将改属性链接至构造函数的原型对象。
3. 为新创建的对象作为`this`的上下文。
4. 如果该函数没有返回对象，则返回`this`。

因为箭头函数是匿名函数，而且没有自己的`this`，它的this继承了外层执行环境中的`this`。

```
var Foo = () => {};
var foo = new Foo(); // TypeError: Foo is not a constructor
```
#### 5. 箭头函数的call()、bind()或apply()函数，不会影响this的指向

`call()`、`bind()`、`apply()`方法可以动态修改函数执行时的`this`指向，但由于箭头函数的`this`定义时已经确定且不会改变，所以无法改变箭头函数`this`的指向。

```
var id = 10;
let fun = () => {
    console.log(this.id)
};
fun();     // 10
fun.call({ id: 20 });     // 10
fun.apply({ id: 20 });    // 10
fun.bind({ id: 20 })();   // 10
```
