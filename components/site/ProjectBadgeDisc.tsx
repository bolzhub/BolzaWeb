"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import type { ProjectBadge } from "@/lib/site/projects";
import { BROWN_GRADIENT } from "@/lib/site/theme";

const INSET = 8; // marge entre le disque et le bord du rectangle
const MIN_DIAMETER = 28;
const MAX_DIAMETER = 128;
const TEXT_MIN_DIAMETER = 88; // en dessous, on n'affiche que l'icône
const LETTER_SPACING = 3.2; // à ajuster si le texte ne fait pas exactement le tour du disque

// Le disque suit la largeur du rectangle, sans jamais dépasser sa hauteur
// (rectangles larges mais bas, par exemple sur portable en paysage).
// Taille en CSS, relative au rectangle (unités cqw/cqh, le rectangle est un conteneur) : le disque suit
// ainsi chaque image de l'animation du rectangle, sans transition à lui qui prendrait du retard.
const DIAMETER_CSS = `max(20px, min(max(${MIN_DIAMETER}px, min(${MAX_DIAMETER}px, 42cqw)), 100cqw - ${INSET * 2}px, 100cqh - ${INSET * 2}px))`;

// Même calcul en JS, sur la taille finale du rectangle : sert à décider si le texte tient
function diameterFor(rectWidth: number | undefined, rectHeight: number | undefined): number {
    if (rectWidth === undefined) return MIN_DIAMETER;
    const wanted = Math.max(MIN_DIAMETER, Math.min(MAX_DIAMETER, rectWidth * 0.42));
    const room = Math.min(rectWidth, rectHeight ?? Infinity) - INSET * 2;
    return Math.max(20, Math.min(wanted, room));
}

function cornerStyle(corner: NonNullable<ProjectBadge["corner"]>): React.CSSProperties {
    return {
        top: corner.startsWith("top") ? INSET : undefined,
        bottom: corner.startsWith("bottom") ? INSET : undefined,
        left: corner.endsWith("left") ? INSET : undefined,
        right: corner.endsWith("right") ? INSET : undefined,
    };
}

export default function ProjectBadgeDisc({
    projectId,
    badge,
    rectWidth,
    rectHeight,
    onClick,
}: {
    projectId: string;
    badge: ProjectBadge;
    rectWidth: number | undefined;
    rectHeight: number | undefined; // tailles finales (cibles) du rectangle, pas celles en cours d'animation
    onClick: (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
    const d = diameterFor(rectWidth, rectHeight);
    const showText = d >= TEXT_MIN_DIAMETER;
    const pathId = `badge-path-${projectId}`;

    return (
        <Link
            href={badge.href}
            aria-label={badge.title}
            onClick={onClick}
            className="absolute z-10 block rounded-full text-parchment shadow-lg ring-1 ring-white/25 transition-transform duration-500 ease-out hover:scale-105"
            style={{
                width: DIAMETER_CSS,
                height: DIAMETER_CSS,
                background: BROWN_GRADIENT,
                ...cornerStyle(badge.corner ?? "top-right"),
            }}
        >
            <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
                <defs>
                    {/* cercle de rayon 34, parcouru dans le sens horaire */}
                    <path id={pathId} d="M50,50 m-34,0 a34,34 0 1,1 68,0 a34,34 0 1,1 -68,0" />
                </defs>

                <g style={{ opacity: showText ? 1 : 0, transition: "opacity 400ms ease-out" }}>
                    <text
                        fontSize="10"
                        fontWeight="700"
                        letterSpacing={LETTER_SPACING}
                        fill="currentColor"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        <textPath href={`#${pathId}`}>{`${badge.title.toUpperCase()} •`}</textPath>
                    </text>
                </g>

                {/* icône de puzzle (Material Design "extension") */}
                <g
                    style={{
                        transform: `scale(${showText ? 1 : 1.9})`,
                        transformOrigin: "50px 50px",
                        transition: "transform 500ms ease-out",
                    }}
                >
                    <svg x="35" y="35" width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z" />
                    </svg>
                </g>
            </svg>
        </Link>
    );
}
