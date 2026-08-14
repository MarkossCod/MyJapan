/**
 * Pausa a experiência 3D do hero enquanto ela está fora da tela.
 *
 * O iframe roda uma simulação de tecido em WebGL. Por ser mesma origem, o
 * navegador não aplica o throttling automático que usa em iframes de outra
 * origem — ou seja, sem isso a cena continua queimando CPU/GPU durante toda a
 * navegação, mesmo com o usuário lá embaixo na galeria.
 *
 * O par desta função vive em `public/japao-3d/index.html`.
 */
export function pausarHero3DForaDaTela() {
    const iframe = document.querySelector('.japao-3d-embed iframe');
    if (!iframe || !('IntersectionObserver' in window)) return;

    let visivel = true;

    const avisar = () => {
        // Só existe depois que o documento do iframe carrega.
        iframe.contentWindow?.postMessage(visivel ? 'japao3d:retomar' : 'japao3d:pausar', window.location.origin);
    };

    const observer = new IntersectionObserver(
        ([entrada]) => {
            if (entrada.isIntersecting === visivel) return;
            visivel = entrada.isIntersecting;
            avisar();
        },
        { threshold: 0 }
    );

    observer.observe(iframe);

    // Se o usuário já tiver rolado para longe antes do iframe terminar de
    // carregar, a primeira mensagem se perde: reenviamos o estado atual.
    iframe.addEventListener('load', avisar);
}
