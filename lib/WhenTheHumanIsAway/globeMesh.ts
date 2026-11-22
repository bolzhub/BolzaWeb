// Géométrie et couleurs du globe, portage de godot/scripts/globe.gd (vue « Biomes », couleurs
// adoucies en pastel pour le site, voir pastel() ;
// When the Human's Away, état du 21 novembre 2026, commit a0b47c2).
// Chaque case est un prisme : dessus (centre + anneau intérieur à la couleur de la case,
// anneau extérieur plus sombre pour la bordure) et parois vers les voisins plus bas.

import { normalize, type Vec3 } from "./goldberg";
import { BIOME, BIOME_COLORS, type World } from "./world";

const INSET = 0.86;
const HEIGHT_SCALE = 0.05;

export type SurfaceArrays = {
    positions: Float32Array;
    normals: Float32Array;
    colors: Float32Array;
    indices: Uint32Array;
};

type Rgb = [number, number, number];
const hex = (h: string): Rgb => [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
];
const lerp = (a: Rgb, b: Rgb, t: number): Rgb => [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
];
const darkened = (c: Rgb, amount: number): Rgb => [c[0] * (1 - amount), c[1] * (1 - amount), c[2] * (1 - amount)];
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

const BIOME_RGB = BIOME_COLORS.map(hex);
const DEEP = hex("0f2340");
const WHITE: Rgb = [1, 1, 1];

// Globe.tile_color, vue Biomes. Les couleurs restent les valeurs brutes de Godot : le jeu les traite
// comme linéaires (vertex_color_is_srgb désactivé), on fait de même côté three.js.
function tileColor(w: World, t: number): Rgb {
    const e = w.elevation[t];
    let col = BIOME_RGB[w.biome[t]];
    if (e < 0) return lerp(col, DEEP, clamp(-e * 0.4, 0, 0.4));
    if (w.relief[t] === 1) col = darkened(col, 0.12);
    else if (w.biome[t] === BIOME.MOUNTAIN && w.temperature[t] < 0.42) col = lerp(col, WHITE, 0.6);
    const s = 1 + w.shade[t];
    return [col[0] * s, col[1] * s, col[2] * s];
}

// 🎛️ Version pastel du site (le jeu, lui, garde ses couleurs d'origine) :
// chaque couleur est désaturée vers son gris, puis éclaircie vers le blanc.
// PASTEL_DESATURATE = 0 et PASTEL_LIGHTEN = 0 rendent exactement les couleurs du jeu.
const PASTEL_DESATURATE = 0.12;
const PASTEL_LIGHTEN = 0.14;

function pastel(c: Rgb): Rgb {
    const grey = 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
    const d = lerp(c, [grey, grey, grey], PASTEL_DESATURATE);
    return lerp(d, WHITE, PASTEL_LIGHTEN);
}

function tileHeight(w: World, t: number): number {
    if (w.elevation[t] < 0) return 1.0;
    const e = w.biome[t] === BIOME.PEAK ? 1.25 : w.elevation[t];
    return 1.006 + e * HEIGHT_SCALE;
}

// Deux surfaces, comme dans le jeu : 0 = terres (mates), 1 = eau (brillante)
export function buildGlobeSurfaces(w: World): [SurfaceArrays, SurfaceArrays] {
    const g = w.g;
    const n = g.tileCount;
    const heights = new Float32Array(n);
    for (let t = 0; t < n; t++) heights[t] = tileHeight(w, t);

    const surfaces = [0, 1].map((s) => {
        const P: number[] = [];
        const N: number[] = [];
        const C: number[] = [];
        const I: number[] = [];
        const push = (p: Vec3, nrm: Vec3, c: Rgb) => {
            P.push(p[0], p[1], p[2]);
            N.push(nrm[0], nrm[1], nrm[2]);
            C.push(c[0], c[1], c[2]);
        };
        // triangle orienté vers l'extérieur (sens anti-horaire vu depuis `out`, convention three.js)
        const tri = (a: number, b: number, c: number, out: Vec3) => {
            const ax = P[3 * a],
                ay = P[3 * a + 1],
                az = P[3 * a + 2];
            const ux = P[3 * b] - ax,
                uy = P[3 * b + 1] - ay,
                uz = P[3 * b + 2] - az;
            const vx = P[3 * c] - ax,
                vy = P[3 * c + 1] - ay,
                vz = P[3 * c + 2] - az;
            const cx = uy * vz - uz * vy,
                cy = uz * vx - ux * vz,
                cz = ux * vy - uy * vx;
            if (cx * out[0] + cy * out[1] + cz * out[2] >= 0) I.push(a, b, c);
            else I.push(a, c, b);
        };

        for (let t = 0; t < n; t++) {
            if ((w.elevation[t] < 0 ? 1 : 0) !== s) continue;
            const c = g.centers[t];
            const h = heights[t];
            const cs = g.corners[t];
            const k = cs.length;
            const fill = pastel(tileColor(w, t));
            const border = darkened(fill, 0.22);
            const wall = darkened(fill, 0.45);
            const base = P.length / 3;
            // dessus : centre, anneau intérieur (couleur de la case), anneau extérieur (bordure)
            push([c[0] * h, c[1] * h, c[2] * h], c, fill);
            for (let i = 0; i < k; i++) {
                const q = normalize([
                    c[0] + (cs[i][0] - c[0]) * INSET,
                    c[1] + (cs[i][1] - c[1]) * INSET,
                    c[2] + (cs[i][2] - c[2]) * INSET,
                ]);
                push([q[0] * h, q[1] * h, q[2] * h], c, fill);
            }
            for (let i = 0; i < k; i++) push([cs[i][0] * h, cs[i][1] * h, cs[i][2] * h], c, border);
            for (let i = 0; i < k; i++) {
                const j = (i + 1) % k;
                tri(base, base + 1 + i, base + 1 + j, c);
                tri(base + 1 + i, base + 1 + k + i, base + 1 + k + j, c);
                tri(base + 1 + i, base + 1 + k + j, base + 1 + j, c);
            }
            // parois descendant vers les voisins plus bas
            for (let i = 0; i < k; i++) {
                const u = g.neighbors[t][i];
                const hu = heights[u];
                if (h <= hu + 0.0001) continue;
                const j = (i + 1) % k;
                const out = normalize([
                    (cs[i][0] + cs[j][0]) * 0.5 - c[0],
                    (cs[i][1] + cs[j][1]) * 0.5 - c[1],
                    (cs[i][2] + cs[j][2]) * 0.5 - c[2],
                ]);
                const b0 = P.length / 3;
                push([cs[i][0] * h, cs[i][1] * h, cs[i][2] * h], out, wall);
                push([cs[j][0] * h, cs[j][1] * h, cs[j][2] * h], out, wall);
                push([cs[j][0] * hu, cs[j][1] * hu, cs[j][2] * hu], out, wall);
                push([cs[i][0] * hu, cs[i][1] * hu, cs[i][2] * hu], out, wall);
                tri(b0, b0 + 1, b0 + 2, out);
                tri(b0, b0 + 2, b0 + 3, out);
            }
        }
        return {
            positions: new Float32Array(P),
            normals: new Float32Array(N),
            colors: new Float32Array(C),
            indices: new Uint32Array(I),
        };
    });
    return [surfaces[0], surfaces[1]];
}
