#!/bin/bash
# ==========================================================
# 🗳️ Elections360 Auto Dev Launcher
# Backend: Laravel 10 | Frontend: React + TypeScript
# SQLite Mode – Redis Optional
# Clean Stable Version v3.0
# Author: Mr. Askar
# ==========================================================

set -e

# ==========================================================
# Cleanup on Exit
# ==========================================================
cleanup() {
  if [ "${CLEANED:-false}" = true ]; then return; fi
  CLEANED=true

  echo -e "\n🛑 Shutting down services..."

  # Kill child processes
  pkill -P $$ || true

  # Stop local Redis server if started
  if [ "${REDIS_LOCAL:-false}" = true ]; then
    redis-cli -p "$REDIS_PORT" shutdown >/dev/null 2>&1 || true
  fi

  # Stop Docker Redis container if started
  if [ "${REDIS_DOCKER:-false}" = true ]; then
    docker stop "$REDIS_CONTAINER" >/dev/null 2>&1 || true
    docker rm "$REDIS_CONTAINER" >/dev/null 2>&1 || true
  fi
}

trap 'cleanup; exit 1' INT TERM
trap cleanup EXIT

# ==========================================================
# Paths & Settings
# ==========================================================
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
REDIS_PORT=6379
REDIS_CONTAINER="e360-redis"

# ==========================================================
# Helper Functions
# ==========================================================
print_section() { echo -e "\n\e[1;36m$1\e[0m"; }

kill_port() {
  local port=$1
  if lsof -ti:$port >/dev/null 2>&1; then
    echo "🔴 Killing process on port $port..."
    kill -9 $(lsof -ti:$port) || true
  fi
}

check_command() {
  if command -v "$1" >/dev/null 2>&1; then
    echo "✅ $1 detected: $("$1" -v 2>/dev/null | head -n 1)"
    return 0
  else
    echo "⚠️ $1 missing."
    return 1
  fi
}

# ==========================================================
# Dependency Check
# ==========================================================
print_section "🧩 Checking Dependencies..."

check_command node || {
  echo "💡 Installing Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
}

check_command npm || echo "⚠️ npm missing!"
check_command composer || echo "⚠️ composer missing!"
HAS_REDIS=false
check_command redis-server && HAS_REDIS=true
HAS_DOCKER=false
check_command docker && HAS_DOCKER=true

# ==========================================================
# Kill stale ports
# ==========================================================
kill_port 8080
kill_port 8000

# ==========================================================
# Redis Start (Optional)
# ==========================================================
start_redis() {
  print_section "🧠 Checking Redis availability..."

  # If Redis already running → use it
  if lsof -ti:$REDIS_PORT >/dev/null 2>&1; then
    echo "🟢 Redis already running on port $REDIS_PORT"
    return
  fi

  # If redis-server exists → start local instance
  if [ "$HAS_REDIS" = true ]; then
    echo "⚡ Starting native Redis server..."
    redis-server --port "$REDIS_PORT" --daemonize yes
    REDIS_LOCAL=true
    return
  fi

  # If Docker exists → fallback to container
  if [ "$HAS_DOCKER" = true ]; then
    echo "🐳 Starting Redis via Docker..."

    # remove old container if exists
    docker rm -f "$REDIS_CONTAINER" >/dev/null 2>&1 || true

    if docker run -d --name "$REDIS_CONTAINER" -p "$REDIS_PORT":6379 redis:7-alpine >/dev/null; then
      REDIS_DOCKER=true
      echo "🟢 Docker Redis is running."
      return
    else
      echo "❌ Redis container failed to start. Skipping Redis."
      return
    fi
  fi

  echo "⚠️ Redis not available. App will run without queues."
}

start_redis

# ==========================================================
# React Frontend
# ==========================================================
print_section "🚀 Starting React Frontend (port 8080)"

if command -v npm >/dev/null 2>&1; then
  cd "$FRONTEND_DIR"
  [ ! -d node_modules ] && npm install
  npm run dev -- --host 0.0.0.0 --port 8080 &
else
  echo "⚠️ npm not available. Skipping frontend."
fi

# ==========================================================
# Laravel Backend
# ==========================================================
print_section "⚖️ Starting Laravel Backend (port 8000)"

cd "$BACKEND_DIR"

# install composer deps if needed
if [ ! -d vendor ]; then
  composer install
  [ ! -f .env ] && cp .env.example .env
  php artisan key:generate
fi

# Detect DB
DB_CONNECTION=$(grep '^DB_CONNECTION=' .env | cut -d '=' -f2)

if [ "$DB_CONNECTION" = "sqlite" ]; then
  echo "🗄 Using SQLite database"

  mkdir -p database
  DB_FILE="database/database.sqlite"
  [ ! -f "$DB_FILE" ] && touch "$DB_FILE"

  echo "🧩 Migrating + seeding SQLite..."
  php artisan migrate --force --seed || echo "⚠️ Migration failed."
else
  echo "🧩 DB is $DB_CONNECTION — skipping automatic migrations."
fi

# Start backend server
php artisan serve --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Queue worker (only if Redis available)
if [ "$HAS_REDIS" = true ] || [ "$HAS_DOCKER" = true ]; then
  print_section "🧵 Starting Queue Worker"
  php artisan queue:work --queue=default,notifications --sleep=1 --tries=3 &
  QUEUE_PID=$!
else
  echo "⚠️ Queue worker disabled — Redis not available."
fi

# ==========================================================
# Summary
# ==========================================================
print_section "✅ Elections360 Environment Ready!"
echo "🌐 Frontend: http://localhost:8080"
echo "⚖️ Backend:  http://localhost:8000"
echo "🧠 Redis:    optional on $REDIS_PORT"
echo "🔔 Queue PID: ${QUEUE_PID:-disabled}"
echo "🛑 Press CTRL+C to stop everything."

wait
