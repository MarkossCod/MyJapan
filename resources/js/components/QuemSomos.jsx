import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

import ModalContato from '@/components/ModalContato';
import Marquee from '@/components/ui/marquee';
import { TimelineContent } from '@/components/ui/timeline-animation';
import { VerticalCutReveal } from '@/components/ui/vertical-cut-reveal';

/* Sobe desfocado e deslocado; o índice vira o degrau da cascata. */
const variantesRevelar = {
    hidden: { filter: 'blur(10px)', y: -20, opacity: 0 },
    visible: (i) => ({
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        transition: { delay: i * 0.12, duration: 0.5 },
    }),
};

/* Igual, mas sem deslocamento — para a imagem, que só desembaça. */
const variantesEscala = {
    hidden: { filter: 'blur(10px)', opacity: 0 },
    visible: (i) => ({
        opacity: 1,
        filter: 'blur(0px)',
        transition: { delay: i * 0.12, duration: 0.5 },
    }),
};

/*
    A faixa tem dois grupos: de onde o projeto veio e com o que ele foi feito.
    São marcas de terceiros e não temos os arquivos oficiais, então entram como
    tipografia — o que também combina melhor com o tom sóbrio do site do que
    logos coloridos.
*/
const INSTITUICOES = ['SENAI', 'FIEPE', 'SESI', 'IEL'];
const TECNOLOGIAS = ['Laravel', 'React', 'Tailwind', 'Vite', 'Three.js'];

function ItemFaixa({ children, destaque = false }) {
    return (
        <span
            className={`mx-8 flex shrink-0 items-center text-lg font-semibold tracking-[0.18em] uppercase sm:mx-12 sm:text-xl ${
                destaque ? 'text-japao-vermelho' : 'text-black/35'
            }`}
        >
            {children}
        </span>
    );
}

export default function QuemSomos() {
    const [modalAberto, setModalAberto] = useState(false);

    return (
        <section className="px-4 py-10 sm:py-14">
            <div className="mx-auto max-w-6xl">
                <div className="relative">
                    {/* Cabeçalho flutuante sobre a imagem. */}
                    <div className="absolute -top-3 z-10 flex w-[85%] items-center justify-between sm:-top-2 md:top-0 lg:top-4">
                        <div className="flex items-center gap-2 text-xl">
                            <span className="animate-spin text-japao-vermelho" aria-hidden="true">
                                ✱
                            </span>
                            <TimelineContent
                                as="span"
                                animationNum={0}
                                customVariants={variantesRevelar}
                                className="text-sm font-medium tracking-[0.2em] text-black/60 uppercase"
                            >
                                Quem somos
                            </TimelineContent>
                        </div>
                    </div>

                    <TimelineContent
                        as="figure"
                        animationNum={1}
                        customVariants={variantesEscala}
                        className="group relative"
                    >
                        <svg className="w-full" width="100%" height="100%" viewBox="0 0 100 40" role="img" aria-label="Placa do SENAI ao lado da bandeira do Japão">
                            <defs>
                                <clipPath id="recorte-quem-somos" clipPathUnits="objectBoundingBox">
                                    <path d="M0.0998072 1H0.422076H0.749756C0.767072 1 0.774207 0.961783 0.77561 0.942675V0.807325C0.777053 0.743631 0.791844 0.731953 0.799059 0.734076H0.969813C0.996268 0.730255 1.00088 0.693206 0.999875 0.675159V0.0700637C0.999875 0.0254777 0.985045 0.00477707 0.977629 0H0.902473C0.854975 0 0.890448 0.138535 0.850165 0.138535H0.0204424C0.00408849 0.142357 0 0.180467 0 0.199045V0.410828C0 0.449045 0.0136283 0.46603 0.0204424 0.469745H0.0523086C0.0696245 0.471019 0.0735527 0.497877 0.0733523 0.511146V0.915605C0.0723903 0.983121 0.090588 1 0.0998072 1Z" />
                                </clipPath>
                            </defs>
                            {/* O SVG do logo foi desenhado em 2.5:1, a mesma
                                proporção do recorte, para que o `slice` preencha
                                a forma sem decepar as laterais da placa. */}
                            <image
                                clipPath="url(#recorte-quem-somos)"
                                preserveAspectRatio="xMidYMid slice"
                                width="100%"
                                height="100%"
                                href="/images/senai.svg"
                            />
                        </svg>
                    </TimelineContent>

                    {/* Números */}
                    <div className="flex flex-wrap items-center justify-between py-3 text-sm lg:justify-start">
                        <TimelineContent
                            as="div"
                            animationNum={2}
                            customVariants={variantesRevelar}
                            className="flex gap-4"
                        >
                            <div className="mb-2 flex items-center gap-2 text-xs sm:text-base">
                                <span className="font-bold text-japao-vermelho">6</span>
                                <span className="text-black/60">destinos mapeados</span>
                                <span className="text-black/20">|</span>
                            </div>
                            <div className="mb-2 flex items-center gap-2 text-xs sm:text-base">
                                <span className="font-bold text-japao-vermelho">4</span>
                                <span className="text-black/60">estações do ano</span>
                            </div>
                        </TimelineContent>

                        <div className="right-0 bottom-16 flex flex-row-reverse gap-4 lg:absolute lg:flex-col lg:gap-0">
                            <TimelineContent
                                as="div"
                                animationNum={3}
                                customVariants={variantesRevelar}
                                className="mb-2 flex items-center gap-2 text-2xl sm:text-3xl lg:text-4xl"
                            >
                                <span className="font-semibold text-japao-vermelho">47</span>
                                <span className="text-black/60 uppercase">prefeituras</span>
                            </TimelineContent>
                            <TimelineContent
                                as="div"
                                animationNum={4}
                                customVariants={variantesRevelar}
                                className="mb-2 flex items-center gap-2 text-xs sm:text-base"
                            >
                                <span className="font-bold text-japao-vermelho">100%</span>
                                <span className="text-black/60">sem fins comerciais</span>
                                <span className="block text-black/20 lg:hidden">|</span>
                            </TimelineContent>
                        </div>
                    </div>
                </div>

                {/* Faixa deslizante — entre a imagem e o texto. */}
                <div className="border-y border-black/10">
                    <Marquee pauseOnHover speed={38} className="mt-0">
                        {INSTITUICOES.map((nome) => (
                            <ItemFaixa key={nome} destaque>
                                {nome}
                            </ItemFaixa>
                        ))}
                        {TECNOLOGIAS.map((nome) => (
                            <ItemFaixa key={nome}>{nome}</ItemFaixa>
                        ))}
                    </Marquee>
                </div>

                {/* Conteúdo */}
                <div className="grid gap-8 pt-12 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <h1 className="mb-8 text-2xl leading-[110%] font-semibold tracking-tight sm:text-4xl md:text-5xl">
                            <VerticalCutReveal
                                splitBy="words"
                                staggerDuration={0.08}
                                staggerFrom="first"
                                reverse={true}
                                transition={{ type: 'spring', stiffness: 250, damping: 30, delay: 0.2 }}
                            >
                                Encurtar a distância entre você e o Japão.
                            </VerticalCutReveal>
                        </h1>

                        <TimelineContent
                            as="div"
                            animationNum={5}
                            customVariants={variantesRevelar}
                            className="grid gap-8 text-black/60 md:grid-cols-2"
                        >
                            <div className="text-xs sm:text-base">
                                <p className="leading-relaxed">
                                    O MyJapan nasceu numa sala de aula do SENAI, de uma pergunta simples: por que
                                    planejar uma viagem ao Japão ainda parece difícil? Reunimos roteiros, estações e
                                    destinos num lugar só, em português e sem jargão.
                                </p>
                            </div>
                            <div className="text-xs sm:text-base">
                                <p className="leading-relaxed">
                                    Cada página é feita para quem nunca foi: a experiência 3D da bandeira, a galeria de
                                    destinos e os textos existem para transformar um país distante em algo que dá
                                    vontade — e dá para começar a planejar hoje.
                                </p>
                            </div>
                        </TimelineContent>
                    </div>

                    <div className="md:col-span-1">
                        <div className="text-right">
                            <TimelineContent
                                as="div"
                                animationNum={6}
                                customVariants={variantesRevelar}
                                className="mb-2 text-2xl font-bold text-japao-vermelho"
                            >
                                MYJAPAN
                            </TimelineContent>
                            <TimelineContent
                                as="div"
                                animationNum={7}
                                customVariants={variantesRevelar}
                                className="mb-8 text-sm text-black/60"
                            >
                                Projeto acadêmico · SENAI
                            </TimelineContent>
                            <TimelineContent
                                as="div"
                                animationNum={8}
                                customVariants={variantesRevelar}
                                className="mb-6"
                            >
                                <p className="mb-4 font-medium">Pronto para escolher a sua primeira parada?</p>
                            </TimelineContent>
                            <TimelineContent
                                as="button"
                                animationNum={9}
                                customVariants={variantesRevelar}
                                type="button"
                                onClick={() => setModalAberto(true)}
                                className="ml-auto flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-black/10 bg-japao-tinta px-5 py-3 font-semibold text-white shadow-lg shadow-black/20 transition-all duration-300 ease-in-out hover:gap-4 hover:bg-black focus-visible:ring-2 focus-visible:ring-japao-vermelho focus-visible:ring-offset-2 focus-visible:outline-none"
                            >
                                FALE COM A GENTE <ArrowRight size={18} />
                            </TimelineContent>
                        </div>
                    </div>
                </div>
            </div>

            <ModalContato aberto={modalAberto} aoFechar={() => setModalAberto(false)} />
        </section>
    );
}
