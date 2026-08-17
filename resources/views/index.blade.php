@extends('layouts.app')

@section('title', 'Início')
@section('description', 'Descubra o Japão: uma experiência 3D interativa, os motivos para conhecer o país e uma galeria com os destinos imperdíveis.')

@section('content')

    {{-- 1. Hero: experiência 3D interativa (bundle estático em public/japao-3d). --}}
    <section class="japao-3d-embed" aria-label="Experiência interativa sobre o Japão">
        <iframe
            src="/japao-3d/index.html"
            title="Bandeira 3D interativa do Japão"
            loading="eager"
            allowfullscreen
        ></iframe>
    </section>

    {{-- 2. Texto com animação ScrollReveal: por que conhecer o Japão. --}}
    {{-- overflow-hidden: a rotação inicial do ScrollReveal aumenta a caixa do
         texto e criaria rolagem horizontal no celular sem esse recorte. --}}
    <section id="por-que-japao" class="overflow-hidden px-6 py-24 sm:py-32" aria-labelledby="por-que-japao-titulo">
        {{-- Única seção centralizada da home: serve de respiro entre o hero e a
             galeria, ambos alinhados à esquerda. --}}
        <div class="mx-auto max-w-5xl text-center">
            {{-- Kicker no mesmo padrão do rodapé e do hero 3D: kanji + rótulo
                 curto em vermelho, precedido de uma régua fina. --}}
            <p class="flex items-center justify-center gap-4 text-[0.7rem] font-semibold tracking-[0.34em] text-japao-vermelho uppercase">
                <span class="h-px w-10 shrink-0 bg-japao-vermelho/50" aria-hidden="true"></span>
                <span><span aria-hidden="true">理由 · </span>Por que ir</span>
            </p>

            {{-- Antes este título era sr-only e a seção abria direto no
                 parágrafo. Agora ele aparece, ancora a seção e recebe a mesma
                 revelação palavra a palavra do texto logo abaixo.

                 O texto fica escrito aqui dentro de propósito: se o JS não
                 rodar, o título continua legível — a ilha React só substitui o
                 conteúdo por spans animados quando monta. --}}
            <h2 id="por-que-japao-titulo" class="mt-6 text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl md:text-6xl">
                <span
                    data-react="titulo-revelado"
                    {{-- @json precisa ficar numa linha só: quebrar o array faz o
                         parser do Blade encerrar o argumento cedo demais. --}}
                    {{-- Sem quebraApartirDe: o título agora ocupa uma linha só.
                         Em telas estreitas ele quebra naturalmente. --}}
                    data-props='@json(['texto' => 'Duas eras vivendo no mesmo país', 'destaqueApartirDe' => 3])'
                >Duas eras vivendo <span class="text-japao-vermelho">no mesmo país</span></span>
            </h2>

            {{-- Ilha React: o texto é revelado palavra a palavra conforme a rolagem. --}}
            <div data-react="motivos-japao" class="mt-10"></div>
        </div>
    </section>

    {{-- 3. Galeria de destinos (efeito hover expand / carrossel no celular). --}}
    <section id="destinos" class="px-0 py-20 sm:py-24" aria-labelledby="destinos-titulo">
        <div class="alinhado-hero mb-10 max-w-6xl">
            <p class="flex items-center gap-4 text-[0.7rem] font-semibold tracking-[0.34em] text-japao-vermelho uppercase">
                <span class="h-px w-10 shrink-0 bg-japao-vermelho/50" aria-hidden="true"></span>
                <span><span aria-hidden="true">目的地 · </span>Destinos</span>
            </p>
            <h2 id="destinos-titulo" class="mt-6 text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
                Seis lugares para <span class="text-japao-vermelho">começar</span>
            </h2>
            <p class="mt-5 max-w-2xl text-black/60">
                Passe o mouse ou toque em cada imagem para explorar. De castelos cercados de cerejeiras ao neon de
                Tóquio, cada destino conta uma parte diferente da história japonesa.
            </p>
        </div>

        <div data-react="galeria-destinos"></div>

        <div class="alinhado-hero mt-10 max-w-6xl">
            @include('partials.btn-flor', [
                'href' => '/planeje',
                'label' => 'Planeje a sua viagem',
            ])
        </div>
    </section>

@endsection
