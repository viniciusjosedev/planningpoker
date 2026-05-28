#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🔄 Reiniciando backend..."
docker compose -f "$SCRIPT_DIR/backend/docker-compose.yml" restart

echo "🔄 Reiniciando frontend..."
docker compose -f "$SCRIPT_DIR/frontend/docker-compose.yml" restart

echo "✅ Aplicação reiniciada com sucesso!"
