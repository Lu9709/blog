# nvm

`nvm` 是 `nodejs` 的版本管理工具，可以快速切换/更新 `nodejs` 版本。

#### 安装

* Windows电脑，使用[`nvm-windows`](https://github.com/coreybutler/nvm-windows/releases)

* Linux环境下，`curl` 命令安装：

```bash
curl -sL https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh -o install_nvm.sh
```

#### 检查环境变量的配置

```bash
cat ~/.bash_profile
```
如果出现以下内容则是配置好了，否则请加以下内容添加到 `.bash\_profile` 文件中：

```bash
export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

#### 添加完后需要重启脚本

```bash
source ~/.bash_profile
```

#### 验证是否安装成功

```bash
command -v nvm
```

#### 安装最新的node包

```bash
nvm install --lts
```

#### 其它常用指令

* `nvm install version`—— 安装指定的Node版本
* `nvm use version`——使用指定的Node版本
* `nvm uninstall version`——卸载本地指定的Node版本
* `nvm ls`——查看已经安装的Node版本
* `nvm ls-remote`——查看可以安装的Node版本
* `nvm use --lts`——使用最新的Node版本
* `nvm alias default version`——打开新的终端时使用默认的版本号
* `node --version`or`node -V`or`nvm current`——查看当前使用的Node版本
