# MyJapan

Site de viagens para o Japão: uma experiência 3D interativa, os motivos para
conhecer o país e uma galeria com os destinos imperdíveis.

## Tecnologias

- **Laravel 12** com views em Blade
- **Tailwind CSS 4** via `@tailwindcss/vite`
- **React 18** montado como *ilhas* dentro do Blade (sem SPA)
- **Framer Motion** (menu curvo e galeria) e **GSAP ScrollTrigger** (texto revelado na rolagem)
- **Vite 8** para o build dos assets

## Como rodar

Pré-requisitos: PHP 8.3+, Composer e Node 20+.

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
```

Durante o desenvolvimento, com o Vite servindo os assets:

```bash
npm run dev
```

Em outro terminal:

```bash
php artisan serve
```

Para gerar os assets de produção:

```bash
npm run build
```

> `public/build/` não é versionado — rode `npm run build` no deploy.

## Ilhas de React no Blade

Os componentes React são montados por um atributo `data-react`. No Blade:

```blade
<div data-react="galeria-destinos"></div>
```

O mapeamento de nomes fica em `resources/js/app.jsx`. Props opcionais podem ser
passadas como JSON em `data-props`.

## Estrutura

```text
resources/
├── css/app.css                  # tema, embed 3D e botão de flores
├── js/
│   ├── app.jsx                  # monta as ilhas de React
│   ├── components/
│   │   ├── GaleriaDestinos.tsx  # dados da galeria
│   │   ├── MotivosJapao.jsx     # texto com ScrollReveal
│   │   └── ui/                  # componentes de base
│   └── lib/utils.ts             # helper cn()
└── views/
    ├── index.blade.php          # homepage
    ├── layouts/app.blade.php
    └── partials/

public/
├── japao-3d/                    # bundle estático da experiência 3D
└── images/galeria/              # fotos dos destinos
```

## Páginas

| Rota | Descrição |
| --- | --- |
| `/` | Homepage: hero 3D, texto de apresentação e galeria |
| `/planeje` | Planeje a sua viagem *(em construção)* |
| `/passagens` | Comprar Passagens *(em construção)* |
| `/quem-somos` | Quem somos *(em construção)* |

## Deploy no Render

O Render não tem runtime PHP nativo, então a aplicação sobe como container
(`Dockerfile` na raiz: nginx + php-fpm, com os assets compilados no build).

O site não usa banco de dados, então sessão, cache e fila ficam fora dele —
o disco do Render é efêmero e apagaria um SQLite a cada deploy.

1. No Render: **New → Blueprint**, aponte para este repositório. Ele lê o
   `render.yaml` e cria o serviço.
2. Gere a chave da aplicação localmente e copie o valor:

   ```bash
   php artisan key:generate --show
   ```

3. No painel do serviço, em **Environment**, defina:
   - `APP_KEY` — o valor gerado acima (começa com `base64:`)
   - `APP_URL` — a URL pública do serviço (ex.: `https://myjapan.onrender.com`)
4. Dispare o deploy. O build leva alguns minutos na primeira vez.

> No plano gratuito o serviço hiberna após ~15 min sem acesso, e o primeiro
> acesso seguinte pode levar cerca de um minuto para responder.

## Créditos

- Galeria baseada no **Skiper 52 — HoverExpand** ([Skiper UI](https://skiper-ui.com)),
  de [@gurvinder-singh02](https://gxuri.me). O uso da versão gratuita exige atribuição.
- Texto animado baseado no **ScrollReveal** do [React Bits](https://reactbits.dev).

## Licença

MIT — veja [LICENSE](LICENSE).
