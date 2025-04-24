# 关于this
### 为什么要用this
下面我们来解释一下为什么要使用**this**

```javascript
function identify() {
  return this.name.toUpperCase()
}

function speak() {
  var greeting = "Hello, I'm " + identify.call(this);
  console.log(greeting);
}

var me = {
  name: "Kyle"
};

var you = {
  name: "Reader"
};

identify.call(me); // KYLE
identify.call(you); // READER

speak.call(me); // Hello,I'm KYLE
speak.call(you); // Hello, I'm READER
```

:::tip
这段代码可以在不同的上下文对象（me 和 you）中重复使用函数 `identify()` 和 `speak()`，不用针对每个对象编写不同版本的函数。
:::

如果不是用**this**，那就需要给 `identify()` 和 `speak()` 显式传入一个上下文对象。

```javascript
function identify(context) {
  return context.name.toUpperCase()
}

function speak(context) {
  var greeting = "Hello, I'm " + identify(context);
  console.log(greeting)
}

identify(you); // READER
speak(me); // Hello,我是KYLE
```

::: tip
然而this 提供了一种更优雅的方式来**隐式传递**一个对象的引用，因此可以将 API 设计得更加简洁并且易于复用。
:::

### 误解
有两种常见的对于 this 的解释，但是它们都是<font style="color:#E8323C;">**错误**</font>的：

+ **this 理解为指向函数自身**
+ **this 指向函数的作用域**

#### 指向自身
:::warning 误解
人们很容易把<font style="color:#E8323C;">this 理解为指向函数自身</font>，常见的原因是递归或者是可以写一个在第一次被调用后自己解除绑定的事件处理器。
:::

人们一般认为函数既然看作一个对象，那就可以在调用函数时存储状态（属性的值）。但除了函数对象还有许多**更合适**的存储状态的地方。

:::danger 举例函数 foo 被调用的次数，如下代码所示。


```javascript
function foo(num) {
  console.log("foo:"+num);
  // 记录foo被调用的次数
  this.count++
}

foo.count = 0;

var i;

for (i = 0; i < 10; i++) {
  if(i > 5) {
    foo(i)
  }
}
// foo:6
// foo:7
// foo:8
// foo:9

// foo被调用了多少次？
console.log(foo.count); // 0 -- WTF?
```

**代码解析**：`console.log` 语句产生了 4 条输出，证明 `foo(..)` 确实被调用了 4 次，但是 `foo.count` 仍然是 0。显然从字面意思来理解 this 是错误的。

执行 `foo.count = 0` 时，的确向函数对象 foo 添加了一个属性 count。但是函数内部代码 `this.count` 中的 this 并不是指向那个函数对象，而是**无意间创建了一个全局变量 count，它的值为 NaN**，所以虽然**属性名相同**，**根对象**却并**不相同**。
:::


遇到这种问题，许多人只会回避这个问题使用其他的方法来达到目的，比如创建另一个带有count属性的对象。这种方法利用了**词法作用域**来“解决”了问题。

::: code-group
```javascript [使用词法作用域]
function foo(num) {
  console.log("foo:"+num);
  // 记录foo被调用的次数
  data.count++
}

var data = {
  count: 0
}

var i;

for (i = 0; i < 10; i++) {
  if(i > 5) {
    foo(i)
  }
}
// foo:6
// foo:7
// foo:8
// foo:9

// foo被调用了多少次？
console.log(data.count); // 4
```
:::

如果要从函数对象内部引用它自身，那只使用 **this** 是不够的。一般来说需要通过一个**指向函数对象的词法标识符**（变量）来引用它。

可以思考右侧的代码中的这两个函数，第一个为**具名函数**，在**内部**可以使用**foo来引用自身**。第二个是传入**setTimeout(..)** 的回调函数没有名称标识符，是**匿名函数**，因此无法从函数内部引用自身。

::: code-group
```javascript [具名函数]

function foo() {
  foo..count = 4; // foo 指向它自身
}
console.dir(foo); 
// 可以看到foo函数上有一个count属性
setTimeout(() => {
  // 匿名（没有名字的）函数无法指向自身
}, 10);
```
:::

所以使用foo标识符代替**this**来引用函数对象，也是回避了**this**的问题，完全依赖于变量foo的**词法作用域**。

::: code-group
```javascript [foo标识符代替this]
function foo(num) {
  console.log("foo:"+num);
  // 记录foo被调用的次数
  foo.count++
}

foo.count = 0

var i;

for (i = 0; i < 10; i++) {
  if(i > 5) {
    foo(i)
  }
}
// foo:6
// foo:7
// foo:8
// foo:9

// foo被调用了多少次？
console.log(foo.count); // 4
```
:::

另一种方法是强制**this**指向foo函数对象：

::: code-group
```javascript [强制this指向foo函数对象]
function foo(num) {
  console.log("foo:"+num);
  // 记录foo被调用的次数
  // 注意，在当前的调用方式下，this确实指向foo
  this.count++
}

foo.count = 0

var i;

for (i = 0; i < 10; i++) {
  if(i > 5) {
    // 使用call(..) 可以确保this指向函数对象foo本身
    foo.call(foo,i)
  }
}
// foo:6
// foo:7
// foo:8
// foo:9

// foo被调用了多少次？
console.log(foo.count); // 4
```
:::
#### 它的作用域


第二种常见的误解是，<font style="color:#E8323C;">**this指向函数的作用域**</font>。这个问题有点复杂，因为在**某些情况**下它是**正确**的，但是在**其他情况**下它却是**错误**的。

需要明确的是，**this在任何情况下都不指向函数的词法作用域**。

:::tip 思考下方的代码，其中有很多**错误**。


```javascript
function foo() {
  var a = 2;
  this.bar()
}

function bar() {
  console.log(this.a,'bar-a')
}

foo();
// ReferenceError: a is not defined
```

1. 代码中`this.bar()`来引用`bar()`函数就错误了。调用`bar()`应该直接使用**词法引用标识符**，即直接`bar()`来调用。
2. 让`bar()`来访问`foo()`作用域的变量a，这也是不可能的，不能使用**this**来引用一个词法作用域内的东西。

:::

### this到底是什么

**this的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式。**

当一个函数被调用时，你创建一个**活动记录(也被称为执行上下文)**。这个记录会包含函数在哪里被调用(**调用栈**)、**函数的调用方法**、**传入的参数**等信息。**this**就是**记录等其中一个属性**，会在函数执行的过程中用到，**即this是执行上下文的属性**。

### 小结
**this**实际上是在函数被调用时候发生的绑定，它指向什么完全取决于函数在哪里被调用。

