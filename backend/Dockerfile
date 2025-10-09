FROM php:8.2-fpm

RUN apt-get update \
    && apt-get install -y \ \
        git \
        unzip \
        libpq-dev \
        libzip-dev \
        zip \
    && docker-php-ext-install pdo pdo_mysql \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY composer.json ./
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
    && rm composer-setup.php \
    && composer install --prefer-dist --no-dev --no-scripts --no-progress || true

COPY . .

RUN composer dump-autoload --optimize || true

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
