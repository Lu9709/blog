### 1. 使用原型链
```javascript
function Animal(legsNumber) {
  this.legsNumber = legsNumber
}
Animal.prototype.kind = '动物'

function Dog(name) {
  this.name = name
  Animal.call(this, 4) // 关键代码1 相当于 class的supper
}

Dog.prototype.__proto__ = Animal.prototype // 可能会被ban，禁用
// 如果被禁用，使用如下方法

var f = function (){}
f.prototype = Animal.prototype
Dog.prototype = new f()

Dog.prototype.kind = '狗'
Dog.prototype.say = function () {
  console.log(`汪汪汪～我是${this.name},我有${this.legsNumber}条腿`)
}

const d1 = new Dog('啸天')
console.dir(d1)
```

### 2. 使用class
```javascript
class Animal {
  kind = '动物'
  constructor(legsNumber) {
    this.legsNumber = legsNumber
  }
}

class Dog extends Animal () {
  constructor(name) {
    super(4)
    this.name = name
  }
  say() {
    console.log(`汪汪汪~ 我是${this.name}，我有${this.legsNumber}条腿。`)
  }
}
  
```

其他方法。

[javascript实现继承的七种方式 - 掘金](https://juejin.cn/post/6844904161071333384#heading-7)



