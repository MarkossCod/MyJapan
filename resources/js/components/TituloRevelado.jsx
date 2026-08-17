import ScrollReveal from '@/components/ui/ScrollReveal';

/**
 * Título com a mesma revelação palavra a palavra usada no texto "Por que ir".
 *
 * Monta dentro de um <h2> que já existe no Blade — por isso `as="span"`: o
 * título continua no HTML mesmo antes do JS rodar, e o React apenas troca o
 * texto cru pelos spans animados.
 *
 * Props (via data-props no Blade):
 *   texto             — o título completo, em uma linha
 *   destaqueApartirDe — índice da palavra em que começa o trecho em vermelho
 *   quebraApartirDe   — índice da palavra que abre a segunda linha (só a partir de sm)
 */
export default function TituloRevelado({ texto = '', destaqueApartirDe = null, quebraApartirDe = null }) {
    return (
        <ScrollReveal
            as="span"
            textAs="span"
            baseOpacity={0}
            enableBlur={true}
            /* Menos rotação que o parágrafo: no corpo grande do título, os 5
               graus do original jogavam a última palavra para fora da caixa. */
            baseRotation={2.5}
            blurStrength={9}
            containerClassName="is-titulo block"
            textClassName="is-titulo block"
            highlightFrom={destaqueApartirDe}
            highlightClassName="text-japao-vermelho"
            breakBefore={quebraApartirDe}
            breakClassName="hidden sm:block"
        >
            {texto}
        </ScrollReveal>
    );
}
