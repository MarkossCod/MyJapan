import { Fragment, useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
    children,
    scrollContainerRef,
    enableBlur = true,
    baseOpacity = 0.1,
    baseRotation = 3,
    blurStrength = 4,
    containerClassName = '',
    textClassName = '',
    rotationEnd = 'bottom bottom',
    wordAnimationEnd = 'bottom bottom',
    // As tags sao configuraveis porque o mesmo efeito serve para paragrafo e
    // para titulo. O padrao <h2><p> so faz sentido no caso do paragrafo -- e
    // olhe que <p> dentro de <h2> nem e HTML valido; quando o componente for
    // usado dentro de um <h2> que ja existe no Blade, passe as="span".
    as: Tag = 'h2',
    textAs: TextTag = 'p',
    // Indice da palavra a partir da qual aplicar `highlightClassName`. Serve
    // para colorir so a segunda linha de um titulo, por exemplo.
    highlightFrom = null,
    highlightClassName = '',
    // Indice da palavra que abre uma nova linha. Deixar a quebra a cargo de um
    // max-width nao funciona aqui: as palavras sao inline-block e o ponto de
    // quebra depende da fonte carregada, entao o <br> explicito e o unico jeito
    // de garantir sempre o mesmo desenho.
    breakBefore = null,
    breakClassName = '',
}) => {
    const containerRef = useRef(null);

    const splitText = useMemo(() => {
        const text = typeof children === 'string' ? children : '';
        // `indicePalavra` conta so as palavras (os espacos voltam crus), para
        // que `highlightFrom` seja um indice previsivel de escrever na chamada.
        let indicePalavra = -1;

        return text.split(/(\s+)/).map((word, index) => {
            if (word.match(/^\s+$/)) return word;
            indicePalavra += 1;

            const destacada = highlightFrom !== null && indicePalavra >= highlightFrom;
            const quebra = breakBefore !== null && indicePalavra === breakBefore;

            const span = (
                <span className={destacada ? `word ${highlightClassName}` : 'word'} key={index}>
                    {word}
                </span>
            );

            if (!quebra) return span;

            return (
                <Fragment key={index}>
                    <br className={breakClassName} />
                    {span}
                </Fragment>
            );
        });
    }, [children, highlightFrom, highlightClassName, breakBefore, breakClassName]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

        // Respeita quem prefere menos movimento: mostra o texto pronto, sem animar.
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) {
            gsap.set(el, { rotate: 0 });
            gsap.set(el.querySelectorAll('.word'), { opacity: 1, filter: 'blur(0px)' });
            return;
        }

        const tweens = [];

        tweens.push(
            gsap.fromTo(
                el,
                { transformOrigin: '0% 50%', rotate: baseRotation },
                {
                    ease: 'none',
                    rotate: 0,
                    scrollTrigger: {
                        trigger: el,
                        scroller,
                        start: 'top bottom',
                        end: rotationEnd,
                        scrub: true,
                    },
                }
            )
        );

        const wordElements = el.querySelectorAll('.word');

        tweens.push(
            gsap.fromTo(
                wordElements,
                { opacity: baseOpacity, willChange: 'opacity' },
                {
                    ease: 'none',
                    opacity: 1,
                    stagger: 0.05,
                    scrollTrigger: {
                        trigger: el,
                        scroller,
                        start: 'top bottom-=20%',
                        end: wordAnimationEnd,
                        scrub: true,
                    },
                }
            )
        );

        if (enableBlur) {
            tweens.push(
                gsap.fromTo(
                    wordElements,
                    { filter: `blur(${blurStrength}px)` },
                    {
                        ease: 'none',
                        filter: 'blur(0px)',
                        stagger: 0.05,
                        scrollTrigger: {
                            trigger: el,
                            scroller,
                            start: 'top bottom-=20%',
                            end: wordAnimationEnd,
                            scrub: true,
                        },
                    }
                )
            );
        }

        // Mata apenas os gatilhos criados por esta instância, para não afetar
        // outros componentes que também usam ScrollTrigger na mesma página.
        return () => {
            tweens.forEach((tween) => {
                if (tween.scrollTrigger) tween.scrollTrigger.kill();
                tween.kill();
            });
        };
    }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

    return (
        <Tag ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
            <TextTag className={`scroll-reveal-text ${textClassName}`}>{splitText}</TextTag>
        </Tag>
    );
};

export default ScrollReveal;
