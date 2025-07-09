# Monorepo 架构

> Monorepo 是一种源代码管理策略，指的是将多个相关项目（应用、库、服务、工具等）的代码存储在一个单一的版本控制仓库中。
> 
> 与传统的Polyrepo（多仓库）策略形成对比，后者为每个项目或模块使用独立的仓库。

### 传统架构概述

传统架构（PloyRepo）一般有组件库、脚手架、图表库、工具库、业务中心等内容组成。

- 独立项目结构，所有项目都是分开的 github 仓库
- 技术栈独立
- 规范化、自动化相关处理使得项目间割裂
- 依赖管理，版本很难统一管理
- 部署，docker、docker compose，自动化脚本很难形成统一

### monorepo 架构概述

- 混合项目结构，所有相关的工程形成子包进行管理
- 技术栈高度统一（团队基建项目、业务项目、子服务、技术栈）
- 规范化、自动化、流程化项目间共享
- 依赖管理，版本统一管理
- 部署，docker、docker compose，自动化脚本统一部署流程

### monorepo 架构方案

- 包管理，**pnpm** workspace、yarn workspace、lerna
- 构建缓存
- 增量构建，nx、**turbo**

### pnpm 优势

- 链接机制
- 缓存机制，寻址
- 原生支持 workspace
- 磁盘占用少
  
**核心关键点**：**中心化思想解**决依赖复用问题。

### 传统架构到 monorepo 架构演进

- 阶段1: 传统架构基础痛点（主要矛盾）
  - 代码先集中化，将多个关联项目统一到一个 github 仓库
  - 工具引入，pnpm workspace
  - CI/CD 重构
- 阶段2: 具体 monorepo 架构
  - 公共模块抽离
  - pnpm、turbo 解决子包与主包关系
- 阶段3: 自动化构建流程优化
  - 打包方案，**vite**、webpack、rollup、parcel、**tsup**、esbuild、swc、rolldown
  - 构建流程优化，依赖关系（循环依赖引用）、哪些包需要前置构建
  - 发布，npm publish、docker 镜像
  - 监控和测试


**关键性卡点（步骤）** :

1. 项目统一
2. pnpm 配置
3. 依赖管理
4. 统一化脚本
   - 工程化脚本：`package.json` 中的 `scripts`
   - scripts 文件夹