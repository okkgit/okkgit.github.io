---
sidebar: auto
---

# Git 使用

## git 密匙配置
~~~sh
git config --list --show-origin  # 查看git配置
# 配置用戶名
git config global user.name "name"
# 配置用戶郵箱
git config global user.email "email@163.com"
# 创建密匙
ssh-keygen -t rsa -C "email@163.com"
~~~

## git flow 开发流程
- 两个长期存在的分支：
    - `develop` 开发分支 （保存最新开发板本）
    - `master` 主分支 （该分支的每个版本都是稳定的）

- 三种短分支（开发挽就会并入上面的两个长分支）
    - `feature` 功能分支
    - `hotfix` 补丁分支
    - `release` 预发分支

## github flow 开发流程

- 根据需求从master 拉出新分支，不区分功能分支或补丁分支
- 开发完成向 master 分支发送 pull request 简称PR
- pull request 算一个通知，让维护者讨论，对话过程中可以提交代码
- pull request 被接受并合并到master ，重新部署后删除master分支

## gitlab flow 开发流程

是 git flow 和 github flow 的综合

- gitlab flow 遵循上游优先
    - 只存在一个 master 分支，是所有其他分支的上游，
    - 并且只有上游分支采纳的代码才能应用到其他分支

- 建议在master 分支外建立不同环境分支，例如：
    - 开发环境 `master`
    - 预发环境 `pre-production`
    - 生产分支 `production`
    - 当生产分支bug，则新创建一个功能分支，先合并到预发分支检查后在发布搭配生产分支


## git 常用命令

- clone / fetch
- pull
- push
- add
- commit
- checkout

### 创建仓库

~~~ sh
git init
git init [dir]
git clone [url]
~~~

### 文件曾加/删除
~~~sh
git add [file1] [file2] ...
git add [dir] # 包括子目录
git add .
# 每个变化都会提示确认
# 单文件多变化可以分次提交
git add -p 
# 删除工作区文件，并将这次删除放到暂存区
git rm [file1] [file2] ...
# 停止跟踪文件并不会删除文件
git rm --cached [file] 
# 文件重命名，并把更改放入暂存区
git mv [oldName] [newName]
~~~ 

### 代码提交
~~~ sh
git commit -m [msg]

git commit [file1] [file2] -m [msg]

# 提交工作区自上次的变化，直接到仓库
git commit -a 

# 提交时显示所有diff信息
git commit -v

# 覆盖上一次提交
git commit --amend -m [msg]
git commit --amend [file1] [file2]
~~~

### git分支管理 branch
~~~ sh
# 查看所有分支, -r 远程分支
git branch
git branch -r # 列远程分支
git branch -a # 列出本地和远程分支

# 创建分支
git branch [branchName] # 创建不切换
git checkout -b [branchName] # 创建并切换
# 创建一个分支与指定远程分支建立追踪关系
git branch [branch] [commit]
git branch --track [branch] [remoteBranch]

# 切换分支
git chechout [branchName]
git chechout - # 上一个分支

# 当前分支与远程分支建立追踪关系
git branch --set-upstrem [branch] [remoteBranch]


# 分支合并
git merge [branch] # 合并指定分支到当前分支

# 删除分支
git branch -d [branchName]

# 删除远程分支
git push --delete [branchName]
git brabch -dr [remote/branch]
~~~

### git 标签 tag
~~~ sh
# 列出所有tag
git tag

# 创建tag 
git tag [tag] # 在当前分支创建
git tag [tag] [commit] # 指定分支创建tag
git tag -d [tag] # 删除本地tag

git push origin :refs/tags/[tagName] # 删除远程tag

# 查看tag信息
git show [tag]

# 提交tag
git push [remote] [tag]
git push [remote] --tags # 提交所有tag

# 创建一个分支指向某个tag
git checkout -b [branch] [tag]
~~~
### 状态查看 查看信息
~~~sh
# 显示有变化的文件
git status

# 显示当前分支的版本历史
git log

# 显示 commit 历史 ，及每次提交变化文件
git log --stat

# 搜索提交历史
git log -S [keyword]

# 显示某个commit之后的所有变动
git log [tag] HEAD --pretty=format:%s

# 某个commit 之后满足格式的所有提交
git log [tag] HEAD --grep feature

# 查看某个文件历史版本
git log --follow [file]
git watchanged [file]

# 显示指定文件的每一次diff
git log -p file

# 显示过去的5 次提交
git log 5 --pretty --online

# 按提交次数顺序显示提交用户
git sortlog -sn

# 显示指定文件是在什么人什么时间修改
git blame [file]

# 暂存区与工作区差异
git diff

# 暂存区与上一个commit 差异
git diff -cache [file]

# 工作区与与当前分支最新commit之间差异
git diff HEAD 

# 显示两次提交的差异
git diff [commit1] [commit2]

# 显示今天写了多少行代码
git diff --shortstat "@{0 day ago}"

# 显示每次提交元素和八日容变化
git show [commit]

# 显示某次提交发生变化的文件
git show --name-only [commit]

# 显示某次提交，某个文件的内容
git show [commit]:[filename]

# 对当前分支的最近几次提交
git reflog
~~~

### 远程同步
~~~sh
# 下载远程仓库suo'you变动
git fetch [remote]

# 显示所有远程仓库
git remote -v

# 显示某个远程仓库的信息
git remote show [remote]

# 创建一个新的远程仓库并命名
git remote add [shortName] [url]

# 取远程分支的变化并与本地分支合并
git pull [remote] [branch]

# 上传本地分支到指定远程仓库
git push [remote] [branch]

# 强行推送当前分支到远程仓库，即使有冲突
git push remote --force

# 推送所有分支到远程仓库
git push [remote] --all
~~~

### git 撤销操作
~~~ sh
# 恢复暂存区指定文件到工作区
git chechout [file]

# 恢复某个commit指定文件到到暂存区
git checkout [commit] [file]

# 恢复暂存区所有文件到工作区
git checkout .

# 重置暂存区所有文件但。
# 保持与上一次commit一样但工作区不变
git reset [fiel]

# 重置暂存区与工作区
git reset --hard

# 充值当前分支指定的commit，同时重置暂存区，工作区不变
git reset [commit]
git reset [commit] --hard # 但同上工作区重置

# 重置当前head为指定commit但是工作区和暂存区不变
# 切换版本但暂存区和工作区不变
git reset --keep [commit]

# 回滚，重做某个提交，但不丢弃这个版本之后版本的休改
# 而是 创建一个新的提交
git revert [commit]

# 暂时将未提交的代码移除，稍后移入
git stash
git stash pop

# 创建一个可供发布的压缩包
git archive
~~~
