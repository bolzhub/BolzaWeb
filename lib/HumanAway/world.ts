// Planète procédurale, portage de godot/scripts/world.gd (When the Human's Away, état du
// 21 novembre 2026, commit a0b47c2) : plaques tectoniques -> relief -> climat -> biomes.
// Seule la carte des biomes est reprise (pas les ressources ni le jeu).
// Les tableaux PackedFloat32Array du jeu sont reproduits en Float32Array (mêmes arrondis).

import FastNoiseLite from "fastnoise-lite";
import { GodotRng } from "./rng";
import { cross, dot, normalize, type Goldberg, type Vec3 } from "./goldberg";

export const BIOME = {
    DEEP_OCEAN: 0,
    OCEAN: 1,
    COAST: 2,
    SEA_ICE: 3,
    MAELSTROM: 4,
    ICE: 5,
    TUNDRA: 6,
    TAIGA: 7,
    STEPPE: 8,
    GRASSLAND: 9,
    TEMPERATE_FOREST: 10,
    DESERT: 11,
    SAVANNA: 12,
    JUNGLE: 13,
    MOUNTAIN: 14,
    PEAK: 15,
} as const;

export const BIOME_COLORS = [
    "1d3a5f",
    "28578a",
    "4789b3",
    "d3e4ee",
    "3b2d63",
    "eef3f6",
    "a6a98c",
    "3e6a4e",
    "c2b47c",
    "8db75b",
    "4d8a3e",
    "e3ca8b",
    "cdb75c",
    "2e7a3b",
    "8b7d6c",
    "5c524a",
];

export type World = {
    g: Goldberg;
    elevation: Float32Array; // < 0 sous l'eau (normalisé à -1), terres de 0 à 1
    temperature: Float32Array; // 0 (polaire) .. 1 (équatorial)
    moisture: Float32Array;
    biome: Int32Array;
    relief: Int32Array; // 0 plat, 1 collines, 2 montagnes
    shade: Float32Array; // légère variation de couleur
    plate: Int32Array;
};

function noise(seed: number, freq: number, octaves: number): FastNoiseLite {
    const nz = new FastNoiseLite(seed);
    nz.SetNoiseType(FastNoiseLite.NoiseType.OpenSimplex2S); // TYPE_SIMPLEX_SMOOTH de Godot
    nz.SetFrequency(freq);
    nz.SetFractalType(FastNoiseLite.FractalType.FBm);
    nz.SetFractalOctaves(octaves);
    return nz;
}

export function generateWorld(g: Goldberg, seedValue: number): World {
    const n = g.tileCount;
    const rng = new GodotRng(seedValue);
    const sample = (nz: FastNoiseLite, t: number) => {
        const p = g.centers[t];
        return nz.GetNoise(p[0] * 100, p[1] * 100, p[2] * 100);
    };

    // --- Plaques : remplissage aléatoire depuis des germes, avec une vitesse de croissance
    //     propre à chaque plaque pour que leurs tailles varient beaucoup, comme sur Terre.
    const plateCount = Math.min(26, Math.max(8, Math.trunc(n / 170)));
    const plate = new Int32Array(n).fill(-1);
    const frontiers: number[][] = [];
    const weights = new Float32Array(plateCount);
    for (let p = 0; p < plateCount; p++) {
        let t = rng.randiRange(0, n - 1);
        while (plate[t] !== -1) t = rng.randiRange(0, n - 1);
        plate[t] = p;
        frontiers.push([t]);
        weights[p] = Math.pow(rng.randfRange(0.25, 1.0), 2.0);
    }
    let assigned = plateCount;
    while (assigned < n) {
        let total = 0;
        for (let p = 0; p < plateCount; p++) if (frontiers[p].length) total += weights[p];
        let r = rng.randf() * total;
        let chosen = 0;
        for (let p = 0; p < plateCount; p++) {
            if (!frontiers[p].length) continue;
            chosen = p;
            r -= weights[p];
            if (r <= 0) break;
        }
        const fr = frontiers[chosen];
        const i = rng.randiRange(0, fr.length - 1);
        const t = fr[i];
        const free = g.neighbors[t].filter((u) => plate[u] === -1);
        if (!free.length) {
            fr[i] = fr[fr.length - 1];
            fr.pop();
            continue;
        }
        const nb = free[rng.randiRange(0, free.length - 1)];
        plate[nb] = chosen;
        fr.push(nb);
        assigned++;
    }

    const area = new Int32Array(plateCount);
    for (let t = 0; t < n; t++) area[plate[t]]++;
    const order = Array.from({ length: plateCount }, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
        const j = rng.randiRange(0, i);
        [order[i], order[j]] = [order[j], order[i]];
    }
    const continental = new Array<boolean>(plateCount).fill(false);
    let covered = 0;
    for (const p of order) {
        if (covered < n * 0.36) {
            continental[p] = true;
            covered += area[p];
        }
    }
    const axis: Vec3[] = [];
    const speed = new Float32Array(plateCount);
    const base = new Float32Array(plateCount);
    for (let p = 0; p < plateCount; p++) {
        const x = rng.randfn();
        const y = rng.randfn();
        const z = rng.randfn();
        axis.push(normalize([x, y, z]));
        speed[p] = rng.randfRange(0.4, 1.2);
        base[p] = continental[p] ? rng.randfRange(0.12, 0.28) : rng.randfRange(-0.38, -0.26);
    }

    // --- Relief né des interactions entre plaques (chaque plaque tourne autour de son pôle d'Euler) :
    //     convergence continent/continent -> hautes chaînes ; continent/océan -> cordillère + fosse ;
    //     océan/océan -> arcs insulaires ; divergence -> rifts à terre, dorsales sous la mer.
    const effect = new Float32Array(n);
    const tectonic = new Float32Array(n);
    const dist = new Int32Array(n).fill(-1);
    const queue: number[] = [];
    const velocity = (pl: number, p: Vec3): Vec3 => {
        const v = cross(axis[pl], p);
        return [v[0] * speed[pl], v[1] * speed[pl], v[2] * speed[pl]];
    };
    for (let t = 0; t < n; t++) {
        const pa = plate[t];
        const p = g.centers[t];
        const va = velocity(pa, p);
        let sumE = 0;
        let sumC = 0;
        let cnt = 0;
        for (const u of g.neighbors[t]) {
            const pb = plate[u];
            if (pb === pa) continue;
            const vb = velocity(pb, p);
            const q = g.centers[u];
            const dir = normalize([q[0] - p[0], q[1] - p[1], q[2] - p[2]]);
            const conv = dot([va[0] - vb[0], va[1] - vb[1], va[2] - vb[2]], dir);
            const ca = continental[pa];
            const cb = continental[pb];
            let e: number;
            if (conv > 0) {
                if (ca && cb) e = 1.15 * conv;
                else if (ca) e = 0.85 * conv;
                else if (cb) e = -0.45 * conv;
                else e = 0.6 * conv;
            } else {
                e = ca ? 0.3 * conv : -0.2 * conv;
            }
            sumE += e;
            sumC += conv;
            cnt++;
        }
        if (cnt > 0) {
            effect[t] = sumE / cnt;
            tectonic[t] = sumC / cnt;
            dist[t] = 0;
            queue.push(t);
        }
    }
    // l'effet de la frontière se propage dans chaque plaque avec une décroissance gaussienne
    for (let head = 0; head < queue.length; head++) {
        const t = queue[head];
        for (const u of g.neighbors[t]) {
            if (dist[u] === -1 && plate[u] === plate[t]) {
                dist[u] = dist[t] + 1;
                effect[u] = effect[t];
                tectonic[u] = tectonic[t];
                queue.push(u);
            }
        }
    }
    const width = Math.max(1.5, g.frequency / 6.5);
    const big = noise(seedValue + 11, 0.012, 4);
    const fine = noise(seedValue + 23, 0.05, 3);
    let raw = new Float32Array(n);
    for (let t = 0; t < n; t++) {
        const d = Math.max(dist[t], 0);
        const fall = Math.exp(-Math.pow(d / width, 2));
        tectonic[t] *= fall;
        raw[t] = base[plate[t]] + effect[t] * fall * 0.75 + sample(big, t) * 0.34 + sample(fine, t) * 0.08;
    }
    // léger lissage pour que les côtes ne suivent pas trop strictement les frontières des plaques
    for (let pass = 0; pass < 2; pass++) {
        const sm = raw.slice();
        for (let t = 0; t < n; t++) {
            let s = 0;
            for (const u of g.neighbors[t]) s += raw[u];
            sm[t] = 0.55 * raw[t] + (0.45 * s) / g.neighbors[t].length;
        }
        raw = sm;
    }
    // niveau de la mer : ~63 % de la planète sous l'eau
    const sorted = raw.slice().sort();
    const sea = sorted[Math.trunc(n * 0.63)];
    const hi = sorted[n - 1] - sea;
    const lo = sea - sorted[0];
    const elevation = new Float32Array(n);
    for (let t = 0; t < n; t++) {
        const e = raw[t] - sea;
        elevation[t] = e >= 0 ? Math.pow(e / hi, 0.85) : -Math.pow(-e / lo, 0.8);
        if (g.pentagon[t] && e >= 0) elevation[t] = Math.max(elevation[t], 0.95);
    }
    const isWater = (t: number) => elevation[t] < 0;

    // --- Climat : température (latitude, altitude) et humidité (distance à la mer,
    //     cellules de Hadley / Ferrel / polaires)
    const temperature = new Float32Array(n);
    const moisture = new Float32Array(n);
    const tn = noise(seedValue + 37, 0.03, 3);
    const mn = noise(seedValue + 41, 0.025, 4);
    const seaDist = new Int32Array(n).fill(-1);
    const q2: number[] = [];
    for (let t = 0; t < n; t++) {
        if (isWater(t)) {
            seaDist[t] = 0;
            q2.push(t);
        }
    }
    for (let head = 0; head < q2.length; head++) {
        const t = q2[head];
        for (const u of g.neighbors[t]) {
            if (seaDist[u] === -1) {
                seaDist[u] = seaDist[t] + 1;
                q2.push(u);
            }
        }
    }
    const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
    for (let t = 0; t < n; t++) {
        const lat = Math.asin(Math.min(1, Math.max(-1, g.centers[t][1])));
        const temp = Math.pow(Math.cos(lat), 1.3) - Math.max(elevation[t], 0) * 0.45 + sample(tn, t) * 0.07;
        temperature[t] = clamp01(temp);
        if (isWater(t)) {
            moisture[t] = 1;
            continue;
        }
        const coast = Math.exp(-seaDist[t] / (g.frequency * 0.16 + 1));
        const cells = 0.5 + 0.5 * Math.cos(lat * 6);
        moisture[t] = clamp01(0.45 * coast + 0.38 * cells + 0.3 * sample(mn, t) + 0.05);
    }

    // --- Biomes
    const biome = new Int32Array(n);
    const relief = new Int32Array(n);
    const shade = new Float32Array(n);
    const sn = noise(seedValue + 53, 0.08, 2);
    const touchesLand = (t: number) => g.neighbors[t].some((u) => elevation[u] >= 0);
    for (let t = 0; t < n; t++) {
        shade[t] = sample(sn, t) * 0.07;
        const e = elevation[t];
        const temp = temperature[t];
        const m = moisture[t];
        if (e < 0) {
            relief[t] = 0;
            if (g.pentagon[t]) biome[t] = BIOME.MAELSTROM;
            else if (temp < 0.12) biome[t] = BIOME.SEA_ICE;
            else if (e > -0.16 || touchesLand(t)) biome[t] = BIOME.COAST;
            else if (e > -0.55) biome[t] = BIOME.OCEAN;
            else biome[t] = BIOME.DEEP_OCEAN;
            continue;
        }
        relief[t] = e > 0.7 ? 2 : e > 0.42 ? 1 : 0;
        if (g.pentagon[t]) {
            biome[t] = BIOME.PEAK;
            relief[t] = 2;
        } else if (relief[t] === 2) biome[t] = BIOME.MOUNTAIN;
        else if (temp < 0.12) biome[t] = BIOME.ICE;
        else if (temp < 0.28) biome[t] = BIOME.TUNDRA;
        else if (temp < 0.45) biome[t] = m > 0.5 ? BIOME.TAIGA : BIOME.STEPPE;
        else if (temp < 0.72) biome[t] = m < 0.26 ? BIOME.DESERT : m < 0.52 ? BIOME.GRASSLAND : BIOME.TEMPERATE_FOREST;
        else biome[t] = m < 0.28 ? BIOME.DESERT : m < 0.55 ? BIOME.SAVANNA : BIOME.JUNGLE;
    }

    return { g, elevation, temperature, moisture, biome, relief, shade, plate };
}
