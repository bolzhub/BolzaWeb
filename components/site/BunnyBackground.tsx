import type { CSSProperties } from "react";

// Fond de la page d'accueil : des lapins de toutes les couleurs rangés en diagonales serrées.
// Une diagonale sur deux glisse dans un sens, les autres dans l'autre.
// Les motifs viennent de scripts/generate-bunny-tiles.mjs (diagonales paires dans A, impaires dans B).

// 🎛️ Réglages
const TILE = 960; // taille d'un motif en px (doit correspondre au script)
const SECONDS_PER_TILE = 90; // temps pour glisser d'un motif entier : plus grand = plus lent
const OPACITY = 0.35; // discrétion du fond derrière le contenu

function Layer({ src, direction }: { src: string; direction: 1 | -1 }) {
    return (
        <div
            // dépasse d'un motif de chaque côté : le glissement d'un motif ne découvre jamais le bord
            className="bunny-layer absolute inset-y-0"
            style={
                {
                    left: -TILE,
                    right: -TILE,
                    backgroundImage: `url(${src})`,
                    backgroundSize: `${TILE}px ${TILE}px`,
                    "--bunny-shift": `${direction * TILE}px`,
                    "--bunny-duration": `${SECONDS_PER_TILE}s`,
                } as CSSProperties
            }
        />
    );
}

export default function BunnyBackground() {
    return (
        <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
            style={{ opacity: OPACITY }}
        >
            {/* carré assez grand pour couvrir l'écran une fois tourné */}
            <div className="absolute left-1/2 top-1/2 size-[150vmax] -translate-x-1/2 -translate-y-1/2 -rotate-45">
                <Layer src="/bunnies/tile-a.svg" direction={1} />
                <Layer src="/bunnies/tile-b.svg" direction={-1} />
            </div>
        </div>
    );
}
