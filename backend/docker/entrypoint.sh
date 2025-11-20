#!/usr/bin/env bash
set -e

cd /var/www/html

# تشغيل composer install لو محتاج
if [ ! -d vendor ]; then
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-3306}

echo "⏳ Waiting for database at ${DB_HOST}:${DB_PORT}..."
for i in {1..30}; do
    if php -r "try { new PDO('mysql:host=' . getenv('DB_HOST') . ';port=' . getenv('DB_PORT'), getenv('DB_USERNAME'), getenv('DB_PASSWORD')); exit(0); } catch (Exception \$e) { exit(1); }"; then
        echo "✅ Database is reachable."
        break
    fi

    echo "...still waiting (${i}/30)"
    sleep 2
done

# Final check to ensure DB is reachable before continuing
php -r "new PDO('mysql:host=' . getenv('DB_HOST') . ';port=' . getenv('DB_PORT'), getenv('DB_USERNAME'), getenv('DB_PASSWORD'));" \
  || { echo "❌ Database is not reachable after waiting. Exiting."; exit 1; }

# شغّل التشيك على الداتا بيز
php artisan db:ensure-seeded

# شغّل php-fpm
exec php-fpm
