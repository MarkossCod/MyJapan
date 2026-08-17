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

# O GitHub limita downloads anônimos e responde 429/504 em horário de pico,
# o que derrubava o build. Menos conexões simultâneas reduzem a chance de
# levar rate limit.
ENV COMPOSER_MAX_PARALLEL_HTTP=6

# Só os manifestos primeiro: enquanto as dependências não mudarem, o Docker
# reaproveita esta camada e o deploy não baixa nada do GitHub.
COPY composer.json composer.lock ./

# --prefer-install=auto sobrescreve o `preferred-install: dist` do
# composer.json e libera o fallback para clone via git quando o zip falha
# (era o "Source fallback is disabled" do erro).
#
# --no-scripts/--no-autoloader porque o código da aplicação ainda não foi
# copiado; o autoload sai no passo seguinte.
#
# O laço tenta de novo, com espera crescente, antes de derrubar o build.
RUN for i in 1 2 3 4 5; do \
        composer install \
            --no-dev \
            --no-scripts \
            --no-autoloader \
            --no-interaction \
            --prefer-install=auto \
        && exit 0; \
        echo ">> tentativa $i falhou (provavel rate limit do GitHub); aguardando $((i * 20))s"; \
        sleep $((i * 20)); \
    done; \
    echo ">> composer install falhou depois de 5 tentativas"; \
    exit 1

COPY . .

RUN composer dump-autoload --no-dev --optimize --no-interaction

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
