import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { createReadStream } from "fs";
import { Readable } from "stream";
import path from "path";
import { PUBLIC_FOLDERS, PUBLIC_FILES } from "@/lib/media/publicFolders";

const DISK_ROOT = "/mnt/Bolzananas";

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
};

const notFound = () => new NextResponse("Not found", { status: 404 });

function decodeSegment(s: string): string | null {
    try {
        return decodeURIComponent(s);
    } catch {
        return null;
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
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
        (folder) => relativePath === folder || relativePath.startsWith(folder + "/")
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
