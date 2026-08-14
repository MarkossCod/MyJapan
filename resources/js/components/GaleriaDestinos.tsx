import HoverExpand_001, { type GalleryImage } from '@/components/ui/hover-expand-gallery';

const IMAGENS: GalleryImage[] = [
    {
        src: '/images/galeria/kanazawa.jpg',
        alt: 'Castelo de Kanazawa entre cerejeiras em flor e lanternas acesas ao entardecer',
        code: '01 · Ishikawa',
        title: 'Kanazawa',
    },
    {
        src: '/images/galeria/kyoto.jpg',
        alt: 'Ruela de pedra em Higashiyama com o pagode Yasaka ao fundo, em Quioto',
        code: '02 · Kansai',
        title: 'Quioto',
    },
    {
        src: '/images/galeria/monte-fuji.jpg',
        alt: 'Monte Fuji nevado refletido nas águas calmas do lago Yamanaka',
        code: '03 · Yamanashi',
        title: 'Monte Fuji',
    },
    {
        src: '/images/galeria/osaka.jpg',
        alt: 'Canal de Dotonbori em Osaka, cercado de letreiros coloridos e barcos de passeio',
        code: '04 · Kansai',
        title: 'Osaka',
    },
    {
        src: '/images/galeria/takayama.jpg',
        alt: 'Rua histórica de casas de madeira em Takayama durante a neve',
        code: '05 · Gifu',
        title: 'Takayama',
    },
    {
        src: '/images/galeria/toquio.png',
        alt: 'Painéis luminosos e movimento noturno no bairro de Akihabara, em Tóquio',
        code: '06 · Kantō',
        title: 'Tóquio',
    },
];

export default function GaleriaDestinos() {
    return (
        <div className="flex w-full items-center justify-center">
            <HoverExpand_001 images={IMAGENS} />
        </div>
    );
}
