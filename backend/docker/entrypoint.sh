#!/usr/bin/env bash
set -e

cd /var/www/html

if [ ! -f .env ]; then
    echo "ℹ️ No .env found, seeding from docker/.env.example"
    cp docker/.env.example .env
fi

if [ ! -s .env ]; then
    echo "❌ .env file is empty or missing"
    exit 1
fi

if [ ! -d vendor ] || [ ! -f vendor/autoload.php ]; then
    echo "📦 Installing composer dependencies..."
    composer install --no-interaction --no-dev --prefer-dist --no-progress
fi

if ! grep -q "^APP_KEY=.*" .env || [ -z "$(grep '^APP_KEY=' .env | cut -d '=' -f2-)" ]; then
    echo "🔑 Generating APP_KEY..."
    php artisan key:generate --force
fi

echo "⏳ Waiting for database at ${DB_HOST:-db}:${DB_PORT:-3306}..."

until php -r "
    try {
        new PDO(
            'mysql:host=' . getenv('DB_HOST') . ';port=' . getenv('DB_PORT') . ';dbname=' . getenv('DB_DATABASE'),
            getenv('DB_USERNAME'),
            getenv('DB_PASSWORD')
        );
        echo \"Database is ready.\n\";
        exit(0);
    } catch (Exception $e) {
        fwrite(STDERR, 'Database not ready: ' . $e->getMessage() . PHP_EOL);
        exit(1);
    }
"; do
    echo "...still waiting"
    sleep 3
done

echo "✅ Database is reachable."

echo ">>> Running migrations..."
php artisan migrate --force || { echo '❌ Migration failed'; exit 1; }

echo ">>> Running seeders..."
php artisan db:seed --force || echo '⚠️ Seeding failed or no seeders.'

echo "✅ Migrations & seeders finished."

echo ">>> Starting php-fpm..."
exec php-fpm
