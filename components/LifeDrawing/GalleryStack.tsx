"use client";

import { useEffect, useRef, useState } from "react";

const CARD = "max-w-full max-h-full object-contain rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.5)]";

// Dessins posés derrière la couverture : légèrement de travers au repos (on devine la pile),
// déployés en éventail autour du bas au survol, au toucher, ou une fois à l'apparition sur écran tactile.
const BEHIND = [
    "rotate-[3deg] group-hover:rotate-[9deg] group-hover:translate-x-[7%] group-active:rotate-[9deg] group-active:translate-x-[7%] group-data-[fan=true]:rotate-[9deg] group-data-[fan=true]:translate-x-[7%]",
    "-rotate-[2.5deg] group-hover:-rotate-[9deg] group-hover:-translate-x-[7%] group-active:-rotate-[9deg] group-active:-translate-x-[7%] group-data-[fan=true]:-rotate-[9deg] group-data-[fan=true]:-translate-x-[7%]",
];

const FRONT =
    "transition-all duration-300 group-hover:scale-[1.03] group-hover:ring-2 group-hover:ring-white group-active:scale-[1.03] group-active:ring-2 group-active:ring-white group-data-[fan=true]:scale-[1.03]";

export default function GalleryStack({ cover, behind, alt }: { cover: string; behind: string[]; alt: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [fan, setFan] = useState(false);

    // Sur écran tactile (pas de survol), la pile s'ouvre une fois quand elle arrive à l'écran
    // pour montrer qu'elle contient d'autres dessins.
    useEffect(() => {
        const el = ref.current;
        if (!el || behind.length === 0) return;
        if (!window.matchMedia("(hover: none)").matches) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        let timer: ReturnType<typeof setTimeout> | undefined;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                timer = setTimeout(() => {
                    setFan(true);
                    timer = setTimeout(() => setFan(false), 900);
                }, 250);
            },
            { threshold: 0.7 },
        );
        observer.observe(el);
        return () => {
            observer.disconnect();
            clearTimeout(timer);
        };
    }, [behind.length]);

    return (
        <div ref={ref} data-fan={fan} className="group relative w-full cursor-pointer" style={{ paddingTop: "100%" }}>
            {behind
                .slice(0, BEHIND.length)
                .reverse()
                .map((src, i, arr) => (
                    <div
                        key={src}
                        aria-hidden
                        className={`absolute inset-0 flex items-center justify-center origin-bottom transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${BEHIND[arr.length - 1 - i]}`}
                    >
                        <img src={src} alt="" loading="lazy" decoding="async" className={`${CARD} brightness-[0.75]`} />
                    </div>
                ))}
            <div className="absolute inset-0 flex items-center justify-center">
                <img src={cover} alt={alt} className={`${CARD} ${FRONT}`} />
            </div>
        </div>
    );
}
