import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { DISK_ROOT } from "@/lib/media/config";
import { getFactionBySlug } from "@/lib/BolzaBoxes/factions";
import { PROJECT_ROOT } from "@/lib/BolzaBoxes/media";
import {
    MESH_VIEW,
    PLACEHOLDER_MESH_SIGNATURE,
    assetRelativePath,
    type Glass,
    type ObjectType,
} from "@/lib/BolzaBoxes/types";

// Meshs réellement téléchargeables d'une boîte : présents sur le disque et qui ne sont pas des placeholders.
// GET /api/bolzaboxes/meshes?faction=cats&version=french → { available: [{ object, glass }] }
const GLASSES: Glass[] = ["glass", "no-glass"];
const DOWNLOADABLE: ObjectType[] = ["drawer", "container", "holder"];
const HEADER_BYTES = 4096; // l'en-tête JSON d'un .glb est au début du fichier

async function isRealMesh(file: string): Promise<boolean> {
    // Un STL vient du dossier Models/ : c'est toujours un vrai modèle
    if (file.toLowerCase().endsWith(".stl"))
        return fs.stat(file).then(
            (s) => s.isFile(),
            () => false,
        );
    let handle;
    try {
        handle = await fs.open(file, "r");
        const buffer = Buffer.alloc(HEADER_BYTES);
        const { bytesRead } = await handle.read(buffer, 0, HEADER_BYTES, 0);
        return bytesRead > 0 && !buffer.subarray(0, bytesRead).toString("latin1").includes(PLACEHOLDER_MESH_SIGNATURE);
    } catch {
        return false; // fichier absent
    } finally {
        await handle?.close();
    }
}

export async function GET(req: NextRequest) {
    const faction = getFactionBySlug(req.nextUrl.searchParams.get("faction") ?? "");
    const version = req.nextUrl.searchParams.get("version");
    if (!faction || (version !== "international" && version !== "french")) {
        return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
    }

    const candidates = faction.objects
        .filter((o) => DOWNLOADABLE.includes(o))
        .flatMap((object) => GLASSES.map((glass) => ({ object, glass })));

    const checks = await Promise.all(
        candidates.map(
            async (c) =>
                (await isRealMesh(
                    path.join(
                        DISK_ROOT,
                        PROJECT_ROOT,
                        assetRelativePath(faction.slug, version, c.object, MESH_VIEW, c.glass),
                    ),
                )) && c,
        ),
    );

    return NextResponse.json(
        { available: checks.filter(Boolean) },
        // un mesh déposé sur le disque doit apparaître rapidement
        { headers: { "Cache-Control": "public, max-age=60" } },
    );
}
