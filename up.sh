#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

check_env() {
  local dir="$1"
  local name="$2"

  if [ ! -f "$dir/.env" ]; then
    echo "⚠️  Arquivo .env não encontrado em $name/"
    read -p "Deseja criar .env a partir do .env.example? (y/n) " choice
    if [ "$choice" = "y" ] || [ "$choice" = "Y" ]; then
      cp "$dir/.env.example" "$dir/.env"
      echo "✅ .env criado em $name/ a partir do .env.example"
    else
      echo "❌ Abortando. Crie o arquivo $name/.env manualmente."
      exit 1
    fi
  fi
}

check_env "$SCRIPT_DIR/backend" "backend"
check_env "$SCRIPT_DIR/frontend" "frontend"

echo "🚀 Subindo backend..."
docker compose -f "$SCRIPT_DIR/backend/docker-compose.yml" up -d --build

echo "🚀 Subindo frontend..."
docker compose -f "$SCRIPT_DIR/frontend/docker-compose.yml" up -d --build

echo "✅ Aplicação iniciada com sucesso!"
