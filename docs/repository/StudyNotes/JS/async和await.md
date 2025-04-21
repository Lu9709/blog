async函数返回一个Promise对象，可以使用then方法添加回调函数。当函数执行的时候，一旦遇到await就先返回，等到异步操作完成，再接着执行函数体内后面的语句。

```
async function timeout(ms){
  await new Promise((resolve)=>{
  	setTimeout(resolve,ms)
  })
}
async function asyncPrint(value,ms){
  await timeout(ms)
  console.log(value)
}
asyncPrint('hello',50)
```
多种声明形式

```
//函数声明
async function foo(){}
//函数表达式声明
const foo = async function(){}
//对象的方法
let obj = { async foo(){}}
obj.foo().then(...)
// class方法
class Storage {
  constructor() {
    this.cachePromise = caches.open('avatars');
  }

  async getAvatar(name) {
    const cache = await this.cachePromise;
    return cache.match(`/avatars/${name}.jpg`);
  }
}

const storage = new Storage();
storage.getAvatar('jake').then(…);
//箭头函数
const foo = async ()=>{}
```
async函数内的异步操作执行完毕后，才会执行then方法指定的回调函数，除非遇到return或者抛出错误。**且await必须放在async函数内部****！**

await一般情况下后面是一个Promise对象，返回该对象的结果，若不是则返回对应的值

```
async function f(){
	return await 123;
}
f().then(v=> console.log(v))//123

async function f(){
  await Promise.reject('error');
}
f().then(v=>console.log(v)).catch(e=>console.log(e))
//若是reject方法传入了catch回调，则继续捕获该异常
```
若是希望异步操作失败，但不要中断则可以将await传入`try...catch`的结构内，这样不管怎么样都会执行，或是在await后面紧跟catch方法，处理之前的错误。

```
async function f(){
  try{
    await Promise.reject('error')
  }catch(e){
  }
  return await Promise.resolve('success')
}
f().then(v=>console.log(v))
// success
async function f() {
  await Promise.reject('出错了')
    .catch(e => console.log(e));
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v))
// 出错了
// hello world

```
顶层await

只能用在模块的顶层，可用于动态依赖导入，例如环境切换，国际化等，资源初始化。

```
const strings = await import(`/i18n/${navigator.language}`);
```
