const CAMINHO_SETA =
    'M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z';

function Seta({ className }) {
    return (
        <svg viewBox="0 0 14 15" fill="none" width="10" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d={CAMINHO_SETA} fill="currentColor" />
        </svg>
    );
}

/**
 * Botão pílula com a seta que se substitui no hover.
 *
 * O estilo vive em resources/css/app.css (classes `btn-seta*`), porque o
 * efeito depende de `overflow: hidden` no círculo e de dois `transition` com
 * atrasos diferentes — coisas que ficam ilegíveis espalhadas em utilitários.
 *
 * `cor` alimenta a variável --clr: é a cor de fundo em repouso e a cor da seta.
 */
export default function BotaoSeta({ children, cor = '#bc002d', className = '', ...resto }) {
    return (
        <button type="button" className={`btn-seta ${className}`} style={{ '--clr': cor }} {...resto}>
            <span className="btn-seta__icone" aria-hidden="true">
                <Seta className="btn-seta__seta" />
                <Seta className="btn-seta__seta btn-seta__seta--copia" />
            </span>
            {children}
        </button>
    );
}
