import crypto from "node:crypto";
import fs from "node:fs/promises";
import type { Dirent } from "node:fs";
import path from "node:path";
import { getFileInfo } from "./fileTypes";
import type { SongFile, SongSummary } from "./types";

export const CHANT_ROOT = path.resolve(process.env.CHANT_ROOT ?? "/mnt/Bolzananas/Nomade/Chant");
export const MAX_FILE_BYTES = 4 * 1024 * 1024 * 1024; // 4 Go par fichier

const TAGS_FILE = path.join(CHANT_ROOT, ".chant-tags.json");

export class ChantError extends Error {
    status: number;
    constructor(message: string, status = 400) {
        super(message);
        this.status = status;
    }
}

/* ---------- Noms : disque <-> affichage ---------- */

// "morceau_de_titre-autre_titre" -> "morceau de titre - autre titre"
export function diskToDisplay(disk: string): string {
    return disk.replace(/_/g, " ").replace(/-/g, " - ").replace(/\s+/g, " ").trim();
}

// "morceau de titre - autre titre" -> "morceau_de_titre-autre_titre"
export function displayToDisk(display: string): string | null {
    const cleaned = display.replace(/[\u0000-\u001f\u007f/\\<>:"|?*]/g, " ");
    const disk = cleaned
        .split("-")
        .map((part) => part.trim().replace(/\s+/g, "_"))
        .filter(Boolean)
        .join("-");
    return isValidSegment(disk) ? disk : null;
}

export function isValidSegment(s: string): boolean {
    return (
        s.length > 0 &&
        Buffer.byteLength(s) <= 240 &&
        s !== "." &&
        s !== ".." &&
        !s.startsWith(".") &&
        !/[\u0000-\u001f\u007f/\\]/.test(s)
    );
}

export function sanitizeFileName(raw: string): string | null {
    const name = raw
        .replace(/[\u0000-\u001f\u007f/\\<>:"|?*]/g, "_")
        .replace(/^\.+/, "")
        .trim();
    return isValidSegment(name) ? name : null;
}

export const toSlug = (disk: string) => Buffer.from(disk, "utf8").toString("base64url");
export const fromSlug = (slug: string) => Buffer.from(slug, "base64url").toString("utf8");

/* ---------- Chemins sûrs ---------- */

function resolveInRoot(...segments: string[]): string {
    if (!segments.every(isValidSegment)) throw new ChantError("Chemin invalide.");
    const full = path.resolve(CHANT_ROOT, ...segments);
    if (!full.startsWith(CHANT_ROOT + path.sep)) throw new ChantError("Chemin invalide.");
    return full;
}

export const songPath = (disk: string) => resolveInRoot(disk);
export const filePath = (disk: string, name: string) => resolveInRoot(disk, name);

const collator = new Intl.Collator("fr", { numeric: true, sensitivity: "base" });

/* ---------- Chansons et fichiers ---------- */

export async function listSongs(): Promise<SongSummary[]> {
    const [entries, store] = await Promise.all([fs.readdir(CHANT_ROOT, { withFileTypes: true }), readStore()]);

    const dirs = entries.filter((e) => e.isDirectory() && !e.name.startsWith("."));

    const songs = await Promise.all(
        dirs.map(async (d) => {
            const inner = await fs
                .readdir(path.join(CHANT_ROOT, d.name), { withFileTypes: true })
                .catch(() => [] as Dirent[]);
            const visible = inner.filter((f) => !f.name.startsWith("."));
            return {
                slug: toSlug(d.name),
                diskName: d.name,
                name: diskToDisplay(d.name),
                fileCount: visible.filter((f) => f.isFile()).length,
                isEmpty: visible.length === 0,
                tags: store.songs[d.name] ?? [],
            };
        }),
    );

    return songs.sort((a, b) => collator.compare(a.name, b.name));
}

export async function listSongFiles(disk: string): Promise<SongFile[]> {
    const dir = songPath(disk);
    let entries: Dirent[];
    try {
        entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
        throw new ChantError("Dossier introuvable.", 404);
    }

    const files = await Promise.all(
        entries
            .filter((e) => e.isFile() && !e.name.startsWith("."))
            .map(async (e) => {
                const st = await fs.stat(path.join(dir, e.name));
                return {
                    name: e.name,
                    size: st.size,
                    modified: st.mtimeMs,
                    kind: getFileInfo(e.name).kind,
                };
            }),
    );

    return files.sort((a, b) => collator.compare(a.name, b.name));
}

export async function getSongDetail(disk: string) {
    const [files, store] = await Promise.all([listSongFiles(disk), readStore()]);
    return {
        diskName: disk,
        name: diskToDisplay(disk),
        files,
        selectedTags: store.songs[disk] ?? [],
        allTags: store.tags,
        tagOrder: displayOrder(store),
    };
}

export async function createSong(display: string): Promise<SongSummary> {
    const disk = displayToDisk(display);
    if (!disk) throw new ChantError("Nom de dossier invalide.");
    try {
        await fs.mkdir(songPath(disk)); // non récursif : échoue si le dossier existe
    } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "EEXIST") {
            throw new ChantError("Ce dossier existe déjà.", 409);
        }
        throw err;
    }
    return {
        slug: toSlug(disk),
        diskName: disk,
        name: diskToDisplay(disk),
        fileCount: 0,
        isEmpty: true,
        tags: [],
    };
}

/* ---------- Suppression (corbeille) ---------- */

// Rien n'est supprimé directement : tout part dans CHANT_ROOT/.corbeille (caché,
// même disque donc déplacement instantané), puis est purgé après TRASH_DAYS jours.
// Chaque suppression a son sous-dossier daté : .corbeille/<date>/<dossier>[/<fichier>]
const TRASH_DIR = path.join(CHANT_ROOT, ".corbeille");
const TRASH_DAYS = 30;

async function purgeTrash() {
    const entries = await fs.readdir(TRASH_DIR, { withFileTypes: true }).catch(() => [] as Dirent[]);
    const limit = Date.now() - TRASH_DAYS * 24 * 3600 * 1000;
    await Promise.all(
        entries.map(async (e) => {
            const p = path.join(TRASH_DIR, e.name);
            const st = await fs.stat(p).catch(() => null);
            if (st && st.mtimeMs < limit) await fs.rm(p, { recursive: true, force: true });
        }),
    );
}

async function moveToTrash(src: string, ...relative: string[]) {
    await purgeTrash().catch((err) => console.error("[chant] purge corbeille", err));
    const stamp = `${new Date().toISOString().replace(/[:.]/g, "-")}_${crypto.randomUUID().slice(0, 8)}`;
    const dest = path.join(TRASH_DIR, stamp, ...relative);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.rename(src, dest);
}

async function hasActiveUpload(dir: string): Promise<boolean> {
    await cleanupStaleUploads(dir);
    const inner = await fs.readdir(dir).catch(() => [] as string[]);
    return inner.some((n) => /^\.upload-[A-Za-z0-9_-]+\.part$/.test(n));
}

export function deleteSong(disk: string): Promise<void> {
    return withLock(async () => {
        const dir = songPath(disk);
        const st = await fs.stat(dir).catch(() => null);
        if (!st?.isDirectory()) throw new ChantError("Dossier introuvable.", 404);

        if (await hasActiveUpload(dir)) {
            throw new ChantError("Un envoi est en cours dans ce dossier : réessayez quand il sera terminé.", 409);
        }

        await moveToTrash(dir, disk);

        const store = await readStore();
        if (Object.prototype.hasOwnProperty.call(store.songs, disk)) {
            delete store.songs[disk];
            await writeStore(store);
        }
    });
}

export function deleteFile(disk: string, name: string): Promise<void> {
    return withLock(async () => {
        const full = filePath(disk, name);
        const st = await fs.lstat(full).catch(() => null);
        if (!st?.isFile()) throw new ChantError("Fichier introuvable.", 404);
        await moveToTrash(full, disk, name);
    });
}

export function renameSong(disk: string, display: string): Promise<{ slug: string; diskName: string; name: string }> {
    return withLock(async () => {
        const newDisk = displayToDisk(display);
        if (!newDisk) throw new ChantError("Nom de dossier invalide.");

        const from = songPath(disk);
        const fromStat = await fs.stat(from).catch(() => null);
        if (!fromStat?.isDirectory()) throw new ChantError("Dossier introuvable.", 404);

        const result = { slug: toSlug(newDisk), diskName: newDisk, name: diskToDisplay(newDisk) };
        if (newDisk === disk) return result;

        // Un envoi en cours écrit dans le dossier : le renommer le ferait échouer
        if (await hasActiveUpload(from)) {
            throw new ChantError("Un envoi est en cours dans ce dossier : réessayez quand il sera terminé.", 409);
        }

        // Cible déjà prise par un autre dossier ? (sur un disque insensible à la casse,
        // « Titre » et « titre » sont le même dossier : on compare les inodes)
        const to = songPath(newDisk);
        const toStat = await fs.stat(to).catch(() => null);
        if (toStat && !(toStat.ino === fromStat.ino && toStat.dev === fromStat.dev)) {
            throw new ChantError("Un dossier porte déjà ce nom.", 409);
        }

        await fs.rename(from, to);

        // Les tags suivent le dossier
        const store = await readStore();
        if (Object.prototype.hasOwnProperty.call(store.songs, disk)) {
            store.songs[newDisk] = store.songs[disk];
            delete store.songs[disk];
            await writeStore(store);
        }

        return result;
    });
}

export function renameFile(disk: string, name: string, raw: string): Promise<string> {
    return withLock(async () => {
        const newName = sanitizeFileName(raw);
        if (!newName) throw new ChantError("Nom de fichier invalide.");

        const from = filePath(disk, name);
        const fromStat = await fs.lstat(from).catch(() => null);
        if (!fromStat?.isFile()) throw new ChantError("Fichier introuvable.", 404);
        if (newName === name) return name;

        // Cible déjà prise ? (même fichier si seule la casse change sur un disque insensible à la casse)
        const to = filePath(disk, newName);
        const toStat = await fs.lstat(to).catch(() => null);
        if (toStat && !(toStat.ino === fromStat.ino && toStat.dev === fromStat.dev)) {
            throw new ChantError("Un fichier porte déjà ce nom dans ce dossier.", 409);
        }

        await fs.rename(from, to);
        return newName;
    });
}

/* ---------- Envois ---------- */

async function exists(p: string) {
    return fs.access(p).then(
        () => true,
        () => false,
    );
}

export async function uniqueFileName(dir: string, name: string): Promise<string> {
    const dot = name.lastIndexOf(".");
    const stem = dot > 0 ? name.slice(0, dot) : name;
    const ext = dot > 0 ? name.slice(dot) : "";
    let candidate = name;
    for (let i = 1; await exists(path.join(dir, candidate)); i++) {
        candidate = `${stem} (${i})${ext}`;
    }
    return candidate;
}

// Supprime les envois abandonnés depuis plus de 24 h
export async function cleanupStaleUploads(dir: string) {
    const entries = await fs.readdir(dir).catch(() => [] as string[]);
    const limit = Date.now() - 24 * 3600 * 1000;
    await Promise.all(
        entries
            .filter((n) => /^\.upload-[A-Za-z0-9_-]+\.part$/.test(n))
            .map(async (n) => {
                const p = path.join(dir, n);
                const st = await fs.stat(p).catch(() => null);
                if (st && st.mtimeMs < limit) await fs.rm(p, { force: true });
            }),
    );
}

/* ---------- Tags ---------- */

// tags : ordre de création (sert aux couleurs, qui restent donc stables)
// order : ordre d'affichage choisi par glisser-déposer
type TagStore = { tags: string[]; order?: string[]; songs: Record<string, string[]> };

// Ordre d'affichage : l'ordre enregistré, puis les tags absents (nouveaux) à la fin
function displayOrder(store: TagStore): string[] {
    const known = (store.order ?? []).filter((t) => store.tags.includes(t));
    return [...new Set([...known, ...store.tags])];
}

let queue: Promise<unknown> = Promise.resolve();
function withLock<T>(fn: () => Promise<T>): Promise<T> {
    const run = queue.then(fn);
    queue = run.catch(() => undefined);
    return run;
}

async function readStore(): Promise<TagStore> {
    try {
        const parsed = JSON.parse(await fs.readFile(TAGS_FILE, "utf8"));
        return {
            tags: Array.isArray(parsed.tags) ? parsed.tags.filter((t: unknown) => typeof t === "string") : [],
            order: Array.isArray(parsed.order) ? parsed.order.filter((t: unknown) => typeof t === "string") : undefined,
            songs: parsed.songs && typeof parsed.songs === "object" ? parsed.songs : {},
        };
    } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") {
            return { tags: ["Polyphonie", "Romain"], songs: {} };
        }
        throw err;
    }
}

async function writeStore(store: TagStore) {
    const tmp = `${TAGS_FILE}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(store, null, 2), "utf8");
    await fs.rename(tmp, TAGS_FILE);
}

// allTags : ordre de création (couleurs) ; tagOrder : ordre d'affichage
export async function getTagLists(): Promise<{ allTags: string[]; tagOrder: string[] }> {
    const store = await readStore();
    return { allTags: store.tags, tagOrder: displayOrder(store) };
}

export function reorderTags(order: string[]): Promise<string[]> {
    return withLock(async () => {
        const store = await readStore();
        const same =
            order.length === store.tags.length &&
            new Set(order).size === order.length &&
            order.every((t) => store.tags.includes(t));
        if (!same) throw new ChantError("La liste des tags a changé : rechargez la page.", 409);

        store.order = order;
        await writeStore(store);
        return order;
    });
}

export function createTag(raw: string): Promise<string> {
    return withLock(async () => {
        const name = raw.trim().replace(/\s+/g, " ");
        if (name.length < 1 || name.length > 40 || /[\u0000-\u001f\u007f]/.test(name)) {
            throw new ChantError("Nom de tag invalide (1 à 40 caractères).");
        }
        const store = await readStore();
        if (store.tags.some((t) => t.toLowerCase() === name.toLowerCase())) {
            throw new ChantError("Ce tag existe déjà.", 409);
        }
        store.tags.push(name);
        await writeStore(store);
        return name;
    });
}

export function deleteTag(raw: string): Promise<void> {
    return withLock(async () => {
        const store = await readStore();
        const canonical = store.tags.find((t) => t.toLowerCase() === raw.trim().toLowerCase());
        if (!canonical) throw new ChantError("Tag inconnu.", 404);

        // On ne compte que les dossiers qui existent encore sur le disque
        const entries = await fs.readdir(CHANT_ROOT, { withFileTypes: true });
        const existing = new Set(entries.filter((e) => e.isDirectory()).map((e) => e.name));
        const usedBy = Object.entries(store.songs).filter(
            ([disk, tags]) => existing.has(disk) && tags.includes(canonical),
        ).length;

        if (usedBy > 0) {
            throw new ChantError(
                `Ce tag est utilisé par ${usedBy} dossier${usedBy > 1 ? "s" : ""} : retirez-le d'abord.`,
                409,
            );
        }

        store.tags = store.tags.filter((t) => t !== canonical);
        if (store.order) store.order = store.order.filter((t) => t !== canonical);
        for (const disk of Object.keys(store.songs)) {
            store.songs[disk] = store.songs[disk].filter((t) => t !== canonical);
        }
        await writeStore(store);
    });
}

export function setSongTag(disk: string, tag: string, on: boolean): Promise<string[]> {
    return withLock(async () => {
        const st = await fs.stat(songPath(disk)).catch(() => null);
        if (!st?.isDirectory()) throw new ChantError("Dossier introuvable.", 404);

        const store = await readStore();
        const canonical = store.tags.find((t) => t.toLowerCase() === tag.trim().toLowerCase());
        if (!canonical) throw new ChantError("Tag inconnu.", 404);

        const current = new Set(store.songs[disk] ?? []);
        if (on) current.add(canonical);
        else current.delete(canonical);
        store.songs[disk] = [...current];

        await writeStore(store);
        return store.songs[disk];
    });
}
