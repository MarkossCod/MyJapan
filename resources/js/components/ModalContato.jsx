import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Facebook, Instagram, Mail, X, Youtube } from 'lucide-react';

const REDES = [
    { href: 'https://www.instagram.com/', rotulo: 'Instagram', Icone: Instagram },
    { href: 'https://www.facebook.com/', rotulo: 'Facebook', Icone: Facebook },
    { href: 'https://www.youtube.com/', rotulo: 'YouTube', Icone: Youtube },
];

/**
 * Pop-up de contato aberto pelo botão da seção "Quem somos".
 *
 * Cuidados que um modal precisa ter e que raramente vêm de graça:
 *   - Esc fecha;
 *   - clique no fundo escuro fecha, mas clique dentro do painel não;
 *   - o foco entra no botão de fechar e volta para quem abriu ao sair, senão
 *     quem navega por teclado é largado no fim da página;
 *   - a rolagem do fundo trava enquanto está aberto.
 */
export default function ModalContato({ aberto, aoFechar }) {
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
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
                >
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="titulo-contato"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, y: 24, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.98 }}
                        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-lg rounded-2xl bg-japao-papel p-8 shadow-2xl sm:p-10"
                    >
                        <button
                            ref={botaoFecharRef}
                            type="button"
                            onClick={aoFechar}
                            aria-label="Fechar"
                            className="absolute top-4 right-4 rounded-lg p-2 text-black/40 transition-colors hover:bg-black/5 hover:text-japao-tinta focus-visible:ring-2 focus-visible:ring-japao-vermelho focus-visible:outline-none"
                        >
                            <X size={18} />
                        </button>

                        <p className="flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.34em] text-japao-vermelho uppercase">
                            <span className="h-px w-8 bg-japao-vermelho/50" aria-hidden="true" />
                            <span>
                                <span aria-hidden="true">連絡 · </span>Contato
                            </span>
                        </p>

                        <h2 id="titulo-contato" className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                            Vamos planejar<br />
                            <span className="text-japao-vermelho">a sua viagem</span>
                        </h2>

                        <p className="mt-4 text-sm leading-relaxed text-black/60">
                            Dúvida sobre roteiro, época do ano ou passagem? Escreva para a gente — este é um projeto
                            acadêmico e respondemos em horário de aula.
                        </p>

                        <dl className="mt-8 space-y-4 border-t border-black/10 pt-6 text-sm">
                            <div className="flex items-center gap-3">
                                <dt className="sr-only">E-mail</dt>
                                <Mail size={17} className="shrink-0 text-japao-vermelho" aria-hidden="true" />
                                <dd>
                                    <a
                                        href="mailto:contato@myjapan.com.br"
                                        className="font-medium underline-offset-4 transition-colors hover:text-japao-vermelho hover:underline"
                                    >
                                        contato@myjapan.com.br
                                    </a>
                                </dd>
                            </div>
                            <div className="flex items-center gap-3">
                                <dt className="text-black/40">Atendimento</dt>
                                <dd className="text-black/70">Seg. a sex., das 9h às 18h</dd>
                            </div>
                            <div className="flex items-center gap-3">
                                <dt className="text-black/40">Onde nascemos</dt>
                                <dd className="text-black/70">SENAI · projeto acadêmico</dd>
                            </div>
                        </dl>

                        <div className="mt-8 flex items-center gap-4 border-t border-black/10 pt-6">
                            {REDES.map(({ href, rotulo, Icone }) => (
                                <a
                                    key={rotulo}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={rotulo}
                                    className="rounded-lg border border-black/10 p-2.5 text-black/60 transition-colors hover:border-japao-vermelho/40 hover:text-japao-vermelho"
                                >
                                    <Icone size={18} />
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
