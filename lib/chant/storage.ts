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

export function deleteSong(disk: string): Promise<void> {
  return withLock(async () => {
    const dir = songPath(disk);

    let entries: Dirent[];
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      throw new ChantError("Dossier introuvable.", 404);
    }

    if (entries.some((e) => !e.name.startsWith("."))) {
      throw new ChantError(
        "Ce dossier n'est pas vide : il contient des fichiers ou des sous-dossiers.",
        409
      );
    }

    // Débris sans valeur : .DS_Store et envois interrompus
    await Promise.all(
      entries
        .filter(
          (e) =>
            e.isFile() &&
            (e.name === ".DS_Store" || /^\.upload-[A-Za-z0-9_-]+\.part$/.test(e.name))
        )
        .map((e) => fs.rm(path.join(dir, e.name), { force: true }))
    );

    try {
      await fs.rmdir(dir); // non récursif : échoue si quoi que ce soit reste dedans
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === "ENOTEMPTY" || code === "EEXIST") {
        throw new ChantError(
          "Le dossier n'est pas vide (fichiers cachés ou envoi en cours).",
          409
        );
      }
      throw err;
    }

    const store = await readStore();
    if (Object.prototype.hasOwnProperty.call(store.songs, disk)) {
      delete store.songs[disk];
      await writeStore(store);
    }
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

type TagStore = { tags: string[]; songs: Record<string, string[]> };

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

export async function getTags(): Promise<string[]> {
    return (await readStore()).tags;
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
