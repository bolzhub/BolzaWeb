"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Project } from "@/lib/site/projects";

const ACTIVE_WEIGHT = 8;
const INACTIVE_WEIGHT = 1;
const MAX_ASPECT_RATIO = 4 / 3;
const GAP = 8; // doit correspondre à gap-2 (0.5rem = 8px)

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

    return (
        <div
            ref={containerRef}
            className="flex w-full h-[65vh] gap-2 px-6 md:px-10"
            onMouseLeave={() => setActiveId(null)}
        >
            {projects.map((project, i) => {
                const isActive = activeId === project.id;
                const width = widths ? widths[i] : undefined;

                return (
                    <Link
                        key={project.id}
                        href={project.href}
                        onPointerEnter={(e) => {
                            if (e.pointerType === "mouse") setActiveId(project.id);
                        }}
                        onClick={(e) => {
                            if (activeId !== project.id) {
                                e.preventDefault();
                                setActiveId(project.id);
                            }
                        }}
                        className="relative overflow-hidden rounded-2xl transition-[width] duration-500 ease-out hover:ring-2 hover:ring-white shrink-0"
                        style={{
                            width: width !== undefined ? `${width}px` : undefined,
                            backgroundColor: project.color,
                            containerType: "inline-size",
                        }}
                    >
                        {project.previewImage && (
                            <img
                                src={project.previewImage}
                                alt={project.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                style={{ objectPosition: project.imagePosition ?? "center" }}
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
                );
            })}
        </div>
    );
}