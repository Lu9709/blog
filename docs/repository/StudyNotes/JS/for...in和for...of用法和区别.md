# for...in和for...of 用法和区别

### for...in

`for...in` 语句迭代一个对象的所有**可枚举字符串属性**（除 `Symbol` 以外），包括继承的可枚举属性。

```js
const object = { a: 1, b: 2, c: 3 };

for (const property in object) {
  console.log(`${property}: ${object[property]}`);
}
// Expected output:
// "a: 1"
// "b: 2"
// "c: 3"
```

### for...of

`for...of` 语句执行一个循环，该循环处理来自**可迭代对象的值序列**。可迭代对象包括内置对象的实例，例如 `Array`、`String`、`TypedArray`、`Map`、`Set`、`NodeList`（以及其他 DOM 集合），还包括 `arguments` 对象、由生成器函数生成的生成器，以及用户定义的可迭代对象。

:::code-group
```js [迭代数组]
const iterable = [10, 20, 30];
for (const value of iterable) {
  console.log(value);
}
// 10
// 20
// 30
```
```js [迭代字符串]
const iterable = "boo";
// 字符串将会按 Unicode 码位迭代。
for (const value of iterable) {
  console.log(value);
}
// "b"
// "o"
// "o"
```
```js [迭代 Map]
const iterable = new Map([
  ["a", 1],
  ["b", 2],
  ["c", 3],
]);
for (const entry of iterable) {
  console.log(entry);
}
// ['a', 1]
// ['b', 2]
// ['c', 3]
```
```js [迭代 Set]
const iterable = new Set([1, 1, 2, 2, 3, 3]);
for (const value of iterable) {
  console.log(value);
}
// 1
// 2
// 3
```
```js [迭代参数对象]
function foo() {
  for (const value of arguments) {
    console.log(value);
  }
}
foo(1, 2, 3);
// 1
// 2
// 3
```
``` js [迭代生成器]
function* source() {
  yield 1;
  yield 2;
  yield 3;
}
const generator = source();
for (const value of generator) {
  console.log(value);
}
// 1
// 2
// 3
```
:::

### for...of 与 for...in 之间的区别

`for...in` 和 `for...of` 语句都用于迭代某个内容，它们之间的主要区别在于迭代的对象。

`for...in` 语句用于迭代对象的**可枚举字符串属性**，而 `for...of` 语句用于迭代**可迭代对象**定义的要进行迭代的**值**。

下面的示例展示了在迭代 Array 时，`for...of` 循环和 `for...in` 循环之间的区别。

```js
Object.prototype.objCustom = function () {};
Array.prototype.arrCustom = function () {};

const iterable = [3, 5, 7];
iterable.foo = "hello";

for (const i in iterable) {
  console.log(i);
}
// "0"、"1"、"2"、"foo"、"arrCustom"、"objCustom"

for (const i in iterable) {
  if (Object.hasOwn(iterable, i)) {
    console.log(i);
  }
}
// "0" "1" "2" "foo"

for (const i of iterable) {
  console.log(i);
}
// 3 5 7
```
### 总结

一句话概括：for in是**遍历（object）键名**，for of是**遍历（array）键值**。