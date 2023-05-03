---
title: sftp vscode
tags:
    - vscode
    - fstp
    - 同步
---

# vscode 使用 fstp 与云端服务同步文件
- 需要下载 sftp 插件 
- `ctrl shift p` 打开菜单, 输入sftp, 生成  ./.vscode/sftp.json
修改sftp文件如下
```json
{
    "name": "同步文件",
    "host": "{{服务器ip}}",
    "protocol": "ftp",
    "port": {{服务器端口}},
    "username": "用户名",
    "password": "用户密码",
    "remotePath": "/home/work/codespace/tsp-backend",
    "ignore": [
        "**/.vscode/**",
        "**/.idea/**",
        "**/.git/**",
        "**/.DS_Store",
        "**/node_modules/**"
    ],
    "uploadOnSave": true,
    "useTempFile": false,
    "openSsh": false,
    "watcher": {
        "files": "*",
        "autoUpload": false,
        "autoDelete": false
    }
}

```
