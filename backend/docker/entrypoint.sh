#!/usr/bin/env bash
set -e

cd /var/www/html

echo "⏳ Waiting for database at db:3306..."
# انتظار بسيط لحد ما الـ DB تكون جاهزة
until php -r "
    try {
        new PDO('mysql:host=' . getenv('DB_HOST') . ';port=' . getenv('DB_PORT') . ';dbname=' . getenv('DB_DATABASE'),
                getenv('DB_USERNAME'),
                getenv('DB_PASSWORD'));
        exit(0);
    } catch (Exception \$e) {
        exit(1);
    }
"; do
    echo "...still waiting"
    sleep 3
done

echo "✅ Database is reachable."

# 👇 هنا نعرض خطوات الميجريشن و السييد بوضوح
echo ">>> Running migrations..."
php artisan migrate --force || { echo '❌ Migration failed'; exit 1; }

echo ">>> Running seeders..."
php artisan db:seed --force || echo '⚠️ Seeding failed or no seeders.'

echo "✅ Migrations & seeders finished."

echo ">>> Starting php-fpm..."
exec php-fpm
