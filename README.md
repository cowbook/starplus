# Form 2603 - 客户调研应用

基于 Vue 3 + Node.js 的调研系统。
前端用于收集多页问卷数据，后端将提交结果存储到 MongoDB。

## 项目结构

- `client/`: Vue 3 前端
- `server/`: Express API 后端
- `docker-compose.yml`: 本地 MongoDB 运行配置

## 技术栈

- Node.js >= 22
- Vue 3 + Vue Router + Pinia
- Express
- MongoDB（通过 Docker 在本地运行容器）

## 本地 MongoDB（Docker）

1. 启动 Docker Desktop（或确保 Docker daemon 已运行）。
2. 启动本地 MongoDB：

```bash
cd /Volumes/T4/2026/job/starplus
docker compose up -d mongodb
```

3. 检查 MongoDB 容器状态：

```bash
docker compose ps
```

4. 需要时停止 MongoDB：

```bash
docker compose stop mongodb
```

5. 移除 MongoDB 容器（除非显式删除，否则数据卷会保留）：

```bash
docker compose down
```

## 后端环境变量

后端从 `server/.env` 读取 MongoDB 连接配置。

示例：

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB_NAME=starplus
ADMIN_KEY=change-this-admin-key
```

模板文件：

- `server/.env.example`

## 安装与运行

1. 安装依赖：

```bash
cd /Volumes/T4/2026/job/starplus/client && npm install
cd /Volumes/T4/2026/job/starplus/server && npm install
```

2. 启动后端：

```bash
cd /Volumes/T4/2026/job/starplus/server
npm start
```

后端监听 `http://localhost:3000`。

3. 启动前端：

```bash
cd /Volumes/T4/2026/job/starplus/client
npm run dev
```

前端运行在 `http://localhost:5173`。

## API 接口

所有接口都挂载在 `/api` 路径下。

### POST /api/submit

将一条问卷提交数据保存到 MongoDB。

请求体：任意 JSON 对象（表单数据）。

存储文档结构示例：

```json
{
   "...form fields": "...",
   "createdAt": "2026-03-18T12:34:56.789Z",
   "ip": "client ip"
}
```

响应示例：

```json
{
   "message": "Submission saved",
   "id": "mongodb_object_id"
}
```

### GET /api/submissions

读取提交历史（按时间倒序，最新在前）。

该接口仅管理员可访问。
请求头需携带：

```text
x-admin-key: your-admin-key
```

### POST /api/webhook

从仓库拉取最新代码。

### GET /api/download

已废弃接口，返回 HTTP 410。

## 反向代理说明

后端已启用 `trust proxy`，并按以下顺序读取客户端 IP：

1. `x-forwarded-for`（取首个 IP）
2. `x-real-ip`
3. Express socket IP 兜底

Nginx 请确保转发以下头：

```nginx
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Real-IP $remote_addr;
```

## 管理页面

管理页面地址：

```text
/admin
```

页面会要求输入 `server/.env` 中配置的 admin key。
验证通过后，会从 `/api/submissions` 读取提交数据。

## 故障排查

- 如果 `docker compose up` 报 Docker daemon 错误，请先启动 Docker Desktop。
- 如果后端连接 MongoDB 失败，请检查 `server/.env` 中的 `MONGODB_URI`。
- 如果 3000 端口被占用，请在 `npm start` 前先停止旧进程。

---

# Form 2603 - Customer Survey Application

Vue 3 + Node.js survey system.
Frontend collects multi-page survey data and backend stores submissions in MongoDB.

## Project Structure

- `client/`: Vue 3 frontend
- `server/`: Express API backend
- `docker-compose.yml`: local MongoDB runtime

## Tech Stack

- Node.js >= 22
- Vue 3 + Vue Router + Pinia
- Express
- MongoDB (local container by Docker)

## Local MongoDB (Docker)

1. Start Docker Desktop (or ensure Docker daemon is running).
2. Start local MongoDB:

```bash
cd /Volumes/T4/2026/job/starplus
docker compose up -d mongodb
```

3. Verify MongoDB container:

```bash
docker compose ps
```

4. Stop MongoDB when needed:

```bash
docker compose stop mongodb
```

5. Remove MongoDB container (data volume is preserved unless removed explicitly):

```bash
docker compose down
```

## Backend Environment

The backend reads MongoDB config from `server/.env`.

Example:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB_NAME=starplus
ADMIN_KEY=change-this-admin-key
```

Template file:

- `server/.env.example`

## Install and Run

1. Install dependencies:

```bash
cd /Volumes/T4/2026/job/starplus/client && npm install
cd /Volumes/T4/2026/job/starplus/server && npm install
```

2. Start backend:

```bash
cd /Volumes/T4/2026/job/starplus/server
npm start
```

Backend listens on `http://localhost:3000`.

3. Start frontend:

```bash
cd /Volumes/T4/2026/job/starplus/client
npm run dev
```

Frontend runs on `http://localhost:5173`.

## API Endpoints

All APIs are mounted under `/api`.

### POST /api/submit

Save one survey submission to MongoDB.

Request body: any JSON object (form data).

Stored document shape:

```json
{
   "...form fields": "...",
   "createdAt": "2026-03-18T12:34:56.789Z",
   "ip": "client ip"
}
```

Response example:

```json
{
   "message": "Submission saved",
   "id": "mongodb_object_id"
}
```

### GET /api/submissions

Read submission history (latest first).

This endpoint is admin-only.
Send request header:

```text
x-admin-key: your-admin-key
```

### POST /api/webhook

Pull latest code from repository.

### GET /api/download

Deprecated endpoint, returns HTTP 410.

## Reverse Proxy Notes

Backend enables `trust proxy` and reads IP in this order:

1. `x-forwarded-for` (first IP)
2. `x-real-ip`
3. Express socket IP fallback

For Nginx, ensure forwarding headers are set:

```nginx
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Real-IP $remote_addr;
```

## Admin Page

Open the admin page at:

```text
/admin
```

The page asks for the admin key defined in `server/.env`.
After a valid login, it reads submission data from `/api/submissions`.

## Troubleshooting

- If `docker compose up` fails with Docker daemon error, start Docker Desktop first.
- If backend fails to connect MongoDB, verify `MONGODB_URI` in `server/.env`.
- If port 3000 is in use, stop the old process before `npm start`.