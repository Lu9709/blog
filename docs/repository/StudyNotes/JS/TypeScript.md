TyepScript是在JavaScript的每个变量后面添加上了类型。

### 类型v.s.类

JavaScript基本类型为`null`、`undefined`、`number`、`symbol`、`bool`、`string`、`bigint`(简单数据类型) | `object`(复杂数据类型)

`typeof` 获取的是 type，但`typeof`的bug为typeof后面接的是函数，返回结果为Function；若后面接收为null，返回一个object。

JS中的类只针对object，面向对象编程，分为两种

* 基于class关键字
* 基于原型

```
//基于class
class Person{
  属性1
  方法1
}
const p1 = new Person()
p1.属性1
p1.方法1
//基于原型
function Person(){
  var temp = {}
  this.属性1
  this.方法1
  temp._proto_ = 共有属性
  return temp
}
const p1 = new Person()
p1.属性1
p1.方法1
```
类型的好处为：减少bug，增加提示

### TS的语法

1. ：+ 类型
2. TS 类型

```
const a:undefined = undefined
const b:number = 1
const c:string = 'hi'
const d:symbol = Symbol('a')
const e:boolean = true
const f:bigint = 123n
const obj:Object = {}
const arr:Array<String|Number|null> = ['h',2,null]
1.类型写在函数体
const add = (a:Number,b:Number):Number => a + b
const add:(a:Number,b:Number):Number = (a,b)=> a + b
```
### TS额外的类型

#### any

可以是任何类型，使用时没有任何限制

```
//any
let a:any = 'hi'
a.name
```
#### unknown

现在不明确的类型，必须是外部获取的值，使用时必须明确是什么类型。

```
type C = {name:string}
let b:unknown = JSON.parse('{"name":"frank"}')
console.log(b as C) //断言 武断的判断
```
#### void

不返回返回值

```
//void
let print:()=>void = function (){
  console.log(1)
}
```
#### never

不应该存在的类型，可以用集合举例

```
let c:never
// 用集合举例never
type Dir = 1 | 2 | 3 | 4 | undefined
let dir = Dir
switch(dir){
  case 1:
    break;
  case 2:
    break;
  case 3:
    break;
  case 4:
    break;
  case undefined:
    break;
  default: //default 就是为不存在的类型
    console.log(dir)
    break;
}
```
#### tuple

元组 不可变更的数组(固定长度的数组)，必须明确每个元素的类型

```
//元组
let p:[number, number] = [100,200]
let p2:[number,string,boolean] = [100,'x',true]
// type X = number & string  这两者类型根本没有交集
// type Y = (1|2|3) & (2|3|4) 交集为2、3
```
#### enum

枚举 默认情况下从0开始为元素编号，也可以手动赋值(将数字1234变成对应的标志)

```
enum Dir = {东 = 1 ,南 = 2,西,北}
let d:Dir = Dir2.东
```
### 如何给不同数据添加type

null undefined string number boolean bigint symbol object(用class=>Array Function)

泛型是给类型传入参数

### class是类型还是值呢？

class 既是值也是类型。

```
//var x:类型 = 值
class A {

}
const B = A //对于JS来说它是一个值
const a:A = new A() //对于TypeScript来说它是一个类型
```
### 联合类型(|)

```
type A = {
  name:'a';
  age:number
}
type B = {
  name:'b';
  gender:string;
}
const f = (n:number|B)=>{
  //区分类型
  if(type of n === 'number'){
    n.toFixed() //格式化一个数值
  }else{
    n.name
  }
}
const f2 = (n:A|B)=>{
  //区分类型
  if(n.name === 'a'){
    n.age
  }else{
    n.gender
  }
}
```
### 交叉类型(&)

```
type A = number & string; // A的类型为never
type B = {name:strng}&{age:number};
const a:A = {
  name:'lz',
  age:21
}
```
### TypeScript泛型

若有一个函数会返回传入的它的值，返回值的类型与传入的参数类型是相同的，可以采用类型变量，如下T为类型变量。此时这个函数叫做[泛型](https://www.tslang.cn/docs/handbook/generics.html)。

```
type Add<T>  = (a:T,b:T)=>T //T可以是任何类型
```
泛型等于广泛的类型

```
type A = "hi"| 123 //ts
var a = ["hi",123] //js
type F<T> = T|T[]
var fn = (x:number)=>x+1
//type AddString = Add<string>
//type Addnumber = Add<number>
const addN:Add<number> = (a,b)=>a+b
const addS:Add<string> = (a,b)=>a+''+b
//泛型的调用/泛型的收窄
```
重载

使得一个函数满足多个参数条件

```
function add(a:number,b:number):number
function add(a:string,b:string):string
function add(a:any,b:any):any{
  if(typeof a === 'number' && typeof b === 'number'){
    return a + b
  }esle{
    return a + ' ' + b
  }
}
```
axios option 重载配置

```
type Options = {headers:any}
functions get(url:string,options?:Options):void
functions get(options:Options & {url:string}):void
functions get(url:string | (Options & {url:string}),options?:Options):void {
    if(arguments.length === 1){
      const myOptions = url as {url:string} & Options
      myOptions.url
    }else{
    console.log((url as string))
  }
}
```
泛型封装网络请求库

Partial可以将类型的每个属性变为可选

`keyof`类似于`Object.keys`，`keyof`运算符采用对象类型并生成其键的字符串或数字文字联合。

```
type Partial<T> = { [P in keyof T]?: T[P] }
```
### 关键字

#### typeof

获取变量的类型

#### keyof

获取类型T的所有键组成的联合类型，`keyof`也被称为**索引类型查询操作符**

```
interface Person {
  id: string
  age: number
}
type PeronKeys = keyof Person
```
#### []

索引访问操作符，可以进行索引访问

```
interface T {
  K: string;
}
type TypeK = T[K]; // string
```
#### in

可以对联合类型进行遍历，通过**[K in Keys]**可以实现**映射类型**，从旧类型中创建新类型的一种方式。

```
type Index = 'a' | 'b' | 'c'
type FromIndex = { [K in Index]?:number }
const index_1: FromIndex = { b: 1,c: 2 }
const index_2:FromIndex = { b: 1,d: 3 } // 报错，不能添加d属性
```
#### extends

用于扩展已有的类型。

* 接口继承

```
interface A {
  name: string;
}
interface B {
  age: number;
}

// 多重继承，逗号隔开
interface C extends A,B {
  sex: string
}
const test: C = {
  name: 'helloWorld',
  sex: 1,
  age: 18
}
```
* 条件判断

```
interface A {
  name: string;
}
interface B {
  name: string;
  age: number;
}
// A 是 B 的子集的话则为正，否则为假
type Test = A extends B ? string : number
const test: Test = 'This is string'
```
#### infer

用于声明一个类型变量并对它进行使用。

#### readonly

将属性标记为只读。

#### implements

译名为实现，可以通过类实现多个接口。由于一个类只能继承自另一个类，但不同的类之间可以有一些共有的特性，这时候就可以把特性提取成接口，通过`implements`来实现。

```
interface Alarm {
    alert(): void;
}

interface Light {
    lightOn(): void;
    lightOff(): void;
}

class Car implements Alarm, Light {
    alert() {
        console.log('Car alert');
    }
    lightOn() {
        console.log('Car light on');
    }
    lightOff() {
        console.log('Car light off');
    }
}
```
### TS高级类型

#### Partial:`Partial<Type>`

将类型定义的所有属性都修改为可选。

```
/**
 * Make all properties in T optional
 */
type Partial<T> = {
    [P in keyof T]?: T[P];
};
```

```
interface Todo {
  title: string;
  desc: string;
}

function updateTodo(todo:Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate }
}

const todo1 = {
  title: "organize desk",
  desc: "clear clutter"
}

const todo2 = updateToda(todo1,{
   decs: "throw out trash"
})
```
#### Required:`Required<Type>`

构造一个类型，该类型是由设置为required的Type的所有属性组成。(必填)

源码里`-?`比较好理解，即去掉可选项代表的`?`，从而让这个类型变成必选项。与之对应的还有个`+?`

```
type Required<T> = { [P in keyof T]-?: T[P]}
```

```
interface Props {
  a?: number;
  b?: string;
}
const obj:Props = { a:5 }
const obj2:Required<Props> = { a:5 }
// Property 'b' is missing in type '{ a: number; }' but required in type 'Required<Props>'.

```
#### Readonly:`Readonly<Type>`

设置类型只能只读，不可以修改

```
type Readonly<T> = { readonly [P in keyof T]: T[P] };
```

```
interface Todo {
  title: string
}
const todo:Readonly<Todo> = {
  title:'Delete'
}
todo.title = 'Hello'
//Cannot assign to 'title' because it is a read-only property.
```
#### Mutable:`Mutable<Type>`

移除类型的所有属性的readOnly

```
type Mutable<T> = {
  -readOnly [P in keyof T]: T[P]
}
```
#### Record:`Record<Type>`

构造一个对象类型，其key值为Keys，属性值为Type。用于一种类型的属性映射到另一种类型。

```
type Record<K extends keyof any, T> = {
  [P in K]: T
}
```

```
interface CatInfo {
  age:number;
  breed:string;
}
type CatName = "miffy" | "boris" | "mordred";

const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
};

cats.boris;
```
#### Pick:`Pick<Type, Keys>`

从类型中选择一些属性keys字段构造类型

```
type Pick<T,K extends keyof T> = {
  [P in K]: T[P]
}
```

```
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">

const todo: TodoPreivew = {
   title: "Clean room",
   completed: fasle
}
```
#### Omit:`Omit<Type, Keys>`

剔除类型中的一些属性。

```
type Omit<T,K> = Pick<T,Exclude<keyof T,K>>
```

```
type User = {
  id:string | number;
  name:string;
  age:number;
}
type T = Partial<Omit<User>,'id'>
type CreateResource = (path:string) => {
    create:(attrs:T) => Promise<Responce<User>>;
    delete:(id:User['id']) => Promise<Responce<never>>;
    update:(id:User['id'],attrs:T) => Promise<Responce<User>>;
    get:(id:User['id']) => Promise<Responce<User>>;
    getPage:(page:number) => Promise<Responce<User[]>>;
    const createResource:CreateResource = (path)=>{
    return {
      create(){}
      delete(){}
      update(){}
      get(){}
      getPage(){}
  }
}
var userResource = createResource('api/v1/user')
```
#### Exclude:`Exclude<UnionType, ExcludedMembers>`

类型中排除一些属性来构成新的联合类型，对照案例可以看出`Exclude`是从T中找出U中没有的元素。

```
type Exclude<T,U> = T extends U ? never : T
```

```
type Exclude1 = Exclude<'a'|'b'|'c','a'>
Exclude1 = 'b'|'c'
```
#### Extract:`Extract<Type, Union>`

提取T包含在U中的元素，即取两者的交集。

```
type Extract<T, U> = T extends U ? T : never;
```

```
type T0 = Extract<"a"|"b"|"c","a">
// type T0 = "a"
type T1 = Extract<string | number | (()=> void),Function>
// type T1 = () => void

```
#### NonNullable:`NonNullable<Type>`

过滤联合类型中的`null`和`undefined`类型。

```
type NonNullable<T> = T extends null | undefined ? never : T
```

```
type T0 = NonNullable<string | null | undefined> // type T0 = string
```
#### Parameters:`Parameters<Type>`

获取函数的全部参数类型，以**元组类型**返回

```
type Parameters<T extends (...args:any)=> any> = T extends (...args:infer P) => any ? P : never;
```

```
type F1 = (a: string, b: number) => void;
type F1ParamTypes = Parameters(F1);  // [string, number]
```
#### ConstructorParameters:`ConstructorParameters<Type>`

该类型和`Parmameters`很相似，但这里获取的是**构造函数**的全部参数。关于构造函数的声明，以及如何使用此高级的

```
type ConstructorParameters<T extends new (...args: any) => any> = T extends new (...args: infer P) => any ? P : never;
```
#### ReturnType:`ReturnType<Type>`

接受函数声明，返回函数的返回类型

```
 type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
```

```
declare function: f1(): { a: number; b: string };
type T0 = ReturnType<()=>string>;
// type T0 = string
type T1 = ReturnType<(s:string) => void>;
// type T1 = void
type T2 = ReturnType<<T>()=> T>;
// type T2 = unknown
type T3 = ReturnType<typeof f1>;
// type T4 = ReturnType<any>;
// type T4 = any
type T5 = ReturnType<never>;
// type T5 = never
type T6 = ReturnType<<T extends U,U extends number[]>() => T>
// type T6 = number[]
type T7 = ReturnType<string>;
// Type 'string' does not satisfy the constraint '(...args: any) => any'.
type T8 = ReturnType<Function>;
// Type 'Function' does not satisfy the constraint '(...args: any) => any'.
// Type 'Function' provides no match for the signature '(...args: any): any'.
```
#### InstanceType:`InstanceType<Type>`

获取构造函数的返回类型，如果是多个就以联合类型的方式返回。

```
type InstanceType<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : any;
```
#### ThisParameterType:`ThisParameterTyoe<Type>`

获取函数类型显示定义的`this`数据类型，如果没有则返回`unknown`类型，因为可以在 TS 声明函数的`this` ，此方法用于获取此声明，具体见案例。

* `this`参数只能叫`this`，且必须在参数列表的第一个位置。
* `this`必须是显式定义的。
* 这个`this`参数在函数实际被调用的时候不存在，不需要显示作为参数传入，而是通过`call`、`apply`、`bind`方法指定。

```
type ThisParameterType<T> = T extends (this: infer U, ...args: any[]) => any ? U : unknown;
```

```
interface Foo {
    x: number
};

function fn(this: Foo) {}

type Test = ThisParameterType<typeof fn>; // Fo

fn.bind({ x: 1 });   // 正常

fn.bind({ x: '1' }); // Error: ...Type 'string' is not assignable to type 'number'...

```
#### OmitThisParameter:`OmitThisParameter<Type>`

移除函数中的`this`数据类型

```
/**
 * Removes the 'this' parameter from a function type.
 */
type OmitThisParameter<T> = unknown extends ThisParameterType<T> ? T : T extends (...args: infer A) => infer R ? (...args: A) => R : T;
```

```
interface Foo {
    x: number
};

type Fn = (this: Foo) => void

type NonReturnFn = OmitThisParameter<Fn>; // () => void
```
#### ThisType:`ThisType<Type>`

`ThisType`不会返回一个转换之后的类型，提供基于上下文的`this`类型。注意，需要开启 --`noImplicitThis` 特性。

```
interface ThisType<T> { }
```

```
type ObjectDescriptor<D, M> = {
    data?: D;
    methods?: M & ThisType<D & M>;  // Type of 'this' in methods is D & M
}

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
    let data: object = desc.data || {};
    let methods: object = desc.methods || {};
    return { ...data, ...methods } as D & M;
}

let obj = makeObject({
    data: { x: 0, y: 0 },
    methods: {
        moveBy(dx: number, dy: number) {
            this.x += dx;  // Strongly typed this
            this.y += dy;  // Strongly typed this
        }
    }
});

obj.x = 10;
obj.y = 20;
obj.moveBy(5, 5);
```
