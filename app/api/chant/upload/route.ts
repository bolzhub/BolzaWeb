import { NextRequest, NextResponse } from "next/server";
import { createWriteStream } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { ReadableStream as NodeWebStream } from "node:stream/web";
import { isAuthenticated } from "@/lib/chant/auth";
import {
  ChantError,
  MAX_FILE_BYTES,
  cleanupStaleUploads,
  sanitizeFileName,
  songPath,
  uniqueFileName,
} from "@/lib/chant/storage";
import { errorResponse, unauthorized } from "@/lib/chant/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_CHUNK_BYTES = 64 * 1024 * 1024;

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return unauthorized();

  try {
    const q = req.nextUrl.searchParams;
    const song = q.get("song") ?? "";
    const name = sanitizeFileName(q.get("name") ?? "");
    const uploadId = q.get("uploadId") ?? "";
    const offset = Number(q.get("offset"));
    const total = Number(q.get("total"));

    if (!name) throw new ChantError("Nom de fichier invalide.");
    if (!/^[A-Za-z0-9_-]{8,64}$/.test(uploadId)) throw new ChantError("Identifiant d'envoi invalide.");
    if (
      !Number.isSafeInteger(offset) ||
      !Number.isSafeInteger(total) ||
      offset < 0 ||
      total <= 0 ||
      offset >= total
    ) {
      throw new ChantError("Paramètres invalides.");
    }
    if (total > MAX_FILE_BYTES) throw new ChantError("Fichier trop volumineux.", 413);
    if (!req.body) throw new ChantError("Corps de requête vide.");

    const dir = songPath(song);
    const dirStat = await fs.stat(dir).catch(() => null);
    if (!dirStat?.isDirectory()) throw new ChantError("Dossier introuvable.", 404);

    const tmp = path.join(dir, `.upload-${uploadId}.part`);

    if (offset === 0) {
      await cleanupStaleUploads(dir);
    } else {
      const tmpStat = await fs.stat(tmp).catch(() => null);
      if (!tmpStat || tmpStat.size !== offset) {
        return NextResponse.json(
          { error: "Reprise nécessaire.", received: tmpStat?.size ?? 0 },
          { status: 409 }
        );
      }
    }

    const maxThisChunk = Math.min(MAX_CHUNK_BYTES, total - offset);
    let received = 0;
    const limiter = new Transform({
      transform(chunk: Buffer, _enc, cb) {
        received += chunk.length;
        if (received > maxThisChunk) cb(new Error("CHUNK_TOO_LARGE"));
        else cb(null, chunk);
      },
    });

    try {
      await pipeline(
        Readable.fromWeb(req.body as unknown as NodeWebStream),
        limiter,
        createWriteStream(tmp, { flags: offset === 0 ? "w" : "a" })
      );
    } catch (err) {
      if (err instanceof Error && err.message === "CHUNK_TOO_LARGE") {
        throw new ChantError("Morceau trop grand.", 413);
      }
      throw new ChantError("Échec de l'écriture du fichier.", 500);
    }

    const written = (await fs.stat(tmp)).size;
    if (written > total) {
      await fs.rm(tmp, { force: true });
      throw new ChantError("Taille incohérente.");
    }
    if (written < total) {
      return NextResponse.json({ done: false, received: written });
    }

    const finalName = await uniqueFileName(dir, name);
    await fs.rename(tmp, path.join(dir, finalName));
    return NextResponse.json({ done: true, name: finalName });
  } catch (err) {
    return errorResponse(err);
  }
}