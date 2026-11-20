"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Project } from "@/lib/site/projects";
import ProjectBadgeDisc from "@/components/site/ProjectBadgeDisc";

const ACTIVE_WEIGHT = 8;
const INACTIVE_WEIGHT = 1;
const MAX_ASPECT_RATIO = 4 / 3;
const GAP = 8; // doit correspondre à gap-2 (0.5rem = 8px)

// Portable : grille de MOBILE_COLS colonnes. Le rectangle touché agrandit sa colonne
// et sa ligne, ce qui repousse les rectangles de toutes les lignes.
const MOBILE_COLS = 3;
const MOBILE_ACTIVE_COL = 3; // largeur de la colonne active (en fr, les autres valent 1)
const MOBILE_ACTIVE_ROW = 2.2; // hauteur de la ligne active (en fr, les autres valent 1)
const DESKTOP_QUERY = "(min-width: 768px)"; // = breakpoint md de Tailwind

// "3fr 1fr 1fr" : la piste active pèse `active`, les autres 1
const tracks = (count: number, activeIndex: number | null, active: number) =>
    Array.from({ length: count }, (_, i) => (i === activeIndex ? `${active}fr` : "1fr")).join(" ");

export default function ProjectShowcase({ projects }: { projects: Project[] }) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [widths, setWidths] = useState<number[] | null>(null);

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
            const activeIndex = projects.findIndex((p) => p.id === activeId);
            const activeCol = activeIndex >= 0 ? activeIndex % MOBILE_COLS : -1;
            const cols = Math.min(MOBILE_COLS, count);
            const gridAvailable = Math.max(containerWidth - GAP * (cols - 1), 0);
            const totalWeight = cols - 1 + (activeCol >= 0 ? MOBILE_ACTIVE_COL : 1);
            setWidths(
                projects.map((_, i) => {
                    const weight = i % MOBILE_COLS === activeCol ? MOBILE_ACTIVE_COL : 1;
                    return (gridAvailable * weight) / totalWeight;
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

    const activeIndex = projects.findIndex((p) => p.id === activeId);
    const rowCount = Math.ceil(projects.length / MOBILE_COLS);
    const gridStyle = {
        "--cols": tracks(
            Math.min(MOBILE_COLS, projects.length),
            activeIndex >= 0 ? activeIndex % MOBILE_COLS : null,
            MOBILE_ACTIVE_COL,
        ),
        "--rows": tracks(rowCount, activeIndex >= 0 ? Math.floor(activeIndex / MOBILE_COLS) : null, MOBILE_ACTIVE_ROW),
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

                return (
                    <div
                        key={project.id}
                        className="relative min-h-0 min-w-0 md:w-(--w) md:shrink-0 md:transition-[width] md:duration-500 md:ease-out"
                        style={{ "--w": width !== undefined ? `${width}px` : undefined } as React.CSSProperties}
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
                            className="absolute inset-0 overflow-hidden rounded-2xl hover:ring-2 hover:ring-white"
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
                                    className="text-white tracking-wide break-words"
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
