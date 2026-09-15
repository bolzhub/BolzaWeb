"use client";

import { useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/projects";

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
                        onMouseEnter={() => setActiveId(project.id)}
                        className="relative overflow-hidden rounded-2xl transition-[flex-grow] duration-500 ease-out"
                        style={{
                            flexGrow: isActive ? 4 : 1,
                            flexBasis: 0,
                            backgroundColor: project.color,
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
                                className="text-white tracking-wide"
                                style={{
                                    fontSize: isActive ? "1.5rem" : "1rem",
                                    transition: "font-size 0.5s ease-out",
                                }}
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