### 语法

`JSON`支持三种类型的值

* 简单值： 字符串、数值、布尔值和 `null` **（**`**underfinded**`**不可以）**
* 对象：{序键值:值对} 每个值可以是简单值，也可以是复杂类型
* 数组：可以通过数值索引访问，值可以是任意类型（ 简单值、对象，甚至其他数组）

### 解析与序列化

#### JSON对象

`JSON`对象有两个方法：`**stringify()**`和 `**parse()**`。 在简单的情况下，这两个方法分别可以将
`JavaScript` **序列化为 JSON 字符串**，以及将 `JSON` **解析为原生** `**JavaScript**` **值**。

默认情况下，`JSON.stringify()`会输出不包含空格或缩进的JSON。序列化`JavaScript`对象时，所有**函数和原型成员**都会有意地在结果中**省略**，此外值为`**undefined**`**的任何属性**会被**忽略。**

```
let book = {
  title: "Professional JavaScript",
  authors: [
    "Nicholas C. Zakas",
    "Matt Frisbie"
  ],
  edition: 4,
  year: 2017
};
let jsonText = JSON.stringify(book);
//{"title":"Professional JavaScript","authors":["Nicholas C. Zakas","Matt Frisbie"],
"edition":4,"year":2017}
```
`JSON`字符串可以直接传给`JSON.parse()`得到一个类似的新对象，新对象和旧对象是两个**完全不同的对象**。(`JSON`字符串无效，会抛出错误)

```
let bookCopy = JSON.parse(jsonText);
```
### 序列化选项

`JSON.stringify()`可接受两个参数， **第一个参数**是**过滤器**，可以是数组或函数；**第二个参数**是用于**缩进结果 JSON 字符串的选项**。

* 过滤结果

```
//第二个参数为数组
let book = {
  title: "Professional JavaScript",
  authors: [
    "Nicholas C. Zakas",
    "Matt Frisbie"
  ],
  edition: 4,
  year: 2017
};
let jsonText = JSON.stringify(book, ["title", "edition"]);
//{"title":"Professional JavaScript","edition":4}
// 第二个参数为函数接收两个参数：属性名（key）和属性值（value）
let jsonText = JSON.stringify(book, (key, value) => {
  switch(key) {
    case "authors":
      return value.join(",")
    case "year":
      return 5000;
    case "edition":
      return undefined;
    default:
      return value;
  }
});
// {"title":"Professional JavaScript","authors":"Nicholas C. Zakas,Matt
Frisbie","year":5000}
```
* 字符串缩进(缩进值最大为10)或插入换行符 `JSON.stringify()`方法的**第三个参数**控制缩进和空格。

```
//缩进
let book = {
  title: "Professional JavaScript",
  authors: [
    "Nicholas C. Zakas",
    "Matt Frisbie"
  ],
  edition: 4,
  year: 2017
};
let jsonText = JSON.stringify(book, null, 4);
//
{
  "title": "Professional JavaScript",
    "authors": [
    "Nicholas C. Zakas",
    "Matt Frisbie"
  ],
    "edition": 4,
    "year": 2017
}
let jsonText = JSON.stringify(book, null, "--" );
//
{
  --"title": "Professional JavaScript",
    --"authors": [
    ----"Nicholas C. Zakas",
    ----"Matt Frisbie"
    --],
    --"edition": 4,
    --"year": 2017
}
```
* `toJSON()`方法 自定义`JSON`序列化通过函数来定义，不能用箭头函数

```
let book = {
  title: "Professional JavaScript",
  authors: [
    "Nicholas C. Zakas",
    "Matt Frisbie"
  ],
  edition: 4,
  year: 2017,
  toJSON: function() {
    return this.title;
  }
};
let jsonText = JSON.stringify(book);
// {"title":"Professional JavaScript"}
```
### 解析选项

`JSON.parse()`方法也可以接收一个额外的参数，这个函数会针对每个键/值对都调用一次。也叫**还原函数**。若**属性为**`**undefined**`则为把相应的键删除。

```
let book = {
  title: "Professional JavaScript",
  authors: [
    "Nicholas C. Zakas",
    "Matt Frisbie"
  ],
  edition: 4,
  year: 2017,
  releaseDate: new Date(2017, 11, 1)
};
let jsonText = JSON.stringify(book);
let bookCopy = JSON.parse(jsonText,
  (key, value) => key == "releaseDate" ? new Date(value) : value);
alert(bookCopy.releaseDate.getFullYear());
```
