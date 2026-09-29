"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BOX_ZONES, BOXES_IMAGE_WIDTH, BOXES_IMAGE_HEIGHT } from "@/lib/BolzaBoxes/boxesZones";

export default function BoxesImageMap({ src }: { src: string }) {
    const router = useRouter();
    const [debug, setDebug] = useState(false);

    // Mode calibrage : ajouter ?debug=1 à l'URL affiche le contour de chaque zone
    useEffect(() => {
        setDebug(new URLSearchParams(window.location.search).get("debug") === "1");
    }, []);

    return (
        <svg
            viewBox={`0 0 ${BOXES_IMAGE_WIDTH} ${BOXES_IMAGE_HEIGHT}`}
            className="w-full max-w-2xl h-auto"
            role="img"
            aria-label="Sélection des boîtes"
        >
            <image href={src} x={0} y={0} width={BOXES_IMAGE_WIDTH} height={BOXES_IMAGE_HEIGHT} />

            {BOX_ZONES.map((zone) => (
                <rect
                    key={zone.id}
                    x={zone.rect.x}
                    y={zone.rect.y}
                    width={zone.rect.width}
                    height={zone.rect.height}
                    className={`transition-colors ${zone.href
                            ? "fill-white/0 hover:fill-white/20 cursor-pointer"
                            : "fill-white/0 cursor-not-allowed"
                        }`}
                    stroke={debug ? "red" : "none"}
                    strokeWidth={debug ? 4 : 0}
                    onClick={() => {
                        if (zone.href) router.push(zone.href);
                    }}
                >
                    <title>{zone.label}</title>
                </rect>
            ))}
        </svg>
    );
}