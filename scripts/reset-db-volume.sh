#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME="foda"
VOLUME_NAME="${PROJECT_NAME}_db-data"

if ! docker volume inspect "$VOLUME_NAME" >/dev/null 2>&1; then
  echo "No volume named $VOLUME_NAME found; nothing to remove."
  exit 0
fi

echo "Removing Docker volume: $VOLUME_NAME"
docker volume rm "$VOLUME_NAME"

echo "Volume $VOLUME_NAME removed. Start the stack again with:\n  docker compose up --build"
