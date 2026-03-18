# Starplus 服务守护方案（Node API + 本地 MongoDB）

目标：

- Node API 继续由 systemd 托管
- 本地 MongoDB 改为 Docker 容器运行
- 后续升级 Node 时无需改 service 文件
- 服务启动时明确依赖 Docker 和本地数据库环境

## 0. 先启动本地 MongoDB

数据库切换为本地 MongoDB 后，服务器上的启动方式需要补一层：

- Node 服务本身仍然是 `node server.js`
- 但在启动 Node 前，要先确保 Docker 和 MongoDB 容器已经运行

项目根目录新增了 `docker-compose.yml`，推荐直接使用：

```bash
cd /root/starplus/starplus
docker compose up -d mongodb
docker compose ps
```

建议确认容器名为 `starplus-mongodb`，并且状态为 `Up`。

另外，需要在 `server/.env` 中准备本地数据库配置：

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB_NAME=starplus
ADMIN_KEY=change-this-admin-key
```

## 1. 创建 systemd 服务文件

文件路径：`/etc/systemd/system/starplus.service`

```ini
[Unit]
Description=Starplus Node API (nvm)
After=network.target
After=docker.service
Requires=docker.service

[Service]
Type=simple
WorkingDirectory=/root/starplus/starplus/server

# 启动前先拉起本地 MongoDB，并等待 27017 端口就绪
ExecStartPre=/root/starplus/starplus/server/ensure-mongodb.sh

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

说明：

- `ExecStartPre` 会先执行 `server/ensure-mongodb.sh`
- 它会自动执行 `docker compose up -d mongodb`
- 并等待 `127.0.0.1:27017` 就绪后，再启动 Node API

如果服务器重启后 Docker 已配置为自动启动，且 `docker-compose.yml` 中容器设置了 `restart: unless-stopped`，MongoDB 会跟随 Docker 自动恢复

## 3. 查看实时日志

```bash
sudo journalctl -u starplus -f
```

MongoDB 容器日志：

```bash
cd /root/starplus/starplus
docker compose logs -f mongodb
```

查看 MongoDB 是否正常：

```bash
docker ps
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

## 5. 常用运维命令

启动 MongoDB：

```bash
cd /root/starplus/starplus
docker compose up -d mongodb
```

也可以单独测试预启动脚本：

```bash
/root/starplus/starplus/server/ensure-mongodb.sh
```

停止 MongoDB：

```bash
cd /root/starplus/starplus
docker compose stop mongodb
```

重启 Node API：

```bash
sudo systemctl restart starplus
```

查看提交接口是否在线：

```bash
curl http://127.0.0.1:3000/api/submissions -H 'x-admin-key: change-this-admin-key'
```

注意：如果返回 `Unauthorized`，说明服务在线，但管理员口令不对；如果连接失败，优先检查 MongoDB 容器和 Node 服务状态。
