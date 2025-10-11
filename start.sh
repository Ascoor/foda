#!/bin/bash
# ==========================================================
# 🗳️ Elections360 Auto Dev Launcher
# Backend: Laravel | Frontend: React + TypeScript
# No Docker / NoSQL Mode
# Author: Mr. Askar
# Version: v2.3 (Auto-run)
# ==========================================================

set -e
trap 'echo -e "\n🛑 Process interrupted. Shutting down..."; pkill -P $$; exit 1' INT

# === Define paths ===
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

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

# === Kill old ports ===
kill_port 8080
kill_port 8000

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

# === Summary ===
print_section "✅ Elections360 Development Environment Ready!"
echo "🌐 Frontend: http://127.0.0.1:8080"
echo "⚖️ Backend:  http://127.0.0.1:8000"
echo "📊 Dashboard will load after both servers are up."
echo "🛑 Press CTRL+C to stop all processes."

wait
