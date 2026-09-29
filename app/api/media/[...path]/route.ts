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
};

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path: segments } = await params;
    const relativePath = segments.map(decodeURIComponent).join("/");

    const isInAllowedFolder = PUBLIC_FOLDERS.some(
        (folder) => relativePath === folder || relativePath.startsWith(folder + "/")
    );
    const isAllowedFile = PUBLIC_FILES.includes(relativePath);

    if (!isInAllowedFolder && !isAllowedFile) {
        return new NextResponse("Not found", { status: 404 });
    }

    const resolved = path.resolve(DISK_ROOT, relativePath);
    const resolvedRoot = path.resolve(DISK_ROOT) + path.sep;
    if (!resolved.startsWith(resolvedRoot)) {
        return new NextResponse("Not found", { status: 404 });
    }

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
        return new NextResponse("Not found", { status: 404 });
    }
}