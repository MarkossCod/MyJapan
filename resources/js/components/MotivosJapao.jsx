import ScrollReveal from '@/components/ui/ScrollReveal';

const TEXTO =
    'O Japão é um país que vive em duas eras ao mesmo tempo. Em uma manhã você atravessa um templo de mil anos ' +
    'cercado de cerejeiras e, na mesma tarde, se perde entre trens-bala e letreiros de neon. É por isso que se quer ' +
    'conhecer o Japão: pela hospitalidade silenciosa, pela comida que vira memória, pelas quatro estações que ' +
    'reinventam a paisagem e por essa mistura rara de tradição e futuro que não existe em nenhum outro lugar.';

export default function MotivosJapao() {
    return (
        <ScrollReveal
            // O padrao do componente e <h2>, mas aqui o conteudo e um
            // paragrafo -- e a secao ja tem o proprio <h2> no Blade.
            as="div"
            baseOpacity={0}
            enableBlur={true}
            baseRotation={5}
            blurStrength={10}
            containerClassName="max-w-4xl mx-auto"
            textClassName="text-neutral-900"
        >
            {TEXTO}
        </ScrollReveal>
    );
}
