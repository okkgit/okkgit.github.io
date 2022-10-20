## Ingress介绍
- 回顾Service
  - Servie对外暴露服务主要NodePort和LoadBlancer
  - NodePort会占用很多进群端口号
  - LB方式每个service需要一个LB,且需要集群外设备支持

- k8s提供了 Ingress 资源对象
  - 一个NodePort或者一个LB满足多个Service的需求

![20221018214118](https://sprintln-1256351233.cos.ap-shanghai.myqcloud.com/img/20221018214118.png)

- Ingress相当于一个 7 层负载均衡器
- k8s 对反向代理的一个抽象，工作原理类似于Nginx
- Ingress建设诸多规则，Ingress Controller通过监听配置转化成Nginx的方向代理配置，对外提供服务

### Ingress工作原理工作流程
- 用户编写Ingress规则，定义域名对应k8s集群哪个Service
- Ingress控制器动态干部职工Ingress服务变化，生成Nginx配置
- 将生成的Nginx配置写入到Nginx服务，动态更新
  ![20221019115128](https://sprintln-1256351233.cos.ap-shanghai.myqcloud.com/img/20221019115128.png)

## Ingress controller 软件安装
``` sh
mkdir ingress-controller && cd ingress-controller
wget https://githubusercontent.com/kubernetes/ingress-nginx/nginx-0.30.0/deploy/static/mandatory.yml
wget https://githubusercontent.com/kubernetes/ingress-nginx/nginx-0.30.0/deploy/static/provider/baremetal/service-nodeport.yaml

# 修改mandatory.yaml
# 将 quay.io/kubernets-ingress-controller/nginx-ingress-contoroller:0.30.0
# 为 quay-mirror.qiniu.com/kubernets-ingress-controller/nginx-ingress-contoroller:0.30.0

kubectl apply -f ./

kubectl get pod-n ingress-nginx
kubectl get svc -n ingress-nginx
```

## HTTP代理
### yaml 配置文件
``` yml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: ingress-http
  namespace: dev
spec:
  rules:
  - host: nginx.itheima.com
    http:
      paths:
      - path: /
        backend:
          serviceName: nginx-service
          servicePort: 80
  - host: tomcat.itheima.com
    http: 
      paths:
      - path: /
        backend:
          serviceName: tomcat-service
          servicePort: 8080
```
- 访问 spec.rules.host: 域名，则转发到对应的service,的对应端口
- `kubectl create -f xx.yml`
- `kubectl get ing ingress-http -n dev`
- `kubectl describe ing ingress-http -n dev`