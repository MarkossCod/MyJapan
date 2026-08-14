#!/bin/sh
set -e

# O Render define a porta em tempo de execução. O nginx não lê variáveis de
# ambiente sozinho, então geramos a configuração final aqui.
export PORT="${PORT:-10000}"
envsubst '${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# O disco do Render é efêmero: as pastas de cache/sessão podem não existir.
mkdir -p \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

chown -R www-data:www-data storage bootstrap/cache

# Caches gerados aqui (e não no build) porque dependem das variáveis de
# ambiente, que só existem quando o container sobe.
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "MyJapan pronto — nginx escutando na porta ${PORT}"

exec supervisord -c /etc/supervisord.conf
