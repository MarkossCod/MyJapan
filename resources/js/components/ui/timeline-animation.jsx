import { motion } from 'framer-motion';

/**
 * Envelope fino sobre o framer-motion: entra em cena quando aparece na tela,
 * usando as variantes que quem chama passar. O `animationNum` vira o `custom`
 * da variante, que é como o atraso em cascata é calculado lá.
 *
 *   <TimelineContent as="h2" animationNum={3} customVariants={v}>…</TimelineContent>
 *
 * `once: true` porque este é conteúdo de apresentação: reanimar toda vez que
 * o usuário rola para cima e para baixo vira distração, não charme.
 */
export function TimelineContent({
    as = 'div',
    animationNum = 0,
    customVariants,
    className = '',
    children,
    ...resto
}) {
    const Componente = motion[as] ?? motion.div;

    return (
        <Componente
            custom={animationNum}
            variants={customVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className={className}
            {...resto}
        >
            {children}
        </Componente>
    );
}

export default TimelineContent;
