@php($currentPath = '/' . ltrim(request()->path(), '/'))

<footer class="border-t border-black/10 bg-white/60">
    <div class="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
            <p class="text-xs tracking-[0.3em] text-black/50 uppercase">日本 · JAPÃO</p>
            <p class="mt-2 text-2xl font-semibold">MyJapan</p>
            <p class="mt-2 max-w-xs text-sm text-black/60">
                Roteiros, passagens e inspiração para quem sonha em atravessar o Japão de norte a sul.
            </p>
        </div>

        <nav aria-label="Rodapé">
            <p class="text-xs tracking-[0.3em] text-black/50 uppercase">Navegação</p>
            <ul class="mt-3 space-y-2 text-sm">
                @foreach ([
                    '/' => 'Início',
                    '/planeje' => 'Planeje a sua viagem',
                    '/passagens' => 'Comprar Passagens',
                    '/quem-somos' => 'Quem somos',
                ] as $href => $label)
                    <li>
                        <a href="{{ $href }}"
                           @class([
                               'transition-colors hover:text-[#bc002d]',
                               'text-[#bc002d] font-medium' => $currentPath === $href,
                               'text-black/70' => $currentPath !== $href,
                           ])>{{ $label }}</a>
                    </li>
                @endforeach
            </ul>
        </nav>

        <div>
            <p class="text-xs tracking-[0.3em] text-black/50 uppercase">Contato</p>
            <p class="mt-3 text-sm text-black/70">contato@myjapan.com.br</p>
            <p class="mt-1 text-sm text-black/70">Seg. a sex., das 9h às 18h</p>
        </div>
    </div>

    <div class="border-t border-black/10 px-6 py-5">
        <p class="mx-auto max-w-6xl text-xs text-black/50">
            © {{ date('Y') }} MyJapan. Projeto acadêmico, sem fins comerciais.
        </p>
    </div>
</footer>
