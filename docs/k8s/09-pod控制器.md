# pod控制器


## 介绍
- 根据pod创建方式分为两类
  - 自主式pod: k8s直接创建出来的，pod删除后就不会重新创建
  - 控制器创建的pod: 可能会自动重新创建

::: tip pod控制器
- 管理pod的中间层
- 告诉pod控制器需要什么样的pod，由pod控制器维护pod使其满足要求
:::

- pod控制器由很多，每种由自己适用场景
  - ReplicationController: 原始的控制器，被废弃，ReplicaSet替代
  - ReplicaSet: 保证指定数量pod，支持pod数量变更，镜像版本变更
  - Deployment: 它控制ReplicaSet来控制pod,并支持滚动升级、版本回退
  - Horizontal Pod Autoscaler: HPA, 根据集群的负载，自动调整，削峰填谷
  - DaemonSet: 在集群的指定node上都运行一个副本，一般用于守护进程的任务
  - Job: 对应的pod完成任务就立即退出，只执行一次
  - CronJob: 创建的pod周期性执行
  - StatefulSet: 有状态应用、


## ReplicaSet RS
- 保证一定pod运行
- pod扩缩容
- 版本镜像升级
ReplicaSet资源清单文件
``` yml
apiVersion: v1
kind: ReplicaSet
metadata:
  name:
  namespace:
  labels:
    controller: rs
spec:
  replicas: 3 # 副本数量
  selector:
    matchLabels:
      app: nginx-pod
    matchExpressions:
      - {key: app, operator: In, values: [nginx-pod]}
  template:
    metadata:
      labels:
        app: nginx-pod
    spec:
      containers:
      - name: nginx
        image: nginx:1.17.1
        ports:
        - containerPort: 80
```
### ReplicaSet扩缩容
- 方法一：手动修改，vim该yaml
  ``` sh
  kubectl edit rs-name -n namespace  
  ```
- 方法二：命令
  ``` sh
  kubectl scale rs rs-name --replicas=2 -n namespace
  ```
### ReplicaSet升降机
- 方法一：手动修改，vim该yaml
  ``` sh
  kubectl edit rs-name -n namespace  
  ```
- 方法二：命令
  ``` sh
  kubectl set image rs rs-name nginx=nginx:1.17.1 -n namespace
  ```
### 删除ReplicaSet
- 级联删除，删除钱会设置 replicascler = 0, 等pod都被删除后，在删除rs
`kubectl delete rs rs-name -n namespace`
- 非级联删除，保留pod（不推荐）
`kubectl delete rs rs-name -n namespace --sascade=false`
- yaml直接删也(推荐)
`kubectl delete -f xxx.yaml`


## Deployment（Deploy）
- 为了更好解决服务编排
- 管理ReplicaSet间接管理pod
- 支持RS所有功能
- 支持发布的停止、继续
- 支持版本滚动更新、版本回退
- 创建的rs名字为 deploy名加随机串，
- pod 为 rs再加随机串
### Deploy的配置文件
``` yml
apiVersion: v1
kind: Deployment
metadata:
  name:
  namespace:
  labels:
    controller: rs
spec:
  replicas: 3 # 副本数量
  revisionHistoryLimit: 3 # 保留的历史版本，默认10
  paused: false # 暂停部署， 默认是false
  progressDeadlineSeconds: 600 # 部署超时时间，默认600
  strategy: # 策略
    type: RollingUpdate # 滚动更新
    rollingUpdate:
      maxSurge: 30% # 最大额外可存在的副本，可以%亦可以int
      maxUnavailable: 30$ # 最大不可用状态pod的最大值，百分比可以整数
  selector:
    matchLabels:
      app: nginx-pod
    matchExpressions:
      - {key: app, operator: In, values: [nginx-pod]}
  template:
    metadata:
      labels:
        app: nginx-pod
    spec:
      containers:
      - name: nginx
        image: nginx:1.17.1
        ports:
        - containerPort: 80
```
### Delopy扩缩容
- `kubectl scale deploy deploy-name --replicas=5 -n dev`
- `kubectl editdeploy deploy-name -n dev` 修改 replicas

### Deploy更新策略 strategy
- 重建更新 Recreate
  - 一次性删除所有版本的，再床创建所有新版本
- 滚动更新 RollingUpdate
  - 一次删除一部分，创建一部分，循环至都更新
``` yaml
strategy: 
  type: Recreate | RollingUpdate
  RollingUpdate:
    maxUnavilable: 先干掉的比例 默认25%
    maxSurge: 最大多少新的默认 25%
``` 

### Deploy版本回退
- 原理:
  - deploy更新是会创建新的rs,再讲pod迁移到新的rs下
  - 就得rs不删，那么版本回退就是迁移会之前的rs即可
- deploy支持升级过程中暂停、继续、及版本回退
- kubectl rollout: 版本升级相关功能支持下面选项
  - status: 显示升级状态
  - history: 显示升级历史记录
  - pause: 暂停升级过程
  - resume: 继续已经暂停的版本升级过程
  - restart: 重启版本升级过程
  - undo: 回滚到上一级版本（可以--to-revision回滚到指定版本）

- `Kubectl rollout status deploy deploy-name -n dev`
- `Kubectl rollout history deploy deploy-name -n dev`
- `Kubectl rollout undo deploy deploy-name --to-reversion=1 -n dev`
- `Kubectl get deployment,rs -n dev`

### 金丝雀发布
- deploy支持暂停和继续
- 什么事金丝雀发布
  - 发布的时候滚动更新时，一小部分后暂停，对新版本测试，没问题了继续
- 流程
  1. 更新和暂停一起执行 `kubectl set image deploy deploy-name nginx=nginx:1.17.1 -n dev && kubectl rollout pause deployment deploy-name -n dev`
  2. 测试
  3. 恢复发布 `kubectl rollout resume deploy deploy-name -n dev`

## Horizontal Pod Autoscaler (HPA控制器) 
- 我们可以手动执行kubeclt scale 来实现pod扩容
- 但是希望这个过程时自动化的，智能化的，省钱钱化的
- HPA 可以获取pod利用率，针对性的调整目标副本数
![20221015133742](https://sprintln-1256351233.cos.ap-shanghai.myqcloud.com/img/20221015133742.png)