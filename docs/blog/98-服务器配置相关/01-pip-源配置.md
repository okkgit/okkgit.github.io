---
sidebar: auto
---

# pip源配置，python源

## 临时使用

```sh
pip install -i https://pypi.doubanio.com/simple/ xxx
```
```sh
pip install -i https://mirrors.aliyun.com/pypi/simple/ xxx
```
```sh
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple/ xxx
```
::: tip 由于存在信任源问题，临时方法可能不好用
:::
## 设置为默认，永久
- linux/mac 创建或修改$HOME/.pip/pip.conf文件
- windows 创建或修改$HOME/pip/pip.ini文件
```conf
[global]
index-url = http://pypi.douban.com/simple
[install]
trusted-host = pypi.douban.com
```