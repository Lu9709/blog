# Promise

### 是什么？

`Promise` 是JavaScript中的一种**异步编程解决方案**。它是一种用于**处理异步操作的对象**，可以将异步操作以更加直观的和可读的方式近些编写和管理。

使用 `Promise` 可以**避免回调地狱**，通过**链式调用**和**异常处理机制**，使异步代码更加清晰和可控。

`Promise` 的几种状态：

+ 待定（`pending`）初始状态，既没有被兑现，也没有被拒绝。
+ 已兑现（`fulfilled`）操作成功完成。
+ 已拒绝（`rejected`）操作失败。
+ 已敲定（`settled`）已经被兑现（`fulfilled`）或被拒绝（`rejected`）。

**状态变化**：

初始状态为 `pending`，表示异步操作尚未完成。当异步操作成功完成时，`Promise` 进入 `fulfilled` 状态；当异步操作失败或出现错误时，`Promise` 进入 `rejected` 状态。状态的改变是不可逆的，一旦从 `pending` 进入 `fulfilled` 或 `rejected`，就不可再变为其他状态。

### Promise相关技术

1. `then` 方法：`Promise` 对象的 `then` 方法用于注册回调函数，在异步操作成功时执行成功的回调函数，或在异步操作失败时执行失败的回调函数。`then` 方法可以通过链式调用，将多个异步操作串联起来。
2. `catch` 方法：`Promise` 对象的 `catch` 方法用于捕获异常和处理异步操作的失败情况。它可以在 `then` 方法链的末尾添加一个失败的回调函数，用于处理任何发生的错误。
3. `Promise.all` 方法：`Promise.all` 方法接收一个 `Promise` 对象的数组作为参数，返回一个新的 `Promise` 对象。该新的 `Promise` 对象在数组中所有的 `Promise` 对象都成功完成后才会进入成功状态，并返回所有`Promise`对象的结果组成的数组；如果数组中任意一个 `Promise` 对象失败，则新的`Promise` 对象会进入失败状态。
4. `Promise.race` 方法：`Promise.race` 方法接收一个 `Promise` 对象的数组作为参数，返回一个新的 `Promise` 对象。该新的 `Promise` 对象在数组中任意一个 `Promise` 对象完成（无论成功还是失败）后就会进入相应的状态，并返回该 `Promise` 对象的结果。
5. `Promise.resolve` 方法：`Promise.resolve` 方法返回一个已经处于 `fulfilled` 状态的 `Promise` 对象，可以指定该对象的最终结果。
6. `Promise.reject` 方法：`Promise.reject` 方法返回一个已经处于 `rejected` 状态的 `Promise` 对象，可以指定该对象的失败原因。
7. 异步函数（Async Function）：异步函数是使用 `async` 关键字定义的函数，它内部可以使用 `await` 关键字来等待一个 `Promise` 对象的状态变化。异步函数返回一个 `Promise` 对象，并通过 `Promise` 的 `resolve` 或 `reject` 方法来指定最终的结果。

### 手写Promise

```javascript
class myPromise {
  // 使用static创建静态属性
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED ='rejected';

  constructor(executor) {
    this.status = myPromise.PENDING; // 初始状态为 pending
    this.result = undefined; // promise的结果

    this.onFulfilledCallbacks = []; // 存储成功的回调函数
    this.onRejectedCallbacks = []; // 存储失败的回调函数

    try {
      /**
       * 执行 executor 函数，并传入 resolve 和 reject 方法
       */
      executor(this.resolve.bind(this), this.reject.bind(this))
    } catch (e) {
      this.reject(e)
    }
  }

  // 定义 resolve 和 reject 方法
  resolve(result) { // result为成功时接受参数
    // pending状态 => fulfilled状态
    if (this.status === myPromise.PENDING) {
      this.status = FULFILLED;
      this.result = result;
      this.onFulfilledCallbacks.forEach(callback => callback(result))
    }
  }
  reject(reason) { // reason为失败时接受参数
    // pending状态 => rejected状态
    if (this.status === myPromise.PENDING) {
      this.status = REJECTED;
      this.result = reason;
      this.onRejectedCallbacks.forEach(callback => callback(reason))
    }
  }

  /**
   * then 方法
   * @param {function} onFulfilled 成功的回调函数f
   * @param {function} onRejected 失败的回调函数
   * @returns {function} 返回一个Promise实例
   */
  then(onFulfilled, onRejected) {

    // onFulfilled、onRejected可能没有被定义，处理onFulfilled和onRejected为函数或者值的情况
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

    const promise2 = new myPromise((resolve, reject) => { 
      const handleFulfilled = () => {
        // 使用 setTimeout 模拟异步
        queueMicrotask(() => {
          try {
            const x = fulfilled(this.result);
            resolve(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        })
      }
      const handleRejected = () => {
        queueMicrotask(() => {
          try {
            const x = rejected(this.result);
            reject(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }) 
      }
      if (this.status === myPromise.FULFILLED) {
        handleFulfilled()
      } else if (this.status === myPromise.REJECTED) {
        handleRejected()
      } else {
        this.onFulfilledCallbacks.push(handleFulfilled)
        this.onRejectedCallbacks.push(handleRejected)
      }

    })
    return promise2
  }

  static resolve(value) {
    return new myPromise((resolve) => {
      resolve(value)
    })
  }
  static reject(reason) {
    return new myPromise((resolve, reject) => {
      reject(reason)
    })
  }
  catch(onRejected) {
    return this.then(undefined, onRejected)
  }
  finally(callback) {
    this.then(callback, callback)
  }
  static all(promises) {
    return new myPromise((resolve, reject) => {
      // 参数校验
      if (Array.isArray(promises)) {
        let result = []; // 存储结果
        let count = 0; // 计数器

        // 如果传入的参数是一个空的可迭代对象，则返回一个已完成（already resolved）状态的 Promise
        if (promises.length === 0) {
          return resolve(promises);
        }
        promises.forEach((item, index) => {
          // myPromise.resolve方法中已经判断了参数是否为promise与thenable对象，所以无需在该方法中再次判断
          myPromise.resolve(item).then(
            value => {
              count++;
              // 每个promise执行的结果存储在result中
              result[index] = value;
              // Promise.all 等待所有都完成（或第一个失败）
              count === promises.length && resolve(result);
            },
            reason => {
              /**
               * 如果传入的 promise 中有一个失败（rejected），
               * Promise.all 异步地将失败的那个结果给失败状态的回调函数，而不管其它 promise 是否完成
               */
              reject(reason);
            })
          })
        } else {
          return reject(new TypeError('Argument is not iterable'))
        }
    })
  }
  static race(promises) {
     return new myPromise((resolve, reject) => {
        // 参数校验
        if (Array.isArray(promises)) {
          // 如果传入的迭代promises是空的，则返回的 promise 将永远等待。
          if (promises.length > 0) {
            promises.forEach(item => {
            /**
             * 如果迭代包含一个或多个非承诺值和/或已解决/拒绝的承诺，
             * 则 Promise.race 将解析为迭代中找到的第一个值。
             */
            myPromise.resolve(item).then(resolve, reject);
            })
          }
        } else {
          return reject(new TypeError('Argument is not iterable'))
        }
    })
  }
}

/**
 * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  let called = false;
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      const then = x.then;
      if (typeof then === 'function') {
        then.call(x, 
          y => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          r => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
}

// 延迟执行，这个主要用于promise A+规范跑测使用
myPromise.deferred = function () {
    let result = {};
    result.promise = new myPromise((resolve, reject) => {
      result.resolve = resolve;
      result.reject = reject;
    });
    return result;
}

module.exports = myPromise;
```

### 参考链接


[Promise A+](https://promisesaplus.com/)