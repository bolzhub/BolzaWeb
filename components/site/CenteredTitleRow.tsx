"use client";

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";

// Barre de navigation avec un titre au centre exact de la page, quoi qu'il y ait à gauche et à droite.
//  - Les deux colonnes latérales prennent la largeur du plus large des deux côtés :
//    la colonne du titre est donc centrée, et le titre ne peut jamais chevaucher les côtés.
//  - Le titre passe à la ligne entre les mots si la place manque.
//  - Si un mot seul ne tient toujours pas, ou s'il faudrait plus de `maxLines` lignes,
//    la taille du titre est réduite jusqu'à ce qu'il tienne.
const MIN_FONT_PX = 12;

export default function CenteredTitleRow({
    left,
    right,
    title,
    navRow,
    className = "",
    titleClassName = "",
    titleStyle,
    maxLines = 2,
}: {
    left: ReactNode;
    right: ReactNode;
    title: ReactNode;
    navRow: string;
    className?: string;
    titleClassName?: string;
    titleStyle?: CSSProperties;
    maxLines?: number;
}) {
    const rowRef = useRef<HTMLDivElement>(null);
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useLayoutEffect(() => {
        const row = rowRef.current;
        const l = leftRef.current;
        const r = rightRef.current;
        const t = titleRef.current;
        if (!row || !l || !r || !t) return;

        const update = () => {
            // largeur propre de chaque côté (le contenu, pas la colonne qui l'accueille)
            const width = (el: HTMLElement) => (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0;
            const s = Math.ceil(Math.max(width(l), width(r)));
            // appliqué directement (et non via un état React) pour que la mesure du titre ci-dessous en tienne compte
            row.style.gridTemplateColumns = `${s}px minmax(0,1fr) ${s}px`;

            // taille d'origine (celle des classes), puis réduction tant qu'un mot dépasse
            t.style.fontSize = "";
            let size = parseFloat(getComputedStyle(t).fontSize);
            // le titre est limité à sa colonne (max-w-full) : s'il dépasse encore, c'est qu'un mot est trop long
            const tooBig = () => {
                // nombre de lignes : une par position verticale distincte des fragments de texte
                const range = document.createRange();
                range.selectNodeContents(t);
                const tops = new Set([...range.getClientRects()].map((r) => Math.round(r.top)));
                return t.scrollWidth > t.clientWidth + 0.5 || tops.size > maxLines;
            };
            while (tooBig() && size > MIN_FONT_PX) {
                size -= 1;
                t.style.fontSize = `${size}px`;
            }
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(row);
        observer.observe(l);
        observer.observe(r);
        return () => observer.disconnect();
    }, [title, maxLines]);

    return (
        <div
            ref={rowRef}
            data-nav-row={navRow}
            className={`grid items-center ${className}`}
            style={{ gridTemplateColumns: "auto minmax(0,1fr) auto" }}
        >
            <div ref={leftRef} className="flex justify-start">
                {left}
            </div>
            <h1
                ref={titleRef}
                data-nav-center
                className={`trim-cap m-0 max-w-full justify-self-center text-center [overflow-wrap:normal] ${titleClassName}`}
                style={titleStyle}
            >
                {title}
            </h1>
            <div ref={rightRef} className="flex justify-end">
                {right}
            </div>
        </div>
    );
}
