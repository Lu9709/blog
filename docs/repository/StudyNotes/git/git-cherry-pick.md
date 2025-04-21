---
outline: deep
---

# Cherry-Pick

对于多分支的代码库，将代码从一个分支转移到另一个分支是常见需求。

这时分两种情况。

* 情况一，你需要另一个分支的所有代码变动，那么就采用合并(`git merge`)或变基(`git rebase`)
* 情况二，只需要部分另一个分支的部分代码变动(即某几个提交)，这时候可以采用`git cherry-pick`

### 一、基本用法

`git cherry-pick` 命令的作用，就是将指定的提交(`commit`)应用于其他分支。

```shell
git cherry-pick <commitHash>
```
上面命令就会将指定的提交`commitHash`，应用于当前分支。这会在当前分支产生一个新的提交，当然它们的哈希值会不一样。

举例来说，代码仓库有`master`和`feature`两个分支。

```markdown
a - b - c - d   Master
         \
           e - f - g Feature
```
现在将f的提交放到Master分支中。

```bash
# 切换至Master主分支中
$ git checkout Master
# 将f提交放入主分支，cherry-pick操作
$ git cherry-pick f
```
上面f的是f的commit记录的哈希值，可以不一定是commit记录的哈希值，也可以是分支名称，表示转移该分支的最新提交。

```bash
# 下面代码表示将feature分支的最近一次提交，转移到当前分支。
$ git cherry-pick Feature
```
### 二、转移多个提交

`Cherry pick`支持一次转移多个提交。

```bash
# 提交两个commit记录到当前分支
$ git cherry-pick <HashA> <HashB>
# 提交除A以外B到commit记录到当前分支(不包含A)
$ git cherry-pick A..B
# 提交A到B的commit记录到当前分支
$ git cherry-pick A^..B
```
### 三、配置项

`git cherry-pick`命令的常用配置项如下。

1. `-e`，`--edit`——打开外部编辑器，编辑提交信息。
2. `-n`，`--no-commit`——只更新工作区和暂存区，不产生新的提交。
3. `-x`——在提交信息的末尾追加一行(`cherry picked from commit ...`)，方便以后查到这个提交是如何产生的。
4. `-s`，`--signoff`——在提交信息的末尾追加一行操作者的签名，表示是谁进行了这个操作。
5. `-m parent-number`，`--mainline parent-number`

如果原始提交是一个合并节点，来自于两个分支的合并，那么`Cherry pick`默认将失败，因为它不知道应该采用哪个分支的代码变动。

`-m`配置项告诉 Git，应该采用哪个分支的变动。它的参数`parent-number`是一个从1开始的整数，代表原始提交的父分支编号。

### 四、代码冲突

如果操作过程中发生代码冲突，`Cherry pick`会停下来，让用户决定如何继续操作。

1. `--continue`

用户解决代码冲突后，第一步将修改的文件重新加入暂存区(`git add .`)，第二步使用下面的命令，让`Cherry pick`过程继续执行。

```bash
$ git cherry-pick --continue
```
2. `--abort`

发生代码冲突后，放弃合并，回到操作前的样子。

3. `--quit`

发生代码冲突后，退出`Cherry pick`，但是不回到操作前的样子。

### 五、转移到另一个代码库

`Cherry pick`也支持转移另一个代码库的提交，方法是先将该库加为远程仓库。

```bash
# 添加该库为远程仓库
$ git remote add target git://gitUrl
# 拉取远程仓库代码到本地
$ git fetch target
# 查看远程仓库提交记录
$ git log target/master
# 使用cherry-pick提交转移代码
$ git cherry-pick <commitHash>
```
