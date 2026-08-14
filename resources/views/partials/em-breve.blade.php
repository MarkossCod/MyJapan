{{--
    Bloco reutilizável para as páginas ainda em construção.
    Espera as variáveis: $eyebrow, $titulo, $texto.
--}}
<section class="px-6 py-28 sm:py-36">
    <div class="mx-auto max-w-3xl">
        <p class="text-xs tracking-[0.3em] text-black/50 uppercase">{{ $eyebrow }}</p>
        <h1 class="mt-3 text-4xl font-semibold sm:text-5xl">{{ $titulo }}</h1>
        <p class="mt-5 text-lg text-black/60">{{ $texto }}</p>

        <p class="mt-10 inline-flex items-center gap-2 rounded-full border border-black/15 px-5 py-2 text-sm text-black/60">
            <span aria-hidden="true">⏳</span>
            <span>Esta página será construída na próxima etapa do projeto.</span>
        </p>

        <div class="mt-10">
            <a href="/" class="text-sm font-medium text-[#bc002d] hover:underline">← Voltar para o início</a>
        </div>
    </div>
</section>
