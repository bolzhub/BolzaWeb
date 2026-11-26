import fs from "fs";
import path from "path";
import { DISK_ROOT } from "@/lib/media/config";
import { mediaUrl } from "@/lib/media/url";

// Dessins récents (synchronisés sur tous les appareils) puis archives (seulement sur le disque de la Pi).
// Les deux dossiers sont fusionnés et triés ensemble par numéro.
const SOURCES = ["Projets/Life_Drawing", "Crafts/Life_Drawing"];

type Entry = { name: string; root: string; isDirectory: boolean; isFile: boolean };

// Contenu de toutes les sources ; une source absente est ignorée.
// Si un même nom existe dans les deux, la première source l'emporte.
function readEntries(): Entry[] {
    const seen = new Set<string>();
    const out: Entry[] = [];
    for (const root of SOURCES) {
        let dirents: fs.Dirent[];
        try {
            dirents = fs.readdirSync(path.join(DISK_ROOT, root), { withFileTypes: true });
        } catch {
            continue;
        }
        for (const e of dirents) {
            if (seen.has(e.name)) continue;
            seen.add(e.name);
            out.push({ name: e.name, root, isDirectory: e.isDirectory(), isFile: e.isFile() });
        }
    }
    return out;
}

function galleryFiles(entry: Entry): string[] {
    const files = fs.readdirSync(path.join(DISK_ROOT, entry.root, entry.name));
    return sortImages(files).map((f) => `${entry.root}/${entry.name}/${f}`);
}

function galleryImages(entry: Entry): string[] {
    return galleryFiles(entry).map((f) => mediaUrl(f));
}

// Dessins posés derrière la couverture dans la pile de l'accueil (versions réduites).
const STACK_DEPTH = 2;
const STACK_WIDTH = 800;

export type HomeItem =
    | { type: "gallery"; slug: string; name: string; cover: string; behind: string[]; count: number }
    | { type: "image"; url: string; name: string };

export type Gallery = {
    slug: string;
    name: string;
    cover: string;
    images: string[];
};

function stripOrderPrefix(name: string): string {
    return name.replace(/^\d+(\.\d+)?\s*[-_ ]*/, "");
}

function stripExtension(name: string): string {
    return name.replace(/\.(png|jpe?g)$/i, "");
}

function getOrderPrefix(name: string): number {
    const m = name.match(/^\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : 0;
}

function sortImages(files: string[]): string[] {
    return files
        .filter((f) => /^Illustration_sans_titre( \d+)?\.png$/i.test(f))
        .sort((a, b) => {
            const numA = a.match(/(\d+)/);
            const numB = b.match(/(\d+)/);
            const nA = numA ? parseInt(numA[1], 10) : -1;
            const nB = numB ? parseInt(numB[1], 10) : -1;
            return nA - nB;
        });
}

export function getHomeItems(): HomeItem[] {
    const entries = readEntries();

    const folders = entries
        .filter((e) => e.isDirectory)
        .map((e) => ({ entry: e, order: getOrderPrefix(e.name), kind: "folder" as const }));

    const standaloneImages = entries
        .filter(
            (e) => e.isFile && /\.(png|jpe?g)$/i.test(e.name) && /^\d+/.test(e.name), // doit commencer par un numéro, comme les dossiers
        )
        .map((e) => ({ entry: e, order: getOrderPrefix(e.name), kind: "image" as const }));

    const combined = [...folders, ...standaloneImages].sort((a, b) => b.order - a.order);

    return combined.map(({ entry, kind }) => {
        if (kind === "folder") {
            const files = galleryFiles(entry);
            return {
                type: "gallery",
                slug: encodeURIComponent(entry.name),
                name: stripOrderPrefix(entry.name),
                cover: mediaUrl(files[0]),
                behind: files.slice(1, 1 + STACK_DEPTH).map((f) => mediaUrl(f, STACK_WIDTH)),
                count: files.length,
            };
        }
        return {
            type: "image",
            url: mediaUrl(`${entry.root}/${entry.name}`),
            name: stripExtension(stripOrderPrefix(entry.name)),
        };
    });
}

export function getGalleryBySlug(slug: string): Gallery | undefined {
    const folder = readEntries().find((e) => e.isDirectory && encodeURIComponent(e.name) === slug);
    if (!folder) return undefined;

    const images = galleryImages(folder);
    return {
        slug,
        name: stripOrderPrefix(folder.name),
        cover: images[0],
        images,
    };
}

export function getLatestLifeDrawingCover(): string | undefined {
    const items = getHomeItems(); // déjà triés décroissant, le plus récent en premier
    const latestGallery = items.find((i) => i.type === "gallery");
    return latestGallery?.type === "gallery" ? latestGallery.cover : undefined;
}
