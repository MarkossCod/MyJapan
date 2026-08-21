import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import CurvedMenu from '@/components/ui/curved-menu';
import GaleriaDestinos from '@/components/GaleriaDestinos';
import MotivosJapao from '@/components/MotivosJapao';
import QuemSomos from '@/components/QuemSomos';
import TituloRevelado from '@/components/TituloRevelado';
import { pausarHero3DForaDaTela } from '@/hero3d';

/**
 * "Ilhas" de React dentro do Blade.
 *
 * No Blade basta escrever, por exemplo:
 *   <div data-react="galeria-destinos"></div>
 *
 * e o componente correspondente é montado ali. Props opcionais podem ser
 * passadas como JSON no atributo data-props.
 */
const COMPONENTES = {
    'curved-menu': CurvedMenu,
    'galeria-destinos': GaleriaDestinos,
    'motivos-japao': MotivosJapao,
    'quem-somos': QuemSomos,
    'titulo-revelado': TituloRevelado,
};

function montarIlhas() {
    document.querySelectorAll('[data-react]').forEach((el) => {
        const nome = el.dataset.react;
        const Componente = COMPONENTES[nome];

        if (!Componente) {
            console.warn(`[MyJapan] Componente React desconhecido: "${nome}"`);
            return;
        }

        let props = {};
        if (el.dataset.props) {
            try {
                props = JSON.parse(el.dataset.props);
            } catch {
                console.warn(`[MyJapan] data-props inválido em "${nome}"`);
            }
        }

        createRoot(el).render(
            <StrictMode>
                <Componente {...props} />
            </StrictMode>
        );
    });
}

function iniciar() {
    montarIlhas();
    pausarHero3DForaDaTela();

    /* A página "Planeje a sua viagem" carrega gsap, swiper e cobe — só quando
       ela está na tela. Import dinâmico para não pesar as outras rotas. */
    if (document.querySelector('[data-planeje]')) {
        import('@/planeje').catch((e) => console.error('[MyJapan] falha ao carregar a página de planejamento', e));
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
} else {
    iniciar();
}
