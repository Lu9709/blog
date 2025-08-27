### 数组中重复的数字

例如，如果输入长度为 7 的数组`[2,3,1,0,2,5,3]`，那么对应的输出是 `2` 或者 `3`。存在不合法的输入的话输出 `-1`。

```js
/**
 * @param {number[]} documents
 * @return {number}
 */
var findRepeatDocument = function (documents) {
	let map = new Map();
	for (let i of documents) {
		if (map.has(i)) return i;
		map.set(i, true);
	}
	return -1;
};
```

### 二维数组中的查找

编写一个高效的算法来搜索 `m x n` 矩阵 `matrix` 中的一个目标值 `target` 。该矩阵具有以下特性：

每行的元素从左到右升序排列。
每列的元素从上到下升序排列。

因为从左上角开始，不管向左走还是向下走都是递增的，无法判断规划的下一个位置是向左走还是向下走，所以从右上角开始，向左走递减，向下走递增，就可以判断下一个位置是向左走还是向下走。

```js
/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
function searchMatrix(matrix, target) {
    const h = matrix.length
    const w = matrix[0].length
    let i = 0
    let j = w - 1
    while (i < h && j >= 0) {
        if (matrix[i][j] === target) return true;
        if (matrix[i][j] > target) {
            j--
        } else {
            i++
        }
    }
    return false
}
```

### 替换空格

假定一段路径记作字符串 `path`，其中以 `"."` 作为分隔符。现需将路径加密，加密方法为将 `path` 中的分隔符替换为空格 `" "`，请返回加密后的字符串。

```js
function pathEncryption(path) {
  let res = ""
  for (let s of path) {
    res += s === '.' ? " " : s
  }
  return res
}
```


### 从头到尾打印链表

输入一个链表的头节点，按链表从尾到头的顺序返回每个节点的值（用数组返回）。

> 输入：head = [3,6,4,1]
>
> 输出：[1,4,6,3]

::: code-group 
```js [栈]
/**
 * @description 借助「栈」这种先进后出的结构来得到链表的倒序遍历结果
 * @param {ListNode} head
 * @return {number[]}
 */
var reverseBookList = function (head) {
	if (!head) return [];
	let stack = [];
	while (head) {
		stack.push(head.val);
		head = head.next;
	}
	return stack.reverse();
};
```

```js [递归]
/**
 * @description 递归遍历
 * @param {ListNode} head
 * @return {number[]}
 */
var reverseBookList = function (head) {
	if (!head) return [];
	let stack = [];
	let res = reverseBookList(head.next);
	res.push(head.val);
	return res;
};
```
:::

### 斐波那契数列

斐波那契数 （通常用 `F(n)` 表示）形成的序列称为 斐波那契数列 。该数列由 `0` 和 `1` 开始，后面的每一项数字都是前面两项数字的和。

> F(0) = 0，F(1) = 1
>
> F(n) = F(n - 1) + F(n - 2)，其中 n > 1
>
给定 `n` ，请计算 `F(n)` 。
答案需要取模 `1e9+7(1000000007)` ，如计算初始结果为：`1000000008`，请返回 `1`。

:::code-group
```js [递归]
/**
 * @description 解法一 暴力递归法 时间复杂度 O(2^n)，空间复杂度 O(n)
 * @param {number} n
 * @return {number}
 */
var fib = function (n) {
    if (n <= 1) return n;
    return (fib(n - 1) + fib(n - 2)) % 1000000007;
};
```

```js [自底向上的动态规划]
var fib = function (n) {
  if (n <= 1) return n;
  const arr = [0, 1];
  for (let i = 2; i <= n; i++) {
    arr[i] = (arr[i - 1] + arr[i - 2]) % 1000000007;
  }
  return arr[n];
}
```
```js [自顶向下的动态规划]
var fib = function (n) {
  const map = new Map();
  const loop = (n) => {
    if (n < 2) return n
    if (!map.has(n)) {
      map.set(n, (loop(n - 1) + loop(n - 2)) % 1000000007)
    }
    return map.get(n)
  }
  return loop(n)
}

```
:::