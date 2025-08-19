# Docker

> Docker是一个开源的应用容器引擎，用于用于将应用程序及其依赖项打包成轻量级、可移植的**容器**

### 核心组件

1. **镜像（Image）**：
   * 只读模板，包含应用代码、依赖库和配置（如 `nginx:latest`）。
   * 镜像是分层构建的，通过 `Dockerfile` 定义构建步骤
2. **容器（Container）**：
   * 镜像的运行实例，具有独立的文件系统、网络和进程空间。
   * 启动时在镜像顶层添加可写层，数据随容器生命周期结束而消失（除非持久化）
3. **Dockerfile**：
   * 文本文件定义镜像构建步骤（从基础镜像到最终应用）
4. **仓库（Repository）**：
   * 存储和分发镜像的平台（如 Docker Hub）。
   * 支持公共仓库和私有仓库

### 基本命令

1. 镜像管理
   * `docker image ls` 查看本地镜像
   * `docker image rm [imageName]` 删除镜像
   * `docker pull` 拉取远程仓库镜像
   * `docker build` 根据dockerfile构建镜像
   * `docker rmi` 删除镜像
2. 容器生命周期
   * `docker run` 创建并启动容器
   * `docker start/stop/restart` 启动/停止/重启 容器
   * `docker exec` 在运行中的容器执行命令
   * `docker rm` 删除容器
   * `docker ps` 查看容器状态
3. 容器监控与调试
   * `docker logs` 查看容器日志
   * `docker inspect` 查看容器详情（配置、网络等）
   * `docker stats` 实时监控资源占用
4. 网路与数据管理
   * `docker network create` 创建自定义网络
   * `docker volume create`  创建数据卷（持久化存储）
   * `docker cp` 容器与宿主机间复制文件
5. 系统维护
   * `docker system prune` 清理无用资源
   * `docker info` 查看Docker系统信息

### 典型应用场景

| 场景 | 说明 |
| --- | --- |
| **微服务架构** | 每个微服务独立容器化，隔离部署 |
| **持续集成流水线** | 构建阶段生成应用镜像，测试环境秒级部署 |
| **本地开发环境搭建** | 一键启动数据库、消息队列等依赖服务 |
| **混合云迁移** | 容器跨云平台（AWS/Azure/GCP）无缝迁移 |


### HelloWorld 案例

运行下面的命令，将 `image` 文件从仓库抓取到本地

```bash
docker image pull library/hello-world
```

上面代码中，`docker image pull` 是抓取 `image` 文件的命令。`library/hello-world`是 `image` 文件在仓库里面的位置，其中 `library` 是 `image` 文件所在的组，`hello-world` 是 `image` 文件的名字。

由于 Docker 官方提供的 `image` 文件，都放在 `library` 组里面，所以它的是默认组，可以省略。因此，上面的命令可以写成下面这样。

```bash
docker image pull hello-world
```

然后运行这个 `image` 文件，`docker container run` 命令具有自动抓取 `image` 文件的功能。如果发现本地没有指定的 `image` 文件，就会从仓库自动抓取。因此，前面的 `docker image pull` 命令并不是必需的步骤。

```bash
docker container run hello-world
```
有些容器不会自动终止，因为提供的是服务。比如，安装运行 Ubuntu 的 `image`，就可以在命令行体验 Ubuntu 系统。

```bash
docker container run -it ubuntu bash
```

对于那些不会自动终止的容器，必须使用 `docker container kill` 命令手动终止。

### 参考链接

> [Docker — 从入门到实践](https://yeasy.gitbook.io/docker_practice/image/multistage-builds)
> 
> [Docker 指南](https://docs.ffffee.com/docker/guides/1-docker%E6%8C%87%E5%8D%97.html)
> [Docker 官方文档](https://docs.docker.com/)


