

JS其实没有真正的数组，只是用对象模拟数组。

* 典型的数组
+ 元素的数据类型相同
+ 使用连续的内存存储
+ 通过数字下表获取元素
* JS的数组
+ 元素的数据类型可以不同
+ 内存不一定是连续的(对象是随机存储的)
+ 不能通过数字下标获取元素，而是用字符串下标
+ 数组可以含有任何key
+ 特殊数组——伪数组
伪数组的原型链中没有数组的原型，而是直接指向了Object的原型。
没有数组共用的属性的数组就是伪数组。

```
let arr = {0:'1',3:'2',4:'3',length:3}
arr.__proto__ === Object.prototype //返回值为true
arr.__proto__ === Array.prototype //返回值为false
```

## 创建数组

* 新建

```
let arr = [1,2,3]
let arr = new Array(1,2,3)
let arr = new Array(3)/*创建的数组长度为3*/
```
* 字符串和数组之间的转换

`split()`可以是设置一个参数作为分隔符来分隔字符串，并返回分隔符之间的子串，作为数组中的项。

```
let arr = '1,2,3'.split(',')
let arr1 = '123'.split('')
```

`Array.from()`可以将不是数组的转换为数组。但是条件是必须只有在对象有0、1、2下标时和有length属性时才满足。

```
let arr1 = Array.from('123')
let arr2 = Array.from({0:'1',1:'2',2:'3',length:3})
```

* 合并两个数组，得到一个新数组

```
let arr = arr1.concat(arr2) //不会改变原数组arr1、arr2
```
* 截取数组部分

```
let arr = [1,2,3,4]
arr.slice(1)//返回值为[2,3,4],从第二个元素开始截取
arr.slice(0)//全部截取
```
`slice()`方法也不会改变原数组，一般可以通过一下方法来复制一个数组(JS只提供浅拷贝)

```
let arr1 = arr.slice(0)
```

## 删除元素

* 和对象一样 可以发现数组的长度没有发生改变，
若将元素全部删除，可以发现它仍有长度，但是没有数组的下标，这种数组叫稀疏数组

```
let arr = ['a','b','c']
delete arr['0']//删除key值为0的元素
arr//[empty,'b','c']
```
* 直接改length 可以实现，但不要随便改length

```
let arr = [1,2,3,4,5]
arr.length = 1
arr//[1]
```
* 删除头部元素

```
arr.shift()//arr被修改，并返回被删元素
```
* 删除尾部元素

```
arr.pop()//arr被修改，并返回被删元素
```
* 删除中间元素

```
array.splice(start[, deleteCount[, item1[, item2[, ...]]]])
/*start:修改开始的位置，deleteCount：删除的个数，item1, item2, ...：添加的元素*/
arr.splice(index,1)//删除index的一个元素
arr.splice(index,1,'x')//并在删除位置添加'x'
```

## 查看元素

### 查看所有元素

* 查看所有属性名

```
let arr =[1,2,3,4,5];arr.x='xx'
Object.keys(arr)//arr的属性名
Object.values(arr)//arr的属性值
```
* 查看数字(字符串)属性名和值

```
for(let key in arr){
  console.log(`${key}:${arr[key]}`)
}//方法一
for(let i = 0 ; i < arr.length ; i++){
  console.log(`${i}:${arr[i]}`)
}//方法二
arr.forEach(function(item,index){
  console.log(`${index}:${item}`)
})//方法三
```

### 查看单个属性

* 跟对象一样

```
let arr = [1,2,3]
arr[0]//1
arr[arr.length] === undefined //索引越界，因为不存在该数组长度的下标
```
* 查找某个元素是否在数组里

```
arr.indexOf(item)//存在返回索引，否则返回-1
```
* 使用条件查找元素

```
arr.find(item=>item%2===0)//找第一个偶数
```
* 使用条件查找元素的索引

```
arr.findIndex(item=>item%2===0)//找第一个偶数的索引
```

## 增加元素

* 在头部加元素

```
arr.unshift(newItem)//修改arr,返回新长度
arr.unshift(item1,item2)//修改arr,返回新长度
```
* 在尾部加元素

```
arr.push(newItem)//修改arr,返回新长度
arr.push(item1,item2)//修改arr,返回新长度
```
* 在中间添加元素

```
arr.splice(index,0,'item1')//在index处插入'item1'
arr.splice(index,0,'item1','item2')
```

## 修改数组中的元素

* 反转顺序

```
	arr.reverse()//修改原数组
```

* 自定义顺序

```
arr.sort((a,b)=>a-b)
/*sort默认是从小到大排序，并且还会改变数组本身，等同于*/
arr.sort(function(a,b){
  if(a>b){return 1}
  else if(a === b){return 0}
  else {return -1}
})
```

例子：如何将'abcdef'字符串进行反转。

```
let x = 'abcdef'
x.splict('').reverse().join('')
```

## 数组变换

* map
`map()`方法创建一个新数组，其结果是该数组中的每个元素是调用一次提供的函数后的返回值。也可以说是一一映射。

```
let c = [1,2,3,4,5]
c.map(item=>item*item)//[1, 4, 9, 16, 25]
  /*将数组内的元素都变成原先元素的平方*/
```
* filter
`filter()`方法创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。即设置函数来删减掉数组内不满足条件的元素。

```
let words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];
let result = words.filter(word => word.length > 6);
console.log(result); // ["exuberant", "destruction", "present"]
/*将数组内的元素长度小于或等于6的字符串元素删除*/
```
* reduce
`reduce()`方法对数组中的每个元素执行一个由您提供的reducer函数(升序执行)，将其结果汇总为单个返回值。
语法：arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])
+ accumulator：累计器累计回调的返回值
+ currentValue：
+ index：数组中正在处理的当前元素的索引。若存在initialValue，则起始索引号为0，否则从索引1起始。
+ array：调用的数组
+ initialValue：调用函数时的第一个参数的初始值

```
[0, 1, 2, 3, 4].reduce((accumulator, currentValue, currentIndex, array) => {
  return accumulator + currentValue
}, 10)// 结果为10+0+1+2+3+4=20

[1, 2, 3, 4, 5].reduce((sum,item)=>{
  return sum+item
},0)//也可用于数组求和 返回值为15
[1, 2, 3, 4, 5].reduce((result,item)=>{
  return result.concat(item*item)
},[])//也可用于数组元素平方 返回值为[1,4,9,16,25]
[1, 2, 3, 4, 5].reduce((result,item)=>{
  return result.concat(item % 2 === 1 ? []:item)},[])
  //也可以定义函数来如数组留下偶数的元素 返回值为[2,4]
```
## Array()和Array.from()的区别

`Array()`和`new Array()`一样，创建的是元素为空的数组，是无法遍历的。

```
Array(3)
// [empty x 3]
new Array(3)
// [empty x 3]
// 也类似于
let arr = []
arr.length = 3
```
若是要填充这个元素为空的数组，可以使用`fill`

```
Array(3).fill()
// [undefined, undefined, undefined]
// 其实这样类似于 apply
Array.apply(undefined, {length:3})
```
`Array.from`则是对一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例，详见[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from)。

```
Array.from(3)
// [undefined, undefined, undefined]
```
