'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

export interface GalleryImage {
    src: string;
    alt: string;
    /** Rótulo curto exibido no canto do card ativo (ex.: "01 · Ishikawa"). */
    code: string;
    /** Nome do destino, exibido em destaque no card ativo. */
    title: string;
}

type Breakpoint = 'mobile' | 'tablet' | 'desktop';

/**
 * Observa a largura do documento para escolher entre o modo "hover expand"
 * (tablet/desktop) e o modo carrossel com scroll-snap (celular).
 *
 * Usa ResizeObserver em vez do evento `resize` da janela: quando o site é
 * carregado dentro de um painel/iframe — ou quando a barra do navegador do
 * celular recolhe — a largura final pode ser definida DEPOIS da montagem sem
 * disparar `resize`, o que deixaria a galeria travada no modo errado.
 */
function useBreakpoint(): Breakpoint {
    const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');

    useEffect(() => {
        const compute = () => {
            const width = document.documentElement.clientWidth || window.innerWidth;
            setBreakpoint(width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop');
        };

        compute();

        const observer = new ResizeObserver(compute);
        observer.observe(document.documentElement);
        window.addEventListener('resize', compute);
        window.addEventListener('orientationchange', compute);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', compute);
            window.removeEventListener('orientationchange', compute);
        };
    }, []);

    return breakpoint;
}

const SIZES: Record<Exclude<Breakpoint, 'mobile'>, { active: string; collapsed: string; height: string }> = {
    tablet: { active: '18rem', collapsed: '3.25rem', height: '20rem' },
    desktop: { active: '24rem', collapsed: '5rem', height: '24rem' },
};

const HoverExpand_001 = ({ images, className }: { images: GalleryImage[]; className?: string }) => {
    const [activeImage, setActiveImage] = useState<number | null>(0);
    const breakpoint = useBreakpoint();

    // No celular a linha de cards não cabe: usamos um carrossel com scroll-snap,
    // que é navegável por toque sem depender de :hover.
    if (breakpoint === 'mobile') {
        return (
            <motion.div
                initial={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 0.3 }}
                className={cn('w-full', className)}
            >
                <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {images.map((image, index) => (
                        <figure
                            key={index}
                            className="relative h-[22rem] w-[78vw] shrink-0 snap-center overflow-hidden rounded-3xl"
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                loading="lazy"
                                className="size-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                            <figcaption className="absolute inset-x-0 bottom-0 p-5">
                                <p className="text-xs tracking-[0.2em] text-white/60 uppercase">{image.code}</p>
                                <p className="mt-1 text-2xl font-semibold text-white">{image.title}</p>
                            </figcaption>
                        </figure>
                    ))}
                </div>
                <p className="mt-1 px-5 text-center text-xs text-neutral-500">Arraste para o lado para ver mais destinos</p>
            </motion.div>
        );
    }

    const size = SIZES[breakpoint];

    return (
        <motion.div
            initial={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={cn('relative w-full max-w-6xl px-5', className)}
        >
            <div className="flex w-full items-center justify-center gap-1">
                {images.map((image, index) => {
                    const isActive = activeImage === index;

                    return (
                        <motion.button
                            key={index}
                            type="button"
                            aria-label={image.title}
                            aria-pressed={isActive}
                            className="relative cursor-pointer overflow-hidden rounded-3xl focus-visible:ring-2 focus-visible:ring-[#bc002d] focus-visible:ring-offset-2 focus-visible:outline-none"
                            initial={false}
                            animate={{
                                width: isActive ? size.active : size.collapsed,
                                height: size.height,
                            }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            onClick={() => setActiveImage(index)}
                            onFocus={() => setActiveImage(index)}
                            onHoverStart={() => setActiveImage(index)}
                        >
                            <AnimatePresence>
                                {isActive && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute h-full w-full bg-gradient-to-t from-black/70 via-black/10 to-transparent"
                                    />
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {isActive && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute flex h-full w-full flex-col items-start justify-end p-5 text-left"
                                    >
                                        <p className="text-xs tracking-[0.2em] text-white/60 uppercase">{image.code}</p>
                                        <p className="mt-1 text-2xl font-semibold text-white">{image.title}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <img
                                src={image.src}
                                className="size-full object-cover"
                                alt={image.alt}
                                loading="lazy"
                            />
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
};

export { HoverExpand_001 };
export default HoverExpand_001;

/**
 * Baseado no Skiper 52 HoverExpand_001 — React + Framer Motion
 * Autor original: @gurvinder-singh02 — https://gxuri.me
 * Uso livre em projetos pessoais e comerciais, com atribuição ao Skiper UI.
 *
 * Adaptações neste projeto: modo carrossel no celular, navegação por teclado,
 * legendas com nome do destino e imagens do próprio acervo do site.
 */
