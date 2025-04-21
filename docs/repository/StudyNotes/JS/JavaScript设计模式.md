### 设计模式原则

* **S – Single Responsibility Principle 单一职责原则**
+ 一个程序只做好一件事
+ 如果功能过于复杂就拆分开，每个部分保持独立
* **O – OpenClosed Principle 开放/封闭原则**
+ 对扩展开放，对修改封闭
+ 增加需求时，扩展新代码，而非修改已有代码
* L – Liskov Substitution Principle 里氏替换原则
+ 子类能覆盖父类
+ 父类能出现的地方子类就能出现
* I – Interface Segregation Principle 接口隔离原则
+ 保持接口的单一独立
+ 类似单一职责原则，这里更关注接口
* D – Dependency Inversion Principle 依赖倒转原则
+ 面向接口编程，依赖于抽象而不依赖于具体
+ 使用方只关注接口而不关注具体类的实现

### 设计模式分类

#### 创建型

##### 单例模式

确保**对象的类只有**一个**不可更改实例**。简单来说就是单例模式包含一个**不能被复制**和**修改**的**对象**。

可以通过**对象字面量**和**类**两种方法来实现。

```
const Config = {
	start: () => console.log("It's Start"),
	update: () => console.log("It's update"),
}
Object.freeze(Config)
Config.kind = '配置项' // 无法添加属性
```

```
class Config {
  constructor() {}
  start() { console.log("It's Start") }
	update() { console.log("It's update") }
}
const interface = new Config()
Object.freeze(interface)
```
##### 原型模式

通过原型继承的方式，新对象继承原对象的属性和方法。

```
// 声明一个有两个方法的原型对象
const enemy = {
    attack: () => console.log("Pim Pam Pum!"),
    flyAway: () => console.log("Flyyyy like an eagle!")
}

// 声明另外一个对象，这个对象将继承原型
const bug1 = {
    name: "Buggy McFly",
    phrase: "Your debugger doesn't work with me!"
}

// 使用setPrototypeOf设置对象的原型
Object.setPrototypeOf(bug1, enemy)

// 使用getPrototypeOf来确认我们是否设置成功
console.log(Object.getPrototypeOf(bug1)) // { attack: [Function: attack], flyAway: [Function: flyAway] }

console.log(bug1.phrase) // Your debugger doesn't work with me!
console.log(bug1.attack()) // Pim Pam Pum!
console.log(bug1.flyAway()) // Flyyyy like an eagle!
```
##### 工厂模式

工厂方法提供**创建对象的接口**，对象被**创建后**可以**修改**。优点创建对象代码逻辑集中，简化代码。

```
class Alien {
    constructor (name, phrase) {
        this.name = name
        this.phrase = phrase
        this.species = "alien"
    }
    fly = () => console.log("Zzzzzziiiiiinnnnnggggg!!")
    sayPhrase = () => console.log(this.phrase)
}

const alien1 = new Alien("Ali", "I'm Ali the alien!")
console.log(alien1.name) // 输出："Ali
```

```
function Alien(name, phrase) {
    this.name = name
    this.phrase = phrase
    this.species = "alien"
}

Alien.prototype.fly = () => console.log("Zzzzzziiiiiinnnnnggggg!!")
Alien.prototype.sayPhrase = () => console.log(this.phrase)

const alien1 = new Alien("Ali", "I'm Ali the alien!")

console.log(alien1.name) // 输出 "Ali"
console.log(alien1.phrase) // 输出 "I'm Ali the alien!"
alien1.fly() // 输出 "Zzzzzziiiiiinnnnnggggg"
```
##### 抽象工厂模式

**抽象工厂**允许在**不指定具体类**的情况下生成一系列相关的对象。抽象工厂通过**特定逻辑**调用**具体工厂**，具体工厂返回最终的对象。

```
// 每个汽车种类有一个类或者“具体工厂”
class Car {
    constructor () {
        this.name = "Car"
        this.wheels = 4
    }
    turnOn = () => console.log("Chacabúm!!")
}

class Truck {
    constructor () {
        this.name = "Truck"
        this.wheels = 8
    }
    turnOn = () => console.log("RRRRRRRRUUUUUUUUUMMMMMMMMMM!!")
}

class Motorcycle {
    constructor () {
        this.name = "Motorcycle"
        this.wheels = 2
    }
    turnOn = () => console.log("sssssssssssssssssssssssssssssshhhhhhhhhhham!!")
}

// 抽象工厂作为单一交互点和客户端交互
// 接受特定汽车类型作为参数，调用对应类型的具体工厂
const vehicleFactory = {
    createVehicle: function (type) {
        switch (type) {
            case "car":
                return new Car()
            case "truck":
                return new Truck()
            case "motorcycle":
                return new Motorcycle()
            default:
                return null
        }
    }
}

const car = vehicleFactory.createVehicle("car")
// Car { turnOn: [Function: turnOn], name: 'Car', wheels: 4 }
const truck = vehicleFactory.createVehicle("truck")
// Truck { turnOn: [Function: turnOn], name: 'Truck', wheels: 8 }
const motorcycle = vehicleFactory.createVehicle("motorcycle")
// Motorcycle { turnOn: [Function: turnOn], name: 'Motorcycle', wheels: 2 }
```
##### 构造器模式

构造器模式分“**步骤**”创建对象。通常我们通过不同的**函数**和**方法**向对象**添加属性**和**方法**。

```
const dog = {
  name: '啸天犬',
  legsNumbers: 4
}
const cat = {
  name: 'Tom',
  legsNumbers: 4
}

const addSay = (obj) => {
  obj.say = () => {
    console.log(`我是${obj.name},我有${obj.legsNumbers}条腿`)
  }
}
addSay(dog)
dog.say()

addSay(cat)
cat.cat()
```
#### 结构型

##### 适配器模式

**适配器**允许两个接口不兼容的对象相互交互。

```
// 城市数组
const citiesHabitantsInMillions = [
    { city: "London", habitants: 8.9 },
    { city: "Rome", habitants: 2.8 },
    { city: "New york", habitants: 8.8 },
    { city: "Paris", habitants: 2.1 },
]

// 待添加的新城市
const BuenosAires = {
    city: "Buenos Aires",
    habitants: 3100000
}

// 适配器函数将城市的人口属性转换成统一的计数单位
const toMillionsAdapter = city => { city.habitants = parseFloat((city.habitants/1000000).toFixed(1)) }

toMillionsAdapter(BuenosAires)

// 将新城市添加到数组
citiesHabitantsInMillions.push(BuenosAires)

// 函数返回人口最多的城市
const MostHabitantsInMillions = () => {
    return Math.max(...citiesHabitantsInMillions.map(city => city.habitants))
}

console.log(MostHabitantsInMillions()) // 8.9
```
##### 装饰器模式

**装饰**通过增加修饰对象来包裹原来的对象，从而使原有对象增加新的行为。

```
class Cellphone {
    create() {
        console.log('生成一个手机')
    }
}
class Decorator {
    constructor(cellphone) {
        this.cellphone = cellphone
    }
    create() {
        this.cellphone.create()
        this.createShell(cellphone)
    }
    createShell() {
        console.log('生成手机壳')
    }
}
// 测试代码
let cellphone = new Cellphone()
cellphone.create()

console.log('------------')
let dec = new Decorator(cellphone)
dec.create()
```
##### 代理模式

代理模式让你能够提供对象的替代品或其占位符。

举例，vue3的proxy实现了代理的模式。

##### 外观模式

##### 桥接模式

##### 组合模式

##### 享元模式

#### 行为型

##### 观察者模式

 允许你定义一种**订阅机制**， 可在对象事件发生时**通知多个 “观察” 该对象**的**其他对象**。

```
// 主题 保存状态，状态变化之后触发所有观察者对象
class Subject {
  constructor() {
    this.state = 0
    this.observers = []
  }
  getState() {
    return this.state
  }
  setState(state) {
    this.state = state
    this.notifyAllObservers()
  }
  notifyAllObservers() {
    this.observers.forEach(observer => {
      observer.update()
    })
  }
  attach(observer) {
    this.observers.push(observer)
  }
}

// 观察者
class Observer {
  constructor(name, subject) {
    this.name = name
    this.subject = subject
    this.subject.attach(this)
  }
  update() {
    console.log(`${this.name} update, state: ${this.subject.getState()}`)
  }
}

// 测试
let s = new Subject()
let o1 = new Observer('o1', s)
let o2 = new Observer('02', s)

s.setState(12)
```
##### 迭代器模式

提供一种方法顺序一个聚合对象中各个元素，而又不暴露该对象的内部表示。

比如JavaScript内置函数（`for`、`forEach`、`for...of`、`for...in`、`map`、`filter`、`reduce`、`some`等）

##### 策略模式

##### 模板方法模式

##### 职责链模式

允许你将请求沿着**处理者链**进行发送。 收到请求后， 每个**处理者均可**对**请求进行处理**，或将**其传递给链上**的下个**处理者**。

##### 命令模式

##### 备忘录模式

##### 状态模式

##### 访问者模式

##### 中介者模式

##### 解释器模式

参考来自如下卡片。

<https://juejin.cn/post/6844904032826294286#heading-11><https://refactoringguru.cn/design-patterns/catalog>