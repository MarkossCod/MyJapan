import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Github, Instagram, Linkedin, Mail, X, Youtube } from 'lucide-react';

/*
    Troque por uma foto sua: coloque o arquivo em public/images/ e aponte aqui,
    por exemplo '/images/desenvolvedor.jpg'. Enquanto for null, o painel mostra
    um monograma no lugar — melhor do que uma imagem quebrada.
*/
const FOTO = null;

const DEV = {
    nome: 'Marko',
    papel: 'Desenvolvedor · Projeto MyJapan, SENAI',
    texto:
        'Construí o MyJapan do zero como projeto acadêmico: da experiência 3D da bandeira ao deploy em container. ' +
        'A ideia era simples — provar que dá para fazer um site sobre o Japão que seja bonito de olhar e leve de usar, ' +
        'sem esconder nada atrás de jargão.',
    redes: [
        { href: 'https://github.com/MarkossCod', rotulo: 'GitHub', Icone: Github },
        { href: 'https://www.instagram.com/', rotulo: 'Instagram', Icone: Instagram },
        { href: 'https://www.youtube.com/', rotulo: 'YouTube', Icone: Youtube },
        { href: 'https://www.linkedin.com/', rotulo: 'LinkedIn', Icone: Linkedin },
    ],
};

/**
 * Pop-up "Conheça o desenvolvedor".
 *
 * O cartão é escuro de propósito, contrastando com o papel claro do site: é o
 * único momento em que a página fala de quem a fez, e a inversão de tom marca
 * essa troca de voz.
 *
 * Estrutura: retrato à esquerda e painel de texto à direita, sobrepondo o
 * retrato alguns pixels (o `-ml` no md) — é esse encaixe que dá a sensação de
 * profundidade da referência, e não uma sombra qualquer.
 */
export default function ModalDesenvolvedor({ aberto, aoFechar }) {
    const botaoFecharRef = useRef(null);
    const focoAnteriorRef = useRef(null);

    useEffect(() => {
        if (!aberto) return;

        focoAnteriorRef.current = document.activeElement;
        botaoFecharRef.current?.focus();

        const aoTeclar = (e) => {
            if (e.key === 'Escape') aoFechar();
        };

        const overflowAnterior = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', aoTeclar);

        return () => {
            document.body.style.overflow = overflowAnterior;
            window.removeEventListener('keydown', aoTeclar);
            focoAnteriorRef.current?.focus?.();
        };
    }, [aberto, aoFechar]);

    return (
        <AnimatePresence>
            {aberto && (
                <motion.div
                    key="fundo"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={aoFechar}
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                >
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="titulo-desenvolvedor"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, y: 26, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.98 }}
                        transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-[#0c0c0e] p-3 shadow-2xl sm:p-4"
                    >
                        <button
                            ref={botaoFecharRef}
                            type="button"
                            onClick={aoFechar}
                            aria-label="Fechar"
                            className="absolute top-5 right-5 z-20 rounded-lg p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex flex-col md:flex-row md:items-stretch">
                            {/* Retrato */}
                            <div className="w-full shrink-0 overflow-hidden rounded-2xl md:min-h-[420px] md:w-[44%]">
                                {FOTO ? (
                                    <img
                                        src={FOTO}
                                        alt={`Retrato de ${DEV.nome}`}
                                        className="h-56 w-full object-cover object-center md:h-full"
                                    />
                                ) : (
                                    <div
                                        className="flex h-56 w-full items-center justify-center bg-gradient-to-br from-[#d8b48c] to-[#a97f57] md:h-full"
                                        aria-hidden="true"
                                    >
                                        <span className="text-6xl font-semibold text-white/90">
                                            {DEV.nome.charAt(0)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Painel de texto, sobrepondo o retrato no desktop. */}
                            {/* A sombra nao e enfeite: sem ela a borda do painel some contra a
                                foto e a sobreposicao — que e o gesto da referencia —
                                deixa de ser percebida. O recuo vertical faz o retrato
                                sobrar acima e abaixo, completando a profundidade. */}
                            <div className="relative z-10 -mt-6 rounded-2xl bg-[#1e1e22] p-6 shadow-2xl shadow-black/60 sm:p-8 md:my-10 md:-mt-0 md:-ml-16 md:self-center">
                                <h2 id="titulo-desenvolvedor" className="text-2xl font-bold text-white">
                                    {DEV.nome}
                                </h2>
                                <p className="mt-1.5 text-sm font-medium text-slate-400">{DEV.papel}</p>

                                <p className="mt-5 text-sm leading-relaxed text-white/85">{DEV.texto}</p>

                                <div className="mt-7 flex flex-wrap items-center gap-3">
                                    {DEV.redes.map(({ href, rotulo, Icone }) => (
                                        <a
                                            key={rotulo}
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={rotulo}
                                            className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#0c0c0e] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1b1f] focus-visible:outline-none"
                                        >
                                            <Icone size={18} />
                                        </a>
                                    ))}
                                    <a
                                        href="mailto:contato@myjapan.com.br"
                                        aria-label="E-mail"
                                        className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#0c0c0e] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1b1f] focus-visible:outline-none"
                                    >
                                        <Mail size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
