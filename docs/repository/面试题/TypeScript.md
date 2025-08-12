### TS和JS的区别？有什么优势？
1. **语法层面**：TypeScript是 JavaScript + Type（TS是JS的超集）
2. **执行环境层面**：浏览器、Node.js可以直接执行JS，但不能执行TS（Deno可以执行TS）
3. **编译层面**：TS有编译阶段，JS没有编译阶段（只有转译阶段和lint阶段）
4. **编写层面**：TS更难写一点，但是**类型更加安全**。
5. **文档层面**：TS的代码写出来就是文档，**IDE**可以完美**提示**。JS的提示主要依靠TS。

### any、unknown、never的区别是什么？
**any V.s. unknown**

**相同点**：两者都是**顶级类型**（top type），**任何类型的值**都可以**赋值**给**顶级类型**的**变量**。

```typescript
let foo: any = 10 // 不报错
let bar: unknown = 10 // 不报错
```

**不同点**：但是`unknown`比`any`的**类型检查**更**严格**，`any`什么检查都不做，`unknown`要求**收窄类型**。

```typescript
const value: unknown = 'Hello World'
const someString: string = value
// 报错 TS2322: Type 'unknown' is not assignable to type 'string'.
const value: any = '123'
const somethingString: string = value // 不报错
```

如果改成`any`，基本哪里都不会报错。所以能用`unknown`就优先用`unknown`，类型更加安全一点。

**never**

`never`是**底类型**，表示**不该出现的的类型**，举例如下所示。

```typescript
interface A {
  type: 'a'
}

interface B {
  type: 'b'
}

type All = A | B

function handleValue(val: All) {
  switch (val.type) {
    case "a": {
      // 这里val被类型收窄为A
      break
    }
    case "b": {
      // 这里val被类型收窄为B
      break
    }
    default: {
      // 这里val被类型收窄为 never
      const exhaustiveCheck: never = val
      break
    }
  }
}
```

### type和interface的区别是什么？
详细见官方给出的[文档说明](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)。

1. **组合方式**：`interface`使用`extends`来实现继承，`type`使用`&`来实现联合类型。
2. **拓展方式**：`interface`可以**重复声明**用来拓展，`type`一个类型只能声明一次。
3. **范围不同**：`type`适用于基本类型，`interface`一般不行。
4. **命名方式**：`interface`会创建**新的类型名**，`type`只是创建**类型别名**，并**没有新创建类型**。

具体详细内容见下卡片。

[enum、type、interface](https://www.yuque.com/baizhe-kpbhu/ktvewz/rke7lt#aaEFN)

### TS 工具类型 Partial、Required 等的作用和实现
#### Partial 部分类型
`Partial<Type>`，将类型定义的所有属性都修改为**可选**。

```typescript
type Partial<T> = { [P in keyof T]?: T[P] }
```

#### Required 必填类型
`Required<Type>`，构造一个类型，该类型是由设置为**required**的Type的所有属性组成。<span style="color:#E8323C;">(必填)</span>

```typescript
type Required<T> = { [P in keyof T]-?: T[P] }
```

#### ReadOnly 只读类型
`ReadOnly<Type>`，设置类型只能<span color="rgb(232, 50, 60);">只读</span>，<span color="rgb(232, 50, 60);">不可以修改</span>。

```typescript
type Readonly<T> = { readonly [P in keyof T]: T[P] }
```

#### Exclude 排除类型
`Exclude<UnionType, ExcludedMembers>`，类型中排除一些属性来构成新的联合类型，对照案例可以看出`Exclude`是从T中找出U中没有的元素。

```typescript
type Exclude<T,U> = T extends U ? never : T
```

#### Extract 提取类型
`Extract<Type, Union>`，提取`Type`包含在`Union`中的元素，即取两者的<span style="color:#DF2A3F;">交集</span>。

```typescript
type Extract<T, U> = T extends U ? T : never
```

#### Pick/Omit 排除key类型
`Omit<T,K>`，<span style="color:#DF2A3F;">剔除</span>类型中的一些属性。

```typescript
type Omit<T,K> = Pick<T,Exclude<keyof T,K>>
```

`Pick<Type, Keys>`，从类型中选择一些属性keys字段构造类型。

```typescript
type Pick<T,K extends keyof T> = {
  [P in K]: T[P]
}
```

#### ReturnType 返回类型
`ReturnType<Type>`，接受函数声明，返回函数的返回类型

```typescript
 type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
```

其他高级类型见下卡片。

[TypeScript](https://www.yuque.com/baizhe-kpbhu/gayz3l/pxeygf#wKHke)

