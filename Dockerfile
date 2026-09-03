FROM php:8.4-fpm-alpine AS base

# System deps + PHP extensions
RUN apk add --no-cache \
        nginx \
        nodejs \
        npm \
        git \
        unzip \
        curl \
        libzip-dev \
        icu-dev \
        oniguruma-dev \
        libpng-dev \
        libjpeg-turbo-dev \
        freetype-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        mbstring \
        zip \
        intl \
        pcntl \
        bcmath \
        opcache \
        gd

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Install PHP deps
COPY composer.json composer.lock ./
RUN composer install --optimize-autoloader --no-dev --no-interaction --no-scripts --no-autoloader

# Install Node deps + build assets
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline

COPY . .

# Finish composer autoload + run scripts
RUN composer dump-autoload --optimize --no-dev

# Build frontend + Filament theme
RUN npm run build \
    && npx tailwindcss@3 \
        --input ./resources/css/filament/admin/theme.css \
        --output ./public/css/filament/admin/theme.css \
        --config ./resources/css/filament/admin/tailwind.config.js \
        --minify

# Laravel caches
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Fix storage permissions
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Nginx config
COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

CMD ["/bin/sh", "-c", "php-fpm -D && nginx -g 'daemon off;'"]
