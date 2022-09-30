

## Pod一般情况下声名周期
- pod创建过程
- 运行初始化容器过程 init container
- 运行主容器过程 main container
  - 容器启动后钩子 post start, 
  - 容器终止前钩子 pre stop
  - 容器存活性探测 livenss probe
  - 就绪性探测 readiness probe
- Pod 终止过程

## Pod 的 5种状态
- 挂起 Pending
  - apiserver创建完了pod资源对象，但未被调度完成，或出于下载镜像中
- 运行中 Running
  - pod 已经被调度到某节点，并且容器已经被kubelet创建
- Succeeded pod 中所有容器都已经成功终止并不会重启
- Failed 所有容器已经终止，至少一个失败，非0返回退出
- Unknow apiserver 无法正常获取pod状态信息，通常网络原因

## Pod创建过程
各个组件监听apiserver
1. 用户提交pod信息给apiserver
2. apiserver将pod信息存到etcd， 返回确认信息给客户端
3. apiserver反应etcd中pod的变化，其他组件watch跟踪变化
4. scheduler发现有新的pod要创建，为其分配主机并将结果更新值apiServer
5. node节点的kubelet发现新的pod,尝试调用docker,并返回apiServer
6. apiServer将收到pod信息存储到etcd

## Pod终止过程
1. 用户通知apiServer删除pod
2. apiserver中的pod对象信息随时间推移更新，宽限期间内（30s）,pod被视为dead
3. pod标记为 Terminating
4. kubelet 监听到pod对象装维Terminating， 启动pod关闭过程
5. 端点控制器，监听到pod对象关闭行为，删除所有匹配到此端点的service端点列表
6. 如果pod定义了preStop钩子，则表计为terminating后悔同步方式执行
7. pod对象中容器进程收到停止信号
8. 宽限期结束后，若pod中还存在进程，pod强制终止
9. kubelet请求apiserver将pod宽限时间置0，从而完成删除操作，pod对用户不可见

## 初始化容器过程
就是在pod的主容器之前要运行的容器， 主要容器的前置工作
1. 初始化容器运行时阻塞后面主容器的， 重启到成功为止
2. 初始化容器有多个，必须按照顺序一个个运行成功，
![20220928225621](https://sprintln-1256351233.cos.ap-shanghai.myqcloud.com/img/20220928225621.png)

### 初始化容器的应用场景
- 提供主容器中不具备的工具程序或自定义代码
- 初始化容器和应用有依赖关系需要串行
~~~ yaml
# 启动一个nginx服务，
# 在启动前执行任务来测试一下mysql 和 redis服务是否正常
apiVersion: v1
kind: pod
metadata: 
  name: pod-initcontainer
  namespace: dev
spec:
  containers:
  - name: main-container
    image: nginx:1.17.1
    ports:
    - name: nginx-port
      containerPort: 80
  initContainers:
  - name: test-mysql
    image: busybox:1.30
    command: ['sh', '-c', 'util ping xxx.xx.xx -c 1; do echo waiting for mysql...; sleep 2; done;']
  - name: test-redis
    image: busybox:1.30
    command: ['sh', '-c', 'util ping xxx.xx.xx -c 1; do echo waiting for redis...; sleep 2; done;']
~~~
