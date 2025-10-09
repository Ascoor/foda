#!/bin/bash

# Navigate to project root
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_ROOT"

# Kill existing processes on ports 8080 and 8000
echo "🔴 Checking ports 8080 and 8000..."
kill -9 $(lsof -t -i:8080) 2>/dev/null || true
kill -9 $(lsof -t -i:8000) 2>/dev/null || true

# Start frontend
echo "🚀 Starting React frontend on port 8080..."
cd "$PROJECT_ROOT/frontend"
if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install
fi
npm run dev -- --port 8080 &

# Start backend
echo "⚖️ Starting Laravel backend on port 8000..."
cd "$PROJECT_ROOT/backend"
if [ ! -d "vendor" ]; then
  echo "Installing backend dependencies..."
  composer install
  cp .env.example .env 2>/dev/null || true
  php artisan key:generate
fi
php artisan serve --host=127.0.0.1 --port=8000 &

# Wait so both servers run in background
wait
