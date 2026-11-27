"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Project } from "@/lib/site/projects";
import ProjectBadgeDisc from "@/components/site/ProjectBadgeDisc";

const ACTIVE_WEIGHT = 8;
const INACTIVE_WEIGHT = 1;
const MAX_ASPECT_RATIO = 4 / 3;
const GAP = 8; // doit correspondre à gap-2 (0.5rem = 8px)

// Portable : grille de MOBILE_ROWS lignes (les lignes du bas reçoivent les rectangles en trop :
// 7 projets → 3 + 4). Les colonnes sont découpées en pistes communes à toutes les lignes
// (12 pistes pour 3 + 4) : le rectangle touché élargit ses pistes et agrandit sa ligne,
// ce qui repousse les rectangles des deux lignes.
const MOBILE_ROWS = 2;
const MOBILE_ACTIVE_COL = 3; // poids des pistes du rectangle actif (en fr, les autres valent 1)
const MOBILE_ACTIVE_ROW = 2.2; // hauteur de la ligne active (en fr, les autres valent 1)
const DESKTOP_QUERY = "(min-width: 768px)"; // = breakpoint md de Tailwind

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

// Place chaque rectangle dans la grille portable : ligne, première piste et nombre de pistes
function mobileLayout(count: number) {
    const rows = Math.min(MOBILE_ROWS, count);
    const base = Math.floor(count / rows);
    const extra = count % rows;
    const sizes = Array.from({ length: rows }, (_, r) => base + (r >= rows - extra ? 1 : 0));
    const trackCount = sizes.reduce((a, b) => (a * b) / gcd(a, b), 1);
    const cells: { row: number; start: number; span: number }[] = [];
    sizes.forEach((size, row) => {
        const span = trackCount / size;
        for (let j = 0; j < size; j++) cells.push({ row, start: j * span, span });
    });
    return { rows, trackCount, cells };
}

// Poids de chaque piste de colonnes : celles du rectangle actif pèsent MOBILE_ACTIVE_COL
function columnWeights(trackCount: number, active?: { start: number; span: number }) {
    return Array.from({ length: trackCount }, (_, t) =>
        active && t >= active.start && t < active.start + active.span ? MOBILE_ACTIVE_COL : 1,
    );
}

// "2.2fr 1fr" : la piste active pèse `active`, les autres 1
const tracks = (count: number, activeIndex: number | null, active: number) =>
    Array.from({ length: count }, (_, i) => (i === activeIndex ? `${active}fr` : "1fr")).join(" ");

export default function ProjectShowcase({ projects }: { projects: Project[] }) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [widths, setWidths] = useState<number[] | null>(null);
    // hauteur finale de chaque rectangle, calculée d'avance pour que le disque en coin
    // s'anime en même temps que la grille au lieu de la suivre après coup
    const [heights, setHeights] = useState<number[] | null>(null);

    const recompute = useCallback(() => {
        const el = containerRef.current;
        if (!el) return;

        const computed = window.getComputedStyle(el);
        const paddingLeft = parseFloat(computed.paddingLeft) || 0;
        const paddingRight = parseFloat(computed.paddingRight) || 0;
        const containerWidth = el.clientWidth - paddingLeft - paddingRight;
        const containerHeight = el.clientHeight;
        const count = projects.length;
        const available = Math.max(containerWidth - GAP * (count - 1), 0);
        const maxActiveWidth = containerHeight * MAX_ASPECT_RATIO;

        // Portable : on ne calcule que la largeur de chaque rectangle (pour le disque
        // en coin) ; la grille CSS fait la mise en page
        if (!window.matchMedia(DESKTOP_QUERY).matches) {
            const { rows, trackCount, cells } = mobileLayout(count);
            const weights = columnWeights(trackCount, cells[projects.findIndex((p) => p.id === activeId)]);
            const totalWeight = weights.reduce((a, b) => a + b, 0);
            const trackSpace = Math.max(containerWidth - GAP * (trackCount - 1), 0);
            const activeRow = cells[projects.findIndex((p) => p.id === activeId)]?.row;
            const rowWeights = Array.from({ length: rows }, (_, r) => (r === activeRow ? MOBILE_ACTIVE_ROW : 1));
            const rowWeightSum = rowWeights.reduce((a, b) => a + b, 0);
            const rowSpace = Math.max(containerHeight - GAP * (rows - 1), 0);
            setHeights(cells.map(({ row }) => (rowSpace * rowWeights[row]) / rowWeightSum));
            setWidths(
                cells.map(({ start, span }) => {
                    const own = weights.slice(start, start + span).reduce((a, b) => a + b, 0);
                    return (trackSpace * own) / totalWeight + GAP * (span - 1);
                }),
            );
            return;
        }

        let raw: number[];

        if (!activeId) {
            const equal = available / count;
            raw = projects.map(() => equal);
        } else {
            const inactiveCount = count - 1;
            const totalWeight = ACTIVE_WEIGHT + INACTIVE_WEIGHT * inactiveCount;
            const rawActiveWidth = (available * ACTIVE_WEIGHT) / totalWeight;
            const activeWidth = Math.min(rawActiveWidth, maxActiveWidth);
            const remaining = available - activeWidth;
            const inactiveWidth = inactiveCount > 0 ? remaining / inactiveCount : 0;

            raw = projects.map((p) => (p.id === activeId ? activeWidth : inactiveWidth));
        }

        setHeights(projects.map(() => containerHeight));

        const sum = raw.reduce((a, b) => a + b, 0);
        const scale = sum > 0 ? available / sum : 1;
        setWidths(raw.map((w) => w * scale));
    }, [activeId, projects]);

    useEffect(() => {
        recompute();
        const observer = new ResizeObserver(() => recompute());
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [recompute]);

    const layout = mobileLayout(projects.length);
    const activeCell = layout.cells[projects.findIndex((p) => p.id === activeId)];
    const gridStyle = {
        "--cols": columnWeights(layout.trackCount, activeCell)
            .map((w) => `${w}fr`)
            .join(" "),
        "--rows": tracks(layout.rows, activeCell ? activeCell.row : null, MOBILE_ACTIVE_ROW),
    } as React.CSSProperties;

    return (
        <div
            ref={containerRef}
            // Portable : grille animée (colonnes et lignes). Ordi : une seule ligne, largeurs calculées
            className="grid w-full min-h-0 flex-1 grid-cols-(--cols) grid-rows-(--rows) gap-2 px-6 transition-[grid-template-columns,grid-template-rows] duration-500 ease-out md:flex md:h-[65vh] md:flex-none md:px-10"
            style={gridStyle}
            onMouseLeave={() => setActiveId(null)}
        >
            {projects.map((project, i) => {
                const width = widths ? widths[i] : undefined;
                const cell = layout.cells[i];

                return (
                    <div
                        key={project.id}
                        className="relative min-h-0 min-w-0 md:w-(--w) md:shrink-0 md:transition-[width] md:duration-500 md:ease-out"
                        style={
                            {
                                "--w": width !== undefined ? `${width}px` : undefined,
                                // conteneur de taille : le disque en coin se dimensionne en cqw/cqh
                                containerType: "size",
                                // placement dans la grille portable (sans effet sur ordi, en flex)
                                gridRow: cell.row + 1,
                                gridColumn: `${cell.start + 1} / span ${cell.span}`,
                            } as React.CSSProperties
                        }
                        onPointerEnter={(e) => {
                            if (e.pointerType === "mouse") setActiveId(project.id);
                        }}
                    >
                        <Link
                            href={project.href}
                            onClick={(e) => {
                                if (activeId !== project.id) {
                                    e.preventDefault();
                                    setActiveId(project.id);
                                }
                            }}
                            // Ombre portée douce + contour sombre (encre) pour détacher les rectangles du fond.
                            // Rectangle actif : liseré doré contre le rectangle (ring-offset), bordé à l'extérieur
                            // par le contour sombre qui déborde un peu, pour faire ressortir le doré.
                            className={`absolute inset-0 overflow-hidden rounded-2xl shadow-[0_12px_28px_-10px_rgba(58,53,44,0.55)] ring-2 ring-ink ${activeId === project.id ? "ring-offset-2 ring-offset-gold" : ""}`}
                            style={{
                                backgroundColor: project.color,
                                containerType: "inline-size",
                            }}
                        >
                            {project.previewImage && (
                                <img
                                    src={project.previewImage}
                                    alt={project.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    style={{
                                        objectPosition: `${project.imagePositionX ?? "center"} ${project.imagePosition ?? "center"}`,
                                    }}
                                />
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/0" />

                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                                <p
                                    className="text-white tracking-wide break-words hyphens-auto"
                                    style={{ fontSize: "clamp(0.7rem, 9cqw, 1.75rem)" }}
                                >
                                    {project.title}
                                </p>
                            </div>
                        </Link>

                        {project.badge && (
                            <ProjectBadgeDisc
                                projectId={project.id}
                                badge={project.badge}
                                rectWidth={width}
                                rectHeight={heights?.[i]}
                                onClick={(e) => {
                                    // même règle que pour le rectangle : un premier toucher
                                    // sur mobile l'agrandit, le second ouvre le sous-site
                                    if (activeId !== project.id) {
                                        e.preventDefault();
                                        setActiveId(project.id);
                                    }
                                }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
