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

# Sem APP_KEY o Laravel devolve 500 em toda requisição — o middleware de
# cookies precisa da chave para criptografar. Se ela não foi definida no
# painel do Render, geramos uma para o container não subir quebrado.
#
# A chave temporária é descartada a cada deploy, o que invalida as sessões
# antigas. Como o site não tem login isso não afeta o visitante, mas o certo
# é definir APP_KEY no painel (`php artisan key:generate --show`).
if [ -z "${APP_KEY}" ]; then
    echo "AVISO: APP_KEY não definida — gerando uma chave temporária." >&2
    echo "       Defina APP_KEY nas variáveis de ambiente do Render." >&2
    APP_KEY="$(php artisan key:generate --show)"
    export APP_KEY
fi

# Caches gerados aqui (e não no build) porque dependem das variáveis de
# ambiente, que só existem quando o container sobe. O clear remove qualquer
# cache que tenha vindo na imagem com valores de desenvolvimento.
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "MyJapan pronto — nginx escutando na porta ${PORT}"

exec supervisord -c /etc/supervisord.conf
