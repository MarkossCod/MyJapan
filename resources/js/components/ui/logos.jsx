/**
 * Marcas da faixa deslizante da página "Quem somos".
 *
 * Duas decisões que valem explicação:
 *
 * 1. Tudo é SVG inline, sem CDN e sem pacote de ícones. A faixa tem nove itens;
 *    puxar uma biblioteca inteira (ou nove requisições) por causa disso seria
 *    caro para o que entrega.
 *
 * 2. Tudo é monocromático, herdando a cor de quem chama (`currentColor`).
 *    Estes são desenhos nossos, não os arquivos oficiais das marcas — em preto
 *    e vermelho eles funcionam como assinatura visual sem fingir ser o logotipo
 *    original, e ainda combinam com a sobriedade do resto do site.
 */

function Marca({ children, viewBox = '0 0 24 24', titulo }) {
    return (
        <svg
            viewBox={viewBox}
            className="h-6 w-6 shrink-0"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={titulo}
        >
            {children}
        </svg>
    );
}

export function LogoReact() {
    return (
        <Marca titulo="React">
            <circle cx="12" cy="12" r="2.1" />
            <g fill="none" stroke="currentColor" strokeWidth="1.1">
                <ellipse cx="12" cy="12" rx="10" ry="3.8" />
                <ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(60 12 12)" />
                <ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(120 12 12)" />
            </g>
        </Marca>
    );
}

export function LogoTailwind() {
    return (
        <Marca titulo="Tailwind CSS">
            {/* As duas ondas sobrepostas, o gesto que define a marca. */}
            <path d="M12 5.4c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.91.23 1.56.89 2.29 1.62C13.67 11.22 15.03 12.6 18 12.6c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.91-.23-1.56-.89-2.29-1.62C16.34 6.78 14.98 5.4 12 5.4Z" />
            <path d="M6 12.6c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.91.23 1.56.89 2.29 1.62 1.18 1.2 2.54 2.58 5.51 2.58 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.91-.23-1.56-.89-2.29-1.62C10.34 13.98 8.98 12.6 6 12.6Z" />
        </Marca>
    );
}

export function LogoVite() {
    return (
        <Marca titulo="Vite">
            {/* O "V" cheio, com o raio vazado por fillRule: em traço fino a
                marca virava um "W" e deixava de ser reconhecível. */}
            <path
                fillRule="evenodd"
                d="M2 4 12 21.8 22 4 12 6.6 2 4Zm11.3 3.1L9.9 13.4h2.3l-.8 4.2 4.1-6.9h-2.4l.2-3.6Z"
            />
        </Marca>
    );
}

export function LogoLaravel() {
    return (
        <Marca titulo="Laravel">
            {/* O "L" em perspectiva isométrica, reduzido a três faces: topo,
                lateral e o braço de baixo. */}
            <path d="M3 5.9 6.5 3.9l6.4 3.7-3.5 2L3 5.9Z" opacity=".55" />
            <path d="M3 5.9 9.4 9.6v7.3L3 13.2V5.9Z" />
            <path d="M9.4 16.9 12.9 14.9l8.1 4.7-3.5 2-8.1-4.7Z" />
        </Marca>
    );
}

export function LogoThree() {
    return (
        <Marca titulo="Three.js">
            {/* Malha de triângulos: o jeito mais direto de dizer "3D". */}
            <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
                <path d="M12 2.6 21.4 19H2.6L12 2.6Z" />
                <path d="M12 2.6v16.4M2.6 19 12 11.3 21.4 19" />
            </g>
        </Marca>
    );
}

/**
 * Placa vermelha no estilo do logotipo do sistema — usada para as instituições,
 * que não têm um símbolo isolado como as ferramentas têm.
 */
export function PlacaInstituicao({ nome }) {
    return (
        <span className="flex shrink-0 items-center rounded-[3px] bg-japao-vermelho px-2.5 py-1 text-xs font-bold tracking-wide text-white italic sm:text-sm">
            {nome}
        </span>
    );
}
