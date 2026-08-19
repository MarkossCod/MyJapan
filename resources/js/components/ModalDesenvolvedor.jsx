import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Github, Linkedin, Mail, X } from 'lucide-react';

/*
    Salve a foto em public/images/desenvolvedor.jpg. Se o arquivo não existir,
    o painel cai no monograma automaticamente (onError abaixo) — assim a página
    nunca mostra um ícone de imagem quebrada.
*/
const FOTO = '/images/desenvolvedor.jpg';

const DEV = {
    nome: 'Markos Samuell',
    papel: 'Desenvolvedor · Projeto MyJapan, SENAI',
    texto:
        'Construí o MyJapan do zero como projeto acadêmico: da experiência 3D da bandeira ao deploy em container. ' +
        'A ideia era simples — provar que dá para fazer um site sobre o Japão que seja bonito de olhar e leve de usar, ' +
        'sem esconder nada atrás de jargão.',
    redes: [
        { href: 'https://github.com/MarkossCod', rotulo: 'GitHub', Icone: Github },
        { href: 'https://www.linkedin.com/in/markos-samuell/', rotulo: 'LinkedIn', Icone: Linkedin },
        { href: 'mailto:contato@myjapan.com.br', rotulo: 'E-mail', Icone: Mail },
    ],
};

/**
 * Pop-up "Conheça o desenvolvedor".
 *
 * O cartão é escuro de propósito, contrastando com o papel claro do site: é o
 * único momento em que a página fala de quem a fez, e a inversão de tom marca
 * essa troca de voz.
 *
 * A foto ocupa o cartão inteiro e o painel de texto flutua sobre ela, encostado
 * à direita. É o gesto da referência — e, como não existe fundo exposto atrás do
 * painel, também resolve a área escura vazia que sobrava na versão em duas
 * colunas: cada pixel do cartão é foto ou painel.
 */
export default function ModalDesenvolvedor({ aberto, aoFechar }) {
    const botaoFecharRef = useRef(null);
    const focoAnteriorRef = useRef(null);
    const [semFoto, setSemFoto] = useState(false);

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
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-japao-tinta/45 p-4 backdrop-blur-md"
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
                        className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-[#1b1b1f] shadow-2xl"
                    >
                        <button
                            ref={botaoFecharRef}
                            type="button"
                            onClick={aoFechar}
                            aria-label="Fechar"
                            className="absolute top-4 right-4 z-30 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white/75 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
                        >
                            <X size={17} />
                        </button>

                        <div className="flex flex-col md:min-h-[26rem] md:flex-row">
                            {/* Coluna da foto.
                                Ela e mais larga do que a parte visivel: o painel cobre
                                os ultimos 14%. Enquadrar assim, e nao usar a foto como
                                fundo do cartao inteiro, e o que mantem o rosto a mostra
                                — centralizado nesta coluna, ele cai na faixa livre em
                                vez de ficar atras do painel. */}
                            <div className="relative h-64 w-full shrink-0 md:h-auto md:w-[52%]">
                                {FOTO && !semFoto ? (
                                    <img
                                        src={FOTO}
                                        alt={`Retrato de ${DEV.nome}`}
                                        onError={() => setSemFoto(true)}
                                        className="absolute inset-0 h-full w-full object-cover object-[50%_22%]"
                                    />
                                ) : (
                                    <div
                                        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#d8b48c] to-[#a97f57]"
                                        aria-hidden="true"
                                    >
                                        <span className="text-7xl font-semibold text-white/90">
                                            {DEV.nome.charAt(0)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Painel sobre a foto: sobe por cima no celular (-mt-6) e
                                avanca por cima pela lateral no desktop (-ml). Vai ate a
                                borda do cartao de proposito — assim nao sobra fundo
                                exposto em canto nenhum. */}
                            <div className="relative z-20 -mt-6 flex flex-1 flex-col justify-center rounded-t-3xl bg-[#1b1b1f] p-6 shadow-2xl shadow-black/60 sm:p-8 md:-mt-0 md:-ml-[7%] md:rounded-t-none md:rounded-l-3xl md:p-9">
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
                                            {...(href.startsWith('http')
                                                ? { target: '_blank', rel: 'noopener noreferrer' }
                                                : {})}
                                            aria-label={rotulo}
                                            className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#1b1b1f] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1b1f] focus-visible:outline-none"
                                        >
                                            <Icone size={18} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
