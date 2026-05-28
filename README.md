# Planning Poker

Real-time Planning Poker app for agile estimations, powered by WebSocket communication.

## Stack

- **Backend:** Go + WebSocket (in-memory, no database)
- **Frontend:** React + TypeScript + Vite + Tailwind CSS

Rooms are stored in memory and automatically cleaned up after 7 days of inactivity.

## Getting Started

### Prerequisites

- Docker and Docker Compose installed

### Start the application

```bash
./up
```

The script checks if `.env` files exist. If not, it offers to create them from the `.env.example` files.

### Restart

```bash
./restart
```

### Stop

```bash
./down
```

### Running without Docker

If you prefer to run the services directly on your machine:

**Backend**

```bash
cd backend
cp .env.example .env
go mod tidy
go run main.go
```

The backend reads the `PORT` environment variable (defaults to `:9999` if not set). Make sure `.env` exists with at least:

```
PORT=":9999"
```

**Frontend**

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The frontend needs `VITE_WS_URL` pointing to the backend WebSocket endpoint. Make sure `.env` exists with at least:

```
VITE_WS_URL=ws://localhost:9999/ws
```

## Access

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:3333       |
| Backend  | ws://localhost:9999/ws      |

## Configuration

Copy the `.env.example` files to `.env` in each directory:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

## Docker Images

### Development vs Production

| Service   | Dev Dockerfile            | Production Dockerfile       | Port (container) |
|-----------|---------------------------|-----------------------------|------------------|
| Backend   | `backend/Dockerfile`      | `backend/Dockerfile`        | 8080 (or `PORT` env) |
| Frontend  | `frontend/Dockerfile`     | `frontend/Dockerfile.prod`  | 80 (nginx)       |

- **Development**: the frontend Dockerfile runs `npm run dev` (Vite dev server). The backend runs the Go binary directly.
- **Production**: the frontend `Dockerfile.prod` builds the static assets (`npm run build`) and serves them with nginx. The backend is the same image, but you pass environment variables at runtime.

### Environment Variables

**Backend:** The `.env` file is **NOT** copied into the image. Go reads variables from the container environment at runtime. When running locally, `env/variables.go` loads `.env` automatically, but inside the container you must pass them via `docker run --env` or `env_file` in compose.

**Frontend:** The `.env` **IS** needed during the build because Vite embeds `VITE_*` variables into the static files at build time. Make sure the `.env` is present in the `frontend/` folder before running `docker build -f Dockerfile.prod`.

### Building for distribution

Use the helper script to build and export both images as compressed `.tar.gz` files:

```bash
./build-images
```

This script:
1. Builds `planningpoker-backend` from `backend/Dockerfile`
2. Builds `planningpoker-frontend` from `frontend/Dockerfile.prod`
3. Saves both images into `.tar-builds/` as `.tar.gz`

The person receiving the images can load them with:

```bash
docker load -i .tar-builds/planningpoker-backend.tar.gz
docker load -i .tar-builds/planningpoker-frontend.tar.gz
```

### Running production images manually

Backend:
```bash
docker run -d --env PORT=:9999 -p 9999:9999 planningpoker-backend
```

Frontend:
```bash
docker run -d --name pp-frontend -p 3333:80 planningpoker-frontend
```

Stop and remove:
```bash
docker stop pp-frontend && docker rm pp-frontend
```
