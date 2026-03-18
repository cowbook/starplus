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