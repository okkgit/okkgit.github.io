## pod调度

- 默认情况pod在哪个node运行是由scheduler组件算出来的

### 四种调度方式
- 自动调度：完全由scheduler决定
- 定向调度：NodeName NodeSelector
- 亲和性调度: NodeAffinity、PodAffinity、PodAntiAffinity
- 污点（容忍）调度: Taints、Toleration
  - pod能够容忍node有缺点

## 定向调度
- 强制性，如果没有合适的node节点，pod不会成功运行

### NodeName
- 跳过了scheduler调度逻辑
- pod和node一对一
~~~ yml
spec:
  containers:
    ...
  nodeName: node1 # node节点的名字
~~~
### NodeSelector
- 将pod调度到指定标签的node节点
- k8s的 label-selector机制实现
- pod创建之前scheduler会使用MatchNodeSelector调度策略进行label匹配
- 也是强制
~~~ yml
spec:
  nodeSelector:
    nodeenv: pro  # 通过标签选择
~~~

## 亲和性度调度 优先级
- nodeAffinity: node亲和性
  - node为目标，解决pod调度到那些node的问题
- podAffinity: pod亲和性
  - 以pod为目标，解决pod和pod部署在同一个拓扑结构中
- podAntiAffinity: 反pod亲和性
  - pod为目标，某些pod尽可能不部署在一个拓扑结构

::: tip 亲和性和反亲和性应用场景
- 亲和性
  - 两个频繁交互的应用，有必要让两个pod部署的更靠近（比如同一个node上），这样可以减少网络性能消耗
:::