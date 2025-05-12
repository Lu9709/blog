# JS如何实现类

### 1. 使用原型
```javascript
function Dog(name) {
  this.name = name
  this.legsNumber = 4
}
Dog.prototype.kind = '狗'
Dog.prototype.say = function () {
  console.log(`汪汪汪～ 我是${this.name},我有${this.legsNumber}条腿。`)
}
Dog.prototype.run = function () {
  console.log(`${this.legsNumber}条腿跑起来了`)
}
const dog1 = new Dog('啸天') // Dog函数就是一个类
dog1.say()
```

```javascript
function Chicken() {
  
}
Chicken.prototype.kind = '鸡'
Chicken.prototype.say = function () {
  console.log('咕咕咕')
}
Chicken.prototype.fly = function () {
  console.log('我能飞')
}
const ikun = new Chicken()
ikun.say()
ikun.fly()
```

### 2. 使用class
```javascript
class Dog {
  kind = '狗' // 等价于在 constructor 里写 this.kind = '狗'
  constructor(name) {
    this.name = name
    this.legsNumber = 4
  }
  say() {
    console.log(`汪汪汪～ 我是${this.name},我有${this.legsNumber}条腿。`)
  }
  run() {
    console.log(`${this.legsNumber}条腿跑起来了`)
  }
}
const dog1 = new Dog('啸天')
dog1.say()
```

```javascript
class Chicken {
  kind = '鸡' // 等价于在 constructor 里写 this.kind = '狗'
  constructor() {}
  say() {
    console.log('咕咕咕')
  }
  fly() {
    console.log('看我铁山靠')
  }
}
const ikun = new Chicken()
ikun.say()
ikun.fly()
```

