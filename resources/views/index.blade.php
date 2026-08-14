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
        <div class="mx-auto max-w-4xl">
            <p class="text-xs tracking-[0.3em] text-black/50 uppercase">Por que ir</p>
            <h2 id="por-que-japao-titulo" class="sr-only">Por que conhecer o Japão</h2>

            {{-- Ilha React: o texto é revelado palavra a palavra conforme a rolagem. --}}
            <div data-react="motivos-japao" class="mt-6"></div>
        </div>
    </section>

    {{-- 3. Galeria de destinos (efeito hover expand / carrossel no celular). --}}
    <section id="destinos" class="px-0 py-20 sm:py-24" aria-labelledby="destinos-titulo">
        <div class="mx-auto mb-10 max-w-6xl px-6">
            <p class="text-xs tracking-[0.3em] text-black/50 uppercase">Destinos</p>
            <h2 id="destinos-titulo" class="mt-2 text-3xl font-semibold sm:text-4xl">
                Seis lugares para começar
            </h2>
            <p class="mt-3 max-w-2xl text-black/60">
                Passe o mouse ou toque em cada imagem para explorar. De castelos cercados de cerejeiras ao neon de
                Tóquio, cada destino conta uma parte diferente da história japonesa.
            </p>
        </div>

        <div data-react="galeria-destinos"></div>

        <div class="mx-auto mt-10 max-w-6xl px-6">
            @include('partials.btn-flor', [
                'href' => '/planeje',
                'label' => 'Planeje a sua viagem',
            ])
        </div>
    </section>

@endsection
