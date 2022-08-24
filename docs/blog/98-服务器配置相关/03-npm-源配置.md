---
sidebar: auto
---

# npm,yarn淘宝源配置

## 查看当前源

```go
npm get registry 
```

## 配置淘宝源

```sh
npm config set registry http://registry.npm.taobao.org/
npm i -g yarn
yarn config set registry http://registry.npm.taobao.org/
```

::: tip 在Windows如果yarn无法运行
- 出现类似 `"...因为在此系统因为在此系统上禁止运行脚本。"` 的错误
- 使用管理员权限的powershell执行：
```powershell
set-ExecutionPolicy RemoteSigned
```
:::

## 恢复源来的源

```sh
npm config set registry https://registry.npmjs.org/
```

