#!/bin/bash

# Navigate to project root
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_ROOT"

# Check if Docker is available
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "🐳 Docker detected. Choose deployment method:"
    echo "1) Docker Compose (Recommended)"
    echo "2) Local Development"
    read -p "Enter choice (1 or 2): " choice
    
    if [ "$choice" = "1" ]; then
        echo "🐳 Starting with Docker Compose..."
        docker-compose down 2>/dev/null || true
        docker-compose up --build
        exit 0
    fi
fi

# Local development mode
echo "🔧 Starting in Local Development Mode..."

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
