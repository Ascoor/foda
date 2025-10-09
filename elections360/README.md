# Elections360 Monorepo

This repository contains the groundwork for the Elections360 platform, separating the Laravel API backend and the React + TypeScript frontend. The project is organised so that future features such as multi-face dashboards, live reports, and interactive maps can be developed independently while sharing common infrastructure.

## Structure

```
elections360/
├── backend/           # Laravel API (Laravel 11 ready)
├── frontend/          # React + TypeScript client (Vite + TailwindCSS)
├── .env               # Shared environment variables for local development
├── docker-compose.yml # Optional container orchestration
└── README.md
```

## Backend (Laravel API)

> **Note:** Composer installation is not available in the execution environment used for this scaffold. All Laravel specific files (vendor, caches, etc.) must be generated locally after cloning the repository.

1. Move into the backend folder and install dependencies:

   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   ```

2. Update `.env` with your database credentials (defaults match the docker-compose file).

3. Run migrations and seeders:

   ```bash
   php artisan migrate --seed
   ```

## Frontend (React + TypeScript)

1. Move into the frontend directory and install packages:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. Configure the API base url through the `VITE_API_URL` environment variable if needed.

## Docker

A basic docker-compose file is provided to orchestrate the Laravel application, React dev server, and MySQL database.

```bash
docker compose up --build
```

This will expose the API at `http://localhost:8000` and the frontend at `http://localhost:5173`.
