#!/usr/bin/env bash

cd /var/www/html

echo ">>> Waiting for database to be ready..."

# نستخدم loop بسيط يستنى الـ DB بدل ما يوقع الكونتينر
MAX_ATTEMPTS=20
SLEEP_SECONDS=3
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]
do
    # نجرب أي أمر بيكلم الداتابيز، هنا استخدمت db:show (Laravel 10+)
    php artisan db:show > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo ">>> Database is up! (attempt $ATTEMPT)"
        break
    fi

    echo "DB not ready yet (attempt $ATTEMPT/$MAX_ATTEMPTS). Retrying in ${SLEEP_SECONDS}s..."
    ATTEMPT=$((ATTEMPT+1))
    sleep $SLEEP_SECONDS
done

if [ $ATTEMPT -gt $MAX_ATTEMPTS ]; then
    echo "ERROR: Database is still not ready after $MAX_ATTEMPTS attempts. Exiting."
    exit 1
fi

echo ">>> Running migrations..."
php artisan migrate --force || { echo "Migration failed"; exit 1; }

echo ">>> Running seeders (if any)..."
php artisan db:seed --force || echo "Seeding failed or no seeders."

echo ">>> Starting php-fpm..."
exec php-fpm
