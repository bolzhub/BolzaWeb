import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
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

    try {
        const data = await fs.readFile(resolved);
        const ext = path.extname(resolved).toLowerCase();
        return new NextResponse(data, {
            headers: {
                "Content-Type": MIME[ext] ?? "application/octet-stream",
                "Cache-Control": "public, max-age=2592000, immutable",
            },
        });
    } catch {
        return notFound();
    }
}