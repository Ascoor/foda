#!/bin/bash 

# ==========================================================
# 🗳️ Elections360 Unified Launcher
# Supports both Docker and Local Development environments
# Author: Mr. Askar
# Version: v1.6
# ==========================================================

set -e  # Exit immediately on error
trap 'echo -e "\n🛑 Process interrupted. Shutting down..."; exit 1' INT

# === Define paths ===
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

# === Helper Functions ===
print_section() {
  echo -e "\n\e[1;36m$1\e[0m"
}

kill_port() {
  local port=$1
  if lsof -t -i:$port >/dev/null 2>&1; then
    echo "🔴 Closing process on port $port..."
    kill -9 $(lsof -t -i:$port) || true
  fi
}

# === Docker Mode ===
if command -v docker &>/dev/null && command -v docker-compose &>/dev/null; then
  print_section "🐳 Docker detected. Choose deployment method:"
  echo "1) Docker Compose (Recommended)"
  echo "2) Local Development"
  read -p "Enter choice (1 or 2): " choice
  
  if [ "$choice" = "1" ]; then
    print_section "🐳 Starting with Docker Compose..."
    docker-compose down 2>/dev/null || true
    docker-compose up --build
    exit 0
  fi
fi

# === Local Development Mode ===
print_section "🔧 Starting in Local Development Mode..."

# Kill conflicting ports
kill_port 8080
kill_port 8000

# === Frontend ===
if command -v npm &>/dev/null; then
  print_section "🚀 Starting React Frontend (port 8080)"
  cd "$FRONTEND_DIR"
  if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
  fi
  npm run dev -- --port 8080 &
else
  print_section "⚠️ npm not found — skipping frontend startup."
  echo "💡 Install Node.js with the following commands:"
  echo "    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
  echo "    sudo apt-get install -y nodejs"
fi

# === Backend ===
print_section "⚖️ Starting Laravel Backend (port 8000)"
cd "$BACKEND_DIR"
if [ ! -d "vendor" ]; then
  echo "📦 Installing backend dependencies..."
  composer install
  cp .env.example .env 2>/dev/null || true
  php artisan key:generate
fi

# Prepare SQLite database for local development if configured
if grep -q "^DB_CONNECTION=sqlite" .env 2>/dev/null; then
  if [ ! -f "database/database.sqlite" ]; then
    echo "🆕 Creating SQLite database file..."
    touch database/database.sqlite
  fi
fi

# Ensure database connection before migration
DB_CONNECTION_OK=false
if php artisan migrate:status >/dev/null 2>&1; then
  DB_CONNECTION_OK=true
fi

if [ "$DB_CONNECTION_OK" = true ]; then
  echo "🗄️ Running pending migrations..."
  php artisan migrate --force
else
  echo "⚠️ Skipping migrations (database not reachable)."
fi

# Run Laravel server
php artisan serve --host=127.0.0.1 --port=8000 &

# === Summary Info ===
print_section "✅ Elections360 environment started successfully!"
echo "🌐 Frontend: http://127.0.0.1:8080"
echo "⚖️ Backend:  http://127.0.0.1:8000"
echo "📊 Dashboard available after both servers load completely."
echo "🛑 Press CTRL+C to stop all services."

# === Wait for both processes ===
wait
