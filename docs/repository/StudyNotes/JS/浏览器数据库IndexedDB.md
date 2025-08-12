# 浏览器数据库 IndexedDB

> IndexedDB就是浏览器提供的本地数据库，它可以被网页脚本创建和操作。IndexedDB 允许存储大量数据，提供查找接口，还能创建索引。
>
> IndexedDB 不属于关系型数据库（不支持SQL查询语句），更接近 NoSQL 数据库。

IndexedDB 具有以下特点：

1. **键值对存储**： IndexedDB 内部采用对象仓库（object store）存放数据。所有类型的数据都可以直接存入，包括JavaScript对象。对象仓库中，数据以"键值对"的形式保存，每一个数据记录都有对应的主键（主键独一无二）
2. **异步**： IndexedDB 操作不会锁死浏览器，用户可以继续进行其他操作。LocalStorage 形成对比，后者是同步操作。
3. **支持事务**：  IndexedDB 支持事务（transaction），一步失败，整个事务取消，回滚至事务发生之前都状态，不存在改写一部分数据都情况。
4. **同源限制**： IndexedDB 受到同源限制，每一个数据库对应创建它的域名。网页只能访问自身域名下的数据库，而不能访问跨域的数据库。
5. **存储空间大**： IndexedDB 的储存空间比 LocalStorage 大得多，一般来说不少于 250MB，甚至没有上限。
6. **支持二进制存储**： IndexedDB 的储存空间比 LocalStorage 大得多，一般来说不少于 250MB，甚至没有上限。

### 核心概念

1. **数据库（Database）**：
   * 顶层容器。每个源（协议+域名+端口）可以创建多个命名的 IndexedDB 数据库。
   * 每个数据库有唯一的名称和版本号（整数）。当数据库结构需要改变（如新增对象存储或索引）时，必须增加版本号。

2. **对象存储（Object Store）**：
   * 类似于 SQL 数据库中的表（Table） 或 MongoDB 中的集合（Collection）。
   * 是存储实际 JavaScript 对象的地方。
   * 每个对象存储需要：
      * **名称（Name）**： 唯一标识符。
      * **键路径（Key Path）**： 指定对象中哪个属性作为主键（keyPath）。例如 `{ keyPath: 'id' }` 表示对象的 `id` 属性是主键。也可以使用 `{ autoIncrement: true }` 让数据库自动生成递增的唯一键。
      * **可选配置**： 如是否允许键重复。

3. **索引（Index）**：
   * 类似于 SQL 数据库中的索引（Index）。
   * 在对象存储上创建，允许你基于对象存储中对象的某个属性（而不仅仅是主键）进行快速查询。
   * 每个索引需要：
      * **名称（Name）**： 在对象存储内唯一。
      * **键路径（Key Path）**： 指定对象中要索引的属性（如 `'name'`, `'price'`）。
      * **可选配置**： 如是否唯一（`unique`），是否允许多值（`multiEntry` - 用于数组属性）。

4. **事务（Transaction）**：
   * 所有对数据库的读写操作都必须在事务中进行。
   * 事务定义了操作的作用域（Scope）（影响哪些对象存储）和模式（Mode）：
      * `readonly`: **只允许读取操作**。
      * `readwrite`: **允许读取和写入（添加、更新、删除）操作**。
      * `versionchange`: 用于**修改数据库结构**（创建/删除对象存储或索引），仅在打开数据库时的 `onupgradeneeded` 事件处理程序中可用。
   * 事务是 **ACID** 的。如果事务中任何操作失败（或抛出错误未捕获），整个事务将回滚（撤销所有更改）。如果成功完成，则**提交**（永久保存更改）。
   * 事务会自动提交，通常在相关事件循环结束时。也可以手动调用 `transaction.commit()`（现代浏览器支持）。

5. **请求（Request）和游标（Cursor）**：

   * **请求（Request）**： 表示一个异步操作（如打开数据库、打开事务、在对象存储上执行 `get`, `add`, `put`, `delete`, 打开游标）。每个请求都会触发 `success` 或 `error` 事件。
   * **游标（Cursor）**： 一种遍历对象存储或索引中多条记录的机制。它允许你逐个或分批处理记录，控制遍历的方向和范围（例如 `IDBKeyRange` 可以定义只查询价格在 10 到 20 之间的商品）。


### 操作流程

#### 打开数据库

使用 IndexedDB 的第一步是打开数据库，使用 `indexedDB.open()` 方法。

```js
// databaseName: 数据库名称
// version: 数据库版本
var request = window.indexedDB.open(databaseName, version);
```

`indexedDB.open()` 方法返回一个 `IDBRequest` 对象。这个对象通过三种事件 `error`、`success`、`upgradeneeded`，处理打开数据库的操作结果。

**(1) error 事件**：

`error` 事件表示打开数据库**失败**。
```js
request.onerror = function (event) {
  console.log('数据库打开报错');
};
```
**(2)success 事件**：

`success` 事件表示打开数据库**成功**。
可以通过 `request.result` 获取数据库对象。
```js
var db;

request.onsuccess = function (event) {
  db = request.result; 
  console.log('数据库打开成功');
};
```

**(3)upgradeneeded 事件**：
`upgradeneeded` 事件表示数据库**版本发生变化**，需要升级。

```js
request.onupgradeneeded = function (event) {
  db = event.target.result;
  console.log('数据库升级成功');
};
```
#### 新建数据库

新建数据库与打开数据库是同一个操作。如果指定的数据库不存在，就会新建。不同之处在于，后续的操作主要在 `upgradeneeded`事件的监听函数里面完成，因为这时版本**从无到有**，所以会触发这个事件。

`createObjectStore` 用于创建并返回一个新的 object store 或 index。

```js
request.onupgradeneeded = function (event) {
  db = event.target.result;
  var objectStore;
  // 判断表格是否存在，如果不存在再创建表格
  if (!db.objectStoreNames.contains('person')) {
    objectStore = db.createObjectStore('person', { keyPath: 'id' });
  }
}
```

如果数据记录里面没有合适作为**主键**的属性，那么可以让 IndexedDB 自动生成主键。

```js
var objectStore = db.createObjectStore(
  'person',
  { autoIncrement: true }
);
```

新建对象仓库后，下一步可以新建索引。

```js
request.onupgradeneeded = function(event) {
  db = event.target.result;
  var objectStore = db.createObjectStore('person', { keyPath: 'id' });
  objectStore.createIndex('name', 'name', { unique: false });
  objectStore.createIndex('email', 'email', { unique: true });
}
```

#### 新增数据

新增数据指的是向对象仓库写入数据记录。这需要通过事务(`transaction`)完成。

新建事务以后，通过`IDBTransaction.objectStore()`方法，拿到 IDBObjectStore 对象，再通过表格对象的add()方法，向表格写入一条记录。

```js
function add() {
  var request = db.transaction(['person'], 'readwrite')
    .objectStore('person')
    .add({ id: 1, name: '张三', age: 24, email: 'zhangsan@example.com' });

  request.onsuccess = function (event) {
    console.log('数据写入成功');
  };

  request.onerror = function (event) {
    console.log('数据写入失败');
  }
}

add();
```

#### 读取数据

读取数据也是通过事务完成。

通过 `objectStore.get()` 方法读取数据，参数是主键的值。

```js
function read() {
   var transaction = db.transaction(['person']);
   var objectStore = transaction.objectStore('person');
   var request = objectStore.get(1);

   request.onerror = function(event) {
     console.log('事务失败');
   };

   request.onsuccess = function( event) {
      if (request.result) {
        console.log('Name: ' + request.result.name);
        console.log('Age: ' + request.result.age);
        console.log('Email: ' + request.result.email);
      } else {
        console.log('未获得数据记录');
      }
   };
}

read();
```

#### 遍历数据

遍历数据表格的所有记录，要使用指针对象 IDBCursor。

```js
function readAll() {
  var objectStore = db.transaction('person').objectStore('person');
  // openCursor 方法是一个异步操作，所以要监听
   objectStore.openCursor().onsuccess = function (event) {
     var cursor = event.target.result;

     if (cursor) {
       console.log('Id: ' + cursor.key);
       console.log('Name: ' + cursor.value.name);
       console.log('Age: ' + cursor.value.age);
       console.log('Email: ' + cursor.value.email);
       cursor.continue();
    } else {
      console.log('没有更多数据了！');
    }
  };
}

readAll();
```

#### 更新数据

更新数据要使用 `IDBObject.put()` 方法。

```js
function update() {
  var request = db.transaction(['person'], 'readwrite')
    .objectStore('person')
    .put({ id: 1, name: '李四', age: 35, email: 'lisi@example.com' });

  request.onsuccess = function (event) {
    console.log('数据更新成功');
  };

  request.onerror = function (event) {
    console.log('数据更新失败');
  }
}

update();
```

#### 删除数据

`IDBObjectStore.delete()` 方法用于删除记录。

```js
function remove() {
  var request = db.transaction(['person'], 'readwrite')
    .objectStore('person')
    .delete(1);

  request.onsuccess = function (event) {
    console.log('数据删除成功');
  };
}

remove();
```

#### 使用索引

索引的意义在于，可以让你搜索任意字段，从任意字段拿到数据记录。如果不建立索引，默认只能搜索逐渐

```js
objectStore.createIndex('name', 'name', { unique: false });

var transaction = db.transaction(['person'], 'readonly');
var store = transaction.objectStore('person');
var index = store.index('name');
var request = index.get('李四');

request.onsuccess = function (e) {
  var result = e.target.result;
  if (result) {
    // ...
  } else {
    // ...
  }
}
```

### 推荐封装库

| 库名 | 说明 |
| --- | --- |
| Dexie.js | 最流行的 IndexedDB 封装库，语法简洁，支持 Promise |
| idb | Google 开发的轻量级封装，API 更友好 |
| LowDB | 类似 JSON 文件的本地数据库，基于 IndexedDB |

### 典型应用场景

| 应用场景 | 说明 |
| --- | --- |
| PWA（渐进式 Web 应用）| 离线缓存数据 |
| 离线笔记应用| 用户编辑内容本地保存 |
| 大文件分片上传| 记录已上传分片 |
| 本地缓存 API 数据| 减少请求，提升体验 |
| 日志收集| 用户行为日志本地暂存 |
| 富文本编辑器| 自动保存草稿 |


### 参考链接

> [IndexedDB 教程 - 阮一峰](https://www.ruanyifeng.com/blog/2018/07/indexeddb.html)
>
> [IndexedDB - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API)
>
> [IndexedDB API - 网道](https://wangdoc.com/javascript/bom/indexeddb#indexeddb-%E5%AF%B9%E8%B1%A1)
