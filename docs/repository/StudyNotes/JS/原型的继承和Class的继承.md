## 原型

```js
function People(name){
 this.name = name
}
People.prototype.work = function() {
  console.log('工作')
}
function Student(name,id) {
 People.apply(this,arguments) //People.call(this,name)
 this.id = id
}
//相当于temp.prototype.\_\_proto\_\_ = People.prototype
function temp(){}
temp.prototype = People.prototype
Student.prototype = new temp()

Student.prototype.constructor = Student
Student.prototype.study = function() {
  console.log('学习')
}

```
## Class

```js
class A {
 constructor(a)
 this.a = a
 do_A(){}
}
class A extends B {
 constructor(a,b)
 super(a)
 this.b = b
 do_B(){}
}

```
