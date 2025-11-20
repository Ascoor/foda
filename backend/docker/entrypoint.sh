#!/usr/bin/env bash
set -e

cd /var/www/html

# تشغيل composer install لو محتاج
if [ ! -d vendor ]; then
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

# انتظر لقاعدة البيانات (اختياري لو عندك DB في كونتينر تاني)
# مثال بسيط، تقدر تحسنّه بـ wait-for-it أو غيره
# sleep 10

# شغّل التشيك على الداتا بيز
php artisan db:ensure-seeded

# شغّل php-fpm
exec php-fpm
