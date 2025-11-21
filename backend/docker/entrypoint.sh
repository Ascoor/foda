#!/usr/bin/env bash
set -e

cd /var/www/html

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
    } catch (Exception \$e) {
        fwrite(STDERR, 'Database not ready: ' . \$e->getMessage() . PHP_EOL);
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
