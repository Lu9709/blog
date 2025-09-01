# 什么是Three.js

> Three.js 是一个 JavaScript 库，用于使用 WebGL 来绘制三维效果的。

three.js 核心文件 为 `three.module.js`，除类核心文件，我们经常会添加一些**插件**，比如 `OrbitControls` 插件（一种流行的相机控制插件）。

### 获取 three.js 文件

1. 从 CDN 中引入需要的文件
2. 安装 `three.js` 的 NPM 包

### 项目中引入three.js

**核心文件** 和 `OrbitControls` 插件是 JavaScript 模块。要使用他们，首先要将他们导入到 `main.js` 中。

#### 导入 three.js 核心文件

`three.js` 核心包含相机、材质、**几何**、**灯光**、动画系统、各种加载器、音频、渲染器、2D形状、帮助文件、雾灯数百个类。我们肯定不会完全使用它们，我们可以按需导入。

::: info 导入整个 three.js 模块
```js 
import * as THREE from './vendor/three/build/three.module.js';
```
  之后我们可以使用 `THREE` 来访问所有的类和函数。
```js
THREE.PerspectiveCamera; // 透视相机
THREE.MeshStandardMaterial; // 标准材质
THREE.Texture; // 纹理
// ... 剩下的几百个
```
::: 

::: tip 从核心导入单个文件
```js
import {
  PerspectiveCamera,
  MeshStandardMaterial,
  WebGLRenderer,
} from "./vendor/three/build/three.module.js";
```
:::

#### 导入插件

`OrbitControls.js` 模块包含一个导出，即类 `OrbitControls`。导入它的工作方式与从核心导入类的方式相同：

```js
import { OrbitControls } from "./vendor/three/examples/jsm/controls/OrbitControls.js";

```
