---
outline: deep
---

# GIT

### GIT配置SSH-KEY

可以通过 `git config` 查看git用户配置，若未配置则可以配置如下六行命令行。

* `git config --global -ls`——查看git用户配置
* `git config --system -ls`——查看git系统配置
* `git config --local -ls`——查看当前仓库git配置

```shell
git config --global user.name 你的英文名
git config --global user.email 你的邮箱
git config --global push.default simple
git config --global core.quotepath false
git config --global core.editor "code --wait"
git config --global core.autocrlf input
```
生成一个SSH密钥，具体可以查看[Github官网](https://docs.github.com/cn/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)。

`ssh-keygen -t ed25519 -C "*your\_email@example.com*"`

打开生成的SSH公钥复制，在github的SSH Key中添加该公钥，之后测试是否连通。

```shell
ssh -T git@github.com
```
### 新建代码库

```shell
# 在当前目录新建一个Git代码库
$ git init
# 新建一个目录，将其初始化为Git代码库
$ git init [project-name]
# 下载一个项目和它的整个代码历史
$ git clone [url]
```
### 增加/删除文件

```shell
# 添加指定文件到暂存区
$ git add [file1] [file2] ...
# 添加指定目录到暂存区，包括子目录
$ git add [dir]
# 添加当前目录的所有文件到暂存区
$ git add .
# 添加每个变化前，都会要求确认
# 对于同一个文件的多处变化，可以实现分次提交
$ git add -p
# 删除工作区文件，并且将这次删除放入暂存区
$ git rm [file1] [file2] ...
# 停止追踪指定文件，但该文件会保留在工作区
$ git rm --cached [file]
# 改名文件，并且将这个改名放入暂存区
$ git mv [file-original] [file-renamed]
```
### 代码提交

```shell
# 提交暂存区到仓库区
$ git commit -m [message]
# 提交暂存区的指定文件到仓库区
$ git commit [file1] [file2] ... -m [message]
# 提交工作区自上次commit之后的变化，直接到仓库区
$ git commit -a
# 提交时显示所有diff信息
$ git commit -v
# 将add和commit合为一步
$ git commit -am 'message'
# 使用一次新的commit，替代上一次提交
# 如果代码没有任何新变化，则用来改写上一次commit的提交信息
$ git commit --amend -m [message]
# 重做上一次commit，并包括指定文件的新变化
$ git commit --amend [file1] [file2] ...
```
### 分支

```shell
# 列出所有本地分支
$ git branch
# 列出所有远程分支
$ git branch -r
# 列出所有本地分支和远程分支
$ git branch -a
# 新建一个分支，但依然停留在当前分支
$ git branch [branch-name]
# 新建一个分支，并切换到该分支
$ git checkout -b [branch]
# 新建一个分支，指向指定commit
$ git branch [branch] [commit]
# 新建一个分支，与指定的远程分支建立追踪关系
$ git branch --track [branch] [remote-branch]
# 切换到指定分支，并更新工作区
$ git checkout [branch-name]
# 切换到上一个分支
$ git checkout -
# 建立追踪关系，在现有分支与指定的远程分支之间
$ git branch --set-upstream [branch] [remote-branch]
# 合并指定分支到当前分支
$ git merge [branch]
# 选择一个commit，合并进当前分支
$ git cherry-pick [commit]
# 删除分支
$ git branch -d [branch-name]
# 删除远程分支
$ git push origin --delete [branch-name]
$ git branch -dr [remote/branch]
# 检出版本v2.0
$ git checkout v2.0
# 从远程分支develop创建新本地分支devel并检出
$ git checkout -b devel origin/develop
# 检出head版本的README文件（可用于修改错误回退）
git checkout -- README
```
### 标签

```shell
# 列出所有tag
$ git tag
# 新建一个tag在当前commit
$ git tag [tag]
# 新建一个tag在指定commit
$ git tag [tag] [commit]
# 删除本地tag
$ git tag -d [tag]
# 删除远程tag
$ git push origin :refs/tags/[tagName]
# 查看tag信息
$ git show [tag]
# 提交指定tag
$ git push [remote] [tag]
# 提交所有tag
$ git push [remote] --tags
# 新建一个分支，指向某个tag
$ git checkout -b [branch] [tag]
```
### 查看信息

```shell
# 显示有变更的文件
$ git status
# 显示当前分支的版本历史
$ git log
# 显示commit历史，以及每次commit发生变更的文件
$ git log --stat
# 搜索提交历史，根据关键词
$ git log -S [keyword]
# 显示某个commit之后的所有变动，每个commit占据一行
$ git log [tag] HEAD --pretty=format:%s
# 显示某个commit之后的所有变动，其"提交说明"必须符合搜索条件
$ git log [tag] HEAD --grep feature
# 显示某个文件的版本历史，包括文件改名
$ git log --follow [file]
$ git whatchanged [file]
# 显示指定文件相关的每一次diff
$ git log -p [file]
# 显示过去5次提交
$ git log -5 --pretty --oneline
# 显示所有提交过的用户，按提交次数排序
$ git shortlog -sn
# 显示指定文件是什么人在什么时间修改过
$ git blame [file]
# 显示暂存区和工作区的差异
$ git diff
# 显示暂存区和上一个commit的差异
$ git diff --cached [file]
# 显示工作区与当前分支最新commit之间的差异
$ git diff HEAD
# 显示两次提交之间的差异
$ git diff [first-branch]...[second-branch]
# 显示今天你写了多少行代码
$ git diff --shortstat "@{0 day ago}"
# 显示某次提交的元数据和内容变化
$ git show [commit]
# 显示某次提交发生变化的文件
$ git show --name-only [commit]
# 显示某次提交时，某个文件的内容
$ git show [commit]:[filename]
# 显示当前分支的最近几次提交
$ git reflog
```
### 远程同步

```shell
# 下载远程仓库的所有变动
$ git fetch [remote]
# 显示所有远程仓库
$ git remote -v
# 显示某个远程仓库的信息
$ git remote show [remote]
# 删除远程地址
$ git remote rm origin
# 增加一个新的远程仓库，并命名
$ git remote add [shortname] [url]
# 设置远程仓库地址
$ git remote set-url origin [url]
# 取回远程仓库的变化，并与本地分支合并
$ git pull [remote] [branch]
# 上传本地指定分支到远程仓库
$ git push [remote] [branch]
# 强行推送当前分支到远程仓库，即使有冲突
$ git push [remote] --force
# 推送所有分支到远程仓库
$ git push [remote] --all

```
### 撤销

```shell
# 恢复暂存区的指定文件到工作区
$ git checkout [file]
# 恢复某个commit的指定文件到暂存区和工作区
$ git checkout [commit] [file]
# 恢复暂存区的所有文件到工作区
$ git checkout .
# 重置暂存区的指定文件，与上一次commit保持一致，但工作区不变
$ git reset [file]
# 重置暂存区与工作区，与上一次commit保持一致
$ git reset --hard
# 重置当前分支的指针为指定commit，同时重置暂存区，但工作区不变
$ git reset [commit]
# 重置当前分支的HEAD为指定commit，同时重置暂存区和工作区，与指定commit一致
$ git reset --hard [commit]
# 将当前版本重置为HEAD(通常用于merge失败回退)
$ git reset --hard HEAD
# 重置当前HEAD为指定commit，但保持暂存区和工作区不变
$ git reset --keep [commit]
# 新建一个commit，用来撤销指定commit
# 后者的所有变化都将被前者抵消，并且应用到当前分支
$ git revert [commit]
```
### 合并/变基

`merge` 和 `rebase` 的区别：

`merge` 是合并的意思，`rebase` 是复为基底的意思。

`git pull --rebase` 和 `git pull` 的区别：

`git pull` 是 `git fetch + git merge FETCH\_HEAD` 的缩写，所以在默认情况下，`git pull` 就是先 `fetch`，然后执行 `merge` 操作，如果添加 `--rebase` 参数，就是使用 `git rebase` 代替 `git merge` 更新本地仓库。

举个例子，现在我们有这两连个分支，`test` 和 `master`，提交如下：

```markdown
      D---E test
     /
A---B---C---F master
```
在 `master` 执行 `git merge test`，会得到如下结果：

```markdown
      D-------E
     /         \
A---B---C---F---G  test,master
```
在`master`执行`git rebase test`，会得到如下结果：

```
A---C---D---E---C `---F` test , master
```
可以看到 `merge` 操作会生成一个新的节点，之前提交分开显示。而 `rebase` 操作不会生成新的节点，而是将两个分支融合成一个线性的操作。如果 `merge` 操作遇到冲突，需要手动修改冲突内容后，重新 `add` 和 `commit` 后才可以，`rebase` 的话则会中断 `rebase`，同时会提示去解决冲突。解决冲突后，将修改 `add` 后执行 `git rebase --continue` 继续操作，`git rebase --abort` 完全撤消变基或者 `git rebase --skip` 忽略冲突

```shell
# 添加分支名称，将指定的提交合并到当前使用的分支
$ git merge [commit]
# 将另一个分支与当前分支状态之间的所有提交变基
$ git rebase [other_branch_name]
# 变基当前分支的第一个提交
$ git rebase -i --root
# 变基当前分支中最近的几个提交
$ git rebase HEAD~n (n个)
# 列出 rebase 的 commit 列表，不包含 <commit id>
$ git rebase -i <commit id>
# 最近 3 条
$ git rebase -i HEAD~3
# 本地仓库没 push 到远程仓库的 commit 信息
$ git rebase -i
# vi 下，找到需要修改的 commit 记录，```pick``` 修改为 ```edit``` 或 ```e```，```:wq``` 保存退出
$ git rebase --continue
# 中间也可跳过或退出 rebase 模式
$ git rebase --skip
$ git rebase --abort
```
变基时可用的命令：

* `pick` 只表示包含提交。 在变基进行时重新排列 `pick` 命令的顺序会更改提交的顺序。 如果选择不包含提交，应删除整行。
* `reword` 命令类似于 `pick`，但在使用后，变基过程就会暂停，让您有机会改变提交消息。 提交所做的任何更改都不受影响。
* `edit` 如果选择 `edit` 提交，您将有机会修订提交，也就是说，可以完全添加或更改提交。 您也可以创建更多提交后再继续变基。 这样您可以将大提交拆分为小提交，或者删除在提交中执行错误更改。
* `squash` 此命令可用于将两个或以上的提交合并为一个。 下面的提交压缩到其上面的提交。 Git 让您有机会编写描述两次更改的新提交消息。
* `fixup` 这类似于 `squash`，但要合并的提交丢弃了其消息。 提交只是合并到其上面的提交，之前提交的消息用于描述两次更改。
* `exec` 可以让您对提交允许任意shell命令
* `drop` 删除该commit记录

```shell
pick 1fc6c95 Patch A
pick 6b2481b Patch B
pick dd1475d something I want to split
pick c619268 A fix for Patch B
pick fa39187 something to add to patch A
pick 4ca2acc i cant' typ goods
pick 7b36971 something to move before patch B

# Rebase 41a72e6..7b36971 onto 41a72e6
#
# Commands:
#  p, pick = use commit
#  r, reword = use commit, but edit the commit message
#  e, edit = use commit, but stop for amending
#  s, squash = use commit, but meld into previous commit
#  f, fixup = like "squash", but discard this commit's log message
#  x, exec = run command (the rest of the line) using shell
#
# If you remove a line here THAT COMMIT WILL BE LOST.
# However, if you remove everything, the rebase will be aborted.
#
```
### 暂存

`stash` 是本地的，不会通过 `git push` 命令上传到远程分支上。

使用场景：

* 代码内容多余，但是并不想删除，想保存有不想增加脏的提交
* 项目工作处理一半，转到其它分支，但不想提交一半记录。

```shell
# 会把所有未提交的修改(包括暂存的和非暂存的)都保存起来，用于后续恢复当前工作目录
$ git stash
# 给statsh添加记录版本
$ git stash save version_name
# 重新应用缓存的stash，该指令将会把缓存对战中的第一个statsh删除
$ git stash pop
# 将缓存堆栈中的stash多次应用到工作目录中，但不删除stash拷贝
$ git stash apply
# 查看现有stash
$ git stash list
# 移除stash后面可以跟着stash名字
$ git stash drop stash_name
# 查看指定stash的diff,后面可以添加 -p或--patch可以查看特定stash的全部diff
$ git stash show
# 从stash创建分支
$ git stash branch branch_name
```
### alias Git 配置

永久配置aliasGit配置，`vim ~/.bashrc`，复制如下后 `:wq` 保存后执行 `source ~/.bashrc`

```shell
alias ga='git add'
alias gc='git commit'
alias gcgl='git config --global --list'
alias gco='git checkout'
alias gl='git pull'
alias glog='git log --color --graph --pretty=format:'\''%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset'\'' --abbrev-
commit'
alias gp='git push'
alias gs='git status -sb'
```
