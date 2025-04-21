Promise对象用于表示**一个异步操作的最终完成(或失败)及其结果值**。

Promise的几种状态：

* **待定(pending) 初始状态**，既没有被兑现，也没有被拒绝。
* **已兑现(fulfilled) 操作成功完成**。
* **已拒绝(rejected) 操作失败**。
* **已敲定（settled）**已经被兑现（fulfilled）或被拒绝（rejected）

Promise的**链式调用**，我们可以用 `promise.then()`，`promise.catch()` 和 `promise.finally()`这些方法将进一步的操作与一个变为已敲定状态的 promise 关联起来。这些方法还会返回一个新生成的 promise 对象。

### 手写Promise

```
class Promise2{
  success = []
  fail = []
  constructor(fn){
    const resolve = (data)=>{
      setTimeout(()=>{
        for(let i=0;i<this.success.length;i++){
          this.success[i](data)
        }
      })
    }
    const reject = (reason)=>{
      setTimeout(()=>{
        for(let i=0;i<this.fail.length;i++){
          this.fail[i](reason)
        }
      })
    }
    fn(resolve,reject)
  }
  then(resolve,reject){
    this.success.push(resolve)
    this.fail.push(reject)
    return this
  }
}

p1 = new Promise2((resovle,reject)=>{console.log('hi');
                                     Math.random()>0.5 ? resovle() : reject()
                                    }
                 )
p1.then(()=>{console.log('success1')},()=>{console.log('fail1')})
  .then(()=>{console.log('success2')},()=>{console.log('fail2')})
  .then(()=>{console.log('success3')},()=>{console.log('fail3')})

```
### Promise

```
fn(){
	return new Promise((resolve,reject)=>{
    		 成功时调用 resolve(数据)
         失败时调用 reject(错误)
     })
 }
fn().then(success1,fail1).then(success2,fail2)
```
### Promise.then()

使用`.then(success,fail)`传入成功和失败函数

```
const promise1 = new Promise((resolve, reject) => {
  resolve('Success!');
});

promise1.then((value) => {
  console.log(value);
  // expected output: "Success!"
});
```
### Promise.all

`Promise.all()`方法接受返回一个iterable类型(Array，Map，Set),并且只返回一个数组的Promise实例。reslove等所有promise的resolve回调都结束，reject回调时有错立即抛出错误。

```
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
setTimeout(resolve, 100, 'foo');
});
Promise.all([promise1, promise2, promise3]).then((values) => {
console.log(values);
});
// expected output: Array [3, 42, "foo"]
 Promise.all([promise1, promise2]).then(success1, fail1)
```
### Promise.race

`Promise.race(iterable)`方法返回一个 promise，一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝。即迭代器内那个先结束就先返回那个的promise。(类似于跑步谁快，谁拿奖)

```
const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, 'one');
});
const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'two');
});
Promise.race([promise1, promise2]).then((value) => {
  console.log(value);
  // Both resolve, but promise2 is faster
});
// expected output: "two"
------------------------------------------------
 Promise.race([promise1, promise2]).then(success1, fail1)
//promise1和promise2只要有一个成功就会调用success1；
//promise1和promise2只要有一个失败就会调用fail1；
//总之，谁第一个成功或失败，就认为是race的成功或失败。
```

