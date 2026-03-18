# Starplus 服务守护方案（nvm 无感升级版）

目标：避免把 Node 版本号硬编码到 `ExecStart`，后续升级 Node 时无需改 service 文件。

## 1. 创建 systemd 服务文件

文件路径：`/etc/systemd/system/starplus.service`

```ini
[Unit]
Description=Starplus Node API (nvm)
After=network.target

[Service]
Type=simple
WorkingDirectory=/root/starplus/starplus/server

# 通过 bash -lc 加载 nvm 环境，再选择 Node 版本并启动
ExecStart=/usr/bin/bash -lc 'source /root/.nvm/nvm.sh && nvm use 22 && node /root/starplus/starplus/server/server.js'

Restart=always
RestartSec=3

Environment=NODE_ENV=production
Environment=PORT=3000

StandardOutput=journal
StandardError=journal
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
```

## 2. 重载并启动服务

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now starplus
sudo systemctl status starplus
```

## 3. 查看实时日志

```bash
sudo journalctl -u starplus -f
```

## 4. 升级 Node 后的操作

如果使用 `nvm alias default` 或继续使用 `nvm use 22`（同主版本），一般不需要改 service 文件。

```bash
sudo systemctl restart starplus
```

若改为其他主版本（例如 24），只需修改 `ExecStart` 中的 `nvm use 22` 为 `nvm use 24`，然后执行：

```bash
sudo systemctl daemon-reload
sudo systemctl restart starplus
```
