# Vue v.s React

### 设计定位

* **Vue**：定位为**渐进式框架**（可以从简单脚本引入到复杂的单页应用（SPA）逐步采用），从视图层可逐步扩展至路由、状态管理等完整解决方案。

* **React**：是一个用于**构建用户界面的 JavaScript 库**，专注于组件化和声明式 UI，强调**函数式编程**和**不可变性**（UI = f(state)）

### 语法

* **Vue**：
  * **模版语法**：模板语法基 HTML，支持指令、插值、表达式、过滤器等。
  * **单文件组件（SFC）**：将模板、脚本、样式封装在 `.vue` 文件中，结构清晰。
  * **API 风格**：提供 **Options API**（按生命周期分组）和 **Composition API**（按功能逻辑组织，类似 React Hooks）。

* **React**：
  * **JSX**：JavaScript 语法扩展，允许在 JS 中直接编写类 HTML 结构，逻辑与 UI 高度耦合，类型支持友好（TS）。
  * **组件化**：以**函数组件** + **Hooks**为主流（如 `useState`、`useEffect`），通过组合实现复杂逻辑。

### 响应式原理

| 特性 | Vue | React |
| --- | --- | --- |
| 数据绑定 | 双向绑定（`v-model`） + 响应式系统 | 单向数据流（`props` + `useState`）|
| 实现机制 | 基于 `Proxy（Vue3）` 数据劫持整个对象 或 `Object.defineProperty`（Vue2）针对对象属性 | 状态变更需要调用 `setState`，默认**重新渲染**整个子树，依赖虚拟 DOM Diff 局部更新 |
| 数据可变性 | Vue3通过Proxy实现数据可变性，没有修改数据源，Vue2直接修改数据对象 | 强调不可变性，需创建新状态对象 |

### 状态管理

**Vue**:
  * 组件内：`ref`、`reactive`（Composition API）或 `data` 属性（Options API）
  * 跨组件：`Pinia`、`Vuex`

**React**:
  * 组件内：`useState`、`useReducer`
  * 跨组件：依赖 `Context API` 或 第三方库 `Redux`、`zustand`、`MobX`

### Dom Diff

**Vue2**:
  * **核心算法**：基于 Snabbdom 的**双端比较**算法（Double-End Diff）。
  * **过程**：
    1. Vue 2 使用虚拟 DOM（VNode） 表示真实 DOM 结构，更新时对比新旧 `VNode` 树。
    2. 采用双端比较：对比新旧 `VNode` 树的头尾指针（oldStart、oldEnd、newStart、newEnd），通过移动指针缩小比较范围。
    3. 优先检查同层节点，判断是否是相同节点（通过 `key` 和 `tag` 判断）。
    4. 如果节点相同，进一步递归比较子节点；如果不同，直接替换。
    5. 支持 `key` 属性优化列表渲染，通过 `key` 快速定位节点变化，减少不必要的 DOM 操作。
  
**Vue3**:
  * **核心算法**：优化的**双端比较**算法 + **最长递增子序列(LIS)** 优化。
  * **过程**：
    1. **Block Tree**：将模板划分为动态和静态块，动态块只包含动态节点，降低 Diff 范围。
    2. **静态提升（Static Hoisting）**：将静态内容（不依赖数据的节点）提升到渲染函数外部，避免重复创建 VNode。
    3. **Patch Flag**：为动态节点添加**标记**（如文本、属性、事件等），在 Diff 时只处理标记为动态的节点，减少比较开销。
    4. **最长递增子序列（LIS）**：对动态节点进行 LIS 比较，找出最长递增子序列，仅更新子序列对应的节点。

**React**:
  * **核心算法**：基于 **单向比较(Reconciliation)** 的启发式算法。
  * **过程**：
    1. **Fiber 节点结构**
       * 每个组件对应一个 Fiber 节点。
       * Fiber 节点之间形成链表结构，便于中断或恢复。
    2. **单链表递归比对**
       * 从根节点开始向下递归比对子组件，并生成新的 Fiber 树。
       * 同层对比，不跨级对比，不同的节点直接替换。
       * Key优化，通过 key 属性识别列表中节点的身份，减少列表重排的开销。
    3. **调度优先级**
       * Fiber 支持任务打断（高优先级任务插队）。
       * 更适合处理复杂交互动画。


**主要区别总结**

| 特性 | Vue 2 | Vue 3 | React |
| --- | --- | --- | --- |
| 算法 | 双端比较 | 优化双端比较 + LIS | 单向比较（启发式） |
| 优化手段 | 静态节点标记、key 优化 | Patch Flag、Block Tree、静态提升、LIS | Key 优化、Fiber（异步） |
| 列表渲染 | 依赖 key，效率一般 | LIS 优化，高效处理列表变化 | 依赖 key，无 key 时效率低 |
| 动态节点处理 | 全量比较动态节点 | 只比较 Patch Flag 标记的动态节点 | 依赖 props 比较，需手动优化 |
| 性能 | 较好，依赖 key | 极高，智能优化 | 一般，依赖开发者优化 |
| 复杂场景 | 一般，子树变化可能全量更新 | 高效，精准更新 | 可能重建子树，效率较低 |


### 生态系统与工具链

| 领域 | Vue |	React |
| --- | --- | --- |
| 路由 | Vue Router（官方集成）|	React Router DOM |
| 构建工具 | Vite（极速热更新）、 Vue CLI	| Create React App（CRA）、Vite/Next.js6 |
| 服务端渲染 | Nuxt.js |	Next.js |
| 移动端 | NativeScript-Vue / Ionic Vue |	React Native（生态成熟）56 |
| UI 库 | Element Plus、Vuetify |	Material UI、Ant Design |
| 状态管理 | Pinia、VueX |	Redux、MobX、zustand |