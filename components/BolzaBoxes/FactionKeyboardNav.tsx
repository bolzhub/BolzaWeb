"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SIDEBAR_ORDER, factionPath } from "@/lib/BolzaBoxes/factions";
import { useVersion } from "@/lib/BolzaBoxes/VersionContext";

// Flèches du clavier : ← / ↑ faction précédente, → / ↓ faction suivante, dans l'ordre de la barre d'icônes
// de la version affichée (on boucle aux extrémités). Ignoré pendant une saisie, dans le visualiseur 3D
// (qui se sert des flèches pour tourner le modèle), dans une fenêtre ouverte ou avec une touche de modification.
export default function FactionKeyboardNav({ slug }: { slug: string }) {
    const router = useRouter();
    const { version } = useVersion();

    useEffect(() => {
        const order = SIDEBAR_ORDER[version] as string[];
        const index = order.indexOf(slug);

        const onKey = (e: KeyboardEvent) => {
            if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.defaultPrevented) return;
            const step = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }[e.key];
            if (!step) return;
            const target = e.target as HTMLElement | null;
            if (target?.closest("input, textarea, select, [contenteditable], model-viewer, video, [role=dialog]"))
                return;
            if (document.querySelector("[role=dialog]")) return;

            const next = index === -1 ? order[0] : order[(index + step + order.length) % order.length];
            e.preventDefault();
            router.push(factionPath(next));
        };

        // préchargement des voisines : le passage au clavier est immédiat
        if (index !== -1) {
            router.prefetch(factionPath(order[(index + 1) % order.length]));
            router.prefetch(factionPath(order[(index - 1 + order.length) % order.length]));
        }

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [router, slug, version]);

    return null;
}
