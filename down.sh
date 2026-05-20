#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "⏹️  Parando backend..."
docker compose -f "$SCRIPT_DIR/backend/docker-compose.yml" down

echo "⏹️  Parando frontend..."
docker compose -f "$SCRIPT_DIR/frontend/docker-compose.yml" down

echo "✅ Aplicação desligada com sucesso!"
