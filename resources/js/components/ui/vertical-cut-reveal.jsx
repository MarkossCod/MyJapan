import { Fragment } from 'react';
import { motion } from 'framer-motion';

/**
 * Título que "sobe" pedaço a pedaço, como se cada palavra estivesse escondida
 * atrás de um corte horizontal.
 *
 * O truque são dois spans por pedaço: o de fora tem `overflow: hidden` e serve
 * de janela; o de dentro começa deslocado no eixo Y e desliza até zero.
 *
 * Quem dispara a animação é o span externo de tudo, e não cada palavra. Isso é
 * essencial: o IntersectionObserver recorta o elemento observado pelos
 * ancestrais, e as palavras começam justamente fora da janela — observadas
 * individualmente, elas nunca "entrariam em vista" e a animação jamais
 * dispararia. Um impasse circular: escondidas até animarem, sem animar por
 * estarem escondidas. Observando o contêiner, que não é recortado, o estado
 * desce por propagação de variantes.
 */
export function VerticalCutReveal({
    children,
    splitBy = 'words',
    staggerDuration = 0.1,
    staggerFrom = 'first',
    reverse = false,
    transition = { type: 'spring', stiffness: 250, damping: 30 },
    className = '',
}) {
    const texto = typeof children === 'string' ? children : '';
    const pedacos = splitBy === 'characters' ? [...texto] : texto.split(' ');

    const variantes = {
        hidden: { y: reverse ? '-110%' : '110%' },
        visible: (ordem) => ({
            y: '0%',
            transition: {
                ...transition,
                delay: (transition.delay ?? 0) + ordem * staggerDuration,
            },
        }),
    };

    return (
        <motion.span
            className={`inline ${className}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            {pedacos.map((pedaco, i) => {
                // De onde a cascata parte muda só a ordem do atraso.
                const ordem = staggerFrom === 'last' ? pedacos.length - 1 - i : i;

                return (
                    <Fragment key={i}>
                        <span className="inline-block overflow-hidden align-bottom">
                            <motion.span className="inline-block" custom={ordem} variants={variantes}>
                                {pedaco}
                            </motion.span>
                        </span>
                        {/* O espaço fica FORA da janela: dentro dela seria
                            recortado junto e as palavras grudariam. É ele
                            também que oferece o ponto de quebra de linha. */}
                        {splitBy !== 'characters' && i < pedacos.length - 1 ? ' ' : null}
                    </Fragment>
                );
            })}
        </motion.span>
    );
}

export default VerticalCutReveal;
