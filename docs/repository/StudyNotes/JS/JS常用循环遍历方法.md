## 数组遍历

1. forEach**返回undefined，不改变原数组，对数组的每个元素执行一次提供的函数**

`arr.forEach(callback(currentValue [, index [, array]])[, thisArg])`

```
const array = [1,2]
const current = array.forEach((currentValue,index,arr)=>{
// currentValue 当前元素 index 当前元素的下标 arr 操作数组
  console.log(currentValue,index,arr)
})
```
2. map返回一个新数组，对原数组的每个元素执行一次，不改变原数组，需要**return值**

`var new\_array = arr.map(function callback(currentValue[, index[, array]])` `{`

`// Return element for new\_array }[, thisArg])`

```
const array = [1,2]
const current = array.map((item,index)=>{
	return item*2 //无return则 current = [undefined,undefined]
})
// current = [2,4]
```
3. filter返回新数组，需要**return boolean值**，返回true则保留该元素，false则不保存，若是没有任何数组元素通过测试，则返回空数组，不会改变原数组

 `arr.filter(callback(element[, index[, array]])[, thisArg])`

```
const word = ['blue','red','orange','yellow','black']
const current = array.fliter((item,index)=>{
	return item.length > 3
})
//current ["blue", "orange", "yellow", "black"]
```
4. for

```
const array = ['1','2']
for(let i=0;i<array.length;i++){
	console.log(array[i])
}
// '1'
// '2'
```
5. for in(用于数组/对象)

```
const array = ['1','2']
for(key in array){ //key:键名，遍历的当前数组的索引或当前对象属性
	console.log(key)
}
```
6. some

some()方法测试数组中**是不是至少有一个元素****通过**了被提供的函数测试。返回boolean，需要return boolean值

如果用一个**空数组**进行测试，**在任何情况下它返回都是false**

`*arr*.some(*callback(element[, index[, array]])[, thisArg]*)`

```
const array = [1,2,3,4,5];
const bool = array.some(item=>
	item % 2 === 0 // 若是存在一项元素通过测试则返回true
)
//bool ture
```
7. every

every()方法测试一个数组内的**所有元素****是否都能通过**某个指定函数的测试，返回boolean，需要return boolean值

`arr.every(callback(element[, index[, array]])[, thisArg])`

```
const array = [1,2,3,4,5];
const bool = array.every((item,index)=>{
	return	item < 10 // 若是每项都测试通过则返回true
})
//bool ture
```
8. for of ES6新增用于数组、Set和Map结构、某些类似数组的对象、字符串、后文Generator对象

```
const word = 'red'
for(let w of word){
	console.log(w)
}
//r
//e
//d
const arr = [1,2]
for(let item of arr){
	console.log(item)
}
//1
//2
```
9. find 遍历数组，**找到一个符合条件的项**，并返回该项。否则返回undefined，不会改变原数组。

```
let arr = [{id:1,name:'张三'},{id:2,name:'李四'}]
let newArr = arr.find(item=> item.name==='张三')
console.log(newArr)
```
10. findIndex 遍历数组，找到一个符合条件的项，并返回改项的索引值。否则返回-1，不会改数组对象

```
let arr = [{id:1,name:'张三'},{id:2,name:'李四'}]
let newArr = arr.findIndex(item=> item.name==='张三')
console.log(newArr)
```
11. reduce 对数组的每一项执行一次提供的reducer函数，将其结果汇总为单个返回值。

`arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])`

reducer函数接受4个参数：

* Accumulator (acc) (累计器)
* Current Value (cur) (当前值)
* Current Index (idx) (当前索引)
* Source Array (src) (源数组)

```
let array = [{id:1,name:'lz'},{id:2,name:'tom'},{id:3,name:'John'},{id:1,name:'sad'},{id:2,name:'red'}]
let obj = {}
let newArray = array.reduce((pre,cur)=>{
    obj[cur.id] ? '' : obj[cur.id] = true && pre.push(cur)
    return pre},[])
//对象数组去重
let array = [1,2,3,4,5,6]
array.reduce((total,cur)=>(total+cur))
```

## 对象遍历

1. Object.keys()返回新数组(包含对象自身可枚举的所有属性，不含继承的)

```
const obj = {
	"name":"baizhe",
  "age":18,
  "gender":"male"
}
Object.keys(obj).forEach(item=>{
	console.log(item)
})
//name
//age
//gender
```
2. Object.values()返回新数组

```
const obj = {
	"name":"baizhe",
  "age":18,
  "gender":"male"
}
Object.values(obj).forEach(item=>{
	console.log(item)
})
//baizhe
//18
//male
```
3. for in 除自身的属性外，还可遍历继承的属性

```
const obj = {
	"name":"baizhe",
  "age":18,
  "gender":"male"
}
for(let key in obj){
	console.log(item)
}
//name
//age
//gender
```
