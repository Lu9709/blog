# 1. 声明对象的两种语法

键名是字符串，不是标识符，可以包含任意字符。

引号可以省略，但省略之后就只能写标识符，虽然引号省略了，但键名仍然是字符串。

```js 
let obj = {'name':'baizhe','age':18}
let obj = new Object({'name':'baizhe','age':18 })/*正规写法*/
```

# 2. 如何删除对象的属性

通过下列代码即可删除obj的xxx属性。

```js
delete obj.xxx或delete obj['xxx']
```

为了查看对象是否有这个属性，通常使用一下代码。

```js
'xxx' in obj === fasle
/*若是返回值为true，则无这个属性名*/
'xxx' in obj && obj.xxx === undefined
/*若是返回值为true，则含有这个属性名，但是值为undefined*/
obj.xxx === undefined
/*这个是不无法断定'xxx'是否为obj的属性*/
```

# 3. 如何查看对象的属性

每个对象除了自身所独有的属性外，其实都是有原型，原型里存着对象的共有属性，对象的原型也是对象。

`obj={}` 的原型即为所有对象的原型，这个原型包含所有对象的共有属性，是对象的根，这个原型也是有原型的，是 `null`。

* 查看所有属性

```js
Object.keys(obj)
```

* 查看自身+共有属性

```js
console.dir(obj)
```

* 判断一个属性是自身的还是共有的

```js
obj.hasOwnProperty('属性名')
```

两种方法查看属性:

* 中括号语法：`obj['key']`
* 点语法：`obj.key`

错误示例：`obj[key]` //key为变量，所以key的值一般不为'key'

key是字符串，推荐使用中括号。

# 4. 如何修改或增加对象的属性

* 直接赋值

```js
let obj = {name:'frank'}//name是字符串
obj.name = 'frank'//name是字符串，等价于下句
obj['name']= 'frank'
```

* 批量赋值

```js
Object.assign(obj,{age:18,gender:'man'})
```

* 改共有属性

```js
obj.__proto__['toString'] = 'xxx'//不推荐使用
Object.prototype['toString'] = 'xxx'
```

* 改原型

```js
obj.__proto__ = common//不推荐使用
let obj = Object.create(common)
```

增加对象属性，基本同上：已有属性则改，没有属性则增。

# 5. 'name' in obj和obj.hasOwnProperty('name') 的区别

关于 `in`，如果指定的属性在指的是**对象初始原型链**中，则in运算符返回 `true`。

然而 `hasOwnProperty()` 方法会返回一个布尔值，指的是**对象自身属性**中是否具有指定的属性（即是否有指定的键）。

```js
let obj = {'name':'baizhe'}
'name' in obj
//返回值为true
'toString' in obj
//返回值为true
console.log(obj.hasOwnProperty('name'))
//返回值为true，obj自身有这个属性。
console.log(obj.hasOwnProperty('toString'))
//返回值为false，obj自身没有这个属性,toString是原型里的属性。
```
