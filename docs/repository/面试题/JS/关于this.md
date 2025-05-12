# 关于this

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

::: tip 案例
```javascript
var length = 4;
function callback() {
	console.log(this.length); // => 打印出什么？
} // this指向外面的window，var length = 4 会被挂载到全局上
const obj = {
	length: 5,
	method(callback) {
		callback(); // callback.call(undefined)
	}
};
obj.method(callback, 1, 2);
```
:::

### call、apply、bind

1. call

	`call` 方法使用**一个指定**的 `this` 值和单独给出的**一个或多个参数**来调用一个函数。

	```javascript
	function add(a, b) {
		return a + b;
	}
	add.call(this, 1, 2) // 3
	```

2. apply

	`apply` 方法和 `call` 方法类似，但是可以接受一个**含多参数的数组**。

	```javascript
	function f(x, y){
		console.log(x + y);
	}
	f.call(null, 1, 1) // 2
	f.apply(null, [1, 1]) // 2
	```


3. bind

	`bind` 方法用于将函数体内的 `this` **绑定到某个对象**，然后**返回一个新函数**。

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

### 参考资料

[call、apply、bind 的用法和this](https://www.yuque.com/baizhe-kpbhu/gayz3l/kplahu)

[this 的值到底是什么？一次说清楚](https://zhuanlan.zhihu.com/p/23804247)

