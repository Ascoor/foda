#!/bin/bash
# ==========================================================
# 🗳️ Elections360 Auto Dev Launcher
# Backend: Laravel | Frontend: React + TypeScript
# No Docker / NoSQL Mode
# Author: Mr. Askar
# Version: v2.3 (Auto-run)
# ==========================================================

set -e

cleanup() {
  if [ "${CLEANUP_CALLED:-false}" = true ]; then
    return
  fi
  CLEANUP_CALLED=true

  echo -e "\n🛑 Shutting down managed services..."
  pkill -P $$ || true

  if [ "${REDIS_MANAGED_LOCAL:-false}" = true ]; then
    if command -v redis-cli &>/dev/null; then
      redis-cli -p "$REDIS_PORT" shutdown >/dev/null 2>&1 || true
    else
      pkill redis-server >/dev/null 2>&1 || true
    fi
  fi

  if [ "${REDIS_MANAGED_CONTAINER:-false}" = true ]; then
    docker stop "$REDIS_CONTAINER_NAME" >/dev/null 2>&1 || true
    docker rm "$REDIS_CONTAINER_NAME" >/dev/null 2>&1 || true
  fi
}

trap 'cleanup; exit 1' INT TERM
trap cleanup EXIT

# === Define paths ===
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend-new"
REDIS_PORT=6379
REDIS_CONTAINER_NAME="foda-dev-redis"

# === Helper Functions ===
print_section() { echo -e "\n\e[1;36m$1\e[0m"; }

kill_port() {
  local port=$1
  if lsof -t -i:$port >/dev/null 2>&1; then
    echo "🔴 Closing process on port $port..."
    kill -9 $(lsof -t -i:$port) || true
  fi
}

# === Check Dependencies ===
print_section "🧩 Checking Dependencies..."

check_command() {
  if ! command -v "$1" &>/dev/null; then
    echo "⚠️ $1 not found."
    return 1
  else
    echo "✅ $1 detected: $("$1" -v 2>/dev/null | head -n 1)"
  fi
}

check_command node || {
  echo "💡 Installing Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
}
check_command npm || echo "⚠️ npm missing — reinstall Node.js if needed."
check_command composer || echo "⚠️ composer missing — please install it manually."
if ! check_command redis-server; then
  echo "ℹ️ redis-server not available natively — will fallback to Docker if possible."
fi
if ! check_command docker; then
  echo "ℹ️ Docker not detected — ensure Redis is running manually if required."
fi

# === Kill old ports ===
kill_port 8080
kill_port 8000
# === Ensure Redis is running ===
start_redis() {
  if lsof -i:"$REDIS_PORT" >/dev/null 2>&1; then
    echo "🟢 Redis already active on port $REDIS_PORT."
    return
  fi

  if command -v redis-server &>/dev/null; then
    print_section "🧠 Starting local Redis (port $REDIS_PORT)"
    redis-server --port "$REDIS_PORT" --save "" --appendonly no --daemonize yes
    REDIS_MANAGED_LOCAL=true
  elif command -v docker &>/dev/null; then
    print_section "🐳 Launching Redis container (port $REDIS_PORT)"
    docker run -d --name "$REDIS_CONTAINER_NAME" -p "$REDIS_PORT":6379 redis:7-alpine >/dev/null
    REDIS_MANAGED_CONTAINER=true
  else
    echo "⚠️ Redis is required for broadcasting/queues but could not be started automatically."
    echo "   Please install redis-server or enable Docker, then re-run this script."
  fi
}

start_redis

# === Start Frontend ===
if command -v npm &>/dev/null; then
  print_section "🚀 Starting React Frontend (port 8080)"
  cd "$FRONTEND_DIR"
  if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
  fi
  echo "⚡ Running frontend dev server..."
  npm run dev -- --port 8080 &
else
  print_section "⚠️ npm not found — skipping frontend startup."
fi

# === Start Backend ===
print_section "⚖️ Starting Laravel Backend (port 8000)"
cd "$BACKEND_DIR"

if [ ! -d "vendor" ]; then
  echo "📦 Installing backend dependencies..."
  composer install
  [ ! -f ".env" ] && cp .env.example .env
  php artisan key:generate
fi

echo "🧩 NoSQL mode detected — skipping migrations."
php artisan serve --host=127.0.0.1 --port=8000 &
PHP_SERVER_PID=$!

print_section "🧵 Starting Laravel queue worker for broadcasts"
php artisan queue:work --queue=default,notifications --sleep=1 --tries=3 &
QUEUE_WORKER_PID=$!

# === Summary ===
print_section "✅ Elections360 Development Environment Ready!"
echo "🌐 Frontend: http://127.0.0.1:8080"
echo "⚖️ Backend:  http://127.0.0.1:8000"
echo "🧠 Redis:    localhost:$REDIS_PORT"
echo "🔔 Queue worker PID: $QUEUE_WORKER_PID"
echo "📊 Dashboard will load after both servers are up."
echo "🛑 Press CTRL+C to stop all processes."

wait
