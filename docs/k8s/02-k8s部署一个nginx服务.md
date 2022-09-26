
# 几个重要的资源

## Namespace ns
- 边界、组
- 用于实现多套环境的资源隔离， 或者多租户的资源隔离
- pod放在不同的ns内进行隔离，形成租的概念
- 通过k8s授权机制
- k8s配置资源配额机制

~~~ sh
kubectl get ns
kubectl create ns dev
kubectl delete ns dev
kubectl get pod -n dev
kubectl describe ns default
~~~

~~~ yaml 
apiVersion: v1
kind: Namespace
metadate:
  name: dev
~~~
- `kubectl create -f ns-yaml.yaml`
- `kubectl delete -f ns-yaml.yaml`

默认存在4个 ns
- default 未指定ns
- kube-node-lease 集群节点之间心跳维护
- kube-public 可以被所有人访问，包括未认证用户
- kube-system 所有k8s系统创建的资源

## Pod
- Pod k8s 集群管理的最小单元， 运行必须要部署在容器里面，容器在pod里面
- 一个pod里面有1个获多个容器
- k8s 集群的组件也是以pod的形式运行的 `kubectl get pod -n kube-system`
- 创建
  - `kubectl run nginx --image=nginx:1.17.1 --port 80 -n dev`
- 查看
  - `kubectl get pod -n dev -o wide`
  - `kubectl describe pod pod-name -n dev` 一般排错的时候使用，看Events
- pod访问
  - `kubectl get pod -n dev -o wide` 获取ip和端口号访问
- 删除
  - `kubectl delete pod pod-name -n dev` 
    - 删除成功吗？删除但是会创建一个（）， 控制器 run 命令创建会使用deployment控制器（这个控制器发现pod被删了会立刻创建出来一个）
    - 所以要删除控制器才能真正的删除
      - `kubectl delete deployment pod-name`

## Label
一种标识选择机制
- 键值对的形式附加到资源上， Node, Pod, Service等
- 资源与标签关系时多对多
- 通常在资源定义的时候确定，也可以新增删除
- 多维度分组，灵活方便资源分配、调度、配置、部署等工作

- 创建标签
  - `kubectl label pod nginx-pod version=1.0 -n dev`
- 查看标签
  - `kubectl get pod nginx-pod --show-labels -n dev`
- 修改标签
  - `kubectl label pod nginx-pod version=2.0 -d dev --overwrite` # 覆盖字段级别的更新
- 筛选标签
  - `kubectl get pods -n dev -l version=2.0`
  - `kubectl get pods -n dev -l version in (2.0, 1.0)`
- 删除标签
  - `kubectl label pods pod-name -n dev version-`, 减号


### Label Selector
- 基于等式 name = salve / name != salve
- 基于集合 name in (master, slave), name not in (master, slave)


## Deployment deploy
- k8s中pod最小单元，但是很少直接控制pod, 一般都是通过pod控制器
- 去报pod符合预期状态运行
- Deployment是控制器的一种，它会在资源出现故障会尝试重启pod
- deployment控制器和pod关联是通过label实现的

- 创建
  - `kubectl run nginx --image=nginx:1.17.1 --port=80 --replicas=3 -n dev`
- 删除
  - `kubectl delete deploy nginx -n dev`


~~~ yaml
apiVersion: v1
kind: Deployment
metadata:
  name: nginx
  namespace: dev
spec:
  replicas: 3
  selector: 
    matchLabels: # 通过标签跟pod建立关系
      run: nginx
  # pod模板
  template:
    metadata:
      labels:
        run: nginx
    spec:
      containers:
      - image: nginx:1.17.1
        mame: nginx
        ports:
        - cpmtaomerPort: 80
          protocol: TCP
~~~


## Service svc
- 每个pod都会分配一个单独的pod IP
  - pod ip 会随着pod的重建改变
  - pod ip 是集群内的虚拟ip, 外部无法访问
- service 来解决这个问题
- service 就是一组同类pod对外的访问接口
- 借助servie可以方便的实现 服务发现 和 负载均衡
- service 也是根据label选择器来访问对应pod

- 创建、暴露 service (通过deploy指定对应的pod)
  - `kubectl expose deploy nginx --name=svc-nginx1 --type=ClusterIP --port=80 --target-port=80 -n dev`
  - type=ClusterIP 只能集群内部访问
  - type=NodePort 创建外部可以访问的Service
- 删除
  - `kubectl delete svc svc-name -n dev`

~~~ yaml
apiVersion: v1
kind: Service
metadata:
  name: svc-nginx
  namespace: dev
spec:
  clusterIP: 10.10.10.10 # 不写的话自动分配
  ports:
  - port: 80
    protocol: TCP
    targetPort: 80
  selector:
    run: nginx
  type: ClusterIP
~~~