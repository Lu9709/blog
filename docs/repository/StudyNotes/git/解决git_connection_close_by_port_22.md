# 解决github connection close by port 22

::: warning 问题示例
```bash
➜  test git:(master) git push origin master
Connection closed by 20.205.243.166 port 22
fatal: 无法读取远程仓库。

请确认您有正确的访问权限并且仓库存在。

```
:::

这是因为github的ssh端口被墙了，可以换一个ssh端口，或者使用https协议。

**解决方法：配置SSH默认使用443端口**

1. 修改SSH配置文件。
  ```bash
   vim ~/.ssh/config
  ```
  ```bash
  #添加以下内容
  Host github.com
      Hostname ssh.github.com
      Port 443
      User git
  ```

2. 设置文件权限
  ```bash
  chmod 600 ~/.ssh/config
  ```
3. 测试连接
  ```bash
  ssh -T git@github.com
  ```
  输出：
  ```bash
  Hi username! You've successfully authenticated, but GitHub does not provide shell access.
  ```