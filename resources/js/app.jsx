import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import CurvedMenu from '@/components/ui/curved-menu';
import GaleriaDestinos from '@/components/GaleriaDestinos';
import MotivosJapao from '@/components/MotivosJapao';

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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', montarIlhas);
} else {
    montarIlhas();
}
