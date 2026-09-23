"use client";

import { useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/site/projects";

const ACTIVE_GROW = 8; // 🎛️ plus ce nombre est grand, plus le panneau actif domine
const INACTIVE_GROW = 1; // 🎛️ plus ce nombre est petit, plus les autres rétrécissent

export default function ProjectShowcase({ projects }: { projects: Project[] }) {
    const [activeId, setActiveId] = useState<string | null>(null);

    return (
        <div
            className="flex w-full h-[65vh] gap-2 px-6 md:px-10"
            onMouseLeave={() => setActiveId(null)}
        >
            {projects.map((project) => {
                const isActive = activeId === project.id;

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
                        className="relative overflow-hidden rounded-2xl transition-[flex-grow] duration-500 ease-out hover:ring-2 hover:ring-white"
                        style={{
                            flexGrow: isActive ? ACTIVE_GROW : INACTIVE_GROW,
                            flexBasis: 0,
                            minWidth: "2.5rem",
                            backgroundColor: project.color,
                            containerType: "inline-size",
                        }}
                    >
                        {project.previewImage && (
                            <img
                                src={project.previewImage}
                                alt={project.title}
                                className="absolute inset-0 w-full h-full object-cover"
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