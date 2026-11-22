import fs from "fs";
import path from "path";
import { DISK_ROOT } from "@/lib/media/config";
import { mediaUrl } from "@/lib/media/url";

// Ressources pour créer ses propres puzzles, parcourables dossier par dossier (comme un drive).
// Le dossier est sur le disque de la Pi (hors synchronisation) ; il est public via Crafts/Root_Brain_Teasers.
export const ASSETS_RELATIVE = "Crafts/Root_Brain_Teasers/Assets";
export const ASSETS_ROUTE = "/RootBrainTeasers/assets";

export type AssetCrumb = { name: string; href: string };
export type AssetFolder = { name: string; href: string; count: number };
export type AssetFile = {
    name: string; // nom affiché et nom du fichier téléchargé (extension corrigée si besoin)
    size: number;
    kind: "image" | "pdf" | "other";
    thumb?: string;
    viewUrl: string;
    downloadUrl: string;
};
export type AssetListing = { crumbs: AssetCrumb[]; folders: AssetFolder[]; files: AssetFile[] };

// Fichiers techniques à ne jamais montrer (macOS, conflits Syncthing, sauvegardes)
function isHidden(name: string): boolean {
    return name.startsWith(".") || name.includes(".sync-conflict-") || name.endsWith("~");
}

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);
const KNOWN_EXT = new Set([...IMAGE_EXT, ".pdf", ".svg", ".kra", ".psd", ".zip"]);

// Type réel d'un fichier sans extension connue (ex. « keep » ou « image.dms » qui sont des PNG)
function sniffExtension(file: string): string | null {
    const buf = Buffer.alloc(8);
    let fd: number | undefined;
    try {
        fd = fs.openSync(file, "r");
        fs.readSync(fd, buf, 0, 8, 0);
    } catch {
        return null;
    } finally {
        if (fd !== undefined) fs.closeSync(fd);
    }
    if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return ".png";
    if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return ".jpg";
    if (buf.subarray(0, 4).toString("latin1") === "%PDF") return ".pdf";
    return null;
}

function safeDecode(s: string): string {
    try {
        return decodeURIComponent(s);
    } catch {
        return s;
    }
}

function hrefFor(segments: string[]): string {
    return [ASSETS_ROUTE, ...segments.map(encodeURIComponent)].join("/");
}

function countVisible(dir: string): number {
    try {
        return fs.readdirSync(dir).filter((n) => !isHidden(n)).length;
    } catch {
        return 0;
    }
}

const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

// Contenu d'un sous-dossier des ressources ; undefined si le chemin n'existe pas ou sort du dossier
export function listAssets(rawSegments: string[] = []): AssetListing | undefined {
    const segments = rawSegments.map(safeDecode);
    if (segments.some((s) => !s || isHidden(s) || s === "..")) return undefined;

    const root = path.resolve(DISK_ROOT, ASSETS_RELATIVE);
    const dir = path.resolve(root, ...segments);
    if (dir !== root && !dir.startsWith(root + path.sep)) return undefined;

    let entries: fs.Dirent[];
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
        return undefined;
    }

    const folders: AssetFolder[] = [];
    const files: AssetFile[] = [];
    for (const e of entries) {
        if (isHidden(e.name)) continue;
        const full = path.join(dir, e.name);
        const relative = [ASSETS_RELATIVE, ...segments, e.name].join("/");

        if (e.isDirectory()) {
            folders.push({ name: e.name, href: hrefFor([...segments, e.name]), count: countVisible(full) });
            continue;
        }
        if (!e.isFile()) continue;

        let name = e.name;
        let ext = path.extname(name).toLowerCase();
        if (!KNOWN_EXT.has(ext)) {
            const real = sniffExtension(full);
            if (real) {
                name = (ext ? name.slice(0, -ext.length) : name) + real;
                ext = real;
            }
        }
        const original = path.extname(e.name).toLowerCase();
        const kind = IMAGE_EXT.has(ext) ? "image" : ext === ".pdf" ? "pdf" : "other";
        const size = fs.statSync(full).size;
        // Miniature réduite si le fichier porte une extension d'image ; sinon (PNG sans extension),
        // l'image d'origine si elle est petite
        let thumb: string | undefined;
        if (kind === "image" && IMAGE_EXT.has(original)) thumb = mediaUrl(relative, 160);
        else if (kind === "image" && size < 1024 * 1024) thumb = mediaUrl(relative);
        files.push({
            name,
            size,
            kind,
            thumb,
            viewUrl: mediaUrl(relative),
            downloadUrl: `${mediaUrl(relative)}?download=${encodeURIComponent(name)}`,
        });
    }

    folders.sort((a, b) => collator.compare(a.name, b.name));
    files.sort((a, b) => collator.compare(a.name, b.name));

    const crumbs = segments.map((name, i) => ({ name, href: hrefFor(segments.slice(0, i + 1)) }));
    return { crumbs, folders, files };
}
