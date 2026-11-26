#!/usr/bin/env node
// Génère les deux motifs du fond de lapins de la page d'accueil (public/bunnies/tile-a.svg et tile-b.svg).
//
// Usage : node scripts/generate-bunny-tiles.mjs [graine]
//
// Le fond est fait de rangées de lapins tournées à 45° (les diagonales). Les rangées paires sont dans le
// motif A, les impaires dans le motif B : chaque motif est un seul calque qui se répète et glisse dans un
// sens, l'autre dans le sens opposé. Dans le motif, chaque lapin est tourné de +45° pour apparaître droit
// une fois le calque tourné de −45°. Les couleurs sont tirées au hasard (graine fixe, résultat reproductible).
// Les sources sont les SVG de scripts/bunnies/ (exports Inkscape des « bunny_loaf »).

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

// 🎛️ Réglages (unités du motif = pixels à l'écran, avant la mise à l'échelle CSS éventuelle)
const BUNNY_HEIGHT = 44; // hauteur d'un lapin
const STEP = 40; // écart entre deux lapins le long d'une diagonale
const ROW_GAP = 40; // écart entre deux diagonales voisines
const PER_ROW = 24; // lapins par diagonale dans le motif (avant répétition)
const ROWS_PER_TILE = 12; // diagonales par motif et par calque (avant répétition)

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const SRC = path.join(ROOT, "bunnies");
const OUT = path.join(ROOT, "..", "public", "bunnies");

let seed = Number(process.argv[2] ?? 7) >>> 0;
const random = () => {
    // mulberry32
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Lit un export Inkscape et n'en garde que le dessin (sans métadonnées ni attributs inkscape/sodipodi).
function readBunny(file) {
    const svg = readFileSync(path.join(SRC, file), "utf8");
    const [, vbW, vbH] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
    const body = svg
        .slice(svg.indexOf(">", svg.indexOf("<svg")) + 1, svg.lastIndexOf("</svg>"))
        .replace(/<defs[^>]*\/>/g, "")
        .replace(/<sodipodi:namedview[^>]*\/>/g, "")
        .replace(/\s+(inkscape|sodipodi):[\w-]+="[^"]*"/g, "")
        .replace(/\s+id="[^"]*"/g, "")
        .replace(/style="fill:(#[0-9a-f]+)"/gi, 'fill="$1"')
        .replace(/\s+/g, " ")
        .replace(/> </g, "><");
    return { w: Number(vbW), h: Number(vbH), body };
}

const files = readdirSync(SRC)
    .filter((f) => f.endsWith(".svg"))
    .sort();
const bunnies = files.map(readBunny);
const scale = BUNNY_HEIGHT / bunnies[0].h;
const W = bunnies[0].w * scale;

const symbols = bunnies
    .map(
        (b, i) =>
            `<symbol id="b${i}" viewBox="0 0 ${b.w} ${b.h}" width="${W.toFixed(2)}" height="${BUNNY_HEIGHT}">${b.body}</symbol>`,
    )
    .join("");

const tileW = PER_ROW * STEP;
const tileH = 2 * ROWS_PER_TILE * ROW_GAP;
const reach = (W + BUNNY_HEIGHT) / Math.SQRT2 / 2; // demi-côté de la boîte du lapin tourné

function tile(parity) {
    const uses = [];
    let previous = -1;
    for (let r = 0; r < ROWS_PER_TILE; r++) {
        const cy = (2 * r + parity + 0.5) * ROW_GAP;
        for (let k = 0; k < PER_ROW; k++) {
            const cx = (k + 0.5) * STEP;
            let pick;
            do pick = Math.floor(random() * bunnies.length);
            while (pick === previous); // jamais deux fois la même couleur côte à côte
            previous = pick;
            // copies décalées d'un motif pour les lapins qui débordent du bord (raccord sans couture)
            const xs = [0, ...(cx - reach < 0 ? [tileW] : []), ...(cx + reach > tileW ? [-tileW] : [])];
            const ys = [0, ...(cy - reach < 0 ? [tileH] : []), ...(cy + reach > tileH ? [-tileH] : [])];
            for (const dx of xs)
                for (const dy of ys) {
                    const x = cx + dx;
                    const y = cy + dy;
                    uses.push(
                        `<use href="#b${pick}" x="${(x - W / 2).toFixed(2)}" y="${(y - BUNNY_HEIGHT / 2).toFixed(2)}" transform="rotate(45 ${x.toFixed(2)} ${y.toFixed(2)})"/>`,
                    );
                }
        }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${tileW}" height="${tileH}" viewBox="0 0 ${tileW} ${tileH}">${symbols}${uses.join("")}</svg>\n`;
}

writeFileSync(path.join(OUT, "tile-a.svg"), tile(0));
writeFileSync(path.join(OUT, "tile-b.svg"), tile(1));
console.log(`Motifs ${tileW}×${tileH} écrits dans public/bunnies/ (${bunnies.length} lapins : ${files.join(", ")})`);
