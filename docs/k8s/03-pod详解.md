# pod详解

## pod 相关概念
- 每个pod中包含一个或多个容器
- pod 中包含
  - 根容器 Pause 
    - 根据它健康状态，判断健康中台
    - 根容器设置IP(eg. 192.168.1.1),共享该ip，实现pod内部网络通信
  - 用户容器
    - 用户程序所在的容器可多可少

## pod的定义， 资源清单， yaml配置
- 使用如下命令查看可以的配置项
  - `kubectl explain pod` 查看一级资源
  - `kubectl explain pod.metadata` 查看二级资源

``` yaml
apiVersion: v1
kind: Pod
metadata:
  name: string
  namespace: string
  labels:
    - name: string
spec:
  containers:
  - name: string
    image: string
    imagePullPolicy: [Always|Never|IfNotPressent] # 获取镜像策略
    command: [string] # 容器启动命令，不指定则容器打包时候的命令
    args: [string] # 容器命令参数列表
    workingDir: string # 容器工作目录
    volumeMounts: # 挂载到容器内部的存储卷设置
    - name: string # pod定义共享存储卷的名称， volumes[]部分定义的卷名
      mountPath: string # 在容器内的挂载的绝对路径
      readOnly: boolern
    ports: 暴露端口号列表
    - name: string # 端口号名称
      containerPort: int # 容器需要监听的端口号
      hostPort: int # 容器所在主机需要监听的端口号， 需与默认 Container相同
      protocol: string # 端口协议 TCP/UDP 默认TCP
    env: 
      - name: string
        value: string
    resources: # 资源限制和请求的设置
      limits: # 资源限制
        cpu: string # cpu限制，将用于 docker run --cpu-share参数
        memory: string # 内存限制 Mib/Gib 用于 docker run --memory
      requests: # 资源请求
        cpu: string # 启动容器时初始可用数量
        memory: string # 内存请求，容器的初始可用数量
    lifecycle: # 声名周期钩子
      postStart: # 容器启动后立刻执行，执行失败则重启策略
      preStop: # 容器终止前执行，结果如何都会终止
    livenessProbe: # 对容器健康检查的设置，无响应几次后自动重启
      exec: # 对容器内检查方法设置为exec方式
        command: [string] # 需要指定exec的命令或脚本
      httpGet:
        path: string
        port: number
        host: string
        scheme: string
        HttpHeaders:
        - name: string
          value: string
      tcpSocket: 
        port: number
      initialDelaySeconds: 0 # 容器启动后首次探测时间
      timeoutSeconds: 1 # 响应超时时间
      periodSeconds: 10 # 周期探测时间
      successThreshold: 0
      failureThreshold: 0
      securityContext:
        privileged: false
  restartPolicy: [Always|Never|OnFailure] # 容器重启策略
  nodeName: <string> # 通过nodename将该pod指定到名称为node的节点上
  nodeSelector: object # node选择器
  imagePullSecrets: # pull镜像使用的secret名称。以key:secretkey格式指定
  - name: string
  hostNetwork: false # 使用主机网络模式，默认false
  volumes:
  - name: string
    emptyDir: {} # 类型为emptyDir的存储卷，与Pod同周期的的临时目录
    hostPath: string
    path: string # pod所在宿主机的目录
    secret:
      scretbane: string
      items:
      - key: string
        path: string
    configMap:
      name: string
      items:
      - key: string
        path: string 
```

## pod配置
- 一级属性
    - apiVersion  api版本 kubectl api-versions
    - kind   资源类型可以使用 kubectl api-resources 获取
    - metadata  资源标识和说明， 
    - spec   各种资源的详细配置
    - status , k8s自己生成

### sepc参数
- containers: 容器列表定义容器的详细信息
  - name
  - image 镜像名称（镜像时根据句集群配置拉去过来的）
  - imagePullPolicy 镜像拉去策略， 默认值根据image的标签相关。image:latest则always, 否则ifNotPresent
  - command
  - args
  - args
  - env
  - ports
  - resources
- nodeName: 选择node
- nodeSelector： node选择器
- hostNetwork: 使用主计算机网络   
- volumes: 存储卷
- restartPolicy 重启策略

### command && args
::: tip 关于 command 和 args
1. 如果command 和 args 都没有写，使用dockerfile的配置
2. 如果command写了args没写那么dockerfile对应配置将忽略
3. 如果command没写args写了， 那么dockerfile中Entrypoint命令会执行，并使用args
4. 如果command和args都写了，dockerfile的配置忽略， 执行command并追加args参数
:::

### 进入容器
`kubectl exec pod-name -n dev -c busybox -it /bin/sh`
- 如果pod只有一个用户容器时候可以省略 -c ， 指定容器名字

## 容器暴露端口 ports
`kubectl explain pod.spec.containers.ports`
- name 给端口起个名， pod内唯一性
- containerPort:  容器的端口
- hostPort： 主机上端口， **一般不设置**， 设置的话容易出现端口冲突问题
- hostIP: 外部端口绑定主机ip, **一般省略**
- protocol: 端口协议 TCP/UDP/SCTP, 一般使用默认值 TCP

## 容器资源限制 内存 CPU
- containers 容器的 resources字段
- limits：限制容器使用最大资源， 超过limit时会被干掉，然后重启
- requests: 容器设置最小资源，如果环境资源不足这个参数，容器无法启动
  - cpu: "2"   