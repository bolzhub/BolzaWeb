"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { BoxesLayout } from "@/lib/BolzaBoxes/boxesZones";
import { factionPath, getFactionBySlug } from "@/lib/BolzaBoxes/factions";

export default function BoxesImageMap({ src, layout }: { src: string; layout: BoxesLayout }) {
    const router = useRouter();
    const [debug, setDebug] = useState(false);

    useEffect(() => {
        setDebug(new URLSearchParams(window.location.search).get("debug") === "1");
    }, []);

    return (
        <svg
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            style={{
                aspectRatio: `${layout.width} / ${layout.height}`,
                width: "auto",
                height: "auto",
                maxWidth: "100%",
                maxHeight: "100%",
            }}
            role="img"
            aria-label="Box selection"
        >
            <image href={src} x={0} y={0} width={layout.width} height={layout.height} />

            {layout.zones.map((zone) => {
                const href = zone.faction ? factionPath(zone.faction) : null;
                const tooltip = (zone.faction && getFactionBySlug(zone.faction)?.name) || zone.label;

                return (
                    <rect
                        key={zone.id}
                        x={zone.rect.x}
                        y={zone.rect.y}
                        width={zone.rect.width}
                        height={zone.rect.height}
                        className={`transition-colors duration-150 ${
                            href
                                ? "fill-white/0 hover:fill-white/20 active:fill-white/35 cursor-pointer"
                                : "fill-white/0 cursor-not-allowed"
                        }`}
                        stroke={debug ? "red" : href ? "rgba(255,255,255,0.35)" : "none"}
                        strokeWidth={debug ? 4 : href ? 2 : 0}
                        strokeDasharray={debug ? undefined : "6 6"}
                        onClick={() => {
                            if (href) router.push(href);
                        }}
                    >
                        <title>{tooltip}</title>
                    </rect>
                );
            })}
        </svg>
    );
}