##  流量负载组件 Service
- Service 四层路由


## Service原理
- pod作为程序的载体，可以通过ip访问，但ip不是固定的
- k8s 提供Service资源对象，同一个服务的pod聚合，提供统一入口
![20221018200518](https://sprintln-1256351233.cos.ap-shanghai.myqcloud.com/img/20221018200518.png)

- Service本质是概念，kube-proxy服务进程完成
- 每个node节点都运行kube-proxy服务进程
- api-server将servie信息写入 etcd
- kube-proxy监听Service变更
- **最新的Service信息转换成对象访问规则**

kube-proxy 支持三种工作模式
- userspace模式
  - kube-proy转发强求
  - 稳定效率低
- iptables
  - kube-proxy生成iptables， 访问直接根据iptables重定向
  - 效率比usespace高，不能灵活使用LB, **后端pod不可用不好重试**
- ipvs模式
  - 和iptables机构上类似， kubectl监控pod变化并创建响应的ipvs规则
  - 比iptables转发效率高，支持更多LB算法那
  - ipvs需要node宿主机安装ipvs内核模块（如果没有，k8s胡世勇iptables）
  - ![20221018202901](https://sprintln-1256351233.cos.ap-shanghai.myqcloud.com/img/20221018202901.png)

### 开启kube-proxy使用ipvs
- `kubectl edit cm kube-proxy -n kube-system`
  - 搜索mode, 修改 `""` 为 `"ipvs"`
- `kubectl delete pod -l k8s-app=kube-proxy -n kube-system`
- `ipvsadm -Ln` 查看ipvs

## Service资源清单文件
``` yml
apiVersion: v1
kind: Service
metadata: 
  name: service
  namespace: dev
spec:
  selector:  # 确定service代理哪些pod
    app: nginx
  type: # Servoce的访问方式
  clusterIP: # 虚拟服务的ip， 就是ServiceIP
  sessionAffinity: session亲和性，支持ClientIP， None, 为了实现同一个ip请求转发到同一个pod
  ports: 
    - protocol: TCP
      port: 3017 # service端口号
      targetPort: 5003 # pod端口号
      nodePort: 31122 # 主机端口号
```
- spec.type: 有四种类型的Service
  - ClusterIP, default, k8s系统自动分配的虚拟IP, 只能在集群内部访问
  - NodePort: 将Service通过指定Node上的端口暴露，集群外可达
  - LoadBlancer: 外接负载均衡实现负载分发，需要外部云环境支持
  - ExternalName: 把集群外部服务引入集群内部，直接使用

## Service 使用场景  环境准备
![20221018204421](https://sprintln-1256351233.cos.ap-shanghai.myqcloud.com/img/20221018204421.png)

``` yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pc-deployment
  namespace: dev
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx-pod
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
- 查看ip `kubectl get pods -n dev -o wide`
## ClusterIP
``` yml
apiVersion: v1
kind: Service
metadata:
  name: service-clusterip
  namespace: dev
spec:
  selector:
    app: nginx-pod
  clusterIP: 1.2.3.4 # service的ip地址，如果不设置，系统生成
  type: ClusterIP
  ports:
  - port: 80 # Service端口
    targetPort: # pod端口
```
- `kubectl get svc service-clusterip -n dev` 查看
- `kubectl describe svc service-clusterip -n dev` 详细查看
- `ipvsadm -Ln` 查看ipvs映射规则

### EndPoint
- k8s的一种资源对象， 存储在etcd中
- 用来记录一个service对应的所有pod的访问地址
- 根据service配置文件中selector描述产生的
- **实际服务的端点集合**
- `kubectl get endpoints -n dev`

### 负载均衡策略
- 如果不定义，则使用kube-proxy的策略，如随机、轮询
- 基于客户端地址的回话保持模式、来自同一个客户端分发到同一个pod `sessionAffinity：CLientIP`


## HeadLiness类型的Service
- 不希望使用Service提供的负载均衡功能，希望自己控制负载均衡
- k8s提供HeadLiness Service, 它不会分配ClusterIP,
- 只能通过service的域名查询

``` yml 
apiVersion: v1
kind: Service
metadata:
  name: service-headliness
  namespace: dev
spec:
  selectpr:
    app: nginx-pod
  clusterIP: None # 将clusterIP设置为None即可创建headliness Service
  type: ClusterIP
  port:
  - port: 80
    targetPort: 80
```

## NodePort 类型的 Service
- Service端口映射到Node的一个端口
- 通过 NodeIP:NodePort 访问service

``` yml 
apiVersion: v1
kind: Service
metadata:
  name: service-headliness
  namespace: dev
spec:
  selectpr:
    app: nginx-pod
  type: NodePort
  port:
  - port: 80
    nodePort: 30002 # 指定 node 的端口号， 默认取值 30000-32767 不指定随机
    targetPort: 80
```

## LoadBlancer类型的Service
- 和nodePort类似，
- 在集群外部做一个负载均衡设备
- ![20221018212545](https://sprintln-1256351233.cos.ap-shanghai.myqcloud.com/img/20221018212545.png)

## ExternalName类型的Service
- 用于引用集群外部服务，
- 在集群内部访问service可以访问到外部服务
``` yml 
apiversion: v1
kind: service
metadata:
  name: service-service-externalname
  namespace: dev
spec: type:
  type: ExternalName
  externalName: www.baidu.com
```