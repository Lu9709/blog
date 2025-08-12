# npm、cnpm、yarn、pnpm的区别

### npm

**npm（Node Package Manager）**
* 官方默认包管理器，随 Node.js 一起安装
* 从 v7 开始支持 `workspaces` 和 `overrides`
* 早期版本慢，但 v8+ 性能大幅提升
* 使用 `package-lock.json` 锁定依赖版本

**优点**：
* 官方支持，最稳定
* 无需额外安装

**缺点**：
* 早期版本速度慢
* `node_modules` 体积大（重复安装）


### yarn

**yarn（Yet Another Resource Negotiator）**
* 由 Facebook 推出，为解决 npm 速度慢的问题
* 使用本地缓存，提升安装速度
* 支持 `yarn.lock`，保证依赖一致性
* 支持 `yarn workspaces`，适合 Monorepo 项目

**优点**：

* 安装速度快（缓存机制）
* 支持并行下载
* 适合大型项目

**缺点**：

* `node_modules` 仍占用大量磁盘空间
* 已进入维护模式（yarn 1），yarn 3+（berry）变化大

### pnpm

**pnpm（Performant npm）**
* 最省磁盘空间的包管理器
* 使用 内容可寻址存储（Content-Addressable Store） + 硬链接/符号链接
* 所有包只安装一次，多个项目共享
* `node_modules` 中使用符号链接指向全局 store

**优点**：

* 极低磁盘占用（10 个项目可能只占 1 份空间）
* 安装速度快（避免重复下载）
* 支持严格的 node_modules 结构（避免幽灵依赖）

**缺点**：
* 生态相对较小
* 某些工具可能不兼容（如某些 CLI 工具依赖 node_modules 扁平结构）

### cnpm
**cnpm（China npm）**
* 淘宝维护的 npm 镜像客户端
* 实际上是 npm 的代理，使用 `https://registry.npmmirror.com`
* 命令与 npm 完全兼容


**优点**：

* 国内下载速度快
* 安装简单：`npm install -g cnpm --registry=https://registry.npmmirror.com`


**缺点**：

* 本质还是 `npm`，`node_modules` 依然臃肿
* 不是真正的“包管理器”，只是镜像代理
* 已逐渐被 `npm config set registry` 或 `nrm` 替代

### 包管理工具核心对比表

| 特性 | npm | yarn | pnpm | cnpm |
| --- | --- | --- | --- | --- |
| 是否官方 | :white_check_mark: 是（Node.js 自带） | :x: 否（Facebook） | :x: 否（开源社区） | :x: 否（淘宝） |
| 安装速度 | :warning: 一般(串行下载) | :white_check_mark: 快（并行下载+缓存） | :white_check_mark: 极快（硬链接） | :white_check_mark: 快（使用国内镜像） |
| 磁盘占用 | :x: 高（重复安装） | :x: 高（重复安装） | :white_check_mark: 极低（硬链接共享） | :x: 高（重复安装） |
| 依赖管理 | node_modules 扁平化 | node_modules 扁平化 | 符号链接 + store | node_modules 扁平化 |
| 锁定文件 | package-lock.json | yarn.lock | pnpm-lock.yaml | package-lock.json |
| 是否支持 Workspaces | :white_check_mark: 是（v7+） | :white_check_mark: 是 | :white_check_mark: 是 | :white_check_mark: 是 |
| 是否支持 Monorepo | :warning: 一般 | :white_check_mark: 好 | :white_check_mark: 极好 | :warning: 一般 |
| 国内下载速度 | :x: 慢（依赖国外源） | :x: 慢 | :x: 慢 | :white_check_mark: 快（使用淘宝镜像） |
| 命令语法 | `npm install` | `yarn add` | `pnpm add` | `cnpm install` |
| 社区生态 | :white_check_mark: 极大 | :white_check_mark: 大 | :white_check_mark: 中等 | :white_check_mark: 大（国内） |

### workspace

`workspace` 的作用是：在一个仓库中**管理多个相互依赖的包**（Package），实现统一**安装依赖**、**共享版本**、**快速本地链接**、**统一脚本执行**，提升开发效率和项目一致性。 