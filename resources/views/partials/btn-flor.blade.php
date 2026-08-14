{{--
    Botão "flores" reutilizável.
    Espera: $href (destino) e $label (texto do botão).

    As pétalas são puramente decorativas, por isso o wrapper é aria-hidden e o
    texto fica acessível normalmente para leitores de tela.
--}}
<a href="{{ $href }}" class="btn-flor">
    <span class="flor-wrapper">
        <span class="flor-text">{{ $label }}</span>

        @for ($i = 1; $i <= 6; $i++)
            <span class="flor flor{{ $i }}" aria-hidden="true">
                <span class="petala one"></span>
                <span class="petala two"></span>
                <span class="petala three"></span>
                <span class="petala four"></span>
            </span>
        @endfor
    </span>
</a>
