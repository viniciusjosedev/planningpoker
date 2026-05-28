#!/bin/bash

set -e

OUTPUT_DIR=".tar-builds"
mkdir -p "$OUTPUT_DIR"

echo "Building backend image..."
docker build -t planningpoker-backend ./backend

echo "Building frontend image..."
docker build -t planningpoker-frontend -f ./frontend/Dockerfile.prod ./frontend

echo "Exporting backend image..."
docker save planningpoker-backend | gzip > "$OUTPUT_DIR/planningpoker-backend.tar.gz"

echo "Exporting frontend image..."
docker save planningpoker-frontend | gzip > "$OUTPUT_DIR/planningpoker-frontend.tar.gz"

echo "Done! Images saved to $OUTPUT_DIR/"
ls -lh "$OUTPUT_DIR"
