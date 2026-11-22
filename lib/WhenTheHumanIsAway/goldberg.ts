// Polyèdre de Goldberg GP(n, 0), portage de godot/scripts/goldberg.gd
// (When the Human's Away, état du 21 novembre 2026, commit a0b47c2).
// Dual d'un icosaèdre dont les faces sont subdivisées à la fréquence n :
// 10 n² + 2 cases, dont exactement 12 pentagones.

export type Vec3 = [number, number, number];

const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a: Vec3, s: number): Vec3 => [a[0] * s, a[1] * s, a[2] * s];
export const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: Vec3, b: Vec3): Vec3 => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
];
export const normalize = (a: Vec3): Vec3 => {
    const l = Math.hypot(a[0], a[1], a[2]);
    return l > 0 ? [a[0] / l, a[1] / l, a[2] / l] : [0, 0, 0];
};

export type Goldberg = {
    frequency: number;
    tileCount: number;
    centers: Vec3[]; // centres des cases, sur la sphère unité
    corners: Vec3[][]; // coins de chaque case, sens anti-horaire vu de l'extérieur
    neighbors: number[][]; // neighbors[t][k] = case de l'autre côté de l'arête (coin k -> coin k+1)
    pentagon: boolean[];
};

const PHI = (1 + Math.sqrt(5)) / 2;
const ICO: Vec3[] = [
    [-1, PHI, 0],
    [1, PHI, 0],
    [-1, -PHI, 0],
    [1, -PHI, 0],
    [0, -1, PHI],
    [0, 1, PHI],
    [0, -1, -PHI],
    [0, 1, -PHI],
    [PHI, 0, -1],
    [PHI, 0, 1],
    [-PHI, 0, -1],
    [-PHI, 0, 1],
];
const FACES = [
    [0, 11, 5],
    [0, 5, 1],
    [0, 1, 7],
    [0, 7, 10],
    [0, 10, 11],
    [1, 5, 9],
    [5, 11, 4],
    [11, 10, 2],
    [10, 7, 6],
    [7, 1, 8],
    [3, 9, 4],
    [3, 4, 2],
    [3, 2, 6],
    [3, 6, 8],
    [3, 8, 9],
    [4, 9, 5],
    [2, 4, 11],
    [6, 2, 10],
    [8, 6, 7],
    [9, 8, 1],
];

export function buildGoldberg(freq: number): Goldberg {
    const n = Math.max(1, freq);
    const indexOf = new Map<string, number>();
    const verts: Vec3[] = [];
    const tris: number[] = [];

    // 1. Sphère géodésique. Un point d'une face est identifié par ses poids barycentriques entiers
    //    sur les sommets de l'icosaèdre : un point partagé par deux faces a la même clé.
    for (const f of FACES) {
        const grid = new Map<string, number>();
        for (let i = 0; i <= n; i++) {
            for (let j = 0; j <= n - i; j++) {
                const parts: [number, number][] = [];
                if (n - i - j > 0) parts.push([f[0], n - i - j]);
                if (i > 0) parts.push([f[1], i]);
                if (j > 0) parts.push([f[2], j]);
                parts.sort((p, q) => p[0] - q[0]);
                const key = parts.map((p) => `${p[0]}:${p[1]},`).join("");
                let idx = indexOf.get(key);
                if (idx === undefined) {
                    let pos: Vec3 = [0, 0, 0];
                    for (const p of parts) pos = add(pos, scale(ICO[p[0]], p[1]));
                    idx = verts.length;
                    verts.push(normalize(pos));
                    indexOf.set(key, idx);
                }
                grid.set(`${i},${j}`, idx);
            }
        }
        const at = (i: number, j: number) => grid.get(`${i},${j}`)!;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n - i; j++) {
                tris.push(at(i, j), at(i + 1, j), at(i, j + 1));
                if (i + j < n - 1) tris.push(at(i + 1, j), at(i + 1, j + 1), at(i, j + 1));
            }
        }
    }

    // 2. Dual : chaque sommet géodésique devient une case dont les coins sont les centres
    //    des triangles qui l'entourent.
    const tileCount = verts.length;
    const triCount = tris.length / 3;
    const triCenter: Vec3[] = new Array(triCount);
    const vtris: number[][] = Array.from({ length: tileCount }, () => []);
    for (let k = 0; k < triCount; k++) {
        const a = tris[3 * k];
        const b = tris[3 * k + 1];
        const c = tris[3 * k + 2];
        triCenter[k] = normalize(add(add(verts[a], verts[b]), verts[c]));
        vtris[a].push(k);
        vtris[b].push(k);
        vtris[c].push(k);
    }

    const corners: Vec3[][] = new Array(tileCount);
    const neighbors: number[][] = new Array(tileCount);
    const pentagon: boolean[] = new Array(tileCount);
    for (let t = 0; t < tileCount; t++) {
        const c = verts[t];
        const u = normalize(cross(c, Math.abs(c[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]));
        const v = cross(c, u);
        const angle = (k: number) => Math.atan2(dot(triCenter[k], v), dot(triCenter[k], u));
        const list = [...vtris[t]].sort((p, q) => angle(p) - angle(q));
        const k = list.length;
        const cs: Vec3[] = [];
        const nb: number[] = [];
        for (let i = 0; i < k; i++) {
            cs.push(triCenter[list[i]]);
            // les deux triangles consécutifs partagent l'arête (t, autre) : on cherche « autre »
            const ta = list[i];
            const tb = list[(i + 1) % k];
            let other = -1;
            for (let m = 0; m < 3; m++) {
                const va = tris[3 * ta + m];
                if (va === t) continue;
                for (let m2 = 0; m2 < 3; m2++) if (tris[3 * tb + m2] === va) other = va;
            }
            nb.push(other);
        }
        corners[t] = cs;
        neighbors[t] = nb;
        pentagon[t] = k === 5;
    }

    return { frequency: n, tileCount, centers: verts, corners, neighbors, pentagon };
}
