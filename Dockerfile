# syntax=docker/dockerfile:1
#
# Imagem de produção do MyJapan.
#
# O Render não tem runtime PHP nativo, então a aplicação sobe como container.
# São três estágios para a imagem final não carregar Node nem Composer.

# ---------------------------------------------------------------------------
# 1. Assets do front-end (Vite + Tailwind + React)
# ---------------------------------------------------------------------------
FROM node:20-alpine AS assets

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY vite.config.js tsconfig.json ./
COPY resources ./resources

# O laravel-vite-plugin escreve a saída em public/build; aqui a pasta ainda
# não existe porque só copiamos o necessário para compilar os assets.
RUN mkdir -p public && npm run build

# ---------------------------------------------------------------------------
# 2. Dependências PHP
# ---------------------------------------------------------------------------
# Roda no mesmo PHP do runtime de propósito: a imagem `composer:2` pode vir
# com outra versão de PHP e resolver as dependências para ela.
FROM php:8.3-cli-alpine AS vendor

RUN apk add --no-cache git unzip
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --prefer-dist

# ---------------------------------------------------------------------------
# 3. Runtime: nginx + php-fpm
# ---------------------------------------------------------------------------
FROM php:8.3-fpm-alpine AS runtime

# gettext traz o envsubst, usado para injetar a porta do Render no nginx.
RUN apk add --no-cache nginx supervisor gettext

# opcache deixa a aplicação bem mais rápida em produção.
RUN docker-php-ext-install opcache

COPY docker/php.ini /usr/local/etc/php/conf.d/99-myjapan.ini
COPY docker/php-fpm.conf /usr/local/etc/php-fpm.d/zz-myjapan.conf
COPY docker/nginx.conf.template /etc/nginx/nginx.conf.template
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /var/www/html

COPY --from=vendor /app /var/www/html
COPY --from=assets /app/public/build /var/www/html/public/build

RUN mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

# Padrões de produção embutidos na imagem.
#
# Sem eles, o Laravel cai nos defaults do config/*.php — que são
# SESSION_DRIVER=database e CACHE_STORE=database — e tenta abrir um banco que
# não existe no Render, devolvendo 500 em toda requisição. Qualquer variável
# definida no painel do Render sobrescreve o que está aqui.
ENV APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr \
    LOG_LEVEL=error \
    SESSION_DRIVER=cookie \
    CACHE_STORE=file \
    QUEUE_CONNECTION=sync \
    FILESYSTEM_DISK=local \
    DB_CONNECTION=sqlite

# Informativo: o Render define a porta real via variável PORT.
EXPOSE 10000

ENTRYPOINT ["entrypoint.sh"]
