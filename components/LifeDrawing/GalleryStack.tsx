"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";

const CARD = "max-w-full max-h-full object-contain rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.5)]";

// Dessins rangés derrière la couverture, invisibles au repos ; ils se déploient en éventail
// autour du bas au survol, ou au toucher sur écran tactile (juste avant d'ouvrir le dossier).
const BEHIND = [
    "group-hover:opacity-100 group-hover:rotate-[9deg] group-hover:translate-x-[7%] group-data-[fan=true]:opacity-100 group-data-[fan=true]:rotate-[9deg] group-data-[fan=true]:translate-x-[7%]",
    "group-hover:opacity-100 group-hover:-rotate-[9deg] group-hover:-translate-x-[7%] group-data-[fan=true]:opacity-100 group-data-[fan=true]:-rotate-[9deg] group-data-[fan=true]:-translate-x-[7%]",
];

const FRONT =
    "transition-all duration-300 group-hover:scale-[1.03] group-hover:ring-2 group-hover:ring-white group-data-[fan=true]:scale-[1.03] group-data-[fan=true]:ring-2 group-data-[fan=true]:ring-white";

// Temps laissé à l'éventail pour s'ouvrir avant de changer de page sur écran tactile.
const TOUCH_REVEAL_MS = 450;

export default function GalleryStack({
    cover,
    behind,
    alt,
    href,
}: {
    cover: string;
    behind: string[];
    alt: string;
    href: string;
}) {
    const router = useRouter();
    const [fan, setFan] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => () => clearTimeout(timer.current), []);

    // Sur écran tactile, le clic ouvre d'abord la pile puis navigue.
    function onClickCapture(e: MouseEvent) {
        if (behind.length === 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
        if (!window.matchMedia("(hover: none)").matches) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        e.preventDefault();
        if (fan) return;
        setFan(true);
        timer.current = setTimeout(() => {
            router.push(href);
            // Si on revient en arrière, la pile est refermée.
            setTimeout(() => setFan(false), 500);
        }, TOUCH_REVEAL_MS);
    }

    return (
        <div
            data-fan={fan}
            onClickCapture={onClickCapture}
            className="group relative w-full cursor-pointer"
            style={{ paddingTop: "100%" }}
        >
            {behind
                .slice(0, BEHIND.length)
                .reverse()
                .map((src, i, arr) => (
                    <div
                        key={src}
                        aria-hidden
                        className={`absolute inset-0 flex items-center justify-center origin-bottom opacity-0 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${BEHIND[arr.length - 1 - i]}`}
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
