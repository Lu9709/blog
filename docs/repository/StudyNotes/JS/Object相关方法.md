### 简介

`Object`是JavaScript的一种**复杂数据类型**。可以通过[Object()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/Object)构造函数或使用[对象字面量](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Object_initializer)的方式创建对象。

基本所有对象都是`Object`的实例，一个典型的对象从`Object.prototype`继承属性（包括方法），尽管这些属性可能被**覆盖**或**重写**。唯一不从`Object.prototype`继承的对象是那些**null原型对象**，或者是从其他`null`原型对象继承而来的对象。

### null 原型对象

可以通过`Object.create(null)`或定义`__proto__: null`的对象字面量语法来创建`null`原型对象，可以通过`Object.setPrototypeOf(obj, null)`将现有对象的原型改为`null`。

注意：对象字面量中的`__proto__`键不同于已弃用的`Object.prototype.__proto__`属性

```js
const obj = Object.create(null)
const obj2 = { __proto__: null }
```
### 构造方法

#### [Object()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/Object)

将输入转换为一个对象。它的行为取决于**输入的类型**。

备注：`Object()`可以在带有或者不带有`new`的情况下调用，但会有不同的**返回值**。

* 如果该值是`null`或者`undefined`，它会生成并返回一个空对象。
* 如果该值已经是一个对象，则返回该值。
* 否则，返回与定值对应的类型的对象。例如，传递BigInt基本类型返回一个BigInt封装对象。

```js
const o = new Object()
const o = new Object(undefined)
const o = new Object(null)
```
### 静态方法

#### [Object.assign()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

`Object.assign(target, ...sources)`

**描述**：将**一个**或**多个源对象**的所有**可枚举自有属性**的值**复制**到**目标对象**中。

**参数**：

* `target` 需要应用源对象属性的目标对象，修改后将作为返回值。
* `sources` 一个或多个包含要应用的属性的源对象。

**返回值**：修改后的目标对象。

**案例**：

```js
const target = { a: 1, b: 2 }
const source = { b: 4, c: 5 }

const returnedTarget = Object.assign(target, source)

console.log(target); // Expected output: Object { a: 1, b: 4, c: 5 }
console.log(returnTarget === target); // Expected ouput: true
```
**备注**：`Object.assign()`只**复制属性值**，假如源对象是一个对象的引用，它仅仅会复制其**引用值**。（可以理解为**浅拷贝**）

#### [Object.create()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)

`Object.create(proto)`

`Object.create(proto, propertiesObject)`

**描述**：使用**指定**的**原型对象和属性**创建一个**新对象**。

**参数**：

* `proto` 新创建对象的原型对象。
* `propertiesObject` 传入对象**可枚举的自由属性**将为新创建的对象添加具有对应属性名称的属性描述符。

**案例**：

```js
const person = {
  isHuman: false,
  introduction: function () {
    console.log(`My name is ${this.name}. Am I human? ${this.isHuman}`)
  }
}

const me = Object.create(person)
me.name = 'Matthew'; // "name" is a property set on "me", but not on "person"
me.isHuman = true; // Inherited properties can be overwritten
me.printIntroduction();
// Expected output: "My name is Matthew. Am I human? true"
```
使用`Object.create()`实现类式继承。

```js
// Shape——父类
function Shape() {
  this.x = 0;
  this.y = 0;
}

// 父类方法
Shape.prototype.move = function (x, y) {
  this.x += x
  this.y += y
  console.info('Shape moved')
}

// Rectangle-子类
function Rectangle() {
  Shape.call(this) //调用父类构造函数。
}

Rectangle.prototype = Object.create(Shape.prototype, {
  constructor: {
    value: Rectangle,
    enumerable: false,
    writable: true,
    configurable: true
  }
})

const rect = new Rectangle()
console.log(rect instanceof Rectangle); // true
console.log(rect instanceof Shape); // true
```
#### [Object.defineProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

`Object.defineProperty(obj, prop, descriptor)`

**描述**：向对象添加一个由给**定描述符**描述的**命名属性**。

**参数**：

* `obj` 要定义属性的对象。
* `prop` 一个字符串或Symbol，指定了要**定义**或**修改**的**属性键**。
* `descriptor` 要定义或修改的属性和描述符。

**返回值**: 传入函数的对象，其**指定的属性**已被**添加**或**修改**。

对象中存在的属性描述符有两种主要类型：**数据描述符**和**访问器描述符**。（描述符只能是这两种类型之一，不能同时为两者）

* **数据描述符** 是一个具有可写或不可写值的属性。
* **访问器描述符** 是由 getter/setter 函数对描述的属性。

`configurable` 当设置为`false`时，**默认值为**`false`。

* 该属性的类型**不能**在数据属性和访问器属性之间**更改**
* 该属性不可被**删除**
* 其描述符的其他属性也**不能**被**更改**(但是，如果它是一个可写的数据描述符，则`value`可以被更改，`writeable`可以更改为`false`)
* 如果旧描述符的`configurable`特性被设置为`false`，则该属性被称为**不可配置**的，**无法更改不可配置的访问器属性的任何特性**，也**不能**将其在**数据类型和访问器类型之间切换**。对于具有`writable: true`的数据属性，可以修改其值并将`writable`特性从`true`改为`false`，对于其他情况一律会抛出报错`TypeError`。

```js
const obj = {};
Object.defineProperty(obj, 'example', {
  value: 42,
  writable: false,
  enumerable: true,
  configurable: false
});
console.log(obj.example); // 输出 42

// 尝试重新定义属性，会抛出错误
Object.defineProperty(obj, 'example', { value: 43 });
// or
obj.example = 43
// TypeError: Cannot redefine property: example

// 尝试删除属性，会返回 false
console.log(delete obj.example); // 输出 false

// 如果它是一个可写的数据描述符
Object.defineProperty(obj, 'num', {
  value: 100,
  writable: true,
  enumerable: true,
  configurable: false
});
console.log(obj.num); // 输出 100

Object.defineProperty(obj, 'num', { value: 1 });
// or
obj.num = 1

console.log(obj.num); // 输出 1

Object.defineProperty(obj, 'num', {
  value: 100,
  writable: false,
});

```
`enumerable`

当且仅当该属性在**对应对象**的**属性枚举**中**出现**时，值为`true`。**默认值为**`false`。

```js
const obj = {};
Object.defineProperty(obj, 'example', {
  value: 18,
  writable: true,
  enumerable: false, // 将enumerable设置为false
  configurable: true
});

for (let key in obj) {
  console.log(key); // 不会输出任何内容，因为属性不可枚举
}

console.log(Object.keys(obj)); // 输出 []
console.log(Object.values(obj)); // 输出 []
console.log(Object.entries(obj));  // 输出 []
console.log(obj.example); // 输出 18
```
**数据描述符**还具有以下可选键值：

* `value`
  与属性相关联的值。可以是任何有效的JavaScript值(数字、对象、函数等)。**默认值为**`undefined`

* `writable`

  如果与属性相关联的值可以使用赋值运算符更改，则为`true`。**默认值为**`false`。

  **访问器描述符**还具有以下可选键值：

* `get`

用作属性`getter`的函数，如果没有`getter`则为`undefined`。当访问该属性时，将不带参地调用此函数，并将`this`设置为通过该属性访问的对象。返回值将被用作该属性的值。**默认值为**`undefined`。

* `set`

用作属性`setter`的函数，如果没有`setter`则为`undefined`。当该属性被赋值时，将调用此函数，并带有一个参数，并将`this`设置为通过该属性分配的对象。**默认值为**`undefined`。

**案例**：

 **添加属性**

```js
const obj = {};
// 1. 使用 null 原型：没有继承的属性
const descriptor = Object.create(null);
descriptor.value = "static";

// 默认情况下，它们不可枚举、不可配置、不可写
Object.defineProperty(obj, "key", descriptor);

// 2. 使用一个包含所有属性的临时对象字面量来明确其属性
Object.defineProperty(obj, "key2", {
  enumerable: false,
  configurable: false,
  writable: false,
  value: "static",
});
```
**自定义setter和getter**

```js
function Archiver() {
  let task = null
  const archive = []
  Object.defineProperty(this, 'task', {
    get() {
      console.log('get')
      return task
    },
    set(value) {
      task = value
      archive.push({ taskName: task })
    }
  })
  this.getArchiver = () => archive
}
const arc = new Archiver
arc.task // get
arc.task = 'work'
arc.task = 'rest'
arc.getArchiver() // [{ val: 'work' }, { val: 'rest' }]
```
**继承属性**

如果访问器属性**被继承**，它的`get`和`set`会在派生对象的属性被访问或修改时被调用。

如果这些方法用**一个变量存值**，该值会被所有对象**共享**。

#### [Object.defineProperties()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)

`Object.defineProperties(obj, props)`

**描述**：向对象添加多个由给定描述符描述的命名属性。

**参数**：

* `obj` 在其上定义或修改的属性对象。
* `props` 一个对象，其中每个键表示要定义或修改的属性的名称。

**返回值**: 传入函数的对象，其**指定的多个属性**已被**添加**或**修改**。

具体信息和`Object.defineProperty()`的内容一样。

#### [Object.entries()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)

`Object.entries(obj)`

**描述**：返回包含给定对象自有可枚举字符串属性的所有 [key, value] 数组。

**参数**：`obj` 一个对象。

**返回值**：一个由给定对象自有的**可枚举字符串属性**的**键值对**组成的**数组**。每个键值对都是一个包含**两个**元素的数组：第一个元素是**属性的键**（始终是字符串），第二个元素是**属性值**。

**案例**：

```js
const obj = { foo: "bar", baz: 42 };
console.log(Object.entries(obj)); // [ ['foo', 'bar'], ['baz', 42] ]

// getFoo 是一个不可枚举的属性
// 如果是直接配置了 enumerable 则无法进行可枚举
const myObj = Object.create(
  {},
  {
    getFoo: {
      value() {
        return this.foo;
      },
    },
  },
);
myObj.foo = "bar";
console.log(Object.entries(myObj)); // [ ['foo', 'bar'] ]
```
在基本类型中使用`Object.entries()`，非对象参数会**强制转换成对象**。

`undefined`和`null`不能被强制转换为对象，会立即抛出报错。只有**字符串**可以有自己的**可枚举属性**，所有其他基本类型均返回一个空数组。

```js
// 字符串具有索引作为可枚举的自有属性
console.log(Object.entries("foo"));
// [ ['0', 'f'],['1', 'o'], ['2', 'o'] ]
// 其他基本类型（除了 undefined 和 null）没有自有属性
console.log(Object.entries(100)); // []
```
**将Object转换成Map**

[Map()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/Map)构造函数接受一个`entries`可迭代对象。使用`Object.entries`，可以很容易的将`Object`转换成`Map`。

```js
const obj = { foo: "bar", baz: 42 };
const map = new Map(Object.entries(obj));
console.log(map); // Map(2) {"foo" => "bar", "baz" => 42}
```
**遍历对象**

使用数组解构语法，可以很容易地遍历对象。

```js
// 使用 for...of 循环
const obj = { a: 5, b: 7, c: 9 }
for (const [key, value] of Object.entries(obj)) {
  console.log(`${key} ${value}`); // "a 5", "b 7","c 9"
}
// 使用数组方法
Object.entries(obj).forEach(([key, value])) => {
  console.log(`${key} ${value}`); // "a 5", "b 7","c 9"
})
```
#### [Object.freeze()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)

`Object.freeze(obj)`

**描述**：冻结一个对象。其他代码**不能删除**或**更改其任何属性**。

**参数**：`obj` 要冻结的对象。

**返回值**：传递给函数的对象。

冻结一个对象相当于**阻止其拓展**然后将所有现有**属性的描述符**`configurable`特性更改为`false`——对于数据属性，将同时把`writable`特性更改为`false`。

无法向被冻结的对象的属性添加。

**案例**：

```js
const obj = {
  prop() {},
  foo: 'bar'
}

obj.foo = 'baz'
obj.lumpy = 'woof'
delete obj.prop
// 冻结
const o = Object.freeze(obj)

// 返回值和我们传入的对象相同。
o === obj // true

// 对象已冻结。
Object.isFrozen(obj) // === true

// 现在任何更改都会失败
obj.foo = 'test'
```
**冻结数组**

```js
const a = [0]
Object.freeze(a) // 数组现在开始无法被修改
a[0] = 1 // 静默失败
// 尝试在数组末尾追加元素
a.push(2) // 抛出 TypeError
```
**浅冻结**

因为调用`Object.freeze(object)`的结果仅适用于`object`本身的**直接属性**，并只会在`object`上防止未来的属性添加、删除、或重新赋值操作的目标。如果这些属性的值本身是**复杂引用类型**，这些值**不会**被**冻结**，并且可能成为属性添加、删除，或重新赋值操作的目标。

```js
const person = {
  name: 'Tom',
  gender: 'man',
  address: {
    province: 'ZheJiang',
    city: 'HangZhou'
  }
}

Object.freeze(person)
person.name = 'John' // 在非严格模式下静默失败，严格模式下直接 TypeError
person.address.city = 'WenZhou' // 可以修改子对象的属性
console.log(person.address.city) // "WenZhou"
```
为了让对象不可变，需要进行**递归**地冻结每个对象类型的属性（**深冻结**）。深冻结对象时，需避免正在被处理的对象。但仍有可能有会冻结不应该被冻结的对象，例如`window`。

```js
function deepFreeze(object) {
  const propNames = Reflect.ownKeys(object)
  for (const name of propNames) {
    const value = object[name]
    if ((value && typeof value === 'object') || typeof value === 'fucntion') {
      deepFreeze(value)
    }
  }
  return Object.freeze(object)
}
```
#### [Object.fromEntries()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries)

`Object.fromEntries(iterable)`

**描述**：从一个包含 **[key, value]** 对的**可迭代对象**中返回一个**新**的**对象**（[Object.entries](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) 的反操作）。

**参数**：`iterable` 一个包含对象列表的可迭代对象，例如`Array`或者`Map`。每一个对象都要有两个属性：

* `0` 表示属性键的字符串或者`Symbol`。
* `1` 属性值。

通常，该对象被实现为二元数组，第一个元素是属性键，第二个元素是属性值。

**返回值**：一个新对象，其属性由可迭代对象的条目给定。

**案例**：

**将Map转换成对象**，通过`Object.fromEntries`，你可以将`Map`转换成`Object`：

```js
const map = new Map([
  ['foo', 'bar'],
  ['baz', 42]
])
const obj = Object.fromEntries(map)
console.log(obj) // { foo: 'bar', baz: 42 }
```
**将Array转换成对象**，通过`Object.fromEntries`，你可以将`Array`转换成`Object`：

```js
const arr = [
  ["0", "a"],
  ["1", "b"],
  ["2", "c"],
];
const obj = Object.fromEntries(arr);
console.log(obj); // { 0: "a", 1: "b", 2: "c" }
```
**对象转换**，通过`Object.fromEntries`、其逆操作`Object.entries()`和数组操作方法。

```js
const object1 = { a: 1, b: 2, c: 3 };

const object2 = Object.fromEntries(
  Object.entries(object1).map(([key, val]) => [key, val * 2])
);

console.log(object2); // { a: 2, b: 4, c: 6 }
```
#### [Object.getOwnPropertyDescriptor()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)

`Object.getOwnPropertyDescriptor(obj, prop)`

**描述**：返回**一个**对象的**已命名属性**的**属性描述符**。

**参数**：

* `obj` 要查找其属性的对象。
* `prop` 要检索其描述的属性的名称或`Symbol`。

**返回值**：如果指定的属性存在于对象上，则返回其**属性描述符**，否则返回`underfined`。

属性描述符：

* `value` 与属性关联的值（仅限数据描述符）。
* `writable` 当且仅当与属性关联的值可以更改时，为`true`（仅限数据描述符）。
* `get` 作为属性getter的函数，如果没有getter则为`undefined`（仅限访问器描述符）。
* `set` 作为属性setter的函数，如果没有setter则为`undefined`（仅限访问器描述符）。
* `configurable` 当且仅当此属性描述符的类型可以更改且该属性可以从相对应对象中删除时，为`true`。
* `enumerable` 当且仅当此属性在相对应的属性枚举中出现时，为`true`。

**案例**：

```js
let o, d;

o = {
  get foo() {
    return 17;
  },
};
d = Object.getOwnPropertyDescriptor(o, "foo");
console.log(d);
// {
//   configurable: true,
//   enumerable: true,
//   get: [Function: get foo],
//   set: undefined
// }

o = { bar: 42 };
d = Object.getOwnPropertyDescriptor(o, "bar");
console.log(d);
// {
//   configurable: true,
//   enumerable: true,
//   value: 42,
//   writable: true
// }

o = { [Symbol.for("baz")]: 73 };
d = Object.getOwnPropertyDescriptor(o, Symbol.for("baz"));
console.log(d);
// {
//   configurable: true,
//   enumerable: true,
//   value: 73,
//   writable: true
// }

o = {};
Object.defineProperty(o, "qux", {
  value: 8675309,
  writable: false,
  enumerable: false,
});
d = Object.getOwnPropertyDescriptor(o, "qux");
console.log(d);
// {
//   value: 8675309,
//   writable: false,
//   enumerable: false,
//   configurable: false
// }
```
#### [Object.getOwnPropertyDescriptors()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors)

`Object.getOwnPropertyDescriptors(obj)`

**描述**：返回一个包含对象**所有自有属性**的**属性描述符**的对象。

**参数**：`obj` 要获取其所有自有属性描述符的对象。

**返回值**：一个包含给定对象的所有自有属性描述符的对象。如果没有属性，则可能是一个空对象。

具体信息和`Object.getOwnPropertyDescriptor()`的内容一样。

#### [Object.getOwnPropertyNames()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames)

`Object.getOwnPropertyNames(obj)`

**描述**：返回一个包含给定对象的**所有自有可枚举**和**不可枚举属性名称**的**数组**。

**参数**：`obj` 一个对象，其自有的可枚举和不可枚举属性的名称被返回。

**返回值**：在给定对象上找到的**自有属性**对应的**字符串数组**。

注意：在ES5，如果该方法的参数不是一个对象，会抛出TypeError；在ES2015中，非对象参数会被强制转换为对象。

```js
Object.getOwnPropertyNames("foo");
// TypeError: "foo" is not an object (ES5 code)

Object.getOwnPropertyNames("foo");
// ["0", "1", "2", "length"]  (ES2015 code)
```
**案例**：

```js
const arr = ["a", "b", "c"];
console.log(Object.getOwnPropertyNames(arr).sort());
// ["0", "1", "2", "length"]

// 类数组对象
const obj = { 0: "a", 1: "b", 2: "c" };
console.log(Object.getOwnPropertyNames(obj).sort());
// ["0", "1", "2"]

Object.getOwnPropertyNames(obj).forEach((val, idx, array) => {
  console.log(`${val} -> ${obj[val]}`);
});
// 0 -> a
// 1 -> b
// 2 -> c

// 不可枚举属性
const myObj = Object.create(
  {},
  {
    getFoo: {
      value() {
        return this.foo;
      },
      enumerable: false,
    },
  },
);
myObj.foo = 1;

console.log(Object.getOwnPropertyNames(myObj).sort()); // ["foo", "getFoo"]
```
**只获取不可枚举的属性**

```js
const target = myObject
const enumAndNonEnum = Object.getOwnPropertyNames(target)
const enumOnly = new Set(Object.keys(target))
const nonEnumOnly = enumAndNonEnum.filter((key) => !enumOnly.has(key))
console.log(nonEnumOnly)
```
#### [Object.getOwnPropertySymbols()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)

`Object.getOwnPropertySymbols(obj)`

**描述**：返回一个数组，它包含了指定对象所有自有 symbol 属性。

**参数**：`obj` 要返回Symbol属性的对象

**返回值**：在给定对象找到的所有自有的Symbol属性的数组。

**案例**：

```js
const obj = {};
const a = Symbol("a");
const b = Symbol.for("b");

obj[a] = "localSymbol";
obj[b] = "globalSymbol";

const objectSymbols = Object.getOwnPropertySymbols(obj);

console.log(objectSymbols.length); // 2
console.log(objectSymbols); // [Symbol(a), Symbol(b)]
console.log(objectSymbols[0]); // Symbol(a)
```
#### [Object.getPrototypeOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf)

`Object.getPrototypeOf(obj)`

**描述**：返回指定对象的原型（内部的 [[Prototype]] 属性）。

**参数**：`obj` 要返回其原型的对象。

**返回值**：给定对象的原型，可能是`null`

**案例**：

```js
const proto = {}
const obj = Object.create(proto)
Object.getPrototypeOf(obj) === proto // true
```
#### [Object.hasOwn()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn)

`Object.hasOwn(obj, prop)`

**描述**：如果指定属性是指定对象的自有属性，则返回`true`，否则返回`false`。如果该属性是继承的或不存在，则返回`false`。

**参数**：

* `obj` 要测试的JavaScript实例对象。
* `prop` 要测试属性的string类型的名称或者symbol。

**返回值**：如果指定的对象中直接定义了指定的属性，则返回`true`；否则返回`false`。

**案例**：

**使用hasOwn去测试属性是否存在**

```js
const example = {};
Object.hasOwn(example, "prop"); // false——目标对象的属性 'prop' 未被定义

example.prop = "exists";
Object.hasOwn(example, "prop"); // true——目标对象的属性 'prop' 已被定义

example.prop = null;
Object.hasOwn(example, "prop"); // true——目标对象本身的属性存在，值为 null

example.prop = undefined;
Object.hasOwn(example, "prop"); // true——目标对象本身的属性存在，值为 undefined
```
**直接属性vs继承属性**

区分直接属性和通过原型链继承的属性：

```js
const example = {};
example.prop = "exists";

// `hasOwn` 静态方法只会对目标对象的直接属性返回 true：
Object.hasOwn(example, "prop"); // 返回 true
Object.hasOwn(example, "toString"); // 返回 false
Object.hasOwn(example, "hasOwnProperty"); // 返回 false

// `in` 运算符对目标对象的直接属性或继承属性均会返回 true：
"prop" in example; // 返回 true
"toString" in example; // 返回 true
"hasOwnProperty" in example; // 返回 true
```
**迭代对象的属性**

```js
const example = {
  foo: true,
  bar: true
};
for (const name of Object.keys(example)) {
  // …
}
```
如果使用`for...in`，可以使用`Object.hasOwn()`跳过继承属性：

```js
const example = { foo: true, bar: true };
for (const name in example) {
  if (Object.hasOwn(example, name)) {
    // …
  }
}
```
**检测数组索引是否存在**

数组中的元素被定义为直接属性，所以可以使用`hasOwn()`方法去检查一个指定的索引是否存在：

```js
const fruits = ["Apple", "Banana", "Watermelon", "Orange"];
Object.hasOwn(fruits, 3); // true ('Orange')
Object.hasOwn(fruits, 4); // false——没有定义的
```
#### [Object.is()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is)

`Object.is(value1, value2)`

**描述**：比较两个值是否相同。所有 NaN 值都相等（这与 [==](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Equality) 使用的 IsLooselyEqual 和 [===](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Strict_equality) 使用的 IsStrictlyEqual 不同）。

**参数**：

* `value1` 要比较的第一个值。
* `value2` 要比较的第二个值。

**返回值**：一个布尔值，指示两个参数是否为相同的值。

`Object.is()`与[==](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Equality)、[===](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Strict_equality)这两个运算符不等价。

* [==](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Equality)在测试相等性前会进行类型转换，而`Object.is()`不会对其操作数进行类型转换。
* [===](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Strict_equality)与`Object.is()`之间的唯一区别在于它们处理带符号的0和`NaN`值的时候。[===](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Strict_equality)运算符（和[==](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Equality)）将数值`+0`和`-0`视为相等，但是会将`NaN`视为彼此不相等。

**案例**：

```js
// 案例 1：评估结果和使用 === 相同
Object.is(25, 25); // true
Object.is("foo", "foo"); // true
Object.is("foo", "bar"); // false
Object.is(null, null); // true
Object.is(undefined, undefined); // true
Object.is(window, window); // true
Object.is([], []); // false
const foo = { a: 1 };
const bar = { a: 1 };
const sameFoo = foo;
Object.is(foo, foo); // true
Object.is(foo, bar); // false
Object.is(foo, sameFoo); // true

// 案例 2: 带符号的 0
Object.is(0, -0); // false
Object.is(+0, -0); // false
Object.is(-0, -0); // true

// 案例 3: NaN
Object.is(NaN, 0 / 0); // true
Object.is(NaN, Number.NaN); // true
```
#### [Object.isExtensible()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible)

`Object.isExtensible(obj)`

**描述**：判断对象是否可扩展（是否可以在它上面添加新的属性）。

**参数**：`obj` 要检查的对象。

**返回值**：指示给定对象是否可拓展的一个[布尔值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean)。

默认情况下，对象是可拓展的：可以向它们添加新属性，并且它们的`[[Prototype]]`可以被重新赋值。可以使用 [Object.preventExtensions()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions)、[Object.seal()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/seal)、[Object.freeze()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) 或 [Reflect.preventExtensions()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/preventExtensions) 中的任一方法将对象标记为不可扩展。

**案例**：

```js
// 新对象是可拓展的。
const empty = {};
Object.isExtensible(empty); // true

// 它们可以变为不可拓展的
Object.preventExtensions(empty);
Object.isExtensible(empty); // false

// 根据定义，密封对象是不可拓展的。
const sealed = Object.seal({});
Object.isExtensible(sealed); // false

// 根据定义，冻结对象同样也是不可拓展的。
const frozen = Object.freeze({});
Object.isExtensible(frozen); // false
```
#### [Object.isFrozen()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen)

`Object.isFrozen(obj)`

**描述**：判断对象是否已经冻结。

**参数**：`obj` 要检测的对象。

**返回值**：指示给定对象是否被冻结的[布尔值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean)。

一个对象，当且**仅当它不可**[**拓展**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible)，且**所有属性**都是**不可配置**的，**所有的数据属性**（即不是有 getter 或 setter 的访问器属性的属性）都是**不可写**的时，它就是**被冻结**的。

**案例**：

```js
// 一个新对象是默认是可扩展的，所以它也是非冻结的。
Object.isFrozen({}); // false

// 一个不可扩展的空对象同时也是一个冻结对象。
const vacuouslyFrozen = Object.preventExtensions({});
Object.isFrozen(vacuouslyFrozen); // true

// 一个非空对象默认也是非冻结的。
const oneProp = { p: 42 };
Object.isFrozen(oneProp); // false

// 即使令对象不可扩展，它也不会被冻结，因为属性仍然是可配置的（而且可写的）。
Object.preventExtensions(oneProp);
Object.isFrozen(oneProp); // false

// 此时，如果删除了这个属性，则它会成为一个冻结对象。
delete oneProp.p;
Object.isFrozen(oneProp); // true

// 一个不可扩展的对象，拥有一个不可写但可配置的属性，则它仍然是非冻结的。
const nonWritable = { e: "plep" };
Object.preventExtensions(nonWritable);
Object.defineProperty(nonWritable, "e", {
  writable: false,
}); // 令其不可写
Object.isFrozen(nonWritable); // false

// 把这个属性改为不可配置，会让这个对象成为冻结对象。
Object.defineProperty(nonWritable, "e", {
  configurable: false,
}); // 令其不可配置
Object.isFrozen(nonWritable); // true

// 一个不可扩展的对象，拥有一个不可配置但可写的属性，则它也是非冻结的。
const nonConfigurable = { release: "the kraken!" };
Object.preventExtensions(nonConfigurable);
Object.defineProperty(nonConfigurable, "release", {
  configurable: false,
});
Object.isFrozen(nonConfigurable); // false

// 把这个属性改为不可写，会让这个对象成为冻结对象。
Object.defineProperty(nonConfigurable, "release", {
  writable: false,
});
Object.isFrozen(nonConfigurable); // true

// 一个不可扩展的对象，拥有一个访问器属性，则它仍然是非冻结的。
const accessor = {
  get food() {
    return "yum";
  },
};
Object.preventExtensions(accessor);
Object.isFrozen(accessor); // false

// 把这个属性改为不可配置，会让这个对象成为冻结对象。
Object.defineProperty(accessor, "food", {
  configurable: false,
});
Object.isFrozen(accessor); // true

// 使用 Object.freeze 是冻结一个对象最方便的方法。
const frozen = { 1: 81 };
Object.isFrozen(frozen); // false
Object.freeze(frozen);
Object.isFrozen(frozen); // true

// 根据定义，一个冻结对象是不可拓展的。
Object.isExtensible(frozen); // false

// 同样，根据定义，一个冻结对象也是密封对象。
Object.isSealed(frozen); // true
```
#### [Object.isSealed()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isSealed)

`Object.isSealed(obj)`

**描述**：判断对象是否已经封闭。

**参数**：`obj` 要被检查的对象。

**返回值**：一个表示给定对象是否被密封的[布尔值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean)。

如果这个对象是密封的，则返回`true`，否则返回`false`。密封对象是指那些**不**[**可扩展**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible)的，且**所有自有属性**都**不可配置**且因此**不可删除**（**但不一定是不可写**）的对象。

**案例**：

```js
// 新建的对象默认不是密封的。
const empty = {};
Object.isSealed(empty); // false

// 如果你令一个空对象不可扩展，则它同时也会变成个密封对象。
Object.preventExtensions(empty);
Object.isSealed(empty); // true

// 但如果这个对象不是空对象，则它不会变成密封对象，因为密封对象的所有自身属性必须是不可配置的。
const hasProp = { fee: "fie foe fum" };
Object.preventExtensions(hasProp);
Object.isSealed(hasProp); // false

// 如果把这个属性变的不可配置，则这个属性也就成了密封对象。
Object.defineProperty(hasProp, "fee", {
  configurable: false,
});
Object.isSealed(hasProp); // true

// 密封一个对象最简单的方法当然是 Object.seal。
const sealed = {};
Object.seal(sealed);
Object.isSealed(sealed); // true

// 根据定义，密封对象是不可扩展的。
Object.isExtensible(sealed); // false

// 一个密封对象可能被冻结，但不一定。
Object.isFrozen(sealed); // true
//（所有属性也是不可写的）

const s2 = Object.seal({ p: 3 });
Object.isFrozen(s2); // false
//（'p' 仍然可写）

const s3 = Object.seal({
  get p() {
    return 0;
  },
});
Object.isFrozen(s3); // true
//（对于访问器属性，只有可配置性才有影响）
```
#### [Object.keys()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)

`Object.keys(obj)`

**描述**：返回一个包含**所有**给定对象**自有可枚举字符串属性**名称的**数组**。

**参数**：`obj` 一个对象。

**返回值**：一个由给定对象**自身可枚举**的**字符串键属性键**组成的**数组**。

`Object.keys()`返回一个数组，其元素是字符串，对应于直接在对象上找到的可枚举的字符串键属性名。这与使用 [for...in](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in) 循环迭代**相同**，**只是**`for...in`循环还会枚举**原型链中的属性**。`Object.keys()`返回的数组顺序和与 [for...in](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in) 循环提供的**顺序相同**。

**案例**：

```js
// 简单数组
const arr = ["a", "b", "c"];
console.log(Object.keys(arr)); // ['0', '1', '2']

// 类数组对象
const obj = { 0: "a", 1: "b", 2: "c" };
console.log(Object.keys(obj)); // ['0', '1', '2']

// 键的顺序随机的类数组对象
const anObj = { 100: "a", 2: "b", 7: "c" };
console.log(Object.keys(anObj)); // ['2', '7', '100']

// getFoo 是一个不可枚举的属性
const myObj = Object.create(
  {},
  {
    getFoo: {
      value() {
        return this.foo;
      },
    },
  },
);
myObj.foo = 1;
console.log(Object.keys(myObj)); // ['foo']
```
#### [Object.preventExtensions()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions)

`Object.preventExtensions(obj)`

**描述**：防止对象的任何扩展。

**参数**：`obj` 将要变得不可拓展的对象。

**返回值**：已经不可拓展的对象。

如果一个对象可以**添加新的属**性，则这个对象是**可拓展**。

`Object.preventExtensions()`将对象标记为**不再可拓展**，这样它将永远不会具有它被标记为不可拓展时持有的属性之外的属性。（注意：一般来说，不可拓展对象的属性仍然可以被**删除**，尝试向不可拓展对象添加新属性将**静默失**败，严格模式下抛出报错）。

`Object.preventExtensions()`只能**防止添加自有属性**。但其**对象类型的原型**依然可以**添加新的属性**。

**案例**：

```js
// Object.preventExtensions 将原对象变的不可扩展，并且返回原对象。
const obj = {};
const obj2 = Object.preventExtensions(obj);
obj === obj2; // true

// 字面量方式定义的对象默认是可扩展的。
const empty = {};
Object.isExtensible(empty); // true

// 可以将其改变为不可扩展的。
Object.preventExtensions(empty);
Object.isExtensible(empty); // false

// 使用 Object.defineProperty 方法为一个不可扩展的对象添加新属性会抛出异常。
const nonExtensible = { removable: true };
Object.preventExtensions(nonExtensible);
Object.defineProperty(nonExtensible, "new", {
  value: 8675309,
}); // 抛出 TypeError

// 在严格模式中，为一个不可扩展对象的新属性赋值会抛出 TypeError 异常。
function fail() {
  "use strict";
  // 抛出 TypeError
  nonExtensible.newProperty = "FAIL";
}
fail();
```
#### [Object.seal()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/seal)

`Object.seal(obj)`

**描述**：防止其他代码删除对象的属性。

**参数**：`obj` 要密封的对象。

**返回值**：被密封的对象。

`Object.seal()`静态方法*密封*一个对象。密封一个对象会**阻止其拓展**并且使得现有属性不可配置。

密封对象有一组固定的属性：

* 不能添加新属性
* 不能删除现有属性
* 更改其可枚举性和可配置性
* 不能重新分配其原型

只要现有属性的值是可写的，它们仍然可以更改。

**案例**：

```js
const obj = {
  prop() {},
  foo: "bar",
};

// 可以添加新属性，可以更改或删除现有属性。
obj.foo = "baz";
obj.lumpy = "woof";
delete obj.prop;

const o = Object.seal(obj);

o === obj; // true
Object.isSealed(obj); // true

// 更改密封对象的属性值仍然有效。
obj.foo = "quux";

// 但不能将数据属性转换成访问者属性，反之亦然。
Object.defineProperty(obj, "foo", {
  get() {
    return "g";
  },
}); // 抛出 TypeError

// 现在，除了属性值之外的任何更改都将失败。
obj.quaxxor = "the friendly duck";
// 静默不添加属性
delete obj.foo;
// 静默不添删除属性

// ...且严格模式下，这种尝试将会抛出 TypeError。
function fail() {
  "use strict";
  delete obj.foo; // 抛出一个 TypeError
  obj.sparky = "arf"; // 抛出一个 TypeError
}
fail();

// 尝试通过 Object.defineProperty 添加属性也会抛出错误。
Object.defineProperty(obj, "ohai", {
  value: 17,
}); // 抛出 TypeError
Object.defineProperty(obj, "foo", {
  value: "eit",
}); // 更改现有属性值
```
#### [Object.setPrototypeOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf)

`Object.setPrototypeOf(obj, prototype)`

**描述**：设置对象的原型（即内部 [[Prototype]] 属性）。

**参数**：

* `obj` 要设置其原型的对象。
* `prototype` 该对象的新原型（一个对象或`null`）

**返回值**：指定的对象。

**异常**：如果发生一下情况中的任何一个，则抛出该异常：

* `obj`参数为`undefined`或`null`。
* `obj`参数是[不可扩展的](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible)，或者它是一个[不可修改原型的特异对象](https://tc39.es/ecma262/#sec-immutable-prototype-exotic-objects)。
* `prototype`参数不是对象或`null`。

**警告**：使用`Object.setPrototypeOf()`操作时长很长，可能会带来一系列问题。

**案例**：

**使用Object.setPrototypeOf()实现伪类**

```js
// js 可以通过这样实现类继承
class Human {}
class SuperHero extends Human {};
const superMan = new SuperHero();

// 不使用class的情况下实现子类
function Human(name, level) {
  this.name = name
  this.level = level
}

function SuperHero(name, level) {
  Human.call(this, name, level)
}

Object.setPrototypeOf(SuperHero.prototype, Human.prototype)
// 将 SuperHero.prototype 的 [[Prototype]] 设置为 Human.prototype 以设置原型继承链
Human.prototype.speak = function () {
  return `${this.name} says hello.`
}
SuperHero.prototype.fly = function () {
  return `${this.name} is flying.`
}

const superMan = new SuperHero('Clark Kent, 1')
console.log(superMan.fly())
console.log(superMan.speak())
```
#### [Object.values()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/values)

`Object.values(obj)`

**描述**：返回包含给定对象所有自有可枚举字符串属性的值的数组。

**参数**：`obj` 一个对象

**返回值**：一个包含了给定对象的自有**可枚举字符串键属性值**的**数组**。

**案例**：

```js
const obj = { foo: "bar", baz: 42 };
console.log(Object.values(obj)); // ['bar', 42]

// 类数组对象
const arrayLikeObj1 = { 0: "a", 1: "b", 2: "c" };
console.log(Object.values(arrayLikeObj1)); // ['a', 'b', 'c']

// 具有随机键排序的类数组对象
// 使用数字键时，将按键的数字顺序返回值
const arrayLikeObj2 = { 100: "a", 2: "b", 7: "c" };
console.log(Object.values(arrayLikeObj2)); // ['b', 'c', 'a']

// getFoo 是一个不可枚举的属性
const myObj = Object.create(
  {},
  {
    getFoo: {
      value() {
        return this.foo;
      },
    },
  },
);
myObj.foo = "bar";
console.log(Object.values(myObj)); // ['bar']
```
非对象参数会**强制转换为对象**。`undefined`和`null`不能被强制转换为对象，会立即抛出报错。

### 实例属性

这些属性在`Object.prototype`上定义，被所有`Object`实例所共享。

#### [Object.prototype.\_\_proto\_\_](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/proto)弃用

指向实例对象在实例化时使用的原型对象。

#### [Object.prototype.constructor](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor)

创建该实例对象的**构造函数**。对于普通的`Object`实例，初始值为`Object`构造函数。其它构造函数的实例都会从他们各自的`**Constructor.prototype**`对象中继承`constructor`属性。

### 实例方法

[Object.prototype.hasOwnProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)

`hasOwnProperty(prop)`

**描述**：返回一个布尔值，用于表示一个对象自身是否包含指定的属性，该方法并不会查找原型链上继承来的属性。

如果指定的属性是对象的**直接属性**——即使值为`null`或者`undefined`，`**hasOwnProperty()**`方法也会返回`true`。如果属性是**继承**的，或者**根本没有声明该属性**，则该方法返回`false`。

与`[in](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/in)`运算符不同的是，该方法不会在对象原型链中检查指定的属性。

**返回值**：布尔值。

**备注**：在支持`Object.hasOwn`的浏览器中，建议使用`Object.hasOwn()`，而非`hasOwn Property()`。（与`Object.hasOwn()`有点类似）

**案例**：

**查看索引是否存在**

```js
const fruits = ["Apple", "Banana", "Watermelon", "Orange"];
fruits.hasOwnProperty(3); // 返回 true ('Orange')
fruits.hasOwnProperty(4); // 返回 false——未定义
```
**查看自有属性是否存在**

```js
const example = {};
example.hasOwnProperty("prop"); // 返回 false

example.prop = "exists";
example.hasOwnProperty("prop"); // 返回 true——“prop”已定义

example.prop = null;
example.hasOwnProperty("prop"); // 返回 true——自有属性存在且值为 null

example.prop = undefined;
example.hasOwnProperty("prop"); // 返回 true——自有属性存在且值为 undefined
```
**直接属性vs继承属性**

区分直接属性和通过原型链继承的属性：

```js
const example = {};
example.prop = "exists";

// `hasOwnProperty` 仅对直接属性返回 true：
example.hasOwnProperty("prop"); // 返回 true
example.hasOwnProperty("toString"); // 返回 false
example.hasOwnProperty("hasOwnProperty"); // 返回 false

// 对于直接或继承的属性，`in` 运算符将返回 true：
"prop" in example; // 返回 true
"toString" in example; // 返回 true
"hasOwnProperty" in example; // 返回 true
```
**遍历对象的属性**

```js
const buz = {
  fog: "stack",
};
// for...in 循环只迭代可枚举属性
for (const name in buz) {
  if (buz.hasOwnProperty(name)) {
    console.log(`this is fog (${name}) for sure. Value: ${buz[name]}`);
  } else {
    console.log(name); // toString 或其他的方法等
  }
}
```
**使用hasOwnProperty作为属性名称**

```js
const foo = {
  hasOwnProperty() {
    return false;
  },
  bar: "Here be dragons",
};

foo.hasOwnProperty("bar"); // 该重新实现始终返回 false
```
[Object.prototype.isPrototypeOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isPrototypeOf)

`isPrototypeOf(object)`

**描述**：返回一个布尔值，用于表示该方法所**调用的对象**是否在**指定对象**的**原型链中**。

所有继承自`Object.prototype`的对象（即除了`null`原型对象之外的对象）都继承了`isPrototypeOf()`方法。

**返回值**：布尔值。

**案例**：

```js
class Foo {}
class Bar extends Foo {}
class Baz extends Bar {}

const foo = new Foo();
const bar = new Bar();
const baz = new Baz();

// 原型链：
// foo: Foo --> Object
// bar: Bar --> Foo --> Object
// baz: Baz --> Bar --> Foo --> Object
console.log(Baz.prototype.isPrototypeOf(baz)); // true
console.log(Baz.prototype.isPrototypeOf(bar)); // false
console.log(Baz.prototype.isPrototypeOf(foo)); // false
console.log(Bar.prototype.isPrototypeOf(baz)); // true
console.log(Bar.prototype.isPrototypeOf(foo)); // false
console.log(Foo.prototype.isPrototypeOf(baz)); // true
console.log(Foo.prototype.isPrototypeOf(bar)); // true
console.log(Object.prototype.isPrototypeOf(baz)); // true
```
[Object.prototype.propertyIsEnumerable()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable)

`propertyIsEnumerable(prop)`

**描述**：返回一个布尔值，指示指定属性是否是对象的[可枚举自有属性](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)。

**返回值**：布尔值。

**案例**：

```js
const object1 = {};
const array1 = [];
object1.property1 = 42;
array1[0] = 42;

console.log(object1.propertyIsEnumerable('property1'));
// Expected output: true

console.log(array1.propertyIsEnumerable(0));
// Expected output: true

console.log(array1.propertyIsEnumerable('length'));
// Expected output: false
```
[Object.prototype.toLocaleString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toLocaleString)

`toLocaleString()`

**描述**：返回一个表示对象的字符串。该方法旨在由派生对象重写，以达到其特定于语言环境的目的。

**返回值**：调用 [toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString) 的返回值。

在核心语言中，这些内置对象重写了`toLocaleString`以提供特定于语言环境的格式：

* [Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)：[Array.prototype.toLocaleString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/toLocaleString)
* [Number](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number)：[Number.prototype.toLocaleString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString)
* [Date](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date)：[Date.prototype.toLocaleString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString)
* [TypedArray](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)：[TypedArray.prototype.toLocaleString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/toLocaleString)
* [BigInt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt)：[BigInt.prototype.toLocaleString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt/toLocaleString)
**案例**：

**基本的toLocaleString()方法**

基本的`toLocaleString()`方法只是简单地调用`toString()`。

```js
const obj = {
  toString() {
    return "My Object";
  },
};
console.log(obj.toLocaleString()); // "My Object"
```
**Array重写的toLocaleString()**

[Array.prototype.toLocaleString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/toLocaleString) 用于将数组值打印成字符串，通过调用每个元素的`toLocaleString()`方法，并使用特定于语言环境的分隔符拼接。例如：

```js
const testArray = [4, 7, 10];

const euroPrices = testArray.toLocaleString("fr", {
  style: "currency",
  currency: "EUR",
});
// "4,00 €,7,00 €,10,00 €"
```
**Date重写的toLocaleString()**

[Date.prototype.toLocaleString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString) 用于打印成更适合特定语言环境的日期显示。例如：

```js
const testDate = new Date();
// "Fri May 29 2020 18:04:24 GMT+0100 (British Summer Time)"

const deDate = testDate.toLocaleString("de");
// "29.5.2020, 18:04:24"

const frDate = testDate.toLocaleString("fr");
// "29/05/2020, 18:04:24"
```
**Number重写的toLocaleString()**

[Number.prototype.toLocaleString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString) 用于打印成更适合特定语言环境的数字显示，例如使用正确的分隔符。例如：

```js
const testNumber = 2901234564;
// "2901234564"

const deNumber = testNumber.toLocaleString("de");
// "2.901.234.564"

const frNumber = testNumber.toLocaleString("fr");
// "2 901 234 564"
```
[Object.prototype.toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)

返回一个代表该对象的字符串。

[Object.prototype.valueOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf)

`valueOf()`

**描述**：返回指定对象的基本类型值。

Object实例的`valueOf()`方法将`this`值转换为对象。该方法旨在被派生对象重写，以实现自定义逻辑。

**案例**：

```js
const obj = { foo: 1 }
console.log(obj.valueOf() === obj) // true
console.log(Object.prototype.valueOf.call('primitive'))
// [String: 'primitive'](一个包装对象)
```
### 参考链接

[Object - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object#%E6%8F%8F%E8%BF%B0)