/* ===========================================================================
   Página "Planeje a sua viagem".

   JS puro em vez de ilha React: aqui não há estado compartilhado com o resto
   do site — é uma página com parallax, carrossel, globo e um planejador que
   vive num pop-up. O módulo inteiro é carregado sob demanda pelo app.jsx,
   então nenhuma outra página paga por gsap/swiper/cobe.
   =========================================================================== */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Swiper from 'swiper';
import { EffectCreative, Pagination } from 'swiper/modules';
import createGlobe from 'cobe';
import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/pagination';

import { MAPA } from './mapa-japao';

const IMG = {
    senso: '/images/planeje/senso.webp',
    tower: '/images/planeje/tower.webp',
    ghibli_museu: '/images/planeje/ghibli_museu.webp',
    ghibli_park: '/images/planeje/ghibli_park.webp',
    teamlab: '/images/planeje/teamlab.webp',
    disneysea: '/images/planeje/disneysea.webp',
    universal: '/images/planeje/universal.webp',
    nara: '/images/planeje/nara.webp',
    osaka: '/images/planeje/osaka.webp',
    koya: '/images/planeje/koya.webp',
    kenroku: '/images/planeje/kenroku.webp',
    pokemon: '/images/planeje/pokemon.webp',
};

/* ---------------------------------------------------------------- parallax */
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({ ignoreMobileResize: true });

const alvo = document.querySelector('[data-parallax-layers]');
if (alvo) {
    // scrub com inércia (0.6s de catch-up) em vez de 0: o scroll nativo entrega
    // saltos grandes de uma vez, e sem amortecimento as camadas "pulam".
    const tl = gsap.timeline({
        scrollTrigger: { trigger: alvo, start: '0% 0%', end: '100% 0%', scrub: 0.6, invalidateOnRefresh: true },
    });
    [
        // 100% = a camada anda exatamente o mesmo que o scroll (o trigger tem a
        // altura da própria camada), então o fundo fica travado na tela e o topo
        // do banner não se mexe. As de cima andam menos = parallax.
        { camada: '1', yPercent: 93 },
        { camada: '2', yPercent: 93 },
        { camada: '3', yPercent: 50 },
        { camada: '4', yPercent: 10 },
    ].forEach((o, i) => {
        tl.to(alvo.querySelectorAll(`[data-parallax-layer="${o.camada}"]`), { yPercent: o.yPercent, ease: 'none' }, i === 0 ? undefined : '<');
    });
}

/* Sem Lenis: o scroll é o nativo do navegador.
   O suavizador sequestra o evento da roda do mouse e, com o pop-up por cima
   (ou depois de qualquer stop() que não voltasse), a página simplesmente
   parava de rolar. O ScrollTrigger funciona igual no scroll nativo. */

/* ------------------------------------------------- botão: letras animadas */
const ROTULO = 'Planejar viagem';
document.getElementById('btn-texto').innerHTML = [...ROTULO]
    .map((c) => `<span class="btn-letter">${c === ' ' ? '&nbsp;' : c}</span>`)
    .join('');

/* ---------------------------------------------------------------- utilidades */
const IENE = 0.038; // ¥1 ≈ R$ 0,038 — só para dar ordem de grandeza na maquete
const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

/* =========================================================================
   CARDS DO CHECKLIST
   ========================================================================= */
const CHECKLIST = [
    { k: 'Documentos', t: 'Passaporte e documentação', d: 'Verifique a validade do passaporte, a exigência de visto, o seguro viagem e as regras de entrada no país.', img: IMG.senso },
    { k: 'Dinheiro', t: 'Planejamento financeiro', d: 'Calcule passagens, hospedagem, alimentação, transporte interno e passeios. Crie uma meta mensal de economia.', img: IMG.osaka },
    { k: 'Logística', t: 'Hospedagem e transporte', d: 'Pesquise bairros, proximidade do metrô e opções de transporte público. No Japão, o sistema é moderno e eficiente.', img: IMG.tower },
    { k: 'Calendário', t: 'Roteiro e época do ano', d: 'Escolha a melhor estação para a sua viagem. Primavera (sakura) e outono são as mais populares.', img: IMG.kenroku },
    { k: 'No bolso', t: 'Aplicativos úteis', d: 'Google Maps, tradutores offline, apps de transporte e de reserva facilitam muito a viagem.', img: IMG.pokemon },
    { k: 'Etiqueta', t: 'Cultura e costumes', d: 'Aprender sobre etiqueta local, respeito e organização evita situações desconfortáveis e melhora a experiência.', img: IMG.nara },
];

document.getElementById('cards').innerHTML = CHECKLIST.map((c) => `
  <article class="card" tabindex="0" style="background-image:url('${c.img}')">
    <div class="card__txt">
      <p class="k">${c.k}</p>
      <h3>${c.t}</h3>
      <p class="d">${c.d}</p>
    </div>
  </article>`).join('');

/* =========================================================================
   CARROSSEL DE ATRAÇÕES + TEXTO QUE REANIMA A CADA TROCA
   ========================================================================= */
const ATRACOES = [
    { img: IMG.teamlab, local: 'Toyosu · Tóquio', nome: 'teamLab Planets', tags: ['Arte digital', '2 h de visita', 'Entrada por horário'],
      txt: 'Um museu que se atravessa descalço: a água chega aos joelhos, o chão vira espelho e as projeções reagem a quem passa. Compre com semanas de antecedência — os horários esgotam.' },
    { img: IMG.senso, local: 'Asakusa · Tóquio', nome: 'Templo Senso-ji', tags: ['Gratuito', 'Manhã cedo', 'Nakamise-dori'],
      txt: 'O templo mais antigo de Tóquio, e o mais movimentado. Vá antes das 8h: a rua de lojinhas fica vazia e a lanterna vermelha do portão é toda sua.' },
    { img: IMG.ghibli_museu, local: 'Mitaka · Tóquio', nome: 'Museu Ghibli', tags: ['Ingresso por sorteio', 'Sem fotos', '2 h de visita'],
      txt: 'Pequeno, íntimo e sem roteiro fixo — a ideia é se perder pelos corredores. Os ingressos saem por sorteio mensal, então entre na fila antes de fechar as datas da viagem.' },
    { img: IMG.disneysea, local: 'Urayasu · Chiba', nome: 'Tokyo DisneySea', tags: ['Dia inteiro', 'Preço por data', 'Único no mundo'],
      txt: 'Não existe outro parque como este em nenhum outro país. Chegue na abertura, comece pelo fundo do mapa e deixe a área do vulcão para o fim da tarde.' },
    { img: IMG.universal, local: 'Osaka', nome: 'Universal Studios Japan', tags: ['Super Nintendo World', 'Dia inteiro', 'Senha por horário'],
      txt: 'A Super Nintendo World é o motivo da fila — e costuma exigir senha por horário no aplicativo do parque. Vale um dia inteiro e chegar antes do portão abrir.' },
    { img: IMG.nara, local: 'Nara', tags: ['Bate e volta', 'Gratuito', '40 min de Kyoto'], nome: 'Nara Park',
      txt: 'Os cervos circulam soltos pelo parque e fazem reverência por um biscoito. Dá para juntar com o Todai-ji e voltar para Kyoto no fim da tarde.' },
    { img: IMG.osaka, local: 'Osaka', nome: 'Castelo de Osaka', tags: ['Parque gratuito', 'Vista do alto', 'Sakura'],
      txt: 'O castelo reconstruído guarda um museu por dentro e um dos melhores parques de cerejeira do país por fora. O topo entrega Osaka inteira em 360°.' },
    { img: IMG.kenroku, local: 'Kanazawa', nome: 'Jardim Kenroku-en', tags: ['Um dos 3 grandes', 'Cedo é grátis', 'Inverno'],
      txt: 'Um dos três jardins mais bonitos do Japão, e o mais fotogênico no inverno, quando as cordas de proteção dos pinheiros viram desenho na neve.' },
];

document.getElementById('slides').innerHTML = ATRACOES
    .map((a) => `<div class="swiper-slide"><img src="${a.img}" alt="${a.nome}" loading="lazy" /></div>`).join('');

const elLocal = document.getElementById('atracao-local');
const elNome = document.getElementById('atracao-nome');
const elTxt = document.getElementById('atracao-txt');
const elTags = document.getElementById('atracao-tags');

/* Divide em pedaços e anima com stagger — o mesmo gesto do SplitText, só que
   sem o plugin pago: para um texto curto, palavra a palavra basta. */
function animarTexto(el, texto, tipo) {
    const partes = tipo === 'chars' ? [...texto] : texto.split(' ');
    el.innerHTML = partes.map((p) => `<span>${p === ' ' ? '&nbsp;' : p}${tipo === 'chars' ? '' : ' '}</span>`).join('');
    gsap.fromTo(el.querySelectorAll('span'),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: tipo === 'chars' ? 0.02 : 0.035, overwrite: true });
}

function mostrarAtracao(i) {
    const a = ATRACOES[i];
    elLocal.textContent = a.local;
    animarTexto(elNome, a.nome, 'chars');
    animarTexto(elTxt, a.txt, 'words');
    elTags.innerHTML = a.tags.map((t) => `<span class="tag">${t}</span>`).join('');
}

const swiper = new Swiper('#swiper-atracoes', {
    modules: [EffectCreative, Pagination],
    effect: 'creative',
    grabCursor: true,
    slidesPerView: 'auto',
    centeredSlides: true,
    loop: true,
    pagination: { el: '.swiper-pagination', clickable: true },
    creativeEffect: {
        prev: { shadow: true, origin: 'left center', translate: ['-5%', 0, -200], rotate: [0, 100, 0] },
        next: { origin: 'right center', translate: ['5%', 0, -200], rotate: [0, -100, 0] },
    },
    on: { slideChange: (s) => mostrarAtracao(s.realIndex) },
});
mostrarAtracao(0);

/* =========================================================================
   GLOBO — voos do Brasil para o Japão
   ========================================================================= */
const BR = [
    { id: 'gru', nome: 'GRU · São Paulo', loc: [-23.4356, -46.4731] },
    { id: 'gig', nome: 'GIG · Rio de Janeiro', loc: [-22.809, -43.2506] },
    { id: 'bsb', nome: 'BSB · Brasília', loc: [-15.8697, -47.9208] },
    { id: 'vcp', nome: 'VCP · Campinas', loc: [-23.0074, -47.1345] },
    { id: 'rec', nome: 'REC · Recife', loc: [-8.1264, -34.9236] },
];
const JP = [
    { id: 'nrt', nome: 'NRT · Narita', loc: [35.7647, 140.3863] },
    { id: 'hnd', nome: 'HND · Haneda', loc: [35.5494, 139.7798] },
    { id: 'kix', nome: 'KIX · Kansai', loc: [34.4342, 135.2325] },
    { id: 'ngo', nome: 'NGO · Chubu', loc: [34.8584, 136.8054] },
    { id: 'cts', nome: 'CTS · Sapporo', loc: [42.7752, 141.6923] },
    { id: 'fuk', nome: 'FUK · Fukuoka', loc: [33.5859, 130.45] },
];
const ROTAS = [
    ['gru', 'nrt'], ['gru', 'hnd'], ['gig', 'nrt'], ['vcp', 'kix'], ['bsb', 'hnd'], ['rec', 'nrt'],
];

/* Dois grupos rotulados em vez de uma lista corrida: onde o voo começa e
   onde ele termina — a mesma informação, mas legível de relance. */
const listaTags = (lista) => lista.map((a) => `<span class="tag">${a.nome}</span>`).join('');
document.getElementById('aeroportos').innerHTML = `
  <div class="grupo">
    <p class="grupo__rotulo">Saídas no Brasil</p>
    <div class="grupo__tags">${listaTags(BR)}</div>
  </div>
  <div class="grupo">
    <p class="grupo__rotulo">Chegadas no Japão</p>
    <div class="grupo__tags">${listaTags(JP)}</div>
  </div>`;

const CIAS = [
    { n: 'GOL', r: 'Conexão via parceiras (American, Air France, KLM)', u: 'https://www.voegol.com.br' },
    { n: 'Azul', r: 'Conexão via United, Turkish e parceiras', u: 'https://www.voeazul.com.br' },
    { n: 'LATAM', r: 'GRU e GIG com conexão em LAX, JFK ou Madri', u: 'https://www.latamairlines.com/br/pt' },
    { n: 'ITA Airways', r: 'GRU via Roma Fiumicino até Tóquio Haneda', u: 'https://www.itaspa.com' },
];
document.getElementById('cias').innerHTML = CIAS.map((c) => `
  <a class="cia" href="${c.u}" target="_blank" rel="noopener noreferrer">
    <i>Companhia</i><b>${c.n}</b><span>${c.r}</span>
  </a>`).join('');

const canvas = document.getElementById('globo-canvas');
let phi = 4.2, offsetPhi = 0, arrastando = null, globo = null, quadro = 0;

function iniciarGlobo() {
    const largura = canvas.offsetWidth;
    if (!largura || globo) return;

    const comum = {
        dark: 0,
        mapBrightness: 9,
        baseColor: [0.95, 0.93, 0.9],
        markerColor: [0.74, 0.02, 0.2],
        arcColor: [0.74, 0.02, 0.2],
        markerElevation: 0.01,
        markers: [...BR, ...JP].map((a) => ({ location: a.loc, size: 0.028, id: a.id })),
        arcs: ROTAS.map(([de, para]) => ({
            from: [...BR, ...JP].find((a) => a.id === de).loc,
            to: [...BR, ...JP].find((a) => a.id === para).loc,
            id: `${de}-${para}`,
        })),
    };

    globo = createGlobe(canvas, {
        ...comum,
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width: largura,
        height: largura,
        phi: 0,
        theta: 0.25,
        diffuse: 1.5,
        mapSamples: 16000,
        glowColor: [0.95, 0.93, 0.91],
        arcWidth: 0.6,
        arcHeight: 0.34,
        opacity: 0.92,
    });

    /* O globo só desenha quando está na tela: rodar WebGL (e ler estilo dos
       pinos) enquanto o usuário está lá em cima no hero é trabalho puro perdido
       — era isso que engasgava o parallax. */
    let naTela = false;
    new IntersectionObserver(([e]) => {
        naTela = e.isIntersecting;
        if (naTela && !quadro) girar();
        if (!naTela && quadro) { cancelAnimationFrame(quadro); quadro = 0; }
    }, { threshold: 0 }).observe(canvas);

    function girar() {
        if (arrastando === null) phi += 0.0022;
        globo.update({ ...comum, phi: phi + offsetPhi, theta: 0.25 });
        posicionarPontos();
        quadro = naTela ? requestAnimationFrame(girar) : 0;
    }

    requestAnimationFrame(() => (canvas.style.opacity = '1'));
}

/* Balão do aeroporto.
   O próprio cobe já publica a posição de cada marcador: ele cria um elemento
   âncora por id (anchor-name: --cobe-<id>) e uma variável --cobe-visible-<id>
   com 0..1 conforme o ponto está de frente. Ler dele é mais exato — e mais
   barato de manter — do que refazer a projeção da esfera aqui. */
const pontos = document.getElementById('globo-pontos');
const balao = document.createElement('div');
balao.className = 'globo__balao';
pontos.appendChild(balao);

const marcadores = [...BR, ...JP].map((a) => {
    const el = document.createElement('div');
    el.className = 'globo__ponto';
    el.addEventListener('pointerenter', () => {
        balao.textContent = a.nome;
        balao.style.left = el.style.left;
        balao.style.top = el.style.top;
        balao.dataset.vis = '1';
    });
    el.addEventListener('pointerleave', () => { balao.dataset.vis = '0'; });
    pontos.appendChild(el);
    return { ...a, el, ancora: null };
});

let passo = 0;
function posicionarPontos() {
    if (passo++ % 6) return; // 10 fps basta para um ponto de 22px
    // Uma leitura de estilo por passagem (e não uma por marcador): cada
    // getComputedStyle força o navegador a recalcular estilo.
    const raiz = getComputedStyle(document.documentElement);
    marcadores.forEach((m) => {
        if (!m.ancora) m.ancora = document.querySelector(`[style*="--cobe-${m.id};"]`);
        if (!m.ancora) return;
        // O cobe apaga a variável quando o ponto passa para trás da esfera —
        // a presença dela é o sinal de visibilidade (o valor em si não é numérico).
        const visivel = raiz.getPropertyValue(`--cobe-visible-${m.id}`).trim() !== '';
        m.el.style.display = visivel ? 'block' : 'none';
        if (!visivel) {
            if (balao.textContent === m.nome) balao.dataset.vis = '0';
            return;
        }
        m.el.style.left = m.ancora.style.left;
        m.el.style.top = m.ancora.style.top;
        if (balao.dataset.vis === '1' && balao.textContent === m.nome) {
            balao.style.left = m.el.style.left;
            balao.style.top = m.el.style.top;
        }
    });
}

canvas.addEventListener('pointerdown', (e) => { arrastando = e.clientX - offsetPhi * 220; canvas.style.cursor = 'grabbing'; });
window.addEventListener('pointerup', () => { arrastando = null; canvas.style.cursor = 'grab'; });
window.addEventListener('pointermove', (e) => { if (arrastando !== null) offsetPhi = (e.clientX - arrastando) / 220; });

/* O módulo é carregado sob demanda pelo app.jsx, e isso pode acontecer depois
   do evento load — por isso a inicialização é direta, com o ResizeObserver
   cobrindo o caso de o canvas ainda não ter largura. */
if (canvas.offsetWidth > 0) iniciarGlobo();
else new ResizeObserver((e, ro) => { if (e[0].contentRect.width > 0) { ro.disconnect(); iniciarGlobo(); } }).observe(canvas);

/* ===========================================================================
   PLANEJADOR — o pop-up que o botão "Planejar viagem" abre.
   Cinco passos: datas → destinos → dias por destino → atrações → roteiro/PDF.
   Preços e diárias são de referência, definidos aqui mesmo: quando existir
   back-end, é este bloco de dados que sai daqui.
   =========================================================================== */

/* Hospedagens por cidade (diária média em reais). */
const HOTEIS_CIDADE = {
    toquio: [
        { nome: 'Shinjuku Granbell', tipo: 'Business hotel', preco: 380, nota: 'a 5 min da estação de Shinjuku' },
        { nome: 'Nine Hours Asakusa', tipo: 'Cápsula', preco: 130, nota: 'ao lado do Senso-ji' },
        { nome: 'Hoshinoya Tokyo', tipo: 'Ryokan urbano', preco: 1900, nota: 'onsen no último andar, no centro financeiro' },
    ],
    kyoto: [
        { nome: 'Kyoto Station Inn', tipo: 'Business hotel', preco: 340, nota: 'em cima da estação central' },
        { nome: 'Gion Ryokan Q-beh', tipo: 'Ryokan', preco: 720, nota: 'dentro do bairro antigo de Gion' },
        { nome: 'Piece Hostel Sanjo', tipo: 'Hostel', preco: 160, nota: 'perto do rio Kamo' },
    ],
    osaka: [
        { nome: 'Namba Oriental', tipo: 'Business hotel', preco: 350, nota: 'a pé do Dotonbori' },
        { nome: 'Umeda Sky Suites', tipo: 'Apartamento', preco: 520, nota: 'bom para grupos, com cozinha' },
        { nome: 'Book and Bed Shinsaibashi', tipo: 'Cápsula', preco: 140, nota: 'cama dentro de uma estante de livros' },
    ],
    sapporo: [
        { nome: 'Susukino Grand', tipo: 'Business hotel', preco: 300, nota: 'no centro da vida noturna' },
        { nome: 'Jozankei Onsen Ryokan', tipo: 'Ryokan com onsen', preco: 890, nota: '40 min do centro, nas montanhas' },
        { nome: 'Sapporo Guest House', tipo: 'Hostel', preco: 120, nota: 'simples e perto do Parque Odori' },
    ],
    nagoya: [
        { nome: 'Nagoya Station Tower', tipo: 'Business hotel', preco: 330, nota: 'conexão direta para o Ghibli Park' },
        { nome: 'Ryokan Meiryu', tipo: 'Ryokan', preco: 480, nota: 'tatame e banho comunitário' },
        { nome: 'Glocal Nagoya', tipo: 'Hostel', preco: 130, nota: 'quarto compartilhado no centro' },
    ],
    fukuoka: [
        { nome: 'Hakata Green', tipo: 'Business hotel', preco: 290, nota: 'ao lado da estação de Hakata' },
        { nome: 'Ryokan Kashima Honkan', tipo: 'Ryokan', preco: 520, nota: 'casa de madeira tombada' },
        { nome: 'Fukuoka Hana Hostel', tipo: 'Hostel', preco: 110, nota: 'a 10 min do centro' },
    ],
    kanazawa: [
        { nome: 'Kanazawa Station Hotel', tipo: 'Business hotel', preco: 320, nota: 'em frente ao portão Tsuzumi' },
        { nome: 'Sumiyoshiya', tipo: 'Ryokan', preco: 690, nota: 'ryokan de 1830, perto do Kenroku-en' },
        { nome: 'Pongyi Guesthouse', tipo: 'Hostel', preco: 125, nota: 'casa de chá reformada' },
    ],
    nara: [
        { nome: 'Nara Hotel', tipo: 'Hotel histórico', preco: 640, nota: 'aberto desde 1909, dentro do parque' },
        { nome: 'Guesthouse Nara Backpackers', tipo: 'Hostel', preco: 135, nota: 'casa tradicional com jardim' },
        { nome: 'Comfort Nara', tipo: 'Business hotel', preco: 280, nota: 'a 3 min da estação JR' },
    ],
    hiroshima: [
        { nome: 'Rihga Royal Hiroshima', tipo: 'Hotel', preco: 410, nota: 'vista do castelo e do parque' },
        { nome: 'Miyajima Grand Arimoto', tipo: 'Ryokan com onsen', preco: 950, nota: 'na ilha, com o torii flutuante à frente' },
        { nome: 'Hostel Mallika', tipo: 'Hostel', preco: 115, nota: 'perto do Parque da Paz' },
    ],
};

/* Atrações por cidade — jpy 0 significa entrada gratuita. */
const ATRACOES_CIDADE = {
    toquio: [
        { nome: 'teamLab Planets', jpy: 3800 }, { nome: 'Templo Senso-ji', jpy: 0 },
        { nome: 'Tokyo Skytree', jpy: 2400 }, { nome: 'Tokyo Tower', jpy: 1200 },
        { nome: 'Museu Ghibli (Mitaka)', jpy: 1000 }, { nome: 'Pokémon Café', jpy: 2500 },
        { nome: 'Cruzamento de Shibuya', jpy: 0 }, { nome: 'Parque Ueno', jpy: 0 },
    ],
    kyoto: [
        { nome: 'Fushimi Inari Taisha', jpy: 0 }, { nome: 'Kinkaku-ji (Pavilhão Dourado)', jpy: 500 },
        { nome: 'Bambuzal de Arashiyama', jpy: 0 }, { nome: 'Kiyomizu-dera', jpy: 400 },
        { nome: 'Bairro de Gion', jpy: 0 },
    ],
    osaka: [
        { nome: 'Castelo de Osaka', jpy: 600 }, { nome: 'Universal Studios Japan', jpy: 8600 },
        { nome: 'Dotonbori', jpy: 0 }, { nome: 'Aquário Kaiyukan', jpy: 2700 },
    ],
    sapporo: [
        { nome: 'Parque Odori', jpy: 0 }, { nome: 'Mercado Nijo', jpy: 0 },
        { nome: 'Torre de TV de Sapporo', jpy: 1000 }, { nome: 'Museu da Cerveja Sapporo', jpy: 1000 },
    ],
    nagoya: [
        { nome: 'Ghibli Park', jpy: 3500 }, { nome: 'Castelo de Nagoya', jpy: 500 },
        { nome: 'Museu Toyota', jpy: 1000 }, { nome: 'Templo Osu Kannon', jpy: 0 },
    ],
    fukuoka: [
        { nome: 'Templo Tocho-ji', jpy: 0 }, { nome: 'Parque Ohori', jpy: 0 },
        { nome: 'Barracas de yatai em Nakasu', jpy: 0 }, { nome: 'Ruínas do Castelo de Fukuoka', jpy: 0 },
    ],
    kanazawa: [
        { nome: 'Jardim Kenroku-en', jpy: 320 }, { nome: 'Museu do Século 21', jpy: 450 },
        { nome: 'Bairro Higashi Chaya', jpy: 0 }, { nome: 'Mercado Omicho', jpy: 0 },
    ],
    nara: [
        { nome: 'Nara Park', jpy: 0 }, { nome: 'Todai-ji', jpy: 800 },
        { nome: 'Kasuga Taisha', jpy: 500 }, { nome: 'Jardim Isuien', jpy: 1200 },
    ],
    hiroshima: [
        { nome: 'Parque Memorial da Paz', jpy: 0 }, { nome: 'Museu Memorial da Paz', jpy: 200 },
        { nome: 'Ilha de Miyajima (balsa)', jpy: 180 }, { nome: 'Castelo de Hiroshima', jpy: 370 },
    ],
};

const MESES_NOME = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const DIAS_NOME = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

/* destinos: [{ id, hotel, dias }] — a ordem é a ordem do roteiro. */
const viagem = { ida: null, volta: null, destinos: [], atracoes: [] };

const iso = (d) => d.toISOString().slice(0, 10);
const dataBR = (d) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
const dataCurta = (d) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
const noites = () => (viagem.ida && viagem.volta ? Math.round((viagem.volta - viagem.ida) / 86400000) : 0);
const diasViagem = () => (noites() ? noites() + 1 : 0);
const diasDistribuidos = () => viagem.destinos.reduce((s, d) => s + d.dias, 0);
const nomeCidade = (id) => MAPA.pontos.find((p) => p.id === id)?.nome ?? id;

/* --------------------------------------------------------------- calendário */
let mesVisivel = new Date();
mesVisivel.setDate(1);

function desenharCalendario() {
    const grade = document.getElementById('pl-grade');
    const mes = MESES_NOME[mesVisivel.getMonth()];
    document.getElementById('pl-mes').textContent = `${mes[0].toUpperCase()}${mes.slice(1)} de ${mesVisivel.getFullYear()}`;

    const inicioSemana = new Date(mesVisivel).getDay();
    const totalDias = new Date(mesVisivel.getFullYear(), mesVisivel.getMonth() + 1, 0).getDate();
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);

    grade.innerHTML = DIAS_NOME.map((d) => `<span class="pl-cal__dia-nome">${d}</span>`).join('') +
        '<span></span>'.repeat(inicioSemana);

    for (let n = 1; n <= totalDias; n++) {
        const dia = new Date(mesVisivel.getFullYear(), mesVisivel.getMonth(), n);
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'pl-cal__dia';
        b.textContent = n;
        if (dia < hoje) b.disabled = true;
        if (viagem.ida && iso(dia) === iso(viagem.ida)) b.classList.add('e-ida');
        if (viagem.volta && iso(dia) === iso(viagem.volta)) b.classList.add('e-volta');
        if (viagem.ida && viagem.volta && dia > viagem.ida && dia < viagem.volta) b.classList.add('no-meio');
        b.dataset.iso = iso(dia);
        grade.appendChild(b);
    }
}

/* Um listener na grade em vez de um por dia: menos nós com escuta e nada para
   limpar quando o mês é redesenhado. */
document.getElementById('pl-grade').addEventListener('click', (e) => {
    const b = e.target.closest('.pl-cal__dia');
    if (b && !b.disabled) escolherDia(new Date(`${b.dataset.iso}T00:00:00`));
});

function escolherDia(dia) {
    // Primeiro clique marca a ida; o segundo, a volta. Clicar antes da ida recomeça.
    if (!viagem.ida || viagem.volta || dia <= viagem.ida) {
        viagem.ida = dia;
        viagem.volta = null;
    } else {
        viagem.volta = dia;
    }
    viagem.destinos.forEach((d) => { d.dias = 0; });
    pintarSelecao();
    atualizarResumoDatas();
}

/* Trocar de data só repinta as classes dos dias — redesenhar o mês inteiro a
   cada clique é trabalho jogado fora. */
function pintarSelecao() {
    document.querySelectorAll('.pl-cal__dia').forEach((b) => {
        const d = new Date(`${b.dataset.iso}T00:00:00`);
        b.classList.toggle('e-ida', !!viagem.ida && iso(d) === iso(viagem.ida));
        b.classList.toggle('e-volta', !!viagem.volta && iso(d) === iso(viagem.volta));
        b.classList.toggle('no-meio', !!(viagem.ida && viagem.volta && d > viagem.ida && d < viagem.volta));
    });
}

function atualizarResumoDatas() {
    const alvo = document.getElementById('pl-datas-resumo');
    if (viagem.ida && viagem.volta) {
        alvo.innerHTML = `<strong>${dataBR(viagem.ida)}</strong> até <strong>${dataBR(viagem.volta)}</strong> · ${diasViagem()} dias (${noites()} noites)`;
    } else if (viagem.ida) {
        alvo.innerHTML = `Ida em <strong>${dataBR(viagem.ida)}</strong>. Agora escolha a data da volta.`;
    } else {
        alvo.textContent = 'Escolha a data de ida e depois a data da volta.';
    }
    document.getElementById('pl-ir-2').disabled = !(viagem.ida && viagem.volta);
}

document.getElementById('pl-mes-ant').addEventListener('click', () => {
    mesVisivel.setMonth(mesVisivel.getMonth() - 1); desenharCalendario();
});
document.getElementById('pl-mes-prox').addEventListener('click', () => {
    mesVisivel.setMonth(mesVisivel.getMonth() + 1); desenharCalendario();
});

/* -------------------------------------------------------------------- mapa */
const svgMapa = document.getElementById('pl-mapa');
svgMapa.setAttribute('viewBox', `0 0 ${MAPA.w} ${MAPA.h}`);
svgMapa.innerHTML =
    `<path d="${MAPA.d}" class="pl-mapa__terra" />` +
    MAPA.pontos.map((p) => `
      <g class="pl-mapa__ponto" data-cidade="${p.id}" tabindex="0" role="button" aria-label="${p.nome}">
        <circle cx="${p.x}" cy="${p.y}" r="9" class="pl-mapa__alvo" />
        <circle cx="${p.x}" cy="${p.y}" r="5" class="pl-mapa__pino" />
        <text x="${p.x + 11}" y="${p.y + 4}">${p.nome}</text>
      </g>`).join('');

svgMapa.addEventListener('click', (e) => {
    const g = e.target.closest('.pl-mapa__ponto');
    if (g) alternarCidade(g.dataset.cidade);
});
svgMapa.addEventListener('keydown', (e) => {
    const g = e.target.closest('.pl-mapa__ponto');
    if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); alternarCidade(g.dataset.cidade); }
});

/* Lista de cidades ao lado do mapa: no mapa Kyoto, Nara e Osaka quase se
   encostam, e clicar num alvo de 9px não é para todo mundo. */
const listaCidades = document.getElementById('pl-cidades');
MAPA.pontos.forEach((p) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = p.nome;
    b.dataset.cidade = p.id;
    listaCidades.appendChild(b);
});
listaCidades.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) alternarCidade(b.dataset.cidade);
});

function alternarCidade(id) {
    const i = viagem.destinos.findIndex((d) => d.id === id);
    if (i >= 0) viagem.destinos.splice(i, 1);
    else viagem.destinos.push({ id, hotel: null, dias: 0 });
    desenharDestinos();
}

function desenharDestinos() {
    const escolhidas = viagem.destinos.map((d) => d.id);
    svgMapa.querySelectorAll('.pl-mapa__ponto').forEach((g) => g.classList.toggle('ativo', escolhidas.includes(g.dataset.cidade)));
    listaCidades.querySelectorAll('button').forEach((b) => b.classList.toggle('ativo', escolhidas.includes(b.dataset.cidade)));

    const caixa = document.getElementById('pl-hoteis');
    if (!viagem.destinos.length) {
        caixa.innerHTML = '<p class="pl-rotulo">Nenhuma cidade escolhida ainda</p>';
        document.getElementById('pl-ir-3').disabled = true;
        return;
    }

    caixa.innerHTML = viagem.destinos.map((destino) => `
      <p class="pl-grupo-titulo">Hospedagem em ${nomeCidade(destino.id)}</p>` +
      HOTEIS_CIDADE[destino.id].map((h, i) => `
        <label class="pl-opcao">
          <input type="radio" name="hotel-${destino.id}" value="${i}" ${destino.hotel === h ? 'checked' : ''} />
          <span>
            <b>${h.nome}</b>
            <em>${h.tipo} · ${brl(h.preco)} a diária</em>
            <small>${h.nota}</small>
          </span>
        </label>`).join('')).join('');

    conferirDestinos();
}

document.getElementById('pl-hoteis').addEventListener('change', (e) => {
    const r = e.target;
    if (r.type !== 'radio') return;
    const id = r.name.replace('hotel-', '');
    const destino = viagem.destinos.find((d) => d.id === id);
    if (destino) destino.hotel = HOTEIS_CIDADE[id][Number(r.value)];
    conferirDestinos();
});

function conferirDestinos() {
    document.getElementById('pl-ir-3').disabled = !(viagem.destinos.length && viagem.destinos.every((d) => d.hotel));
}

/* ------------------------------------------------------- dias por destino */
function desenharDivisao() {
    const total = diasViagem();
    document.getElementById('pl-dias-ajuda').textContent =
        `Você tem ${total} dias de viagem. Distribua entre ${viagem.destinos.length === 1 ? 'a cidade escolhida' : `as ${viagem.destinos.length} cidades escolhidas`}.`;

    // Só na primeira vez (ou quando as datas mudaram e zeraram tudo): divide por
    // igual e joga a sobra na primeira cidade. Depois disso, quem manda é o usuário.
    if (diasDistribuidos() === 0) {
        const base = Math.floor(total / viagem.destinos.length);
        viagem.destinos.forEach((d) => { d.dias = base; });
        viagem.destinos[0].dias += total - base * viagem.destinos.length;
    }

    const caixa = document.getElementById('pl-divisao');
    caixa.innerHTML = viagem.destinos.map((d) => `
      <div class="pl-dia-linha" data-cidade="${d.id}">
        <span><b>${nomeCidade(d.id)}</b><em>${d.hotel.nome} · ${brl(d.hotel.preco)} a diária</em></span>
        <span class="pl-stepper">
          <button type="button" data-passo="-1" aria-label="Menos um dia">−</button>
          <span class="pl-stepper__n">${d.dias} ${d.dias === 1 ? 'dia' : 'dias'}</span>
          <button type="button" data-passo="1" aria-label="Mais um dia">+</button>
        </span>
      </div>`).join('');

    atualizarSaldo();
}

/* Clicar no +/- mexe só no número daquela linha e no saldo — refazer a lista
   inteira a cada clique pisca a tela e joga fora os nós que já estavam certos. */
document.getElementById('pl-divisao').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const linha = b.closest('.pl-dia-linha');
    const destino = viagem.destinos.find((d) => d.id === linha.dataset.cidade);
    const passo = Number(b.dataset.passo);
    if (passo < 0 && destino.dias === 0) return;
    if (passo > 0 && diasDistribuidos() >= diasViagem()) return;
    destino.dias += passo;
    linha.querySelector('.pl-stepper__n').textContent = `${destino.dias} ${destino.dias === 1 ? 'dia' : 'dias'}`;
    atualizarSaldo();
});

function atualizarSaldo() {
    const total = diasViagem();
    const faltam = total - diasDistribuidos();
    const saldo = document.getElementById('pl-dias-saldo');
    saldo.textContent = faltam === 0
        ? `Todos os ${total} dias distribuídos.`
        : `Faltam ${faltam} ${faltam === 1 ? 'dia' : 'dias'} para distribuir.`;
    saldo.className = faltam === 0 ? 'e-ok' : 'e-falta';
    document.getElementById('pl-ir-4').disabled = faltam !== 0;
    // Trava o + de todas as linhas quando não sobra dia, e o − de quem está em 0.
    document.querySelectorAll('.pl-dia-linha').forEach((linha) => {
        const d = viagem.destinos.find((x) => x.id === linha.dataset.cidade);
        linha.querySelector('[data-passo="1"]').disabled = faltam === 0;
        linha.querySelector('[data-passo="-1"]').disabled = d.dias === 0;
    });
}

/* ---------------------------------------------------------------- atrações */
function desenharAtracoes() {
    const lista = document.getElementById('pl-atracoes');
    lista.innerHTML = viagem.destinos.map((d) => `
      <p class="pl-grupo-titulo">${nomeCidade(d.id)} · ${d.dias} ${d.dias === 1 ? 'dia' : 'dias'}</p>` +
      ATRACOES_CIDADE[d.id].map((a, i) => `
        <label class="pl-opcao">
          <input type="checkbox" data-cidade="${d.id}" value="${i}" ${viagem.atracoes.includes(a) ? 'checked' : ''} />
          <span>
            <b>${a.nome}</b>
            <em class="${a.jpy === 0 ? 'e-gratis' : ''}">${a.jpy === 0 ? 'Entrada gratuita' : `¥${a.jpy.toLocaleString('pt-BR')} · ${brl(a.jpy * IENE)}`}</em>
          </span>
        </label>`).join('')).join('');

    atualizarTotalAtracoes();
}

document.getElementById('pl-atracoes').addEventListener('change', (e) => {
    if (e.target.type !== 'checkbox') return;
    viagem.atracoes = [...document.querySelectorAll('#pl-atracoes input:checked')]
        .map((x) => ATRACOES_CIDADE[x.dataset.cidade][Number(x.value)]);
    atualizarTotalAtracoes();
});

function atualizarTotalAtracoes() {
    document.getElementById('pl-total-atracoes').textContent = viagem.atracoes.length
        ? `${viagem.atracoes.length} selecionadas · ingressos ${brl(custoAtracoes())}`
        : 'Nenhuma selecionada ainda';
}

const atracoesDaCidade = (id) => viagem.atracoes.filter((a) => ATRACOES_CIDADE[id].includes(a));
const custoAtracoes = () => viagem.atracoes.reduce((s, a) => s + a.jpy * IENE, 0);
const custoHotel = () => viagem.destinos.reduce((s, d) => s + (d.hotel ? d.hotel.preco * d.dias : 0), 0);

/* Datas de entrada e saída de cada cidade, na ordem escolhida. */
function trechos() {
    let cursor = 0;
    return viagem.destinos.map((d) => {
        const entrada = new Date(viagem.ida.getTime() + cursor * 86400000);
        cursor += d.dias;
        const saida = new Date(viagem.ida.getTime() + (cursor - 1) * 86400000);
        return { ...d, entrada, saida };
    });
}

/* ------------------------------------------------------------------ roteiro */
function montarRoteiro() {
    const t = trechos();
    document.getElementById('pl-roteiro').innerHTML = `
      <div class="pl-cartoes">
        <div class="pl-cartao"><p>Datas</p><b>${dataCurta(viagem.ida)} — ${dataCurta(viagem.volta)}</b></div>
        <div class="pl-cartao"><p>Duração</p><b>${diasViagem()} dias</b></div>
        <div class="pl-cartao"><p>Cidades</p><b>${viagem.destinos.length}</b></div>
        <div class="pl-cartao"><p>Atrações</p><b>${viagem.atracoes.length}</b></div>
        <div class="pl-cartao pl-cartao--destaque"><p>Estimativa</p><b>${brl(custoHotel() + custoAtracoes())}</b></div>
      </div>
      <div class="pl-linha-tempo">
        ${t.map((trecho) => {
            const atr = atracoesDaCidade(trecho.id);
            return `<div class="pl-etapa">
              <h5>${nomeCidade(trecho.id)} · ${trecho.dias} ${trecho.dias === 1 ? 'dia' : 'dias'}</h5>
              <p>${dataCurta(trecho.entrada)} a ${dataCurta(trecho.saida)} · ${trecho.hotel.nome} (${trecho.hotel.tipo}) — ${brl(trecho.hotel.preco * trecho.dias)}</p>
              ${atr.length ? `<ul>${atr.map((a) => `<li>${a.nome} — ${a.jpy === 0 ? 'gratuita' : brl(a.jpy * IENE)}</li>`).join('')}</ul>`
                           : '<p>Sem atrações marcadas nesta cidade.</p>'}
            </div>`;
        }).join('')}
      </div>
      <p class="pl-nota">Hospedagem ${brl(custoHotel())} + ingressos ${brl(custoAtracoes())}. Passagem, alimentação e transporte interno ficam de fora — valores de referência.</p>`;
    montarImpressao();
}

/* O PDF sai pela impressão do navegador (Salvar como PDF): cabeçalho, rodapé e
   quebra de página já vêm de graça do @page. */
function montarImpressao() {
    const t = trechos();
    const linhas = [];
    t.forEach((trecho) => {
        const atr = atracoesDaCidade(trecho.id);
        for (let n = 0; n < trecho.dias; n++) {
            const d = new Date(trecho.entrada.getTime() + n * 86400000);
            const programa = n === 0 ? `Chegada em ${nomeCidade(trecho.id)} e check-in` : (atr[n - 1] ? atr[n - 1].nome : 'Dia livre');
            linhas.push(`<tr><td>${d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}</td><td>${nomeCidade(trecho.id)}</td><td>${programa}</td></tr>`);
        }
    });

    document.getElementById('roteiro-print').innerHTML = `
      <header class="rp__topo">
        <div><p class="rp__marca">日本 · MYJAPAN</p><h1>Roteiro de viagem</h1></div>
        <p class="rp__destino">${viagem.destinos.map((d) => nomeCidade(d.id)).join(' · ')}<br><span>${dataBR(viagem.ida)} — ${dataBR(viagem.volta)}</span></p>
      </header>
      <section class="rp__resumo">
        <div><p>Duração</p><b>${diasViagem()} dias · ${noites()} noites</b></div>
        <div><p>Cidades</p><b>${viagem.destinos.length}</b></div>
        <div><p>Ingressos</p><b>${brl(custoAtracoes())}</b></div>
        <div><p>Estimativa</p><b>${brl(custoHotel() + custoAtracoes())}</b></div>
      </section>
      <h2>Dia a dia</h2>
      <table class="rp__tabela rp__dias"><thead><tr><th>Data</th><th>Cidade</th><th>Programação</th></tr></thead>
        <tbody>${linhas.join('')}</tbody></table>
      <h2>Hospedagem</h2>
      <table class="rp__tabela"><thead><tr><th>Cidade</th><th>Onde</th><th>Total</th></tr></thead><tbody>
        ${t.map((x) => `<tr><td>${nomeCidade(x.id)}</td><td>${x.hotel.nome} — ${x.hotel.tipo}</td><td>${brl(x.hotel.preco * x.dias)}</td></tr>`).join('')}
      </tbody></table>
      <h2>Atrações selecionadas</h2>
      <table class="rp__tabela"><thead><tr><th>Atração</th><th>Entrada</th></tr></thead><tbody>
        ${viagem.atracoes.map((a) => `<tr><td>${a.nome}</td><td>${a.jpy === 0 ? 'Gratuita' : `¥${a.jpy.toLocaleString('pt-BR')} · ${brl(a.jpy * IENE)}`}</td></tr>`).join('') ||
          '<tr><td colspan="2">Nenhuma atração selecionada.</td></tr>'}
      </tbody></table>
      <p class="rp__nota">Estimativa de ${brl(custoHotel() + custoAtracoes())} somando hospedagem e ingressos. Passagem, alimentação e transporte interno ficam de fora — valores de referência para planejamento.</p>
      <footer class="rp__rodape">
        <span>MyJapan · Projeto acadêmico, sem fins comerciais</span>
        <span>contato@myjapan.com.br</span>
      </footer>`;
}

/* --------------------------------------------------------------- navegação */
const plFundo = document.getElementById('pl-fundo');
const passos = [...document.querySelectorAll('.pl-passo')];

function irPara(n) {
    passos.forEach((p, i) => p.classList.toggle('ativo', i === n - 1));
    document.querySelectorAll('.pl-trilha span').forEach((s, i) => s.classList.toggle('ativo', i <= n - 1));
    // O rodapé mostra só os botões do passo atual.
    document.querySelectorAll('[data-so-em]').forEach((b) => { b.hidden = Number(b.dataset.soEm) !== n; });
    if (n === 3) desenharDivisao();
    if (n === 4) desenharAtracoes();
    if (n === 5) montarRoteiro();
    document.querySelector('.pl__corpo').scrollTo({ top: 0, behavior: 'smooth' });
}

const abrirPlanejador = () => {
    plFundo.hidden = false;
    requestAnimationFrame(() => { plFundo.dataset.aberto = '1'; });
    document.body.style.overflow = 'hidden';
    desenharCalendario();
    atualizarResumoDatas();
    desenharDestinos();
    irPara(1);
};
const fecharPlanejador = () => {
    plFundo.dataset.aberto = '0';
    document.body.style.overflow = '';
    // Espera a transição terminar antes de tirar do fluxo (e nada trava se o
    // usuário tiver animações reduzidas: o transitionend nunca vem, daí o timer).
    setTimeout(() => { if (plFundo.dataset.aberto === '0') plFundo.hidden = true; }, 260);
};

document.getElementById('abrir-planejador').addEventListener('click', abrirPlanejador);
document.getElementById('pl-fechar').addEventListener('click', fecharPlanejador);
plFundo.addEventListener('click', (e) => { if (e.target === plFundo) fecharPlanejador(); });
window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && plFundo.dataset.aberto === '1') fecharPlanejador(); });

[2, 3, 4, 5].forEach((n) => document.getElementById(`pl-ir-${n}`).addEventListener('click', () => irPara(n)));
document.querySelectorAll('[data-volta]').forEach((b) => b.addEventListener('click', () => irPara(Number(b.dataset.volta))));
document.getElementById('pl-exportar').addEventListener('click', () => window.print());

/* Verificação: ?selftest=1 confere as contas do planejador. */
if (import.meta.env.DEV && new URLSearchParams(location.search).has('selftest')) {
    const ok = (c, n) => console[c ? 'log' : 'error'](`${c ? 'ok  ' : 'FALHOU'} — ${n}`);
    viagem.ida = new Date(2026, 3, 10);
    viagem.volta = new Date(2026, 3, 17);
    ok(noites() === 7 && diasViagem() === 8, 'intervalo de datas vira 7 noites / 8 dias');

    viagem.destinos = [
        { id: 'toquio', hotel: { nome: 'A', tipo: 'x', preco: 300, nota: '' }, dias: 5 },
        { id: 'kyoto', hotel: { nome: 'B', tipo: 'y', preco: 200, nota: '' }, dias: 3 },
    ];
    ok(diasDistribuidos() === diasViagem(), 'os dias por cidade somam os dias da viagem');
    ok(custoHotel() === 300 * 5 + 200 * 3, 'hospedagem = diária × dias, cidade a cidade');

    const t = trechos();
    ok(iso(t[0].entrada) === iso(viagem.ida) && iso(t[1].entrada) === iso(new Date(2026, 3, 15)),
        'o segundo trecho começa depois do primeiro');
    ok(iso(t[1].saida) === iso(viagem.volta), 'o último trecho termina no dia da volta');

    viagem.atracoes = [ATRACOES_CIDADE.toquio[0], ATRACOES_CIDADE.toquio[1]];
    ok(Math.round(custoAtracoes()) === Math.round(ATRACOES_CIDADE.toquio[0].jpy * IENE), 'ingressos somam só o que é pago');
    ok(atracoesDaCidade('kyoto').length === 0, 'atração é contada na cidade certa');
    ok(MAPA.pontos.every((p) => HOTEIS_CIDADE[p.id] && ATRACOES_CIDADE[p.id]), 'todo pino do mapa tem hotéis e atrações');

    viagem.ida = viagem.volta = null; viagem.destinos = []; viagem.atracoes = [];
}
