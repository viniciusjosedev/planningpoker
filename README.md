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
./up.sh
```

The script checks if `.env` files exist. If not, it offers to create them from the `.env.example` files.

### Restart

```bash
./restart.sh
```

### Stop

```bash
./down.sh
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
