### typeof

返回一个字符串，表示未经计算的操作数的类型

```
typeof 123 //'number'
typeof '123' //'string'
typeof false //'boolean'
typeof undeclaredVariable //undefined //未声明变量
typeof Symbol() //'symbol'
typeof [1,2,3] //'object'
function a(){}
typeof a //'function'
typeof window // "object"
typeof {} // "object"
typeof [] // "object"
typeof null // "object"
```
**注意点**

* 空数组返回值为object，这是因为数组本质是一种特殊的对象
* null的返回类型为object，null表示空对象指针，由于设计时历史原因造成。

判断一个变量是否存在

```
if(typeof a != 'undefined'){
	//变量存在
}
```
### instanceof

`instanceof`是判断变量是否为某个对象的实例，返回值为boolean

mdn原话instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。

```
let arr = []
let obj = {}
arr instanceof Array //true
obj instanceof Object //true
```
### 区别

* `typeof`会返回一个**变量基本类型的字符串**，`instanceof`返回的是一个**布尔值**。
* `instanceof`可以准确判断复杂引用数据类型，即判断该构造函数的`prototype`属性是否是在某个对象的原型链上，但不能正确判断基础数据类型。
* `typeof`**无法区分数组和对象**，但是`instanceof`可以。`typeof`也无法判断`null`。

