import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { createReadStream } from "fs";
import { Readable } from "stream";
import path from "path";
import os from "os";
import { createHash } from "crypto";
import { PUBLIC_FOLDERS, PUBLIC_FILES } from "@/lib/media/publicFolders";
import { DISK_ROOT } from "@/lib/media/config";
import { stlToGlb } from "@/lib/media/stlToGlb";
import { GLB_VERSION } from "@/lib/media/glbVersion";

// Versions réduites (?w=) des images, gardées sur disque pour n'être calculées qu'une fois
const CACHE_DIR = process.env.MEDIA_CACHE_DIR ?? path.join(os.homedir(), "media-cache", "bolzaweb");
// Nom de base d'un fichier en cache : le chemin aplati, ou une empreinte s'il est trop long
// (un nom de fichier ne peut pas dépasser 255 octets)
function cacheBase(relativePath: string): string {
    const flat = relativePath.replace(/[/\\]/g, "_");
    if (Buffer.byteLength(flat) <= 160) return flat;
    return `${createHash("sha1").update(relativePath).digest("hex")}_${path.basename(relativePath).slice(-60)}`;
}

const RESIZABLE = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const MAX_WIDTH = 3200;

// Renvoie le chemin d'une version WebP de l'image, à la largeur demandée (sans l'agrandir).
// Le nom inclut la date de modification : une image remplacée sur le disque produit un nouveau fichier.
async function resizedFile(source: string, relativePath: string, mtimeMs: number, width: number): Promise<string> {
    const name = `${cacheBase(relativePath)}__m${Math.floor(mtimeMs)}__w${width}.webp`;
    const target = path.join(CACHE_DIR, name);
    try {
        await fs.access(target);
        return target;
    } catch {
        // pas encore en cache
    }
    const sharp = (await import("sharp")).default;
    await fs.mkdir(CACHE_DIR, { recursive: true });
    const tmp = `${target}.${process.pid}.tmp`;
    await sharp(source).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(tmp);
    await fs.rename(tmp, target);
    return target;
}

// Version GLB (?as=glb) d'un modèle STL, pour le visualiseur 3D ; gardée sur disque comme les images réduites
async function glbFile(source: string, relativePath: string, mtimeMs: number): Promise<string> {
    const target = path.join(CACHE_DIR, `${cacheBase(relativePath)}__m${Math.floor(mtimeMs)}__${GLB_VERSION}.glb`);
    try {
        await fs.access(target);
        return target;
    } catch {
        // pas encore en cache
    }
    await fs.mkdir(CACHE_DIR, { recursive: true });
    const tmp = `${target}.${process.pid}.tmp`;
    await fs.writeFile(tmp, stlToGlb(await fs.readFile(source)));
    await fs.rename(tmp, target);
    return target;
}

const MIME: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".pdf": "application/pdf",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
    ".glb": "model/gltf-binary",
    ".gltf": "model/gltf+json",
    ".stl": "model/stl",
};

const notFound = () => new NextResponse("Not found", { status: 404 });

function decodeSegment(s: string): string | null {
    try {
        return decodeURIComponent(s);
    } catch {
        return null;
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path: segments } = await params;

    const decoded = segments.map(decodeSegment);
    if (decoded.some((s) => s === null)) return notFound();

    const root = path.resolve(DISK_ROOT);
    const resolved = path.resolve(root, decoded.join("/"));
    if (!resolved.startsWith(root + path.sep)) return notFound();

    // La liste blanche est vérifiée sur le chemin réellement visé,
    // une fois les ".." résolus (et non sur le texte de l'URL).
    const relativePath = path.relative(root, resolved).split(path.sep).join("/");

    const isInAllowedFolder = PUBLIC_FOLDERS.some(
        (folder) => relativePath === folder || relativePath.startsWith(folder + "/"),
    );
    const isAllowedFile = PUBLIC_FILES.includes(relativePath);

    if (!isInAllowedFolder && !isAllowedFile) return notFound();

    let stat;
    try {
        stat = await fs.stat(resolved);
    } catch {
        return notFound();
    }
    if (!stat.isFile()) return notFound();

    const ext = path.extname(resolved).toLowerCase();

    // Modèle STL converti en GLB pour <model-viewer>
    if (ext === ".stl" && req.nextUrl.searchParams.get("as") === "glb") {
        try {
            const file = await glbFile(resolved, relativePath, stat.mtimeMs);
            const fileStat = await fs.stat(file);
            const etag = `W/"${stat.size.toString(16)}-${Math.floor(stat.mtimeMs).toString(16)}-glb${GLB_VERSION}"`;
            const headers = {
                "Content-Type": "model/gltf-binary",
                "Cache-Control": "public, max-age=3600, must-revalidate",
                ETag: etag,
            };
            if (req.headers.get("if-none-match") === etag) return new NextResponse(null, { status: 304, headers });
            const stream = Readable.toWeb(createReadStream(file)) as ReadableStream;
            return new NextResponse(stream, { headers: { ...headers, "Content-Length": String(fileStat.size) } });
        } catch (e) {
            console.error("Conversion STL impossible :", resolved, e);
            return new NextResponse("Conversion impossible", { status: 500 });
        }
    }

    // Image réduite et convertie en WebP : beaucoup plus légère que les PNG d'origine
    const requestedWidth = Number(req.nextUrl.searchParams.get("w"));
    const wantsDownload = req.nextUrl.searchParams.has("download");
    if (!wantsDownload && RESIZABLE.has(ext) && Number.isInteger(requestedWidth) && requestedWidth > 0) {
        const width = Math.min(requestedWidth, MAX_WIDTH);
        try {
            const file = await resizedFile(resolved, relativePath, stat.mtimeMs, width);
            const fileStat = await fs.stat(file);
            const etag = `W/"${stat.size.toString(16)}-${Math.floor(stat.mtimeMs).toString(16)}-w${width}"`;
            const headers = {
                "Content-Type": "image/webp",
                "Cache-Control": "public, max-age=3600, must-revalidate",
                "Last-Modified": new Date(Math.floor(stat.mtimeMs / 1000) * 1000).toUTCString(),
                ETag: etag,
            };
            if (req.headers.get("if-none-match") === etag) return new NextResponse(null, { status: 304, headers });
            const stream = Readable.toWeb(createReadStream(file)) as ReadableStream;
            return new NextResponse(stream, { headers: { ...headers, "Content-Length": String(fileStat.size) } });
        } catch (e) {
            // en cas d'échec de la conversion, on sert l'original
            console.error("Redimensionnement impossible :", resolved, e);
        }
    }
    const lastModified = new Date(Math.floor(stat.mtimeMs / 1000) * 1000);
    const etag = `W/"${stat.size.toString(16)}-${Math.floor(stat.mtimeMs).toString(16)}"`;
    const headers: Record<string, string> = {
        "Content-Type": MIME[ext] ?? "application/octet-stream",
        // Pas d'« immutable » : un fichier remplacé sur le disque sous le même nom
        // doit être revu par les visiteurs (revalidation via ETag / Last-Modified).
        "Cache-Control": "public, max-age=3600, must-revalidate",
        "Last-Modified": lastModified.toUTCString(),
        ETag: etag,
        "Accept-Ranges": "bytes",
    };

    // ?download=<nom> : force le téléchargement (au lieu de l'affichage) sous ce nom de fichier
    const downloadName = req.nextUrl.searchParams.get("download");
    if (downloadName !== null) {
        const name = path.basename(downloadName || resolved).replace(/[\u0000-\u001f"\\]/g, "_");
        const ascii = name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\x20-\x7e]/g, "_");
        headers["Content-Disposition"] =
            `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(name)}`;
    }

    const ifNoneMatch = req.headers.get("if-none-match");
    const ifModifiedSince = req.headers.get("if-modified-since");
    if (
        (ifNoneMatch && ifNoneMatch === etag) ||
        (!ifNoneMatch && ifModifiedSince && new Date(ifModifiedSince) >= lastModified)
    ) {
        return new NextResponse(null, { status: 304, headers });
    }

    // Requêtes partielles (indispensables à la lecture des vidéos sur Safari / iOS)
    const range = req.headers.get("range");
    const match = range?.match(/^bytes=(\d*)-(\d*)$/);
    if (match && (match[1] || match[2])) {
        let start: number;
        let end: number;
        if (match[1]) {
            start = Number(match[1]);
            end = match[2] ? Math.min(Number(match[2]), stat.size - 1) : stat.size - 1;
        } else {
            start = Math.max(stat.size - Number(match[2]), 0);
            end = stat.size - 1;
        }
        if (start > end || start >= stat.size) {
            return new NextResponse(null, {
                status: 416,
                headers: { ...headers, "Content-Range": `bytes */${stat.size}` },
            });
        }
        const stream = Readable.toWeb(createReadStream(resolved, { start, end })) as ReadableStream;
        return new NextResponse(stream, {
            status: 206,
            headers: {
                ...headers,
                "Content-Range": `bytes ${start}-${end}/${stat.size}`,
                "Content-Length": String(end - start + 1),
            },
        });
    }

    const stream = Readable.toWeb(createReadStream(resolved)) as ReadableStream;
    return new NextResponse(stream, {
        headers: { ...headers, "Content-Length": String(stat.size) },
    });
}
