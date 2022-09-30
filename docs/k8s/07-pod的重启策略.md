## Pod重启策略
- always：
  - 出问题就重启， 默认值
- OnFailure:
  - 容器终止运行，且退出码不为0重启
- Never:
  - 无论如何都不重启

pod重启有一个阶梯性的延迟时长 0s, 10s, 20s, 40s ~~ 300s, 最大300s

## 配置

~~~ yaml
spec:
  containers:
  restartPolicy: Never # Always OnFailure
~~~