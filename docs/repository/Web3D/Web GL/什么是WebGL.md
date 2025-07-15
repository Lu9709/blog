# WebGL

WebGL (Web 图形库)是一种可在任何兼容的Web浏览器中无需使用插件即可渲染高性能交互式3D和2D动画的Javascript API。

WebGL 通过引入OpenGL ES 2.0 API，使得该API可以在 HTML `<canvas>` 元素中使用。该API可以利用用户设备提供的硬件图像加速。

WebGL2 是对 WebGL 的一次重大更新，通过 `WebGL2RenderingContext` 接口提供。它基于 OpenGL ES 3.0，新特性包括：

* 3D 纹理
* 采样对象
* Uniform缓冲对象
* 同步对象
* 查询对象
* 变化反馈对象
* 顶点数组对象
* 实例化
* 多个渲染目标
* 片段深度


### 基本概念

* **`<canvas>` 元素**:WebGL 使用HTML5 的 `<canvas>` 元素作为绘图表面。
* **着色器(Shaders)**:WebGL 程序由JavaScript 代码和着色器代码组成。着色器代码是在GPU上运行的，用于控制图形的渲染。主要有两种类型的着色器：
    * **顶点着色器**:负责计算顶点的位置和属性。
    * **片元着色器(也叫像素着色器)**:负责计算每个像素的颜色值。
* **GLSL(OpenGL Shading Language)**:着色器代码使用GLSL语言编写。
* **缓冲区(Buffers)**:存储顶点数据(如位置、颜色、纹理坐标等) 的地方。
* **属性(Attributes)**:从缓冲区中读取数据并传递给顶点着色器。
* **全局变量(Uniforms)**:在着色器程序运行前赋值，在整个渲染过程中保持不变。
* **纹理(Textures)**:用于存储图像和其他数据，可以在着色器中读取。
* **可变量(Varyings)**:用于在顶点着色器和片元着色器之间传递数据，并进行插值计算。
* **着色器程序(Shader Program)**:由一个顶点着色器和一个片元着色器组成，用于定义渲染一个特定对象的外观。

### 工作流程

1. JavaScript代码准备好顶点数据（位置、颜色等）并存储在缓冲区中。
2. 通过JavaScript设置着色器程序，包括顶点着色器和片元着色器。
3. JavaScript将缓冲区数据和着色器程序传递给WebGL。
4. WebGL将数据发送到GPU，由着色器程序进行处理。
5. GPU根据着色器程序计算每个像素的颜色，并将结果绘制到 `<canvas>` 元素上。

### 常见库


* three.js 一个开源、功能齐全的3D WebGL 库。
* Babylon.js 是一个强大、简洁且开放的游戏和 3D 渲染引擎，封装在一个 JavaScript 库中。
* Pixi.js 一个开源的 2D WebGL渲染器。
* Phaser 是一个用于 Canvas 和 WebGL 支持的浏览器游戏的快速、免费和有趣的开源框架。
* PlayCanvas 是一个开源游戏引擎。
* glMatrix 是一个用于高性能 WebGL 应用程序的 JavaScript 矩阵和矢量库。
* twgl 是一个用于减少 webgl 冗余的库。
* RedGL 是一个开源 3D WebGL 库。
* vtk.js 是一个用于在浏览器中实现科学可视化的 JavaScript 库。
* webgl-lint 将帮助查找 WebGL 代码中的错误并提供有用信息。


### 参考资料

>[WebGL - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API)
>
>[WebGL2](https://webgl2fundamentals.org/webgl/lessons/zh_cn/webgl-fundamentals.html)
>
>[WebGL](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-fundamentals.html)