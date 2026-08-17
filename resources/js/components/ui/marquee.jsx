import { cn } from '@/lib/utils';

/**
 * Faixa que desliza sem fim.
 *
 * O conteúdo é renderizado duas vezes e a animação desloca a trilha em -50%:
 * quando a primeira cópia sai pela esquerda, a segunda já está exatamente no
 * lugar dela, e o salto de volta ao início é invisível.
 *
 * A velocidade entra como `--duration`, lida pelo CSS em resources/css/app.css.
 */
export function Marquee({
    children,
    pauseOnHover = false,
    direction = 'left',
    speed = 30,
    className = '',
    ...resto
}) {
    return (
        <div className={cn('z-10 w-full overflow-hidden', className)} {...resto}>
            <div className="relative flex overflow-hidden py-5">
                <div
                    className={cn(
                        'flex w-max animate-marquee',
                        pauseOnHover && 'hover:[animation-play-state:paused]',
                        direction === 'right' && 'animate-marquee-reverse'
                    )}
                    style={{ '--duration': `${speed}s` }}
                    /* A faixa é decorativa e o conteúdo já aparece na página;
                       para quem usa leitor de tela, repetido duas vezes só
                       atrapalha. */
                    aria-hidden="true"
                >
                    {children}
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Marquee;
