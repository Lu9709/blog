# 配置alias别名指令

bash终端永久配置alias别名指令，`vim ~/.bashrc`

```
alias ga='git add'
alias gc='git commit'
alias gcgl='git config --global --list'
alias gco='git checkout'
alias gl='git pull'
alias glog="git log --color --graph --pretty=format:'\''%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset'\'' --abbrev-commit"
alias gp='git push'
alias gs='git status -sb'
```
`:wq`保存退出后执行`source ~/.bashrc`

