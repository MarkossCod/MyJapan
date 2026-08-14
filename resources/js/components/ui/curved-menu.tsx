'use client';

import React, { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import { Facebook, Instagram, Mail, Youtube } from 'lucide-react';

export interface iNavItem {
    heading: string;
    href: string;
    subheading?: string;
}

interface iNavLinkProps extends iNavItem {
    setIsActive: (isActive: boolean) => void;
    index: number;
    isCurrent: boolean;
}

interface iCurvedNavbarProps {
    setIsActive: (isActive: boolean) => void;
    navItems: iNavItem[];
    currentPath: string;
    footer?: React.ReactNode;
}

interface iHeaderProps {
    navItems?: iNavItem[];
    footer?: React.ReactNode;
    currentPath?: string;
}

const MENU_SLIDE_ANIMATION = {
    initial: { x: 'calc(100% + 100px)' },
    enter: { x: '0', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
    exit: {
        x: 'calc(100% + 100px)',
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
};

const defaultNavItems: iNavItem[] = [
    { heading: 'Início', href: '/', subheading: 'A porta de entrada para o Japão' },
    { heading: 'Planeje a sua viagem', href: '/planeje', subheading: 'Roteiros, estações e dicas' },
    { heading: 'Comprar Passagens', href: '/passagens', subheading: 'Voos e tarifas para o Japão' },
    { heading: 'Quem somos', href: '/quem-somos', subheading: 'A equipe por trás do MyJapan' },
];

const CustomFooter: React.FC = () => {
    const links = [
        { href: 'https://www.instagram.com/', label: 'Instagram', Icon: Instagram },
        { href: 'https://www.facebook.com/', label: 'Facebook', Icon: Facebook },
        { href: 'https://www.youtube.com/', label: 'YouTube', Icon: Youtube },
        { href: 'mailto:contato@myjapan.com.br', label: 'E-mail', Icon: Mail },
    ];

    return (
        <div className="flex w-full justify-between px-10 py-6 text-sm text-black md:px-24">
            {links.map(({ href, label, Icon }) => (
                <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black/70 transition-colors hover:text-[#bc002d]"
                >
                    <Icon size={22} />
                </a>
            ))}
        </div>
    );
};

const NavLink: React.FC<iNavLinkProps> = ({ heading, href, subheading, setIsActive, index, isCurrent }) => {
    const ref = useRef<HTMLAnchorElement | null>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    return (
        <motion.div
            onClick={() => setIsActive(false)}
            initial="initial"
            whileHover="whileHover"
            className="group relative border-b border-black/20 py-4 transition-colors duration-500 md:py-6"
        >
            <a ref={ref} onMouseMove={handleMouseMove} href={href} className="block">
                <div className="relative flex items-baseline">
                    <span className="mr-3 text-2xl font-thin text-black/40 md:text-3xl">{index}.</span>

                    <div className="flex flex-col">
                        <motion.span
                            variants={{ initial: { x: 0 }, whileHover: { x: -12 } }}
                            transition={{ type: 'spring', staggerChildren: 0.04, delayChildren: 0.15 }}
                            className={`relative z-10 block text-2xl font-extralight uppercase transition-colors duration-500 sm:text-3xl md:text-4xl ${
                                isCurrent ? 'text-[#bc002d]' : 'text-black group-hover:text-[#bc002d]'
                            }`}
                        >
                            {heading.split('').map((letter, i) => (
                                <motion.span
                                    key={i}
                                    variants={{ initial: { x: 0 }, whileHover: { x: 12 } }}
                                    transition={{ type: 'spring' }}
                                    className="inline-block"
                                >
                                    {letter === ' ' ? ' ' : letter}
                                </motion.span>
                            ))}
                        </motion.span>

                        {subheading && (
                            <span className="mt-1 text-xs tracking-wide text-black/50 md:text-sm">{subheading}</span>
                        )}
                    </div>
                </div>
            </a>
        </motion.div>
    );
};

/** Borda curva animada na lateral esquerda do painel. */
const Curve: React.FC = () => {
    const [height, setHeight] = useState(() => (typeof window === 'undefined' ? 800 : window.innerHeight));

    useEffect(() => {
        const onResize = () => setHeight(window.innerHeight);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const initialPath = `M100 0 L200 0 L200 ${height} L100 ${height} Q-100 ${height / 2} 100 0`;
    const targetPath = `M100 0 L200 0 L200 ${height} L100 ${height} Q100 ${height / 2} 100 0`;

    const curve = {
        initial: { d: initialPath },
        enter: { d: targetPath, transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } },
        exit: { d: initialPath, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
    };

    return (
        <svg className="absolute top-0 -left-[99px] h-full w-[100px] stroke-none" style={{ fill: '#ffffff' }}>
            <motion.path variants={curve} initial="initial" animate="enter" exit="exit" />
        </svg>
    );
};

const CurvedNavbar: React.FC<iCurvedNavbarProps> = ({ setIsActive, navItems, currentPath, footer }) => {
    return (
        <motion.div
            variants={MENU_SLIDE_ANIMATION}
            initial="initial"
            animate="enter"
            exit="exit"
            id="menu-principal"
            className="fixed top-0 right-0 z-40 h-[100dvh] w-screen max-w-screen-sm bg-white"
        >
            <nav className="flex h-full flex-col justify-between overflow-y-auto pt-20 pb-4" aria-label="Menu principal">
                <div className="flex flex-col gap-3 px-10 md:px-24">
                    <div className="mb-2 border-b border-black/20 pb-2 text-xs tracking-[0.3em] text-black/50 uppercase">
                        <p>Navegação</p>
                    </div>

                    <div className="mx-auto w-full max-w-7xl">
                        {navItems.map((item, index) => (
                            <NavLink
                                key={item.href}
                                {...item}
                                setIsActive={setIsActive}
                                index={index + 1}
                                isCurrent={currentPath === item.href}
                            />
                        ))}
                    </div>
                </div>

                {footer}
            </nav>

            <Curve />
        </motion.div>
    );
};

const Header: React.FC<iHeaderProps> = ({
    navItems = defaultNavItems,
    footer = <CustomFooter />,
    currentPath = typeof window === 'undefined' ? '/' : window.location.pathname,
}) => {
    const [isActive, setIsActive] = useState(false);

    // Fecha com Esc e trava a rolagem do fundo enquanto o menu está aberto,
    // evitando o "scroll por trás" típico em celulares.
    useEffect(() => {
        if (!isActive) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsActive(false);
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [isActive]);

    return (
        <>
            {/* Canto superior esquerdo: o topo direito já é ocupado pelo botão
                "Centralizar" da experiência 3D. Sem fundo branco — usa a mesma
                cor de papel da página para não recortar um quadrado sobre ela. */}
            <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                aria-label={isActive ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={isActive}
                aria-controls="menu-principal"
                className={`group fixed top-0 left-0 z-50 m-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#bc002d] focus-visible:outline-none md:m-6 ${
                    isActive ? 'bg-transparent' : 'bg-[#f3efe7] hover:bg-[#e9e3d7]'
                }`}
            >
                <span className="relative flex h-4 w-7 flex-col justify-between" aria-hidden="true">
                    <span
                        className={`block h-[2px] rounded-full bg-[#1c1b19] transition-all duration-300 ${
                            isActive ? 'w-7 translate-y-[7px] rotate-45' : 'w-7'
                        }`}
                    />
                    <span
                        className={`block h-[2px] rounded-full bg-[#1c1b19] transition-all duration-300 ${
                            isActive ? 'w-7 opacity-0' : 'w-5 group-hover:w-7'
                        }`}
                    />
                    <span
                        className={`block h-[2px] rounded-full bg-[#1c1b19] transition-all duration-300 ${
                            isActive ? 'w-7 -translate-y-[7px] -rotate-45' : 'w-6 group-hover:w-7'
                        }`}
                    />
                </span>
            </button>

            {/* Os dois filhos precisam ser diretos e ter `key`: dentro de um
                Fragment o AnimatePresence não registra os elementos e as
                animações de entrada/saída simplesmente não acontecem. */}
            <AnimatePresence>
                {isActive && [
                    <motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        onClick={() => setIsActive(false)}
                        className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
                        aria-hidden="true"
                    />,
                    <CurvedNavbar
                        key="painel"
                        setIsActive={setIsActive}
                        navItems={navItems}
                        currentPath={currentPath}
                        footer={footer}
                    />,
                ]}
            </AnimatePresence>
        </>
    );
};

export default Header;
export { defaultNavItems };
